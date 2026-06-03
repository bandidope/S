import axios from "axios";
import path from "path";
import { URL } from "url";

const bytesToKB = (bytes) => (!bytes ? 0 : Math.floor(Number(bytes) / 1024));

const formatSize = (size) => {
  if (!size) return "0 KB";
  const bytes = Number(size);
  if (isNaN(bytes)) return String(size);
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${Math.floor(bytes / 1024)} KB`;
};

const getFilenameFromUrl = (url) => {
  try {
    const parsed = new URL(url);
    const name = decodeURIComponent(path.basename(parsed.pathname));
    return name || "archivo_desconocido";
  } catch {
    return "archivo_desconocido";
  }
};

let processingGlobal = false;
const processingChats = new Set();

let handler = async (m, { conn, text, usedPrefix, command }) => {
  await m.react('👟');

  try {
    if (processingGlobal || processingChats.has(m.chat)) {
      return await m.reply(
        `
╭╾━━━━╼ 〔 ⚠️ 〕 ╾━━━━╼╮
│ 𝖤𝗅 𝗌𝗂𝗌𝗍𝖾𝗆𝖺 𝖾𝗌𝗍𝖺́ 𝗈𝖼𝗎𝗉𝖺𝖽𝗈.
│ 𝖨𝗇𝗍𝖾𝗇𝗍𝖺 𝖾𝗇 𝗎𝗇𝗈𝗌 𝗆𝗂𝗇𝗎𝗍𝗈𝗌.
╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯`,
        m
      );
    }

    if (!text?.trim()) {
      return await m.reply(
        `
╭╾━━━━╼ 〔 📦 〕 ╾━━━━╼╮
│ 𝖣𝖾𝖻𝖾𝗌 𝗂𝗇𝗀𝗋𝖾𝗌𝖺𝗋 𝗎𝗇 𝖾𝗇𝗅𝖺𝖼𝖾.
│
│ 👟 *Ejemplo:*
│ ${usedPrefix + command} https://www.mediafire.com/file/xxxx
╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯`,
        m
      );
    }

    if (!/https?:\/\/(www\.)?mediafire\.com\//i.test(text)) {
      return await m.reply(
        `
╭╾━━━━╼ 〔 🚫 〕 ╾━━━━╼╮
│ 𝖤𝗇𝗅𝖺𝖼𝖾 𝗇𝗈 𝗏𝖺́𝗅𝗂𝖽𝗈 𝖽𝖾 𝖬𝖥.
╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯`,
        m
      );
    }

    processingGlobal = true;
    processingChats.add(m.chat);

    const initialMsg = await m.reply(`🔄 *𝖁𝖆𝖓𝖘 𝕭𝖔𝖙 𝖯𝗋𝗈𝖼𝖾𝗌𝖺𝗇𝖽𝗈...*\n🛡️ 𝖤𝗌𝗉𝖾𝗋𝖺 𝗎𝗇 𝗆𝗈𝗆𝖾𝗇𝗍𝗈...`);
    await m.react('⏳');

    let fileData = null;

    try {
      const { data } = await axios.get(
        "https://fgsi.koyeb.app/api/downloader/mediafire",
        {
          params: {
            apikey: "fgsiapi-26242e54-6d",
            url: text
          },
          timeout: 20000
        }
      );

      if (data?.status && data.data?.downloadUrl) {
        const r = data.data;
        fileData = {
          name: r.filename || getFilenameFromUrl(r.downloadUrl),
          mime: r.mimetype || "application/octet-stream",
          sizeText: r.size ? `${(r.size / (1024 * 1024)).toFixed(2)} MB` : "0 KB",
          sizeKB: bytesToKB(r.size),
          downloadUrl: r.downloadUrl
        };
      } else throw new Error();
    } catch {
      const { data } = await axios.get(
        "https://api.nekolabs.my.id/downloader/mediafire",
        {
          params: { url: text },
          timeout: 20000
        }
      );

      if (data?.status && data.result?.download_url) {
        const r = data.result;
        fileData = {
          name: r.filename || getFilenameFromUrl(r.download_url),
          mime: r.mimetype || "application/octet-stream",
          sizeText: r.filesize || "0 KB",
          sizeKB: bytesToKB(r.size),
          downloadUrl: r.download_url
        };
      } else throw new Error("No se pudo obtener el archivo.");
    }

    if (!fileData?.downloadUrl) throw new Error("No se pudo obtener el archivo.");

    fileData.name = fileData.name || getFilenameFromUrl(fileData.downloadUrl);

    await m.react('📥');

    await conn.sendMessage(
      m.chat,
      {
        document: { url: fileData.downloadUrl },
        fileName: fileData.name,
        mimetype: fileData.mime,
        caption: `
╭╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╮
│ 📁 *ɴᴏᴍʙʀᴇ:* ${fileData.name}
│ 📦 *ᴛᴀᴍᴀñᴏ:* ${fileData.sizeText}
│ ⚙️ *ᴛɪᴘᴏ:* ${fileData.mime}
╰╾━━━━╼ 〔 👟 〕 ╾━━━━╼╯
*𝖁𝖆𝖓𝖘 𝕭𝖔𝖙 • 𝖡𝗒 𝖤𝗅𝗂𝗎𝖽*
        `.trim()
      },
      { quoted: initialMsg }
    );

    await m.react('✅');

  } catch (e) {
    await m.react('✖️');

    await m.reply(
      `
╭╾━━━━╼ 〔 ❌ 〕 ╾━━━━╼╮
│ 𝖤𝗋𝗋𝗈𝗋 𝖽𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝖺𝗆𝗂𝖾𝗇𝗍𝗈.
│ 𝖣𝖾𝗍𝖺𝗅𝗅𝖾: ${e.message}
╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯`,
      m
    );

  } finally {
    processingGlobal = false;
    processingChats.delete(m.chat);
  }
};

handler.help = ["mediafire <url>"];
handler.tags = ["descargas"];
handler.command = /^(mediafire|mf|mfdl)$/i;

export default handler;
