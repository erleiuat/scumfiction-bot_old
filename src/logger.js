const Discord = require('discord.js')
const nitrAPI = require.main.require('./plugin/logger/nitrAPI.js')
const format = require.main.require('./plugin/logger/format.js')
const filter = require.main.require('./plugin/logger/filter.js')
const check = require.main.require('./plugin/logger/check.js')
const sleep = require.main.require('./plugin/sleep.js')
const scriptName = '[LOGGER] -> '
const channels = {
    kill: process.env.channel_kill,
    chat: process.env.channel_chat,
    login: process.env.channel_login,
    violation: process.env.channel_violation,
    admin: process.env.channel_admin,
    dump: process.env.channel_dump
}

exports.start = async function start(dcClient, repeat, logs) {
    let fileList = []
    let iterations = 0
    do {

        iterations++
        console.log(scriptName + '-------------------------------------------------------------------------')
        console.log(scriptName + (new Date()).toLocaleString() + ' Starting log-processing (#' + iterations + ')')

        let tmpFiles = await nitrAPI.getFileList()
        if (tmpFiles.length < 1) console.log(scriptName + 'No content in filelist')
        else if (JSON.stringify(fileList.sort()) == JSON.stringify(tmpFiles.sort())) console.log(scriptName + 'No new files detected.')
        else {

            console.log(scriptName + 'New files detected!')
            let allLines = []
            let newFiles = []
            for (const file of tmpFiles)
                if (!fileList.includes(file)) newFiles.push(file)

            for (const log of logs) {
                console.log('\n\n' + scriptName + 'Starting processing of ' + log.toUpperCase() + '-log entries.')
                let channel = dcClient.channels.cache.find(channel => channel.id === channels[log])
                await check.prepare(log)

                let entries = []
                let lines = await nitrAPI.getLogLines(await filterList(log, newFiles))
                for (const line of lines) {
                    if (filter.line(log, line)) entries.push(format.line(log, line))
                    allLines.push({
                        type: log,
                        content: line
                    })
                }

                entries.sort()

                for (const entry of entries)
                    if (!check.existing(log, entry)) {
                        await channel.send(new Discord.MessageEmbed(entry.line))
                        console.log(scriptName + 'Sent "' + log.toUpperCase() + '": ' + entry.key)
                        check.add(log, entry)
                    }

                await check.finish(log)
                console.log(scriptName + 'Processing of ' + log.toUpperCase() + '-log finished.')

            }

            fileList = tmpFiles

            if (iterations > 1) {
                console.log(scriptName + 'Writing everything into dump-channel...')
                allLines = format.allLines(allLines)
                let channel = dcClient.channels.cache.find(channel => channel.id === channels.dump)

                for (const line of allLines) {
                    await channel.send(new Discord.MessageEmbed({
                        color: line.color,
                        footer: {
                            text: line.type.toUpperCase() + ': ' + line.time
                        },
                        description: line.content
                    }))
                    console.log(scriptName + 'Sent "DUMP": ' + line.type)
                }
            }

        }

        console.log(scriptName + 'Going to sleep for ' + repeat + ' seconds.\n')
        await sleep.timer(repeat)

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