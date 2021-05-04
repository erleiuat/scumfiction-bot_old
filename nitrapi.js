const request = require('request');
const iconv = require('iconv-lite');

'use strict';


function getFileList(options, type) {
    return new Promise(resolve => {
        request(options, function (error, response) {
            if (error) throw new Error(error);

            let values = []
            let resp = JSON.parse(response.body);

            resp.data.entries.forEach(el => {
                if (el.name.includes(type)) {
                    values.push(el.name);
                }
            });

            resolve(values)
        })
    });
}


function getFileDL(options, downloadUrl) {
    return new Promise(resolve => {
        request({
            ...options,
            'url': downloadUrl
        }, function (error, response) {
            if (error) throw new Error(error);
            let resp = JSON.parse(response.body)

            request({
                'url': resp.data.token.url
            }, function (error, response) {
                if (error) throw new Error(error);

                value = iconv.decode(new Buffer.from(response.body), 'utf16le')
                resolve(value.split(/\r?\n/))

            })

        })
    });
}


async function getLogs(type = "chat") {
    let files = []
    let logEntries = []

    let reqListOptions = {
        'method': 'GET',
        'url': "https://api.nitrado.net/services/" + process.env.serverID + "/gameservers/file_server/list?dir=/games/" + process.env.userID + "/noftp/scum/SCUM/Saved/SaveFiles/Logs/",
        'headers': {
            'Authorization': 'Bearer ' + process.env.apiToken
        }
    }

    let reqDownloadOptions = {
        'method': 'GET',
        'headers': {
            'Authorization': 'Bearer ' + process.env.apiToken
        }
    }

    let downloadUrl = "https://api.nitrado.net/services/" + process.env.serverID + "/gameservers/file_server/download?file=/games/" + process.env.userID + "/noftp/scum/SCUM/Saved/SaveFiles/Logs/";
    files = await getFileList(reqListOptions, type)
    for (const file of files)
        logEntries = logEntries.concat(await getFileDL(reqDownloadOptions, downloadUrl + file));

    return logEntries.sort()

}


exports.getLogs = getLogs