'use strict';

const nconf = require('nconf');

const configuration = nconf.argv().file({ file: `${__dirname}/../server.config.json` });

module.exports = {
    isSystest: configuration.get('systest') === "true",
    webserver: {
        certificate: configuration.get('webserver:certificate') || '',
        isDebug: configuration.get('webserver:isDebug') || false,
        port: configuration.get('webserver:port') || 0
    }
};