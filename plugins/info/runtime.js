export default {
  name: "runtime",
  command: ["runtime"],
  tags: ["info"],
  run: async (m) => {
    m.reply(await Func.runtime(process.uptime()));
  },
};  
 