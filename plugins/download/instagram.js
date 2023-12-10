export default {
  name: "instagram",
  command: ["instagram", "igdl"],
  tags: ["download"],
  run: async (m, { conn }) => {  
    if (!m.text) return m.reply(config.msg.noUrl);
    if (!(m.text.includes("http://") || m.text.includes("https://")))
      return m.reply(
        `url invalid, please input a valid url. Try with add http:// or https://`,
      );
    if (!m.text.includes("instagram.com"))
      return m.reply(`Invalid Instagram URL.`);
    m.reply(config.msg.wait);
    let txt = "_Downloader igtv, post, video, reel, etc_";
    try {
      let res = await Func.fetchJson(global.API("arifzyn", "/download/instagram", { url: m.text }, "apikey"))
      if (res.length == 0) throw Error("No media.");
      for (let x of res.medias) {
        await m.reply(x.src, { caption: txt });
        await delay(1000);
      }
    } catch (e) {
      console.log(e);
    }
  },
};
