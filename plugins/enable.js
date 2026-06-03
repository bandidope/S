let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command);
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = (args[0] || '').toLowerCase();
  let isAll = false, isUser = false;

  switch (type) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn);
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn);
      chat.bienvenida = isEnable;
      break;

    case 'antiprivado2':
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn);
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn);
      chat.antiPrivate2 = isEnable;
      break;

    case 'antilag':
      chat.antiLag = isEnable;
      break;

    case 'autoread':
    case 'autoleer':
      isAll = true;
      if (!isROwner) return global.dfail('rowner', m, conn);
      global.opts['autoread'] = isEnable;
      break;

    case 'antispam':
      isAll = true;
      if (!isOwner) return global.dfail('owner', m, conn);
      bot.antiSpam = isEnable;
      break;

    case 'antinopor':
      isAll = true;
      if (!isOwner) return global.dfail('owner', m, conn);
      chat.antiLinkxxx = isEnable;
      break;

    case 'audios':
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn);
      chat.audios = isEnable;
      break;

    case 'detect':
    case 'avisos':
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn);
      chat.detect = isEnable;
      break;

    case 'jadibotmd':
    case 'serbot':
    case 'subbots':
      isAll = true;
      if (!isOwner) return global.dfail('rowner', m, conn);
      bot.jadibotmd = isEnable;
      break;

    case 'restrict':
      isAll = true;
      if (!isOwner) return global.dfail('rowner', m, conn);
      bot.restrict = isEnable;
      break;

    case 'document':
      isUser = true;
      user.useDocument = isEnable;
      break;

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.antiLink = isEnable;
      break;

    case 'antibot':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.antiBot = isEnable;
      break;

    case 'modoadmin':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.modoadmin = isEnable;
      break;

    case 'antiprivado':
      isAll = true;
      bot.antiPrivate = isEnable;
      break;

    case 'nsfw':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.nsfw = isEnable;
      break;

    case 'antiarabes':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.onlyLatinos = isEnable;
      break;

    default:
      if (!/[01]/.test(command)) return m.reply(`
🏎️💨 ᴠᴀɴs ʙᴏᴛ - ᴄᴏɴᴛʀᴏʟ ᴄᴇɴᴛᴇʀ
──────────────────────
🚘 *Ajustes de Velocidad y Seguridad*

🏁 *[welcome]* ⮕ Bienvenida
🏁 *[nsfw]* ⮕ Modo Adulto
🏁 *[antilink]* ⮕ Bloqueo de Links
🏁 *[antilag]* ⮕ Optimizar RAM
🏁 *[antiarabes]* ⮕ Filtro Regional
🏁 *[autoleer]* ⮕ Lectura Auto
🏁 *[restrict]* ⮕ Restricciones
🏁 *[document]* ⮕ Modo Documento
🏁 *[modoadmin]* ⮕ Solo Staff
🏁 *[audios]* ⮕ Notas de Voz
🏁 *[subbots]* ⮕ Sistema JadiBot

🛠️ *Uso:* ${usedPrefix + command} welcome
──────────────────────`.trim())
      throw false
  }

  let statusText = isEnable ? 'ＥＮＣＥＮＤＩＤＯ ✅' : 'ＡＰＡＧＡＤＯ ❌';
  let scopeText = isAll ? 'ＴＯＤＯ ＥＬ ＢＯＴ' : isUser ? 'ＵＳＵＡＲＩＯ' : 'ＥＳＴＥ ＣＨＡＴ';

  let confirm = `
🚘 *V A N S  B O T  M D* 🚘
──────────────────────
🚦 *ESTADO DE LA FUNCIÓN*

🛠️ *Parámetro:* \`${type}\`
⚡ *Estado:* ${statusText}
📍 *Ruta:* ${scopeText}

💨 *¡Motor configurado correctamente!*
──────────────────────`.trim()

  m.reply(confirm)
}

handler.help = ['enable', 'disable', 'on', 'off']
handler.tags = ['nable']
handler.command = /^(enable|disable|on|off|1|0)$/i

export default handler
