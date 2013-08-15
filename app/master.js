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

// Setup the application master
var master = new Master({
    title   : 'greppy-demo-master',
    logger  : {
        colors : {debug : 'white'}
    },
    worker: {
        amount : 2
    }
});

