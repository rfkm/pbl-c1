$(function(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext || windowpw.mozAudioContext || window.msAudioContext;
    var ws = io();
    var audioContext = new AudioContext();
    var bSize = 4096;

    var init = function(){
        console.log('init');
    }

    var onAudioProcess = function(e){
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bSize; ++i){
            output[i] = input[i];
        }
        ws.emit('voice', input.toString());
    };

    var startAudio = function(){
        navigator.getUserMedia(
            {audio: true },
            function(s) {
                var sNode = audioContext.createScriptProcessor(bSize,1,1); // mono
                sNode.onaudioprocess = onAudioProcess;
                var mss = audioContext.createMediaStreamSource(s);
                mss.connect(sNode);
                sNode.connect(audioContext.destination);
            },
            function(e) {
                console.log(e);
            });
    }; // end of startAudio

    $("#voice").click(function(){
        init();
        startAudio();
    });

}); // end of $
