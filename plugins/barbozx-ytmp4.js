import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command}) => {
  try {
    if (!text) return conn.reply(m.chat, '💥 Por favor, proporciona un enlace de YouTube.', m)
    await m.react('🕒')

    const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = text.match(ytRegex)
    if (!match) throw '⚠ Enlace de YouTube no válido.'

    const videoUrl = `https://youtu.be/${match[1]}`
    const apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(videoUrl)}&quality=360`

    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.result?.download?.url) throw '👹 No se pudo obtener el video.'

    const title = json.result.title || 'video'
    const downloadUrl = json.result.download.url

    await conn.sendFile(m.chat, downloadUrl, `${title}.mp4`, `> 💀 *${title}*\n> ✅ Video descargado en calidad 360p`, m)
    await m.react('✔️')
} catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, typeof e === 'string'? e: '⚠ Ocurrió un error al procesar el video.', m)
}
}

handler.command = handler.help = ['ytmp4']
handler.tags = ['descargas']
handler.group = false // o true si deseas que solo funcione en grupos

export default handler