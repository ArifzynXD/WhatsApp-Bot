export default {
  name: "group",
  command: ["group", "grup"],
  tags: ["group"],
  run: async (m, { conn, prefix, command }) => {
  	let isClose = { 
		'open': 'not_announcement',
		'close': 'announcement',
	  }[(m.args[0] || '')]
	  if (isClose === undefined) return m.reply(`
*Usage Examples :*
  *○ ${prefix + command} close*
  *○ ${prefix + command} open*
`.trim())
	await conn.groupSettingUpdate(m.from, isClose)
  },
  admin: true,
  group: true,
  botAdmin: true,
}; 
