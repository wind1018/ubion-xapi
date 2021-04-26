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
    var initializeSampleData = {
        "actor": {
            "id": "anonymous@xApiTest.com",
            "name": "anonymous"
        }
    }
    
    xAPIInitialize(initializeSampleData);
}

/******************************************************************************/
/***************************** logged In Initialized **************************/
/******************************************************************************/
function clickLogIn(){
    let sessionId = xapiBuilderObj.getUuid();
    let userId = "wicked@wicked.com";
    let userNm = "storm";
    let platform = "Ubion xAPI Sample";

    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userNm', userNm);
    localStorage.setItem('platform', platform);

    var sessionInitializeSampleData = {
        "actor": {
            "id": userId,
            "name": userNm
        },
        "sessionId": sessionId,
        "platform": platform
    }

    initializeActivity(sessionInitializeSampleData);

    loggedIn();    
}

/******************************************************************************/
/******************************** xAPI Logged-In ******************************/
/******************************************************************************/
function loggedIn(){
    let currentTime = new Date().toISOString();
    let sessionId = localStorage.getItem('sessionId');

    var actionData = {
        "object": {
            "activityName": "software-application", //software-application, group-activity
            "ObjectId": "https://example.com/example/index.html",
            "name":{                                                         
                "en-US": "index"
            },
            "description" :{
                "en-US": "index page"
            }
        },
        "verb": "logged-in",
        "extension":{
            "session-id": sessionId,
            "started-time": currentTime
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