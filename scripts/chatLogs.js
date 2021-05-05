const fs = require('fs')
const scriptName = 'chat_logs'


async function doit(disiClient, ftp, nitrAPI, form) {

    const channel = disiClient.channels.cache.find(channel => channel.id === "837344985334546448")
    console.log(scriptName + ': iteration started, getting file by FTP...')

    await ftp.download('chatLogs.json')
    let log = JSON.parse(fs.readFileSync('tmp/chatLogs.json'));
    console.log(scriptName + ': FTP-Download complete, getting Nitrado-Logs...')

    await nitrAPI.getLogs('chat').then(async data => {

        console.log(scriptName + ': Nitrado-Logs downloaded, processing data...')

        for (const line of data) {

            if (
                line.length >= 1 &&
                !line.includes("Game version:") &&
                line.split("' '")[1].startsWith('Global:')
            ) {

                let formatted = form.chatLog(line)

                if (!log[formatted.key]) {
                    await channel.send(
                        formatted.line
                    ).then(() => {
                        log[formatted.key] = formatted.line;
                        console.log('sent: ' + formatted.key);
                    });
                }

                /*
                log[formatted.key] = formatted.line;
                */

            }

        }

        console.log(scriptName + ': Data processing complete, uploading File by FTP...')

        fs.writeFileSync('tmp/chatLogs.json', JSON.stringify(log))
        await ftp.upload('chatLogs.json')

        await fs.unlink('tmp/chatLogs.json', (err) => {
            if (err) throw err;
        })

        console.log(scriptName + ': iteration done')

    })
}


exports.doit = doit