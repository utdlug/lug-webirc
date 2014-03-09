var http = require('https'),
    express = require('express'),
    path = require('path'),
    config = require('../config');

var app = exports.app = express();

var certPath = "/var/www/certs/";

var fs = require('fs');
var options = {
    key: fs.readFileSync(certPath + 'lug.utdallas.edu.key'),
    cert: fs.readFileSync(certPath + 'lug.utdallas.edu.cer'),
    ca: [
        fs.readFileSync(certPath + 'root.cer'),
        fs.readFileSync(certPath + 'inter1.cer')
        ]
 
//   rejectUnauthorized: false
};
var server = exports.server = http.createServer(options,app);

app.configure(function() {
  var basePath = path.join(__dirname, '..');
  app.use(require('connect-assets')({build: false, src: basePath + '/assets'}));
  app.use('/assets', express.static(basePath + '/assets'));
  app.use('/img', express.static(basePath + '/assets/images'));
  app.set('views', basePath + '/views');
});

// configure app based on given environment config
function configureApp(app, envConfig) {
  app.set('port', envConfig.port);
  app.set('client_port', envConfig.client_port);
}

app.configure('development', function() {
  envConfig = config.dev;
  configureApp(app, envConfig);
});

app.configure('production', function() {
  envConfig = config.prod;
  configureApp(app, envConfig);
});

var port = app.get('port'); // get port for current environment
server.listen(port);

app.get('/', function(req, res) {
  res.render('index.jade', {port: app.get('client_port'), env: process.env.NODE_ENV || null});
});

