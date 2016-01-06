/*!
 * GumWrapper v0.13
 * By Daniel Davis under MIT License
 * https://github.com/tagawa/GumWrapper
 */

;(function (window, document) {
    'use strict';

    window.GumWrapper = function(elements, success, error) {
        var video = document.getElementById(elements.video);
        var recordRTC = null;

        // Define our error message
        function sendError(message) {
            if (error) {
                var e = new Error();
                e.message = message;
                error(e);
            } else {
                console.error(message);
            }
        }

        // Try to play the media stream
        function play() {

            if (!video) {
                sendError('Unable to find the video element.');
                return;
            }

            function successCallback(stream) {
                // Set the source of the video element with the stream from the camera
                if (video.mozSrcObject !== undefined) {
                    video.mozSrcObject = stream;
                    video.stream = video.mozSrcObject;
                } else {
                    video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                    video.stream = video.src;
                }
                recordRTC = RecordRTC(stream);
                recordRTC.startRecording();
                video.play();
            }

            function errorCallback(error) {
                sendError('Unable to get webcam stream.');
            }

            //navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            //window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

            // Call the getUserMedia method with our callback functions
            if (navigator.getUserMedia) {
                navigator.getUserMedia({video: true, audio: true}, successCallback, errorCallback);
            } else {
                sendError('Native web camera streaming (getUserMedia) not supported in this browser.');
            }

            // Check the video dimensions when data has loaded
            video.addEventListener('loadeddata', function() {
                var attempts = 10;

                function checkVideo() {
                    if (attempts > 0) {
                        if (video.videoWidth > 0 && video.videoHeight > 0) {
                            // Execute success callback function
                            if (success) success(video);
                        } else {
                            // Wait a bit and try again
                            window.setTimeout(checkVideo, 500);
                        }
                    } else {
                        // Give up after 10 attempts
                        sendError('Unable to play video stream. Is webcam working?');
                    }
                    attempts--;
                }

                checkVideo();
            }, false);
        }
        function stop() {
            video.stream.stop();
            recordRTC.stopRecording(function() {
                console.log(recordRTC.getBlob());
            });
        }

        return {
            video: document.getElementById(elements.video),
            recordRTC: recordRTC,
            play: play,
            stop: stop
        };
    };
})(window, document);
