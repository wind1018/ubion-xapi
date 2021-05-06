import { xAPIDictionary } from "./xAPIDictionary";

/**
 * XapiProfile class
 * extend only
 */
abstract class xAPIProfile{
     /** XAPI property */
    _verb : Verb;
    _activity : Activity;
    _result : Result;
    _context : Extension;   
    _extension : Extension;
     /** XAPI NAMESPACE DICTIONARY */
    dict = new xAPIDictionary();

    /** 
     * Get Verb
     * + profile dictionary에 해당 verb의 property가 있는지 validation
     * + validation 후 setVerb를 호출하여 verb property 구성
     * @param verbName Verb name
     * @returns _verb or error object
     */
    getVerb(verbName: string) : Verb | object{
        if(this.validateVerbName(verbName.toLowerCase())){
            this.setVerb(verbName.toLowerCase());
            return this._verb;
        } else {
            console.log({"error":"setVerb is fail."});
            return {"error":"getVerb is fail."};
        }        
    }

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
    getActivity(objectActivityName: string, objectId: string, definitionName :string, description :object) {
        if(this.validateActivityName(objectActivityName)){
            this.setActivity(objectActivityName, objectId, definitionName, description);
            
            return this._activity;
        } else {
            console.log({"error":"getActivity is fail."});
            return {"error":"getActivity is fail"};
        }
    }

    /** 
     * Get Result
     * + profile dictionary에 해당 result의 property가 있는지 validation
     * + validation 후 setResult를 호출하여 activity property 구성
     * @param verbName verb name ex) played, initialized, etc...
     * @param result result ex) score,completion,duration, etc...
     * @param extension ex) length, time-from, time-to, etc...
     * @return _result
     */
    getResult(verbName: string ,result : object, extension : object){
        if(result != undefined){
            if(this.validateResult(result)){
                this.setResult(verbName.toLocaleLowerCase(), result, extension);
                return this._result;
            } else {
                console.log({"error":"getResult is fail."});
                return {"error":" setResult is fails"};
            }
        } else {
                this.setResult(verbName.toLocaleLowerCase(), result, extension);
                return this._result;
        }
    }

    /** 
     * Get Context
     * + profile dictionary에 해당 context의 property가 있는지 validation
     * + validation 후 setContext를 호출하여 activity property 구성
     * @param extension extensions ex) time, time-to ,etc...
     * @return _context
     */
    getContext(extension : object){
        if(this.validateContextName(extension)){
            this.setContext(extension);
            return this._context;
        } else {
            console.log({"error":"getContext is fail."});
            return {'error': 'getContext fail'};
        }
    }
    
    /** 
     * Validation Verb Name
     * + profile dictionary에 해당 verb의 property가 있는지 validation
     * @param verbName verb name
     * @return boolean
     */
    abstract validateVerbName(verbName: string): boolean;

    /** 
     * Validation ActivityName
     * + profile dictionary에 해당 activity의 property가 있는지 validation
     * @param objectActivityName activityName
     * @return boolean
     */
    abstract validateActivityName(objectActivityName: string): boolean;

    /** 
     * Validation Result
     * + profile dictionary에 해당 Result의 property가 있는지 validation
     * @param result Result
     * @return boolean
     */
    abstract validateResult(result: object) : boolean;

    /** 
     * Validation Context extensions
     * + profile dictionary에 해당 context의 property가 있는지 validation
     * @param extension Context extensions
     * @return boolean
     */
    abstract validateContextName(extension:object) : boolean;

    /** 
     * Validation ExtensionName
     * + profile dictionary에 해당 extension의 property가 있는지 validation
     * @param extensions Extension 
     * @return boolean
     */
    abstract validateExtensionName(extensions:object) : boolean;

    /** 
     * Set _verb
     * + validation 완료 후 statement의 verb 구성
     * @param extensions verbName 
     * @return boolean
     */
    abstract setVerb(verbName: string) : boolean;

    /** 
     * Set _activity
     * + validation 완료 후 statement의 activity 구성
     * @param objectActivityName Activity Name ex) audio video
     * @param objectId obejct Id ex) https://example.com/videos/b6a98d52-1e52-4d45-a14t-a15f97e63d25
     * @param definitionName ex) Ocean Life
     * @param description ex) {"en-US":"some string awsome video"}
     * @return boolean
     */
    abstract setActivity(objectActivityName: string, objectID: string, definitionName :string, description :object) :boolean;
    
    /** 
     * Set _result
     * + validation 완료 후 statement의 result 구성
     * @param verbName verb name ex) played, initialized, etc...
     * @param result result ex) score,completion,duration, etc...
     * @param extension ex) length, time-from, time-to, etc...
     * @return boolean
     */
    abstract setResult(verbName: string , result: object,extension:object) : boolean;
    
    /** 
     * Set _context
     * + validation 완료 후 statement의 context 구성
     * @param extension extensions ex) time, time-to ,etc...
     * @return boolean
     */
    abstract setContext(extension : object) : boolean;
    
    /** 
     * Validation Profile
     * + verb별 result와 context property의 extension property validation
     * @param proifile statement object  {verb:Verb, activity: Activity, result: Result , context: Extension}
     * @return boolean
     */
    abstract validateProfile(proifile :Profile): boolean;
}

/** verb type */
interface Verb  {id: string, display: Display};
/** activity type */
interface Activity  {id: string, definition: Definition, objectType:string};
/** result type */
interface Result  {score?: Score, success?: boolean, completion?: boolean, response?: string, duration?: string, extension?: Extension};
/** profile type */
interface Profile  {verb:Verb, activity: Activity, result: Result , context: Extension};
/** score type */
interface Score  {scaled?: number, raw?: number,min?:number,max?:number}
/** extension type */
interface Extension  {};
/** display type */
interface Display  {};
/** definition type */
interface Definition  {name: object| string, description? : object, type: string, moreInfo?: string, extension?:object};

export{xAPIProfile,Verb,Result,Activity,Extension,Profile}