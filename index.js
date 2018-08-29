const _ = require('lodash');
const path = require('path');
const fs = require('fs');

module.exports = function Fixture(sails) {
    return {
        /**
         * defaults
         *
         * The implicit configuration defaults merged into `sails.config` by this hook.
         *
         * @type {Dictionary}
         */
        defaults: {
            repository: {
                autogen: true,
                dir: './api/repositories/'
            }
        },

        /**
         * configure()
         *
         * @type {Function}
         */
        configure: () => {
            // create fixture directory if do not exist
            const repositoryDir = path.join(sails.config.appPath, sails.config.repository.dir);
            if (!fs.existsSync(repositoryDir)) {
                fs.mkdirSync(repositoryDir);
            }
        },

        /**
         * initialize()
         *
         * Logic to run when this hook loads.
         */
        initialize: (next) => {
            // console.log('root', process.cwd());
            // console.log('root', sails.config.appPath);
            sails.after('hook:orm:loaded', () => {
                generateRepository()
                    .then(() => {
                        next();
                    })
                    .catch(error => {
                        sails.log.error(error);
                        next(error);
                    });
            });
        }
    };

    function generateRepository() {
        const repositoryDir = path.join(sails.config.appPath, sails.config.repository.dir);

        return autogen()
            .then(() => {
                return Promise.resolve(fs.readdirSync(repositoryDir));
            })
            .then((files) => {
                sails.repository = {};
                files.forEach((file) => {
                    try {
                        const repository = require(path.join(repositoryDir, file));
                        const repositoryName = path.basename(file, '.js');
                        sails.repository[repositoryName] = repository;
                    } catch (err) {
                        sails.log.error('index.js', err);
                    }
                });

                let repositories = sortArray(sails.repository);

                return repositories.reduce((promise, repo) => {
                    if (repo.fixtures) {
                        return promise
                            .then(() => {
                                return repo.fixtures();
                            });
                    }
                    return promise;
                }, Promise.resolve());
            })
            .catch((err) => {
                sails.log.error('index.js', err);
                return Promise.resolve();
            });
    }

    function autogen() {
        if (sails.config.repository.autogen) {
            const template = path.join(__dirname, 'lib', 'repository.template');
            return Promise.all(
                _.map(sails.models, (value, key) => {
                    return {name: key, hasSchema: value.hasSchema};
                })
                    .reduce((arr, value) => {
                        const newRepository = path.join(sails.config.appPath, sails.config.repository.dir, value.name + '.js');
                        if (!value.hasSchema && !fs.existsSync(newRepository)) {
                            arr.push(new Promise((resolve) => {
                                fs.link(template, newRepository, resolve);
                            }));
                        }
                        return arr;
                    }, []));
        }
        return Promise.resolve();
    }
};

function sortArray(arr) {
    return _.sortBy(arr, (value) => {
        if (value.priority) {
            return value.priority();
        }
        return -1;
    });
}
