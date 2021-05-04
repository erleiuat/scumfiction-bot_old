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

        console.log(data)

        /*
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
        */

    })

}


client.on('ready', () => {

    console.log(`Logged in as ${client.user.tag}!`);

    // doAdminLogs()
    doKillLogs()

});

client.login(process.env.botToken);