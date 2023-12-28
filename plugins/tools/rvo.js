export default {
  command: ["rvo"],
  help: ["rvo"],
  tags: ["tools"],
  run: async (m, { conn, quoted }) => {
    if (!quoted.msg.viewOnce) return m.reply(`Reply view once with command ${prefix + command}`)
    quoted.msg.viewOnce = false
    await conn.sendMessage(m.from, { forward: quoted }, { quoted: m })
  }
}