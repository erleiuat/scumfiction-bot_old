require('dotenv').config()
// --repeat=15        -> Script wiederholen nach x Sekunden

const Discord = require('discord.js')
const dcClient = new Discord.Client()
const args = require('minimist')(process.argv.slice(2))

const statistics = require.main.require('./src/statistics.js')
const logger = require.main.require('./src/logger.js')
const state = require.main.require('./src/serverState.js')

const scriptName = '- > Main: '

dcClient.on('ready', () => {

    console.log(scriptName + `Logged in as ${dcClient.user.tag}!\n`)

    /*
    logger.start(dcClient, args['repeat'], [
        'kill', 'chat', 'admin', 'login', 'violation'
    ])
    state.start(dcClient)
    */

    statistics.start(dcClient)

})

console.log(scriptName + 'Logging in as Discord-Bot')
dcClient.login(process.env.dc_token)