/**
 * Demo Application Configuration
 */
var config = {};

/**
 * Cluster infrastructure
 */
config.infrastructure = {

    home: {
        url    : 'http://localhost:3000',
        slaves : ['localhost'],
        host   : '0.0.0.0',
        port   : 3000,
        worker : 1
    },

    blog: {
        url    : 'http://localhost:3001',
        slaves : ['localhost'],
        host   : '0.0.0.0',
        port   : 3001,
        worker : 1
    },

    docs: {
        url    : 'http://localhost:3002',
        slaves : ['localhost'],
        host   : '0.0.0.0',
        port   : 3002,
        worker : 1
    },

    service: {
        url    : 'http://localhost:3003',
        slaves : ['localhost'],
        host   : '0.0.0.0',
        port   : 3003,
        worker : 1
    }
};

/**
 * Database connections
 */
config.database = {

    mongodb: {

        blog: {
            plain   : true,
            orm     : true,
            uri     : 'mongodb://127.0.0.1:27017/greppy_blog',
            options : {
                db: {
                    native_parser: true
                }
            }
        }
    }

    // mysql: {

    //     demo: {
    //         plain    : true,
    //         orm      : true,
    //         username : 'root',
    //         password : '',
    //         db       : 'greppy_demo',
    //         host     : '127.0.0.1',
    //         port     : 3306
    //    }
    // }
};

module.exports = config;

