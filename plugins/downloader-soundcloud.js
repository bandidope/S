import fetch from "node-fetch";

const limit = 100;

const handler = async (m, { conn, text, command }) => {
  if (!text || !text.trim()) {
    return m.reply("👟 *¿𝖰𝗎𝖾́ 𝖽𝖾𝗌𝖾𝖺𝗌 𝖾𝗌𝖼𝗎𝖼𝗁𝖺𝗋? 𝖨𝗇𝗀𝗋𝖾𝗌𝖺 𝖾𝗅 𝗇𝗈𝗆𝖻𝗋𝖾 𝖽𝖾 𝗅𝖺 𝖼𝖺𝗇𝖼𝗂𝗈́𝗇 𝗈 𝖴𝖱𝖫 𝖽𝖾 𝖲𝗈𝗎𝗇𝖽𝖢𝗅𝗈𝗎𝖽.*");
  }

  await m.react("🎧");

  try {
    // Buscar en SoundCloud
    const res = await fetch(`https://api.delirius.store/search/soundcloud?q=${encodeURIComponent(text.trim())}&limit=10`);
    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
      await m.react("❌");
      return m.reply("❌ *𝖭𝗈 𝗌𝖾 𝖾𝗇𝖼𝗈𝗇𝗍𝗋𝖺𝗋𝗈𝗇 𝗋𝖾𝗌𝗎𝗅𝗍𝖺𝖽𝗈𝗌 𝖾𝗇 𝗏𝖺𝗇𝗌 𝗌𝖾𝗋𝗏𝖾𝗋.*");
    }

    const track = data.data[0]; 
    const caption = `
╭╾━━━━╼ 〔 ☁️ 𝖲𝖮𝖴𝖭𝖣𝖢𝖫𝖮𝖴𝖣 〕 ╾━━━━╼╮
┃
┃ 🎼 *ᴛíᴛᴜʟᴏ:* ${track.title}
┃ 👤 *ᴀʀᴛɪsᴛᴀ:* ${track.artist}
┃ ⏱️ *ᴅᴜʀᴀᴄɪóɴ:* ${Math.floor(track.duration / 1000)}s
┃ ❤️ *ʟɪᴋᴇs:* ${track.likes}
┃ ▶️ *ᴘʟᴀʏs:* ${track.play}
┃
╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯
*𝖁𝖆𝖓𝖘 𝕭𝖔𝖙 • 𝖡𝗒 𝖤𝗅𝗂𝗎𝖽*

> 📥 _𝖤𝗇𝗏𝗂𝖺𝗇𝖽𝗈 𝖿𝗋𝖾𝖼𝗎𝖾𝗇𝖼𝗂𝖺 𝖽𝖾 𝖺𝗎𝖽𝗂𝗈..._
`.trim();

    // Mostrar miniatura + caption
    if (track.image) {
      await conn.sendMessage(m.chat, { 
        image: { url: track.image }, 
        caption 
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }

    // Descargar audio
    const apiRes = await fetch(`https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(track.link)}`);
    const api = await apiRes.json();
    const dl = api?.data?.download; 

    if (!dl) return m.reply("❌ *𝖤𝗋𝗋𝗈𝗋 𝖺𝗅 𝖾𝗑𝗍𝗋𝖺𝖾𝗋 𝗅𝖺 𝗉𝗂𝗌𝗍𝖺 𝖽𝖾 𝖺𝗎𝖽𝗂𝗈.*");

    // Enviar como audio
    await conn.sendMessage(m.chat, {
      audio: { url: dl },
      mimetype: "audio/mpeg",
      fileName: `${track.title}.mp3`,
      ptt: false 
    }, { quoted: m });

    await m.react("👟");

  } catch (error) {
    console.error("❌ Error:", error);
    await m.react("⚠️");
    return m.reply("⚠️ *𝖤𝗅 𝗌𝗂𝗌𝗍𝖾𝗆𝖺 𝖽𝖾 𝖤𝗅𝗂𝗎𝖽 𝖾𝗇𝖼𝗈𝗇𝗍𝗋𝗈́ 𝗎𝗇 𝖾𝗋𝗋𝗈𝗋.*");
  }
};

handler.help = ["sound"];
handler.tags = ["descargas"];
handler.command = /^(sound|soundcloud|scdl)$/i;

export default handler;
