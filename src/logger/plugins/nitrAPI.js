const request = require('request')
const iconv = require('iconv-lite')

const scriptName = '- - - > NitrAPI: '
let downloadURL = 'https://api.nitrado.net/services/' + process.env.serverID + '/gameservers/file_server/download?file=/games/' + process.env.userID + '/noftp/scum/SCUM/Saved/SaveFiles/Logs/'

exports.getFileList = async function getFileList() {
    return new Promise((resolve) => {

        console.log(scriptName + 'Getting filelist from Nitrado...')
        let fileList = []

        request({
            'method': 'GET',
            'url': 'https://api.nitrado.net/services/' + process.env.serverID + '/gameservers/file_server/list?dir=/games/' + process.env.userID + '/noftp/scum/SCUM/Saved/SaveFiles/Logs/',
            'headers': {
                'Authorization': 'Bearer ' + process.env.apiToken
            }
        }, (error, response) => {
            if (error) {
                console.log(scriptName + 'there was an error while getting filelist. ' + error)
                resolve(false)
            } else {
                let data = (JSON.parse(response.body)).data.entries
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
        for (const line of allLines) lines.push(line)
    }
    return (lines)
}


async function downloadLogFile(name) {
    return new Promise((resolve) => {
        console.log(scriptName + 'Downloading and processing ' + name)
        request({
            'method': 'GET',
            'url': downloadURL + name,
            'headers': {
                'Authorization': 'Bearer ' + process.env.apiToken
            }
        }, (error, response) => {
            if (error) {
                console.log(scriptName + 'there was an error while getting download-url for ' + name + '. ' + error)
                resolve(false)
            } else {
                request({
                    'url': (JSON.parse(response.body)).data.token.url,
                    'encoding': null,
                }, (error, response) => {
                    if (error) {
                        console.log(scriptName + 'there was an error while getting download-url for ' + name + '. ' + error)
                        resolve(false)
                    } else {
                        value = iconv.decode(new Buffer.from(response.body), 'utf16le')
                        resolve(value.split(/\r?\n/))
                    }
                })
            }
        })
    })
}