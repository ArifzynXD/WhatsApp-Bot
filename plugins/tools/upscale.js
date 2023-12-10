import FormData from 'form-data';

export default {
	name: ["hd"],
	command: ["hd", "remini"],
	tags: ["tools"],
	run: async (m, { conn, prefix, command }) => {
		let quoted = m.quoted ? m.quoted : m;
    if (/video/.test(quoted.mime)) {
    	m.reply("Video Non Support")
    } else if (/image/.test(quoted.mime)) {
      m.reply("[!] _Please Wait..._");
      try { 
        const formData = new FormData();
        formData.append('image', await quoted.download(), { filename: Date.now() + '.jpg' });
        formData.append('size', m.text ? m.text : "low");

        const { data } = await Func.axios.post(API("arifzyn", "/ai/upscale", {}, "apikey"), formData, {
          headers: {
           ...formData.getHeaders(),
          },
          timeout: 60000,
        });
        m.reply(data.result)
      } catch (e) {
        console.log(e);
        m.reply(config.msg.error);
      } 
     } else m.reply(`Kirim/Reply Image/Video with caption ${prefix + command}`);
	}
}; 