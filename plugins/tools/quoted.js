export default {
  command: ["q", "quoted"],
  help: ["quoted"],
  tags: ["tools"],
  run: async (m, { conn, quoted }) => {
    const { serialize } = (await import("../../system/lib/serialize.js"))
    if (!m.isQuoted) m.reply("no quoted")
    try {
      const message = await serialize(conn, (await conn.loadMessage(m.from, m.quoted.id)))
      conn.sendMessage(m.from, { forward: message.quoted, viewOnce: false })
    } catch {
      m.reply("Quoted Not Found")
    }
  }
}