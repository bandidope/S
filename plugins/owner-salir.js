let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
let chat = global.db.data.chats[m.chat]
chat.welcome = false

let despedida = `┏━━━━━━━━━━━━━━┓\n┃  👟 *VANS BOT* \n┗━━━━━━━━━━━━━━┛\n\n`
despedida += `🚩 *NOTIFICACIÓN:* El Bot abandonará este grupo.\n\n`
despedida += `Fue un placer estar aquí con ustedes. ¡Adiós! ✌️`

await conn.reply(id, despedida) 
await conn.groupLeave(id)

try {  
chat.welcome = true
} catch (e) {
console.log(e)
}}

handler.command = /^(salir|leavegc|salirdelgrupo|leave)$/i
handler.group = true
handler.rowner = true

export default handler
