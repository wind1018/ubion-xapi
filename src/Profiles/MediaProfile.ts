import { xAPIProfile,Profile } from '../xAPIProfile';

/**
 * media profile
 * + verb, activity, result, context, extension property에 대한 validation 처리
 * + validation 후 verb, activty, result, context, extension property 구성
 */
export class MediaProfile extends xAPIProfile  {
    /** media play record */
    public mediaSessionId :object = {};
    /** media start flag */
    private started = false;
    private verbDict = this.dict.verb.filter(data => data.hasOwnProperty('media'));
    private activityDict = this.dict.activityNames.filter(data => data.hasOwnProperty('media'));
    private resultExtensionsDict = this.dict.extensions.result.filter(data => data.hasOwnProperty('media'));
    private contextExtensionsDict = this.dict.extensions.context.filter(data => data.hasOwnProperty('media'));

    /**
     * property validation
     * + verb property validation
     * + profile dictionary의 verb에 존재 여부 validation
     * @param verbName 
     * @returns boolean
     */
    public validateVerbName(verbName: string) {
        return this.verbDict[0]['media'].hasOwnProperty(verbName);
    }

    /**
     * set property
     * + validation 후 verb property 구성
     * @param verbName 
     * @returns boolean
     */
    public setVerb(verbName: string) {
        if(this.verbDict[0]['media'][verbName].id !== '' || undefined && this.verbDict[0]['media'][verbName].display !== '' || undefined){
            this._verb = {
                id: this.verbDict[0]['media'][verbName].id,
                display: this.verbDict[0]['media'][verbName].display
            }
            return true;
        } else {
            console.log({"error":"setVerb is fail."});
            return false;
        }
    }

    /**
     * property validation
     * + activity property validation
     * + profile dictionary의 activity에 존재 여부 validation
     * @param objectActivityName 
     * @returns boolean
     */
    public validateActivityName(objectActivityName: string) {
        return this.activityDict[0]['media'].hasOwnProperty(objectActivityName.toLocaleLowerCase())
    }
    
    /**
     * set property
     * + validation 후 activity property 구성
     * @param objectActivityName
     * @param objectID
     * @param definitionName
     * @param description
     * @returns boolean
     */
    public setActivity(objectActivityName: string, objectID: string, definitionName: any, description: object) {
        objectActivityName = objectActivityName.toLowerCase();
        objectID = objectID;
        let objectType =  "Activity";

        if(this.validateActivityName(objectActivityName)){
            if(definitionName != {} || definitionName != undefined ||definitionName != '' ){
                if(Object.keys(description).length === 0){
                    this._activity = {
                        id: objectID,
                        objectType: objectType,
                        definition: {
                            name: definitionName,
                            type: this.activityDict[0]['media'][objectActivityName].type
                        }
                    }
                } else {
                    this._activity={
                        id: objectID,
                        objectType: objectType,
                        definition: {
                            name: definitionName,
                            type: this.activityDict[0]['media'][objectActivityName].type,
                            description: description
                        }
                    }
                }
            }

            return true;
        } else {
            console.log({"error":"setActivity is fail."});
            return false;
        }
    }

    /**
     * property validation
     * + profile dictionary의 result에 존재 여부 validation
     * @param result 
     * @returns boolean
     */
    public validateResult(result: object){
        let flag = true;
        if(result.hasOwnProperty("score")){
            if(result["score"].hasOwnProperty("scaled")){
                if(-1 <= result["score"]["scaled"] && result["score"]["scaled"] <= 1){
                    flag = true;
                } else {
                    flag = false;
                }
            }
            if(result["score"].hasOwnProperty("raw")){
                if(-1 <= result["score"]["raw"] && result["score"]["raw"] <= 1){
                    flag = true;
                } else {
                    flag = false;
                }
            }
            if(result["score"].hasOwnProperty("min")){
                if(-1 <= result["score"]["min"] && result["score"]["min"] <= 1){
                    flag = true;
                } else {
                    flag = false;
                }
            }
            if(result["score"].hasOwnProperty("max")) {
                if(-1 <= result["score"]["max"] && result["score"]["max"]<= 1){
                    flag = true;
                } else {
                    flag = false;
                }
            }
        }

        if(result.hasOwnProperty("completion")){
            if(typeof result["completion"] === "boolean"){
                flag = true;
            } else {
                flag = false;
            }
        }

        if(result.hasOwnProperty("duration")){
            if(typeof result["duration"] === "number"){
                flag = true;
            } else {
                flag = false;
            }
        }
        
        if(result.hasOwnProperty("success")){
            if(typeof result["success"] === "boolean"){
                flag = true;
            } else {
                flag = false;
            }        
        }
        
        if(result.hasOwnProperty("response")){
            if(typeof result["response"] === "string"){
                flag = true;
            } else {
                flag = false;
            }        
        }
        return flag;
    }

    /**
     * set property
     * + validation 후 result property 구성
     * @param verbName 
     * @param result 
     * @param extension 
     * @returns boolean
     */
    public setResult(verbName :string, result : object, extension: object) {
        let flag = false;
        let ext = {};

        if(!this.mediaSessionId.hasOwnProperty(extension["media-session-id"])){
            this.mediaSessionId[extension["media-session-id"]] = {};
        }

        if( !this.validateExtensionName(extension)){
            return flag;
        }

        for (let key in extension){
            if(this.resultExtensionsDict[0]['media'].hasOwnProperty(key)){
                ext[this.resultExtensionsDict[0]['media'][key]] = extension[key];
            }
        }

        if(result == undefined){
            result = {};
        }

        if(verbName == "terminated"){
            result["extensions"] = ext;

            if(this.started == true){
                this.endPlayedSegment(extension["time"], extension["media-session-id"]);
            }
            if(result["duration"] == undefined){
               result["duration"] =  this.setDuration(extension["media-session-id"]);
            } else {
                result["duration"] = "PT"+result["duration"].toFixed(3)+"S"
            }

            result["extensions"][this.resultExtensionsDict[0]['media']["played-segments"]] = this.mediaSessionId[extension["media-session-id"]]["segments"];
            this._result = result;

            flag = true;
        } else if(verbName == "paused" || verbName == "completed"){
            this.started = false;
            this.endPlayedSegment(extension["time"],extension["media-session-id"]);

            if(result["duration"] == undefined){
                result["duration"] =  this.setDuration(extension["media-session-id"]);
            } else {
                result["duration"] = "PT"+result["duration"].toFixed(3)+"S"
            }

            result["extensions"] = ext;
            result["extensions"][this.resultExtensionsDict[0]['media']["played-segments"]] = this.mediaSessionId[extension["media-session-id"]]["segments"];
            this._result = result;
            
            flag = true;
        } else if(verbName == "played"){
            this.started = true;
            this.startPlayedSegment(extension["time"],extension["media-session-id"]);
            result["extensions"] = ext;
            this._result = result;

            flag = true;
        } else if(verbName == "seeked"){
            if(this.started){// if media started
                result["extensions"] = ext;
                this._result = result;
                this.endPlayedSegment(extension["time-from"],extension["media-session-id"]);
                this.startPlayedSegment(extension["time-to"],extension["media-session-id"]);

                flag = true;
            } else {
                result["extensions"] = ext;
                this._result = result;

                flag = true;
            }
        } else {
            this._result = result;
            result["extensions"] = ext;

            flag = true;
        }
        
        return flag;
    }

    /**
     * property validation
     * + profile dictionary의 context에 존재 여부 validation
     * @param extension 
     * @returns boolean
     */
    public validateContextName(extension : object) {
        if(this.validateExtensionName(extension)){
            return true
        }

        return false;
    }

    /**
     * set property
     * + validation 후 context property 구성
     * @param extension 
     * @returns boolean
     */
    public setContext(extension :object){
        let ext = {};

        if(!this.validateExtensionName(extension)){
            return false;
        }
        
        for (let key in extension){
            if(this.contextExtensionsDict[0]['media'].hasOwnProperty(key)){
                ext[this.contextExtensionsDict[0]['media'][key]] = extension[key];
            }
        }
        
        this._context = {
            extensions: ext
        }
        
        return true;
    }
    
    /**
     * property validation
     * + profile dictionary의 extension에 존재 여부 validation
     * @param extensions 
     * @returns boolean
     */
    public validateExtensionName(extensions : object){
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
            } else if( 0 <= extensions["volume"] && extensions["volume"] <= 1){
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

        if(extensions.hasOwnProperty("media-session-id")){
            if (typeof extensions["media-session-id"] !== "string") {
                flag = false;
            }
        } else {
            flag = false;
        }

        return flag;
    }

    /**
     * property return
     * + verb property return
     * @returns _verb
     */
    public getCurrentVerb(){
        return this._verb;
    }

    /**
     * property return
     * + activity property return
     * @returns _activity
     */
    public getCurrentActivity(){
        return this._activity;
    }

    /**
     * property return
     * + result property return
     * @returns _result
     */
    public getCurrentResult(){
        return this._result;
    }

    /**
     * property return
     * + context property return
     * @returns _context
     */
    public getCurrentContext(){
        return this._context;
    }

    /**
     * property return
     * + result extension property return
     * @returns result extension
     */
    public getCurrentResultExtension(){
        return this._result["extensions"];
    }

    /**
     * property return
     * + context extension property return
     * @returns context extension
     */
    public getCurrentContextExtension(){
        return this._context["extensions"];
    }
    
    /**
     * property validation
     * + result와 context property의 extension에 대한 validation
     * @param profile 
     * @returns boolean
     */
    public validateProfile(profile : Profile){
        let verb =  profile['verb']['id'];
        let result = profile['result'];
        let context = profile['context'];
        let flag = false;
        
        switch (verb) {
            case this.verbDict[0]['media'].initialized.id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["length"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].played.id:
                if( result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].paused.id:
                if( result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["progress"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["played-segments"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["length"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])
                ){
                    flag = true;
                }
                return flag;        
            case this.verbDict[0]['media'].seeked.id:
                if( result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time-from"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time-to"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].completed.id:
                if( result.hasOwnProperty("completion") &&
                    result.hasOwnProperty("duration") &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["progress"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["played-segments"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["length"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].terminated.id:
                if( result.hasOwnProperty("duration") &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["progress"]) &&
                    result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["played-segments"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["length"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['media'].interacted.id:
                if( result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['media']["time"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['media']["media-session-id"])
                ){
                    flag = true;
                }
                return flag;
        }
    }

    /** 
     * Set startSegments
     * @param start ex) 0.000
     * @returns void
     */
    private startPlayedSegment(start:number , mediaSessionId:string){
        this.mediaSessionId[mediaSessionId]["startSegments"] = start;
    }

    /** 
     * Set endPlayedSegment and segments
     * @param end ex) 1.000
     * @returns void
     */
    private endPlayedSegment(end:number, mediaSessionId:string){
        let arr :Array<any>;

        arr = (this.mediaSessionId[mediaSessionId]["segments"] == undefined) ? [] : this.mediaSessionId[mediaSessionId]["segments"].split("[,]");
            arr.push(this.mediaSessionId[mediaSessionId]["startSegments"].toFixed(3) + "[.]" + end.toFixed(3));
            this.mediaSessionId[mediaSessionId]["segments"] = arr.join("[,]");
            this.mediaSessionId[mediaSessionId]["endSegments"] = end;
            this.mediaSessionId[mediaSessionId]["startSegments"] = null;
    }
    /** 
     * calculate duration
     * @returns duration
     */
    private calculateDuration(mediaSessionId:string) {
        let arr : any[] , arr2:  any[] ;
        
        //get played segments array
        arr = (this.mediaSessionId[mediaSessionId]["segments"] == undefined) ? [] :this.mediaSessionId[mediaSessionId]["segments"].split("[,]");

        if (this.mediaSessionId[mediaSessionId]["startSegments"] != null) {
            arr.push(this.mediaSessionId[mediaSessionId]["startSegments"].toFixed(3) + "[.]" + this.mediaSessionId[mediaSessionId]["endSegments"].toFixed(3));
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

    /** 
     * Set duration
     * + duration 계산 (ISO8601 기준)
     * @returns duration
     */
    private setDuration(mediaSessionId:string){
        let duration :number = 0;

        duration = this.calculateDuration(mediaSessionId)

        return "PT" + duration.toFixed(3) + "S";
    }
}