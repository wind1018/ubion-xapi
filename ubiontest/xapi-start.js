(function(){


    function getJSON(url, qs_params) {
        function buildQueryString(params) {
          return Object.entries(params).map(d => `${d[0]}=${d[1]}`).join('&');
        }
      
        return new Promise((resolve, reject) => {
          const qs = qs_params ? '?' + buildQueryString(qs_params) : '';
          const xhr = new XMLHttpRequest();
          xhr.open('GET', `${url}${qs}`);
      
          xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              resolve(xhr.responseText);
            }
          };
          xhr.onerror = () => reject(xhr.statusText);
          xhr.send();
        });
      }


    // 기본 Config 경로 셋팅
    var config = "./xapiConfig.json"
    console.log(XAPI_INITIALIZE_DATA);


    var a = getJSON(config);

    console.log();






})();