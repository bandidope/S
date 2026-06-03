import { sticker } from '../lib/sticker.js';
import axios from 'axios';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.sendMessage(m.chat, { text: `⚠️ Escribe el texto que quieres convertir en sticker.` }, { quoted: m });

    try {
        // Mostramos que el bot está trabajando
        await m.react('⚪');

        // URL directa con fondo blanco por defecto
        const apiUrl = `https://sylphy.xyz/tools/brat?text=${encodeURIComponent(text)}&color=black&fondo=white&api_key=sylphy-6f150d`;
        
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const buffer = response.data;

        // Conversión a sticker
        let stiker = await sticker(buffer, false, global.packname || 'Brat', global.author || 'Bot');

        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        } else {
            throw new Error("Error al convertir a sticker.");
        }
    } catch (error) {
        console.error(error);
        return conn.sendMessage(m.chat, { text: `❌ No se pudo generar el sticker.` }, { quoted: m });
    }
};

handler.command = ['brat'];
handler.tags = ['sticker'];
handler.help = ['brat *<texto>*'];

export default handler;
