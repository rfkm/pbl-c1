//getUserMediaのAPIをすべてnavigator.getUserMediaに統一
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
//window.URLのAPIをすべてwindow.URLに統一
window.URL = window.URL || window.webkitURL;

// 変数
var video = document.querySelector("#video"),
    btnStart = document.querySelector("#start"),
    btnStop = document.querySelector("#stop"),
    videoObj = {
        video: true,
        audio: true
    };

btnStart.addEventListener("click", function() {
    var localMediaStream;
    
    if (!navigator.getUserMedia) {
        alert("カメラ未対応のブラウザです。");
    }
    
    navigator.getUserMedia(
        // 使用するデバイスの情報(少し昔は、'video, audio'のように文字列で渡していました。)
        videoObj,
        // 成功時の処理
        function(stream) {
            localMediaStream = stream;
            video.src = window.URL.createObjectURL(localMediaStream);
            
        },
        // 失敗時の処理(
        function(error) {
            console.error("getUserMedia error: ", error);
            alert("エラーが発生しました。:" + error.name);
        });
    
    btnStop.addEventListener("click", function() {
        localMediaStream.stop();
    });
});
