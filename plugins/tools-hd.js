import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn, prefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) return m.reply(`📸 𝖱𝖾𝗌𝗉𝗈𝗇𝖽𝖾 𝖺 𝗎𝗇𝖺 𝗂𝗆𝖺𝗀𝖾𝗇 𝖼𝗈𝗇 𝖾𝗅 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 *${prefix}${command}* 𝗉𝖺𝗋𝖺 𝗆𝖾𝗃𝗈𝗋𝖺𝗋𝗅𝖺.`);
    if (!mime.startsWith('image')) return m.reply(`⚠️ 𝖲𝗈𝗅𝗈 𝗌𝖾 𝖺𝖽𝗆𝗂𝗍𝖾𝗇 𝗂𝗆𝖺́𝗀𝖾𝗇𝖾𝗌.`);

    await conn.sendMessage(m.chat, {
      react: { text: "👟", key: m.key }
    });

    const media = await q.download();

    const enhancedBuffer = await ihancer(media, { method: 1, size: 'high' });

    const caption = `╭╾━━━━╼ 〔 👟 〕 ╾━━━━╼╮
│  ✨ *𝖁𝖆𝖓𝖘 𝕭𝖔𝖙 𝕳𝕯*
│
│ ⚙️ *𝖬𝖾́𝗍𝗈𝖽𝗈:* 𝗂𝖧𝖺𝗇𝖼𝖾𝗋 𝖠𝖨
│ 🔝 *𝖢𝖺𝗅𝗂𝖽𝖺𝖽:* 𝖧𝗂𝗀𝗁 𝖬𝖺𝗑
│ 🔥 *𝖡𝗒:* 𝖤𝗅𝗂𝗎𝖽
╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯
*𝖮𝖿𝖿 𝖳𝗁𝖾 𝖶𝖺𝗅𝗅 𝖲𝗍𝗒𝗅𝖾*`;

    await conn.sendMessage(m.chat, {
      image: enhancedBuffer,
      caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    await m.reply("⚠️ 𝖮𝖼𝗎𝗋𝗋𝗂𝗈́ 𝗎𝗇 𝖾𝗋𝗋𝗈𝗋 𝖺𝗅 𝗉𝗋𝗈𝖼𝖾𝗌𝖺𝗋 𝗅𝖺 𝗂𝗆𝖺𝗀𝖾𝗇.");
  }
};

async function ihancer(buffer, { method = 1, size = 'low' } = {}) {
    const _size = ['low', 'medium', 'high']

    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Se requiere una imagen')
    if (method < 1 || method > 4) throw new Error('Métodos disponibles: 1, 2, 3, 4')
    if (!_size.includes(size)) throw new Error(`Calidades disponibles: ${_size.join(', ')}`)

    const form = new FormData()
    form.append('method', method.toString())
    form.append('is_pro_version', 'false')
    form.append('is_enhancing_more', 'false')
    form.append('max_image_size', size)
    form.append('file', buffer, `vans_${Date.now()}.jpg`) // Cambiado a vans_

    const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
        headers: {
            ...form.getHeaders(),
            'accept-encoding': 'gzip',
            'host': 'ihancer.com',
            'user-agent': 'Dart/3.5 (dart:io)'
        },
        responseType: 'arraybuffer'
    })

    return Buffer.from(data)
}

handler.help = ['hd'];
handler.tags = ['ai', 'imagen'];
handler.command = ['hd', 'upscale', 'enhance'];

export default handler;
