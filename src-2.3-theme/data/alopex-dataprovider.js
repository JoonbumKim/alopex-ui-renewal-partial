+function($) {
	
	function getParams(serviceId) {
		return $.alopex.datamodel('body').get();
	}

	/**
	 * data source 관련 스펙은 
	 * 
	 * request
	 * 
	 * $.alopex.databind({})
	 * 
	 * $.alopex.datasource.read(serviceId, options)  return response data
	 * $.alopex.datasource.bind(serviceId, options)  return viewmodel object
	 * $.alopex.datasource.update(serviceId, options)
	 * $.alopex.datasource.autosync(serviceId, options)    
	 * 
	 *   
	 */

	// 화면 로딩 시 서비스 로딩 정보를 읽어와서 JS 오브젝트로 들고 있다고 가정.
	//  function Service(obj) {
	//    this.successCallback = obj.success;
	//    this.errorCallback;
	//  
	//    this.requestOption;
	//    this.response; // last response string
	//    this.responseJson; // last response json object
	//  }

	function DataSource() {

		//    this.servicelist = {
		//        key1 : {
		//          "name": "request-name",
		//          "description": "",
		//          "url": "http://localhost:8080/services?id=test&name=test",
		//          "method": "GET",
		//          "headers": "",
		//          "data": "",
		//          "dataMode": "params"
		//        }
		//    };
		//  this.requestlist = {
		//  servicekey: {
		//    data: null,
		//    response : null,
		//    responseObj : null,
		//    datamodel : null
		//  }
		//};

		this.servicelist = {}; // 애는 그냥 설정정보에 있는 내용 다 가져온 것.
		this.requestlist = {}; // already requested.
	}

	DataSource.prototype.loadServiceInfo = function(path, callback) {
		// re-init
		this.servicelist = {};
		this.requestlist = {};

		var that = this;
		$.get(path, function(response) {
			var list = {};
			if (typeof response === 'string') {
				list = JSON.parse(response);
			} else if (typeof response === 'object') {
				list = (response);
			}
			$.extend(that.servicelist, list);
			if(callback && typeof callback == 'function') {
				callback();
			}
			
		});
	};

	DataSource.prototype.isCached = function(serviceId, options) {
		if (!options) {
			return false;
		}
		return (this.requestlist[serviceId] && // requestlist에 해당 서비스 id가 존재함. 
				this.requestlist[serviceId].data === options.data); // 해당 서비스 id의 param data와 동일.
	}

	/**
	 * 추후 filter & sorting 추가 기능 떄문에 제공.
	 * @params options 
	 *  {
	 *  	sucess: function type,
	 *  	error: function type,
	 *  	callback : function type
	 *  } 
	 */
	DataSource.prototype.bind = function(serviceId, options) {
		if(!options) {
			options = {};
		}
		this.successCallback = options.success;
		this.errorCallback = options.error;
		this.callback = options.complete;
		if (this.isCached(serviceId, options)) {
			var responseObj = this.requestlist[serviceId].responseObj;
			this.databinding(serviceId);
		} else {
			// 이전ㅇ
			var serviceInfo = this.servicelist[serviceId];
			if(serviceInfo) {
				
				$.extend(serviceInfo, options, {
					type: serviceInfo.method,
					complete: this._requestCallback,
					error: this._requestErrorCallback,
					success: this._requestSuccessCallback
				});
				if(serviceInfo.staticSchema) {
					serviceInfo.data = $.extend({}, serviceInfo.data, getParams(serviceId));
				}
				
				this.requestlist[serviceId] = {
					data: serviceInfo.data,
					responseText: '',
					responseObject: null
				};
				$.ajax(serviceInfo);
				$.alopex.datasource.object = this;
			}
		}
	};

	DataSource.prototype._requestSuccessCallback = function() {
		// 임시 : 수정할 것...... ㅠ
		var that = $.alopex.datasource.object;
		that.successArguments = arguments;
	};

	DataSource.prototype._requestErrorCallback = function() {
		var that = $.alopex.datasource.object;
		that.errorArguments = arguments;
	};

	DataSource.prototype._requestCallback = function(response, status) {
		var servicekey;
		for ( var i in $.alopex.datasource.servicelist) {
			var url = this.url.split('?')[0].trim();
			if ($.alopex.datasource.servicelist[i].url === url) {
				servicekey = i;
				break;
			}
		}
		var that = $.alopex.datasource.object;

		// response 받아서 this.requestlist 추가 보충.
		try {
			that.requestlist[servicekey].responseText = response.responseText;
			that.requestlist[servicekey].responseObject = JSON.parse(response.responseText);
			var list = that.databinding(servicekey);

			if (status === 'success' && that.successCallback) {
				that.successCallback.apply(this, that.successArguments);
			} else if (status != 'success' && that.errorCallback) {
				that.errorCallback.apply(this, that.errorArguments);
			}

			if (that.callback) {
				that.callback.call(this, arguments[0], arguments[1], list);
			}
		} catch (e) {
		}

	};

	/**
	 * 나중에 data-provider영역 따로 찾는걸로 바꾸기.
	 */
	DataSource.prototype.databinding = function(serviceId) {
		var that = this;
		var viewmodel;
		$candidate = $('[data-provider*="' + serviceId + '"]');
		$candidate.each(function() {
			var providerInfo = this.getAttribute('data-provider');
			var serviceKey = providerInfo.split(':')[0];
			if (serviceId === serviceKey) {
				var datamodel;
				var data;
				if (providerInfo.split(':').length === 1) {
					data = that.requestlist[serviceId].responseObject;
				} else {
					var path = providerInfo.split(':')[1];
					var paths = path.split('.');
					var data = that.requestlist[serviceId].responseObject;

					for ( var i = 0; i < paths.length; i++) {
						data = data[paths[i]];
					}
				}
				viewmodel = $.alopex.databind(data);
				$.alopex.data.servicemodel[serviceId] = viewmodel;
				if(document.createElement) {
					var e = document.createEvent('Events');
					e.initEvent('databind', true, true);
					document.dispatchEvent(e);
				} else {
					$(document).trigger('databind');
				}
				
//				
				//        viewmodels.push(datamodel);
			}
		});

		return viewmodel;
	};

	DataSource.prototype.update = function(serviceId, options, viewmodel) {
		var data = viewmodel.get();
		options.data = data;
		if (options.type) {
			options.method = options.type;
		}

		var serviceInfo = this.servicelist[serviceId];
		$.extend(serviceInfo, options);

		serviceInfo.method = "post";
		$.ajax(serviceInfo);
		$.alopex.datasource.object = this;
	};
	
	/**
	 * data-trigger 속성 정의.
	 */
	DataSource.prototype.search = function(scope) {
		if(!scope) {
			scope = 'body';
		}
		var that = this;
		$(scope).find('[data-trigger]').addBack('[data-trigger]').each(function() {
			var $this = $(this);
			var attr = $this.attr('data-trigger');
			var rule = new $.alopex.datarule(attr);
			
			for(var i in rule.object) {
				if(rule.object[i] == 'load') { // load일 경우 바로 호출.
					that.bind(i);
				} else {
					if(!$this.data('_data_trigger_' + i)) {
						$this.on(rule.object[i], function(e){
							that.bind(i);
						});
						$this.data('_data_trigger_' + i, rule.object[i]);
					}
				}
				
			}
		});
	}
	
	$.alopex.datasource = new DataSource();
//	$.alopex.datasource.loadServiceInfo('/service.json', function() {
//		$.alopex.datasource.search('body');
//	});
	
}(jQuery);