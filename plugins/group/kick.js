export default {
	name: "kick",
	command: ["kick", "tendang"],
	tags: "group",
	run: async (m, { conn }) => {
		try {
		let who = m.quoted ? m.quoted.sender : m.mentions && m.mentions[0] ? m.mentions[0] : m.text ? (m.text.replace(/\D/g, '') + '@s.whatsapp.net') : ''
		if (!who || who == m.sender) return m.reply('*Quote / tag* target yang ingin di kick!!')
		if (m.metadata.participants.filter(v => v.id == who).length == 0) return m.reply(`Target tidak berada dalam Grup !`)
		await conn.groupParticipantsUpdate(m.from, [who], 'remove')
		} catch (e) {
			console.log(e)
			m.reply(config.msg.error)
		}
	}
}