
/**
 * Module dependencies.
 */

var express = require('express')
, user = require('./routes/user')
, http = require('http')
, mongoose = require('mongoose')
, path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('x-voicesender-text-secret'));
app.use(express.session({ secret: 'voicesender-test-hogehogefugafuga'}));

var server = http.createServer(app);
var io = require('socket.io')(server);

// load model
require('./models');

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// hash
var crypto = require('crypto');
var secretKey = 'hogehogefugafuga';
var getHash = function(s){
  var sha = crypto.createHmac('sha256', secretKey);
  sha.update(s);
  return sha.digest('hex');
}

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var routes = require('./routes');
routes.routes.forEach(function(r) {
  if (r.get_url && r.get) {
    if (r.get_url instanceof Array) {
      r.get_url.forEach(function(u) {
        app.get(u, r.get);
      });
    }
    else {
      app.get(r.get_url, r.get);
    }
  }
  if (r.post_url && r.post) {
    if (r.post_url instanceof Array) {
      r.post_url.forEach(function(u) {
        app.post(u, r.post);
      });
    }
    else {
      app.post(r.post_url, r.post);
    }
  }
});

var processAudio = function(uid){
  // audio process here (i.e. pitch sift)
}

// for realtime connection (currently unused)
var tempaudio = {};
io.on('connection', function(ws){
  ws.on('voice', function(m){
    var ss = m.split(' ');
    var uid = ss[0];
    var data = ss[1];
    if (data === 'end') processAudio(uid);
    else tempaudio[uid] += data;
  });
});
