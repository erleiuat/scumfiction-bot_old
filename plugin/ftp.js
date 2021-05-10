exports.client = function client() {
    return new(require('basic-ftp')).Client()
}
exports.credentials = {
    host: 'malta.metanet.ch',
    user: process.env.ftp_user,
    password: process.env.ftp_pass,
    secure: true
}