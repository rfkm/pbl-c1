$(function(){
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.AudioContext = window.AudioContext || window.webkitAudioContext || windowpw.mozAudioContext || window.msAudioContext;
  var ws = io();
  var audioContext = new AudioContext();
  var bSize = 4096;
  var uid = $.cookie('uid') + ' ';

  var init = function(){
    console.log('init');
  }

  var onAudioProcess = function(e){
    var input = e.inputBuffer.getChannelData(0);
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < bSize; ++i){
      output[i] = input[i];
    }
    ws.emit('voice', uid + input.toString());
  };

  var localStream;
  var startAudio = function(){
    navigator.getUserMedia(
      {audio: true },
      function(s) {
        localStream = s;
        var sNode = audioContext.createScriptProcessor(bSize,1,1); // mono
        sNode.onaudioprocess = onAudioProcess;
        var mss = audioContext.createMediaStreamSource(s);
        mss.connect(sNode);
        sNode.connect(audioContext.destination);
      },
      function(e) {
        console.log(e);
      });
    console.log('audio start');
  }; // end of startAudio

  var stopAudio = function(){
    if(localStream){
      localStram.stop();
      ws.emit('voice', uid + 'end');
      console.log('audio stopped');
    } else {
      console.log('audio not playing');
    }
  }

  var isSpeaking = false;
  $("#voice").click(function(){
    if (isSpeaking) {
      stopAudio();
      isSpeaking = false;
    } else {
      init();
      startAudio();
      isSpeaking = true;
    }
  });

}); // end of $
