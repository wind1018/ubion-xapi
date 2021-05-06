/**
 * video js
 *  + viedo js의 기본 설정
 *  + Event 제어
 * @param target 
 * @param objIRI 
 * @param objTitle 
 * @param objDesc 
 * @param objTerminate 
 * @param mediaUUId 
 * @param objCompletionThreshold 
*/
let MediaObj = function (target, objIRI, objTitle, objDesc, objTerminate, mediaUUId, objCompletionThreshold) {
    let myPlayer = videojs(target);                                             //플레이어 오브젝트

    // 미디어 Function 설정
    let tracks = myPlayer.textTracks();                                         // 미디어의 트랙정보를 확인하는 API 함수
    let length = function () {return formatFloat(myPlayer.duration())};                      // 미디어의 총 시간을 구하는 API 함수
    let fullScreen = function () {return myPlayer.isFullscreen()};              // 전체화면 여부를 확인하는 API 함수
    let playbackWidth = function () {return myPlayer.currentWidth()};           // 플레이어의 크기 X를 구하는 API 함수
    let playbackHeight = function () {return myPlayer.currentHeight()};         // 플레이어의 크기 Y를 구하는 API 함수
    let frameRate = function () {return formatFloat(23.98)};                                 // 미디어의 재생 프레임율을 구하는 API 함수
    let quality = function () {return "960x400"};                               // 미디어의 화질을 구하는 API 함수
    let volume = function () {return formatFloat(myPlayer.volume())};                        // 미디어의 볼륨을 구하는 API 함수
    let muted = function () {return myPlayer.muted()};                          // 미디어의 음소거 여부를 구하는 API 함수
    let progress = function () {return parseFloat(((myPlayer.currentTime()/myPlayer.duration())).toFixed(3))};  // 미디어의 현재 진행율을 구하는 API 함수
    let time = function () {return formatFloat(myPlayer.currentTime())};                     // 미디어의 현재 시간을 구하는 API 함수
    let playbackRate = function () {return myPlayer.playbackRate()};            // 미디어의 재생 비트레이트를 구하는 API 함수
    let screenWidth = function () {return screen.width};                        // 화면 사이즈 X를 구하는 API 함수
    let screenHeight = function () {return screen.height};                      // 화면 사이즈 Y를 구하는 API 함수
        
    // xAPI Action Data
    let OBJECT_DATA = {
        TYPE: 'Video',                                         // 미디어 유형 - Video, Audio
        ID: objIRI,                                            // 미디어 고유 ID (파일 또는 경로 IRI)
        NAME: objTitle,                                        // 미디어 타이틀
        DESCRIPTION: objDesc == null ? objTitle : objDesc,     // 미디어 설명
        SESS_ID: mediaUUId,                                    // 미디어의 고유 세션 ID
        COMPLETION_THRESHOLD: objCompletionThreshold           // 미디어 완료 기준 값
    }

    /**
     * 미디어 공통 데이터 설정
     * @returns actionCommonData
    */
    function getMediaCommonData() {
        // Action Data 기본 구조 선언
        let data = {'object':{'name':{},'description':{}}, 'result': {},'extension': {}}

        // Language Map 구성
        let langLocale = APPLICATION_DATA.LANG+'-'+APPLICATION_DATA.LOCALE;

        // Object Data 구성
        data['object']['type'] = OBJECT_DATA.TYPE;
        data['object']['id'] = OBJECT_DATA.ID;
        data['object']['name'] = OBJECT_DATA.NAME;
        data['object']['description'] = OBJECT_DATA.DESCRIPTION;

        // Extension에 Media Session Id 구성
        data['extension']['media-session-id'] = OBJECT_DATA.SESS_ID;

        return data;
    }

    /**
     * 초기 진입 시: xAPI Initialized 호출
    */
    function initializedXAPI() {
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['extension']['completion-threshold'] = OBJECT_DATA.COMPLETION_THRESHOLD;
        actionData['extension']['length'] = length();
        actionData['extension']['full-screen'] = fullScreen();
        actionData['extension']['screen-size'] = screenWidth() +"x"+ screenHeight();
        actionData['extension']['video-playback-size'] = playbackWidth()+ "x" +playbackHeight();
        actionData['extension']['cc-enabled'] = ccEnabled;
        actionData['extension']['speed'] = playbackRate()+ "x";
        actionData['extension']['frame-rate'] = frameRate();
        actionData['extension']['quality'] = quality();
        actionData['extension']['volume'] = volume();
        actionData['extension']['user-agent'] = APPLICATION_DATA.USER_AGENT;

        if(ccEnabled == true) {
            actionData['extension']['cc-subtitle-lang'] = ccLanguage;
        };
        // xAPI Initial 호출
        xAPIUtil.Media.initialized(actionData);
    };

    /**
     * 미디어 시작 시: xAPI Played 호출
    */
    function playedXAPI() {
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['extension']['time'] = time();

        // xAPI Played 호출
        xAPIUtil.Media.played(actionData);
    };

    /**
     * 미디어 중지 시: xAPI Paused 호출
    */
    function pausedXAPI() {
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['extension']['length'] = length();
        actionData['extension']['time'] = time();
        actionData['extension']['progress'] = progress();
        actionData['extension']['completion-threshold'] = OBJECT_DATA.COMPLETION_THRESHOLD;

        // xAPI Paused 호출
        xAPIUtil.Media.paused(actionData);
    };

    /**
     * 미디어 종료시: xAPI Terminated 호출
    */
    function terminatedXAPI() {
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['extension']['length'] = length();
        actionData['extension']['time'] = time();
        actionData['extension']['progress'] = progress();
        actionData['extension']['completion-threshold'] = OBJECT_DATA.COMPLETION_THRESHOLD;

        // xAPI Terminated 호출
        xAPIUtil.Media.terminated(actionData);
    };

    /**
     * 미디어 완료시: xAPI Completed 호출
    */
    function completedXAPI() {
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['result']['completion'] = true;

        actionData['extension']['length'] = length();
        actionData['extension']['time'] = time();
        actionData['extension']['progress'] = progress();
        actionData['extension']['completion-threshold'] = OBJECT_DATA.COMPLETION_THRESHOLD;
        // xAPI Completed 호출
        xAPIUtil.Media.completed(actionData);
    };

    /**
     * 미디어 탐색시: xAPI Seeked 호출
    */
    function seekedXAPI() {
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['extension']['time-from'] = seekStart;
        actionData['extension']['time-to'] = time();
        actionData['extension']['progress'] = progress();

        // xAPI Seeked 호출
        xAPIUtil.Media.seeked(actionData);
    }

    /** 
     * 해상도 변경시: xAPI Interacted 호출
    */
    function changeSizeXAPI() {
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['extension']['full-screen'] = fullScreen();
        actionData['extension']['time'] = time();
        actionData['extension']['screen-size'] = screenWidth() + 'x' + screenHeight();
        actionData['extension']['video-playback-size'] = playbackWidth() + 'x' + playbackHeight();

        // xAPI Interacted 호출
        xAPIUtil.Media.interacted(actionData);
    };

    /**
     * 자막 변경시: xAPI Interacted 호출
    */
    function changeSubTitleXAPI(){
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['extension']['cc-subtitle-enabled'] = ccEnabled;
        actionData['extension']['time'] = time();
        actionData['extension']['cc-subtitle-lang'] = ccLanguage;
        
        // xAPI Interacted 호출
        xAPIUtil.Media.interacted(actionData);
    };

    /** 
     * 볼륨 변경시: xAPI Interacted 호출
    */
    function changeVolumeXAPI() {
        let actionData = getMediaCommonData();

        // Extension Data 구성
        actionData['extension']['time'] = volume_changed_at;
        if (muted() === true) {
            actionData['extension']['volume'] = 0;
        }else{
            actionData['extension']['volume'] = volume();
        }
        // xAPI Interacted 호출
        xAPIUtil.Media.interacted(actionData);
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 미디어 컨트롤 & 이벤트 처리
    // 미디어 데이터 설정
    let skipPlayEvent = false;      // Play 이벤트 스킵 여부
    let sendCCSubtitle = false;     // 플레이어의 자막 사용 유무
    let started = false;            // 플레이어 시작 플래그
    let ccEnabled = false;          // 자막 사용유무
    let ccLanguage = '';            // 자막 언어
    let pausedFlag = false;         // 플레이어 정지 플레그
    let index = 0;                  // Get all text tracks for the current player to determine if there are any CC-Subtitles

    // 동영상 완료시
    let next_completion_check = 0;
    let completion_sent = false;

    //동영상 탐색할때
    let previousTime = 0;
    let currentTime = 0;
    let seekStart = null;

    //볼륨 조정시
    let volume_changed_on = null
    let volume_changed_at = 0;

    // 미디어 종료 이벤트
    document.getElementById(objTerminate).addEventListener('click', function(){
        if(confirm('종료하시겠습니까?')){
            document.getElementById(target).parentNode.style.display = 'none';
            terminatedXAPI();
            alert("종료됨");
        }
    });

    // 자막 변경 이벤트
    tracks.addEventListener("change", function (e) {
        //Set Flag to sendCCSubtitle change statement.
        sendCCSubtitle = true;
        if(index == 0){
            return;
        }

        //Add a delay of 20 milliseconds so intermediate change events generated by VideoJS are not sent
        setTimeout(function () {
            if(sendCCSubtitle){
                sendCCSubtitle = false;
                ccEnabled = false;
                ccLanguage = "";
    
                //Captions/Subtitles values
                for (var i = 0; i < tracks.length; i++) {
                    var track = tracks[i];
    
                    // If it is showing then CC is enabled and determine the language
                    if (track.mode === 'showing') {
                        ccEnabled = true;
                        ccLanguage = track.language;
                    }
                }

                changeSubTitleXAPI();
            }
        }, 20);
    });

    // 전체 화면 변경 이벤트
    document.addEventListener('fullscreenchange', (event) => {
        changeSizeXAPI();
    });

    //동영상 재생시
    myPlayer.on("play", function () {
        if (started == false && pausedFlag == false) {
            index = 1;
            started = true;
            
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

            initializedXAPI();

            if(skipPlayEvent !== true){
                playedXAPI();
            } else {
                // Seek statement has been sent, resume play events
                skipPlayEvent = false;
            }
        } else if(started == false && pausedFlag == true) {
            if(skipPlayEvent !== true){
                playedXAPI();
            } else {
                // Seek statement has been sent, resume play events
                skipPlayEvent = false;
            }
        }
    });

    // 동영상 정지시
    myPlayer.on("pause", function () {
        // If the user is seeking, do not send the pause event
        if (this.seeking() === false) {
            var prog = progress();

            if (prog >= OBJECT_DATA.COMPLETION_THRESHOLD) {
                if(completion_sent) {
                    return;
                }

                completedXAPI();

                completion_sent = true;
            } else {
                pausedXAPI();
                pausedFlag = true;
                started = false;
                skipPlayEvent = false;
            }
        } else {
            //skip subsequent play Event
            skipPlayEvent = true;
        }
    });

    // 볼륨조정, 완료를 매시간 체크
    myPlayer.on("timeupdate", function () {
        previousTime = currentTime;
        currentTime = time();
        check_completion();
        check_volumechange();
    });

    // 미디어 탐색
    myPlayer.on("seeking", function () {
        if (seekStart === null && previousTime != 0 || seekStart == 0) {
            seekStart = previousTime;
        }
        
        seeking();
    });

    // 볼륨 변경
    myPlayer.on("volumechange", function () {
        var currentTimestamp = (new Date()).getTime();
        volume_changed_on = currentTimestamp;
        volume_changed_at = currentTime;
        check_volumechange();
    });

    /**
     * 완료 상태 체크
    */
    function check_completion() {
        
        if(completion_sent) return;

        var currentTimestamp = (new Date()).getTime();

        if(currentTimestamp < next_completion_check){
            return;
        }
        if (length() <= 0) return;
        var prog = progress();
        var remaining_seconds = OBJECT_DATA.COMPLETION_THRESHOLD * length();
        next_completion_check = currentTimestamp + remaining_seconds.toFixed(3) * 1000;
        if(prog >= OBJECT_DATA.COMPLETION_THRESHOLD){
            completedXAPI();
            completion_sent = true;
            
        }
    };

    /**
     * 볼륨 변경 체크
    */
    function check_volumechange() {
        var currentTimestamp = (new Date()).getTime();
        if (volume_changed_on != null && currentTimestamp > volume_changed_on + 1000) {

            changeVolumeXAPI();
            volume_changed_on = null;
        }
    };
    
    /** 
     * 진행 시점 변경 체크
    */
    function seeking() {
        if(seekStart === null && previousTime != 0 || seekStart == 0) {
            seekStart = previousTime;
        }
        
        if(pausedFlag === true){
            currentTime = time();
        }

        if (Math.abs(seekStart - currentTime) < 1) { //Ignore seeking if seeked for less than 1 second gap in video
            seekStart = null; //reset seek
            return;
        }

        seekedXAPI();

        seekStart = null; //reset seek
    };

    /**
     * 기본 계산 함수 소수점 3자리 수 까지 반환
     * @param number 
     * @returns 
    */
    function formatFloat(number) {
        if (number == null)
            return null;

        return +(parseFloat(number).toFixed(3));
    };    
}