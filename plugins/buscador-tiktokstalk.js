
var handler = async (m, { args, usedPrefix, command}) => {
  const username = args[0];
  if (!username) {
    return m.reply(`❌ Debes proporcionar un nombre de usuario de TikTok.\nEjemplo: *${usedPrefix}${command} dev_diego_ofc*`);
}

  try {
    const res = await fetch(`https://api.dorratz.com/v3/tiktok-stalk?username=${username}`);
    const json = await res.json();

    if (!json.objects ||!json.objects[0]) {
      return m.reply(`⚠️ No se encontró información para el usuario: ${username}`);
}

    const userInfo = JSON.parse(json.objects[0].content).userInfo;

    let info = `🎵 *Perfil TikTok: @${userInfo.username}*\n\n`;
    info += `📛 Nombre: ${userInfo.nombre || 'No disponible'}\n`;
    info += `📄 Bio: ${userInfo.bio || 'Sin descripción'}\n`;
    info += `✅ Verificado: ${userInfo.verificado? 'Sí': 'No'}\n`;
    info += `👥 Seguidores: ${userInfo.seguidoresTotales}\n`;
    info += `👣 Siguiendo: ${userInfo.siguiendoTotal}\n`;
    info += `❤️ Me gusta: ${userInfo.meGustaTotales}\n`;
    info += `🎬 Videos: ${userInfo.videosTotales}\n`;
    info += `🤝 Amigos: ${userInfo.amigosTotales}\n`;
    info += `📷 Avatar: ${userInfo.avatar}`;

    m.reply(info);
} catch (e) {
    console.error(e);
    m.reply('❌ Error al obtener datos. Intenta nuevamente más tarde.');
}
};

handler.help = ['tiktokstalk <usuario>'];
handler.tags = ['info'];
handler.command = ['tiktokstalk'];

export default handler;