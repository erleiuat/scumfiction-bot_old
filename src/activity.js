const request = require('request')

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
                let data = (JSON.parse(response.body)).data[0]
                dcClient.user.setActivity(
                    data.players + ' Players online | ' + data.time, {
                        type: 'WATCHING'
                    }
                )
            }
        })
        await sleep(30)
    } while (true)
}