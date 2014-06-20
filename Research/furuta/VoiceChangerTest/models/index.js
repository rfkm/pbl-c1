var files = ['User.js'];

for (var i = 0; i < files.length; ++i){
  require('./'+ files[i]);
}
console.log('model loaded');
