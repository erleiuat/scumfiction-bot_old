const fs = require('fs')
const ftp = require('./ftp.js')
const nitrAPI = require('./nitrapi.js')
const form = require('./form.js')
const scriptName = 'login_logs'


async function doit(disiClient, args) {

    const channel = disiClient.channels.cache.find(channel => channel.id === "839431747657138176")
    console.log('\n' + scriptName + ': iteration started, getting file by FTP...')

    await ftp.download('loginLogs.json')
    let log = JSON.parse(fs.readFileSync('tmp/loginLogs.json'));
    console.log(scriptName + ': FTP-Download complete, getting Nitrado-Logs:')

    await nitrAPI.getLogs('login', args['cache']).then(async data => {

        console.log(scriptName + ': Nitrado-Logs downloaded, processing data...')

        for (const line of data) {

            if (
                line.length >= 1 &&
                !line.includes("Game version:")
            ) {

                if (!log.entries.includes(line)) {
                    await channel.send(`\`\`\`\n` + line + `\n\`\`\``).then(() => {
                        log.entries.push(line)
                        console.log('sent: ' + line);
                    });
                }

            }
        }

        console.log(scriptName + ': Data processing complete, uploading File by FTP...')

        fs.writeFileSync('tmp/loginLogs.json', JSON.stringify(log))
        await ftp.upload('loginLogs.json')

        await fs.unlink('tmp/loginLogs.json', (err) => {
            if (err) throw err;
        })

        console.log(scriptName + ': iteration done\n\n')

    })

}

exports.doit = doit