import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text || !text.trim()) {
    return m.reply(`🔎 *¿Qué deseas buscar en YouTube?*\n\n📌 *Uso:* ${usedPrefix + command} <término>\n📍 *Ejemplo:* ${usedPrefix + command} phonk 2024`);
  }

  const query = text.trim();
  const url = `https://api.starlights.uk/api/search/youtube?q=${encodeURIComponent(query)}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const json = await res.json();

    if (!json.status || !json.result || json.result.length === 0) {
      return m.reply("❌ *No se encontraron resultados para esta búsqueda.*");
    }

    const videos = json.result.slice(0, 5);

    for (const video of videos) {
      const caption = `
┏━━━━〔 🎬 *YOUTUBE SEARCH* 〕━━━━┓
┃
┃ 📌 *Título:* ${video.title}
┃ 👤 *Canal:* ${video.channel}
┃ ⏱️ *Duración:* ${video.duration}
┃ 🔗 *Link:* ${video.link}
┃
┣━━━━━━━━━━━━━━━━━━━━━━┛
┃ 📥 *DESCARGAS DISPONIBLES:*
┃ 🎵 *Audio:* ${usedPrefix}ytmp3 ${video.link}
┃ 🎥 *Video:* ${usedPrefix}ytmp4 ${video.link}
┃
┃ ⚡ *𝙏𝙝𝙚 𝙆𝙞𝙣𝙜'𝙨 𝘽𝙤𝙩 👾*
┗━━━━━━━━━━━━━━━━━━━━━━━┛`.trim();

      await conn.sendMessage(
        m.chat,
        { image: { url: video.imageUrl }, caption },
        { quoted: m }
      );
    }
    
    await m.react("✅");

  } catch (e) {
    console.error(e);
    return m.reply("⚠️ *Error en la conexión con los servidores de YouTube.*");
  }
};

handler.help = ["yts <texto>"];
handler.tags = ["búsquedas"];
handler.command = /^(ytsearch|yts|searchyt)$/i;

export default handler;
