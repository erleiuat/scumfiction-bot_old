require('dotenv').config()
// --repeat=15        -> Script wiederholen nach x Sekunden

const Discord = require('discord.js')
const dcClient = new Discord.Client()
const args = require('minimist')(process.argv.slice(2))
const repeat = false || args['repeat']

const logger = require('./src/logger/logger.js')
const state = require('./src/serverState.js')

const scriptName = '- > Main: '

dcClient.on('ready', () => {

    console.log(scriptName + `Logged in as ${dcClient.user.tag}!\n`)

    logger.start(dcClient, repeat, [
        'kill', 'chat', 'admin', 'login', 'violation'
    ])

    state.start(dcClient)

})

console.log(scriptName + 'Logging in as Discord-Bot')
dcClient.login(process.env.dcToken)