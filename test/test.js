/*
let token = "3JYfPqLFwXjRuRyiVkuUJIsf-KFSJDnH4bRRMMd5zw247YspkI0lZX7WS0I44S5yv5TrX93cAbFgy8T8i3z38AMGae5aZTL0Id5D"
let serverID = "8601357"
let userID = "ni43939_3"
*/

var logEntries = []

console.log("executing")

var files = []

//Braindead decoder that assumes fully valid input
function decodeUTF16LE(binaryStr) {
    var cp = [];
    for (var i = 0; i < binaryStr.length; i += 2) {
        cp.push(
            binaryStr.charCodeAt(i) |
            (binaryStr.charCodeAt(i + 1) << 8)
        );
    }
    return String.fromCharCode.apply(String, cp);
}

var settings = {
    "url": "https://api.nitrado.net/services/8601357/gameservers/file_server/list?dir=/games/ni43939_3/noftp/scum/SCUM/Saved/SaveFiles/Logs/",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Authorization": "Bearer 3JYfPqLFwXjRuRyiVkuUJIsf-KFSJDnH4bRRMMd5zw247YspkI0lZX7WS0I44S5yv5TrX93cAbFgy8T8i3z38AMGae5aZTL0Id5D"
    },
};

$.ajax(settings).done(function (response) {

    var fileNames = []

    response.data.entries.forEach(element => {
        if (element.name.includes("chat")) {
            fileNames.push(element.name)
            files.push({
                date: element.modified_at,
                file: element.name
            })
        }
    });

    var settings2 = {
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer 3JYfPqLFwXjRuRyiVkuUJIsf-KFSJDnH4bRRMMd5zw247YspkI0lZX7WS0I44S5yv5TrX93cAbFgy8T8i3z38AMGae5aZTL0Id5D"
        },
    };

    var url = "https://api.nitrado.net/services/8601357/gameservers/file_server/download?file=/games/ni43939_3/noftp/scum/SCUM/Saved/SaveFiles/Logs/"

    console.log(fileNames.sort())
    logEntries = []

    files.forEach(element => {
        $.ajax({
            ...settings2,
            "url": url + element.file
        }).done(function (response) {

            // console.log(response.data.token.url);

            fetch(response.data.token.url)
                .then(function (response) {
                    //console.log(response)
                    return response.text();
                }).then(function (data) {

                    var result = decodeUTF16LE(data);

                    var arrayOfLines = result.match(/[^\r\n]+/g);

                    /*
                    arrayOfLines.forEach(element => {
                        $('.results').append(element + "<br/><br/>")
                    })
                    */

                    //console.log(arrayOfLines)
                    //logEntries.push(arrayOfLines)

                    logEntries = logEntries.concat(arrayOfLines)

                    //$('.results').append(data.replace(" ", ""))
                    //$('.results').append(result.replace("", "") + "<br/>")

                    //console.log(data); // this will be a string
                })

        });
    })

    //console.log(logEntries);




    /*
    console.log(files);

    files.sort(function(a, b) {
        return a.date - b.date;
    });

    files.forEach(element => {

        var date = new Date(element.date * 1000)
        var formatted = date.getDate()+
        "/"+(date.getMonth()+1)+
        "/"+date.getFullYear()+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds()


        $('.results').append(formatted + " === " + element.file + "<br/>")

    });
    */

})


setTimeout(function () {

    var content = ""
    logEntries = logEntries.sort().reverse()
    logEntries.forEach(el => {
        if (!el.includes("Game version:")) {

            console.log(el)
            var splitted = el.split("' '")

            content += splitted[0] + "<br/><b>" + splitted[1] + "</b><br/><br/>"

        }
    })

    $('.results').html(content)
    //console.log(logEntries);

}, 2000)