var handler = async (m, { conn, participants, isAdmin, isBotAdmin, args, usedPrefix, command}) => {
  const emoji = '🎶';
  const emoji2 = '✖️';

  const isOwner = global.owner.map(o => typeof o === 'string'? o: o[0]).includes(m.sender);
  if (!isAdmin &&!isOwner) {
    return conn.reply(m.chat, `${emoji2} Este comando solo puede ser usado por administradores del grupo.`, m);
}

  // IMPORTANTE: Incluso si se elimina esta marca, el bot aún debe ser administrador del grupo.
  // para utilizar conn.groupParticipantsUpdate para eliminar miembros.
  // Si el bot no es administrador, la operación fallará en una etapa posterior.
  /*
  if (!isBotAdmin) {
    return conn.reply(m.chat, `${emoji2} No puedo eliminar a nadie porque no soy administrador del grupo.`, m);
}
  */

  if (!args[0] ||!/^(sí|si|confirmar)$/i.test(args[0])) {
    return conn.reply(m.chat, `${emoji} ¿Estás seguro de que quieres eliminar a todos los miembros del grupo (excepto tú)?\n\nResponde con:\n*${usedPrefix}${command} sí*`, m);
}

  const groupInfo = await conn.groupMetadata(m.chat);
  const groupOwner = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const globalOwners = global.owner.map(o => typeof o === 'string'? o: o[0] + '@s.whatsapp.net');

  let toKick = participants
.map(p => p.id)
.filter(id =>
      id!== m.sender &&
      id!== conn.user.jid &&
      id!== groupOwner &&
!globalOwners.includes(id)
);

  if (toKick.length === 0) {
    return conn.reply(m.chat, `${emoji2} No hay miembros válidos para eliminar.`, m);
}

  try {
    await conn.groupParticipantsUpdate(m.chat, toKick, 'remove');
    await conn.reply(m.chat, `${emoji} Todos los miembros fueron eliminados exitosamente (excepto tú).`, m);
} catch (e) {
    await conn.reply(m.chat, `${emoji2} Ocurrió un error al intentar eliminar a los miembros. Asegúrese de que el bot sea administrador del grupo.`, m);
}
};

handler.help = ['kick2 confirmar'];
handler.tags = ['grupo'];
handler.command = ['kick2', 'eliminaratodos', 'sacaratodos'];
handler.group = true;

export default handler;