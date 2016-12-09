!function($){
  var _legacyHttpObjects = [];
  function _legacyHttp() {
    this.error = -1;
    this.errorMessage = null;
    this.response = null;
    this.responseHeader = null;
    _legacyHttpObjects = _legacyHttpObjects || [];
    _legacyHttpObjects.push(this);
    this.index = _legacyHttpObjects.length - 1;
    this.httpRequestHeaders = {};
    //this.httpRequestKeys = [];
    //this.httpRequestValues = [];
    this.httpObject;
  }
  function _httpIsValid(d) {
    if (d === undefined || d === null)
      return false;
    return true;
  }

  _legacyHttp.prototype.cancelDownload = function() {
    if (this.httpObject != null)
      this.httpObject.abort();
  };

  _legacyHttp.prototype.cancelRequest = function() {
    if (this.httpObject != null)
      this.httpObject.abort();
  };

  _legacyHttp.prototype.cancelUpload = function() {
    if (this.httpObject != null)
      this.httpObject.abort();
  };

  _legacyHttp.prototype.download = function(entity, successCallback,
      errorCallback, progressCallback, cancelCallback) {
  };

  _legacyHttp.prototype.getResponseHeader = function(header) {
    if (this.httpObject != null) {
      return this.httpObject.getResponseHeader(header);
    } else {
      return null;
    }
  };

  _legacyHttp.prototype.jsonpHandler = function (entity, successCallback, errorCallback) {
	  try{
		  var callback_name = entity["jsonp"] ||  'jsonp_callback_' + Math.round(100000 * Math.random());
		  window[callback_name] = function(data){
			  delete window[callback_name]
			  var req = {};

			  if(!$.isEmptyObject(data)){
				  req['isSuccess'] =true;
				  req['response'] =data;
			  }else{
				  req['isSuccess'] =false;
				  req['response'] ={};
			  }
			  successCallback(req);

		  }
		  var scripturl =""; 

		  if (entity["method"].toLowerCase() == "get") {
			  var paramString = "";

			  if (entity["parameters"] != null) {
				  paramString = "?";
				  for ( var j in entity["parameters"])
					  paramString = paramString + "&" + j + "="
					  + entity["parameters"][j];
				  paramString = paramString.substring(0, 1)
				  + paramString.substring(2);
			  }

			  scripturl = entity['url'] + (((entity["url"] + paramString).indexOf("?") !== -1) ? "&" : "?")  + 'callback='+ callback_name;
		  } else {
			  scripturl = entity['url'] + ((entity["url"].indexOf("?") !== -1) ? "&" : "?") + 'callback='+ callback_name;
		  }


		  var script = document.createElement('script');
		  script.type = 'text/javascript';
		  script.async = true;
		  script.src = scripturl;

		  (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script);

	  }catch(err){
		  http.errorInfo = "error" ;
		  if($.alopex.util.isValid(err.message)) http.errorMessage = err.message;
		  if($.alopex.util.isValid(err.name)) http.errorName = err.name;
		  if($.alopex.util.isValid(err.stack)) http.errorStack = err.stack;

		  errorCallback(http, this);
	  }

	  return false;
  };

  
  _legacyHttp.prototype.request = function(entity, successCallback, errorCallback) {
	  
	  if (entity["dataType"] == 'jsonp') {
		    return this.jsonpHandler(entity , successCallback, errorCallback );
	  }
	  

    if (_httpIsValid(entity) && _httpIsValid(successCallback)
        || _httpIsValid(errorCallback)) {
      entity.index = this.index;
      var http = {};
      
      // SKT 전송망, Access망 프로젝트용
      if($.alopex.util.isValid(entity["paramType"])){
    	  http.paramType = entity["paramType"];
      }
      
      var paramString = "";

      if (entity["parameters"] != null) {
        paramString = "?";
        for ( var j in entity["parameters"])
          paramString = paramString + "&" + j + "="
          + entity["parameters"][j];
        paramString = paramString.substring(0, 1)
        + paramString.substring(2);
      }

      this.httpObject = new XMLHttpRequest();

      this.httpObject.onreadystatechange = function() {
        if (this.readyState == 4) {
          http.status = this.status;
          http.statusText = this.statusText;
          var headerStr = this.getAllResponseHeaders();
          if (headerStr) {
            http.responseHeader = {};
            var headerPairs = headerStr.split('\u000d\u000a');
            for (var i = 0, ilen = headerPairs.length; i < ilen; i++) {
              var headerPair = headerPairs[i];
              var index = headerPair.indexOf('\u003a\u0020');
              if (index > 0) {
                http.responseHeader[headerPair.substring(0,
                    index)] = headerPair
                    .substring(index + 2);
              }
            }
          }
          if (this.status == 200) {
        	  	http.successCallback = successCallback;
        	  	http.errorCallback = errorCallback;
	          	  try{
	          		if(entity["dataType"] == "json"){
	          			http.response = JSON.parse(this.responseText);
	          		}else{
	          			http.response = this.responseText;
	          		}
	          		
	          	  }catch(err){
	          		http.errorInfo = "JSON.parse() error : responseText = " + this.responseText;
	          		if($.alopex.util.isValid(err.message)) http.errorMessage = err.message;
	          		if($.alopex.util.isValid(err.name)) http.errorName = err.name;
	          		if($.alopex.util.isValid(err.stack)) http.errorStack = err.stack;
	
	                errorCallback(http, this);
	                
	          	  }finally{
	          		  
	          		  // JSON.parse() error  errorInfo를 생성하지 않으면 성공으로 본다
	          		  if(!$.alopex.util.isValid(http.errorInfo)) successCallback(http, this);
	          		  
	          		  delete this.responseText;
	                    delete http.response;
	                    delete http;
	                    
	                    // 20150727
	        	        // XMLHttpRequest 객체에서 this.responseText 자원을 사용중이기에 null 포함 어떤 임의의 값으로 변경할 수 없음
	        	        try{
	        	            this.responseText = null;
	        	        }catch(e){}
	                    http.response = null;
	                    http = null;
	          	  }
        	

            } else {
            http.error = this.status;
            http.errorMessage = this.statusText;
            errorCallback(http, this);    
            
            delete this.responseText;
            delete http.response;
            delete http;
            
	        // 20150727
	        // XMLHttpRequest 객체에서 this.responseText 자원을 사용중이기에 null 포함 어떤 임의의 값으로 변경할 수 없음
	        try{
	            this.responseText = null;
	        }catch(e){}
            http.response = null;
            http = null;
          }
        }
      };

      if (entity["method"].toLowerCase() == "get") {
        this.httpObject.open(entity["method"], entity["url"] + paramString, entity["async"]);
      } else {
        this.httpObject.open(entity["method"], entity["url"], entity["async"]);
      }

      // SKT 전송망, Access망 프로젝트용
      if(!this.httpRequestHeaders['Content-Type']) {
          if (entity["onBody"]) {
          	if($.alopex.util.isValid(http.paramType)){
        		  if(http.paramType === 'queryString'){
        			this.httpObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        		  }else{
        			this.httpObject.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        		  }
        	  }else{
        		this.httpObject.setRequestHeader("Content-Type", "application/json; charset=UTF-8");  
        	  }
          } else {
            this.httpObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
          }
        }

      for (var key in this.httpRequestHeaders) {
        this.httpObject.setRequestHeader(key, this.httpRequestHeaders[key]);
      }

      if(entity["async"] && this.timeout) {
        this.httpObject.timeout = this.timeout;
      }

      try {
          if (entity["method"].toLowerCase() == "post") {
              if (entity["onBody"]) {
            	  
                  //SKT전송망
            	  if($.alopex.util.isValid(http.paramType)){
              		if(http.paramType === "queryString"){
      	        		if(typeof entity["content"] === 'string') {
      	        			entity["content"] = JSON.parse(entity["content"]);
      	        		}
      	        		
      	        		// $.param 으로 json To query string 만들 때, 모든 key, value를 인코딩(GET 방식에서 % + & 등을 escape해야 하는 문제 때문)
      	        		entity["content"] = $.param(entity["content"]);
      	        		if($.alopex.util.isValid(entity["gridData"])){
      	        			entity["content"] += "&" + encodeURIComponent('gridData');
      	        			entity["content"] += "=";
      	        			entity["content"] += encodeURIComponent(JSON.stringify(entity["gridData"]));
      	        		}
              		}
            	  }
            	  
            	  
                this.httpObject.send(entity["content"]);
              } else {
                this.httpObject.send(paramString);
              }
            } else {
              this.httpObject.send();
            }
      } catch (e) {
        var result = {};
        result.error = e.code;
        result.errorMessage = e.message;

        errorCallback(result, this.httpObject);

        return;
      } finally{
    	  delete this.httpObject;
    	  this.httpObject = null;
      }

      this.httpRequestHeaders = {};
      //this.httpRequestKeys = [];
      //this.httpRequestValues = [];
    }
  };

  _legacyHttp.prototype.setRequestHeader = function(header, value) {
    if (_httpIsValid(header) && _httpIsValid(value)) {
      this.httpRequestHeaders[header] = value;
      //this.httpRequestKeys.push(header);
      //this.httpRequestValues.push(value);
    }
  };

  _legacyHttp.prototype.setTimeout = function(timeout) {
    this.timeout = timeout;
  };

  _legacyHttp.prototype.upload = function(entity, successCallback, errorCallback,
      progressCallback, cancelCallback) {
  };

  window._legacyHttp = _legacyHttp;
}(jQuery);