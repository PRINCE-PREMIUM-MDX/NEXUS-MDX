const fs = require('fs')

global.owner = "243" //owner number
global.footer = "𝐏rince 𝐏remium ᴛᴇᴄʜ" //footer section
global.status = false //"self/public" section of the bot
global.prefa = ['','!','.',',','🐤','🗿']
global.owner = ['62']
global.xprefix = '.'
global.gambar = "https://files.catbox.moe/qsa3b9.jpg"
global.OWNER_NAME = "@prince_tech" //
global.DEVELOPER = ["243860885022"] //
global.BOT_NAME = "ɴᴇxᴜs ᴍᴅx"
global.bankowner = "ᴘʀɪɴᴄᴇ ᴛᴇᴄʜ"
global.creatorName = "ᴘʀɪɴᴄᴇ  ᴛᴇᴄʜ"
global.ownernumber = '243860885022'  //creator number
global.location = "Ghana,kumasi"
global.prefa = ['','!','.','#','&']
//================DO NOT CHANGE OR YOU'LL GET AN ERROR=============\
global.footer = "ɴᴇxᴜs-ᴍᴅx" //footer section
global.link = "https://whatsapp.com/channel/0029Vb8KrLcJpe8piGeSfH0i"
global.autobio = true //auto update bio
global.botName = "ɴᴇxᴜs-ᴍᴅx"
global.version = "1.0.0"
global.botname = "ɴᴇxᴜs-ᴍᴅx"
global.author = "Prince Tech"
global.themeemoji = "⭐"
global.wagc = 'https://chat.whatsapp.com/HBu4gLNl10IBUzrP8lpFYz?s=cl&p=a&mlu=0&ilr=0'
global.thumbnail = 'https://files.catbox.moe/qsa3b9.jpg'
global.richpp = ' '
global.packname = "ɴᴇxᴜs-ᴍᴅx"
global.author = "Prince Tech"
global.creator = "243860885022@s.whatsapp.net"
global.ownername = 'Prince Premium' 
global.onlyowner = `Notice ⚠️: Only bot owners can use this Command 💜🥷`
  // reply 
global.database = `*To Exist In The Database Contact The Owner of this bot*`
  global.mess = {
wait: "*Configurating.......*",
   success: "*Successfully acknowledged ☑️*",
   on: "*Activated ✅*", 
   prem: "*Feature For Premium Users only 📛*", 
   off: "*Deactivated 📛*",
   query: {
       text: "*Please, Provide A Text Query 📑*",
       link: "Please, provide a valid link 🔗*",
   },
   error: {
       fitur: "*Status 🌐: Feature Or Command error ❌*",
   },
   only: {
       group: "*Notice ⚠️: Group only feature ❌*",
private: "*Notice ⚠️: Private chat feature only ❌*",
       owner: "*Notice ⚠️: Owner feature only ❌*",
       admin: "*Notice ⚠️: bot owner feature only ❌*",
       badmin: "*Notice ⚠️: Seek admin privilege's to use this command ❌*",
       premium: "*Notice ⚠️: Availabe for premium users only ❌*",
   }
}

global.hituet = 0
//false=disable and true=enable
global.autoviewstatus = false
global.autoread = false //auto read messages
global.autobio = true //auto update bio
global.anti92 = true //auto block +92 
global.autoswview = true //auto view status/story

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})

//Property of Prince premium 
//owner number:243860885022
