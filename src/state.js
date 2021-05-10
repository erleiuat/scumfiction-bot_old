const request = require('request')
const sleep = require.main.require('./plugin/sleep.js')
const scriptName = '[STATE] -> '


exports.start = async function start(dcClient) {
    let iteration = 1
    do {
        request({
            'url': process.env.battlemetrics_url
        }, (error, response) => {
            if (error) console.log(error)
            else {
                try {
                    let data = (JSON.parse(response.body))
                    if (data.data) {
                        data = data.data.attributes
                        dcClient.user.setActivity(
                            data.players + ' 👥 | ' + data.details.time.slice(0, -3) + ' 🕒', {
                                type: 'WATCHING'
                            }
                        )
                        console.log(scriptName + 'State updated (#' + iteration + ')')
                        iteration++
                    } else {
                        console.log(scriptName + 'Unable to read Server-Status')
                        dcClient.user.setActivity('-', {
                            type: 'WATCHING'
                        })
                    }
                } catch (e) {
                    console.log(scriptName + 'Unable to read Server-Status')
                }
            }
        })
        await sleep.timer(10)
    } while (true)
}