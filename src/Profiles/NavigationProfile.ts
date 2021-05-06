import { xAPIProfile,Profile } from '../xAPIProfile';

/**
 * navigation profile
 * + verb, activity, result, context, extension property에 대한 validation 처리
 * + validation 후 verb, activty, result, context, extension property 구성
 */
export class NavigationProfile extends xAPIProfile  {  
    iso8601RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

    private verbDict = this.dict.verb.filter(data => data.hasOwnProperty('navigation'));
    private activityDict = this.dict.activityNames.filter(data => data.hasOwnProperty('navigation'));
    private resultExtensionsDict = this.dict.extensions.result.filter(data => data.hasOwnProperty('navigation'));
    private contextExtensionsDict = this.dict.extensions.context.filter(data => data.hasOwnProperty('navigation'));

    /**
     * property validation
     * + verb property validation
     * + profile dictionary의 verb에 존재 여부 validation
     * @param verbName 
     * @returns boolean
     */
    public validateVerbName(verbName: string) {
        return this.verbDict[0]['navigation'].hasOwnProperty(verbName);
    }

    /**
     * set property
     * + validation 후 verb property 구성
     * @param verbName 
     * @returns boolean
     */
    public setVerb(verbName: string) {
        if(this.verbDict[0]['navigation'][verbName].id !== '' || undefined && this.verbDict[0]['navigation'][verbName].display !== '' || undefined){
            this._verb ={
                id: this.verbDict[0]['navigation'][verbName].id,
                display : this.verbDict[0]['navigation'][verbName].display
            }

            return true;
        }else{
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
        return this.activityDict[0]['navigation'].hasOwnProperty(objectActivityName.toLocaleLowerCase())
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
    public setActivity(objectActivityName: string, objectID: string, definitionName : any, description :object) {
        objectActivityName = objectActivityName.toLowerCase();
        objectID = objectID;
        let objectType =  "Activity";

        if(this.validateActivityName(objectActivityName)){
            if(definitionName != {} || definitionName != undefined ||definitionName != '' ){
                if(Object.keys(description).length === 0){
                    this._activity={
                        id : objectID,
                        objectType : objectType,
                        definition :{
                            name : definitionName,
                            type : this.activityDict[0]['navigation'][objectActivityName].type
                        }
                    }
                } else {
                    this._activity={
                        id : objectID,
                        objectType : objectType,
                        definition :{
                            name : definitionName,
                            type : this.activityDict[0]['navigation'][objectActivityName].type,
                            description : description
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
        if (result.hasOwnProperty("score")) {
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

            if(result["score"].hasOwnProperty("max")){
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

        if( !this.validateExtensionName(extension)){
            return flag;
        }

        for (let key in extension){
            if(this.resultExtensionsDict[0]['navigation'].hasOwnProperty(key)){
                ext[this.resultExtensionsDict[0]['navigation'][key]] = extension[key];
            }
        }

        if(result == undefined){
            result = {};
        }

        if(verbName == "viewed"){
            if(!result.hasOwnProperty("duration")){
                result["duration"] = this.setDuration(extension["view-started-time"],extension["view-ended-time"]);
            }

            result["extensions"] = ext;
            this._result = result;
            flag = true;
        }

        this._result = result;
        result["extensions"] = ext;
        flag = true;

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
            if(this.contextExtensionsDict[0]['navigation'].hasOwnProperty(key)){
                ext[this.contextExtensionsDict[0]['navigation'][key]] = extension[key];
            }
        }

        this._context = {
            extensions : ext
        }
        
        return true;
    }

    /**
     * property validation
     * + profile dictionary의 extension에 존재 여부 validation
     * @param extensions 
     * @returns boolean
     */
    public validateExtensionName(extensions : object) {
        let flag = true;
        //result extention
        if(extensions.hasOwnProperty("current-index")){
            if(typeof extensions["current-index"] !== "string"){
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("total-index")){
            if (typeof extensions["total-index"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("view-started-time")){
            extensions["view-started-time"] = new Date(extensions["view-started-time"]).toISOString();
        }

        if(extensions.hasOwnProperty("view-ended-time")){
            extensions["view-ended-time"] = new Date(extensions["view-ended-time"]).toISOString();
        }

        //context extention
        if(extensions.hasOwnProperty("target-id")){
            if (typeof extensions["target-id"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("target-type")){
            if (typeof extensions["target-type"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("target-name")){
            if (typeof extensions["target-name"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("referrer-id")){
            if (typeof extensions["referrer-id"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("referrer-type")){
            if (typeof extensions["referrer-type"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("referrer-name")){
            if (typeof extensions["referrer-name"] !== "string") {
                flag = false;
            }
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
    validateProfile(profile:Profile): boolean {
        let verb =  profile.verb.id;
        let result = profile.result;
        let context = profile.context;
        let flag = false;

        switch (verb) {
            case this.verbDict[0]['navigation']["moved-to"].id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["next"].id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["previous"].id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-type"])
                ){
                    flag = true;
                }
                return flag;        
            case this.verbDict[0]['navigation']["clicked"].id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["viewed"].id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["popped-up"].id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["referrer-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["opened"].id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['navigation']["closed"].id:
                if( context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['navigation']["target-type"])
                ){
                    flag = true;
                }
                return flag;
        }
    }

    /** 
     * Set duration
     * + duration 계산 (ISO8601 기준)
     * @returns duration
     */
    setDuration(startDate:Date,endDate:Date){
        let start = new Date(startDate).getTime();
        let end = new Date(endDate).getTime();
        let duration =Math.abs(((start - end)/1000)).toFixed(3);
        return "PT"+ duration +"S";
    }
}