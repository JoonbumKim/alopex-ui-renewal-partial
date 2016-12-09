(function($) {
	if ($.alopex.util.regexp) {
		return;
	}
	var regexp = {
		number: /^[0-9]+$/,
		float: /\d+(\.\d+)?/gi,
		date: /(^\d{1,2}(\-|\/|\.)\d{1,2}(\-|\/|\.)\d{4}$)|(^\d{4}(\-|\/|\.)\d{1,2}(\-|\/|\.)\d{1,2}$)/,
		divider: /^\-|\/|\./
	};
	
	// 0보다 큰 integer인지 체크
    function isPlusInt(n){
        return n != null && n != undefined && n != "" && Number(n) === n && n % 1 === 0 && n > -1;
    }
	
	// delayFunction(func, wait, [a, b, c, ...]);
	// wait 시간 뒤에 func 수행. 이 때 func 에 a, b, c, ... 가 인자가 됨
	function delayFunction(func, wait) {
		var args = Array.prototype.slice.call(arguments, 2);	
		return setTimeout(function(){ 
			return func.apply(null, args); 
		}, wait);
	}

	function isValid(variables) {
		if (variables === null || variables === undefined || variables === '' || variables === 'undefined') {
			return false;
		} else {
			return true;
		}
	}
	
	function arrayjoin(a, b) {
		var compound = $.extend([], a);
		for(var i=0; i<b.length; i++) {
			var found = false;
			for(var j=0; j<a.length; j++) {
				if(a[i] == b[j]) {
					found = true;
					break;
				}
			}
			if(!found) {
				compound.push(b[i]);
			} 
		}
		return compound;
	}

	function parseBoolean(string) {
		switch (String(string).toLowerCase()) {
		case 'true':
		case '1':
		case 'yes':
		case 'y':
			return true;
		case 'false':
		case '0':
		case 'no':
		case 'n':
			return false;
		default:
			return false;
		}
	}

	function hasClass(ele, cls) {
		return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}

	function addClass(ele, cls) {
		if (!$.alopex.util.hasClass(ele, cls)) {
			ele.className += ' ' + cls;
		}
	}

	function removeClass(ele, cls) {
		if ($.alopex.utilhasClass(ele, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			ele.className = ele.className.replace(reg, ' ');
		}
	}

	function getWindowHeight() {
		return $(window).height();
	}

	function getWindowWidth() {
		return $(window).width();
	}

	function getDocumentHeight() {
		return $(document).height();
	}

	function getDocumentWidth() {
		return $(document).width();
	}

	function getPagePosition(el) {
		var result = {};
		var leftPosition = 0, topPosition = 0;
		if (el.offsetParent) {
			topPosition = el.offsetTop;
			leftPosition = el.offsetLeft;
			while (el = el.offsetParent) {
				// body가 position fixed or absolute일 경우, top 계산.
				if(el.style.position == 'fixed' && el.tagName.toLowerCase() == 'body') {
					topPosition += el.style.top? parseInt(el.style.top) : 0;
					leftPosition += el.style.left? parseInt(el.style.left) : 0;
					break;
				}
				topPosition += el.offsetTop;
				leftPosition += el.offsetLeft;
			}
		}
		result.top = topPosition;
		result.left = leftPosition;
		return result;
	}

	function getRelativePosition(el) {
		var result = {};
		var leftPosition = 0, topPosition = 0;
		if (el && el.offsetParent) {
			topPosition = el.offsetTop;
			leftPosition = el.offsetLeft;
			el = el.offsetParent;
			while (el) {
				topPosition += el.offsetTop;
				leftPosition += el.offsetLeft;
				el = el.offsetParent;
			}
		}
		result.top = topPosition;
		result.left = leftPosition;
		return result;
	}

	function getScrolledPosition(el) {
		var result = {};
		var leftPosition = 0, topPosition = 0;
		if (el.offsetParent) {
			topPosition = el.offsetTop - el.scrollTop;
			leftPosition = el.offsetLeft - el.scrollLeft;
			while (el = el.offsetParent) {
				topPosition += el.offsetTop - el.scrollTop;
				leftPosition += el.offsetLeft - el.scrollLeft;
			}
		}
		result.top = topPosition;
		result.left = leftPosition;
		return result;
	}

	function getScrollbarWidth() {
		var parent, child, width;
		if (width === undefined) {
			parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
			child = parent.children();
			width = child.innerWidth() - child.height(99).innerWidth();
			parent.remove();
		}
		return width;
	}
	
	function parseJsonWithValidation(jsonString){
		var result = null;
		try{
			result = JSON.parse(jsonString);
			return result; 
		}catch(err){
			console.error("JSON.parse() error : " + jsonString);
			return false;
		}
	}
	
	function stringifyJsonWithValidation(jsonObject){
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

	function isNumberType(data) {
		return $.alopex.util.regexp.number.test(data);
	}
	
	function isStringType(obj){
		return (Object.prototype.toString.call(obj) === '[object String]');
	}

	function isDateType(data) {
		return $.alopex.util.regexp.date.test(data);
	}
	
	function isConverted(el) {
		return ($(el).attr('data-converted') === 'true');
	}
	
	function getDateString(date, format) {
		if(!(date instanceof Date)) {
			return ;
		}
		var fullyear = date.getFullYear();
		var month = date.getMonth() + 1;
		var dateObj = date.getDate();
		month = ((month < 10)? '0' : '') + month;
		dateObj = ((dateObj < 10)? '0' : '') + dateObj;
		return format.replace('yyyy', fullyear).replace('MM', month).replace('dd', dateObj);
	}

	/**
	 *
	 * @param array {array type} array of date string
	 * @return array {array} array of 'DDMMYYYY' string
	 */
	function formatDate(array) {
		var type = 'ddmm';
		var divider, data;

		// ddmm or mmdd 판단.
		for ( var i = 0; i < array.length; i++) {
			divider = array[i].match($.alopex.util.regexp.divider);
			data = array[i].split(divider);

			if (data[0].length === 4) { // 이 부분에서 YYYY 뒤로 이동.
				data.push(data[0]);
				data.shift();
				array[i] = data.join('/');
			}

			if (parseInt(data[0], 10) > 12) {
				type = 'mmdd';
				break;
			}
		}

		if (type === 'mmdd') {
			for (i = 0; i < array.lengh; i++) {
				divider = array[i].match($.alopex.util.regexp.divider);
				data = array[i].split(divider);
				var temp = data[0];
				data[0] = data[1];
				data[1] = temp;
				array[i] = data.join('/');
			}
		}

		return array;
	}

	/**
	 * create new HTML node, copy the attribute of original element
	 * @param {string} tagName tagname of new html node.
	 */
	function copyNode(oldNode, tagName) {
		if (tagName === undefined) {
			tagName = oldNode.tagName;
		}
		var newNode = document.createElement(tagName);
		for ( var i = 0; i < oldNode.attributes.length; i++) {
			var attr = oldNode.attributes[i];
			$(newNode).attr(attr.name, attr.value);
		}
		return newNode;
	}

	// used in sorting in table widget
	function insertSort(array, comparison, ascending, begin, end) {
		if (!array || !array.length) {
			return array;
		}
		if (array.length < 2) {
			return array;
		}
		begin = begin || 0;
		end = end || array.length;
		var size = end - begin;
		if (size < 2)
			return array;

		var subArray = array.slice(begin, end);
		var i, j, newValue;
		for (i = 1; i < subArray.length; i++) {
			newValue = subArray[i];
			j = i;

			if (ascending) {
				while (j > 0 && comparison(subArray[j - 1], newValue) > 0) {
					subArray[j] = subArray[j - 1];
					j--;
				}
			} else {
				while (j > 0 && comparison(subArray[j - 1], newValue) < 0) {
					subArray[j] = subArray[j - 1];
					j--;
				}
			}
			subArray[j] = newValue;
		}
		for ( var i = 0; i < subArray.length; i++) {
			array[begin + i] = subArray[i];
		}
		return array;
	}

	function mergeSort(array, comparison, ascending, begin, end) {
		if (!array || !array.length) {
			return array;
		}
		if (array.length < 2) {
			return array;
		}
		begin = begin || 0;
		end = end || array.length;
		var size = end - begin;
		if (size < 2)
			return array;
		var middle = begin + Math.floor(size / 2);
		var merged = _merge(mergeSort(array.slice(begin, middle), comparison, ascending), mergeSort(array.slice(middle, end), comparison, ascending), comparison, ascending);
		merged.unshift(begin, merged.length);
		array.splice.apply(array, merged);
		//array.splice(begin, merged.length, )
		return array;
	}
	function _merge(left, right, comparison, ascending) {
		var result = new Array();
		while ((left.length > 0) && (right.length > 0)) {
			if (comparison(left[0], right[0]) <= 0 && ascending)
				result.push(left.shift());
			else
				result.push(right.shift());
		}
		while (left.length > 0)
			result.push(left.shift());
		while (right.length > 0)
			result.push(right.shift());
		return result;
	}

	function sort_default(a, b) {
		if (a > b) {
			return 1;
		}
		if (a < b) {
			return -1;
		}
		return 0;
	}
	
	function addFloat(a, b) {
		var splitA = (''+a).split('.');
		var splitB = (''+b).split('.');
		var multiplier = 0;
		if(splitA[1]) {
			multiplier = splitA[1].length;
		}
		if(splitB[1] && splitB[1].length > multiplier) {
			multiplier = splitB[1].length;
		}
		var multiplier = Math.pow(10, multiplier);
		var result = multiplier==0?a+b:parseFloat(Math.round(a*multiplier + b*multiplier))/multiplier;
		return result;
	}

	function sort_numeric(a, b) {
		var num1 = parseFloat(a[0].replace(/[^0-9.-]/g, ''));
		if (isNaN(num1)) {
			num1 = 0;
		}
		var num2 = parseFloat(b[0].replace(/[^0-9.-]/g, ''));
		if (isNaN(num2)) {
			num2 = 0;
		}
		return num1 - num2;
	}

	function sort_date(a, b) { // MM/DD/YYYY
		var date1 = $.alopex.util.getDate(a[0]);
		var date2 = $.alopex.util.getDate(b[0]);

		if (date1 > date2) {
			return 1;
		} else if (date1 === date2) {
			return 0;
		} else {
			return -1;
		}
	}

	/**
	 *
	 * @param {string} date string type.
	 * @return {Date Object} Javascript Date Object.
	 */
	function getDate(date, option) {
		var year, month, day;
		if (option === undefined) {
			option = 'mmdd';
		}

		var divider = '/';
		divider = date.match(/\-|\/|\./);
		var dateArr = date.split(divider);
		year = dateArr[2];
		if (option === 'ddmm') {
			month = dateArr[1];
			day = dateArr[0];
		} else {
			month = dateArr[0];
			day = dateArr[1];
		}
		return new Date(year, month, day);
	}

	function trim(str) {
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}

	function erase() {
		var erased = [];
		$(document).find(':hidden').each(function() {
			if (this.parentNode) {
				var tagname = this.tagName.toLowerCase();
				switch (tagname) {
				case "head":
				case "meta":
				case "link":
				case "script":
				case "option":
				case "style":
					return;
				}
				erased.push({
					node: this,
					parent: this.parentNode
				});
				this.parentNode.removeChild(this);
			}

		});
		return erased;
	}

	function restore(obj) {
		for ( var i = 0; i < obj.length; i++) {
			if (obj[i].parent) {
				obj[i].parent.appendChild(obj[i].node);
			}
		}

	}
	
	function getOptions(el) {
		var option = {};
		for ( var i = 0; i < el.attributes.length; i++) {
			if (el.attributes[i].name.indexOf('data-') === 0) {
				var key = el.attributes[i].name.replace('data-', '').replace('-', '');
				if (key === 'type') {
					continue;
				} // ie7, 8 predefined property
				var value = el.attributes[i].value;
				option[key] = value;
			}
		}
		
		for ( var i in option) {
			if (option[i] === 'true' || option[i] === 'false') { // false
				option[i] = $.alopex.util.parseBoolean(option[i]);
			}
			if ($.alopex.util.isNumberType(option[i])) {
				option[i] = parseInt(option[i], 10);
			}
		}
		
		return option;
	}
	
	function arrayremove(array, removeItem) {
		if(!(array instanceof Array)) {
			return ;
		}
		
		for(var i=0; i<array.length; i++) {
			if(array[i] == removeItem) {
				array.splice(i, 1);
			}
		}
	}
	
	var re = /([^&=]+)=?([^&]*)/g;
	var decode = function(str) {
		return decodeURIComponent(str.replace(/\+/g, ' '));
	};
	function parseQuerystring(query) {
		var params = {}, e;
		if (query) {
			if (query.substr(0, 1) == '?') {
				query = query.substr(1);
			}

			while (e = re.exec(query)) {
				var k = decode(e[1]);
				var v = decode(e[2]);
				if (params[k] !== undefined) {
					if (!$.isArray(params[k])) {
						params[k] = [ params[k] ];
					}
					params[k].push(v);
				} else {
					params[k] = v;
				}
			}
		}
		return params;
	}
	
	function getOSName() {
		var osArray = {
			'Windows NT 6.3' : 'Windows 8.1',
			'Windows NT 6.2' : 'Windows 8',
			'Windows NT 6.1' : 'Windows 7',
			'Windows NT 6.0' : 'Windows Vista',
			'Windows NT 5.2' : 'Windows Server 2003; Windows XP x64 Edition',
			'Windows NT 5.1' : 'Windows XP',
			'Windows NT 5.01' : 'Windows 2000, Service Pack 1 (SP1)',
			'Windows NT 5.0' : 'Windows 2000',
			'Windows NT 4.0' : 'Microsoft Windows NT 4.0',
			'Windows 98; Win 9x 4.90' : 'Windows Millennium Edition (Windows Me)',
			'Windows 98' : 'Windows 98',
			'Windows 95' : 'Windows 95',
			'Windows CE' : 'Windows CE',
			'Open BSD' : 'OpenBSD',
			'Sun OS' : 'SunOS',
			'Linux' : 'Linux',
			'x11' : 'Linux',
			'Mac_PowerPC' : 'Mac OS',
			'Macintosh' : 'Mac OS',
			'QNX' : 'QNX',
			'BeOS' : 'BeOS',
			'OS/2' : 'OS/2',
			'Search' : 'Search Bot',
			'nuhk' : 'Search Bot',
			'Googlebot' : 'Search Bot',
			'Yammybot' : 'Search Bot',
			'Openbot' : 'Search Bot',
			'Slurp' : 'Search Bot',
			'MSNBot' : 'Search Bot',
			'Ask Jeeves/Teoma' : 'Search Bot',
			'ia_archiver' : 'Search Bot'
		};
		for ( var i in osArray) {
			if (navigator.userAgent.indexOf(i) != -1) {
				return osArray[i];
			}
		}
		return 'Others';
	}
	
	function getBrowserName() {
		var browserName, fullVersion, verOffset;
		var nAgt = navigator.userAgent;
		
		if ("ontouchstart" in document.documentElement || 'ontouchstart' in window) {
			window.browser = 'mobile';
		} 
		// In Opera, the true version is after "Opera" or after "Version"
		else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
			browserName = "Opera";
			fullVersion = nAgt.substring(verOffset + 6);
			if ((verOffset = nAgt.indexOf("Version")) != -1)
				fullVersion = nAgt.substring(verOffset + 8);
		}
		// In IE11
		else if ((verOffset = nAgt.indexOf("Trident")) != -1) {
			browserName = "Microsoft Internet Explorer";
			fullVersion = "11.0" +  nAgt.substring(verOffset + 12);
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
			browserName = "Microsoft Internet Explorer";
			fullVersion = nAgt.substring(verOffset + 5);
		}
		// In Chrome, the true version is after "Chrome"
		else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
			browserName = "Chrome";
			fullVersion = nAgt.substring(verOffset + 7);
		}
		// In Safari, the true version is after "Safari" or after "Version"
		else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
			browserName = "Safari";
			fullVersion = nAgt.substring(verOffset + 7);
			if ((verOffset = nAgt.indexOf("Version")) != -1)
				fullVersion = nAgt.substring(verOffset + 8);
		}
		// In Firefox, the true version is after "Firefox"
		else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
			browserName = "Firefox";
			fullVersion = nAgt.substring(verOffset + 8);
		}
		// In most other browsers, "name/version" is at the end of userAgent
		else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
			browserName = nAgt.substring(nameOffset, verOffset);
			fullVersion = nAgt.substring(verOffset + 1);
			if (browserName.toLowerCase() == browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}
		return browserName + ' ' + fullVersion;
	}
	

	/**
	 * 오브젝트에 정해진 위치에 데이터를 셋한다.
	 * @param object 데이터를 저장할 대상.
	 * @param path dot notation으로 구분된 경로. reference key
	 * @param value 저장할 데이터.
	 * @returns {boolean} 성공적으로 값을 셋했는지 여부
	 */
	function setValueOnObject(object, path, value) {
		var path_directory = path.split('.');
		var currentRef = object;
		if(path_directory.length < 1) {return false;}
		for(var i=0; i<path_directory.length-1; i++) { /* iterate from 0 to length-1 */
			var dir = path_directory[i];
			if(!currentRef[dir]) {
				currentRef[dir] = {};
			}
			currentRef = currentRef[dir];
		}
		if(value != null && value != undefined) { // found value on data. 
			// TODO 이부분 다른 처리 필요?
			// 데이터를 읽어 올때는 다른 attribute를 사용하여야 되는가?
			// data-bind="value: text" & data-bind="text: text" 이렇게 두개가 존재할떄 나중에 빈값이 덮어 쓸수도 있다. 
			currentRef[path_directory[path_directory.length-1]] = value;
		}
		return true;
	}
	
	/**
	 * 오브젝트에 정해진 위치에 데이터를 가져온다.
	 * @param object 데이터를 저장할 대상.
	 * @param path dot notation으로 구분된 경로.
	 * @returns {boolean} 성공적으로 값을 셋했는지 여부
	 */
	function getValueOnObject(object, path) {
		if(path == '') { // root를 선택하는 경우, path가 ''인 케이스가 생김.
			return object;
		}
		var path_directory = path.split('.');
		var currentRef = object;
		if(path_directory.length < 1) {return ;}
		for(var i=0; i<path_directory.length-1; i++) { /* iterate from 0 to length-1 */
			var dir = path_directory[i];
			if(!currentRef[dir]) {return ;}
			currentRef = currentRef[dir];
		}
		return currentRef[path_directory[path_directory.length-1]];
	}
	
	function getElementSelector(element) {
		var selector = element.tagName.toLowerCase();
		if(element.id) {
			selector += '#' + element.id;
		} else {
			if(!element.getAttribute('data-id')) { // element별로 구분이 필요한 경우, data-id 속성에 id 지정해서 셀렉터로 사용한다. ide에서 필요 시 지정하고, 사람이 직접 작업할 경우는 id로 사용하면 됨.  
				element.setAttribute('data-id', this.generateRandomName());
			}
			selector += '[data-id="'+element.getAttribute('data-id')+'"]';
		}
		if(element.className && element.className.replace) {
			selector += ('.' + element.className.replace(/ /gi, '.'));
		}
		return selector;
	};
	
	/**
	 * [Hong-HyunMin 2016.01.21] Theme css의 사용여부를 판단하기 위한 처리.
	 */ 
	// css파일내의 class를 판단해서 테마여부를 확인하는 소스.
	function isAlopexTheme() {
	    var sheets = document.styleSheets;
	    var isTheme = false;
	    var cssPath = '';
	    var targetCssSplit = [];
	      $.each(sheets, function(index, cssFile) {
	      if (cssFile.href){
	        cssPath = cssFile.href.toString();
	        targetCssSplit = cssPath.split('/');
	        
	        var cssFileName = targetCssSplit[targetCssSplit.length - 1];
	        
	         if('alopex-ui-dark.css' == cssFileName
	            || 'alopex-ui-dark-gradation.css' == cssFileName
	            || 'alopex-ui-default.css' == cssFileName
	            || 'alopex-ui-mustard.css' == cssFileName
	            || 'alopex-ui-sk.css' == cssFileName
	            || 'alopex-ui-white.css' == cssFileName
	            || 'alopex-ui-white-gradation.css'== cssFileName
	            || 'alopex-ui-hynix.css' == cssFileName){
	        
	         var classes = cssFile.rules || cssFile.cssRules;
	         for (var x = 0; x < classes.length; x++) {
	              	if(classes[x].selectorText === '.Css-version'  ){
		              	isTheme = true;
		            		break;
	         		}
	               
	         		if(classes[x].selectorText === '.Dialog-contents' ){
	                 	isTheme = true;
	            			break;
	               	}
	         }
	      }
	      }
	     });  
	    return isTheme;
	  };

	$.extend($.alopex.util, {
		isPlusInt: isPlusInt,
		regexp: regexp,
		delayFunction: delayFunction,
		isValid: isValid,
		parseBoolean: parseBoolean,
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		getWindowHeight: getWindowHeight,
		getWindowWidth: getWindowWidth,
		getDocumentHeight: getDocumentHeight,
		getDocumentWidth: getDocumentWidth,
		getPagePosition: getPagePosition,
		getRelativePosition: getRelativePosition,
		getScrolledPosition: getScrolledPosition,
		getScrollbarWidth: getScrollbarWidth,
		isStringType: isStringType,
		isNumberType: isNumberType,
		isDateType: isDateType,
		formatDate: formatDate,
		copyNode: copyNode,
		insertSort: insertSort,
		mergeSort: mergeSort,
		sort_default: sort_default,
		sort_numeric: sort_numeric,
		sort_date: sort_date,
		getDate: getDate,
		trim: trim,
		erase: erase,
		restore: restore,
		getOptions: getOptions,
		isConverted: isConverted,
		addFloat: addFloat,
		arrayjoin: arrayjoin,
		arrayremove: arrayremove,
		parseQuerystring: parseQuerystring,
		getDateString: getDateString,
		getOSName: getOSName,
		getBrowserName: getBrowserName,
		setValueOnObject: setValueOnObject,
		getValueOnObject: getValueOnObject,
		getElementSelector: getElementSelector,
		isAlopexTheme: isAlopexTheme,
		parseJsonWithValidation: parseJsonWithValidation,
		stringifyJsonWithValidation: stringifyJsonWithValidation
	});

	$.fn.hasEventHandler = function(event, handler) {
		var registeredEventList = $._data(window, 'events');
		if (registeredEventList !== undefined && registeredEventList[event] !== undefined) {
			var handlerList = registeredEventList[event];
			for ( var i = 0; i < handlerList.length; i++) {
				if (handlerList[i].handler === handler) {
					return true;
				}
			}
		}
		return false;
	};

})(jQuery);

function isAlopexWindowPopup(){
	// 현재 window가 alopex window popup 인지 확인
	try{
		if(!$.alopex.util.isValid(window.opener)){
			return false;
		}
		
		if(window.opener.closed){
			return false;
		}
		
		if(!$.alopex.util.isValid(window.opener.$)){
			return false;
		}
		
		if(!$.alopex.util.isValid(window.opener.$.alopex)){
			return false;
		}
		
		return true;
		
	}catch(err){
		return false;
	}
}

function checkAlopexWindowParent(){
	try{
		
		if(!$.alopex.util.isValid(window.parent)
				|| !$.alopex.util.isValid(window.parent.$)
				|| !$.alopex.util.isValid(window.parent.$.alopex)
				){
			// cross-domain 처리 되었지만, parent 가 alopex 가 아닐 때
			window.parent = window;
			return false;
			
		}	
		
		// cross-domain 과 상관 없고, parent 가 alopex 일 때 (보통의 경우)
		return true;

	}catch(e){
		// cross-domain 처리 안되었을 때
		// cross-domain object access denied
		// DOMException: Blocked a frame with origin "http://175.193.38.20:9000" from accessing a cross-origin frame.(…)
		return false;
	}
}

function isAlopexIframeChild(iframeWindow){
	try{
		if(!$.alopex.util.isValid(iframeWindow)){
			return false;
		}

		if(!$.alopex.util.isValid(iframeWindow.$)){
			return false;
		}
		
		if(!$.alopex.util.isValid(iframeWindow.$.alopex)){
			return false;
		}
		
		return true;
		
	}catch(e){
		return false;
	}
}