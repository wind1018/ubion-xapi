/**
 * Object 복사
 * @param origin 오리지널 데이터 
 * @returns 복사된 데이터
 */
// function cloneData(origin : any) : any{

//     var cloned = {}
//     for(let i in origin){
//         if(origin[i] != null && typeof origin[i] === "object"){
//             cloned[i] = cloneData(origin[i]);
//         } else {
//             cloned[i] = origin[i];
//         }
//     }
//     return cloned;
// }


function UTCTime(date : Date) : string {

    return new Date(date.getTime() - new Date().getTimezoneOffset() * 60000).toISOString();

}

function CurrentUTCTime() : string {    
    return UTCTime(new Date());
}


/**
 * Staic 함수 :: Prototype 생성을 위한 인터페이스
 */
interface StringConstructor {

    /**
     * String 에 대한 Null 또는 Empty 검사
     * @param value String 값
     */
    IsNullOrEmpty(value: string): boolean;
}

/**
 * String 에 대한 Null 또는 Empty 검사
 * @param value String 값
 * @returns Null 또는 Empty 여부
 */
String.IsNullOrEmpty = function(value: string) {

    return IsNullOrEmpty(value);

}

/**
 * String 에 대한 Null 또는 Empty 검사
 * @param value String 값
 * @returns Null 또는 Empty 여부
 */
 function IsNullOrEmpty(value : string) : boolean {

    if(value !== undefined && value !== null && value !== "") {
        return false;
    }

    return true;

}