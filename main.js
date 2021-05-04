require('dotenv').config()

const nitrAPI = require('./nitrapi.js')
const formatter = require('./formatter.js')
const Discord = require('discord.js');
const client = new Discord.Client();

/*
let test = formatter.adminLog("2021.05.01-21.07.07: '76561198907112461:TJVirus80(10)' Command: 'location 76561198297305977 true'")
console.log(test)
*/

client.on('ready', () => {

    console.log(`Logged in as ${client.user.tag}!`);

    const channel = client.channels.cache.find(channel => channel.id === "838335232423624724")

    nitrAPI.getLogs('admin').then(data => {
        console.log(typeof data)

        for (const line in data) {
                if(data[line].length >= 1 && !data[line].includes("Game version:") && !data[line].includes("Teleport")) {
                    console.log(data[line])
                        channel.send(
                            formatter.adminLog(data[line])
                        ).then(
                            console.log('sent')
                        );
                }
            }

        channel.send('I bims fini alla');

    })

});

client.login(process.env.botToken);
