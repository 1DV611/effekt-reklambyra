#!/usr/bin/env node

/**
 * * Modulberoenden.
 */

const app = require('./server/app');
const debug = require('debug')('nodejs-regular-webapp2:server');
const http = require('http');

/**
 * Hämta porten från miljövariablen och spara i Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Skapa en HTTP server.
 */

const server = http.createServer(app);

/**
 * Lyssna på given port, för alla nätverksinterface.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalisera en port till ett nummer, sträng, eller false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // Namngiven lina
    return val;
  }

  if (port >= 0) {
    // portnummer
    return port;
  }

  return false;
}

/**
 * Event-lyssnare för HTTP server "error"-event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // Hantera specifika kopplingsfel med vänliga meddelanden.
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event-lyssnare för HTTP server "listening"-event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}
