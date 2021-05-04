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
    let content = JSON.parse(line.substring(21))

    let lineFormatted = `\`\`\`ini\nTime: [ ` + date + ` - ` + time + ` ]\n[ ` + content.Killer.ProfileName + ` ] killed [ ` + content.Victim.ProfileName + ` ] \n\`\`\``

    return {
        'key': date + '.' + time + '.' + content.Victim.UserId,
        'line': lineFormatted
    }

}




function chatLog(line) {

    let date = line.substring(0, 10)
    let time = line.substring(11, 19).replace(/\./g, ":")
    let steamID = line.substring(22, 39)
    let username = 'WIP'
    let message = line.split("' '")[1]

    const regex = new RegExp(/([^:]*)/g);
    var matches = line.match(regex);
    matches.forEach(match)

    function match(item, index, arr) {
        
        console.log(arr[0])
        console.log(arr[2])
        console.log(arr[4])
        console.log(arr[6])
    }

    let lineFormatted = `\`\`\`ini\nTime: [ ` + date + ` - ` + time + ` ] User: [ ` + username + ` ]\nMessage: [ ` + message + ` ]  \`\`\``

    return {
        'key': date + '.' + time + '.' + steamID,
        'line': lineFormatted
    }

}



exports.adminLog = adminLog
exports.killLog = killLog
exports.chatLog = chatLog