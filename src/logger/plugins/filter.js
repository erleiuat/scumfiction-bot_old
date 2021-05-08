const scriptName = '- - - > Filter: '
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


function admin(line) {
    if (!defaultFilter(line)) return false
    else if (line.toLowerCase().includes('teleport')) return false
    else if (line.toLowerCase().includes('location')) return false
    else if (line.toLowerCase().includes('spawn') || line.toLowerCase().includes('godmode')) {
        if (line.toLowerCase().includes('chris p. bacon')) return false
        else if (line.toLowerCase().includes('lox')) return false
        else if (line.toLowerCase().includes('tjvirus')) return false
    } else return true
}

function kill(line) {
    if (!defaultFilter(line)) return false
    if (line.slice(21, 22) !== '{') return false
    else return true
}

function login(line) {
    if (!defaultFilter(line)) return false
    else return true
}

function violation(line) {
    if (!defaultFilter(line)) return false
    else return true
}


function chat(line) {
    if (!defaultFilter(line)) return false
    else if (!line.includes('\' \'Global: ')) return false
    else return true
}

function defaultFilter(line) {
    if (!line) return false
    else if (line.length < 10) return false
    else if (line.includes('Game version:')) return false
    else return true
}