
///<reference path="xAPI.Config.ts"/>

/**
 * 한국어 기본 설정
 */
 class APPLICATION_CONFIG_koKR extends APPLICATION_CONFIG
 {
     constructor(config? : IApplication_Custom_Data)
     {
         super(config);
 
     }
 
     protected Init() {
 
         this.LANG = "ko";
 
         this.LOCALE = "KR";
 
         this.UTC_ZONE = "+09:00";
     }
 }