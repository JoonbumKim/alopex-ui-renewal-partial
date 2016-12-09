
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