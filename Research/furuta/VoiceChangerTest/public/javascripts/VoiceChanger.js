$(function () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext || windowpw.mozAudioContext || window.msAudioContext;

    var audioContext = new AudioContext();
    var bSec = 0.2; // [sec]
    var sRate = audioContext.sampleRate;
    var bSize = 4096;
    var aData = [];
    var bArrayLength = sRate / bSize * bSec;
    var noSound = new Float32Array(bSize);
    var recentSavedVoice = [];
    var isRecording = true;

    var init = function(){
        aData = [];
        for (var i = 0; i < bArrayLength; ++i){
            aData.push(noSound);
        }
    }

    var onRecognized = function(){
        recentSavedVoice = aData;
        init();
    }
    var loop = 0;
    var onAudioProcess = function(e){
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        var bData = new Float32Array(bSize);
        for (var i = 0; i < bSize; ++i){
            bData[i] = input[i];
        }
        if(loop++ % 10) console.log(bData);
        aData.push(bData);
        aData.shift();
        if (isRecording) {
            console.log("recording");
            recentSavedVoice.push(bData);
            for(var j = 0; j < bSize; ++j){
                output[i] = bData[i];
            }
        }
    }

    var startAudio = function(){
        navigator.getUserMedia(
            {audio: true },
            function(s) {
                var sNode = audioContext.createScriptProcessor(bSize,1,1); // mono
                sNode.onaudioprocess = onAudioProcess;
                var cNode = audioContext.createConvolver();
                var mss = audioContext.createMediaStreamSource(s);
                mss.connect(sNode);
                sNode.connect(cNode);
                cNode.connect(audioContext.destination);
            },
            function(e) {
                console.log(e);
            });
    }

    $("#voice").click(function(){
        init();
        startAudio();
    });

}); // end of $
