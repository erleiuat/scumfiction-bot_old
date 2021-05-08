const fs = require('fs')
const ftp = require('./ftp.js')
const nitrAPI = require('./nitrapi.js')
const formatter = require('./form.js')
const scriptName = 'violation_logs'


async function doit(disiClient) {

    const channel = disiClient.channels.cache.find(channel => channel.id === "839449198588198913")
    console.log(scriptName + ': iteration started, getting file by FTP...')

    await ftp.download('violationLogs.json')
    let log = JSON.parse(fs.readFileSync('tmp/violationLogs.json'));
    console.log(scriptName + ': FTP-Download complete, getting Nitrado-Logs...')

    await nitrAPI.getLogs('violations').then(async data => {

        console.log(scriptName + ': Nitrado-Logs downloaded, processing data...')

        for (const line of data) {

            if (
                line.length >= 1
            ) {

                console.log(line)

                /*
                let formatted = formatter.violationLog(line)

                if (!log[formatted.key]) {
                    await channel.send(
                        formatted.line
                    ).then(() => {
                        log[formatted.key] = formatted.line;
                        console.log('sent: ' + formatted.key);
                    });
                }

                log[formatted.key] = formatted.line;
                */

            }
        }

        console.log(scriptName + ': Data processing complete, uploading File by FTP...')

        fs.writeFileSync('tmp/violationLogs.json', JSON.stringify(log))
        await ftp.upload('violationLogs.json')

        await fs.unlink('tmp/violationLogs.json', (err) => {
            if (err) throw err;
        })
        
        console.log(scriptName + ': iteration done')

    })

}

exports.doit = doit