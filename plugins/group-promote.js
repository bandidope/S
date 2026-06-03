var handler = async (m, { conn, text }) => {
    let user;
    let done = '✅';

    if (m.quoted) {
        user = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (text) {
        user = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }

    if (!user) return conn.reply(m.chat, '*Menciona a alguien, responde a su mensaje o escribe su número pe.*', m);

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        conn.reply(m.chat, `${done} Ya es admin el firme.`, m);
    } catch (e) {
        conn.reply(m.chat, '*Falló la promoción, quizá ya no está en el grupo.*', m);
    }
}

handler.help = ['promote'];
handler.tags = ['grupo'];
handler.command = ['promote', 'darpija', 'promover']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
