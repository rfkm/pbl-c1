var _ = require('lodash');

var files = ['_index.js', 'upload.js'];

exports.routes = _.map(files, function(f){
  return require('./' + f);
});

console.log('routes loaded');
