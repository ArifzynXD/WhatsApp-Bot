export default {
  name: "monthly",
  command: ["monthly"],
  tags: ["rpg"],
  run: async (m, { conn }) => {
    const user = global.db.users[m.sender]
    var _timers = (2592000000 - (new Date - user.lastmonthly))
    var timers = Func.clockString(_timers)
    if (new Date - user.lastmonthly > 2592000000) {
      m.reply(`*乂 M O N T H L Y  -  C L A I M*

+ Rp 100.000.000 Balance 💵
+ 50 Wood 🪵
+ 10 Potion 🥤
+ 15 Rock 🪨
+ 7 Emerald ♨️
+ 20 String 🕸️
+ 1 Legendary Crate 🎁
+ 5 Diamond 💎
+ 3 Pet Crate 🪤
`)
      user.balance += 100000000 * 1
      user.wood += 25 * 2
      user.potion += 5 * 2
      user.rock += 3 * 5
      user.emerald += 7 * 1
      user.string += 4 * 5
      user.diamond += 5 * 1
      user.legendary += 1 * 1
      user.diamond += 5 * 1
      user.pet += 3 * 1
      user.lastmonthly = new Date * 1
    } else {
      m.reply(`🚩 Kamu sudah melakukan monthly bulan ini, silahkan menunggu sampai bulan depan untuk melakukan monthy lagi.\n\nTimeout : [ *${timers}* ]`,)
    }
  }
};