'use strict';

const Api = require("./api");
const Database = require("./database");
const Webserver = require('./webserver');

const settings = require('./settings');


const database = new Database({ });
const webserver = new Webserver({
    certificate: settings.webserver.certificate,
    content: '../public',
    isDebug: settings.isSystest || settings.webserver.isDebug,
    port: settings.webserver.port
});

webserver.start(new Api(database));

console.log(`APPLICATION: started worker ${process.pid}.`);