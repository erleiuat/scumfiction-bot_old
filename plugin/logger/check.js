const fs = require('fs')
const ftp = require.main.require('./plugin/ftp.js')
const ftpClient = ftp.client()
const scriptName = '[LOGGER] -> Check: '


const checkFiles = {}

exports.prepare = async function prepare(type) {
    console.log(scriptName + 'Getting state by FTP')
    let check = await download(type + '.json')
    if (check && check.code == 550) fs.writeFile('tmp/' + type + '.json', '{}', (error) => {
        if (error) console.log(scriptName + 'There was an error creating file ' + type + '. ' + error)
        else checkFiles[type] = {}
    })
    else checkFiles[type] = JSON.parse(fs.readFileSync('tmp/' + type + '.json'))
    console.log(scriptName + 'Download complete.')
}

exports.existing = function existing(type, entry) {
    if (!checkFiles[type][entry.key]) return false
    else return true
}

exports.add = function add(type, entry) {
    checkFiles[type][entry.key] = entry.line
}

exports.finish = async function finish(type) {
    console.log(scriptName + 'Uploading state by FTP')
    fs.writeFileSync('tmp/' + type + '.json', JSON.stringify(checkFiles[type]))
    await upload(type + '.json')
    console.log(scriptName + 'Upload completed.')
    fs.unlink('tmp/' + type + '.json', (error) => {
        if (error) console.log(scriptName + 'There was an error deleting file ' + type + '. ' + error)
    })
}

async function download(name) {
    try {
        await ftpClient.access(ftp.credentials)
        await ftpClient.downloadTo('tmp/' + name, 'logs/' + name)
    } catch (error) {
        return (error)
    }
    ftpClient.close()
}

async function upload(name) {
    try {
        await ftpClient.access(ftp.credentials)
        await ftpClient.uploadFrom('tmp/' + name, 'logs/' + name)
    } catch (error) {
        console.log(error)
    }
    ftpClient.close()
}