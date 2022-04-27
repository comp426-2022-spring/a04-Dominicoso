const database = require('better-sqlite3')
console.log("before")
const logdb = new database('log.db')
console.log("after")

const stmt = logdb.prepare(`SELECET name from sqlite_master WHERE type='table' and 'access';`)
let row = stmt.get();
if (row === undefined) {
    console.log('Log database missing. Creating log database...')

    const sqlInit = `
        CREATE TABLE access ( id INTEGER PRIMARY KEY, remote-addr VARCHAR, remote-user VARCHAR, datetime VARCHAR, method VARCHAR, url VARCHAR, http-version NUMERIC, status INTEGER, content-length NUMERIC)
    `

    console.log('done!')

    logdb.exec(sqlInit)
} else {
    console.log('Log database exists.')
}

module.exports = logdb