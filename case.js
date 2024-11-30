process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

require('./settings')
module.exports = sock = async(sock, m, msg, chatUpdate, store) => {
  try {
    const { type, quotedMsg, mentioned, now, fromMe } = m 
    var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectreplygcsock.selectedRowId : (m.mtype == 'templateButtonreplygcsockMessage') ? m.message.templateButtonreplygcsockMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectreplygcsock.selectedRowId || m.text) : ''
    
    var budy = (typeof m.text == 'string' ? m.text : '')
    var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? global.prefix
    const isCmd = body.startsWith(prefix)
    const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
    const args = body.trim().split(/ +/).slice(1)
    const text = q = args.join(' ')
    
    const { runtime, formatp } = require(`./module.js`)
    const { fetchJson, pickRandom } = require(`./module2.js`) 
    const os = require('os')
    const speed = require('performance-now')
    
    switch (command) { 
      case 'ai': {
        try {
          if (!text) return m.reply(`Mana pertanyaan?`)
          let ai = await fetchJson(`https://api.agatz.xyz/api/gemini?message=${text}`)
          m.reply(`${ai.data.answer}`)
        } catch (err) {
          m.reply(`Eror, silahkan lapor ke owner`)
        }
      }
      break
      case 'tiktoksearch': {
        try {
          if (!text) return m.reply(`Mana textnya?`)
          let tiktoksearch = await fetchJson(`https://api.agatz.xyz/api/tiktoksearch?message=${text}`)
          await sock.sendMessage(m.chat, { audio: { url: tiktoksearch.data.music }, mimetype: 'audio/mpeg' }, { quoted: m })
        } catch (err) {
          m.reply(`Eror, silahkan lapor ke owner`)
        }
      }
      break
      case 'statusbot': {
        const used = process.memoryUsage()
        const cpus = os.cpus().map(cpu => {
          cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
          return cpu
        })
        const cpu = cpus.reduce((last, cpu, _, { length
        }) => {
          last.total += cpu.total 
          last.speed += cpu.speed / length 
          last.times.user += cpu.times.user 
          last.times.nice += cpu.times.nice 
          last.times.sys += cpu.times.sys 
          last.times.idle += cpu.times.idle 
          last.times.irq += cpu.times.irq 
          return last
        }, {
          speed: 0, 
          total: 0, 
          times: {
            user: 0, 
            nice: 0, 
            sys: 0, 
            idle: 0, 
            irq: 0
          }
        })
        let timestamp = speed()
        let latensi = speed() - timestamp
        neww = performance.now()
        oldd = performance.now()
        balas = ` 
        Response Speed ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}\n\n💻 Info Server\nRAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}\n\n_NodeJS Memory Usaage_\n${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}
        
        ${cpus[0] ? `_Total CPU Usage_ 
        ${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')} 
        _CPU Core(s) Usage (${cpus.length} Core CPU)_ 
        ${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''} 
        `.trim()
        m.reply(balas)
      }
      break
    }
  } catch (err) {
    console.log(err)
  }
}