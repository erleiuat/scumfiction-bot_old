/*

Start-Argumente:
--repeat=500        -> Script wiederholen nach x Sekunden

*/

require('dotenv').config()
const args = require('minimist')(process.argv.slice(2))
const repeat = false || args['repeat']

const Discord = require('discord.js')
const disiClient = new Discord.Client()
const nitrAPI = require('./scripts/nitrapi.js')

const adminLogs = require('./scripts/adminLogs.js')
const killLogs = require('./scripts/killLogs.js')
const chatLogs = require('./scripts/chatLogs.js')
const loginLogs = require('./scripts/loginLogs.js')
// const violationLogs = require('./scripts/violationLogs.js')


function sleep(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}


async function doInteration() {

    do {

        let current = new Date();
        console.log('\n----------------------------------------------')
        console.log(current.toLocaleString())
        console.log('----------------------------------------------\n')

        await nitrAPI.loadLogs()
        await killLogs.doit(disiClient)
        await chatLogs.doit(disiClient)
        await adminLogs.doit(disiClient)
        await loginLogs.doit(disiClient)
        /*
        await violationLogs.doit(disiClient)
        */

        if (repeat) {
            console.log('Going to sleep for ' + repeat + ' Seconds...')
            await sleep(repeat)
        }

    } while (repeat)

}

disiClient.on('ready', () => {

    console.log(`\nLogged in as ${disiClient.user.tag}!\n`)
    doInteration()

});

disiClient.login(process.env.botToken);