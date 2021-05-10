const fs = require('fs')
const Discord = require('discord.js')
const sleep = require.main.require('./plugin/sleep.js')
const ftp = require.main.require('./plugin/ftp.js')
const ftpClient = ftp.client()
const scriptName = '- - > Statistics: '

const admins = ['76561198058320009', '76561198082374095', '76561198907112461', '76561199166410611']
const regexID = /\(([^)]+)\)/
const regexName = /\:(.*?)\(/
let users = []
let listCache = []

exports.start = async function start(dcClient) {
    let channel = dcClient.channels.cache.find(channel => channel.id === process.env.channel_playtime)
    do {
        console.log(scriptName + 'Processing Stats')
        await updateTimes()
        await updateDC(channel)
        console.log(scriptName + 'Processing Stats done')
        await sleep.timer(60)
    } while (true)
}

async function updateDC(channel) {

    let usersArray = []
    for (u in users)
        if (!admins.includes(u)) usersArray.push(users[u])

    usersArray.sort((a, b) => (a.playtime > b.playtime) ? 1 : -1).reverse()
    if (JSON.stringify(listCache) != JSON.stringify(usersArray)) {

        let fetched
        do {
            fetched = await channel.messages.fetch({
                limit: 100
            })
            channel.bulkDelete(fetched)
        } while (fetched.size >= 2)

        await sendList(channel, usersArray)
        listCache = usersArray
    }

}

async function sendList(channel, list) {

    let fields = []
    for (let i = 3; i < list.length; i++) {
        let formed = getDuration(list[i].playtime)
        fields.push({
            name: (i + 1) + '. ' + list[i].name,
            value: formed.d + ' Days, ' + formed.h + ' Hours, ' + formed.m + ' Minutes'
        })
    }

    fields.reverse()
    await channel.send(new Discord.MessageEmbed({
        title: 'Other players',
        fields: fields
    }))

    let pTime = getDuration(list[2].playtime)
    await channel.send(new Discord.MessageEmbed({
        title: '3. ' + list[2].name.toUpperCase(),
        color: 'bf8970',
        description: '**Player number three**',
        thumbnail: {
            url: process.env.bot_img_url + 'medal/bronze.png'
        },
        fields: [{
                name: 'Days',
                value: pTime.d,
                inline: true
            },
            {
                name: 'Hours',
                value: pTime.h,
                inline: true
            },
            {
                name: 'Minutes',
                value: pTime.m,
                inline: true
            }
        ]
    }))

    pTime = getDuration(list[1].playtime)
    await channel.send(new Discord.MessageEmbed({
        title: '2. ' + list[1].name.toUpperCase(),
        color: 'bec2cb',
        description: '**Player number two**',
        thumbnail: {
            url: process.env.bot_img_url + 'medal/silver.png'
        },
        fields: [{
                name: 'Days',
                value: pTime.d,
                inline: true
            },
            {
                name: 'Hours',
                value: pTime.h,
                inline: true
            },
            {
                name: 'Minutes',
                value: pTime.m,
                inline: true
            }
        ]
    }))

    pTime = getDuration(list[0].playtime)
    await channel.send(new Discord.MessageEmbed({
        title: '1. ' + list[0].name.toUpperCase(),
        color: 'fdbf00',
        description: '**Player number one**',
        thumbnail: {
            url: process.env.bot_img_url + 'medal/gold.png'
        },
        fields: [{
                name: 'Days',
                value: pTime.d,
                inline: true
            },
            {
                name: 'Hours',
                value: pTime.h,
                inline: true
            },
            {
                name: 'Minutes',
                value: pTime.m,
                inline: true
            }
        ]
    }))

}

function getDuration(milli) {

    let minutes = milli / 60000
    let hours = minutes / 60
    let days = Math.floor(Math.floor(hours) / 24)
    minutes = (hours - Math.floor(hours)) * 60
    hours = Math.floor(hours) - (days * 24)

    return {
        d: Math.floor(days),
        h: Math.floor(hours),
        m: Math.floor(minutes)
    }

}

async function updateTimes() {
    let file = await getLogins()

    for (entry in file) {

        if (!file[entry].description.includes('logging out')) {

            let date = formDate(file[entry].footer.text)
            let steamID = (file[entry].description.split(' ')[2]).split(':')[0]

            if (!users[steamID]) users[steamID] = {
                name: null,
                tmpID: null,
                login: null,
                playtime: 0
            }

            users[steamID].name = (file[entry].description.match(regexName))[1]
            users[steamID].tmpID = (file[entry].description.match(regexID))[1]
            users[steamID].login = date

        } else {

            let date = formDate(file[entry].footer.text)
            let tmpID = file[entry].description.replace(/\s/g, '').split('\'')[1]

            for (u in users)
                if (users[u].tmpID == tmpID) {
                    users[u].playtime += date.getTime() - users[u].login.getTime()
                    users[u].login = null
                    users[u].tmpID = null
                    break;
                }

        }

    }
}


function formDate(dateStr) {
    let dp = dateStr.split(' - ')
    dp[0] = dp[0].split('.')
    return new Date(dp[0][2] + '-' + dp[0][1] + '-' + dp[0][0] + 'T' + dp[1])
}


async function getLogins() {
    try {
        await ftpClient.access(ftp.credentials)
        await ftpClient.downloadTo('tmp/loginStats.json', 'logs/login.json')
    } catch (error) {
        return (error)
    }
    ftpClient.close()
    return JSON.parse(fs.readFileSync('tmp/loginStats.json'))
}




/*




"2021_05_09-15_24_12_'77_20_26_22476561198082374095_lox(23)'loggedin": {
    color: '000000',
    description: " '77.20.26.224 76561198082374095:Lox(23)' logged in",
    footer: { text: '09.05.2021 - 17:24:12' }
  },


  "2021_05_09-16_00_31_'19'loggingout": {
    color: '000000',
    description: " '19' logging out",
    footer: { text: '09.05.2021 - 18:00:31' }
  }


  "2021_05_09-15_33_52_'23'loggingout": {
    color: '000000',
    description: " '23' logging out",
    footer: { text: '09.05.2021 - 17:33:52' }
  },


  */