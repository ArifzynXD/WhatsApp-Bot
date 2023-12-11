export default {
	name: ["ytmp4", "ytmp3"],
	command: ["ytmp4", "ytmp3"],
	tags: ["download"],
	run: async (m, { conn, command, prefix }) => {
		if (!m.args[0]) return m.reply(`*Example :* ${prefix+command} <url>`)
		if (!(m.args[0] || '').match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))) return m.reply(`Invalid Youtube URL.`)
		try { 
		    if (command == "ytmp3") {
		    	const response = "https://api.arifzyn.biz.id/youtube/mp3?url=" + m.args[0]
		    	conn.sendMedia(m.from, response, m)
		    } else {
		    	const response = "https://api.arifzyn.biz.id/youtube/mp4?url=" + m.args[0]
		    	conn.sendFile(m.from, response, '', '', m)
		    }
		} catch (e) {
			console.error(e)
			m.reply(config.msg.error)
		}
	}
}