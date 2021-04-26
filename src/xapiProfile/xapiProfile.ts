interface XapiProfile {
    validateVerbName(verbName: string): boolean;
    getVerb(verbName: string) : Verb | object;

    validateActivityName(objectActivityName: string): boolean;
    getActivity(objectActivityName: string, objectID: string, definitionName :string, description :object) : Activity | object;

    validateResult(result: object) : boolean;
    getResult(verbName: string , result: object,extension:object) : Result | object;

    validateContextName(context: object,extension:object) : boolean;
    getContext(context: object,extension:object) : Extension | object;

    validateExtensionName(extensions:object) : boolean;

    setVerb(verbName: string) : boolean;
    setActivity(objectActivityName: string, objectID: string, definitionName :string, description :object) :boolean;
    setResult(verbName: string , result: object,extension:object) : boolean;
    setContext(extension : object) : boolean;
    validateProfile(proifile :Profile): boolean;
}

type Verb = {id: string, display: Display};
type Activity = {id: string, definition: Definition, objectType:string};
type Result = {score?: Score, success?: boolean, completion?: boolean, response?: string, duration?: string, extension?: Extension};
type Profile = {verb:Verb, activity: Activity, result: Result , context: Extension};
type Score = {scaled?: number, raw?: number,min?:number,max?:number}
type Extension = {};
type Display = {};
type Definition = {name: object| string, description? : object, type: string, moreInfo?: string, extension?:object};

export{XapiProfile,Verb,Result,Activity,Extension,Profile}