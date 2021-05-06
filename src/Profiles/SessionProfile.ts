import { xAPIProfile,Profile } from '../xAPIProfile';

/**
 * session profile
 * + verb, activity, result, context, extension property에 대한 validation 처리
 * + validation 후 verb, activty, result, context, extension property 구성
 */
export class SessionProfile extends xAPIProfile  {
    private verbDict = this.dict.verb.filter(data => data.hasOwnProperty('session'));
    private activityDict = this.dict.activityNames.filter(data => data.hasOwnProperty('session'));
    private resultExtensionsDict = this.dict.extensions.result.filter(data => data.hasOwnProperty('session'));
    private contextExtensionsDict = this.dict.extensions.context.filter(data => data.hasOwnProperty('session'));

    /**
     * property validation
     * + verb property validation
     * + profile dictionary의 verb에 존재 여부 validation
     * @param verbName 
     * @returns boolean
     */  
    public validateVerbName(verbName: string) {
        return this.verbDict[0]['session'].hasOwnProperty(verbName);
    }
    
    /**
     * set property
     * + validation 후 verb property 구성
     * @param verbName 
     * @returns boolean
     */
    public setVerb(verbName: string) {
        
        if(this.verbDict[0]['session'][verbName].id !== ''|| undefined && this.verbDict[0]['session'][verbName].display !== ''|| undefined){
            this._verb ={
                id: this.verbDict[0]['session'][verbName].id,
                display : this.verbDict[0]['session'][verbName].display
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
        return this.activityDict[0]['session'].hasOwnProperty(objectActivityName.toLocaleLowerCase())
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
                            type : this.activityDict[0]['session'][objectActivityName].type
                        }
                    }
                } else {
                    this._activity={
                        id : objectID,
                        objectType : objectType,
                        definition :{
                            name : definitionName,
                            type : this.activityDict[0]['session'][objectActivityName].type,
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

        if(!this.validateExtensionName(extension)){
            return flag;
        }

        for(let key in extension){
            if(this.resultExtensionsDict[0]['session'].hasOwnProperty(key)){
                ext[this.resultExtensionsDict[0]['session'][key]] = extension[key];
            }
        }

        if(result == undefined){
            result = {};
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

        for(let key in extension){
            if(this.contextExtensionsDict[0]['session'].hasOwnProperty(key)){
                ext[this.contextExtensionsDict[0]['session'][key]] = extension[key];
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
        if(extensions.hasOwnProperty("attempt-count")){
            if(typeof extensions["attempt-count"] !== "number"){
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("attended-time")){
            if (typeof extensions["attended-time"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("leaved-reason")){
            if (typeof extensions["leaved-reason"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("attended-reason")){
            if (typeof extensions["attended-reason"] !== "string") {
                flag = false;
            }
        }

        //context extention
        if(extensions.hasOwnProperty("session-id")){
            if (typeof extensions["session-id"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("started-time")){
            if (typeof extensions["started-time"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("ended-time")){
            if (typeof extensions["ended-time"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("user-agent")){
            if (typeof extensions["user-agent"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("ip-address")){
            if (typeof extensions["ip-address"] !== "string") {
                flag = false;
            }
        }

        if(extensions.hasOwnProperty("host")){
            if (typeof extensions["host"] !== "string") {
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
        return this._result["extension"];
    }

    /**
     * property return
     * + context extension property return
     * @returns context extension
     */
    public getCurrentContextExtension(){
        return this._context["extension"];
    }

    /**
     * property validation
     * + result와 context property의 extension에 대한 validation
     * @param profile 
     * @returns boolean
     */
    public validateProfile(profile:Profile): boolean {
        let verb =  profile.verb.id;
        let result = profile.result;
        let context = profile.context;
        let flag = false;

        switch (verb) {
            case this.verbDict[0]['session']["logged-in"].id:
                if(context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["started-time"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["logged-out"].id:
                if(context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["ended-time"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["timed-out"].id:
                if(context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"])){
                    flag = true;
                }
                return flag;        
            case this.verbDict[0]['session']["paused"].id:
                if(context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["ended-time"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["resumed"].id:
                if(context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["started-time"])
                ){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["attempted"].id:
                if(result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['session']["attempt-count"])){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["entered"].id:
                if(context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["started-time"])){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["leaved"].id:
                if(context["extensions"].hasOwnProperty(this.contextExtensionsDict[0]['session']["ended-time"])){
                    flag = true;
                }
                return flag;
            case this.verbDict[0]['session']["attended"].id:
                if(result["extensions"].hasOwnProperty(this.resultExtensionsDict[0]['session']["attended-time"])){
                    flag = true;
                }
                return flag;
        }
    }
}