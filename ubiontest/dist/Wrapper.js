var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Object 복사
 * @param origin 오리지널 데이터
 * @returns 복사된 데이터
 */
// function cloneData(origin : any) : any{
//     var cloned = {}
//     for(let i in origin){
//         if(origin[i] != null && typeof origin[i] === "object"){
//             cloned[i] = cloneData(origin[i]);
//         } else {
//             cloned[i] = origin[i];
//         }
//     }
//     return cloned;
// }
/**
 * 언어 및 지역 설정 값
 */
var Locales = {
    "ko-KR": { "ko-KR": { "lang": "ko", "locale": "KR" } },
    "en-US": { "en-US": { "lang": "en", "locale": "KR" } } // 영어 - 미국
};
// let SessionDataOBjectType : {
//     [key:string] : {[key:string] : string}
// } = {
//     "software" : 
// }
// enum SessionDataObjectType 
// {
//     "software-application",
//     "group-activity"
// }
var Wrapper = /** @class */ (function () {
    function Wrapper(application_Data) {
        // Wrapper 처리
        this.Initialize();
        // APPLICATION Data 전달
        this.APPLICATION_DATA = application_Data;
        console.log(this.APPLICATION_DATA);
        //                                                      this.InitializeActivity(this.APPLICATION_DATA);
    }
    Wrapper.prototype.Initialize = function () {
        // Builder 생성
        this.Builder = new XAPI.xAPIBuilder();
        //this.resultCode = this.Builder
        // 이 부분을 외부에서 지정할 수 있도록 변경 필요
        var configData = this.Builder.getConfigData();
        // Set Connection Info. to xAPI Wrapper
        ADL.XAPIWrapper.changeConfig({
            'endpoint': configData.endpoint,
            'auth': 'Basic ' + toBase64(configData.username + ':' + configData.password)
        });
    };
    /**
     * 설정 파일을 읽어 들인다.
     */
    Wrapper.prototype.LoadConfig = function () {
    };
    /**
     * Activity Data 초기화 작업
     *  + Actor Data 초기화
     *  + Context Data 초기화
     * @param data
     */
    Wrapper.prototype.InitializeActivity = function (data) {
        var initializeData = this.cloneData(data);
        // APPLICATION_DATA로 선언한 항목 Initial Data setting
        var actorName = { "name": this.APPLICATION_DATA.USER_NAME };
        initializeData['actor'] = actorName;
        initializeData['session_id'] = this.APPLICATION_DATA.SESS_ID;
        initializeData['platform'] = this.APPLICATION_DATA.PLATFORM;
        // 필수 프로퍼티에 대한 검사처리
        this.validProperty(this.APPLICATION_DATA, "USER_ID", "USER_NAME", "SESS_ID");
        // convert mbox to mbox_sha1sum
        // actor의 mbox 암호화 처리
        if (this.Builder.emailRegExp.test(this.APPLICATION_DATA.USER_ID)) {
            initializeData['actor']['id'] = toSHA1(this.APPLICATION_DATA.USER_ID);
        }
        else if (this.APPLICATION_DATA.USER_ID.hasOwnProperty('account')) {
            initializeData['actor'] = this.APPLICATION_DATA.USER_ID;
        }
        else {
            initializeData['actor']['id'] = this.APPLICATION_DATA.USER_ID;
        }
        initializeData['actor']['team'] = this.APPLICATION_DATA.USER_TEAM;
        if (initializeData['actor']['team'] == undefined) {
            delete initializeData['actor']['team'];
        }
        else if (initializeData['actor']['team'] != undefined) {
            if (initializeData['actor'].hasOwnProperty('team')) {
                for (var item in initializeData['actor']['team']['member']) {
                    if (this.Builder.emailRegExp.test(initializeData['actor']['team']['member'][item]['id'])) {
                        initializeData['actor']['team']['member'][item]['id'] = toSHA1(initializeData['actor']['team']['member'][item]['id']);
                    }
                }
            }
        }
        // context의 각 property별 mbox 암호화 처리
        if (initializeData.hasOwnProperty('instructor')) {
            if (this.Builder.emailRegExp.test(initializeData['instructor']['id'])) {
                initializeData['instructor']['id'] = toSHA1(initializeData['instructor']['id']);
            }
            else if (initializeData['instructor'].hasOwnProperty('account')) {
                initializeData['instructor'] = initializeData['instructor'];
            }
        }
        if (initializeData.hasOwnProperty('team')) {
            for (var item in initializeData['team']['member']) {
                if (this.Builder.emailRegExp.test(initializeData['team']['member'][item]['id'])) {
                    initializeData['team']['member'][item]['id'] = toSHA1(initializeData['team']['member'][item]['id']);
                }
                else if (initializeData['team']['member'][item].hasOwnProperty('account')) {
                    initializeData['team']['member'][item] = initializeData['team']['member'][item];
                }
            }
        }
        if (initializeData.hasOwnProperty('parent')) {
            var parentObj = {};
            for (var item in initializeData['parent']) {
                if (initializeData['parent'][item].hasOwnProperty('name')) {
                    parentObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['parent'][item]['name']
                    };
                    initializeData['parent'][item]['name'] = parentObj;
                    parentObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['parent'][item]['description']
                    };
                    initializeData['parent'][item]['description'] = parentObj;
                }
            }
        }
        if (initializeData.hasOwnProperty('grouping')) {
            var groupingObj = {};
            for (var item in initializeData['grouping']) {
                if (initializeData['grouping'][item].hasOwnProperty('name')) {
                    groupingObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['grouping'][item]['name']
                    };
                    initializeData['grouping'][item]['name'] = groupingObj;
                    groupingObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['grouping'][item]['description']
                    };
                    initializeData['grouping'][item]['description'] = groupingObj;
                }
            }
        }
        if (initializeData.hasOwnProperty('other')) {
            var otherObj = {};
            for (var item in initializeData['other']) {
                if (initializeData['other'][item].hasOwnProperty('name')) {
                    otherObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['other'][item]['name']
                    };
                    initializeData['other'][item]['name'] = otherObj;
                    otherObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['other'][item]['description']
                    };
                    initializeData['other'][item]['description'] = otherObj;
                }
            }
        }
        console.log(initializeData);
        // Activity Data initial
        var res = this.Builder.initializeXAPI(initializeData);
        console.log('Result : ', res);
    };
    /**
     * xAPI 전송
     *  + Action Data 구성
     *  + LRS로 xAPI Data 전송
     * @param actionData
     */
    Wrapper.prototype.sendRS = function (actionData) {
        return __awaiter(this, void 0, void 0, function () {
            var setXAPIDataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setXAPIDataResult = this.Builder.setXAPIData(actionData);
                        console.log(actionData['verb'], 'Send ResultCode : ', setXAPIDataResult);
                        // Send Statement to LRS
                        return [4 /*yield*/, ADL.XAPIWrapper.sendStatement(this.Builder.getStatementObj(), function (resp, obj) {
                                console.log('status:' + resp.status + ', data:' + resp.statusText);
                            })];
                    case 1:
                        // Send Statement to LRS
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Builder 상태
     * @returns statment
     */
    Wrapper.prototype.getStatment = function () {
        return this.Builder.getStatementObj();
    };
    /**
     * Object 복사
     * @param origin 오리지널 데이터
     * @returns 복사본
     */
    Wrapper.prototype.cloneData = function (origin) {
        var cloned = {};
        for (var i in origin) {
            if (origin[i] != null && typeof origin[i] === "object") {
                cloned[i] = this.cloneData(origin[i]);
            }
            else {
                cloned[i] = origin[i];
            }
        }
        return cloned;
    };
    /**
     * Property 검사
     * @param data 검사할 데이터
     * @param name 검사할 Property name
     * @returns
     */
    Wrapper.prototype.validProperty = function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log(data, args);
        for (var idx in args) {
            var name_1 = args[idx];
            var childNameIndex = name_1.indexOf(".");
            if (childNameIndex > -1) {
                var dataName = name_1.substring(0, childNameIndex);
                var childName = name_1.substring(name_1.indexOf(".") + 1);
                this.validProperty(eval("data." + dataName), childName);
            }
            else {
                if (data == false) {
                    throw { code: 500, status: "INTERNAL_ERROR", data: "잘못된 데이터입니다." };
                }
                else if (data.hasOwnProperty(name_1) == false) {
                    throw { code: 300, status: "MISSING_PARAMETER_REQUIRED", data: "'" + name_1 + "' Parameter 누락" };
                }
                else if ((data[name_1] !== undefined && data[name_1] !== null) == false) {
                    throw { code: 310, status: "MISMATCH_PARAMETER_FORMAT", data: "'" + name_1 + "' Parameter 에 잘못된 데이터가 있습니다." };
                }
            }
        }
        return true;
    };
    return Wrapper;
}());
var Application;
(function (Application) {
    var SessionActionData //implements IActionSessionData 
     = /** @class */ (function () {
        /**
         * 실행정보 셋팅
         * @param SessionInfo
         */
        function SessionActionData(SessionInfo) {
            /**
             * object 유형 선언
             */
            this.object = {
                type: eSessionDataObjectType["software-application"],
                id: null,
                name: null,
                description: null
            };
            /**
             * 확장 유형 선언
             */
            this.extension = {
                "attemp-count": 0,
                "attended-time": null,
                "attended-reason": null,
                "leaved-reason": null,
                "session-id": null,
                "started-time": null,
                "ended-time": null,
                "user-agent": null,
                "ip-address": null,
                "host": null
            };
            // Agent 값 설정
            this.extension["user-agent"] = navigator.userAgent.toLowerCase();
            // Host 명 가져오기
            this.extension["host"] = window.location.origin;
            // Page ID 기본값 셋팅
            this.object.id = window.location.toString();
            // Page ID
            if (typeof (SessionInfo.id) != undefined && SessionInfo.id != null) {
                this.object.id = SessionInfo.id;
            }
            // Page Name 기본값 셋팅
            this.object.name = window.location.pathname.split("/").pop().split(".")[0];
            // Page Name
            if (typeof (SessionInfo.name) != undefined && SessionInfo.name != null) {
                this.object.name = SessionInfo.name;
            }
            // 설명
            if (typeof (SessionInfo.description) != undefined && SessionInfo.description != null) {
                this.object.description = SessionInfo.description;
            }
            // Application 유형
            if (typeof (SessionInfo.type) != undefined && SessionInfo.type != null) {
                this.object.type = SessionInfo.type;
            }
        }
        SessionActionData.prototype.SetAttempCount = function (count) {
            this.extension["attemp-count"] = count;
        };
        return SessionActionData;
    }());
    Application.SessionActionData = SessionActionData;
})(Application || (Application = {}));
var eSessionDataObjectType;
(function (eSessionDataObjectType) {
    eSessionDataObjectType["software-application"] = "software-application";
    eSessionDataObjectType["group-activity"] = "group-activity";
})(eSessionDataObjectType || (eSessionDataObjectType = {}));
// let SessionDataObjectType : { [key:string] : string } ={
//     "software-application" : "software-application",
//     "group-activity" : "group-activity"
// }
var APPLICATION_CONFIG = /** @class */ (function () {
    function APPLICATION_CONFIG(config) {
        // 호스트명 가져오기
        this.HOST = window.location.protocol + "//" + window.location.host;
        // Agent 값 가져오기
        this.USER_AGENT = navigator.userAgent.toString();
        this.Init();
        this.SetConfig(config);
    }
    APPLICATION_CONFIG.prototype.SetConfig = function (config) {
        // Config 값이 있다면
        if (config) {
            this.PLATFORM = config.PLATFORM;
            this.SESS_ID = config.SESS_ID;
            this.IP = config.IP;
            this.USER_ID = config.USER_ID;
            this.USER_NAME = config.USER_NAME;
            this.USER_TEAM = config.USER_TEAM;
        }
    };
    /**
     * 파티셜 클리스에서 선언할 내용
     */
    APPLICATION_CONFIG.prototype.Init = function () {
        this.LANG = null;
        this.LOCALE = null;
        this.UTC_ZONE = null;
    };
    return APPLICATION_CONFIG;
}());
///<reference path="xAPI.Config.ts"/>
/**
 * 한국어 기본 설정
 */
var APPLICATION_CONFIG_koKR = /** @class */ (function (_super) {
    __extends(APPLICATION_CONFIG_koKR, _super);
    function APPLICATION_CONFIG_koKR(config) {
        return _super.call(this, config) || this;
    }
    APPLICATION_CONFIG_koKR.prototype.Init = function () {
        this.LANG = "ko";
        this.LOCALE = "KR";
        this.UTC_ZONE = "+09:00";
    };
    return APPLICATION_CONFIG_koKR;
}(APPLICATION_CONFIG));
//# sourceMappingURL=Wrapper.js.map