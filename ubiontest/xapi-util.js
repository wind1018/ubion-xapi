function addJavascript(jsname) {
    var th = document.getElementsByTagName('head')[0];
    var s = document.createElement('script');
    s.setAttribute('type','text/javascript');
    s.setAttribute('src',jsname);
    th.appendChild(s);    
}

addJavascript('../dist/BUILDER.js');
addJavascript('../xapi-wrapper/dist/xapiwrapper.min.js');

/* 시스템 기본 데이터 설정 - 사용자 시스템 환경에 맞도록 변경하여 사용 */
let APPLICATION_DATA = {
    // Platform 명칭
    PLATFORM : 'undefined',
    // 시스템 사용 언어
    LANG : 'ko',
    // 지역
    LOCALE : 'KR',
    // UTC 기준 Time Zone 시간
    UTC_ZONE : '+09:00',
    // 호스트명
    HOST : window.location.protocol + "//" + window.location.host,
    // User-Agent
    USER_AGENT : navigator.userAgent.toString(),
    // session id
    SESS_ID : 'undefined',
    // ip-address
    IP : 'undefined',
    // 로그인 사용자 ID or Email
    USER_ID : 'undefined',
    // USER_ID : {"account": {"homePage": "https://www.sample.com","name": "제임스"}},
    // 로그인 사용자 이름
    USER_NAME : 'undefined',
    // USER_TEAM : {"member":[{'id': 'james@example.com', 'name': '제임스'},{'id': 'kim@example.com', 'name': '킴'},{"account": {"homePage": "https://www.sample.com","name": "제임스"}, 'name': '리'}]}

    /**
     * 데이터 초기화
     */
    Initialize_DATA : function(){

        // 외부 
        if(typeof(XAPI_INITIALIZE_DATA) !== 'undefined'){

            for(var key in this){                        
                var temp = XAPI_INITIALIZE_DATA[key];
                if(typeof(temp) !== 'undefined'){
                
                    APPLICATION_DATA[key] = temp;
                }
            }
        }

    }
}

// APPLICATION_DATA 초기화 처리
APPLICATION_DATA.Initialize_DATA();

/* xAPIUtil Set */
xAPIUtil = {
    /** xAPIUtil Builder Initial
     *  + xAPI Builder 객체 생성
     *  + LRS 접속을 위한 Config 설정
    */
    xAPIInitialize() {
        // Create xAPI Builder Object
        this.xapiBuilderObj = new XAPI.xAPIBuilder();
        // Get Config Data
        let configData = this.xapiBuilderObj.getConfigData();

        // Set Connection Info. to xAPI Wrapper
        ADL.XAPIWrapper.changeConfig({
            'endpoint': configData.endpoint,
            'auth': 'Basic ' + toBase64(configData.username + ':' + configData.password)
        });
    },
    /** 
     * Activity Data 초기화 작업
     *  + Actor Data 초기화
     *  + Context Data 초기화
    */
    initializeActivity(data) {
        let initializeData = cloneData(data);

        // APPLICATION_DATA로 선언한 항목 Initial Data setting
        let actorName = {"name": APPLICATION_DATA.USER_NAME}

        initializeData['actor'] = actorName;
        initializeData['session_id'] = APPLICATION_DATA.SESS_ID;
        initializeData['platform'] = APPLICATION_DATA.PLATFORM;
        
        // convert mbox to mbox_sha1sum
        // actor의 mbox 암호화 처리
        if(this.xapiBuilderObj.emailRegExp.test(APPLICATION_DATA.USER_ID)){
            initializeData['actor']['id'] = toSHA1(APPLICATION_DATA.USER_ID);
        } else if(APPLICATION_DATA.USER_ID.hasOwnProperty('account')){
            initializeData['actor'] = APPLICATION_DATA.USER_ID;
        } else {
            initializeData['actor']['id'] = APPLICATION_DATA.USER_ID;
        }

        initializeData['actor']['team'] = APPLICATION_DATA.USER_TEAM;

        if(initializeData['actor']['team'] == undefined){
            delete initializeData['actor']['team'];
        } else if(initializeData['actor']['team'] != undefined){
            if(initializeData['actor'].hasOwnProperty('team')){
                for(var item in initializeData['actor']['team']['member']){
                    if(this.xapiBuilderObj.emailRegExp.test(initializeData['actor']['team']['member'][item]['id'])){
                        initializeData['actor']['team']['member'][item]['id'] = toSHA1(initializeData['actor']['team']['member'][item]['id']);
                    }
                }
            }
        }
        
        // context의 각 property별 mbox 암호화 처리
        if(initializeData.hasOwnProperty('instructor')){
            if(this.xapiBuilderObj.emailRegExp.test(initializeData['instructor']['id'])){
                initializeData['instructor']['id'] = toSHA1(initializeData['instructor']['id']);
            } else if(initializeData['instructor'].hasOwnProperty('account')){
                initializeData['instructor'] = initializeData['instructor'];
            }
        }

        if(initializeData.hasOwnProperty('team')){
            for(var item in initializeData['team']['member']){
                if(this.xapiBuilderObj.emailRegExp.test(initializeData['team']['member'][item]['id'])){
                    initializeData['team']['member'][item]['id'] = toSHA1(initializeData['team']['member'][item]['id']);
                } else if(initializeData['team']['member'][item].hasOwnProperty('account')){
                    initializeData['team']['member'][item] = initializeData['team']['member'][item];
                }
            }
        }

        if(initializeData.hasOwnProperty('parent')){
            let parentObj = {}
            for(var item in initializeData['parent']){
                if(initializeData['parent'][item].hasOwnProperty('name')){
                    parentObj = {
                        "language": APPLICATION_DATA.LANG + "-" + APPLICATION_DATA.LOCALE,
                        "value": initializeData['parent'][item]['name']
                    }
                    initializeData['parent'][item]['name'] = parentObj;

                    parentObj = {
                        "language": APPLICATION_DATA.LANG + "-" + APPLICATION_DATA.LOCALE,
                        "value": initializeData['parent'][item]['description']
                    }
                    initializeData['parent'][item]['description'] = parentObj;
                }
            }
        }

        if(initializeData.hasOwnProperty('grouping')){
            let groupingObj = {}
            for(var item in initializeData['grouping']){
                if(initializeData['grouping'][item].hasOwnProperty('name')){
                    groupingObj = {
                        "language": APPLICATION_DATA.LANG + "-" + APPLICATION_DATA.LOCALE,
                        "value": initializeData['grouping'][item]['name']
                    }
                    initializeData['grouping'][item]['name'] = groupingObj;

                    groupingObj = {
                        "language": APPLICATION_DATA.LANG + "-" + APPLICATION_DATA.LOCALE,
                        "value": initializeData['grouping'][item]['description']
                    }
                    initializeData['grouping'][item]['description'] = groupingObj;
                }
            }
        }

        if(initializeData.hasOwnProperty('other')){
            let otherObj = {}
            for(var item in initializeData['other']){
                if(initializeData['other'][item].hasOwnProperty('name')){
                    otherObj = {
                        "language": APPLICATION_DATA.LANG + "-" + APPLICATION_DATA.LOCALE,
                        "value": initializeData['other'][item]['name']
                    }
                    initializeData['other'][item]['name'] = otherObj;

                    otherObj = {
                        "language": APPLICATION_DATA.LANG + "-" + APPLICATION_DATA.LOCALE,
                        "value": initializeData['other'][item]['description']
                    }
                    initializeData['other'][item]['description'] = otherObj;
                }
            }
        }

        // Activity Data initial
        var res = this.xapiBuilderObj.initializeXAPI(initializeData);
        console.log('Result : ', res);
    },
    /** xAPIUtil Profile Verb 호출 API */
    // Session Profile
    Session: {
        // Session Profile Verb List 및 선언부
        "VERB": {
            "LOGGED_IN": "Logged-In",
            "LOGGED_OUT": "Logged-Out",
            "TIMED_OUT": "Timed-Out",
            "PAUSED": "Paused",
            "RESUMED": "Resumed",
            "ATTEMPTED": "Attempted",
            "ENTERED": "Entered",
            "LEAVED": "Leaved",
            "ATTENDED": "Attended"
        },
        // Action Data 기본 구조 선언
        actionDataObj: {'object':{'name':{},'description':{}}, 'result': {},'extension': {}},
        /**
         * Session Data Setting
         *  + Action Data의 공통 항목 설정
        */
        setSessionData(data) {
            // Language Map 구성
            let objectNameKey = APPLICATION_DATA.LANG +'-'+ APPLICATION_DATA.LOCALE;
            // Session Profile Object 설정
            this.actionDataObj['object']['type'] = data['object']['type'];
            this.actionDataObj['object']['id'] = data['object']['id'];
            this.actionDataObj['object']['name'][objectNameKey] = data['object']['name'];
            if(data['object'].hasOwnProperty('description')) this.actionDataObj['object']['description'][objectNameKey] = data['object']['description'];
            // Session Profile Extension 설정
            this.actionDataObj['extension']['session-id'] = APPLICATION_DATA.SESS_ID;
            this.actionDataObj['extension']['user-agent'] = APPLICATION_DATA.USER_AGENT;
            this.actionDataObj['extension']['ip-address'] = APPLICATION_DATA.IP;
            this.actionDataObj['extension']['host'] = APPLICATION_DATA.HOST;
        },
        /**
         * xAPI Verb: Logged-In
         *  + 로그인 xAPI
         *  + 로그인하였을 때 사용되는 function
         * @param data
        */
        async loggedIn(data){
            // 로그인 시 세션 기본 데이터 세팅
            xAPIUtil.Session.setSessionData(data);
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.LOGGED_IN;
            actionData['extension']['started-time'] = new Date().toISOString();

            delete actionData.result;
            
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Logged-Out
         *  + 로그아웃 xAPI
         *  + 로그아웃하였을 때 사용되는 function
        */
        async loggedOut(){
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.LOGGED_OUT;
            actionData['extension']['ended-time'] = new Date().toISOString();

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Timed-Out
         *  + 타임아웃 xAPI
         *  + 타임아웃되었을 때 사용되는 function
        */
        async timedOut(){
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.TIMED_OUT;
            actionData['extension']['ended-time'] = new Date().toISOString();

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Paused
         *  + 활동 일시중지 xAPI
         *  + 활동을 일시중지하였을 때 사용되는 function
        */
        async paused(){
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.PAUSED;
            actionData['extension']['ended-time'] = new Date().toISOString();

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Resumed
         *  + 활동 재개 xAPI
         *  + 활동을 재개하였을 때 사용되는 function
        */
        async resumed(){
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.RESUMED;
            actionData['extension']['started-time'] = new Date().toISOString();

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Attempted
         *  + 로그인 실패 xAPI
         *  + 로그인 시도 후 실패하였을 때 사용되는 function
         * @param attemptCount
        */
        async attempted(data, attemptCount){
            xAPIUtil.Session.setSessionData(data);
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.ATTEMPTED;
            actionData['extension']['attempt-count'] = attemptCount;

            delete actionData['extension']['session-id'];
            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Entered
         *  + 그룹활동 모임 공간 입장 xAPI
         *  + 그룹활동 모임 공간에 입장하였을 때 사용되는 function
        */
        async entered(){
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.ENTERED;
            actionData['extension']['started-time'] = new Date().toISOString();

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Leaved
         *  + 그룹활동 모임 공간 퇴장 xAPI
         *  + 그룹활동 모임 공간에서 퇴장하였을 때 사용되는 function
         * @param leavedReason
        */
        async leaved(leavedReason){
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.LEAVED;
            if(leavedReason != null) actionData['extension']['leaved-reason'] = leavedReason;
            actionData['extension']['ended-time'] = new Date().toISOString();

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Attended
         *  + 그룹활동 참석 xAPI
         *  + 그룹활동 참석하였을 때 사용되는 function
         * @param attendedReason
        */
        async attended(attendedReason){
            let actionData = cloneData(this.actionDataObj);

            actionData['verb'] = xAPIUtil.Session.VERB.ATTENDED;
            actionData['extension']['attended-time'] = new Date().toISOString();
            if(attendedReason != null) actionData['extension']['attended-reason'] = attendedReason;

            delete actionData.result;
            
            await sendLRS(actionData);
        }
    },
    // Navigation Profile
    Navigation: {
        // Navigation Profile Verb List 및 선언부
        "VERB": {
            "MOVED_TO": "Moved-To",
            "NEXT": "Next",
            "PREVIOUS": "Previous",
            "CLICKED": "Clicked",
            "VIEWED": "Viewed",
            "POPPED_UP": "Popped-Up",
            "OPENED": "Opened",
            "CLOSED": "Closed"
        },
        /**
         * Navigation Data Setting
         *  + Action Data의 공통 항목 설정
         * @param data
         * @returns actionData
        */
        setNavigationData(data){
            // Action Data 기본 구조 선언
            let actionData = {'object':{'name':{},'description':{}}, 'result': {},'extension': {}}
            // Language Map 구성
            let objectNameKey = APPLICATION_DATA.LANG +'-'+ APPLICATION_DATA.LOCALE;

            // Navigation Profile Object 설정
            actionData['object']['type'] = data['object']['type'];
            actionData['object']['id'] = data['object']['id'];
            actionData['object']['name'][objectNameKey] = data['object']['name'];
            if(data['object'].hasOwnProperty('description')) actionData['object']['description'][APPLICATION_DATA.LANG+'-'+APPLICATION_DATA.LOCALE] = data['object']['description'];

            return actionData;
        },
        /**
         * xAPI Verb: Moved-To
         *  + 특정 목적지 이동 xAPI
         *  + 특정 목적지로 이동하였을 때 사용되는 function
         * @param data
        */
        async movedTo(data){
            let actionData = xAPIUtil.Navigation.setNavigationData(data);

            actionData['verb'] = xAPIUtil.Navigation.VERB.MOVED_TO;
            actionData['extension']['started-time'] = new Date().toISOString();
            actionData['extension']['target-id'] = data['extension']['target-id'];
            actionData['extension']['target-type'] = data['extension']['target-type'];
            
            if(data['extension'].hasOwnProperty('target-name')) actionData['extension']['target-name'] = data['extension']['target-name'];
            if(data['extension'].hasOwnProperty('referrer-id')) actionData['extension']['referrer-id'] = data['extension']['referrer-id'];
            if(data['extension'].hasOwnProperty('referrer-type')) actionData['extension']['referrer-type'] = data['extension']['referrer-type'];
            if(data['extension'].hasOwnProperty('referrer-name')) actionData['extension']['referrer-name'] = data['extension']['referrer-name'];
        
            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Next
         *  + 다음 목적지 이동 xAPI
         *  + 다음 목적지로 이동하였을 때 사용되는 function
         * @param data
        */
        async next(data){
            let actionData = xAPIUtil.Navigation.setNavigationData(data);
            
            actionData['verb'] = xAPIUtil.Navigation.VERB.NEXT;

            if(data['extension'].hasOwnProperty('current-index')) actionData['extension']['current-index'] = data['extension']['current-index'];
            if(data['extension'].hasOwnProperty('total-index')) actionData['extension']['total-index'] = data['extension']['total-index'];
            
            actionData['extension']['target-id'] = data['extension']['target-id'];
            actionData['extension']['target-type'] = data['extension']['target-type'];
            actionData['extension']['referrer-id'] = data['extension']['referrer-id'];
            actionData['extension']['referrer-type'] = data['extension']['referrer-type'];

            if(data['extension'].hasOwnProperty('target-name')) actionData['extension']['target-name'] = data['extension']['target-name'];
            if(data['extension'].hasOwnProperty('referrer-name')) actionData['extension']['referrer-name'] = data['extension']['referrer-name'];
        
            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Previous
         *  + 이전 목적지 이동 xAPI
         *  + 이전 목적지로 이동하였을 때 사용되는 function
         * @param data
        */
        async previous(data){
            let actionData = xAPIUtil.Navigation.setNavigationData(data);
            
            actionData['verb'] = xAPIUtil.Navigation.VERB.PREVIOUS;
            
            if(data['extension'].hasOwnProperty('current-index')) actionData['extension']['current-index'] = data['extension']['current-index'];
            actionData['extension']['total-index'] = data['extension']['total-index'];
            actionData['extension']['target-id'] = data['extension']['target-id'];
            actionData['extension']['target-type'] = data['extension']['target-type'];
            actionData['extension']['referrer-id'] = data['extension']['referrer-id'];
            actionData['extension']['referrer-type'] = data['extension']['referrer-type'];

            if(data['extension'].hasOwnProperty('target-name')) actionData['extension']['target-name'] = data['extension']['target-name'];
            if(data['extension'].hasOwnProperty('referrer-name')) actionData['extension']['referrer-name'] = data['extension']['referrer-name'];
        
            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Clicked
         *  + 특정 버튼 링크 등을 클릭 xAPI
         *  + 특정 버튼 링크 등을 클릭하였을 때 사용되는 function
         * @param data
        */
        async clicked(data){
            let actionData = xAPIUtil.Navigation.setNavigationData(data);
            
            actionData['verb'] = xAPIUtil.Navigation.VERB.CLICKED;
            actionData['extension']['target-id'] = data['extension']['target-id'];
            actionData['extension']['target-type'] = data['extension']['target-type'];

            if(data['extension'].hasOwnProperty('target-name')) actionData['extension']['target-name'] = data['extension']['target-name'];
        
            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Viewed
         *  + 현재 위치의 내용 확인 xAPI
         *  + 현재 위치의 내용을 확인하였을 때 사용되는 function
         * @param data
        */
        async viewed(data){
            let actionData = xAPIUtil.Navigation.setNavigationData(data);
            
            actionData['verb'] = xAPIUtil.Navigation.VERB.VIEWED;
            
            if(data['extension'].hasOwnProperty('view-started-time')) actionData['extension']['view-started-time'] = data['extension']['view-started-time'];
            if(data['extension'].hasOwnProperty('view-ended-time')) actionData['extension']['view-ended-time'] = data['extension']['view-ended-time'];
            actionData['extension']['target-id'] = data['extension']['target-id'];
            actionData['extension']['target-type'] = data['extension']['target-type'];

            if(data['extension'].hasOwnProperty('target-name')) actionData['extension']['target-name'] = data['extension']['target-name'];

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Popped-Up
         *  + 팝업 xAPI
         *  + 새로운 경로로 팝업이 필요할 때 사용되는 function
         * @param data
        */
        async poppedUp(data){
            let actionData = xAPIUtil.Navigation.setNavigationData(data);
            
            actionData['verb'] = xAPIUtil.Navigation.VERB.POPPED_UP;
            actionData['extension']['target-id'] = data['extension']['target-id'];
            actionData['extension']['target-type'] = data['extension']['target-type'];
            actionData['extension']['referrer-id'] = data['extension']['referrer-id'];
            actionData['extension']['referrer-type'] = data['extension']['referrer-type'];

            if(data['extension'].hasOwnProperty('target-name')) actionData['extension']['target-name'] = data['extension']['target-name'];
            if(data['extension'].hasOwnProperty('referrer-name')) actionData['extension']['referrer-name'] = data['extension']['referrer-name'];

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Opened
         *  + 탐색 시작 xAPI
         *  + 탐색 시작되었을 때 사용되는 function
         * @param data
        */
        async opened(data){
            let actionData = xAPIUtil.Navigation.setNavigationData(data);
            
            actionData['verb'] = xAPIUtil.Navigation.VERB.OPENED;
            actionData['extension']['target-id'] = data['extension']['target-id'];
            actionData['extension']['target-type'] = data['extension']['target-type'];

            if(data['extension'].hasOwnProperty('target-name')) actionData['extension']['target-name'] = data['extension']['target-name'];
            actionData['extension']['referrer-id'] = data['extension']['referrer-id'];
            actionData['extension']['referrer-type'] = data['extension']['referrer-type'];

            if(data['extension'].hasOwnProperty('referrer-name')) actionData['extension']['referrer-name'] = data['extension']['referrer-name'];

            delete actionData.result;
        
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Closed
         *  + 탐색 종료 xAPI
         *  + 탐색 종료되었을 때 사용되는 function
         * @param data
        */
        async closed(data){
            let actionData = xAPIUtil.Navigation.setNavigationData(data);
            
            actionData['verb'] = xAPIUtil.Navigation.VERB.CLOSED;
            actionData['extension']['target-id'] = data['extension']['target-id'];
            actionData['extension']['target-type'] = data['extension']['target-type'];
            if(data['extension'].hasOwnProperty('target-name')) actionData['extension']['target-name'] = data['extension']['target-name'];

            delete actionData.result;
        
            await sendLRS(actionData);
        }
    },
    // Media Profile
    Media: {
        // Media Profile Verb List 및 선언부
        "VERB" : {
            "INITIALIZED" : 'Initialized',
            "PLAYED" : 'Played',
            "PAUSED" : 'Paused',
            "SEEKED" : 'Seeked',
            "COMPLETED" : 'Completed',
            "TERMINATED" : 'Terminated',
            "INTERACTED" : 'Interacted'
        },
        /**
         * Media Data Setting
         *  + Action Data의 공통 항목 설정
         * @param data
         * @returns actionDataObj
        */
        setMediaData(data) {
            // Action Data 기본 구조 선언
            let actionDataObj = {'object':{'name':{},'description':{}}, 'result': {},'extension': {}};

            // Object 구성
            if (data.hasOwnProperty('object')) {
                // Object
                if (data['object'].hasOwnProperty('type'))                      actionDataObj['object']['type'] = data['object']['type'];
                if (data['object'].hasOwnProperty('id'))                        actionDataObj['object']['id'] = data['object']['id'];
                if (data['object'].hasOwnProperty('name'))                      actionDataObj['object']['name'][APPLICATION_DATA.LANG + "-" + APPLICATION_DATA.LOCALE] = data['object']['name'];
                if (data['object'].hasOwnProperty('description'))               actionDataObj['object']['description'][APPLICATION_DATA.LANG + "-" + APPLICATION_DATA.LOCALE] = data['object']['description'];
            }
            
            // Extension 구성
            if (data.hasOwnProperty('extension')) {
                // Result Extension
                if (data['extension'].hasOwnProperty('time'))                   actionDataObj['extension']['time'] = data['extension']['time'];
                if (data['extension'].hasOwnProperty('time-from'))              actionDataObj['extension']['time-from'] = data['extension']['time-from'];
                if (data['extension'].hasOwnProperty('time-to'))                actionDataObj['extension']['time-to'] = data['extension']['time-to'];
                if (data['extension'].hasOwnProperty('progress'))               actionDataObj['extension']['progress'] = data['extension']['progress'];
                if (data['extension'].hasOwnProperty('played-segments'))        actionDataObj['extension']['played-segments'] = data['extension']['played-segments'];
                // Context Extension
                if (data['extension'].hasOwnProperty('media-session-id'))       actionDataObj['extension']['media-session-id'] = data['extension']['media-session-id'];
                if (data['extension'].hasOwnProperty('cc-subtitle-enabled'))    actionDataObj['extension']['cc-subtitle-enabled'] = data['extension']['cc-subtitle-enabled'];
                if (data['extension']['cc-subtitle-enabled'] && data['extension'].hasOwnProperty('cc-subtitle-lang'))
                                                                                actionDataObj['extension']['cc-subtitle-lang'] = data['extension']['cc-subtitle-lang'];
                if (data['extension'].hasOwnProperty('frame-rate'))             actionDataObj['extension']['frame-rate'] = data['extension']['frame-rate'];
                if (data['extension'].hasOwnProperty('full-screen'))            actionDataObj['extension']['full-screen'] = data['extension']['full-screen'];
                if (data['extension'].hasOwnProperty('quality'))                actionDataObj['extension']['quality'] = data['extension']['quality'];
                if (data['extension'].hasOwnProperty('screen-size'))            actionDataObj['extension']['screen-size'] = data['extension']['screen-size'];
                if (data['extension'].hasOwnProperty('video-playback-size'))    actionDataObj['extension']['video-playback-size'] = data['extension']['video-playback-size'];
                if (data['extension'].hasOwnProperty('speed'))                  actionDataObj['extension']['speed'] = data['extension']['speed'];
                if (data['extension'].hasOwnProperty('track'))                  actionDataObj['extension']['track'] = data['extension']['track'];
                if (data['extension'].hasOwnProperty('volume'))                 actionDataObj['extension']['volume'] = data['extension']['volume'];
                if (data['extension'].hasOwnProperty('completion-threshold'))   actionDataObj['extension']['completion-threshold'] = data['extension']['completion-threshold'];
                if (data['extension'].hasOwnProperty('tag'))                    actionDataObj['extension']['tag'] = data['extension']['tag'];
                if (data['extension'].hasOwnProperty('length'))                 actionDataObj['extension']['length'] = data['extension']['length'];
                if (data['extension'].hasOwnProperty('user-agent'))             actionDataObj['extension']['user-agent'] = data['extension']['user-agent'];
                else                                                            actionDataObj['extension']['user-agent'] = APPLICATION_DATA.USER_AGENT;
            }

            return actionDataObj;
        },
        /**
         * xAPI Verb: Initialized
         *  + Media 초기화 xAPI
         *  + Media 가 완전히 초기화되었거나 시작되었을 때 사용되는 function
         * @param data
        */
        async initialized(data){
            // Media Action Data 설정
            let actionData = xAPIUtil.Media.setMediaData(data);
            // Media Verb 설정
            actionData['verb'] = xAPIUtil.Media.VERB.INITIALIZED;
    
            delete actionData.result;
    
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Initialized
         *  + Media 재생 xAPI
         *  + Actor가 Media를 시작했을 때 사용되는 function
         * @param data
        */
        async played(data){
            // Media Action Data 설정
            let actionData = xAPIUtil.Media.setMediaData(data);
            // Media Verb 설정
            actionData['verb']  = xAPIUtil.Media.VERB.PLAYED;
    
            delete actionData.result;
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Paused
         *  + Media 일시중지 xAPI
         *  + Media를 일시적 또는 영구적으로 중지했을때 사용되는 function
         * @param data
        */
        async paused(data){
            // Media Action Data 설정
            let actionData = xAPIUtil.Media.setMediaData(data);
            // Media Verb 설정
            actionData['verb'] = xAPIUtil.Media.VERB.PAUSED;
            if(data['result'].hasOwnProperty("duration")) actionData['result']['duration'] = data['result']['duration'];

            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Seeked
         *  + Media 탐색 xAPI
         *  + Media 진행 시점을 특정 지점으로 변경했을 때 사용되는 function
         * @param data
        */
        async seeked(data){
            // Media Action Data 설정
            let actionData = xAPIUtil.Media.setMediaData(data);
            // Media Verb 설정
            actionData['verb'] = xAPIUtil.Media.VERB.SEEKED;
    
            delete actionData.result;
    
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Interacted
         *  + Media 상호작용 xAPI
         *  + Media Player와 상호작용했을때 사용되는 function (예 : 음소거, 음소거 해제, 해상도 변경, 플레이어 크기 변경 등)
         * @param data
        */
        async interacted(data){
            // Media Action Data 설정
            let actionData = xAPIUtil.Media.setMediaData(data);
            // Media Verb 설정
            actionData['verb'] = xAPIUtil.Media.VERB.INTERACTED;
    
            delete actionData.result;
    
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Completed
         *  + Media 완료 xAPI
         *  + Media의 모든 부분을 한 번 이상 시청하여 완료했을때 사용되는 function
         * @param data
        */
        async completed(data){
            // Media Action Data 설정
            let actionData = xAPIUtil.Media.setMediaData(data);
            // Media Verb 설정
            actionData['verb'] = xAPIUtil.Media.VERB.COMPLETED;
            
            actionData['result']['completion'] = data['result']['completion'];
            if(data['result'].hasOwnProperty("duration")) actionData['result']['duration'] = data['result']['duration'];
    
            await sendLRS(actionData);
        },
        /**
         * xAPI Verb: Terminated
         *  + Media 종료 xAPI
         *  + Media를 완전히 종료했을때 사용되는 function
         * @param data
        */
        async terminated(data){
            // Media Action Data 설정
            let actionData = xAPIUtil.Media.setMediaData(data);
            // Media Verb 설정
            actionData['verb'] = xAPIUtil.Media.VERB.TERMINATED;
            if(data.hasOwnProperty("duration")) actionData['result']['duration'] = data['result']['duration'];

            await sendLRS(actionData);
        }
    }
}

/**
 * xAPI 전송
 *  + Action Data 구성
 *  + LRS로 xAPI Data 전송
 * @param actionData 
 */
async function sendLRS(actionData) {
    // Set Action Data
    var setXAPIDataResult = xAPIUtil.xapiBuilderObj.setXAPIData(actionData);
    console.log(actionData['verb'], 'Send ResultCode : ', setXAPIDataResult);

    // Send Statement to LRS
    await ADL.XAPIWrapper.sendStatement(xAPIUtil.xapiBuilderObj.getStatementObj(), function(resp, obj){  
        console.log('status:' + resp.status + ', data:' + resp.statusText);});
}

/**
 * Get Statement Data
 * @returns statement
 */
function getStatement(){
    return xAPIUtil.xapiBuilderObj.getStatementObj()
}

/**
 * Object Deep Copy
 * @param origin 
 * @returns object
 */
function cloneData(origin){
    var cloned = {}
    for(let i in origin){
        if(origin[i] != null && typeof origin[i] === "object"){
            cloned[i] = cloneData(origin[i]);
        } else {
            cloned[i] = origin[i];
        }
    }
    return cloned;
}