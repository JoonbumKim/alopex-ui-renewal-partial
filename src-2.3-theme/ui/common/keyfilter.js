(function($) {
	window.didKeyupHandler = "Y";
	var builtInRegexp = {
			digits: '0-9',
			lowercase: 'a-z',
			uppercase: 'A-Z',
			english: 'a-zA-Z',
			korean: '\u3131-\u3163\uac00-\ud7a3', // in IE, set value and type keyboard cause everything gone
			singlespace: ' ',
			decimal: '0-9.-'
	};
	var builtInRegexpObject = {
			
	};

	var bultInMaskedInputChar = {
			"0": builtInRegexp.digits,
			"a": builtInRegexp.lowercase,
			"A": builtInRegexp.uppercase,
			"b": builtInRegexp.digits + builtInRegexp.lowercase,
			"B": builtInRegexp.digits + builtInRegexp.uppercase,
			"E": builtInRegexp.english,
			"*": builtInRegexp.digits + builtInRegexp.english
	};
	var builtInMaskedInputRegExp = {
		"0": new RegExp('[' + bultInMaskedInputChar["0"] + ']', ''),
		"a": new RegExp('[' + bultInMaskedInputChar["a"] + ']', ''),
		"A": new RegExp('[' + bultInMaskedInputChar["A"] + ']', ''),
		"b": new RegExp('[' + bultInMaskedInputChar["b"] + ']', ''),
		"B": new RegExp('[' + bultInMaskedInputChar["B"] + ']', ''),
		"E": new RegExp('[' + bultInMaskedInputChar["E"] + ']', ''),
		"*": new RegExp('[' + bultInMaskedInputChar["*"] + ']', '')
	};

	var builtInKeyCode = {
			digits: '0-9',
			lowercase: 'A-Z',
			uppercase: 'A-Z',
			english: 'A-Z',
			korean: 'å',
			singlespace: ' ',
			decimal: '0-9.-'
	};

	var FnKeyCode = {
			8 : 'backspace',
			9 : 'tab',
			13 : 'enter',
			16 : 'shift',
			17 : 'ctrl',
			18 : 'alt',
			19 : 'pausebreak',
			20 : 'capslock',
			21 : 'han/young',
			25 : 'chinese',
			27 : 'esc',
			//32 : 'space', // space는 function키에서 제외.
			33 : 'pageup',
			34 : 'pagedown',
			35 : 'end',
			36 : 'home',
			37 : 'left',
			38 : 'up',
			39 : 'right',
			40 : 'down',
			45 : 'insert',
			46 : 'delete',
			91 : 'win-left',
			92 : 'win-right',
			93 : 'function',
			112 : 'f1',
			113 : 'f2',
			114 : 'f3',
			115 : 'f4',
			116 : 'f5',
			117 : 'f6',
			118 : 'f7',
			119 : 'f8',
			120 : 'f9',
			121 : 'f10',
			122 : 'f11',
			123 : 'f12',
			144 : 'numlock',
			145 : 'scrolllock'
	};
	

	var _to_ascii = {
			'188': '44',
			'109': '45',
			'190': '46', //period(.)
			'191': '47', //forward slash(/)
			'192': '96',
			'220': '92',
			'222': '39',
			'221': '93',
			'219': '91',
			'173': '45',
			'187': '61', //equal sign(=+) IE Key codes
			'186': '59', // IE Key codes
			'189': '45', //dash(-) IE Key codes
			'96': '48', //numpad 0
			'97': '49', //numpad 1
			'98': '50', //numpad 2
			'99': '51', //numpad 3
			'100': '52', //numpad 4
			'101': '53', //numpad 5
			'102': '54', //numpad 6
			'103': '55', //numpad 7
			'104': '56', //numpad 8
			'105': '57', //numpad 9
			'109': '45', //numpad subtract(-)
			'110': '46', //numpad decimal point(.)
			'111': '47' //numpad device(/)
	};
  

	var shiftUps = {
			'96': '~',
			'49': '!',
			'50': '@',
			'51': '#',
			'52': '$',
			'53': '%',
			'54': '^',
			'55': '&',
			'56': '*',
			'57': '(',
			'48': ')',
			'45': '_',
			'61': '+',
			'91': '{',
			'93': '}',
			'92': '|',
			'59': ':',
			'39': '\'',
			'44': '<',
			'46': '>',
			'47': '?'
	};
	
	var ATTRIBUTE = 'keyfilter';
	var MASKEDINPUT = 'maskedinput';
	

	function checkWord(text, regexp) {
		var result = text.match(regexp);
		if(text == '' || result != null && result[0] == text) {
			return true;
		}
		return false;
	}
	function checkElementWithRegExp(element, regexp) {
		if(regexp) {
			var text, inputvalue;
			text = inputvalue =  $(element).val();
			var str = '';
			while(!checkWord(text, regexp)) {
				str = text;
				text = str.substr(0, str.length-1);
			}
			if(text !== inputvalue){
				_setNewValue(text, element);
			}
		}
	}
	function checkElement(element, regexp) {
		if(regexp) {
			var text, inputvalue;
			text = inputvalue =  $(element).val();
			var str = '';
			var strend = '';
			while(!checkWord(text, regexp)) {
				str = text;
				text = str.substr(0, str.length-1);
				var lastch = str.substr(str.length-1);
				if(checkWord(lastch, regexp)) {
					strend = lastch + strend;
				}
			}
			if(text + strend != inputvalue) {
				_setNewValue((text + strend), element);
			}
		}
	}
	
	function _setNewValue(newvalue, element){
		// IE 버그(.val()로 마지막 문자 지웠는데, blur 하면 지워진 문자가 기존 value를 덮어씀. 기존 value 다 지워짐)로 인한 [blur > .val() > 커서 제일 끝으로] 수행
			$(element).blur();
			$(element).val(newvalue);
	    if (typeof element.selectionStart == "number") {
	    		element.selectionStart = element.selectionEnd = element.value.length;
	    } else if (typeof element.createTextRange != "undefined") {
	    		element.focus();
	        var range = element.createTextRange();
	        range.collapse(false);
	        range.select();
	    }
	}
	
	// builtin룰, custom룰, user add 룰 모두 검색하여 최종 룰을 array 형태로 return
	function concatRules(strRule, eventType){
		  var rule = '';
		  // keydown은 keyCode로 체크, keyup은 입력된 value로 체크
		  var definedRules = eventType.toLowerCase() === 'keydown' ? builtInKeyCode : builtInRegexp;

	      // 가이드에 "korean 타입에는 singlespace 포함됨." 이라고 나와있는데 기능 안되서 일단 부활시킴. (but, 왜 korean은 singlespace를 포함해야하는지는 의문..)
		  strRule = addSinglespaceAboutKorean(strRule);

	      var oneRule = strRule.split('|');
	      
	      for ( var i = 0; i < oneRule.length; i++) {
	          var name = oneRule[i];
	          if (definedRules[name]) {
	            rule += definedRules[name];
	          }
	        }
	      
		return rule;
	}
	
	function addSinglespaceAboutKorean(userInputRule){
		 // 가이드에 "korean 타입에는 singlespace 포함됨." 이라고 나와있는데 기능 안되서 일단 부활시킴. (but, 왜 korean은 singlespace를 포함해야하는지는 의문..)
	      // korean은 있는데, singlespace가 없으면 ... singlespace 추가
	      if(userInputRule.indexOf("korean") !== -1 && userInputRule.indexOf("singlespace") === -1) return userInputRule + "|singlespace";
	      
	      return userInputRule;
	}
	
	var keyToChar = function(key, e){
	    
		if(e.type !== 'keypress'){
			// normalize keyCode
	        if (_to_ascii.hasOwnProperty(key)) {
	          key = _to_ascii[key];
	        }
		}

        var ch = String.fromCharCode(key);

        var isUp = (key >= 65 && key <= 90) ? true : false; // uppercase
        var isLow = (key >= 97 && key <= 122) ? true : false; // lowercase
        var isShift = ( e.shiftKey ) ? e.shiftKey : ( (key == 16) ? true : false ); // shift is pressed

        // CAPSLOCK is on 무조건 대문자
        if ((ch.toUpperCase() === ch && ch.toLowerCase() !== ch && !isShift)|| //caps is on
            (ch.toUpperCase() !== ch && ch.toLowerCase() === ch && isShift)) {
          //ch = String.fromCharCode(key);
        } else if ((ch.toLowerCase() === ch && ch.toUpperCase() !== ch && !isShift)||
            (ch.toLowerCase() !== ch && ch.toUpperCase() === ch && isShift)){
          if (isUp && !isShift) {
            ch = String.fromCharCode(key + 32);
          } else if (isShift && shiftUps.hasOwnProperty(key)) {
            // get shifted keyCode value
            ch = shiftUps[key];
          }
        }
        else if (isShift && shiftUps.hasOwnProperty(key)) { // digits 에서 shift + 2 = @  하면 숫자 2로 인식. @ 로 인식하도록 수정
            // get shifted keyCode value
            ch = shiftUps[key];
        }
        
        return ch;
	}

	var keyDownDatafilterHandler = function(e) {
		var key = e.which || e.charCode || e.keyCode;
	    
	    // allow copy&paste c = 67, v = 86
	    if ((e.ctrlKey || e.metaKey) && (key === 67 || key === 86)) {
	      return;
	    }

	    if (FnKeyCode[key])
	      return;
	    
	    if(key === 229) { // 한글 IE key입력 오작동 수정
	    		window.didKeyupHandler = "N";
	    		$(e.currentTarget).bind('blur.datafilter', e.currentTarget , ie_keyupHandler);
	    }
	    
	    var builtinRule = $(e.currentTarget).attr('data-' + ATTRIBUTE + '-rule');
	    if (typeof builtinRule == 'string') {

	      var rule = concatRules(builtinRule, e.type);

	      if (rule !== '') {

	    	  	rule = new RegExp('[' + rule + ']', 'g');
	    	
	    	  	var ch = keyToChar(key, e);

	        if(!$(e.currentTarget).attr('data-' + ATTRIBUTE) && !checkWord(ch,rule)){
	            	e.preventDefault();
	            return false;
	        }
	        
	      }
	    }
	    
	  };
	  
	  $(document).on('keydown.datafilter', '[data-' + ATTRIBUTE + '-rule],[data-' + ATTRIBUTE+']', keyDownDatafilterHandler);
	  
	var ie_keyupHandler = function (e){
		$(e.currentTarget).unbind('blur.datafilter', ie_keyupHandler);
		if(window.didKeyupHandler === "N") keyupDatafilterHandler(e);
	}

	var keyupDatafilterHandler = function (e){

		window.didKeyupHandler = "Y";
		if(FnKeyCode[e.which]) return;
		
		var rule = '';

		var $el = $(e.currentTarget);
		var builtinRule = $el.attr('data-' + ATTRIBUTE + '-rule');
		if($a.util.isValid(builtInRegexpObject[builtinRule])){
			rule = builtInRegexpObject[builtinRule];
			checkElementWithRegExp(e.currentTarget, rule);
		}else{
			if (typeof builtinRule == 'string') {
				rule = concatRules(builtinRule, e.type);
			}
			
			var customRule = $el.attr('data-' + ATTRIBUTE)
			if(typeof customRule == 'string') {
				rule += customRule;
			}

			if(rule !== '') {
				rule = new RegExp('[' + rule + ']', 'g');
				checkElement(e.currentTarget, rule);
			}
		}
		
	};
	
	$(document).on('keyup.datafilter', '[data-' + ATTRIBUTE + '-rule],[data-' + ATTRIBUTE+']', keyupDatafilterHandler);
	
	var hasMaskedInputChar = function(index, format){
		var result = null;
		for(var key in bultInMaskedInputChar){
			if(format.charAt(index) === key.toString()){
				result = builtInMaskedInputRegExp[key];
				break;
			}
		}
		return result;
	};
	
	var checkMaskedInputValue = function(el, key, e){
		var $el = $(el);
	    var format = $el.attr('data-' + MASKEDINPUT + '-rule');
	    if(typeof(format) !== 'string') return;

	    		var el = e.currentTarget;
	    		var value = el.value;
	    		var targetIndex = value.length;
	    		
	    		// 입력할 수 있는 길이 넘어갔음. 막는다.
	    		if(targetIndex >= format.length){
//	    			el.maskedinputOptions.pass = true;
    				e.preventDefault();
    				return false;
	    		}
	    		
	    		var info = el.maskedinputOptions.indexInfo;
	    		var newValue = value;
	    		var isValid = false;
	    		var regexp = null;
	    		var char = null;
	    		
	    		// 입력값이 유효한지 format의 문자열 앞에서부터 한 칸씩 체크해나간다.
	    		while(info[targetIndex] && !isValid){
	    			regexp = info[targetIndex].regexp;
	    			if(regexp instanceof RegExp){ // reverse 일 경우에도 if 조건으로 오게 된다. 무조건 검사 후 막음/통과 처리 반드시 한다.
	    				char = keyToChar(key, e);
			    	    if(checkWord(char, regexp)){
			    	    	// 입력값이 유효한 경우 format의 몇 칸까지 체크했는지 targetIndex로 기억한다.
			    	    		isValid = true;
			    	    }else{
			    	    		break;
			    	    }
			    	}else{ // MaskedInputChar 가 아니면 seperator 라는 뜻
			    		// seperator 추가 후 흘려
			    		newValue = newValue + regexp;
			    	}
	    			targetIndex++;
	    		}
	    		
	    		if(isValid){
	    			// 입력값이 유효한 경우, 체크하던 format의 나머지 문자열이 모두 seperator 만 남았는지 기억했던 targetIndex 부터 뒤로 체크해나간다.
	    			var seperators = '';
	    			var isOnlySeperatorsRemaining = true;
	    			while(info[targetIndex]){
	    				regexp = info[targetIndex].regexp;
	    				if(regexp instanceof RegExp){
	    					isOnlySeperatorsRemaining = false;
	    					break;
	    				}else{
	    					seperators += regexp;
	    				}
	    				targetIndex++;
	    			}
	    			
	    			if(isOnlySeperatorsRemaining){
	    				// 나머지가 모두 seperators 이면 keydown에서 value 완성하여 전체 입력해주고, 디폴트 이벤트(키입력)를 막는다.
	    				el.value = newValue + char + seperators;
			    		e.preventDefault();
			    		return false;
	    			}else{
	    				el.value = newValue;
		    			return true;
	    			}
	    		}else{
		    		e.preventDefault();
		    		return false;
	    		}
	}
	
	var keyDownMaskedInputHandler = function(e){
	    // 숫자, 숫자+영어(대소) 파악 후, pass/prevent
		var el = e.currentTarget;

		var key = e.which || e.charCode || e.keyCode;		

		// paste (ctrl + v) 로 값을 붙였을 때. 
		if((e.ctrlKey || e.metaKey) && key === 86){
			
			el.maskedinputOptions.previousValue = el.value;
			setTimeout(function(){
				el.value = $a.maskedinputRegExpCheck(el);
			}, 100);
			
			return;
		}
		
		// isRegExp 일때는 keypress 에서 확인한다.
		if(el.maskedinputOptions.isRegExp) return;
		
		if(key === 229) {
			e.preventDefault();
			return false; // 한글 prevent
		}
		
	    if (
	    		!el.maskedinputOptions.isDigitAndDigitEnglishOnly // 숫자, 숫자+영어(대소) 아니면
	    		|| ((e.ctrlKey || e.metaKey) && (key === 65 || key === 67 || key === 86 || key === 88)) // pass selectAll a = 65, copy&paste c = 67, v = 86, cut x = 88
	    		|| FnKeyCode[key] // pass ctrl, backspace, ... 
	    	) { 
				return; // pass
	    	}

		else if(el.maskedinputOptions.reverse){
	    		var el = e.currentTarget;
	    		if(el.value.length >= el.maskedinputOptions.format.length
	    			|| !checkWord(keyToChar(key, e), el.maskedinputOptions.reverseOneRegExp)){
				e.preventDefault();
				return false;
	    		}else{
	    			return;
	    		}
		}
	    
		return checkMaskedInputValue(el, key, e);	    
	};
	$(document).on('keydown.maskedinput', '[data-' + MASKEDINPUT + '-rule]', keyDownMaskedInputHandler);
	
	var keyPressMaskedInputHandler = function(e){
		var el = e.currentTarget;

		var key = e.which || e.charCode || e.keyCode;
		if(el.maskedinputOptions.reverse){
			
	    		var el = e.currentTarget;
	    		if(el.value.length >= el.maskedinputOptions.format.length){
				e.preventDefault();
				return false;
	    		}
    		
			var char = keyToChar(key, e);
    	    		if(!checkWord(char, el.maskedinputOptions.reverseOneRegExp)){
    	    			e.preventDefault();
    	    			return false;
    	    		}

    	    			var originalValue = el.value;
        	    		var value = originalValue + String.fromCharCode(key);
        	    		
        	    		// value el valueWithoutSeperator
        	    		var options = el.maskedinputOptions;
        	    		var valueWithoutSeperator = value.replace(options.reverseOneRegExpOpposite, '');
        	    		var vArrayLength = valueWithoutSeperator.length;
        	    		var format = options.format;
        	    		var cnt = format.length - 1;
        	    		
        	    		var charFromFormat = null;
        	    		var finalValue = '';
        	    		for(i = (vArrayLength-1) ; i >= 0 ; i--){
        	    			charFromFormat = format.charAt(cnt);
        	    			if(charFromFormat === options.reverseOneChar){ // seperator 아닌 경우
        	    				finalValue = valueWithoutSeperator.charAt(i) + finalValue;
        	    			}else{ // seperator 인 경우
        	    				finalValue = valueWithoutSeperator.charAt(i) + charFromFormat + finalValue;
        	    				cnt--;
        	    			}
        	    			cnt--;
        	    		}
        	    		el.value = finalValue;

    			e.preventDefault();
    			return false;
		}
		
	    	return checkMaskedInputValue(el, key, e);	
	};
	$(document).on('keypress.maskedinput', '[data-' + MASKEDINPUT + '-rule]', keyPressMaskedInputHandler);

	var keyUpMaskedInputHandler = function(e){
		
	};
	
	if(!$.alopex) {
		$.alopex = {};
	}
	$.alopex.keyfilter = {
		add: function(name, keycode, regexp) { // 과거방식 (keycode를 동시에 왜 저장하는지 모르겠음)\
			if(name) {
				if(keycode) {
					builtInKeyCode[name] = keycode;
				}
				if(regexp){
					builtInRegexp[name] = regexp;
				}
			}
		},
		addKeyUpRegexpRule: function(name, regexp) { // add 함수에서 regexp 와 keycode 분리하여 addRegexpRule과 addKeycodeRule 함수 만듬
			if(typeof arguments[0] === 'string' && arguments[0] !== '') {
				if(typeof arguments[1] === 'string' && arguments[1] !== ''){
					builtInRegexp[arguments[0]] = arguments[1]; // keyup에서 처리함
				}else if(arguments[1] instanceof RegExp){
					builtInRegexpObject[arguments[0]] = arguments[1];
				}
			}
		},
		addKeyDownKeycodeRule: function(name, keycode) { // add 함수에서 regexp 와 keycode 분리하여 addRegexpRule과 addKeycodeRule 함수 만듬
			if(typeof arguments[0] === 'string' && arguments[0] !== '') {
				if(typeof arguments[1] === 'string' && arguments[1] !== ''){
					builtInKeyCode[arguments[0]] = arguments[1]; // keydown에서 처리함
				}
			}
		}
	};
	
	
	$.alopex.maskedinput = function(el, format, options){
		var $el = $(el);
		if($el.length === 0
				|| !( typeof(format) === 'string' || format instanceof RegExp) ) return;

		if(!el.maskedinputOptions) {
			el.maskedinputOptions = {};
		}
		$.extend(true, el.maskedinputOptions, $.alopex.maskedinput.setup, options);
		el.maskedinputOptions.previousValue = el.value;
		el.maskedinputOptions.format = format;
		
		if(format instanceof RegExp){
			el.maskedinputOptions.isRegExp = true;
			
		}else if(typeof(format) === 'string'){
			
			el.maskedinputOptions.indexInfo = [];
			
			var reverseOneChar = null;
			var isDigitAndDigitEnglishOnly = true;
			var everyRule = '';
			var stringToRegExp = '';
			$.each(format.split(''), function(i, char){
				var regexp = hasMaskedInputChar(i, format);
				if(regexp){
					// reverse 는 하나의 char 만 있을 때 동작함. reverseOneChar 여부 파악
					if(i === 0){
						reverseOneChar = char;
					}else if(reverseOneChar !== null && reverseOneChar !== char){
						reverseOneChar = false;
					}
					
					// keydown은 숫자, 숫자+영어(대소) 2가지를 판단할 수 있다.
					if(!(char === "0" || char === "*") && isDigitAndDigitEnglishOnly) {
						isDigitAndDigitEnglishOnly = false;
					}
					
					if(everyRule.indexOf(bultInMaskedInputChar[char]) === -1){
						everyRule += bultInMaskedInputChar[char];
					}
					
					el.maskedinputOptions.indexInfo.push({index: i, regexp: regexp});
					stringToRegExp += "[" + regexp + "]{1}";
				}else{
					el.maskedinputOptions.indexInfo.push({index: i, regexp: char});
				}
			});
			
			el.maskedinputOptions.regExpFromFormat = new RegExp(stringToRegExp);
			
			if(everyRule !== ''){
				el.maskedinputOptions.everyRule = everyRule;
				el.maskedinputOptions.everyRuleRegExpOpposite = new RegExp('[^' + el.maskedinputOptions.everyRule + ']', 'g');
			}
			
			el.maskedinputOptions.isDigitAndDigitEnglishOnly = isDigitAndDigitEnglishOnly;
			
			if(el.maskedinputOptions.reverse && reverseOneChar){
				el.maskedinputOptions.reverseOneChar = reverseOneChar;
				el.maskedinputOptions.reverseOneRegExp = new RegExp('[' + bultInMaskedInputChar[reverseOneChar] + ']', 'g');
				el.maskedinputOptions.reverseOneRegExpOpposite = new RegExp('[^' + bultInMaskedInputChar[reverseOneChar] + ']', 'g');
			}else if(el.maskedinputOptions.reverse && !reverseOneChar){
				// reverse 는 하나의 char 만 있을 때 동작함
				console.error("reverse:true property needs a format with only one charactor");
				return;
			}
			
			
		}

		// 속성 추가 시, 기 정의된 이벤트가 동적 바인딩 된다.
		$el.attr("data-maskedinput-rule", format);
		var currentValue = $el.val();
		if(currentValue !== '') $el.val($.alopex.maskedinputRegExpCheck(el, currentValue));
		$el.off("focus.maskedinput");
		$el.on("focus.maskedinput", function(e){
			var $this = $(this);
			var currentValue = $this.val();
			if(currentValue !== '') {
				$this.val($.alopex.maskedinputRegExpCheck(this, currentValue));
			}
		});
	};
	
	$.alopex.maskedinput.setup = {
		reverse: false,
		lengthCheck: false
	};
	$.alopex.maskedinput.getUserOption = function(el){
		return {
				format: el.maskedinputOptions.format,
				reverse: el.maskedinputOptions.reverse,
				lengthCheck: el.maskedinputOptions.lengthCheck
			};
	};
	
	// el.value를 가져와서 formatting 후, 유효하면 formatting된 값 리턴, 유효하지 않으면 기존 el.value 
	$.alopex.maskedinputRegExpCheck = function(el, setDataValue){
		var userValue = null;
		var currentValue = null;
		if(setDataValue){
			userValue = setDataValue;
			currentValue = setDataValue;
		}else{
			userValue = el.value;
			currentValue = el.value;
		}
		currentValue = currentValue.toString();
		
		if(el.maskedinputOptions.everyRuleRegExpOpposite instanceof RegExp){
			currentValue = currentValue.replace(el.maskedinputOptions.everyRuleRegExpOpposite, '');
		}
		
		var isValid = true;
		
		// 최초 format이 RegExp 타입일 때 
		if(el.getAttribute("data-maskedinput-rule") && el.maskedinputOptions.isRegExp){
			var pattern = el.maskedinputOptions.format;
			// 패턴 테스트 true 이면 그냥 el.value 유지
			if(!pattern.test(currentValue)){
				isValid = false;
				currentValue = el.maskedinputOptions.previousValue;
			}
			
		}else{ // 최초 format이 String 타입일 때
			var numberWithSeperator = el.maskedinputOptions.indexInfo.length;
			var numberWithoutSeperator = 0;
			$.each(el.maskedinputOptions.indexInfo, function(i, v){
				if(v.regexp instanceof RegExp){
					numberWithoutSeperator++;
				}
			});
			
			// input value length가 seperator 포함된 format의 length와 같을 때
//			if(currentValue.length === numberWithSeperator && el.maskedinputOptions.lengthCheck === true){
//				$.each(el.maskedinputOptions.indexInfo, function(i, v){
//					if(v.regexp instanceof RegExp){
//						if(!v.regexp.test(currentValue.charAt(i))){
//							isValid = false;
//							currentValue = el.maskedinputOptions.previousValue;
//							return false;
//						}
//					}else{
//						if(v.regexp !== currentValue.charAt(i)){
//							isValid = false;
//							currentValue = el.maskedinputOptions.previousValue;
//							return false;
//						}
//					}
//				});
//			}else 
				if(currentValue.length === numberWithoutSeperator || el.maskedinputOptions.lengthCheck === false){
				var cnt = 0;
				var newValue = '';
				var seperatorValue = '';
				if(el.maskedinputOptions.reverse){
					currentValue = currentValue.split('').reverse().join('');
					el.maskedinputOptions.indexInfo.reverse();
				}
				$.each(el.maskedinputOptions.indexInfo, function(i, v){				
					var reg = v.regexp;
					var char = currentValue.charAt(cnt);
					if(reg instanceof RegExp){
						var flag = reg.test(char);
						if(flag){
							newValue += (seperatorValue + char);
							seperatorValue = '';
							cnt++;
						}else{
							isValid = false;
							currentValue = el.maskedinputOptions.previousValue;
							return false;
						}
					}else{
						seperatorValue += reg;
					}
				});
				currentValue = newValue;
				isValid = true;
			}else{
				isValid = false;
			}
		}

		if(el.maskedinputOptions.reverse){
			currentValue = currentValue.split('').reverse().join('');
			el.maskedinputOptions.indexInfo.reverse();
		}
		
		if(!isValid){
			if(userValue !== ''){
				var userOption = $.alopex.maskedinput.getUserOption(el);
				console.error("User Value '" + userValue +"' is mismatched with MaskedInput Option : " + JSON.stringify(userOption));
				currentValue = el.maskedinputOptions.previousValue;
			}
		}
		
		return currentValue;
	};

	
})(jQuery);