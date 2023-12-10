//process.on('uncaughtException', console.error)

import Collection from './lib/collection.js';
import { Message, readCommands } from './handler/message.js';
import { Client, serialize } from './lib/serialize.js';
import Function from './lib/function.js';
import config from '../config.js';

import baileys from '@whiskeysockets/baileys';
const {
  useMultiFileAuthState,
  makeInMemoryStore,
  PHONENUMBER_MCC,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = baileys

import pino from 'pino';
import chalk from 'chalk';
import readline from 'readline';
import NodeCache from 'node-cache';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import syntaxerror from 'syntax-error';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const msgRetryCounterCache = new NodeCache();
const pairingCode = process.argv.includes("--pairing");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

global.plugins = new Collection();

const connectToWhatsApp = async () => { 
	await readCommands()
	
	const { state, saveCreds } = await useMultiFileAuthState("system/temp/session");
	const conn = baileys.default({
    printQRInTerminal: !pairingCode,
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
    browser: ["Chrome (Linux)", "", ""],
    markOnlineOnConnect: true, 
    generateHighQualityLinkPreview: true, 
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid);
      let msg = await store.loadMessage(jid, key.id);

      return msg?.message || "";
    },
    msgRetryCounterCache,
    defaultQueryTimeoutMs: 0, 
  });
  
  if (pairingCode && !conn.authState.creds.registered) {
    console.log(` ${chalk.redBright("Please type your WhatsApp number")}:`);
    let phoneNumber = await question(`   ${chalk.cyan("- Number")}: `);
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (!Object.keys(PHONENUMBER_MCC).some((v) => phoneNumber.startsWith(v))) {
      console.log(` ${chalk.redBright("Start with your country's WhatsApp code, Example 62xxx")}:`);
      console.log(` ${chalk.redBright("Please type your WhatsApp number")}:`);
      phoneNumber = await question(`   ${chalk.cyan("- Number")}: `);
      phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    }
    let code = await conn.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(`  ${chalk.redBright("Your Pairing Code")}:`);
    console.log(`   ${chalk.cyan("- Code")}: ${code}`);
    rl.close();
  }

  store.bind(conn.ev);
 
  await Client({ conn, store })
   
  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    try {
      if (connection === "close") {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (reason === DisconnectReason.badSession) {
          console.log(`Bad Session File, Please Delete Session and Scan Again`);
          connectToWhatsApp();
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log("Connection closed, reconnecting....");
          connectToWhatsApp();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("Connection Lost from Server, reconnecting...");
          connectToWhatsApp();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
          connectToWhatsApp();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(`Device Logged Out, Please Scan Again And Run.`);
          connectToWhatsApp();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("Restart Required, Restarting...");
          connectToWhatsApp();
        } else if (reason === DisconnectReason.timedOut) {
          console.log("Connection TimedOut, Reconnecting...");
          connectToWhatsApp();
        } else conn.end(`Unknown DisconnectReason: ${reason}|${connection}`);
      }
      if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
        console.log(`[Sedang mengkoneksikan]`);
      }
      if (update.connection == "open" || update.receivedPendingNotifications == "true") {
        console.log(`[Connecting to] WhatsApp web`);
        console.log(`[Connected] ` + JSON.stringify(conn.user, null, 2));
      }
    } catch (err) {
      console.log("Error Di Connection.update " + err);
      connectToWhatsApp();
    }
  })
  
  conn.ev.on("creds.update", saveCreds);
  
  conn.ev.on("messages.upsert", async (message) => {
    if (!message.messages) return;
    try {
    	const m = await serialize(conn, message.messages[0]);
    	await Message(conn, m, store); 
    } catch (e) {
    	console.error(e)
    }
  });
  
  return conn; 
}

connectToWhatsApp()

const watchPlugins = (folderPath) => {
  fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
    if (eventType === 'change') {
      reloadPlugin(folderPath, filename);
    }
  });
};

const reloadPlugin = async (folderPath, filename) => {
  const filePath = path.join(folderPath, filename);

  const pluginFilter = (filename) => /\.js$/.test(filename);
  if (pluginFilter(filename)) {
    if (filePath in require.cache) {
      delete require.cache[require.resolve("../" + filePath)];
      console.log(`Reloaded plugin '${filePath}'`);
    } else {
      console.log(`Loaded new plugin '${filePath}'`);
    }

    let err = syntaxerror(fs.readFileSync(filePath), filename, {
    	allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
        sourceType: "module",
    });
    if (err) {
      console.error(`Syntax error while loading '${filename}'\n${err}`);
    } else {
      const module = await import(`../${filePath}?update=${Date.now()}`);
      plugins.set(filePath, module);
    }
  }
};

watchPlugins("plugins");