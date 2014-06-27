var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  uid: {type: String, required: true},
  connectedTo: {type: String}
  });

mongoose.model('User', UserSchema);
var User = mongoose.model('User');
