import fetch from 'node-fetch';
import axios from 'axios';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';
import yts from 'yt-search';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONTADOR_PATH = join(__dirname, '.contador_ytmp3.txt');

class Youtubers {
  constructor() {
    this.hex = "C5D58EF67A7584E4A29F6C35BBC4EB12";
  }

  async uint8(hex) {
    const pecahan = hex.match(/[\dA-F]{2}/gi);
    if (!pecahan) throw new Error("Formato no válido");
    return new Uint8Array(pecahan.map(h => parseInt(h, 16)));
  }

  b64Byte(b64) {
    const limpio = b64.replace(/\s/g, "");
    const binario = Buffer.from(limpio, 'base64');
    return new Uint8Array(binario);
  }

  async key() {
    const raw = await this.uint8(this.hex);
    return await crypto.webcrypto.subtle.importKey("raw", raw, { name: "AES-CBC" }, false, ["decrypt"]);
  }

  async Data(base64Encrypted) {
    const byteData = this.b64Byte(base64Encrypted);
    if (byteData.length < 16) throw new Error("Datos muy cortos");

    const iv = byteData.slice(0, 16);
    const data = byteData.slice(16);

    const kunci = await this.key();
    const resultado = await crypto.webcrypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      kunci,
      data
    );

    const texto = new TextDecoder().decode(new Uint8Array(resultado));
    return JSON.parse(texto);
  }

  async getCDN() {
    const res = await fetch("https://media.savetube.me/api/random-cdn");
    const data = await res.json();
    return data.cdn;
  }

  async infoVideo(linkYoutube) {
    const cdn = await this.getCDN();
    const res = await fetch(`https://${cdn}/v2/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: linkYoutube }),
    });

    const resultado = await res.json();
    if (!resultado.status) throw new Error(resultado.message || "No se pudo obtener la información");

    const descifrado = await this.Data(resultado.data);
    return {
      judul: descifrado.title,
      durasi: descifrado.durationLabel,
      thumbnail: descifrado.thumbnail,
      key: descifrado.key
    };
  }

  async getDownloadLink(key) {
    const cdn = await this.getCDN();
    const res = await fetch(`https://${cdn}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        downloadType: "audio",
        quality: "128",
        key
      }),
    });

    const json = await res.json();
    if (!json.status) throw new Error(json.message);
    return json.data.downloadUrl;
  }
}

function contarDescarga() {
  let contador = 0;
  if (existsSync(CONTADOR_PATH)) {
    try {
      contador = parseInt(readFileSync(CONTADOR_PATH, 'utf8')) || 0;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  contador += 1;
  try {
    writeFileSync(CONTADOR_PATH, String(contador));
  } catch (error) {
    console.error('Error:', error);
  }
  return contador;
}

function isYouTubeURL(text) {
  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/shorts\/)/i;
  return ytRegex.test(text);
}

const getFileSize = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength) : 0;
  } catch (error) {
    return 0;
  }
};

const sendAudioWithRetry = async (conn, chat, audioUrl, videoTitle, maxRetries = 2) => {
  let attempt = 0;
  let thumbnailBuffer;

  try {
    // URL de imagen sugerida para Vans
    const response = await axios.get('https://files.catbox.moe/1j784p.jpg', { responseType: 'arraybuffer' });
    thumbnailBuffer = Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('⚠️ Thumbnail error');
  }

  const fileSize = await getFileSize(audioUrl);
  const maxSizeInBytes = 35 * 1024 * 1024;
  const sendAsDocument = fileSize > maxSizeInBytes;

  const messageOptions = {
    mimetype: 'audio/mpeg',
    contextInfo: {
      externalAdReply: {
        title: `👟 VANS MP3: ${videoTitle}`,
        body: sendAsDocument ? "📁 Enviado como Archivo Pesado" : "🏁 Off The Wall - Audio Player",
        previewType: 'PHOTO',
        thumbnail: thumbnailBuffer,
        mediaType: 1,
        sourceUrl: 'https://vans.com'
      }
    }
  };

  if (sendAsDocument) {
    messageOptions.document = { url: audioUrl };
    messageOptions.fileName = `${videoTitle}.mp3`;
  } else {
    messageOptions.audio = { url: audioUrl };
    messageOptions.ptt = false;
  }

  while (attempt < maxRetries) {
    try {
      await conn.sendMessage(chat, messageOptions);
      break;
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw new Error('Error al enviar audio.');
    }
  }
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat,
      `🏁 *VANS YOUTUBE PLAYER* 🏁\n\n` +
      `👟 *Uso:* ${usedPrefix}${command} <nombre o url>\n` +
      `👟 *Ejemplo:* ${usedPrefix}${command} Burn It Down Linkin Park\n\n` +
      `> _Procesando audio en alta calidad 128kbps_`,
      m);
  }

  try {
    await m.react('🏁');

    const query = args.join(" ");
    let videoUrl = '';
    let videoData = null;

    const waitingMsg = `🛹 *[ VANS SEARCH ]*\n\n` +
                       `⌛ Buscando la pista en los servidores...\n` +
                       `> _Estamos preparando tu contenido_`;
    
    await conn.reply(m.chat, waitingMsg, m);

    if (isYouTubeURL(query)) {
      videoUrl = query;
    } else {
      const search = await yts(query);
      if (!search.videos || !search.videos.length) throw new Error("No se encontró el video, intenta otro nombre.");

      videoData = search.videos[0];
      videoUrl = videoData.url;
    }

    await m.react('📥');

    const yt = new Youtubers();
    const info = await yt.infoVideo(videoUrl);
    const audioUrl = await yt.getDownloadLink(info.key);

    await m.react('📤');
    await sendAudioWithRetry(conn, m.chat, audioUrl, info.judul);

    const total = contarDescarga();
    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    return m.reply(`👟 *VANS ERROR:* ${e.message}`);
  }
};

handler.command = /^(ytmp3|audio|play)$/i;
handler.help = ['ytmp3 <query/url>'];
handler.tags = ['descargas'];
export default handler;
