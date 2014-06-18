
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
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
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
var io = require('socket.io')(server);

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


// database
var db = mongoose.createConnection('mongodb://localhost/VoiceSenderTest', function(err, res) {
    if(err) console.log(err);
});

// authentication
var flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});
var User = new db.model('User', UserSchema);

if(User.count({}) == 0){
    var admin = new User();
    admin.email = "hoge@fuga.com";
    admin.password = "admin";
    admin.save();
}


io.on('connection', function(ws){
    ws.on('voice', function(m){
        console.log(m);
    });
});
