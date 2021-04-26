import {v4 as uuidv4} from 'uuid';
import { XapiProfile,Verb,Result,Activity,Extension,Profile } from './xapiProfile';
export class mediaProfile implements XapiProfile  {
  
    private segments: string = "";
    private played_segments : string = "";
    private startSegments : number;
    private endSegments : number;
    private duration : string;
    private mediaSessionId = uuidv4();
    private started = false;
    private _verb : Verb;
    private _activity : Activity;
    private _result : Result;
    private _context : Extension;

    public validateVerbName(verbName: string) {
        return this.VerbDic.hasOwnProperty(verbName);
    }

    public getVerb(verbName: string) {
        if (this.validateVerbName(verbName.toLowerCase())) {
            this.setVerb(verbName);
            return this._verb;
        }else{
            console.log({"error":"setVerb is fail."});
            return {"error":"getVerb is fail."};
        }        
    }

    public setVerb(verbName: string) {
        if(this.VerbDic[verbName].id !== ''|| undefined && this.VerbDic[verbName].display !== ''|| undefined){
            this._verb ={
                id: this.VerbDic[verbName].id,
                display : this.VerbDic[verbName].display
            }
            return true;
        }else{
            console.log({"error":"setVerb is fail."});
            return false;
        }
    }

    public validateActivityName(objectActivityName: string) {
        return this.ActivityNames.hasOwnProperty(objectActivityName.toLocaleLowerCase())
    }
    
    public getActivity(objectActivityName: string, objectID: string, definitionName :string, description :object) {
        if(this.validateActivityName(objectActivityName)){
            this.setActivity(objectActivityName, objectID, definitionName, description);
            
            return this._activity;
        }else{
            console.log({"error":"getActivity is fail."});
            return {"error":"getActivity is fail"};
        }
    }

    public setActivity(objectActivityName: string, objectID: string, definitionName : any, description :object) {
        objectActivityName = objectActivityName.toLowerCase();
        objectID = objectID;
        let  objectType =  "Activity";
        if(this.validateActivityName(objectActivityName)){
            
            if(definitionName != {} || definitionName != undefined ||definitionName != '' ){
                
                if(description == {}){
                    return false;
                }else{
                    this._activity={
                        id : objectID,
                        objectType : objectType,
                        definition :{
                            name : definitionName,
                            type : this.ActivityNames[objectActivityName].type,
                        }
                }
                }
            }else{
                this._activity={
                    id : objectID,
                    objectType : objectType,
                    definition :{
                        name : definitionName,
                        type : this.ActivityNames[objectActivityName].type,
                        description : description
                    }
            }
            
            };
            return true;
        }else{
            console.log({"error":"setActivity is fail."});
            return false;
        }
    }

    public validateResult(result: object){
        let flag = true;
        if (result.hasOwnProperty("score")) {
            if (result["score"].hasOwnProperty("scaled")) {
                if (-1 <= result["score"]["scaled"] &&result["score"]["scaled"] <= 1) {
                    flag = true;
                }else{
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("raw")) {
                if (-1 <= result["score"]["raw"] &&result["score"]["raw"] <= 1) {
                    flag = true;
                }else{
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("min")) {
                if (-1 <= result["score"]["min"] &&result["score"]["min"] <= 1) {
                    flag = true;
                }else{
                    flag = false;
                }
            }
            if (result["score"].hasOwnProperty("max")) {
                if (-1 <= result["score"]["max"] &&result["score"]["max"]<= 1) {
                    flag = true;
                }else{
                    flag = false;
                }
            }
        }

        if(result.hasOwnProperty("completion")){
            if(typeof result["completion"] === "boolean"){
                flag = true;
            }else{
                flag = false;
            }
        }

        if(result.hasOwnProperty("duration")){
            if(typeof result["duration"] === "number"){
                flag = true;
            }else{
                flag = false;
            }
        }
        
        if(result.hasOwnProperty("success")){
            if(typeof result["success"] === "boolean"){
                flag = true;
            }else{
                flag = false;
            }        
        }
        
        if(result.hasOwnProperty("response")){
            if(typeof result["response"] === "string"){
                flag = true;
            }else{
                flag = false;
            }        
        }
        return flag;
    }

    public getResult(verbName: string ,result : object, extension : object){
        if(result != undefined){
            if(this.validateResult(result)){
                this.setResult(verbName.toLocaleLowerCase(), result, extension);
                return this._result;
            }else{
                console.log({"error":"getResult is fail."});
                return {"error":" setResult is fails"};
            }

        }else{
                this.setResult(verbName, result, extension);
                return this._result;
        }
    }

    public setResult(verbName :string, result : object, extension: object) {
        let flag = false;
        let ext = {};

        if( !this.validateExtensionName(extension)){
            return flag;
        }

        for (let key in extension){
            if(this.ResultExtensions.hasOwnProperty(key)){
                ext[this.ResultExtensions[key]] = extension[key];
            }
        }

        if(result == undefined){
            result = {};
        }

        if(verbName == "terminated"){
            result["extensions"] = ext;
            if(this.started == true){
                this.endPlayedSegment(extension["time"]);
                if(result["duration"] == undefined){
                   result["duration"] =  this.setDuration();
                }else{
                    result["duration"] = "PT"+result["duration"].toFixed(3)+"S"
                }
            }
            result["extensions"][this.ResultExtensions["played-segments"]] = this.segments;
            this._result = result;
            flag = true;
        }else if(verbName == "paused" || verbName == "completed"){
            this.started = false;
            this.endPlayedSegment(extension["time"]);
            if(result["duration"] == undefined){
                result["duration"] =  this.setDuration();
             }else{
                result["duration"] = "PT"+result["duration"].toFixed(3)+"S"
            }
            result["extensions"] = ext;
            result["extensions"][this.ResultExtensions["played-segments"]] = this.segments;
            
            this._result = result;
            
            flag = true;
        }else if(verbName == "played"){
            this.started = true;
            this.startPlayedSegment(extension["time"]);
            result["extensions"] = ext;
            
            this._result = result;
            flag = true;
        }else if(verbName == "seeked"){
            if(this.started){// if media started
                result["extensions"] = ext;
                this._result = result;
                this.endPlayedSegment(extension["time-from"]);
                this.startPlayedSegment(extension["time-to"]);
                flag = true;
            }else{
                result["extensions"] = ext;
                this._result = result;      

                flag = true;
            }
        }else{
            this._result = result;
            result["extensions"] = ext;
            flag = true;
        }       
        
        return flag;        
    }

    public validateContextName(extension : object) {
        if(this.validateExtensionName(extension)){
            return true
        }
        return false;
    }

    public getContext(extension : object){
        if(this.validateContextName(extension)){
            this.setContext(extension);
            return this._context;
        }else{
            console.log({"error":"getContext is fail."});
            return {'error': 'getContext fail'};
        }
    }

    public setContext(extension :object){
        let ext = {}; 

        if(!this.validateExtensionName(extension)){
            return false;
        }

        extension["media-session-id"] = this.mediaSessionId;

        for (let key in extension){
            if(this.ContextExtensions.hasOwnProperty(key)){
                ext[this.ContextExtensions[key]] = extension[key];
            }
        }
        
        this._context = {
            extensions : ext
        }
        
        return true;
    }
    
    public validateExtensionName(extensions : object) {
        let flag = true;

        //result extention
        if(extensions.hasOwnProperty("time")){
            if(typeof extensions["time"] !== "number"){
                flag = false;
            }
            extensions["time"] = parseFloat(extensions["time"].toFixed(3));
        }

        if(extensions.hasOwnProperty("time-from")){
            if (typeof extensions["time-from"] !== "number") {
                flag = false;
            }
            extensions["time-from"] = parseFloat(extensions["time-from"].toFixed(3));
        }

        if(extensions.hasOwnProperty("time-to")){
            if (typeof extensions["time-to"] !== "number") {
                flag = false;
            }
            extensions["time-to"] = parseFloat(extensions["time-to"].toFixed(3));
        }

        if(extensions.hasOwnProperty("progress")){
            if (typeof extensions["progress"] !== "number") {
                flag = false;
            }
            extensions["progress"] = parseFloat(extensions["progress"].toFixed(3));
        }

        //context extention
        if(extensions.hasOwnProperty("cc-subtitle-enabled")){
            if (typeof extensions["cc-subtitle-enabled"] !== "boolean") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("cc-subtitle-lang")){
            if (typeof extensions["cc-subtitle-lang"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("frame-rate")){
            if (typeof extensions["frame-rate"] !== "number") {
                flag = false;
            }
            extensions["frame-rate"] = parseFloat(extensions["frame-rate"].toFixed(3));
        }

        if(extensions.hasOwnProperty("full-screen")){
            if (typeof extensions["full-screen"] !== "boolean") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("quality")){
            if (typeof extensions["quality"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("screen-size")){
            if (typeof extensions["screen-size"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("video-playback-size")){
            if (typeof extensions["video-playback-size"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("speed")){
            if (typeof extensions["speed"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("track")){
            if (typeof extensions["track"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("user-agent")){
            if (typeof extensions["user-agent"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("volume")){
            if (typeof extensions["volume"] !== "number") {
                flag = false;
            }else if( 0 <= extensions["volume"] && extensions["volume"] <= 1){
                extensions["volume"] = parseFloat(extensions["volume"].toFixed(3));
            }
        }

        if(extensions.hasOwnProperty("length")){
            if (typeof extensions["length"] !== "number") {
                flag = false;
            }
            extensions["length"] = parseFloat(extensions["length"].toFixed(3));
        }

        if(extensions.hasOwnProperty("completion-threshold")){
            if (typeof extensions["completion-threshold"] !== "number") {
                flag = false;
            }
            extensions["completion-threshold"] = parseFloat(extensions["completion-threshold"].toFixed(3));
        }

        if(extensions.hasOwnProperty("tag")){
            if (typeof extensions["tag"] !== "string") {
                flag = false;
            }
        }

        return flag;
    }
  
    public getCurrentVerb(){
        return this._verb;
    }

    public getCurrentActivity(){
        return this._activity;
    }

    public getCurrentResult(){
        return this._result;
    }

    public getCurrentContext(){
        return this._context;
    }

    public getCurrentResultExtension(){
        return this._result["extensions"];
    }

    public getCurrentContextExtension(){
        return this._context["extensions"];
    }
    
    public setContextExtension(extension : object){
        return true;
    }

    public validateProfile(profile : Object){
        let verb =  profile['verb']['id'];
        let result = profile['result'];
        let context = profile['context'];
        let flag = false;
        
        switch (verb) {
            case this.VerbDic.initialized.id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["length"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["media-session-id"])
                    ){
                        flag = true;
                    }
                return flag;
            case this.VerbDic.played.id:
                if( result["extensions"].hasOwnProperty(this.ResultExtensions["time"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic.paused.id:
                if( result["extensions"].hasOwnProperty(this.ResultExtensions["time"])&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["progress"])&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["played-segments"])&&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["length"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["media-session-id"])
                    ){
                    flag = true;
                }
                return flag;        
            case this.VerbDic.seeked.id:
                if( result["extensions"].hasOwnProperty(this.ResultExtensions["time-from"])&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["time-to"])&&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic.completed.id:
                if( result.hasOwnProperty("completion")&&
                    result.hasOwnProperty("duration")&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["time"])&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["progress"])&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["played-segments"])&&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["length"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic.terminated.id:
                if( result.hasOwnProperty("duration")&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["time"])&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["progress"])&&
                    result["extensions"].hasOwnProperty(this.ResultExtensions["played-segments"])&&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["length"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["media-session-id"])
                    ){
                     flag = true;
                    }
                return flag;
            case this.VerbDic.interacted.id:
                if( result["extensions"].hasOwnProperty(this.ResultExtensions["time"])&&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["media-session-id"])
                    ){
                        flag = true;
                    }
                return flag;
        }
    }

    private startPlayedSegment(start:number){
        this.startSegments = start;
    }

    private endPlayedSegment(end:number){
        let arr :Array<any>;
        arr = (this.segments == "") ? [] : this.segments.split("[,]");
            arr.push(this.startSegments.toFixed(3) + "[.]" + end.toFixed(3));
            this.segments = arr.join("[,]");
            this.endSegments = end;
            this.startSegments = null;
    }

    private calculateDuration() {
        let arr : any[] , arr2:  any[] ;
        
        //get played segments array
        arr = (this.segments == "") ? [] : this.segments.split("[,]");
        if (this.startSegments != null) {
            arr.push(this.startSegments.toFixed(3) + "[.]" + this.endSegments.toFixed(3));
        }
        arr2 = [];
        let duration = 0;
        arr.forEach(function (v, i) {
            arr2[i] = v.split("[.]");
            arr2[i][0] *= 1;
            arr2[i][1] *= 1;
        
            if(arr2[i][1] > arr2[i][0])
                duration += arr2[i][1] - arr2[i][0];
        });
        
        return duration;
    }

    private setDuration(){
        let duration :number = 0;

        duration = this.calculateDuration()

        return "PT" + duration.toFixed(3) + "S";
    }

    VerbDic = {
        "initialized" : {
            "id" : "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/initialized",
            "display" : {
                "en-US" : "initialized"
            }
         },
         "played" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/played",
            "display" : {
                "en-US" : "played"
            }
         },
         "paused" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/paused",
            "display" : {
                "en-US" : "paused",
            }
         },
         "seeked" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/seeked",
            "display" : {
                "en-US" : "seeked"
            }
         },
         "completed" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/completed",
            "display" : {
                "en-US" : "completed"
            }
         },
         "terminated" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/terminated",
            "display" : {
                "en-US" : "terminated"
            }
         },
         "interacted" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/interacted",
            "display" : {
                "en-US" : "interacted"
            }
         }
    }

    ActivityNames={
        "video":{
            "type":"https://ubion.co.kr/xapi/activity-type/video", 
            "moreInfo":"https://ubion.co.kr/xapi/activity-type/video/info"
        },
        "audio":{
            "type":"https://ubion.co.kr/xapi/activity-type/audio", 
            "moreInfo":"https://ubion.co.kr/xapi/activity-type/audio/info"
        }
    }

    ResultExtensions = {
        "time":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time",
        "time-from":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time-from",
        "time-to":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time-to",
        "progress":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/progress",
        "played-segments":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/played-segments"
    }

    ContextExtensions = {
        "media-session-id": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/media-session-id",
        "cc-subtitle-enabled":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/cc-subtitle-enabled",
        "cc-subtitle-lang":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/cc-subbtitle-lang",
        "frame-rate":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/frame-rate",
        "full-screen":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/full-screen",
        "quality":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/quality",
        "screen-size":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/screen-size",
        "video-playback-size":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/video-playback-size",
        "speed":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/speed",
        "track":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/track",
        "user-agent":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/user-agent",
        "volume":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/volume",
        "length":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/length",
        "completion-threshold":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/completion-threshold",
        "tag":"https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/tag"
    }    
}