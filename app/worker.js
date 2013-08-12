/**
 * Greppy Framework Demo Worker
 *
 * @module greppy-demo/app/worker
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

// Core dependencies
http = require('http');
fs   = require('fs');
util = require('util');

// Express dependencies
var express = require('express');
var app     = express();

// Framework dependencies
greppy     = require('greppy');
var Worker = greppy.get('app.cluster.worker');

// Bootstrap an Express providing HTTP server
var server = http.createServer(app);

// Setup the application worker
var worker = new Worker(app, server, {
    title   : 'greppy-demo-worker',
    modules : ['service'],
    logger  : {
        colors : {debug : 'white'}
    }
});

// Start listening for connections
server.listen(1337);

// Print simple notification
logger.info('Greppy demo project started.');

