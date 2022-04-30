const express = require('express')
const { get } = require('http')
const app = express()

const logdb = require('./database.js')

const morgan = require('morgan')
const errorhandler = require('errorhandler')
const fs = require('fs')
const { url } = require('inspector')

const args = require('minimist')(process.argv.slice(2))
args["port"]
args["help"]
args["debug"]
args["log"]

const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)

const port = args.port || process.env.port || 5000

if (args.help || args.h) {
  console.log(help)
  process.exit(0)
}

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

function coinFlip() {
    const result = (0 == Math.round(Math.random()) ? "heads" : "tails")
    return result
}

function coinFlips(flips) {
    let result = []
    for (let i = 0; i < flips; i++) {
      result[i] = coinFlip()
    }
    return result
}

function countFlips(array) {
    const result = {
      heads: 0,
      tails: 0,
    }
    let res = [0, 0]
    for (let i = 0; i < array.length; i++) {
      if (array[i] == "heads") {
        result.heads++
      } else {
        result.tails++
      }
    }
    return result
}

function flipACoin(call) {
    const result = {
      call: call
    }
    result.flip = coinFlip()
    result.result = call == result.flip ? "win" : "lose"
    return result;
  }

//use morgan for logging
//const ws = fs.createWriteStream()

//let logging = morgan('combined')


app.get('/app/', (req, res) => {
    // res.status(200).end('OK')
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });

    app.use( (req, res, next) => {
      let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
      }
      const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      const info = stmt.run(req.ip, req.user, Date.now(), req.method, req.url, req.protocol, req.httpVersion, res.statusCode, req.headers['referer'], req.headers['user-agent'])
      next()
    })
    
    if (args.log) {
    
      // const writeStream = fs.createWriteStream()
    
      // app.use(logging('common', writeStea))
    
      app.use(fs.writeFile('./access.log', data,
        {flag: 'a'}, (err, req, res, next) => {
        if (err) {
          console.error(err)
        } else {
          console.log(morgan('combined'))
        }
      }))
    
    }

if (args.debug) {
  app.get('/app/log/access/', (req, res) => {
    res.status(200).json(console.log("insert access log"))
  })

  app.get('/app/error', (req, res) => {
    console.error("Error test successful")
  })
}

app.get('/app/flip/', (req, res) => {
    res.status(200).json({ 'flip' : coinFlip() })
});

app.get('/app/flip/call/heads', (req, res) => {
    res.status(200).send(flipACoin('heads'))
})

app.get('/app/flip/call/tails', (req, res) => {
    res.status(200).send(flipACoin('tails'))
})

app.get('/app/flips/:number', (req, res) => {
    const arr = coinFlips(req.params.number)
    res.status(200).json({ 'raw' : arr, 'summary' : countFlips(arr) })
})

app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});