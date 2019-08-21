'use strict';

const { existsSync } = require('fs');
const express = require('express');
const forceSsl = require('express-force-ssl');
const helmet = require('helmet');
const morgan = require('morgan');


module.exports = class Webserver {
    constructor(settings) {
        if (!settings) {
            throw Error('WEBSERVER: settings cannot be null.');
        }
        this._application = null;
        this._settings = settings;
    }


    start() {
        if (this._application) {
            throw Error('WEBSERVER: already initialised.');
        }
        const settings = this._settings;

        this._application = express();

        if (settings.isDebug) {
            console.log(`WEBSERVER: running in debug mode.`);
            this._application.use(morgan((tokens, request, response) =>
                console.log(`WEBSERVER: ${request.method} ${request.path} => ${response.statusCode}`)));
        }

        if (settings.content) {
            this._application.use(express.static(`${__dirname}/${settings.content}`));
        }

        let isSsl = false;
        let port = settings.port;

        if (settings.certificate) {    
            if (existsSync(settings.certificate)) {
                const fullChain = settings.certificate + '/fullchain.pem';
                const privateKey = settings.certificate + '/privkey.pem';

                if (existsSync(fullChain) && existsSync(privateKey)) {
                    this._application.use(helmet());
                    this._application.use(forceSsl);   

                    const options = {
                        cert: fs.readFileSync(fullChain),
                        key: fs.readFileSync(privateKey)
                    };
                    port = port || 443;
                    isSsl = true;

                    https.createServer(options, this._application).listen(port);
                    console.log(`WEBSERVER: running HTTPS on port ${port}`);
                }
            }

            if (!isSsl) {
                console.error("WEBSERVER: HTTPS certificate missing.");
                process.exit(0);
            }
        }

        port = port || 80;
        this._application.listen({ port });
        console.log(`WEBSERVER: running HTTP on port ${port}`);
    }
}
