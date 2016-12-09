/*! Alopex UI - v2.3.6.18 - 2016-12-09
* http://ui.alopex.io
* Copyright (c) 2016 alopex.ui; Licensed Copyright. SK C&C. All rights reserved. */
!function($) {
	var eventname = 'ready';
	window.isAlopexReady = false;
	
	if(window.alopexController) {
		eventname = 'alopexready';
	}
	$(document).on(eventname, function() {
		window.isAlopexReady = true;
	});
	
	
}(jQuery);



!function($) {
	$.extend($.alopex, {
		session: function() {
			
			if (isAlopexWindowPopup()) {
				var $parent = window.opener.$a;
				return $parent.session.apply(this, arguments);
			} else if (checkAlopexWindowParent() && window.parent && window.parent != window && window.parent.$a) {
				var $parent = window.parent.$a;
				return $parent.session.apply(this, arguments);
			} else {
				if (arguments.length == 1) {
					return memoryPreference.get(arguments[0]);
				} else if (arguments.length > 1) {
					memoryPreference.put.apply(memoryPreference, arguments);
				}
			}
		},
		
		cookie: function() {
			if (arguments.length == 1) {
				return preference.get(arguments[0]);
			} else if (arguments.length > 1) {
				preference.put.apply(preference, arguments);
			}
		}
	});
	$.alopex.session.clear = function() {
		if(arguments.length === 0){
			memoryPreference.removeAll();
		}
		else if(arguments.length === 1){
			memoryPreference.remove(arguments[0]);
		}
	};
	$.alopex.cookie.clear = function() {
		preference.removeAll();
	};
}(jQuery);

!function($) {
	$.alopex.validator = window.Validator,
	window.$a = $.alopex;
}(jQuery);


!function($) {
	if(!window.alopexController) { // alopex_controller polyfill
		function isValid(arg) {
			if (arg == undefined || arg == null) {
				return false;
			} else {
				return true;
			}
		}
		function MemoryPreference() {
			this.data;
			if(!sessionStorage.alopex) {
				sessionStorage.alopex = "";
			}
			this.data = sessionStorage.alopex;
		}

		MemoryPreference.prototype.setData = function(data) {
			this.data = data;
			sessionStorage.alopex = data;
		}
		MemoryPreference.prototype.contains = function(key) {
			if (isValid(key)) {
				if (this.data.indexOf("ù") != -1) {
					var keys = this.data.split("ù")[0];
					var keyArray = keys.split("♠");

					for ( var i = 0; i < keyArray.length; i++) {
						if (keyArray[i] == "mp-" + key || keyArray[i] == "mp-json-" + key) {
							return true;
						}
					}
				}
				return false;
			}
		};
		MemoryPreference.prototype.get = function(key) {
			if (isValid(key)) {
				if (this.data.indexOf("ù") != -1) {
					var keys = this.data.split("ù")[0];
					var values = this.data.split("ù")[1];
					var keyArray = keys.split("♠");
					var valueArray = values.split("♠");

					for ( var i = 0; i < keyArray.length; i++) {
						if (keyArray[i] == "mp-" + key) {
							return valueArray[i];
						}
						else if(keyArray[i] == "mp-json-" + key){
							return _parseJsonWithValidation(valueArray[i]);
						}
					}
				}
				return "undefined";
			} else {
				return "undefined";
			}
		};
		MemoryPreference.prototype.put = function(key, value) {
			if (isValid(key) && isValid(value)) {
				
				if(!(Object.prototype.toString.call(value) === '[object String]') && ($.isArray(value) || value.constructor == Object)){
					value = _stringifyJsonWithValidation(value);
					key = "json-" + key;
				}
					if (this.data.indexOf("ù") != -1) {
						var keys = this.data.split("ù")[0];
						var values = this.data.split("ù")[1];
						var keyArray = keys.split("♠");
						var valueArray = values.split("♠");

						for ( var i = 0; i < keyArray.length; i++) {
							if (keyArray[i] == "mp-" + key) {
								valueArray[i] = value;
								this.setData(keyArray.join("♠") + "ù" +	valueArray.join("♠"));
								return;
							}
						}
						keyArray.push("mp-" + key);
						valueArray.push(value);

						this.setData(keyArray.join("♠") + "ù" +	valueArray.join("♠"));
					} else {
						this.setData("mp-" + key + "ù" + value);
					}
				
			}
		};

		MemoryPreference.prototype.remove = function(key) {
			if (isValid(key)) {

				var keys = this.data.split("ù")[0];
				var values = this.data.split("ù")[1];

				if (keys != null && values != null) {
					var keyArray = keys.split("♠");
					var valueArray = values.split("♠");

					for ( var i = 0; i < keyArray.length; i++) {
						if (keyArray[i] == ("mp-" + key) || keyArray[i] == "mp-json-" + key) {
							keyArray.splice(i, 1);
							valueArray.splice(i, 1);
							this.setData(keyArray.join("♠") + "ù" + valueArray.join("♠"));
							return;
						}
					}
				}
			}
		};

		MemoryPreference.prototype.removeAll = function() {
			var keys = this.data.split("ù")[0];
			var values = this.data.split("ù")[1];

			if (keys != null && values != null) {
				var keyArray = keys.split("♠");
				var valueArray = values.split("♠");

				var len = keyArray.length;
				for ( var i = 0; i < len; i++) {
					if (keyArray[i] != null) {
						if (keyArray[i].substring(0, 3) == "mp-" || keyArray[i].substring(0, 8) == "mp-json-") {
							keyArray.splice(i, 1);
							valueArray.splice(i, 1);
							i--;
							len--;
						}
					}
				}
				this.setData(keyArray.join("♠") + "ù" + valueArray.join("♠"));
			}
		};
		
		if(!window.memoryPreference) {
			window.memoryPreference = new MemoryPreference();
		}
		

		function Preference() {
		}

		Preference.prototype.contains = function(key) {
			if (isValid(key)) {
				return (preference.get(key) !== undefined && preference.get(key) !== 'undefined');
			}
			return false;
		};

		/*
		 * source from jQuery Cookie Plugin v1.3(MIT)
		 * https://github.com/carhartl/jquery-cookie
		 */

		Preference.prototype.get = function(key) {

			if (isValid(key)) {

				var decode = function(s) {
					return decodeURIComponent(s.replace(/\+/g, ' '));
				}

				var cookies = document.cookie.split('; ');
				for ( var i = 0, l = cookies.length; i < l; i++) {
					var parts = cookies[i].split('=');
					var part = parts.shift();
					if (decode(part) === key) {
						var cookie = decode(parts.join('='));
						return cookie;
					}
				}

				return undefined;
			}
		};

		Preference.prototype.put = function(key, value, expires) {

			if (isValid(key)) {
				if (typeof expires === 'number') {
					var days = expires, t = expires = new Date();
					t.setDate(t.getDate() + days);
				}
				document.cookie = [encodeURIComponent(key), '=',
						encodeURIComponent(value),
						expires ? '; expires=' + expires.toUTCString() : '' // use expires attribute, max-age is not supported by IE
				].join('');

			}
		};

		Preference.prototype.remove = function(key) {
//			console.log("[Preference/remove]");
			if (isValid(key)) {
				if (preference.get(key) !== undefined) {
					preference.put(key, undefined);
				}
			}
		};

		Preference.prototype.removeAll = function() {
//			console.log("[Preference/removeAll]");
			notSupported("Preference.removeAll");
		};
		
		if(!window.preference) {
			window.preference = new Preference();
		}
		
		function _parseJsonWithValidation(jsonString){
			var result = null;
			try{
				result = JSON.parse(jsonString);
				return result; 
			}catch(err){
				console.error("JSON.parse() error : " + jsonString);
				return false;
			}
		}
		
		function _stringifyJsonWithValidation(jsonObject){
			var result = null;
			try{
				result = JSON.stringify(jsonObject);
				return result; 
			}catch(err){
				console.error("JSON.stringify() error");
				console.error(jsonObject);
				return false;
			}
		}
	}
	
}(jQuery);

!function($) {
	$.alopex.decorator = function(config) {
		this.process = function() {
			config.template = this.template;
			var decorator = $('script[type="text/alopex-decorator"]').attr('data-decorator');
			var metas = config.options.metas;
			for (i in metas) {
				var tag = '<meta';
				for (j in metas[i]) {
					var metaAttr = metas[i][j];
					tag += ' ' + metaAttr.prop + '="' + metaAttr.value + '"';
				}
				tag += '/>'
				$('head').prepend(tag);
			}
			if(config[decorator || config.options.defaultDecorator]){
				config[decorator || config.options.defaultDecorator]();
			}

			//깜빡임 현상을 방지하기 위하여 HTML을 display:none했다가 show
			$('html').show();
		}
		return this;
	};

	$.alopex.view = function(name, view) {
		var inst = $.alopex.viewConfig.views[name];
		if (inst == undefined && view !== undefined) {
			inst = new $.alopex._view(name, view);
			$.alopex.viewConfig.views[name] = inst;
		}
		return inst;
	}

	$.alopex.viewSetup = function(options) {
		$.extend($.alopex.viewConfig.settings, options);
	};

	$.alopex.viewConfig = {
		views: {},
		settings: {
			templateBasePath: 'source/templates',
			templateFileExtension: '.html'
		}
	}

	$.alopex._view = function(name, view) {
		this.name = name;
		$.extend(this, view);
	}
	
	$.alopex._view.prototype = {
		template: function(model) {
			var templateName = this.templateName || (this.name + $.alopex.viewConfig.settings.templateFileExtension);
			var method = AlopexWebApp.Templates[$.alopex.viewConfig.settings.templateBasePath + '/' + templateName];
			if(method && typeof method == 'function') {
				return method(model);
			}
			return '';
		},
		render: function(model) {
			var outlet = this.outlet || this.name;
			model = model || this.model;
			model = (model && typeof model === 'function') ? model() : model;
			var $outlet = $('[data-outlet="' + outlet + '"]');
			
			$outlet.html(this.template(model));
			$outlet.convert(); //alopex ui convert
		}
	};
}(jQuery);
(function($) {
	
	
	// 변경되는 부분. 
	/**
	 * 변경되는 부분
	 * 
	 * fileupload 관련된 최소 기능 제공.
	 * 
	 * 서버에서 오는 response가 다를 수 있다.  --> parsing 하는 룰이 달라져야 한다.
	 * progress 처리는 ? 따로 구현해야 되나? 서버랑 맞춰야 되나?
	 * cancel은 가능한가?
	 * ajax로 보낼수 있는지 (FormData)
	 * 
	 * 
	 */

	function FileSelector(options) {
		this.form;
		this.input;
		this.files;
		this.add;
		this.iframe;
		this.selected = [];
		this.options = options; // file options : multiple , success
	}

	FileSelector.prototype.addForm = function(element) {
		var iframe_id = '_iframe_' + Math.random();
		this.iframe = document.createElement('iframe');
		this.iframe.setAttribute('id', iframe_id);
		this.iframe.setAttribute('name', iframe_id);
		this.form = document.createElement('form');
		this.form.setAttribute('method', 'post');
		this.form.setAttribute('enctype', 'multipart/form-data');
		this.form.setAttribute('target', iframe_id);

		$(this.iframe).appendTo('body')//.hide();
		$(this.form).appendTo(element);
		$(element).css('overflow', 'hidden');
	};

	FileSelector.prototype.addInput = function() {
		// 기존 input이 있을 경우,
		if (this.input) {
			this.selected.push(this.input);
			$(this.input).hide();
		}
		

		this.input = document.createElement('input');
		this.input.setAttribute('type', 'file');
		this.input.setAttribute('name', 'file');

		if (this.options.multiple) {
			this.input.setAttribute('multiple', true);
		}
		$(this.input).css({
			display : 'block',
			top : 0,
			right : 0,
			height : '100%',
			width : '100%',
			'font-size' : '1000px'
		});
		$(this.input).css({
			position : 'absolute',
			right : '0px',
			top : '0px',
			height : '40px',
			width : '200px',
			opacity : 0
		});

		var that = this;
		$(this.input).on('change', function(e) {
			if (e.target.files) { // file api가 있는경우, IE는 10+
				that.files = e.target.files;
			} else {
				that.files = [ {
					name : e.target.value
				} ];
			}
			if (that.options.success) {
				that.options.success.apply(this, [ that.files ]);
			}
		});
		$(this.input).appendTo(this.form);
	};

	FileSelector.prototype.upload = function(options) {
		this.form.action = options.url;

		var $inputs = $(this.form).find('input[type="file"]');
		if ($inputs.length > 2)
			$inputs.eq(0).remove();

		var that = this;
		window.aa = this.iframe
		$(this.iframe).one('load', function(e) {
			var result;
			var error;
			try {
				error = {
					code: 'E001',
					message: 'Cross-Domain'
				};
				result = $(that.iframe.contentDocument.body).find('pre').html();
				error = {
					code: 'E002',
					message: 'JSON Parse Error'
				};
				result = JSON.parse(result);
			} catch (e) {}
			
			if(result && ((options.isSuccess && options.isSuccess(result)) || (!options.isSuccess))) {
				options.success(result);
			} else {
				options.error(error);
			}
			
//			e.preventDefault();
		});

		if (options.success) {
			window._uploadSuccessCallback = options.success;
		}
		if (options.error) {
			window._uploadErrorCallback = options.error;
		}
		$(this.form).trigger('submit');
	};

	FileSelector.prototype.removeSelected = function(filename) {
		for (var i = 0; i < this.selected.length; i++) {
			if (this.selected[i].value == filename) {
				$(this.selected[i]).remove();
				this.selected.splice(i, 1);
				break;
			}
		}
	};

	$.fn.fileselect = function(options) {
		var element = this[0];
		var file = new FileSelector(options);
		file.addForm(element);
		file.addInput();
		return file;
	};

})(jQuery);

// constructor : markup, style, init, event, defer: timing issue에 사용.

(function($) {

	/**
	 * fileupload (TBD)
	 * 서버에서 오는 response가 다를 수 있다.  --> parsing 하는 룰이 달라져야 한다.
	 * progress 처리는 ? 따로 구현해야 되나? 서버랑 맞춰야 되나?
	 * cancel은 가능한가?
	 * ajax로 보낼수 있는지 (FormData)
	 * 
	 */

})(jQuery);


/*!
* Copyright (c) 2014 SK C&C Co., Ltd. All rights reserved.
*
* This software is the confidential and proprietary information of SK C&C.
* You shall not disclose such confidential information and shall use it
* only in accordance with the terms of the license agreement you entered into
* with SK C&C.
*
* Alopex Javascript Framework
* alopex-page
*
*/
!function($) {
	
	$.extend($.alopex, {
		fragment: function(entry) {
			var event;
			if(typeof entry !== 'function') {
				return ;
			}
			
			if(isAlopexReady) { // Alopex Runtime을 사용하고, 해당 페이지가 나중에 로드된 케이스.
				event = 'alopexuiready';
			} else {
				if (window.alopexController) {
					event = 'alopexready';
				} else {
					event = 'ready';
				}
			}
			
			var entrycode = entry.toString();
			entrycode = entrycode.replace(/function\s*\(\s*\)\s*\{/i, '');
			entrycode = entrycode.substr(0, entrycode.length-1);
			var _entrycode = ''
				+ 'var exports = {};'
				+ entrycode
				+ '$(document).one("' + event + '", function() {'
				+ ';init($a.parameters);'
				+ '});'
				+ ';return exports;';
			var _entry = new Function(_entrycode);
			return _entry();
		}
	});
	
}(jQuery);

//
///**
// * 페이지 코드.
// */
//var page = $a.fragment(function() {       
//	// this area code is executed when `$a.fragment` function is called.       
//	
//	// private variable    
//	var privateVariable = '';       
//	// public variable    
//	var publicVariable = '';       
//	function privateFunction() {     }       
//	function publicFunction() {     }       
//	
//	/**
//	 * this function is executed when the page resource is loaded & alopex module is ready to run
//	 */
//	function init(param) { // 
//		// tab 함수 접근.
//		$('#tab').on('loaded', function() {
//			tab.tabPublicFunction(); 
//		});
//	} 
//		
//	// public property of fragment should be exported by `exports` keyword.    
//	exports.publicVariable = publicVariable;     
//	exports.publicFunction = publicFunction;     
//});
//
//
///**
// * 탭 페이지 내부 코드.
// * 이 부분은 탭 페이지 로직을 구현하는 부분입니다.
// */
//var tab = $a.fragment(function() {
//	
//	function init(param) {
//		// 탭의 초기화 코드.
//		$('#tab').trigger('loaded');
//	}
//	
//	exports.tabPublicFunction = function() {}; 
//});


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
!function($) {
	$.extend($.alopex, {
		
		alopex_blockTargetParent: null,
		/**
		 * 화면에 모달뷰 띄우는 함수.
		 */
		block: function(targetParent, blockname) {
			var $html, $body;
			
			var targetParentScrollTop = 0;
			
			if ($.alopex.util.isValid(targetParent.document)) {
				$.alopex.alopex_blockTargetParent = targetParent.document;
				$html = $(targetParent.document).find('html');
				$body = $(targetParent.document).find('body');
				
				/**
				 * [Hong-HyunMin 2016.01.28] window modal기능을 사용시에 block위치가 이상한 경우에 대한 처리.
				 * document.body.scrollTop 은 스크롤시에 페이지의 상단의 위치값을 반환하거나 부여한다.
				 * 하지만 HTML 코드 상단에 DTD 가 선언되어 있다면 scrollTop이 재구실을 못해버리는 문제가 발생된다.
				 * document.documentElement.scrollTop을 사용하려 하나, documentElement는 크롬에서 문제 발생으로 인한 분기 처리.
				 */
				var ua = window.navigator.userAgent;
				if(ua.indexOf('Chrome') != -1) {
					targetParentScrollTop = $body[0].scrollTop;
				}
				else {
					targetParentScrollTop = targetParent.document.documentElement.scrollTop;
				}
			} else {
				$html = $('html');
				$body = $('body');
			}

			var $modalview = $('<div></div>').attr('data-alopexmodal', 'true').appendTo($body);
			if(blockname){
				$modalview.attr("data-blockname", blockname);
			}
			$modalview.css({
				"position": "absolute",
				"top": targetParentScrollTop,
				"left": "0",
//				"width": $(targetParent).width() + "px",
//				"height": $(targetParent).height() + "px",
				"width": "100%",
				"height": "100%",
				"z-index": "9999",
				"opacity": "0.7",
				"background-color": "#111"
			});

			$.alopex.__htmlHeight = $html[0].style.height;
			$.alopex.__htmlWidth = $html[0].style.width;
			$.alopex.__bodyHeight = $body[0].style.height;
			$.alopex.__bodyWidth = $body[0].style.width;
			$html.css({
				height: '100%',
				width: '100%'
			});
			$body.css({
				height: '100%',
				width: '100%',
				overflow: 'hidden'
			});

			$modalview.on('mousedown.alopexbloack mouseup.alopexblock scroll.alopexblock', function(e) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			});
		},

		/**
		 * 화면에 있는 모달뷰 제거하는 함수.
		 */
		unblock: function(blockname) {
			var selector = blockname ? 'div[data-blockname=' + blockname + ']' : 'div[data-alopexmodal]';
			
			var $html, $body;
			if ($.alopex.util.isValid($.alopex.alopex_blockTargetParent)) {
				$html = $($.alopex.alopex_blockTargetParent).find('html');
				$body = $($.alopex.alopex_blockTargetParent).find('body');
			} else {
				$html = $('html');
				$body = $('body');
			}

			$html[0].style.height = ($.alopex.__htmlHeight) ? $.alopex.__htmlHeight : '';
			$html[0].style.width = ($.alopex.__htmlWidth) ? $.alopex.__htmlWidth : '';
			$body[0].style.height = ($.alopex.__bodyHeight) ? $.alopex.__bodyHeight : '';
			$body[0].style.width = ($.alopex.__bodyWidth) ? $.alopex.__bodyWidth : '';
			$body.css({overflow: ''});

			$($.alopex.alopex_blockTargetParent).find(selector).remove();
		}
	});
}(jQuery);


/*!
* Copyright (c) 2014 SK C&C Co., Ltd. All rights reserved.
*
* This software is the confidential and proprietary information of SK C&C.
* You shall not disclose such confidential information and shall use it
* only in accordance with the terms of the license agreement you entered into
* with SK C&C.
*
* Alopex Javascript Framework
* alopex-page
*
*/
!function($) {
	
	var popupparam, navparam, queryparam, results;
	var re = /([^&=]+)=?([^&]*)/g;
	var decode = function(str) {
		return decodeURIComponent(str.replace(/\+/g, ' '));
	};
	function decodeQuery(query) {
		var params = {};
		while (e = re.exec(query)) {
			var k = decode(e[1]);
			var v = decode(e[2]);
			if (params[k] !== undefined) {
				if (!$.isArray(params[k])) {
					params[k] = [params[k]];
				}
				params[k].push(v);
			} else {
				params[k] = v;
			}
		}
		return params;
	}
	
//	function init() {
//		$(document).on('screenback', function() {
//			if($a.page.screenback) {
//				var args = $.makeArray(arguments);
//				$a.page.screenback.apply(this, args);
//			}
//		});
//		$(document).on('pause', function() {
//			if($a.page.screenpause) {
//				var args = $.makeArray(arguments);
//				$a.page.screenpause.apply(this, args);
//			}
//		});
//		$(document).on('resume', function() {
//			if($a.page.screenresume) {
//				var args = $.makeArray(arguments);
//				$a.page.screenresume.apply(this, args);
//			}
//		});
//	}
	$.extend($.alopex, {
		
		/**
		 * 화면 이동과 관련된 설정.
		 * $a.navigate.setup() 함수로 변경가능.
		 */
		_navigationCofig: {
			url: function(url, options) {
				return url;
			},
			
			querystring: false
		}
	});
	

	$.extend($.alopex, {
		//$.alopex.page(Object pageObject)
		//$.alopex.page(Function initFunc)
		//$.alopex.page(Function initFunc, Object pageObject)
		parameters: (function() {
			var session, query;
			if (window.alopexController) { // alopexController 사용
				if(window.browser === 'mobile') {
					$.alopex._navigationCofig.querystring = true;
				}
				
				if($.alopex._navigationCofig.querystring) {
					$(document).on('alopexready', function() {
						$.alopex.parameters = navigation.parameters;
					});
					return;
						
				} else { // web + no querystring
					// session 에서 뺴기
				}
			} else {
				if($.alopex._navigationCofig.querystring) {
					query = String(window.location.search);
					if (query.substr(0, 1) == '?') {
						query = query.substr(1);
					}
					return decodeQuery(query);
				} else {
					// session 에서 뺴기 
				}
			}
			
			var session = {};
			
			try{
				if($a.session('from_navigate') === "true") {
					$a.session('alopex_parameters' + window.location.href, $a.session('alopex_parameters'));
				}
				else if(window.location.search !== '' && $a.session('alopex_parameters' + window.location.href) === 'undefined'){
					query = String(window.location.search);
					if (query.substr(0, 1) == '?') {
						query = query.substr(1);
					}
					var paramFromQuery = decodeQuery(query);
					$a.session('alopex_parameters' + window.location.href, JSON.stringify(paramFromQuery));
				}
				
				$a.session('alopex_parameters', '');
				$a.session('from_navigate', false);
				session = JSON.parse($a.session('alopex_parameters' + window.location.href));
				//navigate할때 parameter를 지우지 않는다.
				//$a.session('alopex_parameters', '');
			} catch(e) {
				
			}
			
			return session;
		})(),
		
		results: (function() {
			var results;
			if (window.alopexController) { // alopexController 사용
				$(document).on('alopexready', function() {
					$.alopex.results = navigation.results;
				});
			} else {
				try{
					results = JSON.parse($a.session('alopex_results'));
					$a.session('alopex_results', '');
					$a.session('from_back', false);
				} catch(e) {}
				return results;
			}
		})(),
		
		pageId: (function() {
			if (window.alopexController) {
				$(document).on('alopexready', function(){
					$.alopex.pageId = navigation.pageId;
				});
			} else {
				return window.location.pathname;
			}
		})(),
		
		/**
		 * 기
		 * 1. 모바일, Alopex UI 사용 시의 로직 초기점 제공
		 * 2. 소스 컨벤션.
		 * 3. navigate 함수 parameter 전달.
		 * 
		 */
		page: function() {
			var module = {}; /* $a.page 함수의 리턴 모듈. */
			var args = $.makeArray(arguments); /* 현재 표준은 $a.page 함수는 파라미터 한개만 허용. */
			var inits = [];
			
			$.each(args, function(idx, arg) {
				if ($.isFunction(arg)) {
					//Page - Tango#3239 iframe을 false로 popup을 띄울때 이전 데이타가 남아 있는 현상 해결
					// $.extend 시 $a.parameters 에 데이터가 쌓여서 저장되고 있어 이전 데이터가 재사용될 수 있음
					// $a.parameters 인자 앞에 {} 빈 객체 추가하여 {} 빈 객체에 extend 되고, 사용되도록 수정
					$.extend(module, arg.call(module, $a.pageId, $.extend(true, {}, $a.parameters, $a.results, $a.popupdata, $a.dialogdata)));
					if(typeof module.init == 'function') {
						inits.push(module.init);
					} 
				} else if ($.isPlainObject(arg)) { /* old method : the parameter of $a.page is literal object */
					$.alopex.page = $.extend($.alopex.page, arg);
					if (arg.init) {
						inits.push(arg.init);
					}
				}
			});
			
			$.each(inits, function(idx, arg) {
				
				function runArg() {
					arg.call(module, $a.pageId, $.extend(true, {}, $a.parameters, $a.results, $a.popupdata, $a.dialogdata));
					$a.dialogdata = null;
				}
				
				if(isAlopexReady) { // Alopex Runtime을 사용하고, 해당 페이지가 나중에 로드된 케이스.
					if($.alopex.loading) { // Alopex에서 로드 시킨 경우.
						$.alopex.loading = false;
						$(document).one('alopexuiready', function() {
							$(runArg);
						});
					} else { // Alopex에서 로드된 경우 외에는 바로 실행.
						$(runArg);
					}
					
				} else {
					if (window._useAlopexController) {
						$(document).one('alopexready', function() {
							$(runArg);
						});
					} else {
						$(document).ready(function(){
							$(runArg);
						});
					}
					
				}
			});
			return module;
		},
		
		/**
		 * $a.navigate 함수 호출 시 기준되는 위치는 /html/폴더 하위입니다.
		 * $a.navigate('DS/DS0001') or $a.navigate('DS/DS0001.html')
		 */
		navigate: function(url, param) {
			if (typeof url !== "string")
				return;
			
			var targetUrl = $.alopex._navigationCofig.url(url, param);
			var options = {pageId: targetUrl};
			if (window.alopexController) { // alopexController 사용
				if(window.browser === 'mobile') {
					$.alopex._navigationCofig.querystring = true;
				}
				if($.alopex._navigationCofig.querystring) {
					options.parameters = param;	
				} else {
					$.alopex.session('alopex_parameters', JSON.stringify(param));
					$.alopex.session('from_navigate', true);
				}
				navigation.backToOrNavigate(options);
			} else {
				if($.alopex._navigationCofig.querystring) {
					if(targetUrl.indexOf('?') == -1) {
						targetUrl += ('?' + $.param(param)); 
					} else {
 						targetUrl += ('&' + $.param(param));
					}
				} else {
					$.alopex.session('alopex_parameters', JSON.stringify(param));
					$.alopex.session('from_navigate', true);
				}
				window.location.href = targetUrl;
			}
		},
		
		back: function(results) {
			if (window.alopexController) {
				navigation.back(results);
			} else {
				$.alopex.session('from_back', true);
				$.alopex.session('alopex_results', JSON.stringify(results));
				history.back();
			}
		},
		
		backTo: function(id, params) {
			navigation.backTo({
				"pageId": _url,
				"parameters" : params
			});
		}, 
		
		backToOrNavigate: function(id, params) {
			navigation.backToOrNavigate({
				"pageId": _url,
				"parameters" : params
			});
		},
		
		exit: function() {
			navigation.exit();
		}, 
		
		/**
		 * Used with Alopex Runtime
		 */
		goHome: function() {
			navigation.goHome();
		}
	});
	
	/**
	 * $a.navigate.setup({
	 * 	url: function(url, param) {
	 * 		return '실제 URL';
	 * 	},
	 * 	querystring: true
	 * });
	 */
	$.extend($.alopex.navigate, {
		setup: function(config) {
			$.extend($.alopex._navigationCofig, config); 
		}
	});
}(jQuery);
!function($) {
	
	// popup API를 사용해 팝업을 띄울 경우, window.name으로 아이디 전달.
	var _id = window.name;
	var _config = null;
	var _data = null;

	/**
	 * 팝업 id를 생성하여 리턴
	 */
	function _GenerateId(popid) {
		var length = $.alopex.popup.names.length;
		var suffix = $.alopex.util.isValid(popid) ? popid : parseInt(Math.random()*10E3);
		var id = 'Alopex_Popup_' + suffix;
		$.alopex.popup.names.push(id);
		return id;
	}

	/**
	 * dialog 띄우는 함수. setting에 따라 다르게 세팅.
	 */
	function _DialogOpen(setting, base) {
		var dialog = document.getElementById(setting.id);
		var $dialog = $(dialog);
		if ($dialog.length == 0) {
			var markup = '<div id="' + setting.id + '" data-type="dialog"';
			if (setting.modalclose) {
				markup += 'data-modalclose="true" ';
			}
			if (setting.toggle) {
				markup += 'data-toggle="true" ';
			}
			markup += '>';
			if (setting.iframe) {
				// 기존에는 $iframe[0].contentWindow.name = setting.id; 등으로 iframe 내 window.name에 dialog id 를 전달했으나
				// IE10 indexed db is only available on websites with http or https url schemes 이 발생하면서 iframe 내 window의 name이 빈값인 경우가 발생
				// 마크업에서 iframe name 속성에 id로 설정 >> iframe 내 global window의 name의 값이 된다.
				markup += '<iframe name="' + setting.id + '" data-type="panel" data-fill="vertical" style="width:100%;overflow:auto;border:0"></iframe>';
			} else if(setting.scroll){ //scroll을 위한 div
				markup += '<div></div>'
			}
			markup += '</div>';
			if(base) {
				$dialog = $(markup).appendTo(base).dialog(); // 다이얼로그 생성.
			} else {
				$dialog = $(markup).appendTo('body').dialog(); // 다이얼로그 생성.
			}
			
			dialog = document.getElementById(setting.id);
		}

		if (setting.center === true) {
			setting.top = ($(window).height() - setting.height) / 2;
			setting.left = ($(window).width() - setting.width) / 2;
		} else {
			//setting에 left, top가 없는 경우 값을 0으로 처리.
			if(false === $.alopex.util.isValid(setting.left)){
				setting.left = 0;
			}
			if(false === $.alopex.util.isValid(setting.top)){
				setting.top = 0;
			}
		}

		// 콜백 옵션이 있을 경우, 오픈 시 close 이벤트 핸들러로 등록.
		// 이부분이 dialog.js 내에서 처리되고 있었으나, 팝업의 dependent한 코드는 이쪽에서 처리.
		// 팝업으로 오픈한 dialog는 DOM에서 제거.
		$dialog.one('close', function(e) {
			var dialog = e.currentTarget;
			var $dialog = $(dialog);
			var index = $.inArray(dialog.id, $.alopex.popup.names);
			if (dialog && index !== -1) {
				$.alopex.popup.names.splice(index, 1);

				if(dialog.blocker) {
					$(dialog.blocker).remove();
				}
				$dialog.remove();
				
//			    [2016-10-18]ESH 다중 팝업시 스크롤 이슈 해결.
//			    팝업이 아닌 경우에만 body영역에 스크롤을 재생성 하도록 설정.
//				팝업을 닫는 시점에 body 영역은 팝업이 없으면, 스크롤을 생성 하도록 처리.
				
//				[2016-10-24]ESH IE10에서 remove() 했는데도 find('.Dialog').length 가 1개 남아 있는 현상 발생
//				id="div_dialog" 라는 Dialog 컴퍼넌트 존재
//				if($(document.body).find('.Dialog').length == 0){
				
//				[2016-11-08] Tango Chrome 에서 $(document.body).find('div').filter('.Dialog-mask') 하면 $(dialog.blocker).remove() 했음에도 엘리먼트 찾아짐. 단 display:none인 상태로. 아래에 :visible 추가
					var $allBlocks = $(document.body).find('div').filter('.Dialog-mask:visible');
					if($allBlocks.length === 0){
						 var body = document.body;
					     var scrollTop = Math.abs(parseInt(body.style.top));
					     $(body).css({
					        'top': '',
					        'position': this.bodyposition? this.bodyposition: '',
					            'width': this.bodywidth? this.bodywidth: ''
					     });
					    
					     // dialog 닫힐때 scrollTop 위치 세팅
					     if (window.browser === 'ie' || $.alopex.util.isValid(window.browser) && window.browser.indexOf('Microsoft Internet Explorer') !== -1){
					        $(document.documentElement).scrollTop(dialog.scrollTopValue);
					     } else {
					        $(body).scrollTop(scrollTop);
					     }
					}
					$allBlocks = null;

				if(setting.callback) {
					if(!$.alopex.popup.result && $dialog && $dialog.prop('callbackData')){
						setting.callback($dialog.prop('callbackData'));
						$dialog.prop('callbackData', null)
					}else{
						setting.callback($.alopex.popup.result);
						$.alopex.popup.result = null;
					}
				}
			}
		});

		$dialog.prop('alopexPopupSetting', setting);
		if (setting.iframe) {
			// var url = setting.url + '?'; // querystring으로 parameter전달.
			// if(setting.data) {
			// url += 'parameters=' + encodeURIComponent(JSON.stringify((setting.data)));
			// }

			if(!setting.preLoading) {
				$dialog.open(setting);
			}

			$dialog.find('iframe').on('load', function() {
				// setting.modal = false;
				if(setting.preLoading) {
					$dialog.open(setting);
				}
				
				var $iframe = $dialog.find('iframe');
				$iframe.refresh();
				
				// parent > child access 의 경우, cross-domain 으로 막힐 때 예외처리
				if(isAlopexIframeChild($iframe[0].contentWindow)) $iframe[0].contentWindow.alopexready = true;
//				$dialog.find('iframe')[0].contentWindow.alopexready = true;
			});
			
//			var $iframe = $dialog.find('iframe');
//			
//			isAlopexIframeChild에서 window, window.$, window.$.alopex 체크 하는데,
//			window는 있는데, window.$는 아직 없을 경우 false 를 리턴하기 때문에
//			$iframe[0].contentWindow.name = setting.id; 가 수행되지 않는 경우 발생.
//			이 경우를 대비하여 아래처럼 window가 일단 있을 때는 setting.id를  popupdataKey에 넣어주고, iframe page init 호출 시 사용한다.
//			try{
//				if($.alopex.util.isValid($iframe[0].contentWindow)){
//					$iframe[0].contentWindow.name = setting.id;
//				}
//			}catch(e){}
			
			// parent > child access 의 경우, cross-domain 으로 막힐 때 예외처리
//			if(isAlopexIframeChild($iframe[0].contentWindow)) $iframe[0].contentWindow.name = setting.id;
//			$dialog.find('iframe')[0].contentWindow.name = setting.id;
			
			setTimeout(function() { 
				/**************** 
				 * windowpopup 콜백에서 다이얼로그 팝업을 띄울 경우 setTimeout 없으면 load 이벤트가 발생하지 않음.
				 * resource 요청을 window 팝업 쪽에서 수행하는 것으로 판단. 
				 **/
				$dialog.find('iframe').attr('src', setting.url);
			}, 0);
		} else {
			// dialog without iframe has the same context. undo stringify.
			// JSON.parse(setting.data)에서 setting.data가 undefined일 경우 JSON.parse 에러남.
			if(setting.data){
				$a.dialogdata = JSON.parse(setting.data);
			}else{
				$a.dialogdata = null;
			}
			
			$.alopex.loading = true;
			
			(setting.scroll ? $dialog.find('div') : $dialog).load(setting.url, function() {//scroll을 사용한 경우에는 child div에 컨텐츠 로드
				$dialog.open(setting);
				$.alopex.convert(dialog);
				$(document).trigger('alopexuiready');
			});
		}
		return dialog;
	}

	function _WindowOpen(setting, base) {
		var param = '';
		if (setting.width) {
			param += 'width=' + setting.width + ',';
		}
		if (setting.height) {
			param += 'height=' + setting.height + ',';
		}
		if (setting.center === true) {
			var topPositon = Math.max((window.screen.height - parseInt(setting.height)) / 2 - 50, 0) - $('body')[0].scrollTop;
			param += 'top=' + topPositon + ',';
			param += 'left=' + (window.screen.width - parseInt(setting.width)) / 2 + ',';
		} else {
			param += 'top=0,';
			param += 'left=0,';
		}
		if (setting.scroll === true) {
			param += 'scrollbars=yes,';
		}
		if (setting.other) {
			param += setting.other;
		}
		if (setting.modal === true) {
			// parent 창에 blocking이 되도록 수정.
			if(checkAlopexWindowParent()) {
				$a.block(window.parent, setting.id);
			}
		}
		if (!$.alopex.util.isValid(base)) {
			base = window;
		}
		/**
		 * 윈도우 띄우는데 타이밍 이슈 해결.
		 * 이 코드 없으면 IE9에서 $a.popup(다이얼로그) 콜백에서 $a.popup(윈도우)를 띄울 때 새로 뜬 윈도우가 뒤로 이동됨.
		 */
		setTimeout(function() {
			var popup = base.open(setting.url, setting.id, param);
			$.alopex.popup.children.push(popup);
		}, 0);
	}
	
	/**
	 * window.open으로 팝업을 연 경우, 호출됩니다.
	 * 기능 1. 부모창의 beforeunloadHandler 호출
	 */
	function beforeunloadHandlerInChild(){
		if(isAlopexWindowPopup()){
			window.opener.$a.beforeunloadHandlerInParent(_id, $.alopex.popup.result);
		}
	}
	
	/********************************************
	 * 열린 popup context에서 필요한 코드.
	 ********************************************/
	// window popup PopupData setting
	try{
		if (isAlopexWindowPopup()) {
			// 팝업 종료 시 처리 : 팝업 창 닫힐 때 메인화면 modal unblock 함수 실행.
			$(window).on('beforeunload', beforeunloadHandlerInChild);
			if(window.opener.$.alopex && window.opener.$.alopex.popup.config && window.opener.$.alopex.popup.config[_id]) {
				_config = window.opener.$.alopex.popup.config[_id];
				if ($.alopex.util.isValid(_config) && $.alopex.util.isValid(_config.data) && _config.id === _id) {
						_data = JSON.parse(_config.data);
				}
			}
		} else if(checkAlopexWindowParent()) {
			// dialog popup PopupData setting
			$(window.parent.document).find('[data-type="dialog"]').each(function(i, elem) {
				_config = $(elem).prop('alopexPopupSetting');
				if ($.alopex.util.isValid(_config) && $.alopex.util.isValid(_config.data) && elem.id === _id) {
						_data = JSON.parse(_config.data);
				}
			});
		}
	}catch(e){}
	
	/********************************************/
	
	
	// 메인화면이 닫힐 경우, 자신이 띄운 팝업들 닫기.
	// TODO 메인화면이 닫혀도 window 하위창들이 닫히지 않음.
//	$(window).on('beforeunload', closeChildren(null));

	$.extend($.alopex, {
		popupdata : _data,
		/**
		 * 윈도우 팝업, 다이얼로그 팝업(with/without iframe) 
		 * 
		 * @args option {
		 * 	scroll: '',
		 *  modal: '',
		 *  heigth: '',
		 *  center: ''
		 *  url: '',
		 *  callback: ''
		 *  iframe: '',
		 * }
		 */
		popup : function(option, base) {
			// options
			// scroll, modal, width, height, center, scroll, modal, url, callback,
			// popup id 지정 : 이 아이디를 가지고 부모창에서 인자를 가져감.
			// default setting.
			
			// 사용자가 임의 입력한 name이 있고, name을 이용해 생성한 id를 가진 팝업이 있다면 팝업 생성을 막는다.
			// 팝업 생성하는 버튼을 빠르게 2번 이상 클릭하면 같은 팝업이 2개 이상 생성되는 이슈 방지용 
			if($.alopex.util.isValid(option.popid)){
				if($.inArray("Alopex_Popup_" + option.popid, $.alopex.popup.names) !== -1) return;
//				if($("div").filter("[id=Alopex_Popup_" + option.popid + "]").length > 0) return;
			}
					
			var setting = {
				id : _GenerateId(option.popid),
				title : (option.title || option.url)
			};
			$.extend(setting, $.alopex.popup.defaultOptions, option);
			if(setting.width === 0){
				setting.width = parseInt(window.innerWidth * 0.9);
			}
			if(setting.height === 0){
				setting.height = parseInt(window.innerHeight * 0.9);
			}

			var _urlFixer = ($.alopex.popup.defaultOptions.url) ? $.alopex.popup.defaultOptions.url : $.alopex._navigationCofig.url;
			setting.url = _urlFixer(setting.url, setting.data); // $a.navigate.setup으로 정의된 url정보를 같이 사용.

			// IE9 에서 array JSON 데이터 전송시 이상현상 발생하므로 data는 stringify 해서 넘긴다.
			if (setting.data) {
				setting.data = JSON.stringify(setting.data);
			}
			$.alopex.popup.config[setting.id] = setting;
			if (setting.windowpopup) { // window open으로 띄우기
				_WindowOpen(setting, base);
			} else {
				return _DialogOpen(setting, base);
			}
		},

		/**
		 * 현재 팝업창을 종료하는 함수. (popup 윈도우 내 스크립트 에서 실행)
		 * window popup과 iframe이 감싸줘 있는 경우, open 함수 실행 시점과 close 함수 호출 시점의 context가 달라진다.
		 * 
		 * @param data
		 *            popup창을 띄운 윈도우의 콜백함수의 인자로 전달됩니다.
		 */
		close: function(data) { 	
			var config;
			// opener가 있을때 window 팝업창 닫기
			if (isAlopexWindowPopup() && window.opener.$.alopex.popup.children.length != 0) {

				// window popup & iframe내에서
				config = window.opener.$.alopex.popup.config[_id]; // callback 함수 찾기 위해.
//				if (config && $.isFunction(config.callback)) {
//					config.callback(data); // TODO 이 부분도 x 버튼으로 닫힐 때 호출되도록 처리. 
//				}
				$.alopex.popup.result = data; //TODO
				//closeChildren(window.opener.$.alopex.popup.children);
				window.name = '';
				window.close();
			} else {
				if(checkAlopexWindowParent()){
					// 다이얼로그를 찾아서 닫기
					if(window !== window.parent) {
						$ = window.parent.$; // close 할때도 부모에 붙어잇는 jquery를 참조하여야지 dialog 로직이 정상적으로 동작.
						window.parent.$.alopex.popup.result = data;
					} else {
						$.alopex.popup.result = data;
					}
					
					var $activeDialogEl = null;
					
					$.each($(window.parent.document).find('[id*="Alopex_Popup_"]'), function(i, ele) {
						ele = $(ele);
						if($activeDialogEl == null) {
							$activeDialogEl = ele;
						} else{
							if(ele.css('z-index') > $activeDialogEl.css('z-index')) {
								$activeDialogEl = ele;
							}
						}
					});
					
					// 20160818 ESH 부모>자식팝업>손자팝업에서 손자팝업 데이터를 클로즈 콜벡 > 자식팝업으로, 자식 클로즈 시 부모로 전달하면
					// $activeDialogEl.close(); setTimeout 시점 차 때문에 손자 데이터가 null로 부모에 정확히 전달 안됨
					// >>> prop에 한번 더 넣어주고 setting.callback 호출 시 2군데 확인 후 데이터 전달
					$activeDialogEl.prop('callbackData', data);
					
					config = $activeDialogEl.prop('alopexPopupSetting');
					if ($.alopex.util.isValid(config)) {
						
						if(config.beforeCloseHandler && typeof config.beforeCloseHandler === 'function'){
							config.beforeCloseHandler($activeDialogEl[0]);
						}
						
						// dialoglist에서 close 하는 다이얼로그 제거
						if ($.alopex.util.isValid(window.parent.$.alopex.widget.dialog.dialoglist)) {
							var arr = window.parent.$.alopex.widget.dialog.dialoglist;
							for (var i = 0; i < window.parent.$.alopex.widget.dialog.dialoglist.length; i++) {
								if (arr[i] == $activeDialogEl[0]) {
									arr.splice(i, 1);
								}
							}
						}

						// jquery-1.11.2.js, jquery-1.11.3.js의 dispatch 부분 if ( ret !== undefined ) {
						// 'undefined'이(가) 정의되지 않았습니다  IE 에러 메시지 발생
						// close 이벤트에 딜레이 주고, element remove 타이밍을 늦춘다
						setTimeout(function(){
							$activeDialogEl.close();
						}, 0);
						
						
					    //[2016-10-18]ESH 다중 팝업시 스크롤 이슈 해결.
					    //팝업이 아닌 경우에만 body영역에 스크롤을 재생성 하도록 설정.
						//팝업을 닫는 시점에 body 영역은 팝업이 없으면, 스크롤을 생성 하도록 처리. 
						//($dialog.one('close', function(e)에서 처리)하도록 주석 처리.
						//
						// dialog 닫힐때 scrollTop 위치 세팅
						/*
						var scrollTop = $activeDialogEl[0].scrollTopValue;
						$(window.parent.document.body).css({
							'top' : '',
							'position' : '',
							'width' : ''
						});
						if (window.browser === 'ie' || 
							$.alopex.util.isValid(window.browser) && window.browser.indexOf('Microsoft Internet Explorer') !== -1){
							$(window.parent.document.documentElement).scrollTop(scrollTop);
						} else {
							$(window.parent.document.body).scrollTop(scrollTop);
						}
						*/

						// HESS project Bug Fix. (IE9, IE10에서 iframe 팝업창에서 인풋 텍스트 포커스 간 이후 부모창에 커서 안가는 문제때문에 주석 처리.)
						// $activeDialogEl.remove();
					}
				}
			}
		},
		
	 /**
	 * window.open으로 오픈한 팝업에서 beforeunloadHandlerInParent를 호출합니다.
	 * beforeunload 이벤트 시 close 행위, reload 행위 중 어떤 행위를 수행하는지 판별
     * close 행위일 경우, 모달블럭제거, close콜백 수행, 메모리정리
	 */
		beforeunloadHandlerInParent : function(popupId, parameter){
			
			var _popupId = popupId;
			var _parameter = JSON.stringify(parameter);
			
			// close, reload 둘다 beforeunload 를 통해 후처리 여부 판단하는데, beforeunload 만으로 구분이 안되서
			// setTimeout 후 윈도우 살아있으면 reload, 아니면 close라고 판단
			setTimeout(function(){
				var windows = $.alopex.popup.children;
				var isClosed = true;
				for(var i = 0 ; i < windows.length ; i++){
					try{
						if(windows[i].name === _popupId){
							// 자식창을 새로고침 한 경우
							isClosed = false;
						}
						
//						else{ 
//							 // 자식창을 close 한 경우 ($a.close 로 닫을 경우 window.name = '' 해주기 때문에 if 조건으로 가지 않는다.)
//						}
					}catch(e){
						// catch 로 오는 경우 == 자식창을 close 한 경우
						// IE 10  windows[i].name 에서 [error] Access is Denied 발생
						// Access is Denied 또한 이미 닫힌 윈도우라는 의미
					}
				}
				if(isClosed){
					// Case 1. beforeunload because of window close
					
					var _config = $.alopex.popup.config[_popupId]; // 설정 다시 받아옴.
					if (_config) {
						// unblock
						if (_config.modal) {
							$a.unblock(_popupId);
						}
						
						// callback
						if(_config.callback) {
							try{ // IE의 경우 window.opener를 통해 접근할 경우, 제대로 된 타입이 전달 안됨.. 우선 실행.
								_config.callback.call(window, JSON.parse(_parameter));
							} catch(e){}
						}
					}
					
					// 메모리 정리
					var index = $.inArray(_popupId, $.alopex.popup.names);
					if (index !== -1) {
						$.alopex.popup.names.splice(index, 1);
					}
				}else{
					// Case 2. beforeunload because of window reload
				}
				
			}, 300);
		}
	});


	$.extend($.alopex.popup, {
		setup : function(option) {
			$.extend($.alopex.popup.defaultOptions, option);
		},
		
		/* 팝업 아이디 저장 */
		names : [],
		/* 윈도우 팝업으로 띄울 경우, 자신이 띄운 popup을 저장. 자신이 닫힐 경우, 자신 오픈한 팝업은 같이 종료. */
		children : [],
		/* 팝업 정보 저장소. */
		config: {},
		
		result: null,
		
		/* 팝업 관련된 */
		defaultOptions : {
			/* 팝업 너비 */
			width : parseInt(window.innerWidth * 0.9),
			/* 팝업 높이 */
			height : parseInt(window.innerHeight * 0.9),
			/* 팝업 타입 */
			type : 'blank',
			/* 팝업 가운데 위치 */
			center : true,
			/* 팝업 스크롤 유무 */
			scroll : true,
			/* 팝업 모달뷰 유무 */
			modal : true,
			/* 팝업 창이 접히는 토글 버튼 존재 유무 */
			modalclose : false,
			/* iframe 유무 */
			iframe : true,
			/* 윈도우 팝업으로 띄울 지 여부 */
			windowpopup : false,
			/* 팝업 창이 접히는 토글 버튼 존재 유무 */
			toggle : false,
			/* iframe사용 시 화면 로딩 후 팝업 오픈 or 팝업 오픈 후 화면 로딩*/
			preLoading :  true,
			/* dialog close 전에 수행될 로직*/
			beforeCloseHandler : null
		}
	});
}(jQuery);

/*!
* Copyright (c) 2014 SK C&C Co., Ltd. All rights reserved.
*
* This software is the confidential and proprietary information of SK C&C.
* You shall not disclose such confidential information and shall use it
* only in accordance with the terms of the license agreement you entered into
* with SK C&C.
*
* Alopex Javascript Framework
* alopex-service
*
*/
!function($) {
	
	function getGridKey(grid) {
		var $target = grid.jquery ? grid : $(grid);
		var key;
		if($target.attr('data-bind')) {
			key = $.trim($target.attr('data-bind').replace('grid', '').replace(':', ''));
		} else {
			key = $target.attr('id');
		}
		return key;
	}

	var requestCount = 0;
	function _showProgress(callback) {
		if (requestCount === 0) {
			callback();
		}
		requestCount++;
	}

	/**
	 * @args callback callback이 존재하지 않는 경우, 콜백 호출은 안 하고, count만 처리.
	 */
	function _dismissProgress(callback) {
		requestCount--;
		if (requestCount === 0 && callback) {
			callback();
		}
	}

	var setupConfig = {
		// platform: 'default',
		async : true,
		method: 'POST',
		platform: 'default',
		data : {},
		dataType : 'json',
		requestHeaders : {},
		responseHeaders : {},
		showProgress : function() {
			var progress_option = {
				// "message" : "Loading",
				"cancelable" : false,
				"color" : "grey"
			};
			window.platformUIComponent ? platformUIComponent.showProgressDialog(progress_option) : null;
		},
		dismissProgress : function() {
			window.platformUIComponent ? platformUIComponent.dismissProgressDialog() : null;
		}
	}; // setup함수로 등록된 공통 및 플랫폼 설정 정보를 가지고 있음.
	/**
	 * Service API
	 */
	$.alopex.request = function(id, option) {

		// param 은 개발자 코드단에서만 제공.
		// 공통 및 플랫폼에서 변경하고 싶으면, before 활용.
		if(!option) { option = {};}
		var request = $.extend(true, {id : id}, setupConfig, option);
		request.data = request.interface; 
		
		
		if($.alopex.util.isValid(request.platform)) { // platform data setup
			request.data = $.extend(true, request.data, request[request.platform].interface); 
		}
	
		var ServiceHttp;
		if(typeof Http !== "function" && typeof _legacyHttp === "function") {
			ServiceHttp = _legacyHttp;
		} else {
			ServiceHttp = Http;
		}
		var http = new ServiceHttp();
		  
		// data 추출.
		// data key는 service함수 option에만 정의.
		if(option.data) {
						
			var selectors = $.makeArray(option.data);
			var formRef;
			var gridRef;
			// platform 이 설정되어 있을땐 platform 데이터 처리를 따른다.
			if ($.alopex.util.isValid(request.platform)) {
				formRef = request[request.platform].object;
				gridRef = request[request.platform].grid;
			} else {
				// platform 이 없을땐 global 설정을 따른다.
				formRef = request.object;
				gridRef = request.grid;
			}

			for(var i=0; i<selectors.length; i++) {
				if(typeof selectors[i] == 'function') {
					$.extend(true, request.data, selectors[i].call(request, option));
				} else if(typeof selectors[i] == 'object') {
					$.extend(true, request.data, option.data);
				} else {
					var $el = $(selectors[i]);
					if($el.length <= 0) { continue; }
					var el = $el[0];
					if($el.attr('data-alopexgrid')) {
						var griddata = $.alopex.request.getGridData(el);
						if(griddata.key && griddata.list) {
							var reference = gridRef(griddata, request.data);
							reference.setList(griddata.list);
							
							if($.alopex.util.isValid(griddata.paging)) {
								reference.setCurrentPage(griddata.paging.currentPage);
								reference.setperPage(griddata.list.currentLength);
								reference.setcurrentLength(griddata.paging.perPage);
								reference.settotalLength(griddata.paging.totalLength);
							}
						}
					} else {
						var reference = formRef(el, request.data);
						$.extend(true, reference, $(el).getData());
					}
				}
			}
		}
		
		

		// BEFORE!!!!!!!!!!!!!!!!!!!!!!!!!
		// 순서 : 공통 + 사용자 -> 플랫폼. before 처리.
		if (typeof setupConfig.before == 'function') { // 공통 before
			setupConfig.before.call(request, id, option);
		}
		if (setupConfig.before !== request.before && typeof request.before == 'function') { // 사용자 before
			request.before.call(request, id, option);
		}
		// 플랫폼 before 호출 (어댑터 역할만 수행)
		if (request.platform && request[request.platform] && typeof request[request.platform].before == 'function') {
			request[request.platform].before.call(request, id, option);
		}
		// parameter들이 변환된 이후에 처리.
		if (request.showProgress) {
			_showProgress(request.showProgress);
		}
		
		if(option.array) {
			request.data = option.array;
		}

		if ($.isPlainObject(request.requestHeaders)) {
			$.each(request.requestHeaders, function(header, value) {
				http.setRequestHeader(header, value);
			});
		}

		var entity = {};
		
		// SKT 전송망, Access망 프로젝트용
		// request : querystring / response : json
		// gridData는 querystring으로 만들때 문제가 있어서 일반 스트링으로 보냄
		if($.alopex.util.isValid(request.paramType)){ entity["paramType"] = request.paramType; }
		if($.alopex.util.isValid(request.paramType)){ entity["gridData"] = request.gridData; }
		
		entity["url"] = $.isFunction(request.url) ? request.url.call(request, id, option):request.url;
		entity["method"] = $.isFunction(request.method) ? request.method.call(request, id, option) : request.method;
		entity["onBody"] = ((String(request.method).toUpperCase() === "POST") ? true : false);
		entity["async"] = request.async;
		entity["dataType"] = $.isEmptyObject(request.dataType) ? 'json' : request.dataType  ;
		entity["jsonp"] = request.jsonp;
		
		// parameter들이 변환된 이후에 처리.
		entity["content"] = (typeof request.data == 'object') ? JSON.stringify(request.data) : String(request.data);
		if (String(request.method).toUpperCase() === "GET" && $.isPlainObject(request.data) && !$.isEmptyObject(request.data)) {
			entity["url"] += "?" + $.param(request.data);
		}
		if (entity["async"]) {
			http.setTimeout(request.timeout || 30000);
		}
		if (window.deviceJSNI) {
			http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		}
		http.request(entity, 
		    (function(option, req){ // 이 부분은 멀티 서비스 호출 시 option 값 보존을 위해 필요.
					return function(res) {
//          req.responseText = res.response;//original data. parsing은 platform before processor의 처리내용.
            req.response = res.response;
            req.responseHeaders = res.responseHeader;
            req.http = res;
//            try{ 
//              req.response = JSON.parse(req.responseText); // response : json object 
//            }catch(e) {
//              req.isSuccess = false;
//              res.errorCode = 'E01';
//              res.errorText = '유효하지 않은 JSON파일입니다.';
//            }
						
						// platform after 호출. (변환)
						if(req.platform && req[req.platform] && typeof req[req.platform].after == 'function') {
							req[req.platform].after.call(req, req.response);
						}
						if(req.isError) return; // .NET 만 적용
						if(req.isSuccess !== false && typeof setupConfig.after == 'function') {
							setupConfig.after.call(req, req.response);
						}
						if(req.isSuccess !== false && setupConfig.after !== req.after && typeof req.after == 'function') {
							req.after.call(req, req.response);
						}
						
						if(req.showProgress) {// showPrgoress가 호출된 경우에만, dismiss 처리.
							var callback = req.dismissProgress;
							_dismissProgress(callback);
						}
						
						if (req.isSuccess === false) {	// fail
							if(req.platform && req[req.platform] && typeof req[req.platform].fail == 'function') {
								req[req.platform].fail.call(req, req.response);
							}
							if(typeof setupConfig.fail == 'function') {
								setupConfig.fail.call(req, req.response);
							}
							if(setupConfig.fail !== req.fail && typeof req.fail == 'function') {
								req.fail.call(req, req.response);
							}
						} else {	// success
							function setData(req, success) {
								var selectors = $.makeArray(success);
								var formRef;
								var gridRef;
								// platform 이 설정되어 있을땐 platform 데이터 처리를 따른다.
								if($.alopex.util.isValid(request.platform)) { 
								  formRef = req[req.platform].object;
								  gridRef = req[req.platform].grid;
								} else {
								  // platform 이 없을땐 global 설정을 따른다.
								  formRef = req.object;
								  gridRef = req.grid;
								}
								
								for(var i=0; i<selectors.length; i++) {
									if(typeof selectors[i] == 'function') {
										selectors[i].call(req, req.response);
									} else {
										var $el = $(selectors[i]);
										if($el.length <= 0) {continue;}
										var el = $el[0];
										if($el.attr('data-alopexgrid')) {
											var reference = gridRef(el, req.response);
											$(el).alopexGrid('dataSet', reference.list, (reference.list && reference.list.length > 0 && $.alopex.util.isValid(reference.currentPage) && reference.currentPage > 0)? {
											  current: reference.currentPage,
												perPage: reference.perPage,
												dataLength: reference.totalLength
											} : undefined);
										} else {
											var reference = formRef(el, req.response);
											$el.setData(reference);
										}
									}
									
								}
							}
							if(req.platform && req[req.platform] && req[req.platform].success) {
								setData(req, req[req.platform].success);
							}
							if(setupConfig.success) {
							  setData(req, setupConfig.success);
							}
							if(setupConfig.success !== req.success && req.success) {
							  setData(req, req.success);
							}
						}

						delete req.response;
						delete res.response;
						delete req;
						delete res;
						
						req = null;
						res = null;
					};
				})(option, request),
				(function(option, req) {
          return function(res) {
            
            // erroCallback 호출.
//            req.originalResponse = res.responseText;
            
						req.responseHeaders = res.responseHeader;
						req.data = res.status;
						req.status = res.status;
						req.statusText = res.statusText;
						if(req.showProgress) {// showPrgoress가 호출된 경우에만, dismiss 처리.
							var callback = req.dismissProgress;
							_dismissProgress(callback);
						}
						if(req.platform && req[req.platform] && typeof req[req.platform].error == 'function') {
						  req[req.platform].error.call(req, res);
						}
						if(typeof setupConfig.error == 'function') {
						  setupConfig.error.call(req, res);
						}
						if(setupConfig.error !== req.error && typeof req.error == 'function') {
						  req.error.call(req, res);
						}

						delete req.response;
						delete res.response;
						delete req;
						delete res;
						
						req = null;
						res = null;
					};
				})(option, request));
	};

	// setup API 
	$.extend($.alopex.request, {
		setup: function() {
			if(typeof arguments[0] == 'string') { // platform setup
				if(setupConfig[arguments[0]]) {
					$.extend(true, setupConfig[arguments[0]], arguments[1]);
				} else {
					setupConfig[arguments[0]] = arguments[1];
				}
				
			} else {
				$.extend(true, setupConfig, arguments[0]);
			}
		},
		setupConfig: setupConfig,
		register: (($.alopex.services)? $.alopex.services: undefined),
		sendRegistered: (($.alopex.services)? $.alopex.services.send: undefined),
		
		prototype: {},
		
		getGridData: function (grid) {
			var key = getGridKey(grid);
			var $target = grid.jquery ? grid : $(grid);
			var list = AlopexGrid.trimData($target.alopexGrid('dataGet', {_state: {deleted: true}}, {_state: {edited: true}}, {_state: {added: true}}));
			var pageinfo = $target.alopexGrid('pageInfo');
			return {
				key: key,
				list: list,
				paging: {
					currentPage: pageinfo.current,
					currentLength: list.length,
					perPage: pageinfo.perPage,
					totalLength: pageinfo.dataLength
				}
			};
		},
		setGridData: function(grid, data) {
    }
	});
	
	/**
	 * 메타 처리하는 부분은 service core 부분으로 처리.
	 * 사용자가 커스터마이징 할 부분이 별로 없음.
	 */

	/**
	 * platform : 어댑터 정의. 
	 * 이 영역에는 설정 정보 없음.
	 * 어댑터 형태의 전환만 설정.
	 */
	$.alopex.request.setup('default', { // platform
		interface : {},
		grid : function(elem, data) {
			var key;
			if ($.alopex.util.isValid(elem.key)) {
				key = elem.key;
			} else {
				key = getGridKey(elem);
			}
			if (!$.alopex.util.isValid(data[key])) {
				data[key] = {};
			}
			return {
				list : data[key].list,
				currentPage : data[key].currentPage,
				perPage : data[key].perPage,
				currentLength : data[key].currentLength,
				totalLength : data[key].totalLength,
				
				setList: function(list) {
					data[key].list = list;
				},
				setCurrentPage: function(page) {
					data[key].currentPage = page;
				},
				setperPage: function(page) {
					data[key].perPage = page;
				},
				setcurrentLength: function(length) {
					data[key].currentLength = length;
				},
				settotalLength: function(length) {
					data[key].totalLength = length;
				},
			};
		},
		object : function(elem, data) {
			return data;
		},
		before : function(id, option) {
			if(option.useServiceId !== false) {
				this.data.serviceId = id;				
			}

		},
		after : function(res) {
		}
	});
	/**
	 * 메타 처리하는 부분은 service core 부분으로 처리. 사용자가 커스터마이징 할 부분이 별로 없음.
	 */
	/**
	 * platform : 어댑터 정의. 
	 * 이 영역에는 설정 정보 없음.
	 * 어댑터 형태의 전환만 설정.
	 */
	$.alopex.request.setup('NEXCORE.J2EE', { // platform
		interface : {
			dataSet : {
				message : {},
				fields : {},
				recordSets : {}
			},
			transaction : {},
			attributes : {}
		},
		object : function(elem, data) {
			return data.dataSet.fields;
		},
		grid : function(elem, data) {
			var key;
			if ($.alopex.util.isValid(elem.key)) {
				key = elem.key;
			} else {
				var bindkey = $(elem).attr('data-bind') ? ($.trim($(elem).attr('data-bind').replace(/\s*grid\s*:/gi, ''))) : undefined;
				key = bindkey || elem.id;
			}
			if (!$.alopex.util.isValid(data.dataSet.recordSets[key])) {
				data.dataSet.recordSets[key] = {};
			}
			return {
				list : data.dataSet.recordSets[key].nc_list,
				currentPage : data.dataSet.recordSets[key].nc_pageNo,
				perPage : data.dataSet.recordSets[key].nc_recordCountPerPage,
				currentLength : data.dataSet.recordSets[key].nc_recordCount,
				totalLength : data.dataSet.recordSets[key].nc_totalRecordCount,
				
				setList: function(list) {
					data.dataSet.recordSets[key].nc_list = list;
				},
				setCurrentPage: function(page) {
					data.dataSet.recordSets[key].nc_pageNo = page;
				},
				setperPage: function(page) {
					data.dataSet.recordSets[key].nc_recordCountPerPage = page;
				},
				setcurrentLength: function(length) {
					data.dataSet.recordSets[key].nc_recordCount = length;
				},
				settotalLength: function(length) {
					data.dataSet.recordSets[key].nc_totalRecordCount = length;
				},
			};
		},
		before : function(id, option) {
			// 헤더 추가.
			this.requestHeaders["Content-Type"] = "application/json; charset=UTF-8";
			this.data.transaction.id = id;
		},
		after : function(res) {
			// J2EE 프레임워크를 사용해도, 성공/실패 로직은 프로젝트마다 다름.
			// 공통 after 쪽에서 처리.
			//			try{
			//				if(res.dataSet.message.result == 'OK') { // 실패 체크.
			//					this.isSuccess = true;
			//				} else {
			//					this.isSuccess = false;
			//				}
			//			} catch(e) {
			//				this.isSuccess = false;
			//			} 
		}
	});
	
	/**
	 * platform : 어댑터 정의. 
	 * 이 영역에는 설정 정보 없음.
	 * 어댑터 형태의 전환만 설정.
	 */
	$.alopex.request.setup('NEXCORE.NET', { // platform
		interface : {
			request : {
				ServiceType : {}, // 서비스 타입
				ServiceName : {}, // 서비스 명
				ServiceData : {
					DataSet : {
						DataSetName : {},
						Tables : [] // grid 데이터
					},
					Hashtable: {} // form 데이터
				}
			}
		},
		object : function(elem, data) {
			return data.request.ServiceData.Hashtable;
		},
		grid : function(elem, data) {
			var key;
			if ($.alopex.util.isValid(elem.key)) {
				key = elem.key;
			} else {
				key = getGridKey(elem);
			}
			var Tables = data.request.ServiceData.DataSet.Tables;
			var gridData = null;
			$.each(Tables, function(i, v){
				if(v.TableName === key) gridData = v;
			});
			if(gridData === null){
				gridData = { "TableName" : key };
				Tables.push(gridData);
			}

			return {
				list : gridData.Rows,
				currentPage : gridData.PageSize,
				perPage : gridData.RowspPage,
				currentLength : gridData.RowsLength,
				totalLength : gridData.TotalRowsLength,
				
				setList: function(list) {
					gridData.Rows = list;
				},
				setCurrentPage: function(currentPage) {
					gridData.PageSize = currentPage;
				},
				setperPage: function(perPage) {
					gridData.RowspPage = perPage;
				},
				setcurrentLength: function(currentLength) {
					gridData.RowsLength = currentLength;
				},
				settotalLength: function(totalLength) {
					gridData.TotalRowsLength = totalLength;
				}
			};
		},
		before : function(id, option) {
			// 헤더 추가.
			this.requestHeaders["Content-Type"] = "application/json; charset=UTF-8";
			this.data.request = JSON.stringify(this.data.request);
		},
		after : function(res) {
			try{
				this.response = JSON.parse(res.d);
			}catch(err){
				this.http.errorInfo = "JSON.parse() error : responseText = " + res.d;
				if($.alopex.util.isValid(err.message)) this.http.errorMessage = err.message;
				if($.alopex.util.isValid(err.name)) this.http.errorName = err.name;
				if($.alopex.util.isValid(err.stack)) this.http.errorStack = err.stack;
					
				this.isError = true;
				this.http.errorCallback(this.http);
				delete this.http;
			}	          	  
//			NEXCORE.NET 프레임워크를 사용해도, 성공/실패 로직은 프로젝트마다 다를 수 있으니 공통 after 쪽에서 처리
//			
//						try{
//							if(res.dataSet.message.result == 'OK') { // 실패 체크.
//								this.isSuccess = true;
//							} else {
//								this.isSuccess = false;
//							}
//						} catch(e) {
//							this.isSuccess = false;
//						} 
		}
	});
}(jQuery);
//
//!function($) {
//
//	/**
//	 * 공통 설정 부분.
//	 * before : 전처리, 
//	 * after : success 판단 여부 처리 
//	 * success : 성공 시 공통으로 처리해주는 후처리. 
//	 * url : "" or function() {return "http://localhost:9000";}
//	 * method : "GET" or "POST" or function() { return "GET";}
//	 */
//	$.alopex.request.setup({
//		platform: 'NEXCORE.J2EE',
//		//url : "http://150.28.65.2:7001/web/stand.jmd",
//		/* 조건에 따라 다른 url에 지정이 가능하다. */
//		url: function() {
//			if(true){
//				return "http://150.28.65.2:7001/web/stand.jmd";
//			}
//			return 'dddd'
//		},
//		//*/
//		method : "POST",
//		timeout: 3000,
//		before : function(id, option) { // before
//			// 전처리기.
//			$('body').progress(); //progress bar 시작
//		},
//		after : function() {
//			// response 받아서 여기서 성공판단.
//			log('after ==== ');
//			$('body').progress().remove();  //progress 종료
//		},
//		success : function() {
//			
//		},
//		fail: function(res) {
//			$('body').progress().remove();  //progress 종료
//			log('errorcode = ', res);
//			alert( ' FAIL! ' ); 
//		},
//		error  : function() {
//			$('body').progress().remove();  //progress 종료
//			log('errorcode = ' + this.status + ' message = ' + this.statusText);
//			alert( ' Error! ' ); 
//			
//		}
//	});
//}(jQuery);

/*!
* Copyright (c) 2014 SK C&C Co., Ltd. All rights reserved.
*
* This software is the confidential and proprietary information of SK C&C.
* You shall not disclose such confidential information and shall use it
* only in accordance with the terms of the license agreement you entered into
* with SK C&C.
*
* Alopex Javascript Framework
* alopex-service
*
*/
!function($) {
	
	function extendProperty(to, from) {
		$.each(from, function(key, value) {
			if (!$.isFunction(value) && from.hasOwnProperty(key)) {
				to[key] = $.isPlainObject(value) ? $.extend(true, {}, value) : value;
			}
		});
	}
	var rcallbackKey = /^(?:before|after|success|fail|error)/i;
	var __id = (Math.random() * 100) | 0;
	function randstr() {
		return "alopexservice" + (__id++);
	}
	function populatePrototype() {
		$.each($.alopex.service, function(prop, val) {
			//TODO fix logic
			if ($.alopex.service.hasOwnProperty(prop) && $.isFunction(val)) {
				$.alopex.service[prop] = $.alopex.service.prototype[prop] = val;
				//$.alopex.service.plugin(prop, val);
			}
		});
	}
	function processorKeyword(value) {
		return value === true || value === "pre" || value === "meta" || value === "post";
	}
	function doChaining(context, chain, args) {
		if (!$.isArray(chain))
			return;
		var metaProcessor = [];
		var preProcessor = [];
		var postProcessor = [];
		var proceed = true;
		$.each(chain, function(idx, item) {
			if ($.isArray(item) && processorKeyword(item[0]) && $.isFunction(item[1])) {
				if (item[0] === true || item[0] === "meta") {
					metaProcessor.push(item[1]);
				} else if (item[0] === "pre") {
					preProcessor.push(item[1]);
				} else if (item[0] === "post") {
					postProcessor.push(item[1]);
				}
			}
		});
		proceed && $.each(preProcessor, function(idx, p) {
			if (p.apply(context, $.isFunction(args) ? args(context) : args) === false) {
				proceed = false;
				return false;
			}
		});
		proceed && $.each(chain, function(idx, item) { // 이전 버전에서 chain & metaProcessor를 분리하였으나, 다시 E&S버전으로 롤백.
			if ($.isFunction(item)) {
				if (item.apply(context, $.isFunction(args) ? args(context) : args) === false) {
					proceed = false;
					return false;
				}
			} else if ($.isArray(item) && item[0] !== true) {
				for ( var i = 0, l = metaProcessor.length; i < l; i++) {
					if (metaProcessor[i].apply(context, item) === false) {
						proceed = false;
						return false;
					}
				}
			}
		});
		proceed && $.each(postProcessor, function(idx, p) {
			if (p.apply(context, $.isFunction(args) ? args(context) : args) === false) {
				procees = false;
				return false;
			}
		});
		return proceed;
	}

	function addToChain(chain, value, forcePriority) {
		//value의 가능한 형태
		//function
		//[function]
		//[true,function]
		//[[function,function..],[true,function]]
		if ($.isFunction(value)) {
			chain.push(value);
		} else if ($.isArray(value)) {
			if (processorKeyword(value[0]) && $.isFunction(value[1])) {
				chain.push(value);
			} else if (typeof value[0] === "string") {
				chain.push(value);
			} else {
				for ( var i = 0, l = value.length; i < l; i++) {
					addToChain(chain, value[i]);
				}
			}
		} else if ($.isPlainObject(value)) {
			chain.push(value);
		}
		return;
	}
	/**
	 * Star Alopex Service Constructor
	 * 
	 * var newservice = new $a.service();
	 * newservice.service(id, data, success, fail, error);
	 * 
	 * $a.service(id, data, success, fail, error);
	 */
	$.alopex.service = function(copy) {
		var self = this;
		if (self instanceof $.alopex.service && !self.alopexservice) { //new로 호출됨.
			self.alopexservice = randstr();
			self.settings = {
				success: [],
				fail: [],
				error: []
			};
			self.request = {};//before영역. before함수들의 this가 된다.
			self.response = {};//after영역. after함수들의 this가 된다.
			//.service()가 호출되는 시점에 $.alopex.service의 property를 가져와야 한다. 
			//extendProperty(self.request, $.alopex.service);
			self.request.chain = [];//before chain. 플랫폼 기본체인 호출 후 적용이 된다.
			self.response.chain = [];//after chain

			if (copy && copy.alopexservice) {
				extendProperty(self.settings, copy.settings);
			}
			if (copy && copy.request && $.isArray(copy.request.chain)) {
				self.request.chain = self.request.chain.concat(copy.request.chain);
			}
			if (copy && copy.response && $.isArray(copy.response.chain)) {
				self.response.chain = self.response.chain.concat(copy.response.chain);
			}

		} else { //일반 함수로 호출 
			self = new $.alopex.service();
			if (arguments[0] !== $.alopex && arguments.length) {
				self.service.apply(self, arguments);
			}
		}
		populatePrototype();
		return self;
	};
	$.extend($.alopex.service, {
		settings: {
			platform: "GENERIC",
			url: "",
			method: "GET",
			async:true,
			before: [],
			after: [],
			success: [],
			fail: [],
			error: []
		},
		fix: function(inst) {
			//prototype exposure
			populatePrototype();
			//instance fix
			return (inst && inst.alopexservice) ? inst : new $.alopex.service();
		},
		clone: function() {
			if (this.alopexservice) {
				return new $.alopex.service(this);
			} else {
				return new $.alopex.service();
			}
		},
		/**
		 * Star Alopex Service Setup
		 * 
		 * $a.service.setup({
		 *   platform : "NEXCORE.J2EE",
		 *   url : "/service",
		 *   ...
		 * });
		 * $a.service.setup({
		 *   "PlatformName" : {
		 *     platform : true,
		 *     setting1 : "value1",
		 *     setting2 : "value2",
		 *     before : [],
		 *     after : []
		 *   }
		 * });
		 */
		setup: function(o) {
			var self = this;
			if ($.isPlainObject(o)) {
				self.settings = self.settings || {};
				$.each(o, function(key, value) {
					if (value === undefined || value === null) {
						delete self.settings[key];
						if(rcallbackKey.test(key)) {
							self.settings[key] = [];
						}
					} else if (rcallbackKey.test(key)) {
						addToChain(self.settings[key], value);//to global or to instance
					} else if ($.isPlainObject(value) && (value.platform === true)) {
						if (!$.alopex.service[key] || !$.alopex.service[key].alopexservice) {
							$.alopex.service[key] = new $.alopex.service();
						}
						//before : function
						//before : [true, function]
						//before : [function, [], function, []]
						$.each(value, function(k, v) {
							if (k !== "before" && k !== "after" && k !== "platform" && k !== "success" && k !== "fail" && k !== "error") {
								$.alopex.service[key].settings[k] = v;
							}
						});
						$.each(["after", "before", "success", "fail", "error"], function(idx, f) {
							value[f] ? $.alopex.service[key][f](value[f]) : "";
						});
					} else {
						self.settings[key] = value;
					}
				});
			}
			return self;
		},
		/**
		 * 사용자가 .service()를 호출하기전 실행하고자 하는 콜백함수 등록
		 * function callback(id, data, success, fail, error) {
		 *   var request = this;
		 *   request.data = data
		 *   ...
		 * }
		 */
		before: function(callback) {
			var self = $.alopex.service.fix(this);
			addToChain(self.request.chain, $.makeArray(arguments));
			return self;
		},
		/**
		 * 사용자가 .service()를 호출하고 데이터가 수신되었을 때 실행하고자 하는 콜백함수 등록
		 * function callback(data, headers) {
		 *  var response = this;
		 *  response.data = JSON.parse(response.responseText);
		 *  response.success = true;//설정여부에 따라 success/fail callback 호출.
		 * }
		 */
		after: function(callback) {
			var self = $.alopex.service.fix(this);
			addToChain(self.response.chain, $.makeArray(arguments));
			return self;
		},
		/**
		 * 
		 */
		success: function(callback) {
			var self = $.alopex.service.fix(this);
			addToChain(self.settings.success, $.makeArray(arguments));
			return self;
		},
		/**
		 * 
		 */
		fail: function(callback) {
			var self = $.alopex.service.fix(this);
			addToChain(self.settings.fail, $.makeArray(arguments));
			return self;
		},
		/**
		 * 
		 */
		error: function(callback) {
			var self = $.alopex.service.fix(this);
			addToChain(self.settings.error, $.makeArray(arguments));
			return self;
		},
		/**
		 * service 호출
		 */
		service: function(id, data, success, fail, error) {
			var self = $.alopex.service.fix(this);
			var args = $.makeArray(arguments);
			//self.request for before
			//self.response for after
			//platform chain
			var request = {
				data: null,
				headers: {}
			};
			var response = {
				data: null,
				headers: {}
			};
			//글로벌설정 가져옴
			extendProperty(request, $.alopex.service.settings);
			//플랫폼설정을 가져옴
			var platform = request.platform;
			extendProperty(request, self.settings);
			//글로벌 설정에 의거한($.alopex.service.platform)플랫폼 설정 가져옴
			//인스턴스 설정 가져옴
			extendProperty(request, self.request);
			request.chain = [];
			//Before Chaining Order : "[GlobalSetup -> UserChain] -> PlatformBefore" per every priority 
			request.chain = request.chain
				.concat(request.before || [])
				.concat(self.request.chain || [])
				.concat($.alopex.service[request.platform].request.chain || []);
			if (doChaining(request, request.chain, args) === false) {
				return false;
			}

			//platform = request.platform;
			response.request = request;
			response.chain = [];
			//After Chaining Order : "PlatformAfter -> [GlobalSetup -> UserChain]" per every priority
			response.chain = response.chain
				.concat($.alopex.service[platform].response.chain || [])
				.concat(request.after || [])
				.concat(self.response.chain || []);
			var ServiceHttp;
			if(typeof Http !== "function" && typeof _legacyHttp === "function") {
				ServiceHttp = _legacyHttp;
			} else {
				ServiceHttp = Http;
			}
			var http = new ServiceHttp();
			var entity = {};
			entity["url"] = $.isFunction(request.url) ? request.url.apply(request, args):request.url;
			entity["method"] = $.isFunction(request.method) ? request.method.apply(request, args) : request.method;
			entity["onBody"] = ((String(request.method).toUpperCase() === "POST") ? true : false);
			entity["content"] = $.isPlainObject(request.data) ? JSON.stringify(request.data) : String(request.data);
			entity["async"] = request.async;
			
			if(String(request.method).toUpperCase() === "GET" && $.isPlainObject(request.data) && !$.isEmptyObject(request.data)) {
				entity["url"] += "?" + $.param(request.data);
			}
			if ($.isPlainObject(request.headers)) {
				$.each(request.headers, function(header, value) {
					http.setRequestHeader(header, value);
				});
			}
			if (entity["async"]) {
			  http.setTimeout(request.timeout || 30000);
			}
			var progress_option = {
				//"message" : "Loading",
				"cancelable": false,
				"color": "grey"
			};
			window.platformUIComponent ? platformUIComponent.showProgressDialog(progress_option) : null;
			if(window.deviceJSNI) {
				http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
			}
			http.request(entity, 
				(function(self, response, success, fail, error){
					return function(res) {
						var platform = response.request.platform;
//          response.responseText = res.response;//original data. parsing은 platform before processor의 처리내용.
            response.response = res.response;
            
						response.headers = res.responseHeader;
						if ($.isArray(response.chain)) {
							doChaining(response, response.chain, function(res) {
								return [res.data, res.headers];
							});
						}
						window.platformUIComponent ? platformUIComponent.dismissProgressDialog() : null; // callback 호출되기 이전에 progress 없애기. callback에서 또다른 서비스 호출 존재 시 문제됨.
						if (response.success === false) {
							//var fails = [].concat(response.callback.fail).push(fail);
							//플랫폼공통 -> [글로벌공통 -> 사용자지정] 순서.
							doChaining(response, [].concat($.alopex.service[platform].settings.fail).concat($.alopex.service.settings.fail).concat(self.settings.fail), [response.data, response.headers]);
							$.isFunction(fail) ? fail.call(response, response.data, response.headers) : "";
						} else {
							doChaining(response, [].concat($.alopex.service[platform].settings.success).concat($.alopex.service.settings.success).concat(self.settings.success), [response.data, response.headers]);
							$.isFunction(success) ? success.call(response, response.data, response.headers) : "";
						}
					};
				})(self, response, success, fail, error), 
				(function(self, response, success, fail, error){
					return function(res) {
						var platform = response.request.platform;
						response.originalResponse = response.responseText;
						response.data = res.status;
						response.status = res.status;
						response.statusText = res.statusText;
						doChaining(response, [].concat($.alopex.service[platform].settings.error).concat($.alopex.service.settings.error).concat(self.settings.error), [response.data, response.headers]);
						$.isFunction(error) ? error.call(response, response.data, response.headers) : "";
						if (!error) {
							doChaining(response, [].concat($.alopex.service[platform].settings.fail).concat($.alopex.service.settings.fail).concat(self.settings.fail), [response.data, response.headers]);
							$.isFunction(fail) ? fail.call(response, response.data, response.headers) : "";
						}
						window.platformUIComponent ? platformUIComponent.dismissProgressDialog() : null;
					};
				})(self, response, success, fail, error));
			return self;
		},
		prototype: {}
	});
}(jQuery);

(function($) {
	/**
	 * GENERIC 기본 설정.
	 */
	$.alopex.service.setup({
		"GENERIC" : {
			platform:true,
			before:[
				function(id,data,success,fail,error){
					var request = this;
					request["data"] = $.extend(true, {}, request["data"] , data);
					request["url"] = request["url"] || id;
				},
				[true, function(metas){
					var request = this;
					if(!metas) return;
					if(!$.isArray(metas)) {
						metas = $.makeArray(arguments);
					}
					$.each(metas,function(idx,meta) {
						var $target = $(meta);
						if(!$target.length) return;
						var model = $.alopex.datamodel(meta, true).get();
						request["data"] = $.extend(true, {}, request["data"], model);
					});
				}]
			],
			after:[function(data,headers){
				var response = this;
				try {
					response["data"] = JSON.parse(response.responseText);
				} catch (e1) {
					try {
						if (window.DOMParser) {
							var parser = new DOMParser();
							var xmlDoc = parser.parseFromString(response.reponseText, "text/xml");
						} else { // Internet Explorer
							var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
							xmlDoc.async = false;
							xmlDoc.loadXML(response.reponseText);
						}
						response["data"] = response.responseText;
					} catch (e2) {
						response["data"] = response.responseText;
						response["success"] = false;
					}
				}
			}],
			success:[
			[true, function(metas){
				var response = this;
				if(!response.data || !metas) return;
				if(!$.isArray(metas)) {
					metas = $.makeArray(metas);
				}
				$.each(metas, function(idx, meta) {
					var $target = $(meta);
					if(!$target.length) return;
					$.alopex.databind(response.data, meta);
				});
			}]
			]
		}
	});
})(jQuery);
	
(function($) {	
	/**
	 * J2EE 설정.
	 */
	$.alopex.service.setup({
		"NEXCORE.J2EE" : {
			platform : true,
			before : [function(id, data, success, fail, error) { // data
				// parameter 생성.
				this.data["transaction"] = {
					"id" : id
				};
				this.headers = {
					"Content-Type" : "application/json; charset=UTF-8"
				};
			}],
			after : [function(data, headers) { // 플랫폼 별로 다른 형태 타입이 올떄 처리.
				var response = this;
				var data = {};
				try {
					data = JSON.parse(response.responseText);
					if (data) {
						response.originalResponse = data;
					}
					if (data && data.dataSet) {
						response.data = data.dataSet;
					}
				} catch (e) {
					response.success = false;
				}
			}, function(data, headers) { // J2EE 에러 처리.
				var response = this;
				if (response.data && response.data.message) {
					if (response.data.message.result !== "OK") {
						response.success = false;
					}
				}
			}]
		}
	});
})(jQuery);


(function($) {
	/**
	 * .NET 서비스호출 설정 $a.service('skcc.net.type#serviceName', {key:value,
	 * key:value}, success,fail,error) dataset(table)전송은?
	 * $a.service.before({"table1":[{},{},{},{}],"tablemeta":10,...})
	 * .before('#grid1') .before({"table2":'#grid2'})
	 * .service('skcc.net.type#serviceName', {key:value, key:value}, ...)?
	 */
	$.alopex.service.setup({
		"NEXCORE.NET" : {
			platform : true,
			before : [function(id, data, success, fail, error) {
				// 클라이언트 레벨에서 J2EE 스펙 기준으로 작업한 부분이
				// 나중에 변경.
				var _comm_param = $.extend(true, {}, this.data.dataSet);
				var _net_param = {
					DataSet : {
						DataSetName : "DataSetName",
						Tables : []
					},
					Hashtable : {}
				};

				this.data = {};
				this.data.request = {};
				// .NET 플랫폼에서 id를 사용하여,
				// id = svcAdapter[id] || id;
				if (id.indexOf('#') == -1) { // ServiceId 사용
					this.data.request["ServiceId"] = id;
				} else if (id.split('#').length == 2) {
					this.data.request["ServiceType"] = String(id.split('#')[0]);
					this.data.request["ServiceName"] = String(id.split('#')[1]);
				} else {
					alert('Service 함수의 TransactionId 값이 유효하지 않습니다.')
					return false;
				}
				// recordSets -> dataset
				for ( var i in _comm_param.recordSets) {
					if (_comm_param.recordSets.hasOwnProperty(i)) {
						// var rs = _comm_param.recordSets[i];
						recordSetsToDataSet(i, _comm_param.recordSets, _net_param);
					}
				}

				// fields -> hashtable
				$.extend(_net_param.Hashtable, _comm_param.fields);

				// .NET 용으로 _ENCODE 해준다.
				this.data.request.ServiceData = _net_param;
				this.data.request = _ENCODE(this.data.request);

			}],
			after : [function(data, headers) {
				// 하는 역할: decode 데이터 및 InvokeSer, success 여부 판단,
				var response = this;
				var data = {};
				try {
					data = JSON.parse(response.responseText);
					data["InvokeServiceResult"] = _DECODE(data["InvokeServiceResult"]);
					//
					// 사용.
					response.originalResponse = data;
					// response.success =
					// isSuccess(data["InvokeServiceResult"]);
				} catch (e) {
					response.success = false;
				}
			}, function(data, headers) {
				var response = this;
				if (response.success !== false) {
					var data = {
						"fields" : {},
						"recordSets" : {}
					};
					var orgdata = response.originalResponse["InvokeServiceResult"];
					// Key-value성 데이터 처리
					$.extend(true, data["fields"], orgdata["Hashtable"]);

					// page 정보가 hashtable에 저장됨.
					orgdata["Object"] ? (data["fields"]["Object"] = orgdata["Object"]) : 0;
					// list성 데이터 처리
					if (orgdata["DataTable"] && !$.isEmptyObject(orgdata["DataTable"])) {
						addTableToRecordSets(orgdata["DataTable"], data);
					}
					if (orgdata["DataSet"] && $.isArray(orgdata["DataSet"]["Tables"])) {
						$.each(orgdata["DataSet"]["Tables"], function(idx, tableObject) {
							addTableToRecordSets(tableObject, data);
						});
					}
					// 최종데이터기록
					response.data = data;
				} else {
					response.data = response.originalResponse["InvokeServiceResult"];
				}

			}]
		}
	});
	
	// .NET의 datatable의 데이터를 dataset 내의 recordsets에 저장.
	// 
	function addTableToRecordSets(tableObject, dataset) {
		if (!$.isPlainObject(tableObject) || $.isEmptyObject(tableObject) || !$.isPlainObject(dataset) || !$.isPlainObject(dataset["recordSets"])) {
			return;
		}
		var name = tableObject["TableName"];
		var list = tableObject["Rows"];
		if (!name || !$.isArray(list)) {
			return;
		}
		var recordCoun
		dataset["recordSets"][name] = {
			"nc_list" : list
		};
		if (dataset["fields"]["nc_rowCount_" + name]) { // paging 관련 정보가 존재하는
		// 경우.
		// TODO 이름 수정 필요.(이진우 과장님한테 이름 픽스필요).
			var recordset = dataset["recordSets"][name];
			if(dataset["fields"]["nc_rowCount_" + name] > 0) {
				recordset["nc_recordCount"] = list.length;
				recordset["nc_pageNo"] = dataset["fields"]["nc_pageNum_" + name];
				recordset["nc_recordCountPerPage"] = dataset["fields"]["nc_rowCount_" + name];
				recordset["nc_totalRecordCount"] = dataset["fields"]["nc_totalRowCount_" + name];
			}
		}
	}
	function recordSetsToDataSet(key, recordSets, dataSets) {
		var rs = recordSets[key];
		dataSets.DataSet.Tables.push({
			TableName : key,
			Rows : rs.nc_list
		});

		dataSets.Hashtable["nc_pageNum_" + key] = rs.nc_pageNo;
		dataSets.Hashtable["nc_???_" + key] = rs.nc_recordCount;
		dataSets.Hashtable["nc_rowCount_" + key] = rs.nc_recordCountPerPage;
		dataSets.Hashtable["nc_totalRowCount_" + key] = rs.nc_totalRecordCount;
	}
	// .NET 프레임워크와 통신 스펙 맞추기 위해 URI encoding 처리.
	function _ENCODE(obj) {
		return encodeURIComponent(JSON.stringify(obj));
	}
	/**
	 * .NET 플래폼에서 인코딩된 패킷을 디코드하고, 오브젝트로 리턴.
	 */
	function _DECODE(str) {
		return JSON.parse(decodeURIComponent(str));
	}
	
})(jQuery);


(function($) {
	// 모든 플랫폼이 공통으로 사용하는 로직.
	// 비즈니스 단에서는 해당 로직이 공통으로 사용됨.
	$.alopex.service.setup({
		before : [function(id, data, success, fail, error) { // data
			// parameter 생성.
			this.data = {};
			this.data["attributes"] = {};
			this.data["dataSet"] = {
				"fields" : $.extend(true, {}, data),
				"recordSets" : {}
			};
		}, 
		[true, function(metas){
			var request = this;
			if(!metas) return;
			if(!$.isArray(metas)) {
				metas = $.makeArray(arguments);
			}
			// 서비스 전송 전에 추가 바인딩하는 데이터가 있을 경우 data를 조립
			var dataSet = this.data["dataSet"];

			$.each(metas, function(idx, meta) {
				if (typeof meta === "string" || (meta && meta.jquery && meta.prop('nodeType'))) {
					// 일반 form selector이거나 또는 grid selector. grid selector일땐 id를 자동추출한다 또는 일반 엘리먼트이거나 그리드 엘리먼트 이거나
					var $elem = $(meta);
					if (!$elem.length || !$elem.prop('nodeType'))
						return;
					if (!$elem.prop('id')) {
						// 엘리먼트 ID가 없을때엔 향후 bind-extract를 위해 임의의 id를 배정한다.
						$elem.prop(id, randomId());
					}
					if ($elem.attr('data-alopexgrid')) {
						// 그리드일때의 바인딩은 recordSets에서 추출
						dataSet.recordSets = $.extend(true, dataSet.recordSets, {});
						var recordSets = dataSet.recordSets;
						recordSets[$elem.prop('id')] = gridToRecordSet($elem);
					} else {
						// 일반엘리먼트일 때의 바인딩은 fields에서 추출
						dataSet.fields = $.extend(true, dataSet.fields, {});
						elementToFields($elem, dataSet.fields);
					}
				}
				if ($.isPlainObject(meta)) {
					// id가 지정된 grid
					// selector
					var recordSets = response.data.recordSets;
					if (!recordSets) {
						return;
					}
					$.each(meta, function(id, selector) {
						if ($(selector).attr('data-alopexgrid')) {
							dataSet.recordSets = $.extend(true, dataSet.recordSets, {});
							dataSet.recordSets[$elem.prop('id')] = gridToRecordSet($elem);
						}
					});
				}
			});
		}]],
		after : [],
		success : [
			[true, function(metas){
			if(!metas) return;
			if(!$.isArray(metas)) {
				metas = $.makeArray(arguments);
			}
		
			// sample implementation
			var response = this;

			$.each(metas, function(idx, meta) {
				if (typeof meta === "string" || (meta && meta.jquery && meta.prop('nodeType'))) {
					// 일반 form selector이거나 또는
					// grid selector. grid
					// selector일땐 id를 자동추출한다
					// 또는 일반 엘리먼트이거나 그리드 엘리먼트
					// 이거나
					var $elem = $(meta);
					if (!$elem.length || !$elem.prop('nodeType'))
						return;
					if (!$elem.prop('id')) {
						// 엘리먼트 ID가 없을때엔 향후
						// bind-extract를 위해 임의의
						// id를 배정한다.
						$elem.prop(id, randomId());
					}
					if ($elem.attr('data-alopexgrid')) {
						// 그리드일때의 바인딩은
						// recordSets에서 추출
						var recordSets = response.data.recordSets;
						if (!recordSets) {
							return;
						}
						if (recordSets.hasOwnProperty($elem.prop('id'))) {
							recordSetToGrid(recordSets[$elem.prop('id')], $elem);
						}
					} else {
						// 일반엘리먼트일 때의 바인딩은
						// fields에서 추출
						var id = $elem.attr('id');
						fieldsToElement(formDataFromData(response.data, id), $elem);
					}
				}
				if ($.isPlainObject(meta)) {
					// id가 지정된 grid selector
					var recordSets = response.data.recordSets;
					if (!recordSets) {
						return;
					}
					$.each(meta, function(id, selector) {
						if (recordSets.hasOwnProperty(id) && $(selector).attr('data-alopexgrid')) {
							recordSetToGrid(recordSets[id], $(selector));
						}
					});
				}
			});
		}]]
	});
	
	// 메타 프로세스에서 사용하는 함수들.
	// 클라이언트에서 작업 시 J2EE와 동일한 데이터 형식으로 작업하는 것을 표준으로 함.

	var seed = (Math.random() * 1000) | 0;
	function randomId() {
		return "J2EE" + seed++;
	}
	// 수신된 recordSet을 grid에 매핑시킨다
	function recordSetToGrid(rs, $elem) {
		var $target = $elem.jquery ? $elem : $($elem);
		if (!isValidElem($elem))
			return;
		if (!rs || !$elem)
			return;
		//
		$elem = $elem || $('#' + tableObject["TableName"]);
		if (!$elem.prop('nodeType'))
			return;
		if (!$elem.attr('data-alopexgrid'))
			return;
		var pobj = rs;
		// DOTO dataSet을 하면서 pagingObject를 넘기게 되면 이후에는 동적 페이징으로 작동한다.
		// 만일 동적 페이징을 사용하지 않고 한번에 모든 데이터를 로드하여 사용한다면
		// dataSet의 두번째 파라메터로 pagingObject를 넘기지 않는다.
		var dynamicpaging = pobj.hasOwnProperty('nc_pageNo') && (pobj['nc_pageNo'] > 0) && pobj.hasOwnProperty('nc_totalRecordCount') && pobj.hasOwnProperty('nc_recordCountPerPage');

		$target.alopexGrid('dataSet', $.isArray(pobj.nc_list) ? pobj.nc_list : [], dynamicpaging ? {
			current : pobj.nc_pageNo,
			total : Math.ceil(1.0 * pobj.nc_totalRecordCount / pobj.nc_recordCountPerPage) | 0,
			perPage : pobj.nc_recordCountPerPage,
			dataLength : pobj.nc_totalRecordCount
		} : null);
	}
	// 그리드로부터 recordSet을 추출한다.
	function recordSetToRecordSets(id, rs, rss) {
		if ($.isPlainObject(rss) && $.isPlainObject(rs) && typeof id === "string") {
			rss[id] = rs;
			return rss;
		}
	}
	function recordSetFromRecordSets(id, rss) {
		if ($.isPlainObject(rss) && typeof id === "string" && rss.hasOwnProperty(id)) {
			return rss[id];
		}
	}
	function gridToRecordSet(grid, rs) {
		var $target = grid.jquery ? grid : $(grid);
		var m_rs = {};
		var nc_list = $target.alopexGrid('dataGet');
		for ( var i = 0, l = nc_list.length; i < l; i++) {
			nc_list[i] = AlopexGrid.trimData(nc_list[i]);
		}
		var pageinfo = $target.alopexGrid('pageInfo');
		m_rs["nc_recordCount"] = nc_list.length;
		m_rs["nc_pageNo"] = pageinfo.current;
		m_rs["nc_recordCountPerPage"] = pageinfo.perPage;
		m_rs["nc_totalRecordCount"] = pageinfo.dataLength;
		m_rs["nc_list"] = nc_list;
		if ($.isPlainObject(rs)) {
			$.extend(true, rs, m_rs);
			return rs;
		}
		return m_rs;
	}

	// recordset을 grid외의 요소에 매핑시킬때의 규칙
	function recordSetToElement(rs, elem) {

	}
	function elementToRecordSet(elem, rs) {

	}

	// dataSet.fields의 값을 일반 databind로 적용
	function fieldsToElement(fields, elem) {
		// $.alopex.page[idselector] = $.alopex.databind(response.data.fields,
		// $target[0]);
		var $elem = (elem && elem.jquery) ? elem : $(elem);
		if (!$elem.length || !$elem.prop('nodeType')) {
			return;
		}
		if($.alopex.page['#' + $elem.prop('id')]) { // 이미 model이 생성된 경우.
			$.alopex.page['#' + $elem.prop('id')].set(fields);
		} else {
			$.alopex.page['#' + $elem.prop('id')] = $.alopex.datamodel($elem, true);
		    $.alopex.page['#' + $elem.prop('id')].set(fields);
		}
		
	}
	function elementToFields(elem, fields) {
		var $elem = (elem && elem.jquery) ? elem : $(elem);
		if (!$elem.length || !$elem.prop('nodeType'))
			return;
		if (!$.alopex.page['#' + $elem.prop('id')]) {
			$.alopex.page['#' + $elem.prop('id')] = $.alopex.datamodel('#' + $elem.prop('id'));
		}
		var model = $.alopex.page['#' + $elem.prop('id')].get();
		if ($.isPlainObject(fields)) {
			$.extend(true, fields, model);
		}
		return model;
	}
	// .NET에서 formdata를 DataSet에 넣는 케이스 고려.
	function formDataFromData(data, id) {
		var fields = $.extend(true, {}, data.fields);
		if (!id) {
			id = 'Table';
		}
		// .NET의 경우, form data의 경우도 datatable로 넘기는 경우가 다수 발생.
		if (data["recordSets"] && data["recordSets"][id] && $.isArray(data["recordSets"][id]["nc_list"])) {
			$.extend(true, fields, data["recordSets"][id]["nc_list"][0]);
		}
		return fields;
	}
	function isValidElem($elem) {
		if (!$elem || !$elem.prop('nodeType'))
			return false;
		return true;
	}
	
})(jQuery);
!function($, window, document) {
	
	var commonModule = 'common';
	var pageModule = 'page';

	$.alopex.services = function(svcList) {
		$.alopex.services.list = $.extend(true, $.alopex.services.list, svcList);

		for (var id in svcList) {
			if (!svcList.hasOwnProperty(id)) {return;}
			// 서비스에 trigger되는 엘리먼트 찾아서 등록.
			var elements = document.querySelectorAll('[data-trigger*="@'+id+'"]');
			if(elements) {
				var regexp = new RegExp('\\w+\\s*\@\\s*'+id+'\(\?\!\[\\d\\w\]\)', 'gi');
				for(var i=0; i<elements.length; i++) {
					var event, element = elements[i];
					var attr = element.getAttribute('data-trigger');
					var match = attr.match(regexp);
					if(match) {
						for(var j=0; j<match.length; j++) {
							event = $.trim(match[j].split('@')[0]);
							if(event) {
								if(event == 'load') {
									sendRequest(id);
								} else {
									$(element).on(event, (function(_id) {
										return function() {
											sendRequest(_id);
										};
									})(id));
								}
							}
						}
					}
				}
			}
			
			var setting = svcList[id];
			if(setting.trigger && setting.trigger instanceof Array) {
				for(var i=0; i<setting.trigger.length; i++) {
					var prerequisite = setting.trigger[i];
					if(!$.alopex.services.dependency[prerequisite]) {
						$.alopex.services.dependency[prerequisite] = [];
					}
					$.alopex.services.dependency[prerequisite].push(id);
				}
			}
		}
	};
	$.alopex.services.dependency = {};
	
	function Response(jqXHR) {
		this.responseText = jqXHR.responseText;
		this.response = jqXHR.responseJSON;
		if(!this.response) {
			try{
				this.response = JSON.parse(this.responseText);
			}catch(e){}
		}
		this.status = jqXHR.status;
		this.errorCode = jqXHR.status;
		this.errorText = jqXHR.statusText;
	}
	
	function Request(id, setup, request) {
		this.id = id;
		this.headers;
		this.method;
		this.timeout;
		this.url;
		this.data;
		this.context; // callback에 전달될.
		
		this.setup;
		this.request;
		
		setup = (setup)? setup: {};
		this.setup = setup;
		this.request = request;
		var setting = $.extend(true, setting, setup, request);
		setting.method = setup.method || request.method;
		setting.url = request.url || setup.url;
		var Func;
		if(typeof setting.url == 'function') {
			Func = setting.url 
		} else if( setting.url.indexOf('function') != -1) {
			Func = eval('(' +setting.url + ')' );
		}
		if(Func) {
			setting.url = Func(id, request)
		}
		setting.data = setting.parameter;
		if(setting.variables) {
			for(var i in setting.variables) {
				$.alopex.util.setValueOnObject(setting.data, i, setting.variables[i]);
			}
		}
		setting.dataType = 'json';
		if(setting.requeestHeaders) {
			setting.header = setting.requeestHeaders;
		}
		setting.context = this;
		this.success = successCallback;
		this.error = errorCallback;
		this.method = setting.method;
		this.url = setting.url;
		this.data = setting.data;
		this.response = null;
		this.proceed = new Proceed(this);
	}
	
	function Proceed(req) {
		this.id = Math.random();
		this.status;
		this.canProceed = false;
		this.request = req;
	}
	Proceed.prototype.next = function() {
		this.canProceed = false;
		return (function(that) {
			return function (status) {
				that.canProceed = true;
				if(status) that.status = status;
			};
		})(this);
	};
	Proceed.prototype.checkProceed = function() {
		if(this.canProceed) {
			return true;
		} else {
			return false;
		}
	};
	

	function sendRequest(id) {
		var service = $.alopex.services.list[id];
		var defaultSetting = $.alopex.request.setupConfig;
		var req = new Request(id, defaultSetting, service);
		req.setting = service; // TODO temp.. fix it.
		
		// parameter
		for(var i in service.parameter) {
			$.alopex.util.setValueOnObject(req.data, i, service.parameter[i]);
		}
		
		if(service.parambind) {
			for(var i in service.parambind) {
				var bindmap = service.parambind[i];
				$.alopex.util.setValueOnObject(req.data, i, $a.getDataByService(bindmap, 'data-bind'));
			}
		}
		
		// handle pre-processes
		if(defaultSetting.before) {
			try{
				var before = window[commonModule][defaultSetting.before];
				if(before) {
					before(req, req.proceed.next());
					if(!req.proceed.checkProceed()) {
						return;
					}
				}
			}catch(e){}
		}
		if(service.before && service.before.length) {
			for(var i=0; i<service.before.length; i++) {
				try{
					var before = window[pageModule][service.before[i]];
					if(before) {
						before(req, req.proceed.next());
						if(!req.proceed.checkProceed()) {
							return;
						}
					}
				}catch(e){}
			}
		}
		
		var ServiceHttp;
		if(typeof Http !== "function" && typeof _legacyHttp === "function") {
			ServiceHttp = _legacyHttp;
		} else {
			ServiceHttp = Http;
		}
		var http = new ServiceHttp();
		req["onBody"] = ((String(req.method).toUpperCase() === "POST") ? true : false);
		// parameter들이 변환된 이후에 처리.
		req["content"] = (typeof req.data == 'object') ? JSON.stringify(req.data) : String(req.data);
		if (String(req.method).toUpperCase() === "GET" && $.isPlainObject(req.data) && !$.isEmptyObject(req.data)) {
			entity["url"] += "?" + $.param(req.data);
		}
		if (req["async"]) {
			http.setTimeout(req.timeout || 30000);
		}
		if (window.deviceJSNI) {
			http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		}
		http.request(req, __successCallback(req), __errorCallback(req));
	}
	
	function successCallback(data, textStatus, jqXHR) {
		var req = this;
		var id = req.id;
		req.response = new Response(jqXHR);
		var service = $.alopex.services.list[id];
		var defaultSetting = $.alopex.request.setupConfig;
		
		// handle post-processes
		if(defaultSetting.after) {
			try{
				var after = window[commonModule][defaultSetting.after];
				if(after) {
					after(req, req.response, req.proceed.next());
					if(!req.proceed.checkProceed()) {
						return;
					}
				}
			}catch(e){}
		}
		if(service.after && service.after.length) {
			for(var i=0; i<service.after.length; i++) {
				try{
					var after = window[pageModule][service.after[i]];
					if(after) {
						after(req, req.response, req.proceed.next());
						if(!req.proceed.checkProceed()) {
							return;
						}
					}
				}catch(e){}
			}
		}
		
		if(req.proceed.status == 'fail') {
			failCallback.call(req);
			return ;
		} else if(req.proceed.status == 'error') {
			errorCallback.call(req, jqXHR, req.response.status)
			return ;
		}
		
		// 공통 success callback
		if(window[commonModule]) {
			if(defaultSetting.success && typeof window[commonModule][defaultSetting.success] == 'function') {
				window[commonModule][defaultSetting.success](data, req, req.response);
			}
		}
		
		// 페이지 지정 success callback
		if(window[pageModule]) {
			if(service.success && typeof window[pageModule][service.success] == 'function') { 
				window[pageModule][service.success](data, req, req.response);
			}
		}
		
		// 데이타 바인딩 처리.
		// databind 처리는 html에 작성된 'data-bind' 속성값에 따라 처리.
		if(req.setting.databind && req.response.response) {
			for(var i in req.setting.databind) {
				// 'path.path2 : 'bindmap-id''
				var data = $.alopex.util.getValueOnObject(req.response.response, i);
				$.alopex.setDataByService(req.setting.databind[i], data, 'data-bind');
			}
		}
		
		// call the service which is required to
		if($.alopex.services.dependency[id]) {
			for(var i=0; i<$.alopex.services.dependency[id].length; i++) {
				sendRequest($.alopex.services.dependency[id][i]);
			}
		}
	}
	
	
	function failCallback() {
		var req = this;
		var id = req.id;
		var service = $.alopex.services.list[id];
		var defaultSetting = $.alopex.request.setupConfig;
		if(window[commonModule]) {
			if(defaultSetting && defaultSetting.fail && typeof window[commonModule][defaultSetting.fail] == 'function') {
				window[commonModule][defaultSetting.fail](req.response.errorCode, req.response.errorText);
			}
		}
		if(window[pageModule]) {
			if(service && service.fail && service.fail && typeof window[pageModule][service.fail] == 'function') {
				window[pageModule][service.fail](req.response.errorCode, req.response.errorText);
			}
		}
		
	}
	
	function errorCallback(jqXHR, textStatus, errorThrown) {
		var req = this;
		var id = req.id;
		var service = $.alopex.services.list[id];
		var defaultSetting = $.alopex.request.setupConfig;
		if(!req.response) {
			req.response = new Response(jqXHR);
		}
		if(window[commonModule]) {
			if(defaultSetting && defaultSetting.error && typeof window[commonModule][defaultSetting.error] == 'function') {
				window[commonModule][defaultSetting.error](req.response.errorCode, req.response.errorText);
			}
		}
		if(window[pageModule]) {
			if(service && service.error && service.error && typeof window[pageModule][service.error] == 'function') {
				window[pageModule][service.error](req.response.errorCode, req.response.errorText);
			}
		}
	}
	
	function __successCallback(req) {
		return function(res, jqXHR) {
			successCallback.call(req, res.response, res.status, jqXHR);
		};
	}
	
	function __errorCallback(request) {
		return function(res, jqXHR) {
			errorCallback.call(request, jqXHR, res.status);
		};
	}

	$.alopex.services.defaultSetting = {
		request : {
			url : "",
			method : "POST",
			async : "true",
			timeout : "1000",
			parameter : {}
		},
		after: {},
		before : {},
		response : {
			failCondition : [],
			response : {}
		},
		success : {
			callback : undefined,
			bindMapping: {
//					'path.path2': 'div.classname[data-bind]'				
			}
		},
		error : {
			callback : undefined
		},
		fail : {
			callback : undefined
		}
	};
	$.alopex.services.send = sendRequest;
	$.alopex.services.list = {};
	$.alopex.registerSetup('request', function(option) {
		$.alopex.services.defaultSetting = option;
	});
	
	
	// if $.alopex.request is defined, attach IDE function to the property.
	if($.alopex.request && typeof $.alopex.request == 'function') {
		$.alopex.request.register = $.alopex.services;
		$.alopex.request.sendRegistered = sendRequest;
	}

}(jQuery, this, this.document, undefined);
!function($) {
	/**
	 * 공통 설정 부분.
	 * before : 전처리, 
	 * after : success 판단 여부 처리 
	 * success : 성공 시 공통으로 처리해주는 후처리. 
	 * url : "" or function() {return "http://localhost:9000";}
	 * method : "GET" or "POST" or function() { return "GET";}
	 */
	$.alopex.request.setup({
//		platform: 'NEXCORE.J2EE',
//		//url : "http://150.28.65.2:7001/web/stand.jmd",
//		/* 조건에 따라 다른 url에 지정이 가능하다. */
//		url: function() {
//			if(true){
//				return "http://150.28.65.2:7001/web/stand.jmd";
//			}
//			return 'dddd'
//		},
//		//*/
//		method : "POST",
//		timeout: 3000,
//		before : function(id, option) { // before
//			// 전처리기.
//			$('body').progress(); //progress bar 시작
//		},
//		after : function(res) {
//			this.isSuccess = true | false;
//		},
//		success : function(res) {
//		},
//		fail: function(res) {
//		},
//		error  : function(err) {
//		}
	});
	
	
	$.alopex.navigate.setup({
		/**
		 * 이 함수를 통해 navigate 함수의 경로가 바뀌는 것을 조정할 수 있습니다.
		 */
		url: function(url, param) {
			var targetUrl = url;
//			var baseDirectory = '/html/';
//			var semanticUrl = window.location.href.split('?')[0];
//			semanticUrl = semanticUrl.replace('//', '');
//			semanticUrl = semanticUrl.substring(semanticUrl.indexOf('/') + 1); // protocol & domain 부분 제외. 절대 경로. '/FM/dd/
//			var currentUrlPath = semanticUrl.split('/');
//			var urlPath = targetUrl.split('/');
//			if(!$.alopex.util.isValid(currentUrlPath[currentUrlPath.length-1])) {
//				currentUrlPath.pop();
//			}
//			if(!$.alopex.util.isValid(urlPath[urlPath.length-1])) {
//				urlPath.pop();
//			}
//			var extension = '';
//			var path = currentUrlPath[currentUrlPath.length-1];
//			if(path.split('.').length>1) {
//				extension = path.split('.')[path.split('.').length-1].toLowerCase().trim();
//			}
//			var hasHTMLExtension = (extension == 'html');
//			
//			if(url.indexOf('/') == 0) { // 절대 경로.
//				if(currentUrlPath.length == urlPath.length) { // 절대 경로로 navigate함수 호출하고, 그에 따라 이동.
//					// do Nothing!
//				} else { // 모바일 프레임워크와 같이 /html/ 디렉토리가 기준이 되어 이동하는 케이스.
//					targetUrl = (baseDirectory + targetUrl);
//					if(hasHTMLExtension) { 
//						// Controller 사용 시 html확장자를 가지고 있는 경우, 
//						// 이동 기준이 되는 디렉토리가 html 폴더 기준으로 이동하는 것이 표준.
//						targetUrl += (targetUrl.lastIndexOf('.html') + 5 == targetUrl.length? '': '.html');
//					}
//				}
//			} else {
//				
//			}
			
			
			return targetUrl;
		}
	});
}(jQuery);



