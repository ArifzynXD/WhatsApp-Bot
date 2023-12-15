import Collection from "../../system/lib/collection.js";
import { Message, readCommands } from "../../system/handler/message.js";
import { Client, serialize } from "../../system/lib/serialize.js";
import Function from "../../system/lib/function.js";

import baileys from "@whiskeysockets/baileys";
const {
  default: makeWaSocket,
  useMultiFileAuthState,
  makeInMemoryStore,
  PHONENUMBER_MCC,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = baileys;
import pino from "pino";
import chalk from "chalk";
import readline from "readline";
import NodeCache from "node-cache";
import path from "path";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode";

const msgRetryCounterCache = new NodeCache();
const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

export default {
  name: "jadibot",
  command: ["jadibot"],
  run: async (m) => {
    const start = async () => {
      if (m.fromMe) return m.reply("Tidak Bisa...")	
      const { state, saveCreds } = await useMultiFileAuthState(
        "system/temp/jadibot/" + m.sender.split("@")[0],
      );

      const conn = baileys.default({
        printQRInTerminal: false,
        logger: pino({
          level: "silent",
        }),
        browser: ["Chrome (Linux)", "", ""],
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({ level: "fatal" }).child({ level: "fatal" }),
          ),
        },
        browser: ["Chrome (Linux)", "", ""], // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
        markOnlineOnconnect: true, // set false for offline
        generateHighQualityLinkPreview: true, // make high preview link
        getMessage: async (key) => {
          let jid = jidNormalizedUser(key.remoteJid);
          let msg = await store.loadMessage(jid, key.id);

          return msg?.message || "";
        },
        msgRetryCounterCache, // Resolve waiting messages
        defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
      });

      const teksJadiBot = `*Pindai kode QR ini untuk menjadi Bot (SubBot), Anda dapat menggunakan perangkat lain untuk memindai*

*Langkah-langkah untuk memindai:*
*1.- Ketuk tiga titik di sudut kanan atas di beranda WhatsApp Anda*
*2.- Ketuk WhatsApp web atau perangkat yang sudah terhubung*
*3.- Pindai kode QR ini*
*Kode QR berlaku selama 60 detik!!*


*Anda dapat mengirimkan ID yang diberikan ke bot secara pribadi untuk menghubungkan kembali bot tanpa harus memindai kode lagi, kode ini dimulai dengan /serbot.*
*Ingatlah untuk keluar dari grup ketika Anda menjadi bot*

Proses ini 100% Aman.`;

      store.bind(conn.ev); 

      await Client({ conn, store });

      if (!conn.authState.creds.registered) {
        let phoneNumber = m.sender.split("@")[0].replace(/[^0-9]/g, "");

        if (
          !Object.keys(PHONENUMBER_MCC).some((v) => phoneNumber.startsWith(v))
        )
          throw "Start with your country's WhatsApp code, Example : 62xxx";

        await Func.delay(3000);
        let code = await conn.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        m.reply("*Your Code :* " + code);
      }

      conn.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
          m.reply(await qrcode.toBuffer(qr, { scale: 8 }), {
            caption: teksJadiBot,
          });
        }
        try {
          if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.badSession) {
              console.log(
                `Bad Session File, Please Delete Session and Scan Again`,
              );
              start();
            } else if (reason === DisconnectReason.connectionClosed) {
              console.log("Connection closed, reconnecting....");
              start();
            } else if (reason === DisconnectReason.connectionLost) {
              console.log("Connection Lost from Server, reconnecting...");
              start();
            } else if (reason === DisconnectReason.connectionReplaced) {
              console.log(
                "Connection Replaced, Another New Session Opened, Please Close Current Session First",
              );
              start();
            } else if (reason === DisconnectReason.loggedOut) {
              console.log(`Device Logged Out, Please Scan Again And Run.`);
              start();
            } else if (reason === DisconnectReason.restartRequired) {
              console.log("Restart Required, Restarting...");
              start();
            } else if (reason === DisconnectReason.timedOut) {
              console.log("Connection TimedOut, Reconnecting...");
              start();
            } else
              conn.end(`Unknown DisconnectReason: ${reason}|${connection}`);
          }
          if (
            update.connection == "connecting" ||
            update.receivedPendingNotifications == "false"
          ) {
            console.log(`[Sedang mengkoneksikan]`);
          }
          if (
            update.connection == "open" ||
            update.receivedPendingNotifications == "true"
          ) {
            console.log(`[Connecting to] WhatsApp web`);
            m.reply(`[Connected] \n\n` + JSON.stringify(conn.user, null, 2));
          }
        } catch (err) {
          console.log("Error Di Connection.update " + err);
          start();
        }
      });

      conn.ev.on("creds.update", saveCreds);

      conn.ev.on("messages.upsert", async (message) => {
        if (!message.messages) return;
        const m = await await serialize(conn, message.messages[0]);
        await await Message(conn, m);
      });

      return conn;
    };

    start();
  },
  owner: true 
};
