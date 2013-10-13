/**
 * Greppy Framework Demo Master
 *
 * @module greppy-demo/app/master
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

// Core dependencies
fs   = require('fs');
util = require('util');

// Framework dependencies
greppy     = require('greppy');
var Master = greppy.get('app.cluster.master');

// Greppy Master options
var options = {
    title   : 'greppy-demo-master',
    logger  : {
        colors : {debug : 'white'}
    },
    worker: {
        amount : 1
    }
};

// Setup the application master
var master = new Master(options);

// Load worker context config
workerConfig = greppy.config.get('app').get('infrastructure')[greppy.context];

if (workerConfig) {
    options.title = 'greppy-' + greppy.context + '-master';
    options.worker.amount = workerConfig.worker || 1;
}

master.configure(options, function() {
    // Post configure hook
});

