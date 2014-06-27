
/*
 * GET home page.
 */

var uuid = require('uuid');
var mongoose = require('mongoose');

var User = mongoose.model('User');

exports.get_url = '/';

exports.get = function(req, res){
  var uid = req.cookies.uid;
  if(!uid) {
    var newuid = uuid.v4();
    console.log('generated new uuid: ' + newuid);
    res.cookie('uid', newuid, {maxAge: 60000, httpOnly: false});
    var user = new User({
      uid: newuid
    });
    user.save();
    uid = newuid;
  }

  res.render('index', { title: 'VoiceSenderTest', uid: uid });
};
