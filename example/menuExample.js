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
        "parent" : [
            {
                "id": "http://www.example.com/menu",
                "name": {"language":"ko-KR", "value": "전체 메뉴"},
                "description" : {"language":"ko-KR", "value": "전체 메뉴"}
            }
        ],
        "sessionId": sessionId,
        "platform": platform
    }
    
    xAPIInitialize(initializeSampleData);

}

/******************************************************************************/
/******************************** xAPI Moved To ******************************/
/******************************************************************************/
function movedTo(){

    var actionData = {
        "object": {
            "activityName": "webpage",
            "ObjectId": "https://example.com/example/mediaExample.html",
            "name": {"ko-KR": "동영상보기"},
            "description" :{
                "ko-KR": " 바다속 체험"
            }
        },
        "verb": "moved-to",
        "extension":{
            "target-id":"https://example.com/example/mediaExample.html",
            "target-type" : "webpage",
            "target-name": "mediaExample",
            "referrer-id": "https://www.example.co.kr/example/menuExample.html",         
            "referrer-type": "Menu",                                            
            "referrer-name": "menu page"    
        }
    }
    sendLRS(actionData);
    location.href = "./mediaExample.html";
}

/******************************************************************************/
/******************************* xAPI Logged-Out ******************************/
/******************************************************************************/
function loggedOut(){
    let currentTime = new Date().toISOString();
    let sessionId = localStorage.getItem('sessionId');

    var actionData = {
        "object": {
            "activityName": "software-application", //software-application, group-activity
            "ObjectId": "https://example.com/example/menuExample.html",
            "name":{                                                         
                "en-US": "menu"
            },
            "description" :{
                "en-US": "menu page"
            }
        },
        "verb": "logged-out",
        "extension":{
            "session-id": sessionId,
            "ended-time": currentTime
        }
    }

    sendLRS(actionData);

    localStorage.clear();
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
    
    var res = xapiBuilderObj.initializeXAPI(data);
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