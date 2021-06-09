interface IActionSessionData {
 
    object : {
        type : string,
        id : string,
        name : string,
        description : string    
    }

    extension : {
        "attemp-temp" : number,
        "attended-time" : string, 
        "attended-reason" : string,
        "leaved-reason" : string,
        
    }
    
}