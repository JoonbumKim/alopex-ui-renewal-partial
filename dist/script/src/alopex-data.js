/*! Alopex UI - v2.3.6.18 - 2016-12-09
* http://ui.alopex.io
* Copyright (c) 2016 alopex.ui; Licensed Copyright. SK C&C. All rights reserved. */
!function($) {
	
	var PARAMETER_ATTRIBUTE = 'data-parameter';
	var SERVICE_ATTRIBUTE = 'data-service';
	var FORMATTER_ATTRIBUTE = 'data-bind-format';
	var BIND_ATTRIBUTE = 'data-bind';
	var SERVICE_DELIMETER = '@';
	var BINDRULE_DELIMETER = ':';
	
	
	$.fn.findAll = function(selector) {
		return this.find(selector).addBack(selector);
	};

	
	/********************************************************************************************************************************
	 * 
	 * Parser 
	 * 
	 *********************************************************************************************************************************/
	
	function Parser() {;}
	/**
	 *  segment1@segment2:segment3
	 */
	Parser.prototype.toObject = function(text) {
		var result = {}, 
			ruleChunk, 
			ruletext = text;
		ruleChunk = ruletext.split(SERVICE_DELIMETER);
		if(ruletext.indexOf(SERVICE_DELIMETER) !== -1 && ruleChunk.length === 2) { // with service
			result.firstSegment= $.trim(ruleChunk[1]);
			ruletext = $.trim(ruleChunk[0]);
		}
		ruleChunk = ruletext.split(BINDRULE_DELIMETER);
		if(ruleChunk.length < 2) {
			result.thirdSegment = ruletext;
		} else {
			result.secondSegment = $.trim(ruleChunk[0]);
			ruleChunk.shift();
			result.thirdSegment = $.trim(ruleChunk.join(BINDRULE_DELIMETER));
		}
		return result;
	};
	/**
	 * data-bind 속성값을 파싱하여 아래와 같은 형태로 리턴.
	 * {
	 * 		datakey: {
	 * 			serviceName: '',
	 * 			controlName: '',
	 * 			subcontrolName: ''
	 * 		}
	 * 	
	 * }
	 */
	Parser.prototype.parseByKey = function(text) {
		var result=[], ruleList = this.splitRules(text);
		for(var i=0; i<ruleList.length; i++) {
			var temp = ruleList[i].match(this.regexp);
			if(temp.length === 1 && temp[0] == ruleList[i]) { // rule is valid
				var ruleObject = this.toObject(ruleList[i]);
				if(ruleObject && ruleObject.thirdSegment && ruleObject.thirdSegment.indexOf('{') !== -1) {
					var subruleText = ruleObject.thirdSegment.replace(/[\{\}]/gi, '');
					var subruleList = this.splitRules(subruleText);
					for(var j=0; j<subruleList.length; j++) {
						var subruleObject = this.toObject(subruleList[j]);
						if(subruleObject) {
							result.push({
								serviceName: ruleObject.firstSegment,
								controlName: ruleObject.secondSegment,
								subcontrolName: subruleObject.secondSegment,
								key: subruleObject.thirdSegment
							});
						}
					}
				} else {
					result.push({
						serviceName: ruleObject.firstSegment,
						controlName: ruleObject.secondSegment,
						key: ruleObject.thirdSegment
					});
				}
			}
			
		}
		return result;
	};
	/**
	 * 
	 * {
	 * 		html: {
	 * 			key: 
	 * 		},
	 * 		template: {
	 * 			name: treeElement, foreach: treedata
	 * 		}
	 * }
	 */
	
	Parser.prototype.parseByControl = function(text) {
		var ruleText, wordList, i, j,
			ruleObject={}, 
			ruleList = this.splitRules(text);
		for(i=0; i<ruleList.length; i++) {
			ruleText = ruleList[i];
			wordList = ruleText.match(/[^\{\,\:\s\{\}]+/gi);
			
			for(j=0; j<wordList.length; j++) {
				ruleText = ruleText.replace(wordList[j], '"'+wordList[j]+'"');
			}
			ruleText = '{' + ruleText + '}';
			try{
				$.extend(ruleObject, JSON.parse(ruleText));
			} catch(e) {}
		}
		return ruleObject;
	};
	Parser.prototype.regexp = /[^\s,{}]+\s*:\s*(\{(\s*[^\s,{}]+\s*:\s*[^\s,{}]+\s*,?)+}|[^\s,{}]+)(\s*\@\s*[^\s,{}]+)?/gi;
	Parser.prototype.splitRules = function(text) {
		if(text && text.match) {
			return text.match(this.regexp) || [];
		}
		return [];
	};
	Parser.prototype.isValidServiceData = function(text, servicekey) {
		var splitted = text.split(SERVICE_DELIMETER);
		if(splitted.length > 1 && $.trim(splitted[1]) === servicekey) {
			return true;
		} 
		return false;
	};
	var parser = $.alopex.BindParser = new Parser();

	
	
	/********************************************************************************************************************************
	 * 
	 * Private Functions 
	 * 
	 *********************************************************************************************************************************/
	
	
	/**
	 * 인자로 주어진 리스트에 
	 * @param elementList
	 * @param data
	 * @param attributeName
	 */
	$.alopex.setDataOnElements = function (elementList, data, attributeName, serviceName) {
		if(!data) {return ;}
		attributeName = attributeName || BIND_ATTRIBUTE;
		$.each(elementList, function(idx, element) {
			var controlName, value;
			var attributeValue = $(element).attr(attributeName);
			// parse bindrule from element
			
			var rule = $.alopex.BindParser.parseByKey(attributeValue);
			for(var i=0; i<rule.length; i++) {
				if(serviceName && serviceName!=rule[i].serviceName) {
					continue;
				}
				value = $.alopex.util.getValueOnObject(data, rule[i].key);
				if(value != null && value != undefined) { // found value on data.
					// call the proper render function by bindrule
					controlName = rule[i].controlName;
					
					if($.alopex.DataBinder[controlName] && $.alopex.DataBinder[controlName].render) {
						var formatter = $(element).attr(FORMATTER_ATTRIBUTE);
						if($.alopex.util.isValid(formatter)) {
							value = $.alopex.format(value, $(element).attr(FORMATTER_ATTRIBUTE));
						}
						$.alopex.DataBinder[controlName].render(element, rule[i].key, value, data, rule[i]);
					}
				}
			}
		});
	};
	
	$.alopex.getDataFromElements = function (elementList, attributeName) {
		var data = {};
		attributeName = attributeName || BIND_ATTRIBUTE;
		$.each(elementList, function(idx, element) {
			var $el = $(element);
			// foreach 컨트롤 처리하는게 아닌데, foreach 내에 위치한 값은 무시.
			var controlName, value;
			var attributeValue = $(element).attr(attributeName);
			// parse bindrule from element
			var rule = $.alopex.BindParser.parseByKey(attributeValue);
			
			if(typeof element !== 'object') { // element must be HTMLElement
				if($el.length === 0) {
					return ;
				}
				element = $el[0];
			}
			
			for(var i=0; i<rule.length; i++) {
				controlName = rule[i].controlName;
				if(controlName && $.alopex.DataBinder[controlName] && $.alopex.DataBinder[controlName].data) {
					var formatter = $(element).attr(FORMATTER_ATTRIBUTE);
					value = $.alopex.DataBinder[controlName].data(element, rule[i].key, undefined, data, rule[i]);
					if(value != undefined && value != null) { // undefined나 null 인 경우가 아니면 그냥  키 생성.
						if($.alopex.util.isValid(value) && $.alopex.util.isValid(formatter)) {
							value = $.alopex.unformat(value, $(element).attr(FORMATTER_ATTRIBUTE));
						}
						$.alopex.util.setValueOnObject(data, rule[i].key, value);
					}
				}
			}
		});
		return data;
	};
	
	function _getParsableElementInScope(rootEl, attributeName) {
		var $root = $(rootEl);
		attributeName = attributeName || BIND_ATTRIBUTE;
		return _getParsableElement($root.findAll('[' + attributeName + ']').toArray(), rootEl, attributeName);
	}
	
	function _getParsableElement(list, rootEl, attributeName) {
		var candidates = [], $root = $(rootEl);
		$(list).each(function(idx, bindEl) {
			// foreach, with 컨트롤 하위 엘리먼트는 해당 컨트롤에서 처리하기 위해서 candidates에서 제거되어야 함.
			var parents = $(bindEl).parents('['+attributeName+'*=foreach], ['+attributeName+'*=with]').eq(0);  
			if(parents.length == 0) {
				candidates.push(bindEl);
			} else {
				parents.each(function(idx, iterEl) {
					if($root.findAll(iterEl).length == 0) {
						candidates.push(bindEl);
					}
				});
			}
		});
		return candidates;
	}
	
	
	/**
	 * root 하위에 해당 attributeName 속성을 가지고 serviceKey에 매핑된 엘리먼트를 찾아준다.
	 */
	$.alopex.getCandidates = function _getSettableElement(servicekey, attributeName, root) {
		var candidates = [];
		if(!root) {root = document.body;}
		attributeName = attributeName || BIND_ATTRIBUTE;
		// setData 시점에는 가능한 candidate를 모두 입력해도 상관없다.
//		$(root).findAll('[' + SERVICE_ATTRIBUTE +'="'+servicekey+ '"]').find('['+attributeName+']').each(function(idx, el) {
//			if($(el).parents('[data-bind*="foreach"]').length>0) {
//				return;
//			}
//			candidates.push(el);
//		});
		$(root).findAll('[' + attributeName +'*="'+SERVICE_DELIMETER+servicekey+ '"]').each(function(idx, el) {
//			if($(el).parents('[data-bind*="foreach"]').length>0) {
//				return;
//			}
			candidates.push(el);
		});
		return candidates;
	};
	
	$.alopex.getBindMapping = function (element, servicekey, attributeName) {
		attributeName = attributeName || BIND_ATTRIBUTE;
		var mapping = [];
		var attr = element.getAttribute(attributeName);
		
		var rules = $.alopex.BindParser.parseByKey(attr);
		var excludeList = [];
		for(var i=0; i<rules.length; i++) {
			if(rules[i].serviceName != servicekey) {
				rules.splice(i--, 1);
			}
		}
		return rules;
	};
	
	function generateObject(object, path, value) {
		var path_directory = path.split('.');
		var currentRef = object;
		if(path_directory.length < 1) {return false;}
		for(var i=0; i<path_directory.length-1; i++) { /* iterate from 0 to length-1 */
			var dir = path_directory[i];
			if(currentRef instanceof Array) {
				if(currentRef.length==0) {
					currentRef.push({});
				} 
				currentRef = currentRef[0];
			} else {
				if(!currentRef[dir]) {
					currentRef[dir] = {};
				}
				currentRef = currentRef[dir];
			}
		}
		
		if(typeof currentRef[path_directory[path_directory.length-1]] != typeof value) {
			currentRef[path_directory[path_directory.length-1]] = value;
		}
	}
	
	/**
	 * root 엘리먼트와 서비스 키를 주면, 
	 * root 하위의 서비스 키에 매핑된 정보를 object로 리턴해준다.
	 */
	$.alopex.getBindObject = function (servicekey, attributeName, root) {
		var object = {};
		var elements = $.alopex.getCandidates(servicekey, attributeName, root);
		for(var i=0; i<elements.length; i++) {
			var bindmap = $.alopex.getBindMapping(elements[i], servicekey);
			for(var j=0; j<bindmap.length; j++) {
				if(bindmap[j].controlName == 'foreach' || bindmap[j].controlName == 'options') {
					generateObject(object, bindmap[j].key, []); // 이 경우에 []가 존재.
				} else {
					generateObject(object, bindmap[j].key, ''); // 이 경우에 []가 존재.
				}
			}
		}
		return object;
	};
	
	$.alopex.getBindMappingList = function(servicekey, attributeName, root) {
		var object = {};
		var elements = $.alopex.getCandidates(servicekey, attributeName, root);
		for(var i=0; i<elements.length; i++) {
			var bindmap = $.alopex.getBindMapping(elements[i], servicekey);
			for(var j=0; j<bindmap.length; j++) {
				object[bindmap[j].key] = {
					element: '<__ALOPEX_ELEMENT_>' + $.alopex.util.getElementSelector(elements[i]),
					control: bindmap[j].controlName,
					service: bindmap[j].serviceName
				};
			}
		}
		return object;
	}
	
	
	/**
	 * serivce key를 주고, 그 서비스에서 parameter로 사용되는 데이터를 가져온다.
	 */
	$.alopex.getDataByService = function(servicekey, attributeName) {
		var candidates = $.alopex.getCandidates(servicekey, attributeName);
		return $.alopex.getDataFromElements(candidates, attributeName);
	};
	
	$.alopex.setDataByService = function(servicekey, data, attributeName) {
		var candidates = $.alopex.getCandidates(servicekey, attributeName);
		$.alopex.setDataOnElements(candidates, data, attributeName, servicekey);
	}
	
	// NEW API!
	$.fn.setData = function(data, serviceName, attributeName) {
		var candidates;
		attributeName = attributeName || BIND_ATTRIBUTE;
		candidates = this.findAll('[' + attributeName + ']').toArray();
		$.alopex.setDataOnElements(candidates, data, attributeName, serviceName);
		return this;
	};
	$.fn.getData = function(options, attributeName) {
		var scope = this;
		attributeName = attributeName || BIND_ATTRIBUTE;
		if(options && options.selectOptions) {
			DataBinder["options"].setting.selectOption = options.selectOptions;
		} else {
			DataBinder["options"].setting.selectOption = false;
		}
		return $.alopex.getDataFromElements(_getParsableElementInScope(scope, attributeName), attributeName);
	};
	

	/********************************************************************************************************************************
	 * 
	 * Control Functions 
	 * 
	 *********************************************************************************************************************************/
	
	var DataBinder = {};
	DataBinder["html"] = {
		data: function(element, key, value, data, rule) {
			return ($(element).html());
		},
		render: function(element, key, value, data, rule) {
			element.innerHTML = value;
		}
	};
	DataBinder["text"] = {
		data: function(element, key, value, data, rule) {
			return ($(element).text());
		},
		render: function(element, key, value, data, rule) {
			if(typeof value == 'object') {
				try{
					value = JSON.stringify(value);
				} catch(e){}
			}
			element.innerText = value;
		}
	};
	DataBinder["value"] = {
		data: function(element, key, value, data, rule) {			
			var $element = $(element);
			var value = $element.val();
			if($element.attr("data-maskedinput-rule") && element.maskedinputOptions.everyRuleRegExpOpposite){
				value = value.replace(element.maskedinputOptions.everyRuleRegExpOpposite, '');
			}
			return value;
		},
		render: function(element, key, value, data, rule) {
			if(typeof value != 'undefined' && value !=null && element.value != value) {
				if(element.getAttribute("data-maskedinput-rule")){
					element.maskedinputOptions.previousValue = element.value;
					element.value = $a.maskedinputRegExpCheck(element, value);
				}else{
					element.value = value;
				}
			}
		}
	};
	DataBinder["checked"] = {
		availableValueList: {
			'y': {'true': 'y', 'false': 'n'},
			'n': {'true': 'y', 'false': 'n'},
			'yes': {'true': 'yes', 'false': 'no'},
			'no': {'true': 'yes', 'false': 'no'},
			'Y': {'true': 'Y', 'false': 'N'},
			'N': {'true': 'Y', 'false': 'N'},
			'YES': {'true': 'YES', 'false': 'NO'},
			'NO': {'true': 'YES', 'false': 'NO'},
			'0': {'true': '1', 'false': '0'},
			'1': {'true': '1', 'false': '0'},
			'true': {'true': true, 'false': false},
			'false': {'true': true, 'false': false},
			'TRUE': {'true': 'TRUE', 'false': 'FALSE'},
			'FALSE': {'true': 'TRUE', 'false': 'FALSE'},
			'True': {'true': 'True', 'false': 'False'},
			'False': {'true': 'True', 'false': 'False'}
		},
		
		data: function(element, key, value, data, rule) {
			var $element = $(element);
			var result;
			var valueList = DataBinder.checked.availableValueList;
			var type = $element.attr('data-type') || element.type;
			var valueAttr = $element.attr('value');
			var nameAttr = $element.attr('name');
			if (type === 'checkbox') { // check 박스의 데이터
				if (nameAttr) { // 여러 체크박스가 사용되는 경우,
					//var list = document.getElementsByName(nameAttr);
					var list = $('[name="' + (nameAttr) + '"]');
					var array = [];
					for ( var i=0; i<list.length; i++) {
						if (list[i].checked) {
							array.push(list[i].value);
						}
					}
					result = array;
				} else { // 한 체크박스만 사용.
					var model = $element.prop('data-checked-model');
					var format;
					if(valueAttr) { // 데이터가 있을 경우, input의 value를 확인.
						format = valueAttr;
					} else if(model && model[0] && model[0].get) { // 우선 현재 가지고 있는 데이틀 확인.
						format = model[0].get();
					} 
					if(format != undefined && valueList[format]) {
						result = valueList[format][element.checked];
					} else {
						// 없으면 true / false
						result = element.checked;
					}
				}
			} else { // radio case
				if (nameAttr) { // radio button은 name이 필수적으로 필요하지만, 없을 경우 발생하는 에러 방지.
					var radioList = $('input[name="' + (nameAttr) + '"]:checked');
					if (radioList.length > 0) {
						result = $(radioList[0]).val();
					}
				}
			}
			return (result);
		},
		render: function(element, key, value, data, rule) {
			var valueList = DataBinder.checked.availableValueList;
			var truecheck = false;
			var type = $(element).attr('data-type') || element.type;
			var valueAttr = $(element).attr('value');
			if (type === 'checkbox') { // check 박스의 데이터
				if (value instanceof Array) {
					for ( var i = 0; i < value.length; i++) {
						if (element.value === value[i]) {
							truecheck = true;
							break;
						} else {
							// false
						}
					}
				} else if (typeof value === 'boolean') {
					if (value) {
						truecheck = true;
					} else {
						// false
					}
				} else if (valueAttr){ // value는 array가 아닌데, elemen
					if (valueAttr === value) {
						truecheck = true;
					} else {
						// false
					}
				} else {
					if(valueList[value] && value == valueList[value]['true']) {
						truecheck = true;
					} else {
						// false
					}
				}
			} else { // radio case
				if (element.value === value) {
					truecheck = true;
				} else {
					// false
				}
			}
			
			var parent = $(element).parent();
			
			if(truecheck) {
				element.checked = true;
				element.setAttribute('checked', true);
				
				if(parent.hasClass('ImageCheckbox') || parent.hasClass('ImageRadio')) {
					parent.addClass('Checked');
				}
			} else {
				element.checked = false;
				element.removeAttribute('checked');
				
				if(parent.hasClass('ImageCheckbox') || parent.hasClass('ImageRadio')) {
					parent.removeClass('Checked');
				}
			}
		}
	};
	DataBinder["options"] = {
		setting: {
			valueKey : undefined, // setting 변경으로 키 지정.
			textKey: undefined,
			selectOption: false
		},	
		data: function(element, key, value, data, rule) {
			var ret = [];
			if(DataBinder["options"].setting.selectOption != true) {
				return undefined;
			}
			var optionAttr;
			var valueKey = DataBinder["options"].setting.valueKey || 'value';
			var textKey = DataBinder["options"].setting.textKey || 'text';
			if(optionAttr = element.getAttribute('data-bind-option')) {
				var options = optionAttr.split(':');
				valueKey = $.trim(options[0]);
				textKey = $.trim(options[1]);
			}
			
			$(element).find('option').each(function() {
				if(!$(this).attr('data-placeholder')) {
					var obj = {};
					obj[valueKey] = $(this).attr('value');
					obj[textKey] = $(this).text();
					ret.push(obj);
				}
			});
			return ret;
		},
		render: function(element, key, value, data, rule) {
			var originElement = element; // $el.empty(); 하기 전에 기존 상태 저장
			var $el = $(element);
			var $select = null;
			if($el.attr('data-type') == 'divselect' && $el[0].tagName.toLowerCase() === 'div'){
				$select = $el.find('>select:eq(0)');
			}
			var optionAttr;
			var valueKey = DataBinder["options"].setting.valueKey;
			var textKey = DataBinder["options"].setting.textKey;
			if(optionAttr = element.getAttribute('data-bind-option')) {
				var options = optionAttr.split(':');
				valueKey = $.trim(options[0]);
				textKey = $.trim(options[1]);
			}
			var prevVal = $el.val();

			if($select){ // Divselect
				$select.empty();
			}else{ // Select
				$el.empty();
			}
			
			//empty 이후 setPlaceholder 를 통해 하위 select 요소 찾으면 무조건 없고, 에러 발생
			if (($el.attr('data-type') == 'select' || $el.attr('data-type') == 'divselect' || $el.attr('data-type') == 'mselect') && $el.attr('data-placeholder')) {
				var text = $el.attr('data-placeholder');
				$el.setPlaceholder(text);
			}
			if (value != undefined) {
				for ( var i = 0; i < value.length; i++) {
					var item = value[i];
					var option = document.createElement('option');
					if (typeof item == 'string') {
						option.setAttribute('value', item);
						option.innerHTML = item;
					} else {
						// lowercase and uppercase supported.
						var _value = '';
						if(valueKey) {
							_value = item[valueKey];
						} else if(item.value) {
							_value = item.value;
						} else if(item.VALUE) {
							_value = item.VALUE;
						} else {
							
						}
						var _text = '';
						if(textKey) {
							_text = item[textKey];
						} else if(item.text) {
							_text = item.text;
						} else if(item.TEXT) {
							_text = item.TEXT;
						} 
						option.setAttribute('value', _value);
						option.innerHTML = _text;
					}
					if($select){ // Divselect
						$select[0].appendChild(option);
					}else{ // Select
						$el[0].appendChild(option);
					}
				}
			}
			
			// "opitons 리프레쉬 이후 selectedOptions 다시 호출." [수정]
			if(originElement._waiting){
				originElement._selectedOptionsRefresh = true;
				if($.alopex.DataBinder["selectedOptions"] && $.alopex.DataBinder["selectedOptions"].render) { 
					$.alopex.DataBinder["selectedOptions"].render(originElement, key, originElement._value, data, rule);
				}
			}
			
			if($.fn.multiselect && $el.is('[data-type="mselect"]')) {
				if($.alopex.util.isConverted(element)) {
					$el.multiselect('refresh');
				}
			} else {
				// $(element).refresh(); >>>  undefined 나서 valid 추가
				if($.alopex.util.isValid(element) && $.alopex.util.isValid($el.refresh)) {
					if($el.parent('div').attr("data-type") === "divselect"){
						$el.parent('div').refresh();
					}else{
						$el.refresh();
					}
				}
			}
		}
	};
	DataBinder["selectedOptions"] = {
		data: function(element, key, value, data, rule) {
			var $el = $(element);
			if($el.attr('data-type') == 'divselect' && element.tagName === 'DIV'){
				return (element._value || $el.find('>select:eq(0)').val() || ''); // divselect 인 경우
			}else if($el.attr('data-type') == 'divselect' && element.tagName === 'SELECT'){
				return (element.divSelect._value || '');
			}else{
				return ($el.val() || '');
			}
		},
		render: function(element, key, value, data, rule) {
			
			var $select = null;
			if($(element).attr('data-type') == 'divselect' && element.tagName === 'DIV'){
				$select = $(element).find('>select:eq(0)');
			}
			
			if (value instanceof Array) {
				$(element).find("option").prop("selected", false);
				$.each(value, function(i, e) {
					$(element).find("option[value='" + e + "']").prop("selected", true);
				});
			} else {
				// 사용자가 임의로 getData( selectedOptions ) 하면 수행 안함
				// _waiting 중 option이 변경되면 수행됨
				if(element._waiting && !!element._selectedOptionsRefresh) {		
					element._waiting = false; // 대기중 해제
					value = element._value; // 대기중 리프래쉬 수행됨. 기선택값 있으면 선택
				}
				
				var hasValue = false;
				$(element).find("option").each(function(){
					if($(this).val() == value) {
						hasValue = true; // 옵션에 선택할 값이 있음
						return false;
					}
				});

				if(hasValue){ // 있으면
					if($select){
						$select.val(value);
					}else{
						$(element).val(value);
					}
					
					if(element.divSelect){
						element.divSelect._value = value.toString();
					}else{
						element._value = value.toString();
					}
					
//					element._text = value;
				}else{ // 없으면
					
					// 대기중 && 리프래쉬 되었으면 대기중 아닌 상태(false)로 해준다.
					element._waiting = true; // 대기중 설정
					// option 바뀌어 selectedOptions 리프리쉬 호출 직전 true로 바꿔준다.
					element._selectedOptionsRefresh = false; // 대기중 리프래쉬 미수행됨
					element._value = value; // 리프래쉬 후 기선택값 저장
				}
				
				var $parent = $(element).parent('div');
				if($parent && $parent.attr('data-type') == 'divselect' || element.divSelect) {
					$parent.refresh();
					//$parent.find('span').html($(element).find("option[value='" + value + "']").text());
				}
			}
			
			if($.fn.multiselect && $(element).is('[data-type="mselect"]')) {
				if($.alopex.util.isConverted(element)) {
					$(element).multiselect('refresh');
				}
			} else {
				// $(element).refresh(); >>>  undefined 나서 valid 추가
				if($.alopex.util.isValid(element) && $.alopex.util.isValid($(element).refresh)) {
					$(element).refresh();
				}
			}
		}
	};
	DataBinder["attr"] = {
		data: function(element, key, value, data, rule) {
			return $(element).attr(rule.subcontrolName);
		},
		render: function(element, key, value, data, rule) {
			$(element).attr(rule.subcontrolName, value);
		}
	};
	DataBinder["css"] = {
		render: function(element, key, value, data, rule) {
			$(element).css(rule.subcontrolName, value);
		},
		data: function(element, key, value, data, rule) {
			return $(element).css(rule.subcontrolName);
		}
	};
	DataBinder["visible"] = {
		render: function(element, key, value, data, rule) {
			if (value) {
				$(element).show();
			} else {
				$(element).hide();
			}
		},
		data: function(element, key, value, data, rule) {
			return (element.style.display != 'none');
		}
	};
	DataBinder["with"] = {
		render: function(element, key, value, data, rule) {
			$(element).setData(value);
		},
		data: function(element, key, value, data, rule) {
			var obj = {};
			$(element).find('> *').each(function(idx, element){
				$.extend(obj, $(element).getData());
			});
			return obj;
		}
	};
	DataBinder["foreach"] = {
		data: function(element, key, value, data, rule) {
			var child, 
				children = $(element).children(),
				list = [];
			for(var i=0; i<children.length; i++) {
				child = children[i];
				if($(child).attr('alopex-databind-template')) {
					continue;
				}
				list.push($(child).getData());
			}
			return list;
		},
		render: function(element, key, value, data, rule) {
			if(!(value instanceof Array)) {
				return ;
			}
			$(element).find('[alopex-databind-created=true]').remove();
			var template = $(element).data('databind-template');
			if (!template) {
				var controlRule = $.alopex.BindParser.parseByControl($(element).attr(BIND_ATTRIBUTE));
				if(controlRule && controlRule.template && controlRule.template.id) {
					template = $('#' + controlRule.template.id).html();
				} else {
					template = element.innerHTML;
					$(element).find('> *').attr('alopex-databind-template', 'true').hide();
				}
				$(element).data('databind-template', template);
			}
			for(var i=0; i<value.length; i++) {
				var newrow = $(template).clone()
								.attr('alopex-databind-created', 'true')
								.appendTo(element);
				newrow.find('[data-bind]').each(function() {
					var attr = this.getAttribute('data-bind');
					this.setAttribute('data-bind', attr.replace(new RegExp('\:'+key+'\.\\d+\.', 'gi'), ':'));
				});
				$(newrow).setData(value[i], rule.serviceName, BIND_ATTRIBUTE);
			}
			
			var eventObj;
			if(document.createEvent) {
				eventObj = document.createEvent('Event');
				eventObj.initEvent('dataupdate', true, true);
				eventObj.datalength = value.length;
				eventObj.perpage = 0;
				eventObj.totallength = 0;
				element.dispatchEvent(eventObj);
			} else {
				$(element).trigger('dataupdate', {
					datalength: value.length,
					perpage: 0,
					totallength: 0
				});
			}
			
		}
	};
	
	DataBinder["template"] = {
		getTemplate: function(element) {
			var $templateScript;
			var rule;
			var template = $(element).data('databind-template');
			if (!template) { // bindtemplate 넣기
				rule = $.alopex.BindParser.parseByControl($(element).attr(BIND_ATTRIBUTE));
				if(rule && rule.template) {
					$templateScript = $('#' + rule.template.name);
					if ($templateScript.length > 0) {
						template = $templateScript.html();
						$(element).data('databind-template', template);
					}
				}
			}
			return template;
		},
		render: function(element, key, value, data, rule) {
			var template = DataBinder.template.getTemplate(element);
			$(element).empty();			
			if($.alopex.util.isValid(value) && $.alopex.util.isValid(template)) {
				if (value instanceof Array) {
					if(value.length == 0) {
						;
					} else {
						for ( var i = 0; i < value.length; i++) {
							var $each = $(template).appendTo(element);
							$each.setData(value[i]);
						}
					}
				} else {
					var $each = $(template).clone().appendTo(element);
					$each.setData(value);
				}
			}
		},
		
		data: function(element, key, value, data, rule) {
			if(rule.subcontrolName != 'foreach') {
				return;
			}
			var template = DataBinder.template.getTemplate(element);
			rule = $.alopex.BindParser.parseByControl($(element).attr(BIND_ATTRIBUTE));
			if($.alopex.util.isValid(template) && rule && rule.template) {
				if (rule.template.foreach) { // return type is array
					var list = [];
					var children = element.children;
					for(var i=0; i<children.length; i++) {
						list.push($(children[i]).getData());
					}
					return list;
				} else if(rule.template){
					
				}
			}
		}
	};
	
	
	DataBinder["binder"] = {
			data: function(element, key, value, data, rule) {
				if(element && element.binder && element.binder.getBindElement) {
					var bindElement = element.binder.getBindElement();
					if(bindElement && bindElement.tagName) {
//						return $.alopex.util.getElementSelector(bindElement);
						return (bindElement);
					}
				}
				return '';
			},
			render: function(element, key, value, data, rule) {
				if(element && element.binder && element.binder.setBindElement) {
					var stage = document.body.querySelector('iframe').contentDocument;
//					if(value && stage.querySelector(value)) {
//						element.binder.setBindElement(stage.querySelector(value));
					if(value) {
						element.binder.setBindElement((value));
					} else {
						element.binder.removeBindElement();
					}
				}
			}
		};
	
	DataBinder["grid"] = {
		render: function(element, key, value, data, rule) {
			var $el = element.jquery? element: $(element);
			if (!$.alopex.util.isValid($(element).attr('data-alopexgrid')) || 
				!$.alopex.util.isValid($.fn.alopexGrid)) {
				return ;
			}
			if($.isPlainObject(value)) {
				// DOTO dataSet을 하면서 pagingObject를 넘기게 되면 이후에는 동적 페이징으로 작동한다.
				// 만일 동적 페이징을 사용하지 않고 한번에 모든 데이터를 로드하여 사용한다면
				// dataSet의 두번째 파라메터로 pagingObject를 넘기지 않는다.
				$el.alopexGrid('dataSet', 
					$.isArray(value.list) ? value.list : [], 
						$el.alopexGrid('readOption').pager? {
						current: value.currentPage,
						perPage: value.perPage,
						dataLength: value.totalLength
					}:undefined);
			} else if($.isArray(value)) {
				$el.alopexGrid('dataSet', value);
			}
		},
		
		data: function(element, key, value, data, rule) {
			// grid 체크
			var $el, list, pageinfo, griddata;
			$el = element.jquery? element: $(element);
			if (!$el.attr('data-alopexgrid')) {
				return ;
			}
			list = AlopexGrid.trimData($el.alopexGrid('dataGet'));
			if($el.alopexGrid('readOption').pager) {
				griddata = {list: list};
				pageinfo = $el.alopexGrid('pageInfo');
				if(pageinfo) {
					$.extend(griddata, {
						currentLength: list.length,
						currentPage: pageinfo.current,
						perPage: pageinfo.perPage,
						totalLength: pageinfo.dataLength
					});
				}
				griddata._griddata = true;
				return griddata; 
			} else {
				return list;
			}
			
		}
	};
	
	DataBinder["time"] = {
		render: function(element, key, value, data, rule) {
			var date = new Date(value);
			var timeReg = /(([0|1][0-9])|([2][0-3]))[:-]([0-5][0-9])/;
			if ( isNaN(date.getTime()) ){
			    var time = value.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
			    if (!time) {
			        return ;
			    }
			    var hours = parseInt(time[1], 10);
				/*if (hours == 12 && !time[3]) {
			        hours = 0;
			    }
			    else {
			        hours += (hours < 12 && time[3]) ? 12 : 0;
			    }*/
			        
			    date = new Date();
			    date.setHours(hours);
			    date.setMinutes(parseInt(time[2], 10) || 0);
			}
			var hhEl = element.querySelector("[data-hour]");
			var mmEl = element.querySelector("[data-minute]");
			var ampmEl = element.querySelector("[data-ampm]");
			if( date.getHours() >= 12 ){
				if ( $(element).attr('data-hours') === '12H' ){
					var hh = date.getHours() - 12 ;
					$(hhEl).val( hh < 10 ?  "0" + hh : hh);
				} else {
					$(hhEl).val( date.getHours() );
				}
				if(ampmEl) {
					$(ampmEl).val( ampmEl.pm );
				}
			}else{
				$(hhEl).val( date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
				if(ampmEl) {
					$(ampmEl).val( ampmEl.am );
				}
			}
			$(mmEl).val( date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
		},
		data: function(element, key, value, data, rule) {
			var children = $(element).children();
			var dateString ="";
			var $child;
			
			for( var idx = 0 ; idx < children.length ; idx++ ){
				$child = $(children[idx]);
				if( $child.is('[data-hour]') || $child.is('[data-minute]') || $child.is("[data-seperator]") || $child.is("[data-ampm]") ){
					if ($child.val()){
						if ( idx === 0 ){
							dateString += $child.val() ;
						} else { 
							dateString += " " + $child.val() ;	
						}
					} else if ($child.text()){
						if ( idx === 0 ){
							dateString += $child.text() ;
						} else { 
							dateString += " " + $child.text() ;	
						}
					}
				} 
			};
			return dateString;
		}
	};	
	
	
	DataBinder.addBinder = function(name, newBinder) {
		// $a.data.control('xxx',{ ... }); 로 newBinder add 시 DataBinder[name]이 undefined이면 $.extend로 합쳐지지 않아서, 빈 객체 생성 먼저 해준다
		DataBinder[name] = {};
		$.extend(DataBinder[name], newBinder);
	};
	$.alopex.DataBinder = DataBinder;
	

	$.alopex.registerSetup('databind', function(option) {
		if(option.optionsValueKey) {
			DataBinder["options"].setting.valueKey = option.optionsValueKey;
		}
		if(option.optionsTextKey) {
			DataBinder["options"].setting.textKey = option.optionsTextKey;
		}
	});
	

}(jQuery);



/********************************************************************************************************************************
 * 
 * Compatible 
 * 
 *********************************************************************************************************************************/

!function($) {
	
	function ModelItem(key, parent) {
		this._parent = parent;
		this._key = key;
	}
	ModelItem.prototype.get = function() {
		try{
			return $(this._parent._scope).getData()[this._key];
		} catch(e) {
			return ;
		}
	};
	
	ModelItem.prototype.set = function(data) {
		var object = {};
		object[this._key] = data;
		try{
			return $(this._parent._scope).setData(object);
		} catch(e) {
		}
	};
	
	function Model(scope, data) {
		this._scope = scope;
		this._data = data;
		for(var i in data) {
			if(data.hasOwnProperty(i)) {
				this[i] = new ModelItem(i, this);
			}
		}
	}
	Model.prototype.get = function() {
		return $(this._scope).getData();
	};
	
	Model.prototype.set = function(data) {
		return $(this._scope).setData(data);
	};
	
	
	// 하위 호환성 유지를 위해 필요한 함수.
	$.alopex.databind = function(data, scope){
		scope = scope || document.body;
		$(scope).setData(data);
		return new Model(scope, data);
	};
	$.alopex.datamodel = function(){
		var scope = 'body';
		if(typeof arguments[0] == 'undefined') {
			// 아무 인자도 없을 떄.
		} else if(typeof arguments[0] == 'boolean') {
			// reset만 넣는다.
		} else {
			scope = arguments[0];
		}
		var data = $(scope).getData;
		$(scope).setData(data);
		return new Model(scope, data);
	};
	
	$.fn.alopex = function(method, value) {
		if(method === 'dataSet' || method === 'setData') {
			return $(this).setData(value);
		} else if(method === 'dataGet' || method === 'getData') {
			return $(this).getData();
		}
	};
	
	$.alopex.data = {
		bind: $.alopex.databind,
		model: $.alopex.datamodel,
		control: $.alopex.DataBinder.addBinder
	};
	
	
}(jQuery);
!function($) {
	
	var FORMATTER_ATTRIBUTE = 'data-bind-format';
	$(document).ready(function(){
		$(document.body).on('focus', '['+FORMATTER_ATTRIBUTE+']', function(e) {
			var element = e.currentTarget;
			var unformatted = $.alopex.unformat(element.value, $(element).attr(FORMATTER_ATTRIBUTE));
			element.value = unformatted;
		});
		
		$(document.body).on('blur', '['+FORMATTER_ATTRIBUTE+']', function(e) {
			var element = e.currentTarget;
			var formatted = $.alopex.format(element.value, $(element).attr(FORMATTER_ATTRIBUTE));
			element.value = formatted;
		});
	});
	
	$.alopex.format = function(text, formatterName) {
		if($.alopex.Formatter[formatterName]) {
			return $.alopex.Formatter[formatterName].toFormat(text);
		} else {
			return text;
		}
	};
	
	$.alopex.unformat = function(text, formatterName) {
//		if($.alopex.Formatter[formatterName] && $.alopex.Formatter[formatterName].validate()) {
		if($.alopex.Formatter[formatterName]) {
			return $.alopex.Formatter[formatterName].toValue(text);
		} else {
			return text;
		}
	};
	
	$.alopex.Formatter = {};
	
	/**
	 * 10000000 <-> 10,000,000
	 */
	$.alopex.Formatter.currency = {
		toFormat: function(text) {
			var splitted,
				charArray,
				i, formatted, filtered;
			filtered = text.toString().replace(/[^0-9\.]/gi, '');
			if(filtered === text.toString() && (filtered.match(/\./gi) === null || filtered.match(/\./gi).length===1)) { //
				splitted = text.toString().split('.');
				charArray = splitted[0].split('');
			} else {
				return text;
			}
			
			for(i=charArray.length-3;i>0;i-=3) {
				charArray.splice(i, 0, ',');
			}
			formatted = charArray.join('');
			if(splitted.length == 2) {
				formatted += formatted[1];
			}
			return formatted;
		},
		toValue: function(formatted) {
			return formatted.replace(new RegExp(',', 'g'), '');
		},
		validate: function(ch) {
			if (ch < 32 || ch >= 48 && ch <= 57 || ch === 127) {
				return true;
			}
			return false;
		}
	};

	/**
	 * 10000000 <-> $10,000,000
	 */
	$.alopex.Formatter.dollar = {
		toFormat: function(str) {
			if (isNaN(parseInt($.alopex.Formatter.currency.toFormat(str)))) {
				return str;
			} else {
				return '$' + $.alopex.Formatter.currency.toFormat(str);
			}
		},
		toValue: function(formatted) {
			return $.alopex.Formatter.currency.toValue(formatted.replace('$', ''));
		},
		validate: function(ch) {
			return $.alopex.Formatter.currency.validate(ch);
		}
	};
	
	$.alopex.Formatter.date = {
		normalize: function() {
			return 'yyyy/MM/dd';
		},
		toFormat: function(str) {
			var match = str.match(/(\d{4})(\d{2})(\d{2})/);
			if ( match ){
				return  match[1] + '/' + match[2] + '/' + match[3];
			} else {
				return '';
			}
		},
		toValue: function(formatted) {
			//return formatted;
			return formatted.replace(new RegExp('/', 'g'), '');
		},
		validate: function(ch) {
			var match = ch.match(/(\d{4})(\d{2})(\d{2})/);   
			
			var dtYear = match[1];  
			var dtMonth = match[2];
			var dtDay= match[3];

		    if (dtMonth < 1 || dtMonth > 12) 
		        return false;
		    else if (dtDay < 1 || dtDay> 31) 
		        return false;
		    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
		        return false;
		    else if (dtMonth == 2) 
		    {
		        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
		        if (dtDay> 29 || (dtDay ==29 && !isleap)) 
		                return false;
		    }
		    return true;
		}
	};
	
	$.alopex.Formatter.time = {
			normalize : function(){
				return 'hh:mm:ss';
			},
			toFormat: function(str) {
				var match = str.match(/(\d{2})(\d{2})(\d{2})/);
				if ( match ){
					return  match[1] + ':' + match[2] + ':' + match[3];
				} else {
					return '';
				}
			},
			toValue: function(formatted) {
				//return formatted;
				return formatted.replace(new RegExp(':', 'g'), '');
			},
			validate: function(ch) {
				var match = str.match(/(\d{2})(\d{2})(\d{2})/);
				
				var HH = match[1];  
				var MM = match[2];
				var SS= match[3];

			    if (HH < 0 || HH > 24) 
			        return false;
			    else if (MM < 0 || MM > 59) 
			        return false;
			    else if (SS < 0 || SS > 59) 
			        return false;
			    return true;
			}
		};
	
	
	$.alopex.addFormatter = function(formatter) {
		$.extend(true, $.alopex.Formatter, formatter);
	};
	
}(jQuery);
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