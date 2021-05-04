function adminLog(line) {

    let date = line.substring(0, 10)
    let time = line.substring(11, 19).replace(/\./g, ":")
    let steamID = line.substring(22, 39)
    let username = line.substring(40)
    username = username.split('(')[0]
    let command = "#" + line.split("Command: '")[1].slice(0, -1)

    let lineFormatted = `\`\`\`ini\nTime: [ ` + date + ` - ` + time + ` ] User: [ ` + username + ` ]\nCommand: [ ` + command + ` ]  \`\`\``

    return {
        'key': date + '.' + time + '.' + steamID,
        'line': lineFormatted
    }

}   

function killLog(line) {

    let date = line.substring(0, 10)
    let time = line.substring(11, 19).replace(/\./g, ":")
    let steamID = line.substring(22, 39)
    let username = line.substring(40)
    username = username.split('(')[0]
    let command = "#" + line.split("Command: '")[1].slice(0, -1)

    let lineFormatted = `\`\`\`ini\nTime: [ ` + date + ` - ` + time + ` ] User: [ ` + username + ` ]\nCommand: [ ` + command + ` ]  \`\`\``

    return {
        'key': date + '.' + time + '.' + steamID,
        'line': lineFormatted
    }

}   


exports.adminLog = adminLog
exports.killLog = killLog