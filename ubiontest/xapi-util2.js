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
    PLATFORM : 'Ubion xAPI Sample',
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
    SESS_ID : '4a080e44-d6bf-42fb-8241-f9cc730bbd51',
    // ip-address
    IP : '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    // 로그인 사용자 ID or Email
    USER_ID : 'james@example.com',
    // USER_ID : {"account": {"homePage": "https://www.sample.com","name": "제임스"}},
    // 로그인 사용자 이름
    USER_NAME : '제임스',
    // USER_TEAM : {"member":[{'id': 'james@example.com', 'name': '제임스'},{'id': 'kim@example.com', 'name': '킴'},{"account": {"homePage": "https://www.sample.com","name": "제임스"}, 'name': '리'}]}
}

