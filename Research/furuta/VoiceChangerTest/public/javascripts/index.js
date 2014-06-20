//録音ボタン押下フラグ
var cFlag = false;
var recorder = null;
var audioContext;
var lowpassFilter = null;

// Compatibility shim : CSS3で実装される機能が先行実装されてる際に各ブラウザ毎にその利用を宣言する必要があるが、それぞれの宣言方法（ベンダープレフィックス）を吸収するためのコード。
navigator.getUserMedia = navigator.getUserMedia
  || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// Click handlers setup
$(function() {

  // Retry if getUserMedia fails
  $('#step1-retry').click(function() {
    $('#step1-error').hide();
    step1();
  });

  // Get things started
  step1();
});

$(document).ready(function() {
  var ua = navigator.userAgent;

  $("#captureButton").mousedown(function() {
    captureStart();
  });
  $("#captureButton").mouseup(function() {
    captureStop();
  });

});

//再生ボタン、ダウンロードボタンの生成
var wavExported = function(blob) {
  var url = URL.createObjectURL(blob);
  var fname = new Date().toISOString() + '.wav';
  console.log(url);

  $('#files')
    .append(
      '<li>'
        + '<span style="font-size:20px">'
        + fname
        + '</span>'
        + ' <a onclick="wavPlay(\''
        + url
        + '\');"><button type="button" class="btn btn-default btn-lg">再生</button></a>'
        + ' <a href="' + url + '" download="' + fname + '"><button id="captureButton" type="button" class="btn btn-default btn-lg">Download</button></a>'
        + '<br>');
  //timerReset();
  recorder.clear();

  //$('#captureButton').removeAttr('disabled');
}

//再生
var wavPlay = function(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audioContext.decodeAudioData(request.response,
                                 function(buffer) {
                                   var source = audioContext.createBufferSource();
                                   source.buffer = buffer;
                                   source.connect(audioContext.destination);
                                   source.start(0);
                                 });
  }
  request.send();
}

//録音開始処理
var captureStart = function() {
  if (cFlag) { // already started.
    return;
  }

  cFlag = true;
  //timerStart();
  console.log('StartInput');

  recorder && recorder.record();

  //$('#captureButton').addClass('on');
}

//録音停止処理
var captureStop = function() {
  if (!cFlag) { // already stopped.
    return;
  }

  //timerStop();      
  console.log('EndInput');

  cFlag = false;

  recorder && recorder.stop();
  recorder && recorder.exportWAV(wavExported);

  //$('#captureButton').removeClass('on');
  //$('#captureButton').attr('disabled', 'disabled');
}

function step1() {
  // Get audio/video stream
  navigator.getUserMedia({
    audio : true
//    ,video : true
  }, function(stream) {

    //録音用にローパスフィルターを通す
    //フィルター通した音声データをリアルタイム送信することは現状だめっぽい？
    audioContext = new AudioContext;
    lowpassFilter = audioContext.createBiquadFilter();
    lowpassFilter.type = 0;
    lowpassFilter.frequency.value = 20000;

    var input = audioContext.createMediaStreamSource(stream);
    input.connect(lowpassFilter);

    recorder = new Recorder(lowpassFilter, {
      workerPath : '/javascripts/recorderWorker.js'
    });
    $('#step1').hide();

  }, function() {
    $('#step1-error').show();
  });
}
