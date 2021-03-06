const chalk = require('chalk')
const wpImg = require.main.require('./plugin/logger/weaponList.js').image
const scriptName = chalk.blue('[LOGGER] -> Format: ')
const regexname = /\(([^)]+)\).*/gm

exports.line = function line(type, line) {
    if (type == 'chat') return chat(line)
    else if (type == 'kill') return kill(line)
    else if (type == 'admin') return admin(line)
    else if (type == 'login') return login(line)
    else if (type == 'violation') return violation(line)
    else {
        console.log(scriptName + 'Log-type not recognized.')
        return false
    }
}

exports.allLines = function allLines(allLines) {

    let newLines = []
    allLines.sort((a, b) => {
        if (a.content < b.content) return -1
        if (a.content > b.content) return 1
        return 0
    })

    for (const line of allLines) {
        let color = 'ffffff'
        if (line.type == 'kill') color = 'ff0000'
        else if (line.type == 'chat') color = '0000ff'
        else if (line.type == 'admin') color = '00ff00'
        else if (line.type == 'login') color = '242424'
        else if (line.type == 'violation') color = 'ffff00'
        let d = formTime(line.content)
        newLines.push({
            color: color,
            type: line.type,
            time: d.date + ' - ' + d.time,
            content: line.content.slice(20)
        })
    }

    return newLines

}

function hasImg(weapon) {
    if (!weapon) return false
    if (weapon.includes('_C')) weapon = weapon.split('_C')[0].replace(/\s/g, '')
    if (wpImg[weapon]) return process.env.bot_img_url + 'weapon/' + wpImg[weapon]
}

function admin(line) {

    let t = formTime(line)
    let steamID = line.substring(22, 39)
    let command = '#' + line.split('Command: \'')[1].slice(0, -1)
    let username = (line.substring(40)).split('(')[0]

    return {
        'key': (t.date + '_' + t.time + '_' + steamID).replace(/:/g, '_').replace(/\./g, '_'),
        'line': {
            'color': '000000',
            'fields': [{
                'name': username,
                'value': command
            }],
            'footer': {
                'text': t.date + ` - ` + t.time
            }
        }
    }

}

function kill(line) {

    let t = formTime(line)
    let content = JSON.parse(line.substring(21))
    let distance = 0

    if (content.Killer.ServerLocation.X) {
        var dx = content.Killer.ServerLocation.X - content.Victim.ServerLocation.X
        var dy = content.Killer.ServerLocation.Y - content.Victim.ServerLocation.Y
        var dz = content.Killer.ServerLocation.Z - content.Victim.ServerLocation.Z
        var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2))
        distance = Math.round(dist / 100)
    }

    let l = {
        'color': 'ff0000',
        'fields': [{
                'name': 'Killer',
                'value': content.Killer.ProfileName,
                'inline': true
            },
            {
                'name': 'Victim',
                'value': content.Victim.ProfileName,
                'inline': true
            },
            {
                'name': 'Weapon',
                'value': content.Weapon
            }
        ],
        'footer': {
            'text': t.date + ` - ` + t.time
        }
    }

    let img = hasImg(content.Weapon)
    if (img) l.thumbnail = {
        url: img
    }

    if (distance > 0) l.fields.push({
        'name': 'Distance',
        'value': distance + ' Meters'
    })

    if (content.Victim.IsInGameEvent) {
        l.title = 'Event-Kill'
        l.color = '00ffff'
    }

    return {
        'key': (t.date + '_' + t.time + '_' + content.Victim.UserId).replace(/:/g, '_').replace(/\./g, '_').replace(/\s/g, ''),
        'line': l
    }

}

function login(line) {

    let t = formTime(line)
    let content = line.slice(20)

    return {
        'key': line.toLowerCase().replace(/:/g, '_').replace(/\./g, '_').replace(/\s/g, ''),
        'line': {
            'color': '000000',
            'description': content,
            'footer': {
                'text': t.date + ` - ` + t.time
            }
        }
    }


}

function violation(line) {
    return {
        'key': line.toLowerCase().replace(/:/g, '_').replace(/\./g, '_').replace(/\s/g, ''),
        'line': {
            'color': '000000',
            'description': line,
        }
    }
}

function chat(line) {

    let t = formTime(line)
    let steamID = line.substring(22, 39)
    let parts = line.split('\' \'Global: ')
    let message = parts[1].slice(0, -1)
    let usernameID = parts[0].slice(40).match(regexname)
    let username = parts[0].slice(40).replace(usernameID, '')

    return {
        'key': (t.date + '_' + t.time + '_' + steamID).replace(/:/g, '_').replace(/\./g, '_'),
        'line': {
            'color': '000000',
            'fields': [{
                'name': username,
                'value': message
            }],
            'footer': {
                'text': t.date + ` - ` + t.time
            }
        }
    }

}

function nZero(val) {
    if (val < 10) return '0' + val
    else return val
}

function formTime(line) {
    let date = line.substring(0, 10).replace(/\./g, '-')
    let time = line.substring(11, 19).replace(/\./g, ':')
    let d = new Date(date + 'T' + time)
    d.setHours(d.getHours() + 2)
    return {
        date: nZero(d.getDate()) + '.' + nZero((d.getMonth() + 1)) + '.' + d.getFullYear(),
        time: nZero(d.getHours()) + ':' + nZero(d.getMinutes()) + ':' + nZero(d.getSeconds())
    }
}