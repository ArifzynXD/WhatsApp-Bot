export default {
  name: "hourly",
  command: ["hourly"],
  tags: ["rpg"],
  run: async (m, { conn }) => {
    const user = global.db.users[m.sender]
    var _timers = (3600000 - (new Date - user.lasthourly))
    var timers = Func.clockString(_timers)
    if (new Date - user.lasthourly > 3600000) {
      m.reply(`*乂 H O U R L Y  -  C L A I M*

+ Rp 500 Balance 💵
+ 1 Wood 🪵
+ 2 Potion 🥤
+ 5 Rock 🪨
+ 10 String 🕸️
+ 1 Common Crate 📦
`)
      user.balance += 500 * 1
      user.wood += 1 * 1
      user.potion += 2 * 1
      user.rock += 1 * 5
      user.string += 2 * 5
      user.common += 1 * 1
      user.lasthourly = new Date * 1
    } else {
      m.reply(`🚩 Kamu sudah melakukan hourly, silahkan menunggu satu jam kemudian untuk melakukan hourly lagi.\n\nTimeout : [ *${timers}* ]`)
    }
  }
};