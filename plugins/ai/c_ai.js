export default {
  name: ["mahiru", "nino"],
  command: ["mahiru", "nino"],
  tags: ["ai"],
  use: "Yes, what is up?",
  run: async (m, { command }) => {
    try {
      let response;
      switch (command) {
        case "mahiru":
          response = await Func.fetchJson(
            global.API("arifzyn", "/ai/cai/chat",
              {
                character_id: "OFj9jql7NKi0e57oJzzf1W18zth5d-pHxk1fjAjZnho",
                message: m.text,
              },
              "apikey",
            ),
          );
          break;
        case "nino":
          response = await Func.axios.post(
            global.API("arifzyn", "/ai/cai/chat", {}, "apikey"), {
            	character_id: "Sj1nGHZepLRf96j_ilFOstKPDrF27UtC0ke8IZH88NU",
            	chatId: "v99xxdm93R73PYDp5HTb7QXmO-wT3JMXqbBU5Hw_fl4", 
                message: m.text,
            });
          break;
        default:
      }
      response = response.data
      if (response.status !== 200) return m.reply(Func.format(response))
      m.reply(response.result);
    } catch (e) {
      console.error(e);
      m.reply(config.msg.error);
    }
  },
  owner: true,
};
