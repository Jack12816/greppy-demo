/**
 * Demo Application Configuration
 */
var config = {};

/**
 * Cluster infrastructure
 */
config.infrastructure = {

    demo: {
        slaves   : ['localhost'],
        host     : '0.0.0.0',
        port     : 3000,
        worker   : 1
    }
};

/**
 * Database connections
 */
config.database = {

    mysql: {

        demo: {
            plain    : true,
            orm      : true,
            username : 'root',
            password : '',
            db       : 'greppy_demo',
            host     : '127.0.0.1',
            port     : 3306
       }
    },

    mongodb: {

        demo: {
            plain   : true,
            orm     : true,
            uri     : 'mongodb://127.0.0.1:27017/greppy_demo',
            options : {
                db: {
                    native_parser: true
                }
            }
        }
    }
};

module.exports = config;

