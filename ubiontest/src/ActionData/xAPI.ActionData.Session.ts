



namespace Application
{
    export class SessionActionData //implements IActionSessionData 
    {
        
        constructor(){

            // // Agent 값 설정
            // this.extension["user-agent"] = navigator.userAgent.toLowerCase();

            // // Host 명 가져오기
            // this.extension["host"] = window.location.origin;

        }



        // object : IActionSessionDataObject = {
        //     type : eSessionDataObjectType["software-application"],
        //     id : null,
        //     name : null,
        //     description : null
        // };



        // extension : IActionSessionDataExtension = {

        //     "attemp-count" : 0,
        //     "attended-time" : null,
        //     "attended-reason" : null,
        //     "leaved-reason" : null,
        //     "session-id" : null,
        //     "started-time" : null,
        //     "ended-time" : null,
        //     "user-agent" : null,
        //     "ip-address" : null,
        //     "host" : null

        // }

        // SetAttempCount(count : number) {

        //     this.extension["attemp-count"] = count;
        // }



    }
}

// interface IActionSessionDataObject {
//     type : eSessionDataObjectType;
//     id : string;
//     name : string;
//     description : string;
// }

// interface IActionSessionDataExtension {
//     "attemp-count" : number;
//     "attended-time" : string;
//     "attended-reason" : string;
//     "leaved-reason" : string;
//     "session-id" : string;
//     "started-time" : string;
//     "ended-time" : string;
//     "user-agent" : string;
//     "ip-address" : string;
//     "host" : string;
// }

// enum eSessionDataObjectType 
// {
//     "software-application" = "software-application",
//     "group-activity" = "group-activity"
// }

// let SessionDataObjectType : { [key:string] : string } ={
//     "software-application" : "software-application",
//     "group-activity" : "group-activity"
// }

