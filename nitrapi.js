const request = require('request');
'use strict';

const fs = require('fs');

function decodeUTF16LE(binaryStr) {
    var cp = [];
    for (var i = 0; i < binaryStr.length; i += 2) {
        cp.push(
            binaryStr.charCodeAt(i) |
            (binaryStr.charCodeAt(i + 1) << 8)
        );
    }
    return String.fromCharCode.apply(String, cp);
}

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

                value = decodeUTF16LE(response.body)
                resolve(value.split(/\r?\n/))

            })

        })
    });
}

async function getLogs(type = "chat") {
    var i = 0;
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
    console.log(files);
    var ende = files.length;
    
    for (const file of files) {
        let list = fs.readFileSync('scannedadminlogs.json');
        let onlist = JSON.parse(list);
        console.log(onlist);
        if(onlist.indexOf(file) == -1)
        {
        let url = downloadUrl + file
        console.log(file)
        let newEntries = await getFileDL(reqDownloadOptions, url)
        logEntries = {...logEntries, ...newEntries}
        }
        else
        {
            console.log("ham wa schon");
            i++;
        }
        if(i == ende)
        {
            let downloaded = JSON.stringify(files);
            fs.writeFileSync('scannedadminlogs.json', downloaded);
        }
        else
        {
            console.log(i);
            i++;
        }
    }

    return logEntries

}

exports.getLogs = getLogs