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
    let message = line.split("' '")[1]

    const regex = new RegExp(/([^:]*)/g);
    const regexname = /\(([^)]+)\).*/gm;
    var matches = line.match(regex);

    matches.forEach(el => {
        console.log(el)
        var playerid = e1[4].match(regexname);
        var playername = e1[4].replace(playerid, '');
        return playername;
    })

    let lineFormatted = `\`\`\`ini\nTime: [ ` + date + ` - ` + time + ` ] User: [ ` + playername + ` ]\nMessage: [ ` + message + ` ]  \`\`\``

    return {
        'key': date + '.' + time + '.' + steamID,
        'line': lineFormatted
    }

}

exports.adminLog = adminLog
exports.killLog = killLog
exports.chatLog = chatLog