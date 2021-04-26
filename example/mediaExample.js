var Examplejs = function (target, src, options) {
    // Global Variables & common functions
    var myPlayer = videojs(target);
    var skipPlayEvent = false;
    var sendCCSubtitle = false;
    var started = false;
    var ccEnabled = false;
    var ccLanguage = "";
    var pausedFlag = false;

    // Get all text tracks for the current player to determine if there are any CC-Subtitles
    var index = 0;
    var tracks = myPlayer.textTracks();

    function addJavascript(jsname) {
        var th = document.getElementsByTagName('head')[0];
        var s = document.createElement('script');
        s.setAttribute('type','text/javascript');
        s.setAttribute('src',jsname);
        th.appendChild(s);    
    }
    
    addJavascript('../dist/BUILDER.js');
    addJavascript('../xapi-wrapper/dist/xapiwrapper.min.js');
    
    window.onload = function(){
        let sessionId = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
        let userNm = localStorage.getItem('userNm');
        let platform = localStorage.getItem('platform');

        var initializeSampleData = {
            "actor": {
                "id": userId,
                "name": userNm
            },
            "instructor" : {
                "id": "tutor@example.com",
                "name": "양대리"
            },
            "parent" : [
                {
                    "id": "http://www.example.com/menu/video/",
                    "name": {"language":"ko-KR", "value": "동영상 강좌"},
                    "description" : {"language":"ko-KR", "value": "동영상 강좌"}
                }
            ],
            "grouping" : [
                {
                    "id": "http://www.example.com/course/ocean",
                    "name": {"language":"ko-KR", "value": "바다"},
                    "description" : {"language":"ko-KR", "value": "바다속 체험"}
                }
            ],
            "other" : [
                {
                    "id": "https://videojs.com/advanced/?video=disneys-oceans",
                    "name": {"language":"en-US", "value": "Disney's Oceans"},
                    "description" : {"language":"en-US", "value": "Video JS Sample Video"}
                }
            ],
            "sessionId": sessionId,
            "platform": platform
        }
        
        xAPIInitialize(initializeSampleData);

        var terminated = document.getElementById('terminated');
        terminated.addEventListener('click', function(){
            if(confirm('종료하시겠습니까?')){
                TerminateMyPlayer();
                location.reload();
            }
        })

        var moved = document.getElementById('moved');
        moved.addEventListener('click', function(){
            movedTo();
        })
    }
    
    // common math functions
    function formatFloat(number) {
        if (number == null)
            return null;

        return +(parseFloat(number).toFixed(3));
    }

    function video_start() {
        index = 1;
        started = true;

        initialized();
    }

    /******************************************************************************/
    /************************* Player xAPI Initialized ****************************/
    /******************************************************************************/
    function initialized() {
        // check to see if the player is in fullscreen mode
        var fullScreenOrNot = myPlayer.isFullscreen();
        // get the current screen size
        var screenSize = "";
        screenSize += screen.width + "x" + screen.height;
        // get the playback size of the video
        var playbackSize = "";
        playbackSize += myPlayer.currentWidth() + "x" + myPlayer.currentHeight();
        // get the playback rate of the video
        var playbackRate = myPlayer.playbackRate();
        // vet the video length
        var length = myPlayer.duration();
        ccEnabled = false;
        ccLanguage = "";
    
        // Enable Captions/Subtitles
        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];

            // If it is showing then CC is enabled and determine the language
            if (track.mode === 'showing') {
                ccEnabled = true;
                ccLanguage = track.language;
            } 
        }

        // get user agent header string
        var userAgent = navigator.userAgent.toString();

        // get user volume
        var volume = myPlayer.volume();
        
        var actionData = {
            "verb": "initialized",
            "object": {
                "activityName": "Video",
                "ObjectId": activityIri,
                "name":{                                                         
                    "en-US": activityTitle
                },
                "description" :{
                    "en-US": activityDesc
                }
            },
            "extension": {
                "completion-threshold": 1.0,
                "length": length,
                "full-screen": fullScreenOrNot,
                "screen-size": screenSize,
                "video-playback-size": playbackSize,
                "cc-enabled": ccEnabled,
                "speed": playbackRate + "x",
                "frame-rate": 23.98,
                "quality": "960x400",
                "user-agent": userAgent,
                "volume": volume,
                
            }
        }

        if(ccEnabled == true) {
            actionData['extension']['cc-subtitle-lang'] = ccLanguage;
        }

        sendLRS(actionData);
    }

    /******************************************************************************/
    /************************* Played Event | xAPI Played *************************/
    /******************************************************************************/
    myPlayer.on("play", function () {
        if (started == false && pausedFlag == false) {
            video_start();
            played();
        } else if(started == false && pausedFlag == true) {
            played();
        } else if(started == true && pausedFlag == false) {
            played();
        }
    });

    function played() {
        // get the video length
        var length = myPlayer.duration();
        if (skipPlayEvent !== true) {
            seekStart = null; //reset seek if not reset

            // get the current time position in the video
            var resultExtTime = myPlayer.currentTime();

            var actionData = {
                "object": {
                    "activityName": "Video",
                    "ObjectId": activityIri,
                    "name":{                                                         
                        "en-US": activityTitle
                    },
                    "description" :{
                        "en-US": activityDesc
                    }
                },
                "verb": "played",
                "extension": {
                    "length": length,
                    "time": resultExtTime
                }
            }

            sendLRS(actionData);
        } else {
            // Seek statement has been sent, resume play events
            skipPlayEvent = false;
        }
    }

    function paused(actionData) {
        pausedFlag = true;
        started = false;
        skipPlayEvent = false;
        
        sendLRS(actionData);
    }

    /******************************************************************************/
    /************************** Paused Event | xAPI Paused ************************/
    /******************************************************************************/
    myPlayer.on("pause", function () {
        // If the user is seeking, do not send the pause event
        if (this.seeking() === false) {
            // get the current date and time and throw it into a variable for xAPI timestamp
            // get the video length
            var length = myPlayer.duration();

            // get the current time position in the video
            var resultExtTime = myPlayer.currentTime();

            // get the progress percentage and put it in a variable called progress
            var progress = parseFloat(((resultExtTime/length)).toFixed(3));

            if (progress >= 1) {
                completed();
            } else {
                var actionData = {
                    "object": {
                        "activityName": "Video",
                        "ObjectId": activityIri,
                        "name":{                                                         
                            "en-US": activityTitle
                        },
                        "description" :{
                            "en-US": activityDesc
                        }
                    },
                    "verb": "paused",
                    "extension": {
                        "time": resultExtTime,
                        "progress": progress,
                        "length": length
                    }
                }

                paused(actionData);
            }
        } else {
            //skip subsequent play Event
            skipPlayEvent = true;
        }
    });

    /***********************************************************************************/
    /************************ Video Completion | xAPI Completed ************************/
    /***********************************************************************************/
    var next_completion_check = 0;
    var completion_sent = false;
    function check_completion() {
        if(completion_sent) {
            console.log("completed statement already sent");
            return;
        }

        var currentTimestamp = (new Date()).getTime();

        if (currentTimestamp < next_completion_check) {
            return;
        }

        var length = myPlayer.duration();

        if (length <= 0)
            return;

        // get the current time position in the video
        var resultExtTime = myPlayer.currentTime();

        // get the progress percentage and put it in a variable called progress
        var progress = parseFloat(((resultExtTime/length)).toFixed(3));

        var remaining_seconds = (1 - progress) * length;
        next_completion_check = currentTimestamp + remaining_seconds.toFixed(3) * 1000;
    }

    function completed() {
        if(completion_sent) {
            return;
        }

        // get the current date and time and throw it into a variable for xAPI timestamp
        var length = myPlayer.duration();

        // get the current time position in the video
        var resultExtTime = myPlayer.currentTime();

        // get the progress percentage and put it in a variable called progress
        var progress = parseFloat(((resultExtTime/length)).toFixed(3));

        var actionData = {
            "object": {
                "activityName": "Video",
                "ObjectId": activityIri,
                "name":{                                                         
                    "en-US": activityTitle
                },
                "description" :{
                    "en-US": activityDesc
                }
            },
            "result": {
                "completion": true
            },
            "verb": "completed",
            "extension": {
                "length": length,
                "time": resultExtTime,
                "time": currentTime,
                "progress": progress,
                "completion-threshold": 1.0
            }
        }

        sendLRS(actionData);

        completion_sent = true;
    };

    /*****************************************************************************/
    /************************* Seekable Event | xAPI Seeked **********************/
    /*****************************************************************************/
    var previousTime = 0;
    var currentTime = 0;
    var seekStart = null;

    myPlayer.on("timeupdate", function () {
        previousTime = currentTime;
        currentTime = myPlayer.currentTime();
        check_completion();
        check_volumechange();
    });

    myPlayer.on("seeking", function () {
        if (seekStart === null && previousTime != 0 || seekStart == 0) {
            seekStart = previousTime;
        }
        
        seeked();
    });
    
    function seeked() {
        if(seekStart === null && previousTime != 0 || seekStart == 0) {
            seekStart = previousTime;
        }
        if(pausedFlag === true){
            currentTime = myPlayer.currentTime();
        }

        if (Math.abs(seekStart - currentTime) < 1) { //Ignore seeking if seeked for less than 1 second gap in video
            seekStart = null; //reset seek
            return;
        }

        var actionData = {
            "object": {
                "activityName": "Video",
                "ObjectId": activityIri,
                "name":{                                                         
                    "en-US": activityTitle
                },
                "description" :{
                    "en-US": activityDesc
                }
            },
            "verb": "seeked",
            "extension": {
                "time-from": seekStart,
                "time-to": currentTime
            }
        }

        sendLRS(actionData);

        seekStart = null; //reset seek
    }

    /******************************************************************************/
    /********************* VolumeChange Event | xAPI Interacted *******************/
    /******************************************************************************/
    var volume_changed_on = null,
    volume_changed_at = 0;

    myPlayer.on("volumechange", function () {
        var currentTimestamp = (new Date()).getTime();
        volume_changed_on = currentTimestamp;
        volume_changed_at = currentTime;
    });
    
    function check_volumechange() {
        var currentTimestamp = (new Date()).getTime();
        if (volume_changed_on != null && currentTimestamp > volume_changed_on + 2000) {
            volumechange(volume_changed_on, volume_changed_at);
            volume_changed_on = null;
        }
    }
    
    function volumechange(volume_changed_on, volume_changed_at) {
        // get user volume and return it as a percentage
        var isMuted = myPlayer.muted();
    
        if (isMuted === true) {
            var volumeChange = 0;
        }

        if (isMuted === false) {
            var volumeChange = myPlayer.volume();
        }
    
        var actionData = {
            "object": {
                "activityName": "Video",
                "ObjectId": activityIri,
                "name":{                                                         
                    "en-US": activityTitle
                },
                "description" :{
                    "en-US": activityDesc
                }
            },
            "verb": "interacted",
            "extension": {
                "time": volume_changed_at,
                "volume": volumeChange
            }
        }

        sendLRS(actionData);
    }

    function ccSubTitleChange(){
        if (sendCCSubtitle) {
            sendCCSubtitle = false;
            ccEnabled = false;
            ccLanguage = "";

            // get the current time position in the video
            var resultExtTime = myPlayer.currentTime();

            //Captions/Subtitles values
            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];

                // If it is showing then CC is enabled and determine the language
                if (track.mode === 'showing') {
                    ccEnabled = true;
                    ccLanguage = track.language;
                }
            }
            var actionData = {
                "object": {
                    "activityName": "Video",
                    "ObjectId": activityIri,
                    "name":{                                                         
                        "en-US": activityTitle
                    },
                    "description" :{
                        "en-US": activityDesc
                    }
                },
                "verb": "interacted",
                "extension": {
                    "time": resultExtTime,
                    "cc-subtitle-enabled": ccEnabled,
                    "cc-subtitle-lang": ccLanguage,
        
                }
            }

            sendLRS(actionData);
        }
    }

    /******************************************************************************/
    /********* Player CC-Subtitle Track Change Event | xAPI Interacted ************/
    /******************************************************************************/
    tracks.addEventListener("change", function (e) {
        sendCCSubtitle = true; //Set Flag to sendCCSubtitle change statement.

        if(index == 0){
            return;
        }
        
        setTimeout(function () { //Add a delay of 20 milliseconds so intermediate change events generated by VideoJS are not sent
            ccSubTitleChange();
        }, 20); 
    });

    /******************************************************************************/
    /******************** Fullscreen Event | xAPI Interacted **********************/
    /******************************************************************************/
    document.addEventListener('fullscreenchange', (event) => {
        // check to see if the player is in fullscreen mode
        var fullScreenOrNot = myPlayer.isFullscreen();

        // get the current date and time and throw it into a variable for xAPI timestamp
        var dateTime = new Date();
        var timeStamp = dateTime.toISOString();

        // get the current time position in the video
        var resultExtTime = formatFloat(myPlayer.currentTime());

        // get the current screen size
        var screenSize = "";
        screenSize += screen.width + "x" + screen.height;

        // get the playback size of the video
        var playbackSize = "";
        playbackSize += myPlayer.currentWidth() + "x" + myPlayer.currentHeight();

        var actionData = {
            "object": {
                "activityName": "Video",
                "ObjectId": activityIri,
                "name":{                                                         
                    "en-US": activityTitle
                },
                "description" :{
                    "en-US": activityDesc
                }
            },
            "verb": "interacted",
            "extension": {
                "time": resultExtTime,
                "full-screen": fullScreenOrNot,
                "screen-size": screenSize,
                "video-playback-size": playbackSize
            }
        }

        sendLRS(actionData);
    });

    /******************************************************************************/
    /*************** TerminateMyPlayer Event | xAPI terminated ********************/
    /******************************************************************************/
    function TerminateMyPlayer() {
        var currentTimestamp = (new Date()).getTime();

        // get the current time position in the video
        var resultExtTime = myPlayer.currentTime();

        var length = myPlayer.duration();

        // get the progress percentage and put it in a variable called progress
        var progress = parseFloat(((resultExtTime/length)).toFixed(3));

        var remaining_seconds = (1 - progress) * length;
        next_completion_check = currentTimestamp + remaining_seconds.toFixed(3) * 1000;

        var actionData = {
            "object": {
                "activityName": "Video",
                "ObjectId": activityIri,
                "name":{                                                         
                    "en-US": activityTitle
                },
                "description" :{
                    "en-US": activityDesc
                }
            },
            "verb": "terminated",
            "extension": {
                "length": length,
                "time": resultExtTime,
                "time": currentTime,
                "progress": progress,
                "completion-threshold": 1.0
            }
        }

        sendLRS(actionData);

        myPlayer.dispose();
    };

    /******************************************************************************/
    /*******************************  xAPI moved-To  ******************************/
    /******************************************************************************/
    function movedTo() {
        var actionData = {
            "object": {
                "activityName": "menu", 
                "ObjectId": "https://www.example.co.kr/example/menuExample.html",
                "name": {"en-US": "main menu"},
                "description" :{
                    "en-US": "main menu page"
                }
            },
            "verb": "moved-to",
            "extension":{
                "target-id":"https://example.com/example/menuExample.html",
                "target-type" : "Menu",
                "target-name": "menu page",
                "referrer-id":"https://www.example.co.kr/example/mediaExample.html",
                "referrer-type" : "WebPage",                                       
                "referrer-name": "mediaExample"    
            }
        }

        sendLRS(actionData);

        location.href = "./menuExample.html";      
    }

    // xAPI 초기화 - xAPI 초기 설정 세팅
    function xAPIInitialize(initializeData) {
        this.xapiBuilderObj = new XAPI.XAPIBuilder();
        let configData = this.xapiBuilderObj.getConfigData();

        ADL.XAPIWrapper.changeConfig({
            'endpoint': configData.endpoint,
            'auth': 'Basic ' + toBase64(configData.username + ':' + configData.password)
        });

        initializeActivity(initializeData);
    }

    // Activity 초기화
    function initializeActivity(data) {
        data['actor']['id'] = toSHA1(data['actor']['id']);

        if(data.hasOwnProperty('instructor')) {
            data['instructor']['id'] = toSHA1(data['instructor']['id']);
        }
        
        if(data.hasOwnProperty('team')) {
            data['team']['member'].forEach(item =>{
                item['id'] = toSHA1(item['id']);
            });
        }
        
        var res = this.xapiBuilderObj.initializeXAPI(data);
        console.log('Result : ', res);
    }

    // LRS 전송
    function sendLRS(actionData) {
        var setXAPIDataResult = this.xapiBuilderObj.setXAPIData(actionData);
        console.log(actionData['verb'], 'Send ResultCode : ', setXAPIDataResult);

        ADL.XAPIWrapper.sendStatement(this.xapiBuilderObj.getStatementObj(), function(resp, obj){  
            console.log('status:' + resp.status + ', data:' + resp.statusText);});

        var o = document.getElementById('output');
        o.innerText = JSON.stringify(this.xapiBuilderObj.getStatementObj(), null, '    ');
        console.log('xAPI', actionData['verb'], 'Sended');
    }
}