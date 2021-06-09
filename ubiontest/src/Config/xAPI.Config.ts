
abstract class APPLICATION_CONFIG implements IApplication_Data
{
    PLATFORM: string;
    
    SESS_ID: string;
    /**
     * 접속자 IP
     */
    IP: string;

    /**
     * 로그인 사용자 ID
     */
    USER_ID: string;
    /**
     * 로그인 사용자 이름
     */
    USER_NAME: string;

    /**
     * 회원 팀
     */
    USER_TEAM?: string;


    /**
     * 시스템 사용언어
     */
    LANG: string;

    /**
     * 지역
     */
    LOCALE: string;

    /**
     * UTC 기준 Time Zone 시간
     */
    UTC_ZONE: string;

    /**
     * 호스트명
     */
    HOST: string;

    /**
     * User-Agent
     */
    USER_AGENT: string;
    
    
    constructor(config? : IApplication_Custom_Data){


        // 호스트명 가져오기
        this.HOST = window.location.protocol + "//" + window.location.host;

        // Agent 값 가져오기
        this.USER_AGENT = navigator.userAgent.toString();

        this.Init();

        this.SetConfig(config);
    }

    private SetConfig(config ? : IApplication_Custom_Data){

        // Config 값이 있다면
        if(config){

            this.PLATFORM = config.PLATFORM;

            this.SESS_ID = config.SESS_ID;

            this.IP = config.IP;

            this.USER_ID = config.USER_ID;

            this.USER_NAME = config.USER_NAME;

            this.USER_TEAM = config.USER_TEAM;

        }

    }

    /**
     * 파티셜 클리스에서 선언할 내용
     */
    protected Init() : void {

        this.LANG = null;

        this.LOCALE = null;

        this.UTC_ZONE = null;
    }

}

