const Discord = require('discord.js')
const nitrAPI = require('./plugins/nitrAPI.js')
const format = require('./plugins/format.js')
const filter = require('./plugins/filter.js')
const check = require('./plugins/check.js')
const scriptName = '- - > Logger: '
const channels = {
    kill: process.env.channel_kill,
    chat: process.env.channel_chat,
    login: process.env.channel_login,
    violation: process.env.channel_violation,
    admin: process.env.channel_admin
}

function sleep(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
}

exports.start = async function start(dcClient, repeat, logs) {

    let fileList = []

    do {

        console.log('-------------------------------------------------------------------------')
        console.log(scriptName + (new Date()).toLocaleString() + ' Starting log-processing')

        let tmpFiles = await nitrAPI.getFileList()
        if (tmpFiles.length < 1) console.log(scriptName + 'No content in filelist')
        else if (JSON.stringify(fileList.sort()) == JSON.stringify(tmpFiles.sort())) console.log(scriptName + 'No new files detected.')
        else {

            console.log(scriptName + 'New files detected!')

            let newFiles = []
            for (const file of tmpFiles)
                if (!fileList.includes(file)) newFiles.push(file)

            for (const log of logs) {

                console.log('\n\n' + scriptName + 'Starting processing of ' + log.toUpperCase() + '-log entries.')
                let channel = dcClient.channels.cache.find(channel => channel.id === channels[log])
                await check.prepare(log)

                let entries = []
                let lines = await nitrAPI.getLogLines(await filterList(log, newFiles))
                for (const line of lines)
                    if (filter.line(log, line)) entries.push(format.line(log, line))
                entries.sort()

                for (const entry of entries)
                    if (!check.existing(log, entry)) {
                        await channel.send(new Discord.MessageEmbed(entry.line))
                        console.log(scriptName + 'Sent: ' + entry.key)
                        check.add(log, entry)
                    }

                await check.finish(log)
                console.log(scriptName + 'Processing of ' + log.toUpperCase() + '-log finished.\n')

            }

            fileList = tmpFiles

        }

        console.log(scriptName + 'Going to sleep for ' + repeat + ' seconds.\n')
        await sleep(repeat)

    } while (repeat)

}

async function filterList(log, list) {
    return new Promise((resolve) => {
        let values = []
        list.forEach(file => {
            if (file.includes(log)) values.push(file)
        })
        resolve(values)
    })
}