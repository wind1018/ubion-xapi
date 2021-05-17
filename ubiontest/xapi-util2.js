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

        if(typeof(APPLICATION_INITIALIZE_DATA) !== 'undefined'){

            for(var key in this){                        
                var temp = APPLICATION_INITIALIZE_DATA[key];
                if(typeof(temp) !== 'undefined'){
                
                    APPLICATION_DATA[key] = temp;
                }
            }
        }

        console.log(APPLICATION_DATA);
    }
};


(function() {

    //console.log(APPLICATION_DATA, APPLICATION_INITIALIZE_DATA);
    APPLICATION_DATA.Initialize_DATA();
    console.log(APPLICATION_DATA, APPLICATION_INITIALIZE_DATA);
    
})();

console.log(APPLICATION_DATA, APPLICATION_INITIALIZE_DATA);

// function addJavascript(jsname) {
//     var th = document.getElementsByTagName('head')[0];
//     var s = document.createElement('script');
//     s.setAttribute('type','text/javascript');
//     s.setAttribute('src',jsname);
//     th.appendChild(s);    
// }

// addJavascript('../dist/BUILDER.js');
// addJavascript('../xapi-wrapper/dist/xapiwrapper.min.js');
