import { XapiProfile,Verb,Result,Activity,Extension,Profile } from './XapiProfile';
export class navigationProfile implements XapiProfile  {  
    _verb : Verb;
    _activity : Activity;
    _result : Result;
    _context : Extension;
    _extension : Extension;
    iso8601RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

    validateVerbName(verbName: string) {
        return this.VerbDic.hasOwnProperty(verbName);
    }

    getVerb(verbName: string) {
        if (this.validateVerbName(verbName.toLowerCase())) {
            this.setVerb(verbName);
            return this._verb;
        }else{
            console.log({"error":"setVerb is fail."});
            return {"error":"getVerb is fail."};
        }        
    }

    setVerb(verbName: string) {
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

    validateActivityName(objectActivityName: string) {
        return this.ActivityNames.hasOwnProperty(objectActivityName.toLocaleLowerCase())
    }
    
    getActivity(objectActivityName: string, objectID: string, definitionName :string, description :object) {
        if(this.validateActivityName(objectActivityName)){
            this.setActivity(objectActivityName, objectID, definitionName, description);
            
            return this._activity;
        }else{
            console.log({"error":"getActivity is fail."});
            return {"error":"getActivity is fail"};
        }
    }

    setActivity(objectActivityName: string, objectID: string, definitionName : any, description :object) {
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

    validateResult(result: object){
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

    getResult(verbName: string ,result : object, extension : object){
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

    setResult(verbName :string, result : object, extension: object) {
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

    validateContextName(extension : object) {
        if(this.validateExtensionName(extension)){
            return true
        }
        return false;
    }

    getContext(extension : object){
        if(this.validateContextName(extension)){
            this.setContext(extension);
            return this._context;
        }else{
            console.log({"error":"getContext is fail."});
            return {'error': 'getContext fail'};
        }
    }

    setContext(extension :object){
        let ext = {}; 

        if(!this.validateExtensionName(extension)){
            return false;
        }

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

    validateExtensionName(extensions : object) {
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
            extensions["view-started-time"] = extensions["view-started-time"].toISOString();
        }

        if(extensions.hasOwnProperty("view-ended-time")){
            extensions["view-ended-time"] = extensions["view-ended-time"].toISOString();
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

    getCurrentVerb(){
        return this._verb;
    }

    getCurrentActivity(){
        return this._activity;
    }

    getCurrentResult(){
        return this._result;
    }

    getCurrentContext(){
        return this._context;
    }

    getCurrentResultExtension(){
        return this._result["extensions"];
    }

    getCurrentContextExtension(){
        return this._context["extensions"];
    }

    setContextExtension(extension : object){
        return true;
    }

    validateProfile(profile:Profile): boolean {
        let verb =  profile.verb.id;
        let result = profile.result;
        let context = profile.context;
        let flag = false;

        switch (verb) {
            case this.VerbDic["moved-to"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["target-type"])
                    ){
                        flag = true;
                    }
                return flag;
            case this.VerbDic["next"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["referrer-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic["previous"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["referrer-type"])
                    ){
                    flag = true;
                }
                return flag;        
            case this.VerbDic["clicked"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["target-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic["viewed"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["target-type"])
                ){
                    flag = true;
                }
                return flag;
            case this.VerbDic["popped-up"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["target-type"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["referrer-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["referrer-type"])
                    ){
                     flag = true;
                    }
                return flag;
            case this.VerbDic["opened"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["target-type"])
                    ){
                        flag = true;
                    }
                return flag;
            case this.VerbDic["closed"].id:
                if( context["extensions"].hasOwnProperty(this.ContextExtensions["target-id"]) &&
                    context["extensions"].hasOwnProperty(this.ContextExtensions["target-type"])
                    ){
                        flag = true;
                    }
                return flag;
        }
    }

    setDuration(startDate:Date,endDate:Date){
        let start = new Date(startDate).getTime();
        let end = new Date(endDate).getTime();
        let duration =Math.abs(((start - end)/1000)).toFixed(3);
        return "PT"+ duration +"S";
    }

    VerbDic = {
        "moved-to" : {
            "id" : "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/moved-to",
            "display" : {
                    "en-US" : "moved-to"
                }
         },
         "next" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/next",
            "display" : {
                "en-US" : "next"
                }
         },
         "previous" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/previous",
            "display" : {
                "en-US" : "previous",
                }
         },
         "clicked" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/clicked",
            "display" : {
                "en-US" : "clicked"
                }
         },
         "viewed" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/viewed",
            "display" : {
                "en-US" : "viewed"
                }
         },
         "popped-up" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/popped-up",
            "display" : {
                "en-US" : "popped-up"
                }
         },
         "opened" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/opened",
            "display" : {
                "en-US" : "opened"
                }
         },
        "closed" : {
            "id" :  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/closed",
            "display" : {
                "en-US" : "closed"
                }
         }
    }

    ActivityNames={
        "document":{
            "type":"https://ubion.co.kr/xapi/activity-type/document", 
            "moreInfo":"https://ubion.co.kr/xapi/activity-type/document/info"
        },
        "webpage":{
            "type":"https://ubion.co.kr/xapi/activity-type/webpage", 
            "moreInfo":"https://ubion.co.kr/xapi/activity-type/webpage/info"
        },
        "menu":{
            "type":"https://ubion.co.kr/xapi/activity-type/menu", 
            "moreInfo":"https://ubion.co.kr/xapi/activity-type/menu/info"
        },
        "toc":{// 목차
            "type":"https://ubion.co.kr/xapi/activity-type/toc", 
            "moreInfo":"https://ubion.co.kr/xapi/activity-type/toc/info"
        }
    }

    ResultExtensions = {
        "current-index":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/current-index",
        "total-index":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/total-index",
        "view-started-time":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/view-started-time",
        "view-ended-time":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/view-ended-time"
    }

    ContextExtensions = {
        "target-id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-id",
        "target-type":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-type",
        "target-name":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-name",
        "referrer-id":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-id",
        "referrer-type":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-type",
        "referrer-name":"https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-name"
    }    
}