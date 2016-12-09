
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