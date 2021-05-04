require('dotenv').config()
const fs = require('fs');
const nitrAPI = require('./nitrapi.js')
const formatter = require('./formatter.js')
const Discord = require('discord.js');
const client = new Discord.Client();


function doAdminLogs() {

    const channel = client.channels.cache.find(channel => channel.id === "838335232423624724")

    nitrAPI.getLogs('admin').then(async data => {

        let adminLog = JSON.parse(fs.readFileSync('scanned/adminLogs.json'));

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

        fs.writeFileSync('scanned/adminLogs.json', JSON.stringify(adminLog));
        console.log('admin-log iteration finished')

    })

}


function doKillLogs() {

    const channel = client.channels.cache.find(channel => channel.id === "837295740581445682")

    nitrAPI.getLogs('kill').then(async data => {

        let killLog = JSON.parse(fs.readFileSync('scanned/killLog.json'));


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

        fs.writeFileSync('scanned/killLog.json', JSON.stringify(killLog));
        console.log('kill-log iteration finished')

    })

}


function doChatLogs() {

    const channel = client.channels.cache.find(channel => channel.id === "837344985334546448")

    nitrAPI.getLogs('chat').then(async data => {

        let chatLog = JSON.parse(fs.readFileSync('scanned/chatLog.json'));

        for (const line of data) {

            if (
                line.length >= 1 &&
                !line.includes("Game version:") &&
                line.split("' '")[1].startsWith('Global:')
            ) {

                let formatted = formatter.chatLog(line)

                /*
                
                if (!chatLog[formatted.key]) {
                    await channel.send(
                        formatted.line
                    ).then(() => {
                        chatLog[formatted.key] = formatted.line;
                        console.log('sent: ' + formatted.key);
                    });
                } 
                
                */


            }

        }

        fs.writeFileSync('scanned/chatLog.json', JSON.stringify(chatLog));
        console.log('chat-log iteration finished')

    })

}


client.on('ready', () => {

    console.log(`Logged in as ${client.user.tag}!`);
    
    doChatLogs()
    doAdminLogs()
    doKillLogs()

    setInterval(() => {

        doChatLogs()
        doAdminLogs()
        doKillLogs()

    }, 60000);

});

client.login(process.env.botToken);