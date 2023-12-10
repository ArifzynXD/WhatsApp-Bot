import fetch from 'node-fetch';
import { format } from 'util';

export default {
  name: "fetch",
  command: ["get", "fetch"],
  tags: ["info"],
  run: async (m, { conn }) => {
    if (!/^https?:\/\//.test(m.text))
      return m.reply(
        "url invalid, please input a valid url. Try with add http:// or https://",
      );
    let { href: url, origin } = new URL(m.text);
    let res = await fetch(url, { headers: { referer: origin } });
    if (res.headers.get("content-length") > 100 * 1024 * 1024 * 1024)
      throw `Content-Length: ${res.headers.get("content-length")}`;
    if (!/text|json/.test(res.headers.get("content-type")))
      return conn.sendMedia(m.from, url, m);
    let txt = await res.buffer();
    try {
      txt = format(JSON.parse(txt + ""));
    } catch {
      txt = txt + "";
    }
    m.reply(txt.trim().slice(0, 65536) + "");
  },
};
