const fs = require('fs')
const ftp = require('./ftp.js')
const nitrAPI = require('./nitrapi.js')
const form = require('./form.js')
const scriptName = 'admin_logs'


async function doit(disiClient, args) {

    const channel = disiClient.channels.cache.find(channel => channel.id === "838335232423624724")
    console.log('\n' + scriptName + ': iteration started, getting file by FTP...')

    await ftp.download('adminLogs.json')
    let log = JSON.parse(fs.readFileSync('tmp/adminLogs.json'));
    console.log(scriptName + ': FTP-Download complete, getting Nitrado-Logs:')

    await nitrAPI.getLogs('admin', args['cache']).then(async data => {

        console.log(scriptName + ': Nitrado-Logs downloaded, processing data...')

        for (const line of data) {

            if (
                line.length >= 1 &&
                !line.includes("Game version:") &&
                !line.toLowerCase().includes("teleport") &&
                !line.toLowerCase().includes("location")
            ) {

                let formatted = form.adminLog(line)

                if (!log[formatted.key] && !args['nodiscord']) {
                    await channel.send(formatted.line).then(() => {
                        console.log('sent: ' + formatted.key);
                    });
                }
                
                log[formatted.key] = formatted.line;

            }
        }

        console.log(scriptName + ': Data processing complete, uploading File by FTP...')

        fs.writeFileSync('tmp/adminLogs.json', JSON.stringify(log))
        await ftp.upload('adminLogs.json')

        await fs.unlink('tmp/adminLogs.json', (err) => {
            if (err) throw err;
        })
        
        console.log(scriptName + ': iteration done\n\n')

    })

}

exports.doit = doit