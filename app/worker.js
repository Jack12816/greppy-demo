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

// Load the application config if you need to setup
// a default configuration which will be merged by the file
// greppy.config.load(process.cwd() + '/app/config/application.js', 'app', {
//     default: 'key'
// });

// Bootstrap an Express providing HTTP server
var server = http.createServer(app);

// Setup the application worker
var worker = new Worker({
    modules : [],
    logger  : {
        colors : {debug : 'white'}
    }
});

// Load worker context config
workerConfig = greppy.config.get('app').get('infrastructure')[greppy.context];

// Configure the worker and the related objects,
// run the callback after the worker was initalized
worker.configure(app, server, function() {
    logger.info('Greppy demo project started.');
});

