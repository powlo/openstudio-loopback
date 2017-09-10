'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var PassportConfigurator = require('loopback-component-passport').PassportConfigurator;

var app = module.exports = loopback();
var passport_config = new PassportConfigurator(app);

// Load the provider configurations
var config = {};
try {
 config = require('./providers.json');
} catch(err) {
  console.log(err);
 console.error('Please configure your passport strategy in `providers.json`.');
 console.error('Copy `providers.json.template` to `providers.json` and replace the clientID/clientSecret values with your own.');
 process.exit(1);
}

// Initialize passport
passport_config.init();

app.start = function() {
  // start the web server
  return app.listen(function() {
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
boot(app, __dirname, function(err) {
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

// Set up related models
passport_config.setupModels({
 userModel: app.models.StudioUser,
 userIdentityModel: app.models.UserIdentity,
 userCredentialModel: app.models.UserCredential
});

// Configure passport strategies for third party auth providers
for(var s in config) {
 var c = config[s];
 c.session = c.session !== false;
 passport_config.configureProvider(s, c);
}
