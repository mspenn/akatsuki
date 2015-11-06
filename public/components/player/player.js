/**
 * Created by v_chenqianming on 2015/10/25.
 */
'use strict';
/* Controllers */
app
    .controller('PlayerCtrl', ['$scope', function ($scope) {
        videojs.options.flash.swf = "/javascripts/video.js/video-js.swf";

        var player = videojs("main-player-block", {
                "controls": true,
                "preload": "none",
                "width": 1280,
                "height": 640,
                "poster": "/images/Elfen Lied.jpg",
                "techOrder": ['html5', 'flash']
            },
            function () {

                var video_src = [{
                    "type": "video/mp4",
                    "src": "/video?res=" + $scope.resId
                }];
                this.src(video_src);
                this.play();
                //this.on('loadeddata', function () {
                //    console.log(this)
                //});
                //
                //this.on('ended', function () {
                //    this.pause();
                //    this.hide()
                //});
            }
        );
    }]);
