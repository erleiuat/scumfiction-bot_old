const fs = require('fs')
const Discord = require('discord.js')
const chalk = require('chalk')
const sleep = require.main.require('./plugin/sleep.js')
const ftp = require.main.require('./plugin/ftp.js')
const ftpClient = ftp.client()
const scriptName = chalk.yellow('[STATISTICS] -> ')

const admins = ['76561198058320009', '76561198082374095', '76561198907112461', '76561199166410611']
const regexID = /\(([^)]+)\)/
const regexName = /\:(.*?)\(/
let users = []
let newData = false
let listCache = []

exports.start = async function start(dcClient) {

    let iteration = 1
    let channel = dcClient.channels.cache.find(channel => channel.id === process.env.channel_playtime)
    let channelHidden = dcClient.channels.cache.find(channel => channel.id === process.env.channel_hiddenstats)

    do {
        console.log(scriptName + 'Processing Stats (#' + iteration + ')')
        await updateTimes()
        await updateDC(channel)
        await updateHidden(channelHidden)
        console.log(scriptName + 'Processing Stats done')
        iteration++
        await sleep.timer(60)
    } while (true)

}

async function updateHidden(channel) {

    if (!newData) return
    newData = false
    await clearChannel(channel)
    let hArray = []
    for (u in users) hArray.push({
        steamID: u,
        ...users[u]
    })

    hArray.sort((a, b) => (a.login.getTime() > b.login.getTime()) ? 1 : -1)
    for (let i = 0; i < hArray.length; i++) {
        let formed = getDuration(hArray[i].playtime)
        await channel.send(new Discord.MessageEmbed({
            title: hArray[i].name,
            description: 'SteamID: ' + hArray[i].steamID + '\nPlaytime: ' + formed.d + 'd ' + formed.h + 'h ' + formed.m + 'm \nLast Login: ' + hArray[i].login.toLocaleString() + '\nTotal Logins: ' + hArray[i].totalLogins
        }))
    }

}

async function updateDC(channel) {
    let usersArray = []
    for (u in users)
        if (!admins.includes(u)) usersArray.push(users[u])
    usersArray.sort((a, b) => (a.playtime > b.playtime) ? 1 : -1).reverse()
    if (JSON.stringify(listCache) == JSON.stringify(usersArray)) return
    newData = true
    await clearChannel(channel)
    await sendList(channel, usersArray)
    listCache = usersArray
}

async function sendList(channel, list) {

    let msgs = []
    for (let i = 3; i < list.length; i++) {
        let formed = getDuration(list[i].playtime)
        msgs.push('\n**' + (i + 1) + '. ' + list[i].name + '**\nPlaytime: ' + formed.d + ' Days, ' + formed.h + ' Hours, ' + formed.m + ' Minutes \nLogins: ' + list[i].totalLogins + '\n\n')
    }

    msgs.reverse()
    for (const msg of msgs)
        await channel.send(msg)

    let pTime = getDuration(list[2].playtime)
    await channel.send(new Discord.MessageEmbed({
        title: '3. ' + list[2].name.toUpperCase(),
        color: 'bf8970',
        thumbnail: {
            url: process.env.bot_img_url + 'medal/bronze.png'
        },
        footer: {
            text: list[2].totalLogins + ' Logins'
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
        thumbnail: {
            url: process.env.bot_img_url + 'medal/silver.png'
        },
        footer: {
            text: list[1].totalLogins + ' Logins'
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
        thumbnail: {
            url: process.env.bot_img_url + 'medal/gold.png'
        },
        footer: {
            text: list[0].totalLogins + ' Logins'
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

async function clearChannel(channel) {
    let fetched
    do {
        fetched = await channel.messages.fetch({
            limit: 100
        })
        channel.bulkDelete(fetched)
    } while (fetched.size >= 2)
}

async function updateTimes() {
    let file = await getLogins()
    users = []

    for (entry in file) {

        if (!file[entry].description.includes('logging out')) {

            let date = formDate(file[entry].footer.text)
            let steamID = (file[entry].description.split(' ')[2]).split(':')[0]

            if (!users[steamID]) users[steamID] = {
                name: null,
                tmpID: null,
                login: null,
                playtime: 0,
                totalLogins: 0
            }

            users[steamID].name = (file[entry].description.match(regexName))[1]
            users[steamID].tmpID = (file[entry].description.match(regexID))[1]
            users[steamID].login = date
            users[steamID].totalLogins += 1

        } else {

            let date = formDate(file[entry].footer.text)
            let tmpID = file[entry].description.replace(/\s/g, '').split('\'')[1]

            for (u in users)
                if (users[u].tmpID == tmpID) {
                    users[u].playtime += date.getTime() - users[u].login.getTime()
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