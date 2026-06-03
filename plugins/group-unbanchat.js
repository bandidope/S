let handler = async (m, { conn, isAdmin, isROwner} ) => {
    if (!(isAdmin || isROwner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = false
    
    let mensaje = `╭╾━━━━╼ 〔 ✅ 〕 ╾━━━━╼╮\n`
    mensaje += `│  👟 *𝖁𝖆𝖓𝖘 𝕭𝖔𝖙 𝕬𝖈𝖙𝖎𝖛𝖆𝖉𝖔*\n`
    mensaje += `│\n`
    mensaje += `│ 𝖤𝗅 𝖼𝗁𝖺𝗍 𝗁𝖺 𝗌𝗂𝖽𝗈 𝖽𝖾𝗌𝖻𝖺𝗇𝖾𝖺𝖽𝗈.\n`
    mensaje += `│ 𝖸𝖺 𝗉𝗎𝖾𝖽𝖾𝗇 𝗎𝗌𝖺𝗋 𝗆𝗂𝗌 𝖿𝗎𝗇𝖼𝗂𝗈𝗇𝖾𝗌.\n`
    mensaje += `╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯\n`
    mensaje += `*𝖡𝗒 𝖤𝗅𝗂𝗎𝖽 • 𝖵𝖺𝗇𝗌 𝖡𝗈𝗍*`

    await conn.reply(m.chat, mensaje, m)
    await m.react('✅')
}

handler.help = ['desbanearbot']
handler.tags = ['group']
handler.command = ['desbanearbot', 'unbanchat']
handler.group = true 

export default handler
