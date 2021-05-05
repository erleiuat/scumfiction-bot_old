
const ftp = require("basic-ftp")
const ftpClient = new ftp.Client()

async function download(name) {

    try {

        await ftpClient.access({
            host: "malta.metanet.ch",
            user: process.env.ftpUser,
            password: process.env.ftpPass,
            secure: true
        })

        await ftpClient.downloadTo("tmp/" + name, name)

    } catch (err) {
        console.log(err)
    }

    ftpClient.close()

}

async function upload(name) {

    try {

        await ftpClient.access({
            host: "malta.metanet.ch",
            user: process.env.ftpUser,
            password: process.env.ftpPass,
            secure: true
        })

        await ftpClient.uploadFrom("tmp/" + name, name)

    } catch (err) {
        console.log(err)
    }

    ftpClient.close()

}

exports.download = download
exports.upload = upload