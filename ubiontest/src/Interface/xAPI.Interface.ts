


interface ISession_Data {
    id : string;

    actor : {
        objectType : string,
        name : {
            [key:string] : string
        },

        account : {
            homepage : string,
            name : {
                [key:string] : string
            }
        }
    };

}

interface ILocale {
    lang : string
    locale : string
}



