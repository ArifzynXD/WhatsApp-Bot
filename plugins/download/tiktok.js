export default {
  name: "tiktok",
  command: ["tiktok", "tt"],
  tags: ["download"],
  run: async (m, { conn }) => {
    const isPremium = db.users[m.sender].premium;
    if (!m.text) return m.reply(config.msg.noUrl);
    if (!(m.text.includes("http://") || m.text.includes("https://")))
      return m.reply(
        `url invalid, please input a valid url. Try with add http:// or https://`,
      );
    if (!m.text.includes("tiktok.com")) return m.reply(`Invalid Tiktok URL.`);
    m.reply(config.msg.wait);
    try {
    let res = await Func.fetchJson(API("arifzyn", "/download/tiktok", { url: m.text }, "apikey"))
    res = res.result
    let txt = `${res.description}\n\n`;
    for (let x of Object.keys(res).filter(
      (v) => !/profile|video|description|sound/.test(v),
    )) {
      txt += `• *${Func.toUpper(x)} :* ${res[x]}\n`;
    }
    if (res.type == "video") {
      m.reply(res.video["no-watermark"], { caption: txt });
    } else {
      let anu = res.image;
      if (anu.length == 0) throw Error("Error : no data");
      let c = 0,
        d = anu.length;
      if (!isPremium && anu.length > 7) {
        anu = anu.slice(0, 7);
        await m.reply(`_[!] (bukan user premium)_ limit maksimal 6 Slide.`, {
          from: m.sender,
        });
      }
      for (let x of anu) {
        if (c == 0)
          await m.reply(x, {
            caption: `Mengirim 1 dari ${anu.length} slide gambar.\n_(Sisanya akan dikirim via chat pribadi.)_`,
            from: m.sender,
          });
        else await m.reply(x, { from: m.sender });
        c += 1;
        await Func.delay(
          isPremium ? Func.ranNumb(700, 1000) : Func.ranNumb(800, 1500),
        );
      }
    }
    } catch (e) {
    	console.error(e)
    	m.reply(config.msg.error)
    }
  },
};
