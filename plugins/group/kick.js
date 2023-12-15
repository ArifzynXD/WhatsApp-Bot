export default {
	name: "kick",
	command: ["kick", "tendang"], 
	tags: "group",
	run: async (m, { conn }) => {
		try {
		let who = m.quoted ? m.quoted.sender : m.mentions && m.mentions[0] ? m.mentions[0] : m.text ? (m.text.replace(/\D/g, '') + '@s.whatsapp.net') : ''
		if (!who || who == m.sender) return m.reply('*Quote / tag* the target you want to kick!!')
		if (m.metadata.participants.filter(v => v.id == who).length == 0) return m.reply(`Target tidak berada dalam Grup !`)
		const data = await conn.groupParticipantsUpdate(m.from, [who], 'remove')
		m.reply(Func.format(data))
		} catch (e) {
			console.log(e)
			m.reply(config.msg.error)
		}
	}
}