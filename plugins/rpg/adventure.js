const cooldown = 900000

export default {
  name: "adventure",
  command: ['adventure', 'petualang', 'berpetualang', 'mulung'],
  tags: ["rpg"],
  run: async (m, { prefix, command }) => {
    let user = global.db.users[m.sender]
    let timers = (cooldown - (new Date - user.lastadventure))
    if (user.health < 80) return m.reply(`Butuh minimal *❤️ 80 Health* untuk ${command}!!\n\nKetik *${prefix}heal* untuk menambah health.\nAtau *${prefix}use potion* untuk menggunakan potion.`)
    if (new Date - user.lastadventure <= cooldown) return m.reply(`Kamu sudah berpetualang, mohon tunggu\n*🕐${Func.clockString(timers)}*`)

    user.adventurecount += 1

    const health = Func.ranNumb(3, 6)
    const balance = Func.ranNumb(1000, 3000)
    const exp = Func.ranNumb(500, 1000)
    const trash = Func.ranNumb(10, 50)
    const rock = Func.ranNumb(1, 4)
    const wood = Func.ranNumb(1, 4)
    const string = Func.ranNumb(1, 3)
    const common = Func.ranNumb(1, 2)
    const gold = 1
    const emerald = 1
    const diamond = 1

    user.health -= health
    user.balance += balance
    user.exp += exp
    user.trash += trash
    user.rock += rock
    user.wood += wood
    user.string += string
    if (user.adventurecount % 25 == 0) user.common += common
    if (user.adventurecount % 50 == 0) user.gold += gold
    if (user.adventurecount % 150 == 0) user.emerald += emerald
    if (user.adventurecount % 400 == 0) user.diamond += diamond

    let txt = `[ *Selesai ${command}* ]\n\n`
    txt += `*❤️ health : -${health}*\nAnda membawa pulang :\n`
    txt += `*💵 balance :* ${balance}\n`
    txt += `*✉️ exp :* ${exp}\n`
    txt += `*🗑 trash :* ${trash}\n`
    txt += `*🪨 rock :* ${rock}\n`
    txt += `*🪵 wood :* ${wood}\n`
    txt += `*🕸️ string :* ${string}`
    if (user.adventurecount % 25 == 0) txt += `\n\nBonus adventure ${user.adventurecount} kali\n*📦 common :* ${common}`
    if (user.adventurecount % 50 == 0) txt += `\n\nBonus adventure ${user.adventurecount} kali\n*👑 gold :* ${gold}`
    if (user.adventurecount % 150 == 0) txt += `\n\nBonus adventure ${user.adventurecount} kali\n*💚 emerald :* ${emerald}`
    if (user.adventurecount % 400 == 0) txt += `\n\nBonus adventure ${user.adventurecount} kali\n*💎 diamond :* ${diamond}`
    m.reply(txt)
    user.lastadventure = new Date * 1
  }
};