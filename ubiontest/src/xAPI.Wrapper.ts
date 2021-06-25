// import { stringifyConfiguration } from "../../node_modules/tslint/lib/configuration";


class Wrapper
{

    private Builder : any;

    private APPLICATION_DATA : IApplication_Data;

    private resultCode : object;

    SessionActionData : Application.SessionActionData;

    constructor(
        //application_Data : IApplication_Data,
        application_Data : IApplication_Custom_Data,
        initializeData? : any
    ) {

        
        // Wrapper 처리
        this.Initialize();

        // APPLICATION Data 전달하여 Locale 값을 가져온다.
        this.APPLICATION_DATA = this.GetApplicationDataLocale(application_Data);
        

        if(typeof initializeData !== undefined && initializeData !== null){
            this.InitializeActivity(initializeData);
        }
        

        // SessionActionData 설정
        this.SessionActionData = new Application.SessionActionData({
            session_id : this.APPLICATION_DATA.SESS_ID
        });


    }


    /**
     * Application 데이터 생성
     * @param application_Data 
     * @returns 
     */
    private GetApplicationDataLocale(application_Data : IApplication_Custom_Data) : IApplication_Data
    {
        var applicition = null;

        if(            
            String.IsNullOrEmpty(application_Data.LOCALE_SET) == false
        )
        {
            switch(application_Data.LOCALE_SET){
                case "koKR":
                    applicition = new APPLICATION_CONFIG_koKR(application_Data);
                    break;
                default:
                    applicition = new APPLICATION_CONFIG_koKR(application_Data);
                    break;
            }
        }
        else {
            applicition = new APPLICATION_CONFIG_koKR(application_Data);
        }

        return applicition;
    }


    private Initialize(){
        
        // Builder 생성
        this.Builder = new XAPI.xAPIBuilder();
        //this.resultCode = this.Builder
        // 이 부분을 외부에서 지정할 수 있도록 변경 필요
        let configData = this.Builder.getConfigData();
        
        // Set Connection Info. to xAPI Wrapper
        ADL.XAPIWrapper.changeConfig({
            'endpoint': configData.endpoint,
            'auth': 'Basic ' + toBase64(configData.username + ':' + configData.password)
        });
        
    }

    /**
     * 설정 파일을 읽어 들인다.
     */
    private LoadConfig() : void{


    }

    /**
     * Activity Data 초기화 작업
     *  + Actor Data 초기화
     *  + Context Data 초기화
     * @param data 
     */
    public InitializeActivity(data : any) {

        
        let initializeData = this.cloneData(data);

        // APPLICATION_DATA로 선언한 항목 Initial Data setting
        let actorName = {"name": this.APPLICATION_DATA.USER_NAME}

        initializeData['actor'] = actorName;
        initializeData['session_id'] = this.APPLICATION_DATA.SESS_ID;
        initializeData['platform'] = this.APPLICATION_DATA.PLATFORM;
        
        

        // 필수 프로퍼티에 대한 검사처리
        this.validProperty(this.APPLICATION_DATA, "USER_ID", "USER_NAME", "SESS_ID");
        
        // convert mbox to mbox_sha1sum
        // actor의 mbox 암호화 처리
        if(this.Builder.emailRegExp.test(this.APPLICATION_DATA.USER_ID)){
            initializeData['actor']['id'] = toSHA1(this.APPLICATION_DATA.USER_ID);
        } else if(this.APPLICATION_DATA.USER_ID.hasOwnProperty('account')){
            initializeData['actor'] = this.APPLICATION_DATA.USER_ID;
        } else {
            initializeData['actor']['id'] = this.APPLICATION_DATA.USER_ID;
        }
        
        initializeData['actor']['team'] = this.APPLICATION_DATA.USER_TEAM;

        if(initializeData['actor']['team'] == undefined){
            delete initializeData['actor']['team'];
        } else if(initializeData['actor']['team'] != undefined){
            if(initializeData['actor'].hasOwnProperty('team')){
                for(var item in initializeData['actor']['team']['member']){
                    if(this.Builder.emailRegExp.test(initializeData['actor']['team']['member'][item]['id'])){
                        initializeData['actor']['team']['member'][item]['id'] = toSHA1(initializeData['actor']['team']['member'][item]['id']);
                    }
                }
            }
        }
        
        // context의 각 property별 mbox 암호화 처리
        if(initializeData.hasOwnProperty('instructor')){
            if(this.Builder.emailRegExp.test(initializeData['instructor']['id'])){
                initializeData['instructor']['id'] = toSHA1(initializeData['instructor']['id']);
            } else if(initializeData['instructor'].hasOwnProperty('account')){
                initializeData['instructor'] = initializeData['instructor'];
            }
        }

        if(initializeData.hasOwnProperty('team')){
            for(var item in initializeData['team']['member']){
                if(this.Builder.emailRegExp.test(initializeData['team']['member'][item]['id'])){
                    initializeData['team']['member'][item]['id'] = toSHA1(initializeData['team']['member'][item]['id']);
                } else if(initializeData['team']['member'][item].hasOwnProperty('account')){
                    initializeData['team']['member'][item] = initializeData['team']['member'][item];
                }
            }
        }

        if(initializeData.hasOwnProperty('parent')){
            let parentObj = {}
            for(var item in initializeData['parent']){
                if(initializeData['parent'][item].hasOwnProperty('name')){
                    parentObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['parent'][item]['name']
                    }
                    initializeData['parent'][item]['name'] = parentObj;

                    parentObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['parent'][item]['description']
                    }
                    initializeData['parent'][item]['description'] = parentObj;
                }
            }
        }

        if(initializeData.hasOwnProperty('grouping')){
            let groupingObj = {}
            for(var item in initializeData['grouping']){
                if(initializeData['grouping'][item].hasOwnProperty('name')){
                    groupingObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['grouping'][item]['name']
                    }
                    initializeData['grouping'][item]['name'] = groupingObj;

                    groupingObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['grouping'][item]['description']
                    }
                    initializeData['grouping'][item]['description'] = groupingObj;
                }
            }
        }

        if(initializeData.hasOwnProperty('other')){
            let otherObj = {}
            for(var item in initializeData['other']){
                if(initializeData['other'][item].hasOwnProperty('name')){
                    otherObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['other'][item]['name']
                    }
                    initializeData['other'][item]['name'] = otherObj;

                    otherObj = {
                        "language": this.APPLICATION_DATA.LANG + "-" + this.APPLICATION_DATA.LOCALE,
                        "value": initializeData['other'][item]['description']
                    }
                    initializeData['other'][item]['description'] = otherObj;
                }
            }
        }

        console.log(initializeData);
        // Activity Data initial
        var res = this.Builder.initializeXAPI(initializeData);
        console.log('Result : ', res);

    }






    /**
     * xAPI 전송
     *  + Action Data 구성
     *  + LRS로 xAPI Data 전송
     * @param actionData 
     */
    async sendRS(actionData : any){
        // Set Action Data
        var setXAPIDataResult = this.Builder.setXAPIData(actionData);
        console.log(actionData['verb'], 'Send ResultCode : ', setXAPIDataResult);

        // Send Statement to LRS
        await ADL.XAPIWrapper.sendStatement(this.Builder.getStatementObj(), function(resp, obj){  
            console.log('status:' + resp.status + ', data:' + resp.statusText);
        });
    }

    /**
     * Builder 상태
     * @returns statment
     */
    getStatment() : any {
        return this.Builder.getStatementObj();
    }


    /**
     * Object 복사
     * @param origin 오리지널 데이터
     * @returns 복사본
     */
    cloneData(origin : any) : any{

        var cloned = {}
        for(let i in origin){
            if(origin[i] != null && typeof origin[i] === "object"){
                cloned[i] = this.cloneData(origin[i]);
            } else {
                cloned[i] = origin[i];
            }
        }
        return cloned;
    }


    /**
     * Property 검사
     * @param data 검사할 데이터
     * @param name 검사할 Property name
     * @returns 
     */
    validProperty(data : any, ...args : string []) : boolean {

        console.log(data, args);

        for(let idx  in args)
        {
            let name : string = args[idx];

            let childNameIndex = name.indexOf(".");
            if(childNameIndex>-1){


                var dataName = name.substring(0, childNameIndex);
                var childName = name.substring(name.indexOf(".")+1);
                
                this.validProperty(eval("data." + dataName), childName);

            }
            else {

                if(data == false){
                    throw {code:500, status:"INTERNAL_ERROR", data: "잘못된 데이터입니다."}
                }
                else if(data.hasOwnProperty(name)==false){
                    throw {code:300, status:"MISSING_PARAMETER_REQUIRED", data: "'" + name + "' Parameter 누락"}
                }
                else if((data[name] !== undefined && data[name] !== null)==false){
                    throw {code:310, status:"MISMATCH_PARAMETER_FORMAT", data: "'" + name + "' Parameter 에 잘못된 데이터가 있습니다."}
                }
            }

            
        }


        return true;

    }

    // executeFnc(exec : string) : object {

    // }

}




