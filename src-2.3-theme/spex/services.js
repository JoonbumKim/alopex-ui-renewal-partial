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