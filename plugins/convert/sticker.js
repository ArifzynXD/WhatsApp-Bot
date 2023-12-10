export default {
	name: "sticker", 
	command: ["s", "stiker", "sticker"],
	tags: ["convert"],
	run: async (m, { conn }) => {
		const quoted = m.quoted ? m.quoted : m
		if (/image|video|webp/i.test(quoted.mime)) {
			const buffer = await quoted.download()
			if (m.text == "avatar") config.Exif.isAvatar = 1
			else config.Exif.isAvatar = 0 
			if (quoted?.msg?.seconds > 10) return m.reply(`Max video 9 second`)
			let exif = { ...config.Exif }
			m.reply(buffer, { asSticker: true, ...exif })
		} else if (m.mentions[0]) {
			let url = await conn.profilePictureUrl(m.mentions[0], "image");
			m.reply(url, { asSticker: true, ...config.Exif })
		} else if (/(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(m.text)) {
			m.reply(config.func.isUrl(m.text)[0], { asSticker: true, ...config.Exif })
		} else {
			m.reply(`Send or reply to media`) 
		}
	}
};