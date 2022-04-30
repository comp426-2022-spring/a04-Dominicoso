const database = require('better-sqlite3')
console.log("we got here")
const logdb = new database('log.db')
console.log("after const = new database")
const stmt = logdb.prepare(`SELECT name from sqlite_master WHERE type='table' and name = 'accesslog';`)
let row = stmt.get();
if (row === undefined) {
    console.log('Log database missing. Creating log database...')

    // const sqlInit = `
    //     CREATE TABLE accesslog ( id INTEGER PRIMARY KEY, remote-addr VARCHAR, remote-user VARCHAR, datetime VARCHAR, method VARCHAR, url VARCHAR, http-version NUMERIC, status INTEGER, content-length NUMERIC)
    // `

    const sqlInit = `
        CREATE TABLE accesslog ( id INTEGER PRIMARY KEY, username TEXT, password TEXT );
        INSERT INTO accesslog (username, password) VALUES ('user1','supersecurepassword'),('test','anotherpassword');
    `;

    logdb.exec(sqlInit)

    console.log('Database has been initialized with a table and two entries for username and password.')

} else {
    console.log('Log database exists.')
}

module.exports = logdb