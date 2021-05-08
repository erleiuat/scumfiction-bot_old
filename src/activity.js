const request = require('request')
const scriptName = '- - > Logger: '


function sleep(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
}

exports.start = async function start(dcClient) {
    do {
        request({
            'url': 'https://api.hellbz.de/scum/api.php?address=195.82.158.136&port=8017'
        }, function (error, response) {
            if (error) {
                console.log(error)
            } else {
                let data = (JSON.parse(response.body)).data
                if (data && data.length > 0) {
                    dcClient.user.setActivity(
                        data[0].players + ' Players online | ' + data[0].time, {
                            type: 'WATCHING'
                        }
                    )
                } else {
                    console.log(scriptName + 'Unable to read Server-Status')
                }
            }
        })
        await sleep(30)
    } while (true)
}