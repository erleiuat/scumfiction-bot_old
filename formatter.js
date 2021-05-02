function adminLog(line) {
    
    let date = line.substring(0, 10)
    let time = line.substring(11, 19).replace(/\./g,":")
    let steamID = line.substring(22, 39)
    let username = line.substring(40)
    username = username.split('(')[0]
    let command = "#" + line.split("Command: '")[1].slice(0,-1)



    return date + " - " + time + " **" + username + "**: " + command


}

exports.adminLog = adminLog