//var fs = require('fs');
var uuid = require('uuid');
var exec = require('child_process').exec;

exports.post_url = '/upload';

exports.post = function(req, res){
    var tmp_path = req.files.voice.path;
    var out_path = '/tmp' + uuid.v4() + '.wav';
    var cents = 100; // 100 で半音上がるらしい
    
    var cmd = 'sox ' + tmp_path + ' ' + out_path + ' ' + 'pitch' + cents;
    console.log('exec: ' + cmd);
    exec(cmd, {timeout: 1000},
         function(err, stdout, stderr){
           console.log('stdout: '+ (stdout||'none'));
           console.log('stderr: '+ (stderr||'none'));
           if (err)
             console.log('exec error: ' + err);
         });
};
//};
