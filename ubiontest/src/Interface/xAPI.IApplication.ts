interface IApplication_Data {
    
    PLATFORM : string;

    LANG : string;

    LOCALE : string;

    UTC_ZONE : string;

    HOST : string;

    USER_AGENT : string

    SESS_ID : string;

    IP : string;

    USER_ID : string;

    USER_NAME : string;

    USER_TEAM? : string;
}

interface IApplication_Custom_Data {

    PLATFORM: string;
    
    SESS_ID: string;
    /**
     * 접속자 IP
     */
    IP: string;
    USER_ID: string;
    /**
     * 로그인 사용자 이름
     */
    USER_NAME: string;    
    USER_TEAM?: string;

    
    /** 국가 */
    LOCALE_SET? : string;

}