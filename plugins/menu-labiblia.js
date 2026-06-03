
import { webp2mp4} from '../lib/webp2mp4.js';
import { ffmpeg} from '../lib/converter.js';

// Define tus emojis aquí
const emoji = '🎥';
const emoji2 = '⏳';

const handler = async (m, { conn, usedPrefix, command}) => {
  if (!m.quoted) {
    return conn.reply(m.chat, `${emoji} Responda a un sticker que desee convertir en video.`, m);
}

  const mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) {
    return conn.reply(m.chat, `${emoji} Responda a un sticker que desee convertir en video.`, m);
}

  const media = await m.quoted.download();
  let out = Buffer.alloc(0);

  conn.reply(m.chat, `${emoji2} Procesando, por favor espere un momento...`, m);

  if (/webp/.test(mime)) {
    out = await webp2mp4(media);
} else if (/audio/.test(mime)) {
    out = await ffmpeg(media, [
      '-filter_complex', 'color',
      '-pix_fmt', 'yuv420p',
      '-crf', '51',
      '-c:a', 'copy',
      '-shortest',
    ], 'mp3', 'mp4');
}

  await conn.sendFile(m.chat, out, 'video.mp4', `${emoji} Aquí tienes tu *vídeo* ฅ^•ﻌ•^ฅ.`, m, 0, { thumbnail: out});
};

handler.help = ['tovideo'];
handler.tags = ['transformador'];
handler.group = true;
handler.command = ['tovideo', 'tomp4', 'mp4', 'togif'];

export default handler;