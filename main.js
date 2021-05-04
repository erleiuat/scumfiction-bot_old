require('dotenv').config()


const fs = require('fs')
const Discord = require('discord.js')
const ftp = require("basic-ftp")

const nitrAPI = require('./nitrapi.js')
const formatter = require('./formatter.js')

const client = new Discord.Client()
const ftpClient = new ftp.Client()



async function ftpDown(name) {

    try {

        await ftpClient.access({
            host: "malta.metanet.ch",
            user: process.env.ftpUser,
            password: process.env.ftpPass,
            secure: true
        })

        await ftpClient.downloadTo("tmp/" + name, name)

    } catch (err) {
        console.log(err)
    }

    ftpClient.close()

}


async function ftpUp(name) {

    try {

        await ftpClient.access({
            host: "malta.metanet.ch",
            user: process.env.ftpUser,
            password: process.env.ftpPass,
            secure: true
        })

        await ftpClient.uploadFrom("tmp/" + name, name)

    } catch (err) {
        console.log(err)
    }

    ftpClient.close()

}



async function doAdminLogs() {

    const channel = client.channels.cache.find(channel => channel.id === "838335232423624724")
    await ftpDown('adminLogs.json')

    await nitrAPI.getLogs('admin').then(async data => {

        let adminLog = JSON.parse(fs.readFileSync('tmp/adminLogs.json'));

        for (const line of data) {

            if (
                line.length >= 1 &&
                !line.includes("Game version:") &&
                !line.toLowerCase().includes("teleport")
            ) {

                let formatted = formatter.adminLog(line)

                if (!adminLog[formatted.key]) {

                    await channel.send(
                        formatted.line
                    ).then(() => {
                        adminLog[formatted.key] = formatted.line;
                        console.log('sent: ' + formatted.key);
                    });

                }

            }
        }

        fs.writeFileSync('tmp/adminLogs.json', JSON.stringify(adminLog))
        await ftpUp('adminLogs.json')

        fs.unlink('tmp/adminLogs.json', (err) => {
            if (err) throw err;
            console.log('adminLogs iteration finished')
        })


    })

}


async function doKillLogs() {

    const channel = client.channels.cache.find(channel => channel.id === "837295740581445682")
    await ftpDown('killLogs.json')

    await nitrAPI.getLogs('kill').then(async data => {

        let killLog = JSON.parse(fs.readFileSync('tmp/killLogs.json'));


        for (const line of data) {


            if (
                line.slice(21, 22) == '{'
            ) {

                let formatted = formatter.killLog(line)

                if (!killLog[formatted.key]) {
                    await channel.send(
                        formatted.line
                    ).then(() => {
                        killLog[formatted.key] = formatted.line;
                        console.log('sent: ' + formatted.key);
                    });
                }
                
            }

        }

        fs.writeFileSync('tmp/killLogs.json', JSON.stringify(killLog))
        await ftpUp('killLogs.json')

        fs.unlink('tmp/killLogs.json', (err) => {
            if (err) throw err;
            console.log('killLogs iteration finished')
        })

    })

}


async function doChatLogs() {

    const channel = client.channels.cache.find(channel => channel.id === "837344985334546448")
    await ftpDown('chatLogs.json')

    await nitrAPI.getLogs('chat').then(async data => {

        let chatLog = JSON.parse(fs.readFileSync('tmp/chatLogs.json'));

        for (const line of data) {

            if (
                line.length >= 1 &&
                !line.includes("Game version:") &&
                line.split("' '")[1].startsWith('Global:')
            ) {

                let formatted = formatter.chatLog(line)


            }

        }

        fs.writeFileSync('tmp/chatLogs.json', JSON.stringify(chatLog))
        await ftpUp('chatLogs.json')

        fs.unlink('tmp/chatLogs.json', (err) => {
            if (err) throw err;
            console.log('chatLogs iteration finished')
        })

    })

}


async function doInteration() {

    console.log('--------------------------------------')
    let current = new Date();
    console.log(current.toLocaleString())

    
    await doAdminLogs()
    await doKillLogs()
    //await doChatLogs()
    

}


client.on('ready', () => {

    console.log(`Logged in as ${client.user.tag}!`)
    doInteration()

    setInterval(() => {
        doInteration()
    }, 120000);

});

client.login(process.env.botToken);