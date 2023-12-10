export default {
  name: "hidetag",
  command: ["hidetag", "ht"],
  tags: ["group"],
  run: async (m, { conn }) => {
    let text = m.text;
    text = m.text
      ? m.text
      : m.quoted?.text
      ? m.quoted.text
      : m.quoted?.caption
      ? m.quoted.caption
      : m.quoted?.description
      ? m.quoted.description
      : "";
    m.reply(text, { mentions: m.metadata.participants.map((a) => a.id) });
  },
  admin: true,
  group: true, 
};
 