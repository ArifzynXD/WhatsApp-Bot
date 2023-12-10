export default {
  name: "tagall",
  command: ["tagall"],
  tags: ["group"],
  run: async (m, { conn }) => {
    let text = m.text;
    let teks = `⋙ *Pesan dari Admin Group* ⋘ \n\n${
      text
        ? text
        : m.quoted?.text
        ? m.quoted.text
        : m.quoted?.caption
        ? m.quoted.caption
        : m.quoted?.description
        ? m.quoted.description
        : "Nothing"
    }\n\n`;
    teks += `┌─\n`;
    for (let mem of m.metadata.participants) {
      teks += `│◦❒ @${mem.id.split("@")[0]}\n`;
    }
    teks += `└────`;
    m.reply(teks, { mentions: m.metadata.participants.map((a) => a.id) });
  },
  admin: true,
  group: true,
};
