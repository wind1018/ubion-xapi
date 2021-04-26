import {mediaProfile} from './xapiProfile/mediaProfile';
import {sessionProfile} from './xapiProfile/sessionProfile';
import {navigationProfile} from './xapiProfile/navigationProfile';
import {v4 as uuidv4} from 'uuid';
import Config from './config/config';

export class XAPIBuilder {
    public RET_CODE: object;

    public Actor: ActorObj;
    public Context: ContextObj;
    public Attachment: AttachmentObj;
    public Profile: object;

    private _activityData  : object;
    private _actionData  : object;

    private _profiles : Array<object>;
    private _actor : ActorObj;
    private _context : ContextObj;
    private _activity : object;
    private _verb : VerbObj;
    private _extensions : object;
    private _result : ResultObj;
    private _attachments : AttachmentObj;
    private _statement : StatementObj;
    private resultCode: object;
    private registrationVal: string = uuidv4();
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

    public initializeXAPI(data: object){
        try {
            if(data != null && data != {}){
                this.resultCode = this.RET_CODE[0];
                this.resultCode = this.validateActivityData(data);
                if(this.resultCode['code'] == 200){
                    this.setActor(data);
                    this.setContext(data);

                }
            }
        } catch(e){
            this.resultCode = this.RET_CODE[4];
            console.log('Error:', e);
        }
        return this.resultCode;
    }

    private validateActivityData(_activityData : object): object {
        let resultCode = this.RET_CODE[0];

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

        if(_activityData.hasOwnProperty('instructor')){
            if(!this.emailRegExp.test(_activityData['instructor']['id']) && !/^[0-9a-f]{40}$/i.test(_activityData['instructor']['id']) && !/^http[s]?:/.test(_activityData['instructor']['id'])){
                resultCode = this.RET_CODE[2];
                resultCode['data'] = "parameter instructor.id format is mismatch";
            } else if(!_activityData['instructor'].hasOwnProperty('id') && !_activityData['instructor'].hasOwnProperty('account')){
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter instructor.id or instructor.account is missing";
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
            }
        }

        if(_activityData.hasOwnProperty('team')){
            if(!_activityData['team'].hasOwnProperty('member')){
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter team.member is missing";
            } else if(_activityData['team']['member'].filter(data => !data.hasOwnProperty('id')).length > 0 && _activityData['team']['member'].filter(data => !data.hasOwnProperty('account')).length > 0){
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter team.member.id or account is missing";
            } else if(_activityData['team']['member'].filter(data => data.hasOwnProperty('account')).length > 0){
                if(!_activityData['team']['member']['account'].hasOwnProperty('homePage') || !_activityData['team']['member']['account'].hasOwnProperty('name')){
                    resultCode = this.RET_CODE[1];
                    resultCode['data'] = "parameter team.member.account.homePage or name is missing";
                } else if(_activityData['team']['member']['account']['homePage'].filter(data => !/^http[s]?:/.test(data)) > 0){
                    resultCode = this.RET_CODE[2];
                    resultCode['data'] = "parameter actor.account.homePage format is mismatch";
                }
            } else if(_activityData['team']['member'].filter(data => data.hasOwnProperty('id')).length > 0){
                if(!_activityData['team']['member'].filter(data => !this.emailRegExp.test(data['id'])) && _activityData['team']['member'].filter(data => !/^[0-9a-f]{40}$/i.test(data['id'])) && _activityData['team']['member'].filter(data => !/^http[s]?:/.test(data['id']))){
                    resultCode = this.RET_CODE[2];
                    resultCode['data'] = "parameter team.member format is mismatch";
                }
            }
        }

        if(_activityData.hasOwnProperty('parent')){
            let parentLength = _activityData['parent'].length;
            if(_activityData['parent'].filter(data => data.hasOwnProperty('id')).length !== parentLength || _activityData['parent'].filter(data => data.hasOwnProperty('name')).length !== parentLength){
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter parent.id or parent.name is missing";
            }
        } else if(_activityData.hasOwnProperty('grouping')){
            let groupingLength = _activityData['grouping'].length;
            if(_activityData['grouping'].filter(data => data.hasOwnProperty('id')).length !== groupingLength || _activityData['grouping'].filter(data => data.hasOwnProperty('name')).length !== groupingLength){
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter grouping.id or grouping.name is missing";
            }
        } else if(_activityData.hasOwnProperty('category')){
            let categoryLength = _activityData['category'].length;
            if(_activityData['category'].filter(data => data.hasOwnProperty('id')).length !== categoryLength || _activityData['category'].filter(data => data.hasOwnProperty('name')).length !== categoryLength){
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter category.id or category.name is missing";
            }
        } else if(_activityData.hasOwnProperty('other')){
            let otherLength = _activityData['other'].length;
            if(_activityData['other'].filter(data => data.hasOwnProperty('id')).length !== otherLength || _activityData['other'].filter(data => data.hasOwnProperty('name')).length !== otherLength){
                resultCode = this.RET_CODE[1];
                resultCode['data'] = "parameter other.id or other.name is missing";
            }
        }

        this._activityData = _activityData;
        
        return resultCode;
    }

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
        } else if(_activityData['actor'].hasOwnProperty('account')){
            key = "account";
            account = _activityData['actor']['account'];
            this._actor[key] = account;
        }

        if(_activityData['actor'].hasOwnProperty('team')){
            this._actor['objectType'] ="Group";

            _activityData['actor']['team']['member'].forEach(item =>{
                memberObj = {
                    name: {}
                };
                memberObj['objectType'] = "Agent";
                if(item.hasOwnProperty('id')){
                    let teamMemberNamevalue = item['name']
                    
                    if(this.emailRegExp.test(item['id'])){
                        value = "mailto:" + item['id'];
                        memberObj['mbox'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    } else if(/^[0-9a-f]{40}$/i.test(item['id']) ){
                        value = item['id'];
                        memberObj['mbox_sha1sum'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    } else if(/^http[s]?:/.test('id')){
                        value = item['id'];
                        memberObj['openid'] = value;
                        memberObj['name'] = teamMemberNamevalue;
                    }
                } else if(item.hasOwnProperty('account')){
                    let accountNameValue = item['account']['name']
                    
                    key = "account";
                    account = item['account'];
                    memberObj[key] = account;
                    memberObj['name'] = accountNameValue;
                }

                memberArray.push(memberObj);
            });
            
            key = "member";
            this._actor[key] = memberArray;
        }
    }

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
        
        
        if(!_activityData.hasOwnProperty('sessionId')){
            this._context['registration'] = this.registrationVal;
        } else {
            this._context['registration'] = _activityData['sessionId'];
        }

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

        if(_activityData.hasOwnProperty('team')){
            teamObj = {
                objectType: "Group",
                name: {}
            };

            let teamNameValue = _activityData['team']['name'];
            teamObj['name'] = teamNameValue;

            _activityData['team']['member'].forEach(item =>{
                memberObj = {
                    name: {}
                };
                let teamMemberNameValue = item['name'];

                if(item.hasOwnProperty('id')){
                    if(this.emailRegExp.test(item['id'])){
                        value = "mailto:" + item['id'];
                        memberObj['mbox'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    } else if(/^[0-9a-f]{40}$/i.test(item['id']) ){
                        value = item['id'];
                        memberObj['mbox_sha1sum'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    } else {
                        value = item['id'];
                        memberObj['openid'] = value;
                        memberObj['name'] = teamMemberNameValue;
                    }
                } else if(item.hasOwnProperty('account')){
                    let accountNameKey = item['name']['language'];
                    let accountNameValue = item['name']['value'];

                    key = "account";
                    account = item['account'];
                    memberObj[key] = account;
                    memberObj['name'][accountNameKey] = accountNameValue;
                }
                memberArray.push(memberObj);
            });
            
            teamObj['member'] = memberArray;

            key = "team";
            this._context[key] = teamObj;
        }

        if(_activityData.hasOwnProperty('parent')){
            let parentArray = [];

            _activityData['parent'].forEach(item => {
                let parentNameKey = item['name']['language'];
                let parentNameValue = item['name']['value'];
    
                let parentDescriptionKey = item['description']['language'];
                let parentDescriptionValue = item['description']['value'];
                
                let parentArrayObj = {
                    id: item['id'],
                    objectType: "Activity",
                    definition: {
                        name: {},
                        description: {}
                    }
                };
                
                parentArrayObj['definition']['name'][parentNameKey] = parentNameValue;
                parentArrayObj['definition']['description'][parentDescriptionKey] = parentDescriptionValue;

                parentArray.push(parentArrayObj);
            });
            
            key = "parent";
            contextActivitiesObj[key] = parentArray;
        }

        if(_activityData.hasOwnProperty('grouping')){
            let groupingArray = [];

            _activityData['grouping'].forEach(item => {
                let groupingNameKey = item['name']['language'];
                let groupingNameValue = item['name']['value'];
    
                let groupingDescriptionKey = item['description']['language'];
                let groupingDescriptionValue = item['description']['value'];
                
                let groupingArrayObj = {
                    id: item['id'],
                    objectType: "Activity",
                    definition: {
                        name: {},
                        description: {}
                    }
                };
                
                groupingArrayObj['definition']['name'][groupingNameKey] = groupingNameValue;
                groupingArrayObj['definition']['description'][groupingDescriptionKey] = groupingDescriptionValue;

                groupingArray.push(groupingArrayObj);
            });

            key = "grouping";
            contextActivitiesObj[key] = groupingArray;
        }

        if(_activityData.hasOwnProperty('other')){
            let otherArray = [];

            _activityData['other'].forEach(item => {
                let otherNameKey = item['name']['language'];
                let otherNameValue = item['name']['value'];
    
                let otherDescriptionKey = item['description']['language'];
                let otherDescriptionValue = item['description']['value'];
                
                let otherArrayObj = {
                    id: item['id'],
                    objectType: "Activity",
                    definition: {
                        name: {},
                        description: {}
                    }
                };
                
                otherArrayObj['definition']['name'][otherNameKey] = otherNameValue;
                otherArrayObj['definition']['description'][otherDescriptionKey] = otherDescriptionValue;

                otherArray.push(otherArrayObj);
            });

            key = "other";
            contextActivitiesObj[key] = otherArray;
        }
        
        if(Object.keys(contextActivitiesObj).length !== 0){
            this._context['contextActivities'] = contextActivitiesObj;
        }
    }

    public setXAPIData(_actionData: object): object {
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

            if(this.mediaProfileObjInMember !== undefined && Object.keys(this.mediaProfileObjInMember[0])[0] == 'media') {
                if(this.mediaProfileObjInMember[0]['media'].validateProfile(this._statement)){
                    this.resultCode = this.RET_CODE[0];
                } else {
                    this.resultCode = this.RET_CODE[1];
                    this.resultCode['data'] = "validation statement Fail";
                }
            } else if(this.sessionProfileObjInMember !== undefined && Object.keys(this.sessionProfileObjInMember[0])[0] == 'session') {
                if(this.sessionProfileObjInMember[0]['session'].validateProfile(this._statement)){
                    this.resultCode = this.RET_CODE[0];
                } else {
                    this.resultCode = this.RET_CODE[1];
                    this.resultCode['data'] = "validation statement Fail";
                }
            } else if(this.navigationProfileObjInMember !== undefined && Object.keys(this.navigationProfileObjInMember[0])[0] == 'navigation') {
                if(this.navigationProfileObjInMember[0]['navigation'].validateProfile(this._statement)){
                    this.resultCode = this.RET_CODE[0];
                } else {
                    this.resultCode = this.RET_CODE[1];
                    this.resultCode['data'] = "validation statement Fail";
                }
            }
        }

        return this.resultCode;
    }

    public getConfigData(){
        let configData = {
            endpoint: Config.endpoint,
            username: Config.username,
            password: Config.password
        }
        
        return configData;
    }

    public getStatementObj(){
        return this._statement;
    }

    private validateActionData(_actionData): object {
        let resultCode = this.RET_CODE[0];

        if(!_actionData.hasOwnProperty('object') && !_actionData.hasOwnProperty['object']('activityName') && !_actionData.hasOwnProperty['object']('ObjectId')){
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter object.activityName or object.ObjectId is missing";
        } else if(!_actionData.hasOwnProperty('verb')){
            resultCode = this.RET_CODE[1];
            resultCode['data'] = "parameter verb is missing";
        }

        return resultCode;
    }
    
    private getProfile(_actionData): object {
        let profilesObj = {};

        try {
            switch (_actionData['object']['activityName'].toLowerCase()){
                case 'video':
                case 'audio':
                    if(this._profiles.filter(data => data.hasOwnProperty('media')).length == 0){
                        let mediaProfileObj = new mediaProfile();
                        profilesObj['media'] = mediaProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    
                    this.mediaProfileObjInMember = this._profiles.filter(data => data.hasOwnProperty('media'));

                    let getMediaVerbReturn = this.mediaProfileObjInMember[0]['media'].getVerb(_actionData['verb']);
                    this._verb = getMediaVerbReturn;

                    let getMediaActivityReturn = this.mediaProfileObjInMember[0]['media'].getActivity(
                        _actionData['object']['activityName'],
                        _actionData['object']['ObjectId'],
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
                
                case 'software-application':
                case 'group-activity':
                    if(this._profiles.filter(data => data.hasOwnProperty('session')).length == 0){
                        let sessionProfileObj = new sessionProfile();
                        profilesObj['session'] = sessionProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    
                    this.sessionProfileObjInMember = this._profiles.filter(data => data.hasOwnProperty('session'));
                    
                    let getSessionVerbReturn = this.sessionProfileObjInMember[0]['session'].getVerb(_actionData['verb']);
                    this._verb = getSessionVerbReturn;

                    let getSessionActivityReturn = this.sessionProfileObjInMember[0]['session'].getActivity(
                        _actionData['object']['activityName'],
                        _actionData['object']['ObjectId'],
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
                    
                case 'document':
                case 'webpage':
                case 'menu':
                case 'toc':
                    if(this._profiles.filter(data => data.hasOwnProperty('navigation')).length == 0){
                        let navigationProfileObj = new navigationProfile();
                        profilesObj['navigation'] = navigationProfileObj;
                        this._profiles.push(profilesObj);
                    }
                    
                    this.navigationProfileObjInMember = this._profiles.filter(data => data.hasOwnProperty('navigation'));

                    let getNavigationVerbReturn = this.navigationProfileObjInMember[0]['navigation'].getVerb(_actionData['verb']);
                    this._verb = getNavigationVerbReturn;

                    let getNavigationActivityReturn = this.navigationProfileObjInMember[0]['navigation'].getActivity(
                        _actionData['object']['activityName'],
                        _actionData['object']['ObjectId'],
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

    private setAttachments(_actionData): object {
        if(_actionData.hasOwnProperty('attachments')){
            this._statement = _actionData['attachments'];
        }

        return this._statement;
    }

    public getUuid(){
        return uuidv4();
    }
}

type ActorObj = {
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

type MemberObj = [{
    objectType: string,
    name: string,
    mbox?: string,
    mbox_sha1sum?:string,
    openid?: string,
    account?: {
        homePage: string,
        name: object
    }
}]

type VerbObj = {
    id: string,
    display: object //Language Map
}

type ObjectObj = { //The Object of a Statement can be an Activity, Agent/Group, SubStatement, or Statement
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

type ResultObj = {
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

type ContextObj = {
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

type ContextActivitiesObj = {
    parent?: ContextActivitiesTypesObj,
    grouping?: ContextActivitiesTypesObj,
    category?: ContextActivitiesTypesObj,
    other?: ContextActivitiesTypesObj
}

type ContextActivitiesTypesObj = [{
    id?: string,
    objectType?: string,
    definition?: {
        name: object,
        description: object, //Language Map
        type?: string
    }
}]

type AttachmentObj = [{
    usageType: string,
    display: object //Language Map
    description?: object,
    contentType: string,
    length: number,
    sha2: string
    fileUrl?: string
}]

type StatementObj = {
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