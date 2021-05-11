const chalk = require('chalk')
const request = require('request')
const iconv = require('iconv-lite')
const scriptName = chalk.blue('[LOGGER] -> NitrAPI: ')


exports.getFileList = async function getFileList() {
    return new Promise((resolve) => {

        console.log(scriptName + 'Getting filelist from Nitrado...')
        let fileList = []

        request({
            'method': 'GET',
            'url': 'https://api.nitrado.net/services/' + process.env.server_id + '/gameservers/file_server/list?dir=/games/' + process.env.user_id + '/noftp/scum/SCUM/Saved/SaveFiles/Logs/',
            'headers': {
                'Authorization': 'Bearer ' + process.env.api_token
            }
        }, (error, response) => {
            if (error) {
                console.log(scriptName + chalk.red('there was an error while getting filelist. ' + error))
                resolve(false)
            } else {
                let data = []
                try {
                    data = (JSON.parse(response.body)).data.entries
                } catch (error) {
                    console.log(scriptName + chalk.red('there was an error while getting filelist. ' + error))
                    resolve(false)
                    return
                }
                data.forEach(file => {
                    fileList.push(file.name)
                })
                console.log(scriptName + 'Filelist download successful.')
                resolve(fileList)
            }
        })

    })
}

exports.getLogLines = async function getLogLines(fileList) {
    let lines = []
    for (const file of fileList) {
        let allLines = await downloadLogFile(file)
        if (!allLines) continue
        for (const line of allLines)
            if (line && line.length >= 10 && !line.includes('Game version:')) lines.push(line)
    }
    return (lines)
}


async function downloadLogFile(name) {
    return new Promise((resolve) => {
        console.log(scriptName + 'Downloading and processing ' + name)
        request({
            'method': 'GET',
            'url': 'https://api.nitrado.net/services/' + process.env.server_id + '/gameservers/file_server/download?file=/games/' + process.env.user_id + '/noftp/scum/SCUM/Saved/SaveFiles/Logs/' + name,
            'headers': {
                'Authorization': 'Bearer ' + process.env.api_token
            }
        }, (error, response) => {
            if (error) {
                console.log(scriptName + chalk.red('there was an error while getting download-url for ' + name + '. ' + error))
                resolve(false)
            } else {
                try {
                    let url = JSON.parse(response.body)
                    request({
                        'url': url.data.token.url,
                        'encoding': null,
                    }, (error, response) => {
                        if (error) {
                            console.log(scriptName + chalk.red('there was an error while getting download-url for ' + name + '. ' + error))
                            resolve(false)
                        } else {
                            value = iconv.decode(new Buffer.from(response.body), 'utf16le')
                            resolve(value.split(/\r?\n/))
                        }
                    })
                } catch (error) {
                    console.log(scriptName + chalk.red('there was an error while getting download-url for ' + name + '. ' + error))
                    resolve(false)
                    return
                }
            }
        })
    })
}