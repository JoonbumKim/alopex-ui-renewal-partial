
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

