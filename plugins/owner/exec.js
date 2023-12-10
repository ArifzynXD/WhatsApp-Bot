import cp from 'child_process';
const { exec: _exec } = cp;
import { promisify } from 'util';

const exec = promisify(_exec).bind(cp);

export default {
  name: "$",
  command: ["$"],
  tags: ["owner"],
  run: async (m, { conn, command }) => {
    if (!m.isOwner) return;
    let o;
    try {
      o = await exec(m.text.trimEnd());
    } catch (e) {
      o = e;
    } finally {
      const { stdout, stderr } = o;
      if (stdout.trim()) conn.sendMessage(m.from, { text: stdout }, { quoted: m });
      if (stderr.trim()) conn.sendMessage(m.from, { text: stderr }, { quoted: m });
    }
  },
  noPrefix: true,
};