import Sails from 'sails';
import path from 'path';

before(function (done) {
    this.timeout(0);

    Sails.lift(
        {
            appPath: path.join(__dirname, '..'),
            models: {
                connection: 'mongodbServer',
                migrate: 'safe'
            },
            port: 13377,
            hooks: {
                "orm": require('../node_modules/sails-hook-orm'),
                "migrate-mongoose": require('../'),
                "grunt": false
            },
            log: {level: "error"},
            connections: {
                mongodbServer: {
                    adapter: 'sails-mongo',
                    host: 'localhost',
                    port: 27017,
                    // optional
                    // user: 'username',
                    // optional
                    // password: 'password',
                    database: 'test-db'
                }
            }
        },
        (err, server) => {
            if (err) {
                return done(err);
            }
            sails = global.sails = server;

            done(null, server);
        });
});

after((done) => {
    if(global.sails) {
        return global.sails.lower(done);
    }
    return done();
});
