const { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, makeInMemoryStore, jidDecode } = require("@whiskeysockets/baileys")
const { Boom } = require('@hapi/boom')
const Pino = require('pino')
const fs = require('fs')

//Database
const { smsg } = require('./module')

//Database connection
const store = makeInMemoryStore({
  logger: Pino().child({
    level: 'silent',
    stream: 'store'
  })
})

async function connectToWhatsApp () { 
  let { version, isLatest } = await fetchLatestBaileysVersion(`./session`) 
  const {  state, saveCreds } =await useMultiFileAuthState(`./session`)
    const sock = makeWASocket({
        printQRInTerminal: true, 
        browser: Browsers.windows('Firefox'),
        auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      }
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
                connectToWhatsApp()
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    
    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('messages.upsert', async chatUpdate => {
      try {
        const JaaConnect = chatUpdate.messages[0]
        if (!JaaConnect.message) return
        if (JaaConnect.key && JaaConnect.key.remoteJid === 'status@broadcast' )
        if (!sock.public && !sock.key.fromMe && chatUpdate.type === 'notify' ) return
        if (JaaConnect.key.id.startsWith('BAE5') && JaaConnect.key.id.length === 16 ) return
        const m = smsg(sock, JaaConnect, store)
        require("./case")(sock, m, chatUpdate, store)
      } catch (err) {
        console.log()
      }
    })
    
    sock.public = true
    sock.serializeM = (m) => smsg(sock, m, store)
    
    sock.decodeJid = (jid) => {
      if (!jid) return jid
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {}
        return decode.user && decode.server && decode.user + '@' + decode.server || jid
      } else return jid
    }
    
    sock.sendText = (jid, text, quoted = 'Selamat Pagi', options) => sock.sendMessage(jid, {
      text: text, 
      ...options
    }, {
      quoted, 
      ...options
    }
  )

}
// run in main file
connectToWhatsApp()

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err)
})