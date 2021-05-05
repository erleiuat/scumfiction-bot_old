const fs = require('fs')
const scriptName = 'admin_logs'


async function doit(disiClient, ftp, nitrAPI, form) {

    const channel = disiClient.channels.cache.find(channel => channel.id === "838335232423624724")
    console.log(scriptName + ': iteration started, getting file by FTP...')

    await ftp.download('adminLogs.json')
    let log = JSON.parse(fs.readFileSync('tmp/adminLogs.json'));
    console.log(scriptName + ': FTP-Download complete, getting Nitrado-Logs...')

    await nitrAPI.getLogs('admin').then(async data => {

        console.log(scriptName + ': Nitrado-Logs downloaded, processing data...')

        for (const line of data) {

            if (
                line.length >= 1 &&
                !line.includes("Game version:") &&
                !line.toLowerCase().includes("teleport")
            ) {

                let formatted = form.adminLog(line)

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

        fs.writeFileSync('tmp/adminLogs.json', JSON.stringify(log))
        await ftp.upload('adminLogs.json')

        await fs.unlink('tmp/adminLogs.json', (err) => {
            if (err) throw err;
        })
        
        console.log(scriptName + ': iteration done')

    })

}

exports.doit = doit