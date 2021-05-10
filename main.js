/* 
    --logger        -> Logger verwenden   
    --repeat=15     -> Logger-Script wiederholen nach x Sekunden
    --state         -> Serverstatus anzeigen
    --statistics    -> Spielerstatistiken generieren
*/


require('dotenv').config()
const Discord = require('discord.js')
const dcClient = new Discord.Client()
const args = require('minimist')(process.argv.slice(2))

const statistics = require.main.require('./src/statistics.js')
const logger = require.main.require('./src/logger.js')
const state = require.main.require('./src/state.js')

const scriptName = '[MAIN] -> '

dcClient.on('ready', () => {

    console.log(scriptName + `Logged in as ${dcClient.user.tag}!\n`)

    if (args['logger']) logger.start(dcClient, args['repeat'] || 15, [
        'kill', 'chat', 'admin', 'login', 'violation'
    ])

    if (args['state']) state.start(dcClient)

    if (args['statistics']) statistics.start(dcClient)

})

dcClient.on("message", async msg => {
    if (msg.member.hasPermission('ADMINISTRATOR')) {
        if (msg.content.toLowerCase().startsWith("!clearchat")) {
            console.log(scriptName + '"!clearchat" detected! Clearing channel...')
            let fetched
            do {
                fetched = await msg.channel.messages.fetch({
                    limit: 100
                })
                msg.channel.bulkDelete(fetched)
            } while (fetched.size >= 2)
            console.log(scriptName + 'Channel cleaned.')
        }
    }
})

console.log(scriptName + 'Logging in as Discord-Bot')
dcClient.login(process.env.dc_token)