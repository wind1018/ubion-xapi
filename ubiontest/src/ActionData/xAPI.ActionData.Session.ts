



namespace Application
{
    export class SessionActionData //implements IActionSessionData 
    {
        
        /**
         * 실행정보 셋팅
         * @param SessionInfo 
         */
        constructor(
            SessionInfo? : {   
                session_id : string,
                id ? : string,                         
                name? : string,
                description ? : string,
                type? : eSessionDataObjectType,
                
            }
        ){
            // SessiionID 등록
            
             
            // Agent 값 설정
            this.extension["user-agent"] = navigator.userAgent.toLowerCase();

            // Host 명 가져오기
            this.extension["host"] = window.location.origin;
            
            // Page ID 기본값 셋팅
            this.object.id = window.location.toString();

            // Page ID
            if(typeof (SessionInfo.id) != undefined && SessionInfo.id != null){
                this.object.id = SessionInfo.id;    
            }
            
            // Page Name 기본값 셋팅
            this.object.name = window.location.pathname.split("/").pop().split(".")[0];

            // Page Name
            if(typeof (SessionInfo.name) != undefined && SessionInfo.name != null){
                this.object.name = SessionInfo.name;
            }
            
            // 설명
            if(typeof (SessionInfo.description) != undefined && SessionInfo.description != null){
                this.object.description = SessionInfo.description;
            }

            // Application 유형
            if(typeof (SessionInfo.type) != undefined && SessionInfo.type != null){
                this.object.type = SessionInfo.type;
            }
        }


        /**
         * object 유형 선언
         */
        object : IActionSessionDataObject = {
            type : eSessionDataObjectType["software-application"],
            id : null,
            name : null,
            description : null
        };



        /**
         * SessionData 확장 
         *  + attemp-count :: 정상적으로 로그인 하지 못한 경우 접속을 시도한 회수를 나타냄.
         *  + attended-time :: 참석(출석)을 완료한 시점의 시간을 나타냄.
         *  + attended-reason :: 참석(출석)을 완료한 시점의 시간을 나타냄.
         *  + leaved-reason :: 퇴장시 부가적인 사유, 상태가 있을 경우를 나타냄.
         *  + session-id :: 활동 주기 동안 사용된 세션 유효값
         *  + started-time :: 활동을 시작한 시점의 시간을 나타냄.
         *  + ended-time :: 활동이 종료된 시점의 시간을 나타냄.
         *  + user-agent :: Software Application 을 호스팅하는 UserAgent 의 속성을 설명하는 값을 사용
         *  + host :: Software Application 의 Host 를 식별하는 문자열 값이 속성은 Front-end 웹 응용 프로그램을 호스팅하는 Back-end 서비스 또는 도메인을 나타내는데 사용
         */
        extension : IActionSessionDataExtension = {

            "attemp-count" : 0,
            "attended-time" : null,
            "attended-reason" : null,
            "leaved-reason" : null,
            "session-id" : null,
            "started-time" : null,
            "ended-time" : null,
            "user-agent" : null,
            "ip-address" : null,
            "host" : null

        }

        SetAttempCount(count : number) {

            this.extension["attemp-count"] = count;
        }



    }
}

/**
 * SessionDataObject
 *  + 
 */
interface IActionSessionDataObject {
    type : eSessionDataObjectType;
    id : string;
    name : string;
    description : string;
}

/**
 * SessionData 확장 
 *  + attemp-count :: 정상적으로 로그인 하지 못한 경우 접속을 시도한 회수를 나타냄.
 *  + attended-time :: 참석(출석)을 완료한 시점의 시간을 나타냄.
 *  + attended-reason :: 참석(출석)을 완료한 시점의 시간을 나타냄.
 *  + leaved-reason :: 퇴장시 부가적인 사유, 상태가 있을 경우를 나타냄.
 *  + session-id :: 활동 주기 동안 사용된 세션 유효값
 *  + started-time :: 활동을 시작한 시점의 시간을 나타냄.
 *  + ended-time :: 활동이 종료된 시점의 시간을 나타냄.
 *  + user-agent :: Software Application 을 호스팅하는 UserAgent 의 속성을 설명하는 값을 사용
 *  + host :: Software Application 의 Host 를 식별하는 문자열 값이 속성은 Front-end 웹 응용 프로그램을 호스팅하는 Back-end 서비스 또는 도메인을 나타내는데 사용
 */
interface IActionSessionDataExtension {
    "attemp-count" : number;
    "attended-time" : string;
    "session-id" : string;
    "started-time" : string;
    "ended-time" : string;
    "attended-reason"? : string;
    "leaved-reason"? : string;
    "user-agent"? : string;
    "ip-address"? : string;
    "host"? : string;
}

/**
 * SessionDataObject 유형 정의
 *  - software-application :: Software
 *  - group-activity :: 
 */
enum eSessionDataObjectType 
{
    "software-application" = "software-application",
    "group-activity" = "group-activity"
}

// let SessionDataObjectType : { [key:string] : string } ={
//     "software-application" : "software-application",
//     "group-activity" : "group-activity"
// }

