import FormData from 'form-data';
import axios from 'axios';

export default {
  name: "bard",
  command: ["bard"],
  tags: ["ai"],
  run: async (m, { conn }) => {
    if (!m.text) return m.reply("Yes, can I help you ?");
    const quoted = m.quoted ? m.quoted : m;
    try { 
      if (/image/.test(quoted.mime)) {
        const formData = new FormData();
        formData.append("image", await quoted.download(), { filename: Date.now() + ".jpg" });
        formData.append("text", m.text);
        const { data } = await axios.post(API("arifzyn", "/ai/bard", {}, "apikey"), formData);
        m.reply(data.result);
      } else {
        const { data } = await axios.post(API("arifzyn", "/ai/bard", {}, "apikey"), {
        	text: m.text
        })
        m.reply(data.result);
      }
    } catch (e) {
      console.log(e);
      m.reply("Error response Bard Ai");
    }
  },
};