import {xAPIDictionary} from "./xAPIDictionary";
import {MediaProfile} from './Profiles/MediaProfile';
import {SessionProfile} from './Profiles/SessionProfile';
import {NavigationProfile} from './Profiles/NavigationProfile';
import {v4 as uuidv4} from 'uuid';
import Config from './Config';

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
export class xAPIBuilder {
    /** status Code */
    public RET_CODE: object;

    /** XAPI property */
    public Actor: ActorObj;
    public Context: ContextObj;
    public Attachment: AttachmentObj;
    public Profile: object;    
    
    private _profiles : Array<object>;
    private _actor : ActorObj;
    private _context : ContextObj;
    private _activity : object;
    private _verb : VerbObj;
    private _extensions : object;
    private _result : ResultObj;
    private _attachments : AttachmentObj;
    private _statement : StatementObj;

    /** 전달받는 Object Data */
    private _activityData  : object;
    private _actionData  : object;

    /** 처리 결과 코드 */
    private resultCode: object;

    /** registration 초기 값 */
    private registrationVal: string = uuidv4();

    /** profile별 Obejct */
    private mediaProfileObjInMember: object;
    private sessionProfileObjInMember: object;
    private navigationProfileObjInMember: object;

    public emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(){
        this.RET_CODE = [
            {code:200, status:"SUCCESS"},
            {code:300, status:"MISSING_PARAMETER_REQUIRED", data:""},
            {code:310, status:"MISMATCH_PARAMETER_FORMAT", data:""},
            {code:404, status:"NOT_FOUND"},
            {code:500, status:"INTERNAL_ERROR"}
        ]
        this._profiles = [];
    }

    /** 
     * XAPI initialize
     * + activity data validation
     * + statement 데이터 중 actor와 context 구성
     * @param data activity data
     * @returns resultCode
     */
    public initializeXAPI(data: object){
        try {
            if(data != null && data != {}){
                this.resultCode = this.RET_CODE[0];
                this.resultCode = this.validateActivityData(data);
                if(this.resultCode['code'] == 200){
                    this.setActor(data); // set actor Property
                    this.setContext(data); // set context Property

                }
            }
        } catch(e){
            this.resultCode = this.RET_CODE[4];
            console.log('Error:', e);
        }
        return this.resultCode;
    }

    /** 
     * Activity Data Validation
     * + required property에 대한 validation
     * + property의 존재 여부와 format 체크
     * @param data activity data
     * @returns resultCode
     */
    private validateActivityData(_activityData : object): object {
        let resultCode = this.RET_CODE[0];

        /** actor Property Validation */
        if(!_activityData.hasOwnProperty('actor')){
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter actor is missing";
        } else if(!_activityData['actor'].hasOwnProperty('id') && !_activityData['actor'].hasOwnProperty('account')){
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter actor.id or actor.account is missing";
        } else if(_activityData['actor'].hasOwnProperty('account')){
            if(!_activityData['actor']['account'].hasOwnProperty('homePage') || !_activityData['actor']['account'].hasOwnProperty('name')){
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter actor.account.homePage or parameter actor.account.name is missing";
            } else {
                if(!/^http[s]?:/.test(_activityData['actor']['account']['homePage'])){
                    resultCode = this.RET_CODE[2];
                    resultCode['data'] = "parameter actor.account.homePage format is mismatch";
                }
            }
        } else if(_activityData['actor'].hasOwnProperty('id')){
            if(!this.emailRegExp.test(_activityData['actor']['id']) && !/^[0-9a-f]{40}$/i.test(_activityData['actor']['id']) && !/^http[s]?:/.test(_activityData['actor']['id'])){
                resultCode = this.RET_CODE[2];
                resultCode['data'] = "parameter actor.id format is mismatch";
            }
        }

        /** Context instructor Property validation */
        if(_activityData.hasOwnProperty('instructor')){
            if(_activityData['instructor'].hasOwnProperty('id')){
                if(!this.emailRegExp.test(_activityData['instructor']['id']) && !/^[0-9a-f]{40}$/i.test(_activityData['instructor']['id']) && !/^http[s]?:/.test(_activityData['instructor']['id'])){
                    resultCode = this.RET_CODE[2];
                    resultCode['data'] = "parameter instructor.id format is mismatch";
                }
            } else if(_activityData['instructor'].hasOwnProperty('account')){
                if(!_activityData['instructor']['account'].hasOwnProperty('homePage') || !_activityData['instructor']['account'].hasOwnProperty('name')){
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter instructor.account.homePage or parameter instructor.account.name is missing";
                } else {
                    if(!/^http[s]?:/.test(_activityData['instructor']['account']['homePage'])){
                        resultCode = this.RET_CODE[2];
                        resultCode['data'] = "parameter instructor.account.homePage format is mismatch";
                    }
                }
            } else {
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter instructor.id or instructor.account is missing";
            }
        }

        /** Context team Property validation */
        if(_activityData.hasOwnProperty('team')){
            if(!_activityData['team'].hasOwnProperty('member')){
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter team.member is missing";
            }
            if(_activityData['team'].hasOwnProperty('member')){
                for(var item in _activityData['team']['member']){
                    if(!_activityData['team']['member'][item].hasOwnProperty('id') && !_activityData['team']['member'][item].hasOwnProperty('account')){
                        resultCode = this.RET_CODE[1];
                        resultCode['data'] = "parameter team.member.id or team.member.account is missing"
                    }
                }

                for(var item in _activityData['team']['member']){
                    if(!_activityData['team']['member'][item].hasOwnProperty('id') && _activityData['team']['member'][item].hasOwnProperty('account')){
                        if(!_activityData['team']['member'][item]['account'].hasOwnProperty('homePage') || !_activityData['team']['member'][item]['account'].hasOwnProperty('name')){
                            resultCode = this.RET_CODE[1];
                            resultCode['data'] = "parameter team.member.account.homePage or name is missing";
                        }
                    }
                }

                for(var item in _activityData['team']['member']){
                    if(_activityData['team']['member'][item].hasOwnProperty('id')){
                        if(!this.emailRegExp.test(_activityData['team']['member'][item]['id']) && !/^[0-9a-f]{40}$/i.test(_activityData['team']['member'][item]['id']) && !/^http[s]?:/.test(_activityData['team']['member'][item]['id'])){
                            resultCode = this.RET_CODE[2];
                            resultCode['data'] = "parameter team.member format is mismatch";
                        }
                    }
                }
            }
        }

        /** Context parent Property validation */
        if(_activityData.hasOwnProperty('parent')){
            for(var item in _activityData['parent']){
                if(!_activityData['parent'][item].hasOwnProperty('id') || !_activityData['parent'][item].hasOwnProperty('name')){
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter parent.id or parent.name is missing";
                }
            }
        }
        
        /** Context grouping Property validation */
        if(_activityData.hasOwnProperty('grouping')){
            for(var item in _activityData['grouping']){
                if(!_activityData['grouping'][item].hasOwnProperty('id') || !_activityData['grouping'][item].hasOwnProperty('name')){
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter grouping.id or grouping.name is missing";
                }
            }
        }

        /** Context category Property validation */
        if(_activityData.hasOwnProperty('category')){
            for(var item in _activityData['category']){
                if(!_activityData['category'][item].hasOwnProperty('id') || !_activityData['category'][item].hasOwnProperty('name')){
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter category.id or category.name is missing";
                }
            }
        }
        
        /** Context other Property validation */
        if(_activityData.hasOwnProperty('other')){
            for(var item in _activityData['other']){
                if(!_activityData['other'][item].hasOwnProperty('id') || !_activityData['other'][item].hasOwnProperty('name')){
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter other.id or other.name is missing";
                }
            }
        }

        this._activityData = _activityData;
        
        return resultCode;
    }

    /**
     * statement의 actor property 구성
     * + validation 처리 후 activity data로 actor property set
     * @param _activityData
     */
    private setActor(_activityData: object){
        let key = "";
        let value = "";
        let account = {};
        let memberArray = [];
        let memberObj = {};

        this._actor = {
            objectType: "Agent",
            name: ""
        }

        let actorNameValue = _activityData['actor']['name']
        this._actor['name'] = actorNameValue;

        /** set actor id Property */
        if(_activityData['actor'].hasOwnProperty('id')){
            if(this.emailRegExp.test(_activityData['actor']['id'])){
                value = "mailto:" + _activityData['actor']['id'];
                this._actor['mbox'] = value;
            } else if(/^[0-9a-f]{40}$/i.test(_activityData['actor']['id']) ){
                value = _activityData['actor']['id'];
                this._actor['mbox_sha1sum'] = value;
            } else if(/^http[s]?:/.test('id')){
                value = _activityData['actor']['id'];
                this._actor['openid'] = value;
            }
        /** set actor account Property */
        } else if(_activityData['actor'].hasOwnProperty('account')){
            key = "account";
            account = _activityData['actor']['account'];
            this._actor[key] = account;
        }

        /** set actor team Property */
        if(_activityData['actor'].hasOwnProperty('team')){
            this._actor['objectType'] ="Group";

            for(var item in _activityData['actor']['team']['member']){
                memberObj = {
                    name: {}
                };
                memberObj['objectType'] = "Agent";
                if(_activityData['actor']['team']['member'][item].hasOwnProperty('id')){
                    let teamMemberNamevalue = item['name']
                    
                    if(this.emailRegExp.test(_activityData['actor']['team']['member'][item]['id'])){
                        value = "mailto:" + _activityData['actor']['team']['member'][item]['id'];
                        memberObj['mbox'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    } else if(/^[0-9a-f]{40}$/i.test(_activityData['actor']['team']['member'][item]['id']) ){
                        value = _activityData['actor']['team']['member'][item]['id'];
                        memberObj['mbox_sha1sum'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    } else if(/^http[s]?:/.test('id')){
                        value = _activityData['actor']['team']['member'][item]['id'];
                        memberObj['openid'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    }
                } else if(_activityData['actor']['team']['member'][item].hasOwnProperty('account')){
                    let accountNameValue = _activityData['actor']['team']['member'][item]['account']['name']
                    
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
    }

    /**
     * statement의 context property 구성
     * + validation 처리 후 activity data로 context property set
     * @param _activityData
     */
    private setContext(_activityData: object){
        let key = "";
        let value = "";
        let account = {};
        let instructorObj = {};
        let teamObj = {};
        let memberArray = [];
        let memberObj = {};
        let contextActivitiesObj = {};
        this._context = {};
        
        /** sessionId가 있는 경우 registration data를 sessionId로 교체 */
        if(!_activityData.hasOwnProperty('sessionId')){
            this._context['registration'] = this.registrationVal;
        } else {
            this._context['registration'] = _activityData['sessionId'];
        }

        /** set context instructor Property */
        if(_activityData.hasOwnProperty('instructor')){
            instructorObj = {
                objectType: "Agent",
                name: ""
            }

            if(_activityData['instructor'].hasOwnProperty('name')){
                let instructorNameValue = _activityData['instructor']['name'];
                instructorObj['name'] = instructorNameValue;
            }

            if(_activityData['instructor'].hasOwnProperty('id')){
                if(this.emailRegExp.test(_activityData['instructor']['id'])){
                    value = "mailto:" + _activityData['instructor']['id'];
                    instructorObj['mbox'] = value;
                } else if(/^[0-9a-f]{40}$/i.test(_activityData['instructor']['id']) ){
                    value = _activityData['instructor']['id'];
                    instructorObj['mbox_sha1sum'] = value;
                } else {
                    value = _activityData['instructor']['id'];
                    instructorObj['openid'] = value;
                }
            } else if(_activityData['instructor'].hasOwnProperty('account')){
                key = "account";
                account = _activityData['instructor']['account'];
                instructorObj[key] = account;
            }

            key = "instructor";
            this._context[key] = instructorObj;
        }

        /** set context team Property */
        if(_activityData.hasOwnProperty('team')){
            teamObj = {
                objectType: "Group",
                name: {}
            };

            let teamNameValue = _activityData['team']['name'];
            teamObj['name'] = teamNameValue;

            for(var item in _activityData['team']['member']){
                memberObj = {
                    name: {}
                };
                let teamMemberNameValue = _activityData['team']['member'][item]['name'];

                if(_activityData['team']['member'][item].hasOwnProperty('id')){
                    if(this.emailRegExp.test(_activityData['team']['member'][item]['id'])){
                        value = "mailto:" + _activityData['team']['member'][item]['id'];
                        memberObj['mbox'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    } else if(/^[0-9a-f]{40}$/i.test(_activityData['team']['member'][item]['id']) ){
                        value = _activityData['team']['member'][item]['id'];
                        memberObj['mbox_sha1sum'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    } else {
                        value = _activityData['team']['member'][item]['id'];
                        memberObj['openid'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    }
                } else if(_activityData['team']['member'][item].hasOwnProperty('account')){
                    let accountNameKey = _activityData['team']['member'][item]['name']['language'];
                    let accountNameValue = _activityData['team']['member'][item]['name']['value'];
                    
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
        if(_activityData.hasOwnProperty('parent')){
            let parentArray = [];

            for(var item in _activityData['parent']){
                let parentNameKey = _activityData['parent'][item]['name']['language'];
                let parentNameValue = _activityData['parent'][item]['name']['value'];
    
                let parentDescriptionKey = _activityData['parent'][item]['description']['language'];
                let parentDescriptionValue = _activityData['parent'][item]['description']['value'];
                
                let parentArrayObj = {
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
        if(_activityData.hasOwnProperty('grouping')){
            let groupingArray = [];

            for(var item in _activityData['grouping']){
                let groupingNameKey = _activityData['grouping'][item]['name']['language'];
                let groupingNameValue = _activityData['grouping'][item]['name']['value'];
    
                let groupingDescriptionKey = _activityData['grouping'][item]['description']['language'];
                let groupingDescriptionValue = _activityData['grouping'][item]['description']['value'];
                
                let groupingArrayObj = {
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
        if(_activityData.hasOwnProperty('other')){
            let otherArray = [];

            for(var item in _activityData['other']){
                let otherNameKey = _activityData['other'][item]['name']['language'];
                let otherNameValue = _activityData['other'][item]['name']['value'];
    
                let otherDescriptionKey = _activityData['other'][item]['description']['language'];
                let otherDescriptionValue = _activityData['other'][item]['description']['value'];
                
                let otherArrayObj = {
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
        
        if(Object.keys(contextActivitiesObj).length !== 0){
            this._context['contextActivities'] = contextActivitiesObj;
        }

        /** set context platform Property */
        if(_activityData.hasOwnProperty('platform')) {
            this._context['platform'] = _activityData['platform'];
        }
    }

    /** 
     * profile별 action data 구성
     * + profile의 getProfile과 getStatement을 호출하여 statement 구성
     * + profile의 validateProfile을 호출하여 statement의 property들을 검증
     * @param _actionData
     * @returns resultCode
     */
    public setXAPIData(_actionData: object): object {
        let dict = new xAPIDictionary();
        let verbDictSession = dict.verb.filter(data => data.hasOwnProperty('session'));
        let verbDictNavigation = dict.verb.filter(data => data.hasOwnProperty('navigation'));
        let verbDictMedia = dict.verb.filter(data => data.hasOwnProperty('media'));

        this.resultCode = this.validateActionData(_actionData);
        if(this.resultCode['code'] == 200){
            this.getProfile(_actionData);
            this.getStatement(this._actor, this._verb, this._activity);

            this._statement['context'] = this._context;
            this._statement['context']['extensions'] = this._extensions['extensions'];
            
            this.setAttachments(_actionData);
            
            if(this._result != undefined){
                let resultKey = 'result';
                this._statement[resultKey] = this._result;
            }

            this._statement['timestamp'] = new Date().toISOString();
            this._statement['version'] = Config.version;
            
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
                    if(this.sessionProfileObjInMember !== undefined && Object.keys(this.sessionProfileObjInMember[0])[0] == 'session') {
                        if(this.sessionProfileObjInMember[0]['session'].validateProfile(this._statement)){
                            this.resultCode = this.RET_CODE[0];
                        } else {
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
                    if(this.navigationProfileObjInMember !== undefined && Object.keys(this.navigationProfileObjInMember[0])[0] == 'navigation') {
                        if(this.navigationProfileObjInMember[0]['navigation'].validateProfile(this._statement)){
                            this.resultCode = this.RET_CODE[0];
                        } else {
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
                    if(this.mediaProfileObjInMember !== undefined && Object.keys(this.mediaProfileObjInMember[0])[0] == 'media') {
                        if(this.mediaProfileObjInMember[0]['media'].validateProfile(this._statement)){
                            this.resultCode = this.RET_CODE[0];
                        } else {
                            this.resultCode = this.RET_CODE[1];
                            this.resultCode['data'] = "validation statement Fail";
                        }
                    }
                    break;
            }
        }

        return this.resultCode;
    }

    /**
     * 데이터 제공
     * + 호출 시 config 설정 데이터 return
     * @returns configData
     */
    public getConfigData(){
        let configData = {
            endpoint: Config.endpoint,
            username: Config.key,
            password: Config.secret
        }
        
        return configData;
    }

    /**
     * 데이터 제공
     * + 호출 시 전체 statement return
     * @returns _statement
    */
    public getStatementObj(){
        return this._statement;
    }

    /**
     * Action Data Validation
     * + required property에 대한 validation
     * + property의 존재 여부와 format 체크
     * @param _actionData 
     * @returns resultCode
     */
    private validateActionData(_actionData): object {
        let resultCode = this.RET_CODE[0];

        if(!_actionData.hasOwnProperty('object') && !_actionData.hasOwnProperty['object']('type') && !_actionData.hasOwnProperty['object']('id')){
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter object.type or object.id is missing";
        } else if(!_actionData.hasOwnProperty('verb')){
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter verb is missing";
        }

        return resultCode;
    }
    
    /**
     * profile별로 object life cycle 관리
     * + profile의 object 존재 여부 체크 후 object 생성 관리
     * + profile의 getVerb, getActivity, getContext, getResult를 호출하여 XAPI property 구성
     * @param _actionData 
     * @returns _profiles
     */
    private getProfile(_actionData): object {
        let profilesObj = {};

        try {
            switch (_actionData['object']['type'].toLowerCase()){
                /** media profile */
                case 'video':
                case 'audio':
                    if(this._profiles.filter(data => data.hasOwnProperty('media')).length == 0){
                        let mediaProfileObj = new MediaProfile();
                        profilesObj['media'] = mediaProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    
                    this.mediaProfileObjInMember = this._profiles.filter(data => data.hasOwnProperty('media'));

                    let getMediaVerbReturn = this.mediaProfileObjInMember[0]['media'].getVerb(_actionData['verb']);
                    this._verb = getMediaVerbReturn;

                    let getMediaActivityReturn = this.mediaProfileObjInMember[0]['media'].getActivity(
                        _actionData['object']['type'],
                        _actionData['object']['id'],
                        _actionData['object']['name'],
                        _actionData['object']['description']
                        );
                    
                    this._activity = getMediaActivityReturn;
                    
                    let getMediaExtensionsReturn = this.mediaProfileObjInMember[0]['media'].getContext(_actionData['extension']);

                    this._extensions = getMediaExtensionsReturn;
                    
                    if(_actionData['result'] != undefined){
                        let getMediaResultReturn = this.mediaProfileObjInMember[0]['media'].getResult(
                            _actionData['verb'],
                            _actionData['result'],
                            _actionData['extension']
                            );
                        if(getMediaResultReturn != undefined){
                            this._result = getMediaResultReturn;
                        }
                    } else if(_actionData['verb'] != 'initialized'){
                        let getMediaResultReturn = this.mediaProfileObjInMember[0]['media'].getResult(
                            _actionData['verb'],
                            _actionData['result'],
                            _actionData['extension']
                            );
                        
                        if(getMediaResultReturn != undefined){
                            this._result = getMediaResultReturn;
                        }
                    }
                    
                    break;
                
                /** session profile */
                case 'software-application':
                case 'group-activity':
                    if(this._profiles.filter(data => data.hasOwnProperty('session')).length == 0){
                        let sessionProfileObj = new SessionProfile();
                        profilesObj['session'] = sessionProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    
                    this.sessionProfileObjInMember = this._profiles.filter(data => data.hasOwnProperty('session'));
                    
                    let getSessionVerbReturn = this.sessionProfileObjInMember[0]['session'].getVerb(_actionData['verb']);
                    this._verb = getSessionVerbReturn;

                    let getSessionActivityReturn = this.sessionProfileObjInMember[0]['session'].getActivity(
                        _actionData['object']['type'],
                        _actionData['object']['id'],
                        _actionData['object']['name'],
                        _actionData['object']['description']
                        );
                    
                    this._activity = getSessionActivityReturn;
                    
                    let getSessionExtensionsReturn = this.sessionProfileObjInMember[0]['session'].getContext(_actionData['extension']);

                    this._extensions = getSessionExtensionsReturn;
                    
                    if(_actionData['result'] != undefined){
                        let getSessionResultReturn = this.sessionProfileObjInMember[0]['session'].getResult(
                            _actionData['verb'],
                            _actionData['result'],
                            _actionData['extension']
                            );
                        if(getSessionResultReturn != undefined){
                            this._result = getSessionResultReturn;
                        }
                    } else {
                        let getSessionResultReturn = this.sessionProfileObjInMember[0]['session'].getResult(
                            _actionData['verb'],
                            _actionData['result'],
                            _actionData['extension']
                            );
                        
                        if(getSessionResultReturn != undefined){
                            this._result = getSessionResultReturn;
                        }
                    }
                    
                    break;
                
                /** navigation profile */
                case 'document':
                case 'webpage':
                case 'menu':
                case 'toc':
                    if(this._profiles.filter(data => data.hasOwnProperty('navigation')).length == 0){
                        let navigationProfileObj = new NavigationProfile();
                        profilesObj['navigation'] = navigationProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    
                    this.navigationProfileObjInMember = this._profiles.filter(data => data.hasOwnProperty('navigation'));

                    let getNavigationVerbReturn = this.navigationProfileObjInMember[0]['navigation'].getVerb(_actionData['verb']);
                    this._verb = getNavigationVerbReturn;

                    let getNavigationActivityReturn = this.navigationProfileObjInMember[0]['navigation'].getActivity(
                        _actionData['object']['type'],
                        _actionData['object']['id'],
                        _actionData['object']['name'],
                        _actionData['object']['description']
                        );
                    
                    this._activity = getNavigationActivityReturn;
                    
                    let getNavigationExtensionsReturn = this.navigationProfileObjInMember[0]['navigation'].getContext(_actionData['extension']);

                    this._extensions = getNavigationExtensionsReturn;
                    
                    if(_actionData['result'] != undefined){
                        let getNavigationResultReturn = this.navigationProfileObjInMember[0]['navigation'].getResult(
                            _actionData['verb'],
                            _actionData['result'],
                            _actionData['extension']
                            );
                        if(getNavigationResultReturn != undefined){
                            this._result = getNavigationResultReturn;
                        }
                    } else {
                        let getNavigationResultReturn = this.navigationProfileObjInMember[0]['navigation'].getResult(
                            _actionData['verb'],
                            _actionData['result'],
                            _actionData['extension']
                            );
                        
                        if(getNavigationResultReturn != undefined){
                            this._result = getNavigationResultReturn;
                        }
                    }
                    
                    break;
            }
        } catch(e){
            this.resultCode = this.RET_CODE[4];
            console.log('Error:', e);
        }

        return this._profiles;
    }

    /**
     * statement 구성
     * + statement 중 actor, verb, object property 구성
     * @param _actor 
     * @param _verb 
     * @param _activity 
     * @returns _statement
     */
    private getStatement(_actor, _verb, _activity): object {
        let statementObj: StatementObj = {
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
                id:"",
                objectType: "Activity"
            }
        };
        
        statementObj['actor'] = _actor;
        statementObj['verb'] = _verb;
        statementObj['object'] = _activity;

        this._statement = statementObj;

        return this._statement;
    }

    /**
     * statement 구성
     * + statement 중 attachments property 구성
     * @param _actionData 
     * @returns _statement
     */
    private setAttachments(_actionData): object {
        if(_actionData.hasOwnProperty('attachments')){
            this._statement = _actionData['attachments'];
        }

        return this._statement;
    }

    /**
     * uuid 생성
     * + 호출 시 생성된 uuid return
     * @returns uuid
     */
    public getUuid(){
        return uuidv4();
    }
}

/** actor type */
interface ActorObj {
    objectType: string,
    name: string,
    member?: MemberObj
    mbox?: string,
    mbox_sha1sum?:string,
    openid?: string,
    account?: {
        homePage: string,
        name: object
    }
}

/** member type */
interface MemberObj {
    objectType: string,
    name: string,
    mbox?: string,
    mbox_sha1sum?:string,
    openid?: string,
    account?: {
        homePage: string,
        name: object
    }
}

/** verb type */
interface VerbObj {
    id: string,
    display: object //Language Map
}

/** object type */
interface ObjectObj { //The Object of a Statement can be an Activity, Agent/Group, SubStatement, or Statement
    objectType?: string,
    id: string,
    definition?: {
        name?: object,
        description?: object, //Language Map
        type?: string,
        moreInfo?: string,
        extensions?: object
    }
}

/** result type */
interface ResultObj {
    score?: {
        scaled?: number,
        raw?: number,
        min?: number,
        max?: number
    },
    success?: boolean,
    completion?: boolean,
    response?: string,
    duration?: string,
    extensions?: object
}

/** context type */
interface ContextObj {
    registration?: string,
    instructor?: ActorObj,
    team?: MemberObj,
    contextActivities?: ContextActivitiesObj,
    revision?: string,
    platform?: string,
    language?: string,
    statement?: string,
    extensions?: object
}

/** contextActivities type */
interface ContextActivitiesObj {
    parent?: ContextActivitiesTypesObj,
    grouping?: ContextActivitiesTypesObj,
    category?: ContextActivitiesTypesObj,
    other?: ContextActivitiesTypesObj
}

/** contextActivities child type */
interface ContextActivitiesTypesObj {
    id?: string,
    objectType?: string,
    definition?: {
        name: object,
        description: object, //Language Map
        type?: string
    }
}

/** attachment type */
interface AttachmentObj {
    usageType: string,
    display: object //Language Map
    description?: object,
    contentType: string,
    length: number,
    sha2: string
    fileUrl?: string
}

/** statement type */
interface StatementObj {
    id: string,
    actor: ActorObj,
    verb: VerbObj,
    object: ObjectObj,
    result?: ResultObj,
    context?: ContextObj,
    timestamp?: string,
    version?: string,
    attachments?: AttachmentObj
}