const request = require('request');
const iconv = require('iconv-lite');
const scriptName = ' - nitrapi_comm'

const reqListOptions = {
    'method': 'GET',
    'url': "https://api.nitrado.net/services/" + process.env.serverID + "/gameservers/file_server/list?dir=/games/" + process.env.userID + "/noftp/scum/SCUM/Saved/SaveFiles/Logs/",
    'headers': {
        'Authorization': 'Bearer ' + process.env.apiToken
    }
}

const reqDownloadOptions = {
    'method': 'GET',
    'headers': {
        'Authorization': 'Bearer ' + process.env.apiToken
    }
}

let fileList = []
const fileCache = []

function getFileList(type) {
    return new Promise(resolve => {
        let values = []
        fileList.forEach(el => {
            if (el.includes(type)) values.push(el)
        });
        resolve(values)
    });
}


function getFileDL(downloadUrl) {
    return new Promise(resolve => {
        request({
            ...reqDownloadOptions,
            'url': downloadUrl
        }, function (error, response) {
            if (error) throw new Error(error);
            let resp = JSON.parse(response.body)

            request({
                'url': resp.data.token.url,
                'encoding': null,
            }, function (error, response) {
                if (error) throw new Error(error);

                value = iconv.decode(new Buffer.from(response.body), 'utf16le')
                resolve(value.split(/\r?\n/))

            })

        })
    });
}

async function loadLogs() {
    return new Promise(resolve => {
        console.log(scriptName + ': Loading file-list...')
        request(reqListOptions, function (error, response) {
            if (error) throw new Error(error);
            fileList = []
            let resp = JSON.parse(response.body);
            resp.data.entries.forEach(el => {
                fileList.push(el.name)
            })
            console.log(scriptName + ': Storing currrent file-list...')
            resolve()
        })
    });
}


async function getLogs(type) {
    let files = []
    let logEntries = []

    let downloadUrl = "https://api.nitrado.net/services/" + process.env.serverID + "/gameservers/file_server/download?file=/games/" + process.env.userID + "/noftp/scum/SCUM/Saved/SaveFiles/Logs/";

    console.log(scriptName + ': Getting file-list...')
    files = await getFileList(type)

    let i = 0
    console.log(scriptName + ': Processing files...')
    for (const file of files) {
        if (!fileCache.includes(file)) {
            console.log(scriptName + ': - NEW: ' + file)
            logEntries = logEntries.concat(await getFileDL(downloadUrl + file));
            fileCache.push(file)
            i++
        }
    }

    console.log(scriptName + ': Processed ' + i + ' new files.')
    return logEntries.sort()

}

exports.loadLogs = loadLogs
exports.getLogs = getLogs