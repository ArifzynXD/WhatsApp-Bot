export default {
  name: "daily",
  command: ["daily", "claim"],
  tags: ["rpg"],
  desc: "Claim Daily, Check in",
  run: async (m, { conn}) => {
    let user = global.db.users[m.sender];
    let _timers = 86400000 - (new Date() - user.lastclaim);
    let timers = await Func.clockString(_timers);
    if (new Date() - user.lastclaim > 86400000) {
      let dailyText = `*乂 D A I L Y  -  C L A I M*

+ Rp 1.000.000 balance 💵
+ 1 Wood 🪵
+ 2 Rock 🪨 
+ 1 Potion 🥤
+ 2 Common crate 📦
+ 1 Sword ⚔️
+ 2 Pet Food 🍖
+ 5 String 🕸️
+ 1 Pet Crate 🪤
`;
      m.reply(dailyText);
      user.balance += 2500 * 2000;
      user.potion += 1 * 1;
      user.wood += 1 * 1;
      user.rock += 2 * 1;
      user.common += 2 * 1;
      user.sword += 1 * 1;
      user.petFood += 2 * 1;
      user.pet += 1 * 1;
      user.string += 5 * 1;
      user.lastclaim = new Date() * 1;
    } else
      m.reply(
        `🚩 Kamu sudah melakukan claim hari ini, silahkan menunggu sampai besok untuk melakukan claim lagi.\n\nTimeout : [ *${timers}* ]`,
      );
  },
};
