export default {
	name: ["ai", "you", "bing", "gemini"],
	command: ["ai", "you", "bing", "gemini"],
	tags: ["ai"],
	use: "Yes can I help you?",
	run: async (m, { conn, command }) => {
		try {
			let response 
			switch (command) {
				case "you": 
				  response = await Func.axios.get(global.API("arifzyn", "/ai/you", { query: m.text }, "apikey"))
				  break;
				case "bard": 
				  response = await Func.axios.post(global.API("arifzyn", "/ai/bard", {}, "apikey"), {
				  	text: m.text
				  })
				  break; 
				case "bing": 
				  response = await Func.axios.get(global.API("arifzyn", "/ai/bing", { text: m.text }, "apikey"))
				  break
				case "gemini":
				  response = await Func.axios.get(global.API("arifzyn", "/ai/gemini", { text: m.text }, "apikey"))
				  break;
				  default: 
			}
			response = response.data
			if (response.status !== 200) return m.reply(Func.format(response))
			await m.reply(response.result)
		} catch (e) {
			console.error(e)
			await m.reply(config.msg.error) 
		}
	}
};