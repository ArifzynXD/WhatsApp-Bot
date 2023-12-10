export default {
  name: "listgroup",
  command: ["listgroup", "listgc"],
  tags: ["group"],
  run: async (m, { conn }) => {
    const gc = await conn.groupFetchAllParticipating();
    const groups = Object.values(await conn.groupFetchAllParticipating()).map(
      (v) => v.id,
    ); 
    let txt = `*LIST GROUP : ${groups.length}*`;
    for (let x of groups) {
      txt += `\n\n • *Group :* ${gc[x].subject}\n`;
      txt += ` • *id :* ${gc[x].id}\n`;
      txt += ` • *Members :* ${gc[x].participants.length}\n`;
      txt += ` • *Created :* ${new Date(
        gc[x].creation * 1000, 
      ).toDateString()}\n`;
      txt += ` • *Total Admin :* ${
        gc[x].participants.filter((v) => v.admin == "admin").length
      }\n`;
      txt += ` • *isBotAdmin :* ${
        gc[x].participants.filter(
          (v) => v.id == conn.user.jid && v.admin == "admin",
        ).length == 0
          ? "No"
          : "Yes"
      }\n`;
      txt += ` • *Ephemeral :* ${
        gc[x].ephemeralDuration
          ? `${gc[x].ephemeralDuration / 86400} Day(s)`
          : "Off"
      }\n`;
      txt += ` • *Edit Group Info :* ${
        gc[x].restrict ? "Only Admins" : "All Participants"
      }\n`;
      txt += ` • *Send Messages :* ${
        gc[x].announce ? "Only Admins" : "All Participants"
      }`;
    }
    m.reply(txt);
  },
};
