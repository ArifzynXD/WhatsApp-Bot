export default {
	name: ["ai"],
	command: ["ai", "openai"],
	tags: ["ai"],
	use: "Yes can I help you?",
	run: async (m, { conn }) => {
		try {
			const res = await Func.fetchJson(
			  API("arifzyn", "/ai/chatGPT3", { text: m.text }, "apikey")
			)
			m.reply(res.result)
		} catch (e) {
			console.error(e)
			m.reply(config.msg.error) 
		}
	}
};