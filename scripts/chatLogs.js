const fs = require('fs')
const ftp = require('./ftp.js')
const nitrAPI = require('./nitrapi.js')
const form = require('./form.js')

const scriptName = 'chat_logs'
const fileName = 'chatLogs.json'


async function doit(disiClient) {
    const channel = disiClient.channels.cache.find(channel => channel.id === "837344985334546448")
    console.log('\n' + scriptName + ': iteration started, getting file by FTP...')

    try {
        // ----- Change log-type
        await nitrAPI.getLogs('chat').then(async data => {
            if (data.length > 0) {
                console.log(scriptName + ': Nitrado-Logs downloaded, getting current state by FTP...')
                await ftp.download(fileName)
                let log = JSON.parse(fs.readFileSync('tmp/' + fileName));
                console.log(scriptName + ': FTP-Download complete, processing data...')
                for (const line of data) {
                    if (
                        line.length >= 1 &&
                        !line.includes("Game version:") &&
                        line.split("' '")[1].startsWith('Global:')
                    ) {
                        // ----- Change form-method
                        let formatted = form.chatLog(line)
                        if (!log[formatted.key]) {
                            await channel.send(formatted.line).then(() => {
                                console.log('sent: ' + formatted.key);
                            });
                        }
                        log[formatted.key] = formatted.line;
                    }
                }

                console.log(scriptName + ': Data processing complete, uploading File by FTP...')
                fs.writeFileSync('tmp/' + fileName, JSON.stringify(log))
                await ftp.upload(fileName)
                fs.unlink('tmp/' + fileName, (err) => {
                    if (err) throw err;
                })

            } else console.log(scriptName + ': Nitrado-Logs downloaded, no new Data to process...')
        })

    } catch (error) {
        console.log(scriptName + ': NitrAPI-Error, trying next time. Error:' + error)
    }


    console.log(scriptName + ': iteration done\n')
}

exports.doit = doit