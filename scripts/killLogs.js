const fs = require('fs')
const scriptName = 'kill_logs'


async function doit(disiClient, ftp, nitrAPI, form) {

    const channel = disiClient.channels.cache.find(channel => channel.id === "837295740581445682")
    console.log(scriptName + ': iteration started, getting file by FTP...')

    await ftp.download('killLogs.json')
    let log = JSON.parse(fs.readFileSync('tmp/killLogs.json'));
    console.log(scriptName + ': FTP-Download complete, getting Nitrado-Logs...')

    await nitrAPI.getLogs('kill', true).then(async data => {

        console.log(scriptName + ': Nitrado-Logs downloaded, processing data...')

        for (const line of data) {

            if (
                line.slice(21, 22) == '{'
            ) {

                let formatted = form.killLog(line)
                if (!log[formatted.key]) await channel.send(formatted.line).then(() => {
                    console.log('sent: ' + formatted.key);
                });
                
                log[formatted.key] = formatted.line;

            }
        }

        console.log(scriptName + ': Data processing complete, uploading File by FTP...')

        fs.writeFileSync('tmp/killLogs.json', JSON.stringify(log))
        await ftp.upload('killLogs.json')

        fs.unlink('tmp/killLogs.json', (err) => {
            if (err) throw err;
        })

        console.log(scriptName + ': iteration done')

    })

}


exports.doit = doit