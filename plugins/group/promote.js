export default {
  name: "promote",
  command: ["promote"],
  tags: ["group"],
  run: async (m, { conn }) => {
    let who = m.quoted ? m.quoted.sender : m.mentions ? m.mentions[0] : "";
    if (!who) return m.reply("*quote / @tag* one of");
    try {
      await conn.groupParticipantsUpdate(m.from, [who], "promote");
      m.reply(`*Success* promote @${who.split("@")[0]} from group`, { mentions: [who] })
    } catch (e) {
      console.log(e); 
    }  
  },
  group: true, 
  botAdmin: true,
  admin: true,
}; 