var Wrapper = /** @class */ (function () {
    function Wrapper() {
    }
    Wrapper.prototype.Initialize = function () {
        // Builder 생성
        this.Builder = new XAPI.xAPIBuilder();
        // 이 부분을 외부에서 지정할 수 있도록 변경 필요
        var configData = this.Builder.getConfigData();
        // Set Connection Info. to xAPI Wrapper
        ADL.XAPIWrapper.changeConfig({
            'endpoint': configData.endpoint,
            'auth': 'Basic ' + toBase64(configData.username + ':' + configData.password)
        });
    };
    return Wrapper;
}());
//# sourceMappingURL=Wrapper.js.map