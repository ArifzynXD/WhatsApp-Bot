export default {
  name: "weekly",
  command: ["weekly"],
  tags: ["rpg"],
  run: async (m, { conn }) => {
    const user = global.db.users[m.sender]	
    const _timers = (604800000 - (new Date - user.lastweekly))
    const timers = Func.clockString(_timers)
    if (new Date - user.lastweekly > 604800000) {
      m.reply(`*乂 W E E K L Y  -  C L A I M*

+ Rp 10.000.000 Balance 💵
+ 1 Armor 🥋
+ 2 Dog 🐶
+ 1 Fox 🦊
+ 2 Uncommon crate 📦
+ 1 Diamond 💎
+ 5 Pet Food 🍖
+ 10 String 🕸️ 
+ 2 Pet Crate 🪤
`)
      user.balance += 10000000 * 1 
      user.armor += 1 * 1
      user.dog += 2 * 1
      user.fox += 1 * 1
      user.uncommon += 2 * 1
      user.diamond += 1 * 1
      user.petFood += 5 * 1
      user.pet += 2 * 1
      user.string += 5 * 2
      user.lastweekly = new Date * 1
    } else {
      m.reply(`🚩 Kamu sudah melakukan weekly minggu ini, silahkan menunggu sampai minggu depan untuk melakukan claim lagi.\n\nTimeout : [ *${timers}* ]`)
    }
  }
};