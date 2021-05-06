/*

Start-Argumente:
repeat      -> Script wiederholen
t=500       -> Script wiederholen alle x Sekunden
cache       -> Nicht jedes Mal alle Logs von Nitrado ziehen sondern nur die neusten
noDiscord   -> Nicht auf Discord senden, sondern nur auf FTP speichern

*/

require('dotenv').config()
const repeat = process.argv.includes('repeat')
const repeatInterval = process.argv.indexOf('-t=')
console.log(process.argv)
console.log(repeatInterval)


const Discord = require('discord.js')
const fs = require('fs')
const disiClient = new Discord.Client()

const ftp = require('./scripts/ftp.js')
const nitrAPI = require('./scripts/nitrapi.js')
const form = require('./scripts/form.js')

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

        console.log('--------------------------------------')
        let current = new Date();
        console.log(current.toLocaleString())

        //await killLogs.doit(disiClient, ftp, nitrAPI, form)
        //await chatLogs.doit(disiClient, ftp, nitrAPI, form)
        //await adminLogs.doit(disiClient, ftp, nitrAPI, form)
        //await loginLogs.doit(disiClient, ftp, nitrAPI, form)
        // await violationLogs.doit(disiClient)

        if (repeat) {
            console.log('Going to sleep for ' +  + ' Seconds...')
            console.log('--------------------------------------')
            await sleep(300)
        }

    } while (repeat)

}


disiClient.on('ready', () => {

    console.log(`Logged in as ${disiClient.user.tag}!`)
    doInteration()

});


disiClient.login(process.env.botToken);