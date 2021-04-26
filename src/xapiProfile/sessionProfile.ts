import { XapiProfile,Verb,Result,Activity,Extension,Profile } from './XapiProfile';
export class sessionProfile implements XapiProfile  {
  
    _verb : Verb;
    _activity : Activity;
    _result : Result;
    _context : Extension;   
    _extension : Extension;

    public validateVerbName(verbName: string) {
        return this.VerbDic.hasOwnProperty(verbName);
    }

    public getVerb(verbName: string) {
        if (this.validateVerbName(verbName.toLowerCase())) {
            this.setVerb(verbName);
            return this._verb;
        } else {
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
        } else {
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
        } else {
            console.log({"error":"getActivity is fail."});
            return {"error":"getActivity is fail"};
        }
    }

    public setActivity(objectActivityName: string, objectID: string, definitionName : any, description :object) {
        objectActivityName = objectActivityName.toLowerCase();
        objectID = objectID;
        let objectType =  "Activity";

        if(this.validateActivityName(objectActivityName)){    
            if(definitionName != {} || definitionName != undefined ||definitionName != '' ){
                if(description == {}){
                    return false;
                } else {
                    this._activity={
                        id : objectID,
                        objectType : objectType,
                        definition :{
                            name : definitionName,
                            type : this.ActivityNames[objectActivityName].type,
                        }
                    }
                }
            } else {
                this._activity={
                    id : objectID,
                    objectType : objectType,
                    definition :{
                        name : definitionName,
                        type : this.ActivityNames[objectActivityName].type,
                        description : description
                    }
                }
            }

            return true;

        } else {
            console.log({"error":"setActivity is fail."});
            return false;
        }
    }

    public validateResult(result: object){
        let flag = true;
        
        return flag;
    }

    public getResult(verbName: string ,result : object, extension : object){
        if(result != undefined){
            if(this.validateResult(result)){
                this.setResult(verbName.toLocaleLowerCase(), result, extension);
                return this._result;
            } else {
                console.log({"error":"getResult is fail."});
                return {"error":" setResult is fails"};
            }
        } else {
            this.setResult(verbName, result, extension);
            return this._result;
        }
    }

    public setResult(verbName :string, result : object, extension: object) {
        let flag = false;
        let ext = {};

        if(!this.validateExtensionName(extension)){
            return flag;
        }

        for(let key in extension){
            if(this.ResultExtensions.hasOwnProperty(key)){
                ext[this.ResultExtensions[key]] = extension[key];
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
        } else {
            console.log({"error":"getContext is fail."});
            return {'error': 'getContext fail'};
        }
    }

    public setContext(extension :object){
        let ext = {}; 

        if(!this.validateExtensionName(extension)){
            return false;
        }

        for(let key in extension){
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
        return this._result["extension"];
    }

    public getCurrentContextExtension(){
        return this._context["extension"];
    }    
    
    public setContextExtension(extension : object){
        return true;
    }

    public validateProfile(profile:Profile): boolean {
        let verb =  profile.verb.id;
        let result = profile.result;
        let context = profile.context;
        let flag = false;

        switch (verb) {
            case this.VerbDic["logged-in"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["started-time"])
                ){
                        flag = true;
                }
                return flag;
            case this.VerbDic["logged-out"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["ended-time"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic["timed-out"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["session-id"])){
                    flag = true;
                }
                return flag;        
            case this.VerbDic["paused"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["ended-time"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic["resumed"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["session-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["started-time"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic["attempted"].id:
                if( result["extensions"].hasOwnProperty(this.ResultExtensions["attempt-count"])){
                     flag = true;
                    }
                return flag;
            case this.VerbDic["entered"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["started-time"])){
                        flag = true;
                    }
                return flag;
            case this.VerbDic["leaved"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["ended-time"])){
                        flag = true;
                    }
                return flag;
            case this.VerbDic["attended"].id:
                if( result["extensions"].hasOwnProperty(this.ResultExtensions["attended-time"])){
                        flag = true;
                    }
                return flag;
        }
    }

    VerbDic = {
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
            "id":  "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/attended",
            "display": {
                "en-US": "attended"
            }
        }
    }

    ActivityNames = {
        "software-application": {
            "type": "https://ubion.co.kr/xapi/activity-type/software-application", 
            "moreInfo": "https://ubion.co.kr/xapi/activity-type/software-application/info"
        },
        "group-activity": {
            "type": "https://ubion.co.kr/xapi/activity-type/group-activity", 
            "moreInfo": "https://ubion.co.kr/xapi/activity-type/group-activity/info"
        }
    }
    
    ResultExtensions = {
        "attempt-count": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attempt-count",
        "attended-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attended-time",
        "attended-reason": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attended-reason",
        "leaved-reason": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/leaved-reason"
    }

    ContextExtensions = {
        "session-id": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/session-id",
        "started-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/started-time",
        "ended-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/ended-time",
        "user-agent": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/user-agent",
        "ip-address": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/ip-address",
        "host": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/host"
    }
}