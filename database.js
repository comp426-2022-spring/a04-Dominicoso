const database = require('better-sqlite3')

const logdb = new database('log.db')

const stmt = logdb.prepare(`SELECT name from sqlite_master WHERE type='table' and name = 'accesslog';`)
let row = stmt.get();
if (row === undefined) {
    console.log('Log database missing. Creating log database...')

    const sqlInit = `
        CREATE TABLE accesslog ( remoteaddr ip, remoteuser user, time VARCHAR, method VARCHAR, url VARCHAR, protocol VARCHAR, httpversion NUMERIC, status INTEGER, referer VARCHAR, useragent VARCHAR; )
    `


    logdb.exec(sqlInit)

    console.log('created a table with remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, and useragent;')

} else {
    console.log('Log database exists.')
}

module.exports = logdb