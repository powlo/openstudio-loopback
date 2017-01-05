'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
    if (err) throw err;

    //Use OpenShift environmental parameters
    var host = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
    var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    app.set('host', host);
    app.set('port', port);

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});