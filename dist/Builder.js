var XAPI;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 905:
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
/**
 * 공통으로 사용하는 환경 설정 내용
 */
var Config = {
    /** LRS Endpoint */
    endpoint: 'http://wickedstorm.iptime.org/data/xAPI/',
    /** LRS Clients Key */
    key: "5b7a6060d79cff00aaa9ee67b9169bbe238473b2",
    /** LRS Clients secret */
    secret: "9580718c71e462f0a8ce63445b3415465cdff7c2",
    /** ADL Version */
    version: "1.0.3"
};
exports.default = Config;


/***/ }),

/***/ 788:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.__esModule = true;
exports.MediaProfile = void 0;
var xAPIProfile_1 = __webpack_require__(248);
/**
 * media profile
 * + verb, activity, result, context, extension property에 대한 validation 처리
 * + validation 후 verb, activty, result, context, extension property 구성
 */
var MediaProfile = /** @class */ (function (_super) {
    __extends(MediaProfile, _super);
    function MediaProfile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** media play record */
        _this.mediaSessionId = {};
        /** media start flag */
        _this.started = false;
        _this.verbDict = _this.dict.verb.filter(function (data) { return data.hasOwnProperty('media'); });
        _this.activityDict = _this.dict.activityNames.filter(function (data) { return data.hasOwnProperty('media'); });
        _this.resultExtensionsDict = _this.dict.extensions.result.filter(function (data) { return data.hasOwnProperty('media'); });
        _this.contextExtensionsDict = _this.dict.extensions.context.filter(function (data) { return data.hasOwnProperty('media'); });
        return _this;
    }
    /**
     * property validation
     * + verb property validation
     * + profile dictionary의 verb에 존재 여부 validation
     * @param verbName
     * @returns boolean
     */
    MediaProfile.prototype.validateVerbName = function (verbName) {
        return this.verbDict[0]['media'].hasOwnProperty(verbName);
    };
    /**
     * set property
     * + validation 후 verb property 구성
     * @param verbName
     * @returns boolean
     */
    MediaProfile.prototype.setVerb = function (verbName) {
        if (this.verbDict[0]['media'][verbName].id !== '' || undefined && this.verbDict[0]['media'][verbName].display !== '' || undefined) {
            this._verb = {
                id: this.verbDict[0]['media'][verbName].id,
                display: this.verbDict[0]['media'][verbName].display
            };
            return true;
        }
        else {
            console.log({ "error": "setVerb is fail." });
            return false;
        }
    };
    /**
     * property validation
     * + activity property validation
     * + profile dictionary의 activity에 존재 여부 validation
     * @param objectActivityName
     * @returns boolean
     */
    MediaProfile.prototype.validateActivityName = function (objectActivityName) {
        return this.activityDict[0]['media'].hasOwnProperty(objectActivityName.toLocaleLowerCase());
    };
    /**
     * set property
     * + validation 후 activity property 구성
     * @param objectActivityName
     * @param objectID
     * @param definitionName
     * @param description
     * @returns boolean
     */
    MediaProfile.prototype.setActivity = function (objectActivityName, objectID, definitionName, description) {
        objectActivityName = objectActivityName.toLowerCase();
        objectID = objectID;
        var objectType = "Activity";
        if (this.validateActivityName(objectActivityName)) {
            if (definitionName != {} || definitionName != undefined || definitionName != '') {
                if (Object.keys(description).length === 0) {
                    this._activity = {
                        id: objectID,
                        objectType: objectType,
                        definition: {
                            name: definitionName,
                            type: this.activityDict[0]['media'][objectActivityName].type
                        }
                    };
                }
                else {
                    this._activity = {
                        id: objectID,
                        objectType: objectType,
                        definition: {
                            name: definitionName,
                            type: this.activityDict[0]['media'][objectActivityName].type,
                            description: description
                        }
                    };
                }
            }
            return true;
        }
        else {
            console.log({ "error": "setActivity is fail." });
            return false;
        }
    };
    /**
     * property validation
     * + profile dictionary의 result에 존재 여부 validation
     * @param result
     * @returns boolean
     */
    MediaProfile.prototype.validateResult = function (result) {
        var flag = true;
        if (result.hasOwnProperty("score")) {
            if (result["score"].hasOwnProperty("scaled")) {
                if (-1 <= result["score"]["scaled"] && result["score"]["scaled"] <= 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("raw")) {
                if (-1 <= result["score"]["raw"] && result["score"]["raw"] <= 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("min")) {
                if (-1 <= result["score"]["min"] && result["score"]["min"] <= 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("max")) {
                if (-1 <= result["score"]["max"] && result["score"]["max"] <= 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
        }
        if (result.hasOwnProperty("completion")) {
            if (typeof result["completion"] === "boolean") {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        if (result.hasOwnProperty("duration")) {
            if (typeof result["duration"] === "number") {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        if (result.hasOwnProperty("success")) {
            if (typeof result["success"] === "boolean") {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        if (result.hasOwnProperty("response")) {
            if (typeof result["response"] === "string") {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        return flag;
    };
    /**
     * set property
     * + validation 후 result property 구성
     * @param verbName
     * @param result
     * @param extension
     * @returns boolean
     */
    MediaProfile.prototype.setResult = function (verbName, result, extension) {
        var flag = false;
        var ext = {};
        if (!this.mediaSessionId.hasOwnProperty(extension["media-session-id"])) {
            this.mediaSessionId[extension["media-session-id"]] = {};
        }
        if (!this.validateExtensionName(extension)) {
            return flag;
        }
        for (var key in extension) {
            if (this.resultExtensionsDict[0]['media'].hasOwnProperty(key)) {
                ext[this.resultExtensionsDict[0]['media'][key]] = extension[key];
            }
        }
        if (result == undefined) {
            result = {};
        }
        if (verbName == "terminated") {
            result["extensions"] = ext;
            if (this.started == true) {
                this.endPlayedSegment(extension["time"], extension["media-session-id"]);
            }
            if (result["duration"] == undefined) {
                result["duration"] = this.setDuration(extension["media-session-id"]);
            }
            else {
                result["duration"] = "PT" + result["duration"].toFixed(3) + "S";
            }
            result["extensions"][this.resultExtensionsDict[0]['media']["played-segments"]] = this.mediaSessionId[extension["media-session-id"]]["segments"];
            this._result = result;
            flag = true;
        }
        else if (verbName == "paused" || verbName == "completed") {
            this.started = false;
            this.endPlayedSegment(extension["time"], extension["media-session-id"]);
            if (result["duration"] == undefined) {
                result["duration"] = this.setDuration(extension["media-session-id"]);
            }
            else {
                result["duration"] = "PT" + result["duration"].toFixed(3) + "S";
            }
            result["extensions"] = ext;
            result["extensions"][this.resultExtensionsDict[0]['media']["played-segments"]] = this.mediaSessionId[extension["media-session-id"]]["segments"];
            this._result = result;
            flag = true;
        }
        else if (verbName == "played") {
            this.started = true;
            this.startPlayedSegment(extension["time"], extension["media-session-id"]);
            result["extensions"] = ext;
            this._result = result;
            flag = true;
        }
        else if (verbName == "seeked") {
            if (this.started) { // if media started
                result["extensions"] = ext;
                this._result = result;
                this.endPlayedSegment(extension["time-from"], extension["media-session-id"]);
                this.startPlayedSegment(extension["time-to"], extension["media-session-id"]);
                flag = true;
            }
            else {
                result["extensions"] = ext;
                this._result = result;
                flag = true;
            }
        }
        else {
            this._result = result;
            result["extensions"] = ext;
            flag = true;
        }
        return flag;
    };
    /**
     * property validation
     * + profile dictionary의 context에 존재 여부 validation
     * @param extension
     * @returns boolean
     */
    MediaProfile.prototype.validateContextName = function (extension) {
        if (this.validateExtensionName(extension)) {
            return true;
        }
        return false;
    };
    /**
     * set property
     * + validation 후 context property 구성
     * @param extension
     * @returns boolean
     */
    MediaProfile.prototype.setContext = function (extension) {
        var ext = {};
        if (!this.validateExtensionName(extension)) {
            return false;
        }
        for (var key in extension) {
            if (this.contextExtensionsDict[0]['media'].hasOwnProperty(key)) {
                ext[this.contextExtensionsDict[0]['media'][key]] = extension[key];
            }
        }
        this._context = {
            extensions: ext
        };
        return true;
    };
    /**
     * property validation
     * + profile dictionary의 extension에 존재 여부 validation
     * @param extensions
     * @returns boolean
     */
    MediaProfile.prototype.validateExtensionName = function (extensions) {
        var flag = true;
        //result extention
        if (extensions.hasOwnProperty("time")) {
            if (typeof extensions["time"] !== "number") {
                flag = false;
            }
            extensions["time"] = parseFloat(extensions["time"].toFixed(3));
        }
        if (extensions.hasOwnProperty("time-from")) {
            if (typeof extensions["time-from"] !== "number") {
                flag = false;
            }
            extensions["time-from"] = parseFloat(extensions["time-from"].toFixed(3));
        }
        if (extensions.hasOwnProperty("time-to")) {
            if (typeof extensions["time-to"] !== "number") {
                flag = false;
            }
            extensions["time-to"] = parseFloat(extensions["time-to"].toFixed(3));
        }
        if (extensions.hasOwnProperty("progress")) {
            if (typeof extensions["progress"] !== "number") {
                flag = false;
            }
            extensions["progress"] = parseFloat(extensions["progress"].toFixed(3));
        }
        //context extention
        if (extensions.hasOwnProperty("cc-subtitle-enabled")) {
            if (typeof extensions["cc-subtitle-enabled"] !== "boolean") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("cc-subtitle-lang")) {
            if (typeof extensions["cc-subtitle-lang"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("frame-rate")) {
            if (typeof extensions["frame-rate"] !== "number") {
                flag = false;
            }
            extensions["frame-rate"] = parseFloat(extensions["frame-rate"].toFixed(3));
        }
        if (extensions.hasOwnProperty("full-screen")) {
            if (typeof extensions["full-screen"] !== "boolean") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("quality")) {
            if (typeof extensions["quality"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("screen-size")) {
            if (typeof extensions["screen-size"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("video-playback-size")) {
            if (typeof extensions["video-playback-size"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("speed")) {
            if (typeof extensions["speed"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("track")) {
            if (typeof extensions["track"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("user-agent")) {
            if (typeof extensions["user-agent"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("volume")) {
            if (typeof extensions["volume"] !== "number") {
                flag = false;
            }
            else if (0 <= extensions["volume"] && extensions["volume"] <= 1) {
                extensions["volume"] = parseFloat(extensions["volume"].toFixed(3));
            }
        }
        if (extensions.hasOwnProperty("length")) {
            if (typeof extensions["length"] !== "number") {
                flag = false;
            }
            extensions["length"] = parseFloat(extensions["length"].toFixed(3));
        }
        if (extensions.hasOwnProperty("completion-threshold")) {
            if (typeof extensions["completion-threshold"] !== "number") {
                flag = false;
            }
            extensions["completion-threshold"] = parseFloat(extensions["completion-threshold"].toFixed(3));
        }
        if (extensions.hasOwnProperty("tag")) {
            if (typeof extensions["tag"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("media-session-id")) {
            if (typeof extensions["media-session-id"] !== "string") {
                flag = false;
            }
        }
        else {
            flag = false;
        }
        return flag;
    };
    /**
     * property return
     * + verb property return
     * @returns _verb
     */
    MediaProfile.prototype.getCurrentVerb = function () {
        return this._verb;
    };
    /**
     * property return
     * + activity property return
     * @returns _activity
     */
    MediaProfile.prototype.getCurrentActivity = function () {
        return this._activity;
    };
    /**
     * property return
     * + result property return
     * @returns _result
     */
    MediaProfile.prototype.getCurrentResult = function () {
        return this._result;
    };
    /**
     * property return
     * + context property return
     * @returns _context
     */
    MediaProfile.prototype.getCurrentContext = function () {
        return this._context;
    };
    /**
     * property return
     * + result extension property return
     * @returns result extension
     */
    MediaProfile.prototype.getCurrentResultExtension = function () {
        return this._result["extensions"];
    };
    /**
     * property return
     * + context extension property return
     * @returns context extension
     */
    MediaProfile.prototype.getCurrentContextExtension = function () {
        return this._context["extensions"];
    };
    /**
     * property validation
     * + result와 context property의 extension에 대한 validation
     * @param profile
     * @returns boolean
     */
    MediaProfile.prototype.validateProfile = function (profile) {
        var verb = profile['verb']['id'];
        var result = profile['result'];
        var context = profile['context'];
        var flag = false;
        switch (verb) {
            case this.verbDict[0]['media'].initialized.id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["length"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].played.id:
                if (result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].paused.id:
                if (result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["progress"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["played-segments"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["length"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].seeked.id:
                if (result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time-from"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time-to"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].completed.id:
                if (result.hasOwnProperty("completion") &&
                    result.hasOwnProperty("duration") &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["progress"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["played-segments"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["length"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].terminated.id:
                if (result.hasOwnProperty("duration") &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["progress"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["played-segments"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["length"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].interacted.id:
                if (result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])) {
                    flag = true;
                }
                return flag;
        }
    };
    /**
     * Set startSegments
     * @param start ex) 0.000
     * @returns void
     */
    MediaProfile.prototype.startPlayedSegment = function (start, mediaSessionId) {
        this.mediaSessionId[mediaSessionId]["startSegments"] = start;
    };
    /**
     * Set endPlayedSegment and segments
     * @param end ex) 1.000
     * @returns void
     */
    MediaProfile.prototype.endPlayedSegment = function (end, mediaSessionId) {
        var arr;
        arr = (this.mediaSessionId[mediaSessionId]["segments"] == undefined) ? [] : this.mediaSessionId[mediaSessionId]["segments"].split("[,]");
        arr.push(this.mediaSessionId[mediaSessionId]["startSegments"].toFixed(3) + "[.]" + end.toFixed(3));
        this.mediaSessionId[mediaSessionId]["segments"] = arr.join("[,]");
        this.mediaSessionId[mediaSessionId]["endSegments"] = end;
        this.mediaSessionId[mediaSessionId]["startSegments"] = null;
    };
    /**
     * calculate duration
     * @returns duration
     */
    MediaProfile.prototype.calculateDuration = function (mediaSessionId) {
        var arr, arr2;
        //get played segments array
        arr = (this.mediaSessionId[mediaSessionId]["segments"] == undefined) ? [] : this.mediaSessionId[mediaSessionId]["segments"].split("[,]");
        if (this.mediaSessionId[mediaSessionId]["startSegments"] != null) {
            arr.push(this.mediaSessionId[mediaSessionId]["startSegments"].toFixed(3) + "[.]" + this.mediaSessionId[mediaSessionId]["endSegments"].toFixed(3));
        }
        arr2 = [];
        var duration = 0;
        arr.forEach(function (v, i) {
            arr2[i] = v.split("[.]");
            arr2[i][0] *= 1;
            arr2[i][1] *= 1;
            if (arr2[i][1] > arr2[i][0])
                duration += arr2[i][1] - arr2[i][0];
        });
        return duration;
    };
    /**
     * Set duration
     * + duration 계산 (ISO8601 기준)
     * @returns duration
     */
    MediaProfile.prototype.setDuration = function (mediaSessionId) {
        var duration = 0;
        duration = this.calculateDuration(mediaSessionId);
        return "PT" + duration.toFixed(3) + "S";
    };
    return MediaProfile;
}(xAPIProfile_1.xAPIProfile));
exports.MediaProfile = MediaProfile;


/***/ }),

/***/ 896:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.__esModule = true;
exports.NavigationProfile = void 0;
var xAPIProfile_1 = __webpack_require__(248);
/**
 * navigation profile
 * + verb, activity, result, context, extension property에 대한 validation 처리
 * + validation 후 verb, activty, result, context, extension property 구성
 */
var NavigationProfile = /** @class */ (function (_super) {
    __extends(NavigationProfile, _super);
    function NavigationProfile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.iso8601RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
        _this.verbDict = _this.dict.verb.filter(function (data) { return data.hasOwnProperty('navigation'); });
        _this.activityDict = _this.dict.activityNames.filter(function (data) { return data.hasOwnProperty('navigation'); });
        _this.resultExtensionsDict = _this.dict.extensions.result.filter(function (data) { return data.hasOwnProperty('navigation'); });
        _this.contextExtensionsDict = _this.dict.extensions.context.filter(function (data) { return data.hasOwnProperty('navigation'); });
        return _this;
    }
    /**
     * property validation
     * + verb property validation
     * + profile dictionary의 verb에 존재 여부 validation
     * @param verbName
     * @returns boolean
     */
    NavigationProfile.prototype.validateVerbName = function (verbName) {
        return this.verbDict[0]['navigation'].hasOwnProperty(verbName);
    };
    /**
     * set property
     * + validation 후 verb property 구성
     * @param verbName
     * @returns boolean
     */
    NavigationProfile.prototype.setVerb = function (verbName) {
        if (this.verbDict[0]['navigation'][verbName].id !== '' || undefined && this.verbDict[0]['navigation'][verbName].display !== '' || undefined) {
            this._verb = {
                id: this.verbDict[0]['navigation'][verbName].id,
                display: this.verbDict[0]['navigation'][verbName].display
            };
            return true;
        }
        else {
            console.log({ "error": "setVerb is fail." });
            return false;
        }
    };
    /**
     * property validation
     * + activity property validation
     * + profile dictionary의 activity에 존재 여부 validation
     * @param objectActivityName
     * @returns boolean
     */
    NavigationProfile.prototype.validateActivityName = function (objectActivityName) {
        return this.activityDict[0]['navigation'].hasOwnProperty(objectActivityName.toLocaleLowerCase());
    };
    /**
     * set property
     * + validation 후 activity property 구성
     * @param objectActivityName
     * @param objectID
     * @param definitionName
     * @param description
     * @returns boolean
     */
    NavigationProfile.prototype.setActivity = function (objectActivityName, objectID, definitionName, description) {
        objectActivityName = objectActivityName.toLowerCase();
        objectID = objectID;
        var objectType = "Activity";
        if (this.validateActivityName(objectActivityName)) {
            if (definitionName != {} || definitionName != undefined || definitionName != '') {
                if (Object.keys(description).length === 0) {
                    this._activity = {
                        id: objectID,
                        objectType: objectType,
                        definition: {
                            name: definitionName,
                            type: this.activityDict[0]['navigation'][objectActivityName].type
                        }
                    };
                }
                else {
                    this._activity = {
                        id: objectID,
                        objectType: objectType,
                        definition: {
                            name: definitionName,
                            type: this.activityDict[0]['navigation'][objectActivityName].type,
                            description: description
                        }
                    };
                }
            }
            return true;
        }
        else {
            console.log({ "error": "setActivity is fail." });
            return false;
        }
    };
    /**
     * property validation
     * + profile dictionary의 result에 존재 여부 validation
     * @param result
     * @returns boolean
     */
    NavigationProfile.prototype.validateResult = function (result) {
        var flag = true;
        if (result.hasOwnProperty("score")) {
            if (result["score"].hasOwnProperty("scaled")) {
                if (-1 <= result["score"]["scaled"] && result["score"]["scaled"] <= 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("raw")) {
                if (-1 <= result["score"]["raw"] && result["score"]["raw"] <= 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("min")) {
                if (-1 <= result["score"]["min"] && result["score"]["min"] <= 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("max")) {
                if (-1 <= result["score"]["max"] && result["score"]["max"] <= 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
        }
        if (result.hasOwnProperty("completion")) {
            if (typeof result["completion"] === "boolean") {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        if (result.hasOwnProperty("success")) {
            if (typeof result["success"] === "boolean") {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        if (result.hasOwnProperty("response")) {
            if (typeof result["response"] === "string") {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        return flag;
    };
    /**
     * set property
     * + validation 후 result property 구성
     * @param verbName
     * @param result
     * @param extension
     * @returns boolean
     */
    NavigationProfile.prototype.setResult = function (verbName, result, extension) {
        var flag = false;
        var ext = {};
        if (!this.validateExtensionName(extension)) {
            return flag;
        }
        for (var key in extension) {
            if (this.resultExtensionsDict[0]['navigation'].hasOwnProperty(key)) {
                ext[this.resultExtensionsDict[0]['navigation'][key]] = extension[key];
            }
        }
        if (result == undefined) {
            result = {};
        }
        if (verbName == "viewed") {
            if (!result.hasOwnProperty("duration")) {
                result["duration"] = this.setDuration(extension["view-started-time"], extension["view-ended-time"]);
            }
            result["extensions"] = ext;
            this._result = result;
            flag = true;
        }
        this._result = result;
        result["extensions"] = ext;
        flag = true;
        return flag;
    };
    /**
     * property validation
     * + profile dictionary의 context에 존재 여부 validation
     * @param extension
     * @returns boolean
     */
    NavigationProfile.prototype.validateContextName = function (extension) {
        if (this.validateExtensionName(extension)) {
            return true;
        }
        return false;
    };
    /**
     * set property
     * + validation 후 context property 구성
     * @param extension
     * @returns boolean
     */
    NavigationProfile.prototype.setContext = function (extension) {
        var ext = {};
        if (!this.validateExtensionName(extension)) {
            return false;
        }
        for (var key in extension) {
            if (this.contextExtensionsDict[0]['navigation'].hasOwnProperty(key)) {
                ext[this.contextExtensionsDict[0]['navigation'][key]] = extension[key];
            }
        }
        this._context = {
            extensions: ext
        };
        return true;
    };
    /**
     * property validation
     * + profile dictionary의 extension에 존재 여부 validation
     * @param extensions
     * @returns boolean
     */
    NavigationProfile.prototype.validateExtensionName = function (extensions) {
        var flag = true;
        //result extention
        if (extensions.hasOwnProperty("current-index")) {
            if (typeof extensions["current-index"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("total-index")) {
            if (typeof extensions["total-index"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("view-started-time")) {
            extensions["view-started-time"] = new Date(extensions["view-started-time"]).toISOString();
        }
        if (extensions.hasOwnProperty("view-ended-time")) {
            extensions["view-ended-time"] = new Date(extensions["view-ended-time"]).toISOString();
        }
        //context extention
        if (extensions.hasOwnProperty("target-id")) {
            if (typeof extensions["target-id"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("target-type")) {
            if (typeof extensions["target-type"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("target-name")) {
            if (typeof extensions["target-name"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("referrer-id")) {
            if (typeof extensions["referrer-id"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("referrer-type")) {
            if (typeof extensions["referrer-type"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("referrer-name")) {
            if (typeof extensions["referrer-name"] !== "string") {
                flag = false;
            }
        }
        return flag;
    };
    /**
     * property return
     * + verb property return
     * @returns _verb
     */
    NavigationProfile.prototype.getCurrentVerb = function () {
        return this._verb;
    };
    /**
     * property return
     * + activity property return
     * @returns _activity
     */
    NavigationProfile.prototype.getCurrentActivity = function () {
        return this._activity;
    };
    /**
     * property return
     * + result property return
     * @returns _result
     */
    NavigationProfile.prototype.getCurrentResult = function () {
        return this._result;
    };
    /**
     * property return
     * + context property return
     * @returns _context
     */
    NavigationProfile.prototype.getCurrentContext = function () {
        return this._context;
    };
    /**
     * property return
     * + result extension property return
     * @returns result extension
     */
    NavigationProfile.prototype.getCurrentResultExtension = function () {
        return this._result["extensions"];
    };
    /**
     * property return
     * + context extension property return
     * @returns context extension
     */
    NavigationProfile.prototype.getCurrentContextExtension = function () {
        return this._context["extensions"];
    };
    /**
     * property validation
     * + result와 context property의 extension에 대한 validation
     * @param profile
     * @returns boolean
     */
    NavigationProfile.prototype.validateProfile = function (profile) {
        var verb = profile.verb.id;
        var result = profile.result;
        var context = profile.context;
        var flag = false;
        switch (verb) {
            case this.verbDict[0]['navigation']["moved-to"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["next"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-type"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["previous"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-type"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["clicked"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["viewed"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["popped-up"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-type"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["opened"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["closed"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])) {
                    flag = true;
                }
                return flag;
        }
    };
    /**
     * Set duration
     * + duration 계산 (ISO8601 기준)
     * @returns duration
     */
    NavigationProfile.prototype.setDuration = function (startDate, endDate) {
        var start = new Date(startDate).getTime();
        var end = new Date(endDate).getTime();
        var duration = Math.abs(((start - end) / 1000)).toFixed(3);
        return "PT" + duration + "S";
    };
    return NavigationProfile;
}(xAPIProfile_1.xAPIProfile));
exports.NavigationProfile = NavigationProfile;


/***/ }),

/***/ 645:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.__esModule = true;
exports.SessionProfile = void 0;
var xAPIProfile_1 = __webpack_require__(248);
/**
 * session profile
 * + verb, activity, result, context, extension property에 대한 validation 처리
 * + validation 후 verb, activty, result, context, extension property 구성
 */
var SessionProfile = /** @class */ (function (_super) {
    __extends(SessionProfile, _super);
    function SessionProfile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.verbDict = _this.dict.verb.filter(function (data) { return data.hasOwnProperty('session'); });
        _this.activityDict = _this.dict.activityNames.filter(function (data) { return data.hasOwnProperty('session'); });
        _this.resultExtensionsDict = _this.dict.extensions.result.filter(function (data) { return data.hasOwnProperty('session'); });
        _this.contextExtensionsDict = _this.dict.extensions.context.filter(function (data) { return data.hasOwnProperty('session'); });
        return _this;
    }
    /**
     * property validation
     * + verb property validation
     * + profile dictionary의 verb에 존재 여부 validation
     * @param verbName
     * @returns boolean
     */
    SessionProfile.prototype.validateVerbName = function (verbName) {
        return this.verbDict[0]['session'].hasOwnProperty(verbName);
    };
    /**
     * set property
     * + validation 후 verb property 구성
     * @param verbName
     * @returns boolean
     */
    SessionProfile.prototype.setVerb = function (verbName) {
        if (this.verbDict[0]['session'][verbName].id !== '' || undefined && this.verbDict[0]['session'][verbName].display !== '' || undefined) {
            this._verb = {
                id: this.verbDict[0]['session'][verbName].id,
                display: this.verbDict[0]['session'][verbName].display
            };
            return true;
        }
        else {
            console.log({ "error": "setVerb is fail." });
            return false;
        }
    };
    /**
     * property validation
     * + activity property validation
     * + profile dictionary의 activity에 존재 여부 validation
     * @param objectActivityName
     * @returns boolean
     */
    SessionProfile.prototype.validateActivityName = function (objectActivityName) {
        return this.activityDict[0]['session'].hasOwnProperty(objectActivityName.toLocaleLowerCase());
    };
    /**
     * set property
     * + validation 후 activity property 구성
     * @param objectActivityName
     * @param objectID
     * @param definitionName
     * @param description
     * @returns boolean
     */
    SessionProfile.prototype.setActivity = function (objectActivityName, objectID, definitionName, description) {
        objectActivityName = objectActivityName.toLowerCase();
        objectID = objectID;
        var objectType = "Activity";
        if (this.validateActivityName(objectActivityName)) {
            if (definitionName != {} || definitionName != undefined || definitionName != '') {
                if (Object.keys(description).length === 0) {
                    this._activity = {
                        id: objectID,
                        objectType: objectType,
                        definition: {
                            name: definitionName,
                            type: this.activityDict[0]['session'][objectActivityName].type
                        }
                    };
                }
                else {
                    this._activity = {
                        id: objectID,
                        objectType: objectType,
                        definition: {
                            name: definitionName,
                            type: this.activityDict[0]['session'][objectActivityName].type,
                            description: description
                        }
                    };
                }
            }
            return true;
        }
        else {
            console.log({ "error": "setActivity is fail." });
            return false;
        }
    };
    /**
     * property validation
     * + profile dictionary의 result에 존재 여부 validation
     * @param result
     * @returns boolean
     */
    SessionProfile.prototype.validateResult = function (result) {
        var flag = true;
        return flag;
    };
    /**
     * set property
     * + validation 후 result property 구성
     * @param verbName
     * @param result
     * @param extension
     * @returns boolean
     */
    SessionProfile.prototype.setResult = function (verbName, result, extension) {
        var flag = false;
        var ext = {};
        if (!this.validateExtensionName(extension)) {
            return flag;
        }
        for (var key in extension) {
            if (this.resultExtensionsDict[0]['session'].hasOwnProperty(key)) {
                ext[this.resultExtensionsDict[0]['session'][key]] = extension[key];
            }
        }
        if (result == undefined) {
            result = {};
        }
        this._result = result;
        result["extensions"] = ext;
        flag = true;
        return flag;
    };
    /**
     * property validation
     * + profile dictionary의 context에 존재 여부 validation
     * @param extension
     * @returns boolean
     */
    SessionProfile.prototype.validateContextName = function (extension) {
        if (this.validateExtensionName(extension)) {
            return true;
        }
        return false;
    };
    /**
     * set property
     * + validation 후 context property 구성
     * @param extension
     * @returns boolean
     */
    SessionProfile.prototype.setContext = function (extension) {
        var ext = {};
        if (!this.validateExtensionName(extension)) {
            return false;
        }
        for (var key in extension) {
            if (this.contextExtensionsDict[0]['session'].hasOwnProperty(key)) {
                ext[this.contextExtensionsDict[0]['session'][key]] = extension[key];
            }
        }
        this._context = {
            extensions: ext
        };
        return true;
    };
    /**
     * property validation
     * + profile dictionary의 extension에 존재 여부 validation
     * @param extensions
     * @returns boolean
     */
    SessionProfile.prototype.validateExtensionName = function (extensions) {
        var flag = true;
        //result extention
        if (extensions.hasOwnProperty("attempt-count")) {
            if (typeof extensions["attempt-count"] !== "number") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("attended-time")) {
            if (typeof extensions["attended-time"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("leaved-reason")) {
            if (typeof extensions["leaved-reason"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("attended-reason")) {
            if (typeof extensions["attended-reason"] !== "string") {
                flag = false;
            }
        }
        //context extention
        if (extensions.hasOwnProperty("session-id")) {
            if (typeof extensions["session-id"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("started-time")) {
            if (typeof extensions["started-time"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("ended-time")) {
            if (typeof extensions["ended-time"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("user-agent")) {
            if (typeof extensions["user-agent"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("ip-address")) {
            if (typeof extensions["ip-address"] !== "string") {
                flag = false;
            }
        }
        if (extensions.hasOwnProperty("host")) {
            if (typeof extensions["host"] !== "string") {
                flag = false;
            }
        }
        return flag;
    };
    /**
     * property return
     * + verb property return
     * @returns _verb
     */
    SessionProfile.prototype.getCurrentVerb = function () {
        return this._verb;
    };
    /**
     * property return
     * + activity property return
     * @returns _activity
     */
    SessionProfile.prototype.getCurrentActivity = function () {
        return this._activity;
    };
    /**
     * property return
     * + result property return
     * @returns _result
     */
    SessionProfile.prototype.getCurrentResult = function () {
        return this._result;
    };
    /**
     * property return
     * + context property return
     * @returns _context
     */
    SessionProfile.prototype.getCurrentContext = function () {
        return this._context;
    };
    /**
     * property return
     * + result extension property return
     * @returns result extension
     */
    SessionProfile.prototype.getCurrentResultExtension = function () {
        return this._result["extension"];
    };
    /**
     * property return
     * + context extension property return
     * @returns context extension
     */
    SessionProfile.prototype.getCurrentContextExtension = function () {
        return this._context["extension"];
    };
    /**
     * property validation
     * + result와 context property의 extension에 대한 validation
     * @param profile
     * @returns boolean
     */
    SessionProfile.prototype.validateProfile = function (profile) {
        var verb = profile.verb.id;
        var result = profile.result;
        var context = profile.context;
        var flag = false;
        switch (verb) {
            case this.verbDict[0]['session']["logged-in"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["started-time"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["logged-out"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["ended-time"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["timed-out"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["paused"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["ended-time"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["resumed"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["started-time"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["attempted"].id:
                if (result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['session']["attempt-count"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["entered"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["started-time"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["leaved"].id:
                if (context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["ended-time"])) {
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["attended"].id:
                if (result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['session']["attended-time"])) {
                    flag = true;
                }
                return flag;
        }
    };
    return SessionProfile;
}(xAPIProfile_1.xAPIProfile));
exports.SessionProfile = SessionProfile;


/***/ }),

/***/ 428:
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.xAPIDictionary = void 0;
/**
 * verb별 profile dictionary
 * + verb, activity, result extensions, context extensions로 구성
 */
var xAPIDictionary = /** @class */ (function () {
    function xAPIDictionary() {
        this.verb = [
            {
                "media": {
                    "initialized": {
                        "id": "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/initialized",
                        "display": {
                            "en-US": "initialized"
                        }
                    },
                    "played": {
                        "id": "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/played",
                        "display": {
                            "en-US": "played"
                        }
                    },
                    "paused": {
                        "id": "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/paused",
                        "display": {
                            "en-US": "paused"
                        }
                    },
                    "seeked": {
                        "id": "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/seeked",
                        "display": {
                            "en-US": "seeked"
                        }
                    },
                    "completed": {
                        "id": "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/completed",
                        "display": {
                            "en-US": "completed"
                        }
                    },
                    "terminated": {
                        "id": "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/terminated",
                        "display": {
                            "en-US": "terminated"
                        }
                    },
                    "interacted": {
                        "id": "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/interacted",
                        "display": {
                            "en-US": "interacted"
                        }
                    }
                }
            },
            {
                "session": {
                    "logged-in": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/logged-in",
                        "display": {
                            "en-US": "logged-in"
                        }
                    },
                    "logged-out": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/logged-out",
                        "display": {
                            "en-US": "logged-out"
                        }
                    },
                    "timed-out": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/timed-out",
                        "display": {
                            "en-US": "timed-out"
                        }
                    },
                    "paused": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/paused",
                        "display": {
                            "en-US": "paused"
                        }
                    },
                    "resumed": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/resumed",
                        "display": {
                            "en-US": "resumed"
                        }
                    },
                    "attempted": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/attempted",
                        "display": {
                            "en-US": "attempted"
                        }
                    },
                    "entered": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/entered",
                        "display": {
                            "en-US": "entered"
                        }
                    },
                    "leaved": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/leaved",
                        "display": {
                            "en-US": "leaved"
                        }
                    },
                    "attended": {
                        "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/attended",
                        "display": {
                            "en-US": "attended"
                        }
                    }
                }
            },
            {
                "navigation": {
                    "moved-to": {
                        "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/moved-to",
                        "display": {
                            "en-US": "moved-to"
                        }
                    },
                    "next": {
                        "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/next",
                        "display": {
                            "en-US": "next"
                        }
                    },
                    "previous": {
                        "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/previous",
                        "display": {
                            "en-US": "previous"
                        }
                    },
                    "clicked": {
                        "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/clicked",
                        "display": {
                            "en-US": "clicked"
                        }
                    },
                    "viewed": {
                        "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/viewed",
                        "display": {
                            "en-US": "viewed"
                        }
                    },
                    "popped-up": {
                        "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/popped-up",
                        "display": {
                            "en-US": "popped-up"
                        }
                    },
                    "opened": {
                        "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/opened",
                        "display": {
                            "en-US": "opened"
                        }
                    },
                    "closed": {
                        "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/closed",
                        "display": {
                            "en-US": "closed"
                        }
                    }
                }
            }
        ];
        this.activityNames = [
            {
                "media": {
                    "video": {
                        "type": "https://ubion.co.kr/xapi/activity-type/video",
                        "moreInfo": "https://ubion.co.kr/xapi/activity-type/video/info"
                    },
                    "audio": {
                        "type": "https://ubion.co.kr/xapi/activity-type/audio",
                        "moreInfo": "https://ubion.co.kr/xapi/activity-type/audio/info"
                    }
                }
            },
            {
                "session": {
                    "software-application": {
                        "type": "https://ubion.co.kr/xapi/activity-type/software-application",
                        "moreInfo": "https://ubion.co.kr/xapi/activity-type/software-application/info"
                    },
                    "group-activity": {
                        "type": "https://ubion.co.kr/xapi/activity-type/group-activity",
                        "moreInfo": "https://ubion.co.kr/xapi/activity-type/group-activity/info"
                    }
                }
            },
            {
                "navigation": {
                    "document": {
                        "type": "https://ubion.co.kr/xapi/activity-type/document",
                        "moreInfo": "https://ubion.co.kr/xapi/activity-type/document/info"
                    },
                    "webpage": {
                        "type": "https://ubion.co.kr/xapi/activity-type/webpage",
                        "moreInfo": "https://ubion.co.kr/xapi/activity-type/webpage/info"
                    },
                    "menu": {
                        "type": "https://ubion.co.kr/xapi/activity-type/menu",
                        "moreInfo": "https://ubion.co.kr/xapi/activity-type/menu/info"
                    },
                    "toc": {
                        "type": "https://ubion.co.kr/xapi/activity-type/toc",
                        "moreInfo": "https://ubion.co.kr/xapi/activity-type/toc/info"
                    }
                }
            }
        ];
        this.extensions = {
            "result": [
                {
                    "media": {
                        "time": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time",
                        "time-from": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time-from",
                        "time-to": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time-to",
                        "progress": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/progress",
                        "played-segments": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/played-segments"
                    }
                },
                {
                    "session": {
                        "attempt-count": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attempt-count",
                        "attended-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attended-time",
                        "attended-reason": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attended-reason",
                        "leaved-reason": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/leaved-reason"
                    }
                },
                {
                    "navigation": {
                        "current-index": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/current-index",
                        "total-index": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/total-index",
                        "view-started-time": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/view-started-time",
                        "view-ended-time": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/view-ended-time"
                    }
                }
            ],
            "context": [
                {
                    "media": {
                        "media-session-id": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/media-session-id",
                        "cc-subtitle-enabled": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/cc-subtitle-enabled",
                        "cc-subtitle-lang": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/cc-subbtitle-lang",
                        "frame-rate": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/frame-rate",
                        "full-screen": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/full-screen",
                        "quality": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/quality",
                        "screen-size": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/screen-size",
                        "video-playback-size": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/video-playback-size",
                        "speed": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/speed",
                        "track": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/track",
                        "user-agent": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/user-agent",
                        "volume": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/volume",
                        "length": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/length",
                        "completion-threshold": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/completion-threshold",
                        "tag": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/tag"
                    }
                },
                {
                    "session": {
                        "session-id": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/session-id",
                        "started-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/started-time",
                        "ended-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/ended-time",
                        "user-agent": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/user-agent",
                        "ip-address": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/ip-address",
                        "host": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/host"
                    }
                },
                {
                    "navigation": {
                        "target-id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-id",
                        "target-type": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-type",
                        "target-name": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-name",
                        "referrer-id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-id",
                        "referrer-type": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-type",
                        "referrer-name": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-name"
                    }
                }
            ]
        };
    }
    return xAPIDictionary;
}());
exports.xAPIDictionary = xAPIDictionary;


/***/ }),

/***/ 248:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.xAPIProfile = void 0;
var xAPIDictionary_1 = __webpack_require__(428);
/**
 * XapiProfile class
 * extend only
 */
var xAPIProfile = /** @class */ (function () {
    function xAPIProfile() {
        /** XAPI NAMESPACE DICTIONARY */
        this.dict = new xAPIDictionary_1.xAPIDictionary();
    }
    /**
     * Get Verb
     * + profile dictionary에 해당 verb의 property가 있는지 validation
     * + validation 후 setVerb를 호출하여 verb property 구성
     * @param verbName Verb name
     * @returns _verb or error object
     */
    xAPIProfile.prototype.getVerb = function (verbName) {
        if (this.validateVerbName(verbName.toLowerCase())) {
            this.setVerb(verbName.toLowerCase());
            return this._verb;
        }
        else {
            console.log({ "error": "setVerb is fail." });
            return { "error": "getVerb is fail." };
        }
    };
    /**
     * Get Activity
     * + profile dictionary에 해당 activity의 property가 있는지 validation
     * + validation 후 setActivity를 호출하여 activity property 구성
     * @param objectActivityName Activity Name ex) audio video
     * @param objectId obejct Id ex) https://example.com/videos/b6a98d52-1e52-4d45-a14t-a15f97e63d25
     * @param definitionName ex) Ocean Life
     * @param description ex) {"en-US":"some string awsome video"}
     * @return _activity
     */
    xAPIProfile.prototype.getActivity = function (objectActivityName, objectId, definitionName, description) {
        if (this.validateActivityName(objectActivityName)) {
            this.setActivity(objectActivityName, objectId, definitionName, description);
            return this._activity;
        }
        else {
            console.log({ "error": "getActivity is fail." });
            return { "error": "getActivity is fail" };
        }
    };
    /**
     * Get Result
     * + profile dictionary에 해당 result의 property가 있는지 validation
     * + validation 후 setResult를 호출하여 activity property 구성
     * @param verbName verb name ex) played, initialized, etc...
     * @param result result ex) score,completion,duration, etc...
     * @param extension ex) length, time-from, time-to, etc...
     * @return _result
     */
    xAPIProfile.prototype.getResult = function (verbName, result, extension) {
        if (result != undefined) {
            if (this.validateResult(result)) {
                this.setResult(verbName.toLocaleLowerCase(), result, extension);
                return this._result;
            }
            else {
                console.log({ "error": "getResult is fail." });
                return { "error": " setResult is fails" };
            }
        }
        else {
            this.setResult(verbName.toLocaleLowerCase(), result, extension);
            return this._result;
        }
    };
    /**
     * Get Context
     * + profile dictionary에 해당 context의 property가 있는지 validation
     * + validation 후 setContext를 호출하여 activity property 구성
     * @param extension extensions ex) time, time-to ,etc...
     * @return _context
     */
    xAPIProfile.prototype.getContext = function (extension) {
        if (this.validateContextName(extension)) {
            this.setContext(extension);
            return this._context;
        }
        else {
            console.log({ "error": "getContext is fail." });
            return { 'error': 'getContext fail' };
        }
    };
    return xAPIProfile;
}());
exports.xAPIProfile = xAPIProfile;
;
;
;
;
;
;
;


/***/ }),

/***/ 453:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "NIL": () => (/* reexport */ nil),
  "parse": () => (/* reexport */ esm_browser_parse),
  "stringify": () => (/* reexport */ esm_browser_stringify),
  "v1": () => (/* reexport */ esm_browser_v1),
  "v3": () => (/* reexport */ esm_browser_v3),
  "v4": () => (/* reexport */ esm_browser_v4),
  "v5": () => (/* reexport */ esm_browser_v5),
  "validate": () => (/* reexport */ esm_browser_validate),
  "version": () => (/* reexport */ esm_browser_version)
});

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/regex.js
/* harmony default export */ const regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/validate.js


function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/* harmony default export */ const esm_browser_validate = (validate);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!esm_browser_validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const esm_browser_stringify = (stringify);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v1.js

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || esm_browser_stringify(b);
}

/* harmony default export */ const esm_browser_v1 = (v1);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/parse.js


function parse(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const esm_browser_parse = (parse);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v35.js



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = esm_browser_parse(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return esm_browser_stringify(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/md5.js
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const esm_browser_md5 = (md5);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v3.js


var v3 = v35('v3', 0x30, esm_browser_md5);
/* harmony default export */ const esm_browser_v3 = (v3);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return esm_browser_stringify(rnds);
}

/* harmony default export */ const esm_browser_v4 = (v4);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/sha1.js
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const esm_browser_sha1 = (sha1);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v5.js


var v5 = v35('v5', 0x50, esm_browser_sha1);
/* harmony default export */ const esm_browser_v5 = (v5);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/nil.js
/* harmony default export */ const nil = ('00000000-0000-0000-0000-000000000000');
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/version.js


function version(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const esm_browser_version = (version);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/index.js










/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

exports.__esModule = true;
exports.xAPIBuilder = void 0;
var xAPIDictionary_1 = __webpack_require__(428);
var MediaProfile_1 = __webpack_require__(788);
var SessionProfile_1 = __webpack_require__(645);
var NavigationProfile_1 = __webpack_require__(896);
var uuid_1 = __webpack_require__(453);
var Config_1 = __webpack_require__(905);
/**
 * XAPI Builder Class
 *  하위 function별 기능 정의
 *  + initializeXAPI : activity data 초기화 처리
 *  + validateActivityData : activity data validation (필수값과 format 체크)
 *  + setActor : XAPI의 actor property set
 *  + setContext : XAPI의 context property set
 *  + setXAPIData : profile별 action data set
 *  + getProfile : profile별 객체 생성 및 관리, verb, activity, context, result property set
 *  + validateActionData : action data validation (필수값과 format 체크)
 *  + getStatement : statement set
 *  + getConfigData : config data (LRS Connection info. 등) return
 *  + getUuid : uuid 생성 및 return
 *  + getStatementObj : set된 statement return
 */
var xAPIBuilder = /** @class */ (function () {
    function xAPIBuilder() {
        /** registration 초기 값 */
        this.registrationVal = uuid_1.v4();
        this.emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.RET_CODE = [
            { code: 200, status: "SUCCESS" },
            { code: 300, status: "MISSING_PARAMETER_REQUIRED", data: "" },
            { code: 310, status: "MISMATCH_PARAMETER_FORMAT", data: "" },
            { code: 404, status: "NOT_FOUND" },
            { code: 500, status: "INTERNAL_ERROR" }
        ];
        this._profiles = [];
    }
    /**
     * XAPI initialize
     * + activity data validation
     * + statement 데이터 중 actor와 context 구성
     * @param data activity data
     * @returns resultCode
     */
    xAPIBuilder.prototype.initializeXAPI = function (data) {
        try {
            if (data != null && data != {}) {
                this.resultCode = this.RET_CODE[0];
                this.resultCode = this.validateActivityData(data);
                if (this.resultCode['code'] == 200) {
                    this.setActor(data); // set actor Property
                    this.setContext(data); // set context Property
                }
            }
        }
        catch (e) {
            this.resultCode = this.RET_CODE[4];
            console.log('Error:', e);
        }
        return this.resultCode;
    };
    /**
     * Activity Data Validation
     * + required property에 대한 validation
     * + property의 존재 여부와 format 체크
     * @param data activity data
     * @returns resultCode
     */
    xAPIBuilder.prototype.validateActivityData = function (_activityData) {
        var resultCode = this.RET_CODE[0];
        /** actor Property Validation */
        if (!_activityData.hasOwnProperty('actor')) {
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter actor is missing";
        }
        else if (!_activityData['actor'].hasOwnProperty('id') && !_activityData['actor'].hasOwnProperty('account')) {
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter actor.id or actor.account is missing";
        }
        else if (_activityData['actor'].hasOwnProperty('account')) {
            if (!_activityData['actor']['account'].hasOwnProperty('homePage') || !_activityData['actor']['account'].hasOwnProperty('name')) {
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter actor.account.homePage or parameter actor.account.name is missing";
            }
            else {
                if (!/^http[s]?:/.test(_activityData['actor']['account']['homePage'])) {
                    resultCode = this.RET_CODE[2];
                    resultCode['data'] = "parameter actor.account.homePage format is mismatch";
                }
            }
        }
        else if (_activityData['actor'].hasOwnProperty('id')) {
            if (!this.emailRegExp.test(_activityData['actor']['id']) && !/^[0-9a-f]{40}$/i.test(_activityData['actor']['id']) && !/^http[s]?:/.test(_activityData['actor']['id'])) {
                resultCode = this.RET_CODE[2];
                resultCode['data'] = "parameter actor.id format is mismatch";
            }
        }
        /** Context instructor Property validation */
        if (_activityData.hasOwnProperty('instructor')) {
            if (_activityData['instructor'].hasOwnProperty('id')) {
                if (!this.emailRegExp.test(_activityData['instructor']['id']) && !/^[0-9a-f]{40}$/i.test(_activityData['instructor']['id']) && !/^http[s]?:/.test(_activityData['instructor']['id'])) {
                    resultCode = this.RET_CODE[2];
                    resultCode['data'] = "parameter instructor.id format is mismatch";
                }
            }
            else if (_activityData['instructor'].hasOwnProperty('account')) {
                if (!_activityData['instructor']['account'].hasOwnProperty('homePage') || !_activityData['instructor']['account'].hasOwnProperty('name')) {
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter instructor.account.homePage or parameter instructor.account.name is missing";
                }
                else {
                    if (!/^http[s]?:/.test(_activityData['instructor']['account']['homePage'])) {
                        resultCode = this.RET_CODE[2];
                        resultCode['data'] = "parameter instructor.account.homePage format is mismatch";
                    }
                }
            }
            else {
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter instructor.id or instructor.account is missing";
            }
        }
        /** Context team Property validation */
        if (_activityData.hasOwnProperty('team')) {
            if (!_activityData['team'].hasOwnProperty('member')) {
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter team.member is missing";
            }
            if (_activityData['team'].hasOwnProperty('member')) {
                for (var item in _activityData['team']['member']) {
                    if (!_activityData['team']['member'][item].hasOwnProperty('id') && !_activityData['team']['member'][item].hasOwnProperty('account')) {
                        resultCode = this.RET_CODE[1];
                        resultCode['data'] = "parameter team.member.id or team.member.account is missing";
                    }
                }
                for (var item in _activityData['team']['member']) {
                    if (!_activityData['team']['member'][item].hasOwnProperty('id') && _activityData['team']['member'][item].hasOwnProperty('account')) {
                        if (!_activityData['team']['member'][item]['account'].hasOwnProperty('homePage') || !_activityData['team']['member'][item]['account'].hasOwnProperty('name')) {
                            resultCode = this.RET_CODE[1];
                            resultCode['data'] = "parameter team.member.account.homePage or name is missing";
                        }
                    }
                }
                for (var item in _activityData['team']['member']) {
                    if (_activityData['team']['member'][item].hasOwnProperty('id')) {
                        if (!this.emailRegExp.test(_activityData['team']['member'][item]['id']) && !/^[0-9a-f]{40}$/i.test(_activityData['team']['member'][item]['id']) && !/^http[s]?:/.test(_activityData['team']['member'][item]['id'])) {
                            resultCode = this.RET_CODE[2];
                            resultCode['data'] = "parameter team.member format is mismatch";
                        }
                    }
                }
            }
        }
        /** Context parent Property validation */
        if (_activityData.hasOwnProperty('parent')) {
            for (var item in _activityData['parent']) {
                if (!_activityData['parent'][item].hasOwnProperty('id') || !_activityData['parent'][item].hasOwnProperty('name')) {
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter parent.id or parent.name is missing";
                }
            }
        }
        /** Context grouping Property validation */
        if (_activityData.hasOwnProperty('grouping')) {
            for (var item in _activityData['grouping']) {
                if (!_activityData['grouping'][item].hasOwnProperty('id') || !_activityData['grouping'][item].hasOwnProperty('name')) {
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter grouping.id or grouping.name is missing";
                }
            }
        }
        /** Context category Property validation */
        if (_activityData.hasOwnProperty('category')) {
            for (var item in _activityData['category']) {
                if (!_activityData['category'][item].hasOwnProperty('id') || !_activityData['category'][item].hasOwnProperty('name')) {
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter category.id or category.name is missing";
                }
            }
        }
        /** Context other Property validation */
        if (_activityData.hasOwnProperty('other')) {
            for (var item in _activityData['other']) {
                if (!_activityData['other'][item].hasOwnProperty('id') || !_activityData['other'][item].hasOwnProperty('name')) {
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter other.id or other.name is missing";
                }
            }
        }
        this._activityData = _activityData;
        return resultCode;
    };
    /**
     * statement의 actor property 구성
     * + validation 처리 후 activity data로 actor property set
     * @param _activityData
     */
    xAPIBuilder.prototype.setActor = function (_activityData) {
        var key = "";
        var value = "";
        var account = {};
        var memberArray = [];
        var memberObj = {};
        this._actor = {
            objectType: "Agent",
            name: ""
        };
        var actorNameValue = _activityData['actor']['name'];
        this._actor['name'] = actorNameValue;
        /** set actor id Property */
        if (_activityData['actor'].hasOwnProperty('id')) {
            if (this.emailRegExp.test(_activityData['actor']['id'])) {
                value = "mailto:" + _activityData['actor']['id'];
                this._actor['mbox'] = value;
            }
            else if (/^[0-9a-f]{40}$/i.test(_activityData['actor']['id'])) {
                value = _activityData['actor']['id'];
                this._actor['mbox_sha1sum'] = value;
            }
            else if (/^http[s]?:/.test('id')) {
                value = _activityData['actor']['id'];
                this._actor['openid'] = value;
            }
            /** set actor account Property */
        }
        else if (_activityData['actor'].hasOwnProperty('account')) {
            key = "account";
            account = _activityData['actor']['account'];
            this._actor[key] = account;
        }
        /** set actor team Property */
        if (_activityData['actor'].hasOwnProperty('team')) {
            this._actor['objectType'] = "Group";
            for (var item in _activityData['actor']['team']['member']) {
                memberObj = {
                    name: {}
                };
                memberObj['objectType'] = "Agent";
                if (_activityData['actor']['team']['member'][item].hasOwnProperty('id')) {
                    var teamMemberNamevalue = item['name'];
                    if (this.emailRegExp.test(_activityData['actor']['team']['member'][item]['id'])) {
                        value = "mailto:" + _activityData['actor']['team']['member'][item]['id'];
                        memberObj['mbox'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    }
                    else if (/^[0-9a-f]{40}$/i.test(_activityData['actor']['team']['member'][item]['id'])) {
                        value = _activityData['actor']['team']['member'][item]['id'];
                        memberObj['mbox_sha1sum'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    }
                    else if (/^http[s]?:/.test('id')) {
                        value = _activityData['actor']['team']['member'][item]['id'];
                        memberObj['openid'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    }
                }
                else if (_activityData['actor']['team']['member'][item].hasOwnProperty('account')) {
                    var accountNameValue = _activityData['actor']['team']['member'][item]['account']['name'];
                    key = "account";
                    account = _activityData['actor']['team']['member'][item]['account'];
                    memberObj[key] = account;
                    memberObj['name'] = accountNameValue;
                }
                memberArray.push(memberObj);
            }
            key = "member";
            this._actor[key] = memberArray;
        }
    };
    /**
     * statement의 context property 구성
     * + validation 처리 후 activity data로 context property set
     * @param _activityData
     */
    xAPIBuilder.prototype.setContext = function (_activityData) {
        var key = "";
        var value = "";
        var account = {};
        var instructorObj = {};
        var teamObj = {};
        var memberArray = [];
        var memberObj = {};
        var contextActivitiesObj = {};
        this._context = {};
        /** sessionId가 있는 경우 registration data를 sessionId로 교체 */
        if (!_activityData.hasOwnProperty('sessionId')) {
            this._context['registration'] = this.registrationVal;
        }
        else {
            this._context['registration'] = _activityData['sessionId'];
        }
        /** set context instructor Property */
        if (_activityData.hasOwnProperty('instructor')) {
            instructorObj = {
                objectType: "Agent",
                name: ""
            };
            if (_activityData['instructor'].hasOwnProperty('name')) {
                var instructorNameValue = _activityData['instructor']['name'];
                instructorObj['name'] = instructorNameValue;
            }
            if (_activityData['instructor'].hasOwnProperty('id')) {
                if (this.emailRegExp.test(_activityData['instructor']['id'])) {
                    value = "mailto:" + _activityData['instructor']['id'];
                    instructorObj['mbox'] = value;
                }
                else if (/^[0-9a-f]{40}$/i.test(_activityData['instructor']['id'])) {
                    value = _activityData['instructor']['id'];
                    instructorObj['mbox_sha1sum'] = value;
                }
                else {
                    value = _activityData['instructor']['id'];
                    instructorObj['openid'] = value;
                }
            }
            else if (_activityData['instructor'].hasOwnProperty('account')) {
                key = "account";
                account = _activityData['instructor']['account'];
                instructorObj[key] = account;
            }
            key = "instructor";
            this._context[key] = instructorObj;
        }
        /** set context team Property */
        if (_activityData.hasOwnProperty('team')) {
            teamObj = {
                objectType: "Group",
                name: {}
            };
            var teamNameValue = _activityData['team']['name'];
            teamObj['name'] = teamNameValue;
            for (var item in _activityData['team']['member']) {
                memberObj = {
                    name: {}
                };
                var teamMemberNameValue = _activityData['team']['member'][item]['name'];
                if (_activityData['team']['member'][item].hasOwnProperty('id')) {
                    if (this.emailRegExp.test(_activityData['team']['member'][item]['id'])) {
                        value = "mailto:" + _activityData['team']['member'][item]['id'];
                        memberObj['mbox'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    }
                    else if (/^[0-9a-f]{40}$/i.test(_activityData['team']['member'][item]['id'])) {
                        value = _activityData['team']['member'][item]['id'];
                        memberObj['mbox_sha1sum'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    }
                    else {
                        value = _activityData['team']['member'][item]['id'];
                        memberObj['openid'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    }
                }
                else if (_activityData['team']['member'][item].hasOwnProperty('account')) {
                    var accountNameKey = _activityData['team']['member'][item]['name']['language'];
                    var accountNameValue = _activityData['team']['member'][item]['name']['value'];
                    key = "account";
                    account = _activityData['team']['member'][item]['account'];
                    memberObj[key] = account;
                    memberObj['name'][accountNameKey] = accountNameValue;
                    memberObj['name'] = teamMemberNameValue;
                }
                memberArray.push(memberObj);
            }
            teamObj['member'] = memberArray;
            key = "team";
            this._context[key] = teamObj;
        }
        /** set context parent Property */
        if (_activityData.hasOwnProperty('parent')) {
            var parentArray = [];
            for (var item in _activityData['parent']) {
                var parentNameKey = _activityData['parent'][item]['name']['language'];
                var parentNameValue = _activityData['parent'][item]['name']['value'];
                var parentDescriptionKey = _activityData['parent'][item]['description']['language'];
                var parentDescriptionValue = _activityData['parent'][item]['description']['value'];
                var parentArrayObj = {
                    id: _activityData['parent'][item]['id'],
                    objectType: "Activity",
                    definition: {
                        name: {},
                        description: {}
                    }
                };
                parentArrayObj['definition']['name'][parentNameKey] = parentNameValue;
                parentArrayObj['definition']['description'][parentDescriptionKey] = parentDescriptionValue;
                parentArray.push(parentArrayObj);
            }
            key = "parent";
            contextActivitiesObj[key] = parentArray;
        }
        /** set context grouping Property */
        if (_activityData.hasOwnProperty('grouping')) {
            var groupingArray = [];
            for (var item in _activityData['grouping']) {
                var groupingNameKey = _activityData['grouping'][item]['name']['language'];
                var groupingNameValue = _activityData['grouping'][item]['name']['value'];
                var groupingDescriptionKey = _activityData['grouping'][item]['description']['language'];
                var groupingDescriptionValue = _activityData['grouping'][item]['description']['value'];
                var groupingArrayObj = {
                    id: _activityData['grouping'][item]['id'],
                    objectType: "Activity",
                    definition: {
                        name: {},
                        description: {}
                    }
                };
                groupingArrayObj['definition']['name'][groupingNameKey] = groupingNameValue;
                groupingArrayObj['definition']['description'][groupingDescriptionKey] = groupingDescriptionValue;
                groupingArray.push(groupingArrayObj);
            }
            key = "grouping";
            contextActivitiesObj[key] = groupingArray;
        }
        /** set context other Property */
        if (_activityData.hasOwnProperty('other')) {
            var otherArray = [];
            for (var item in _activityData['other']) {
                var otherNameKey = _activityData['other'][item]['name']['language'];
                var otherNameValue = _activityData['other'][item]['name']['value'];
                var otherDescriptionKey = _activityData['other'][item]['description']['language'];
                var otherDescriptionValue = _activityData['other'][item]['description']['value'];
                var otherArrayObj = {
                    id: _activityData['other'][item]['id'],
                    objectType: "Activity",
                    definition: {
                        name: {},
                        description: {}
                    }
                };
                otherArrayObj['definition']['name'][otherNameKey] = otherNameValue;
                otherArrayObj['definition']['description'][otherDescriptionKey] = otherDescriptionValue;
                otherArray.push(otherArrayObj);
            }
            key = "other";
            contextActivitiesObj[key] = otherArray;
        }
        if (Object.keys(contextActivitiesObj).length !== 0) {
            this._context['contextActivities'] = contextActivitiesObj;
        }
        /** set context platform Property */
        if (_activityData.hasOwnProperty('platform')) {
            this._context['platform'] = _activityData['platform'];
        }
    };
    /**
     * profile별 action data 구성
     * + profile의 getProfile과 getStatement을 호출하여 statement 구성
     * + profile의 validateProfile을 호출하여 statement의 property들을 검증
     * @param _actionData
     * @returns resultCode
     */
    xAPIBuilder.prototype.setXAPIData = function (_actionData) {
        var dict = new xAPIDictionary_1.xAPIDictionary();
        var verbDictSession = dict.verb.filter(function (data) { return data.hasOwnProperty('session'); });
        var verbDictNavigation = dict.verb.filter(function (data) { return data.hasOwnProperty('navigation'); });
        var verbDictMedia = dict.verb.filter(function (data) { return data.hasOwnProperty('media'); });
        this.resultCode = this.validateActionData(_actionData);
        if (this.resultCode['code'] == 200) {
            this.getProfile(_actionData);
            this.getStatement(this._actor, this._verb, this._activity);
            this._statement['context'] = this._context;
            this._statement['context']['extensions'] = this._extensions['extensions'];
            this.setAttachments(_actionData);
            if (this._result != undefined) {
                var resultKey = 'result';
                this._statement[resultKey] = this._result;
            }
            this._statement['timestamp'] = new Date().toISOString();
            this._statement['version'] = Config_1["default"].version;
            switch (this._statement['verb']['id']) {
                case verbDictSession[0]['session']["logged-in"].id:
                case verbDictSession[0]['session']["logged-out"].id:
                case verbDictSession[0]['session']["timed-out"].id:
                case verbDictSession[0]['session']["paused"].id:
                case verbDictSession[0]['session']["resumed"].id:
                case verbDictSession[0]['session']["attempted"].id:
                case verbDictSession[0]['session']["entered"].id:
                case verbDictSession[0]['session']["leaved"].id:
                case verbDictSession[0]['session']["attended"].id:
                    if (this.sessionProfileObjInMember !== undefined && Object.keys(this.sessionProfileObjInMember[0])[0] == 'session') {
                        if (this.sessionProfileObjInMember[0]['session'].validateProfile(this._statement)) {
                            this.resultCode = this.RET_CODE[0];
                        }
                        else {
                            this.resultCode = this.RET_CODE[1];
                            this.resultCode['data'] = "validation statement Fail";
                        }
                    }
                    break;
                case verbDictNavigation[0]['navigation']["moved-to"].id:
                case verbDictNavigation[0]['navigation']["next"].id:
                case verbDictNavigation[0]['navigation']["previous"].id:
                case verbDictNavigation[0]['navigation']["clicked"].id:
                case verbDictNavigation[0]['navigation']["viewed"].id:
                case verbDictNavigation[0]['navigation']["popped-up"].id:
                case verbDictNavigation[0]['navigation']["opened"].id:
                case verbDictNavigation[0]['navigation']["closed"].id:
                    if (this.navigationProfileObjInMember !== undefined && Object.keys(this.navigationProfileObjInMember[0])[0] == 'navigation') {
                        if (this.navigationProfileObjInMember[0]['navigation'].validateProfile(this._statement)) {
                            this.resultCode = this.RET_CODE[0];
                        }
                        else {
                            this.resultCode = this.RET_CODE[1];
                            this.resultCode['data'] = "validation statement Fail";
                        }
                    }
                    break;
                case verbDictMedia[0]['media'].initialized.id:
                case verbDictMedia[0]['media'].played.id:
                case verbDictMedia[0]['media'].paused.id:
                case verbDictMedia[0]['media'].seeked.id:
                case verbDictMedia[0]['media'].completed.id:
                case verbDictMedia[0]['media'].terminated.id:
                case verbDictMedia[0]['media'].interacted.id:
                    if (this.mediaProfileObjInMember !== undefined && Object.keys(this.mediaProfileObjInMember[0])[0] == 'media') {
                        if (this.mediaProfileObjInMember[0]['media'].validateProfile(this._statement)) {
                            this.resultCode = this.RET_CODE[0];
                        }
                        else {
                            this.resultCode = this.RET_CODE[1];
                            this.resultCode['data'] = "validation statement Fail";
                        }
                    }
                    break;
            }
        }
        return this.resultCode;
    };
    /**
     * 데이터 제공
     * + 호출 시 config 설정 데이터 return
     * @returns configData
     */
    xAPIBuilder.prototype.getConfigData = function () {
        var configData = {
            endpoint: Config_1["default"].endpoint,
            username: Config_1["default"].key,
            password: Config_1["default"].secret
        };
        return configData;
    };
    /**
     * 데이터 제공
     * + 호출 시 전체 statement return
     * @returns _statement
    */
    xAPIBuilder.prototype.getStatementObj = function () {
        return this._statement;
    };
    /**
     * Action Data Validation
     * + required property에 대한 validation
     * + property의 존재 여부와 format 체크
     * @param _actionData
     * @returns resultCode
     */
    xAPIBuilder.prototype.validateActionData = function (_actionData) {
        var resultCode = this.RET_CODE[0];
        if (!_actionData.hasOwnProperty('object') && !_actionData.hasOwnProperty['object']('type') && !_actionData.hasOwnProperty['object']('id')) {
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter object.type or object.id is missing";
        }
        else if (!_actionData.hasOwnProperty('verb')) {
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter verb is missing";
        }
        return resultCode;
    };
    /**
     * profile별로 object life cycle 관리
     * + profile의 object 존재 여부 체크 후 object 생성 관리
     * + profile의 getVerb, getActivity, getContext, getResult를 호출하여 XAPI property 구성
     * @param _actionData
     * @returns _profiles
     */
    xAPIBuilder.prototype.getProfile = function (_actionData) {
        var profilesObj = {};
        try {
            switch (_actionData['object']['type'].toLowerCase()) {
                /** media profile */
                case 'video':
                case 'audio':
                    if (this._profiles.filter(function (data) { return data.hasOwnProperty('media'); }).length == 0) {
                        var mediaProfileObj = new MediaProfile_1.MediaProfile();
                        profilesObj['media'] = mediaProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    this.mediaProfileObjInMember = this._profiles.filter(function (data) { return data.hasOwnProperty('media'); });
                    var getMediaVerbReturn = this.mediaProfileObjInMember[0]['media'].getVerb(_actionData['verb']);
                    this._verb = getMediaVerbReturn;
                    var getMediaActivityReturn = this.mediaProfileObjInMember[0]['media'].getActivity(_actionData['object']['type'], _actionData['object']['id'], _actionData['object']['name'], _actionData['object']['description']);
                    this._activity = getMediaActivityReturn;
                    var getMediaExtensionsReturn = this.mediaProfileObjInMember[0]['media'].getContext(_actionData['extension']);
                    this._extensions = getMediaExtensionsReturn;
                    if (_actionData['result'] != undefined) {
                        var getMediaResultReturn = this.mediaProfileObjInMember[0]['media'].getResult(_actionData['verb'], _actionData['result'], _actionData['extension']);
                        if (getMediaResultReturn != undefined) {
                            this._result = getMediaResultReturn;
                        }
                    }
                    else if (_actionData['verb'] != 'initialized') {
                        var getMediaResultReturn = this.mediaProfileObjInMember[0]['media'].getResult(_actionData['verb'], _actionData['result'], _actionData['extension']);
                        if (getMediaResultReturn != undefined) {
                            this._result = getMediaResultReturn;
                        }
                    }
                    break;
                /** session profile */
                case 'software-application':
                case 'group-activity':
                    if (this._profiles.filter(function (data) { return data.hasOwnProperty('session'); }).length == 0) {
                        var sessionProfileObj = new SessionProfile_1.SessionProfile();
                        profilesObj['session'] = sessionProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    this.sessionProfileObjInMember = this._profiles.filter(function (data) { return data.hasOwnProperty('session'); });
                    var getSessionVerbReturn = this.sessionProfileObjInMember[0]['session'].getVerb(_actionData['verb']);
                    this._verb = getSessionVerbReturn;
                    var getSessionActivityReturn = this.sessionProfileObjInMember[0]['session'].getActivity(_actionData['object']['type'], _actionData['object']['id'], _actionData['object']['name'], _actionData['object']['description']);
                    this._activity = getSessionActivityReturn;
                    var getSessionExtensionsReturn = this.sessionProfileObjInMember[0]['session'].getContext(_actionData['extension']);
                    this._extensions = getSessionExtensionsReturn;
                    if (_actionData['result'] != undefined) {
                        var getSessionResultReturn = this.sessionProfileObjInMember[0]['session'].getResult(_actionData['verb'], _actionData['result'], _actionData['extension']);
                        if (getSessionResultReturn != undefined) {
                            this._result = getSessionResultReturn;
                        }
                    }
                    else {
                        var getSessionResultReturn = this.sessionProfileObjInMember[0]['session'].getResult(_actionData['verb'], _actionData['result'], _actionData['extension']);
                        if (getSessionResultReturn != undefined) {
                            this._result = getSessionResultReturn;
                        }
                    }
                    break;
                /** navigation profile */
                case 'document':
                case 'webpage':
                case 'menu':
                case 'toc':
                    if (this._profiles.filter(function (data) { return data.hasOwnProperty('navigation'); }).length == 0) {
                        var navigationProfileObj = new NavigationProfile_1.NavigationProfile();
                        profilesObj['navigation'] = navigationProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    this.navigationProfileObjInMember = this._profiles.filter(function (data) { return data.hasOwnProperty('navigation'); });
                    var getNavigationVerbReturn = this.navigationProfileObjInMember[0]['navigation'].getVerb(_actionData['verb']);
                    this._verb = getNavigationVerbReturn;
                    var getNavigationActivityReturn = this.navigationProfileObjInMember[0]['navigation'].getActivity(_actionData['object']['type'], _actionData['object']['id'], _actionData['object']['name'], _actionData['object']['description']);
                    this._activity = getNavigationActivityReturn;
                    var getNavigationExtensionsReturn = this.navigationProfileObjInMember[0]['navigation'].getContext(_actionData['extension']);
                    this._extensions = getNavigationExtensionsReturn;
                    if (_actionData['result'] != undefined) {
                        var getNavigationResultReturn = this.navigationProfileObjInMember[0]['navigation'].getResult(_actionData['verb'], _actionData['result'], _actionData['extension']);
                        if (getNavigationResultReturn != undefined) {
                            this._result = getNavigationResultReturn;
                        }
                    }
                    else {
                        var getNavigationResultReturn = this.navigationProfileObjInMember[0]['navigation'].getResult(_actionData['verb'], _actionData['result'], _actionData['extension']);
                        if (getNavigationResultReturn != undefined) {
                            this._result = getNavigationResultReturn;
                        }
                    }
                    break;
            }
        }
        catch (e) {
            this.resultCode = this.RET_CODE[4];
            console.log('Error:', e);
        }
        return this._profiles;
    };
    /**
     * statement 구성
     * + statement 중 actor, verb, object property 구성
     * @param _actor
     * @param _verb
     * @param _activity
     * @returns _statement
     */
    xAPIBuilder.prototype.getStatement = function (_actor, _verb, _activity) {
        var statementObj = {
            id: "",
            actor: {
                objectType: "Agent",
                name: "",
                mbox: ""
            },
            verb: {
                id: "",
                display: {}
            },
            object: {
                id: "",
                objectType: "Activity"
            }
        };
        statementObj['actor'] = _actor;
        statementObj['verb'] = _verb;
        statementObj['object'] = _activity;
        this._statement = statementObj;
        return this._statement;
    };
    /**
     * statement 구성
     * + statement 중 attachments property 구성
     * @param _actionData
     * @returns _statement
     */
    xAPIBuilder.prototype.setAttachments = function (_actionData) {
        if (_actionData.hasOwnProperty('attachments')) {
            this._statement = _actionData['attachments'];
        }
        return this._statement;
    };
    /**
     * uuid 생성
     * + 호출 시 생성된 uuid return
     * @returns uuid
     */
    xAPIBuilder.prototype.getUuid = function () {
        return uuid_1.v4();
    };
    return xAPIBuilder;
}());
exports.xAPIBuilder = xAPIBuilder;

})();

XAPI = __webpack_exports__;
/******/ })()
;