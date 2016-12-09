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