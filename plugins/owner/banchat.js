export default {
	name: "banchat",
	command: ["banchat", "unbanchat"],
	tags: ["owner"],
	run: async (m, { conn, command }) => {
		if (command == "banchat") {
			m.reply("*Success* Banned Chat")
			global.db.chats[m.from].banned = true
		} else {
			m.reply("*Success* Unban Chat")
			global.db.chats[m.from].banned = false
		} 
	},
	owner: true 
}