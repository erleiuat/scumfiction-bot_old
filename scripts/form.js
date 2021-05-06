function adminLog(line) {

    let date = line.substring(0, 10).replace(/\./g, "-")
    let time = line.substring(11, 19).replace(/\./g, ":")
    let dateObj = new Date(date + 'T' + time)
    dateObj.setHours(dateObj.getHours() + 2)
    date = dateObj.getDate() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getFullYear()
    time = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()

    let steamID = line.substring(22, 39)
    let command = "#" + line.split("Command: '")[1].slice(0, -1)
    let username = line.substring(40)
    username = username.split('(')[0]

    let lineFormatted = `\`\`\`ini\n[ Time ] ` + date + ` - ` + time + `\n[ User ] ` + username + `\n[ Command ] ` + command + `\`\`\``

    return {
        'key': date + '.' + time + '.' + steamID,
        'line': lineFormatted
    }

}


function killLog(line) {

    let date = line.substring(0, 10).replace(/\./g, "-")
    let time = line.substring(11, 19).replace(/\./g, ":")
    let dateObj = new Date(date + 'T' + time)
    dateObj.setHours(dateObj.getHours() + 2)
    date = dateObj.getDate() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getFullYear()
    time = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()

    let content = JSON.parse(line.substring(21))
    let distance = 0;

    if (content.Killer.ServerLocation.X) {
        var dx = content.Killer.ServerLocation.X - content.Victim.ServerLocation.X;
        var dy = content.Killer.ServerLocation.Y - content.Victim.ServerLocation.Y;
        var dz = content.Killer.ServerLocation.Z - content.Victim.ServerLocation.Z;
        var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
        distance = Math.round(dist / 100);
    }

    let lineFormatted = `\`\`\`ini\n[ Time ] ` + date + ` - ` + time + `\n[ Victim ] ` + content.Killer.ProfileName + `\n[ Killer ] ` + content.Victim.ProfileName + ` \n[ With ] ` + content.Weapon
    if (distance > 0) lineFormatted += `\n[ Distance ] ` + distance + `m `
    lineFormatted += `\`\`\``

    return {
        'key': date + '.' + time + '.' + content.Victim.UserId,
        'line': lineFormatted
    }

}

function chatLog(line) {

    let date = line.substring(0, 10).replace(/\./g, "-")
    let time = line.substring(11, 19).replace(/\./g, ":")
    let dateObj = new Date(date + 'T' + time)
    dateObj.setHours(dateObj.getHours() + 2)
    date = dateObj.getDate() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getFullYear()
    time = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()

    let regexname = /\(([^)]+)\).*/gm;
    let steamID = line.substring(22, 39)
    let parts = line.split("' 'Global: ")
    let message = parts[1].slice(0, -1)
    let usernameID = parts[0].slice(40).match(regexname)
    let username = parts[0].slice(40).replace(usernameID, '')

    let lineFormatted = `\`\`\`ini\n[ Time ] ` + date + ` - ` + time + `\n[ User ] ` + username + `\n\n` + message + `  \`\`\``

    return {
        'key': date + '.' + time + '.' + steamID,
        'line': lineFormatted
    }

}

function loginLog(line) {
    return {
        'key': line,
        'line': line
    }
}

exports.adminLog = adminLog
exports.killLog = killLog
exports.chatLog = chatLog
exports.loginLog = loginLog