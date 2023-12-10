import { performance } from 'perf_hooks';
import os from 'os';

export default {
  name: "speed",
  command: ["ping", "speed"],
  tags: ["info"],
  desc: "Server Information.",
  run: async (m, { conn }) => {
    const old = performance.now();
    const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const serverInfo = `\`\`\`Server Information

- ${os.cpus().length} CPU: ${os.cpus()[0].model}

- Uptime: ${Math.floor(os.uptime() / 86400)} days
- Ram: ${free_ram}/${ram}
- Speed: ${(performance.now() - old).toFixed(5)} ms\`\`\``;
    m.reply(serverInfo);
  },
};
