
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
app.use(express.session({ secret: 'voicesender-test-hogehogefugafuga'}));

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

// authentication
var flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// database
var db = mongoose.connect('mongodb://localhost/voicesendertest');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
});
var User = db.model('User', UserSchema);

User.count({}, function(err, cnt){
  console.log('user.count: ' + cnt);
  if (cnt <= 1){
    console.log('create admin user');
    var admin = new User({
      email: "hoge@fuga.com",
      password: getHash("admin")
    });
    admin.save();
  }
});

passport.serializeUser(function(user, done){
  done(null, {email: user.email, _id: user._id});
});
passport.deserializeUser(function(serializedUser, done){
  User.findById(serializedUser._id, function(err, user){
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  {usernameField: 'email', passwordField: 'password'},
  function(email, password, done){
    process.nextTick(function(){
      User.findOne({email: email}, function(err, user){
        if (err) return done(err);
        if(!user) return done(null, false,{message: "User not found."});
        var hashedPassword = getHash(password);
        console.log(user.password);
        console.log(hashedPassword);
        if (user.password !== hashedPassword)
          return done(null, false, {message: "Wrong password."});
        return done(null, user);
      });
    });
  }));
var isLoggedin = function(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
};

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/users', user.list);
// app.get('/login', function(req, res){
//     res.render('login', {user: req.user, message: req.flash('error')});
// });
// app.post('/login',
//         passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
//         function(req, res){
//             console.log('logged in. redirect to index.');
//             res.redirect('/');
//         });
// app.get('/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
// });

var processAudio = function(uid){
  // audio process here (i.e. pitch sift)
}

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
