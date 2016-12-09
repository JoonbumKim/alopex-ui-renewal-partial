/**
 * Copyright (c) 2012 SK C&C Co., Ltd. All rights reserved.
 *
 * This software is the confidential and proprietary information of SK C&C.
 * You shall not disclose such confidential information and shall use it
 * only in accordance with the terms of the license agreement you entered into
 * with SK C&C.
 */
var __ALOPEX_DEBUG = false;
var __ALOG = function() {};
if(__ALOPEX_DEBUG) { // TODO  IE에서 에러나지 않게 수정. (console.log 사용시)
	try{
		__ALOG = Function.prototype.bind ? console.log.bind(console) : function(){console.log(jQuery.makeArray(arguments).join(' '));};
	}catch(e){}
}

(function($) {
	
	$.alopex = $.extend($.alopex, {
		configMethods: {},
		widget : {},
		util: {},
		
		config: {
			pressedClassName: 'af-pressed',
			hoveredClassName: 'af-hover',
			selectedClassName: 'af-selected Selected',
			disabledClassName: 'af-disabled Disabled',
			themeName: 'af-default',
			classLoader: true,
			defaultComponentClass: {
				autocomplete: 'Autocomplete',
				accordion: 'Accordion',
				button: 'Button',
				carousel: 'Carousel',
				checkbox: 'Checkbox',
				dateinput: 'Dateinput',
//				datepicker: 'Datepicker',
				daterange: 'Daterange',
				dialog: 'Dialog',
				divselect: 'Divselect',
				dropdown: 'Dropdown',
				dropdownbutton: 'Dropdownbutton',
				group: 'Group',
				groupbutton: 'Groupbutton',
				icon: 'Icon',
				list: 'List',
				navmenu: 'Navmenu',
				overlay: 'Overlay',
				paging: 'Paging',
				panel: 'Panel',
				progressbar: 'Progressbar',
				radio: 'Radio',
				scrollview: 'Scrollview',
				select: 'Select',
				slider: 'Slider',
				spinner: 'Spinner',
				table: 'Table',
				tabs: 'Tabs',
				textarea: 'Textarea',
				textinput: 'Textinput',
				togglebutton: 'Toggle',
				tooltip: 'Tooltip',
				tree: 'Tree'
			},
			componentSelector: { /* 키로 사용되는 게 클래스명, 그 클래스 명에 사용되는 컴퍼넌트가 값으로 입력. 이 상태로 입력되어야 여러 다양한 클래스명이 컴퍼넌트로 활용되며, 클래스가 충돌되지 않는다. */
				'.Paging > .link': 'button'
			}
			
		},
		
		
		inherit: function(parent, child) {
			var obj = $.extend({}, parent, child);
			obj.eventHandlers = $.extend({}, parent.eventHandlers, child.eventHandlers);
			parent.getters = parent.getters || []; 
			parent.setters = parent.setters || [];
			child.getters = child.getters || [];
			child.setters = child.setters || [];
			obj.getters = parent.getters.concat(child.getters);
			obj.setters = parent.setters.concat(child.setters);
			obj.properties = $.extend({}, parent.properties, child.properties);
			obj.parent = parent;
			obj.markup = child.markup;
			obj.style = child.style;
			obj.event = child.event;
			obj.init = child.init;
			obj.defer = child.defer;
			return obj;
		},
		
		/**
		 * widget의 property를 등록하는 함수. 
		 * load 시점 이전에 호출하여야 한다.
		 */
		setup: function(widgetname, option) {
			if(typeof widgetname == 'string') { // 
				if ($.alopex.widget[widgetname]) { // Alopex UI Component
					$.extend($.alopex.widget[widgetname].properties, option);
				} else if ($.isFunction($.alopex.configMethods[widgetname])) {
					var args = $.makeArray(arguments).slice(1);
					$.alopex.configMethods[widgetname].apply(null, args);
				}
			} else { // alopex 공통 setup으로 사용되는 경우
				option = widgetname;
				$.extend(true, $.alopex.config, option);
			}
		},
		
		registerSetup: function(name, handler) {
			$.alopex.configMethods[name] = handler;
		},
		
		convert: function(root) {
			var startup = {
				markup: [],
				style: [],
				event: [],
				init: [],
				defer: []
			};
			if(!$.alopex.util.isValid(root)) {
				root = 'body';
			}

			// Class Loader Logic
			if($.alopex.config.classLoader) {
				for(var i in $.alopex.config.defaultComponentClass) {
					$(root).findAll('.'+ $.alopex.config.defaultComponentClass[i]).each(function(idx, element) {
						$(element).attr({
							'data-type': i,
							'data-classinit': 'true'
						});
					});
				}
				for(var i in $.alopex.config.componentSelector) { /* 컴퍼넌트화 할 셀렉터  */
					$(root).findAll(i).each(function(idx, element) {
						if($.alopex.widget[$.alopex.config.componentSelector[i]]) {
							$(element).attr({
								'data-type': $.alopex.config.componentSelector[i],
								'data-classinit': 'true'
							});
						}
					});
				}
			}
			
			// Converting Order : markup -> style -> event -> init -> defer 
			$(root).findAll('[data-type]').each(function() {
				var inits = $.alopex.widget.object._getInitHandlers(this);
				startup.markup = startup.markup.concat(inits.markup);
				startup.style = startup.style.concat(inits.style);
				startup.event = startup.event.concat(inits.event);
				startup.init = startup.init.concat(inits.init);
				startup.defer = startup.defer.concat(inits.defer);
			});

			for ( var i = 0; i < startup.markup.length; i++) {
				var object = startup.markup[i];
				if(!$.alopex.util.isConverted(object.element)) { // checkup of pre-generated element
					object.constructor.call(object.widget, object.element, $.alopex.util.getOptions(object.element));
				}
			}
			for ( var i = 0; i < startup.style.length; i++) {
				var object = startup.style[i];
				if(!$.alopex.util.isConverted(object.element)) {
					object.constructor.call(object.widget, object.element, $.alopex.util.getOptions(object.element));				
				}
			}
			for ( var i = 0; i < startup.init.length; i++) {
				var object = startup.init[i];
				if(!$.alopex.util.isConverted(object.element)) {
					object.constructor.call(object.widget, object.element, $.alopex.util.getOptions(object.element));
				}
			}
			for ( var i = 0; i < startup.event.length; i++) {
				var object = startup.event[i];
				if(!$.alopex.util.isConverted(object.element)) {
					object.constructor.call(object.widget, object.element, $.alopex.util.getOptions(object.element));
				}
			}
			for ( var i = 0; i < startup.defer.length; i++) {
				var object = startup.defer[i];
				if(!$.alopex.util.isConverted(object.element)) {
					object.constructor.call(object.widget, object.element, $.alopex.util.getOptions(object.element));
				}
			}
			
			//$(document).trigger('alopexuiready');
			// alopexuiready 이벤트는 alopexready가 발생하지 않는 상황(tabs 컨텐트 로딩 등)에서
			// init 함수가 호출되는 기준이 됨. 그러나, 시점 차이로 인해 로딩 시 발생하는 것 보다 
			// 특정 케이스에서 강제로 처리.(탭 로딩 이후 컨버트까지 처리한 이후에 발생하는 등)
		},
		
		checkBrowser: function() {
			window.browser = $.alopex.util.getBrowserName();
		},
		
		_getter: function(methodname, args) {
			if (this.length < 1) {
				return this;
			}
			var el = this[0];
			var dataType = (this.prop('alopextype'))?this.prop('alopextype'): [];
			if($.alopex.util.isValid(el.getAttribute('data-type'))) {
				dataType = $.alopex.util.arrayjoin(new Array(el.getAttribute('data-type')), dataType);
			}
			if ($.alopex.util.isValid(dataType)) {
				for(var i=0; i<dataType.length; i++) {
					var component = $.alopex.widget[dataType[i]];
					var method = component[methodname];
					if(method && typeof method == 'function'){
						if ($.alopex.util.isValid(component)) {
							var newArg = [el];
							for ( var i = 0; i < args.length; i++) {
								newArg.push(args[i]);
							}
							if(!$.alopex.util.isValid(el.alopex)) { // init process not started
								component._constructor.apply(component, [this, $.extend($.alopex.util.getOptions(this), args.length>0?args[0]:undefined)]);
							} else if(!$.alopex.util.isConverted(this)) {
								// in case the component is not converted
								//component._constructor.apply(component, [this, $.extend($.alopex.util.getOptions(this), args.length>0?args[0]:undefined)]);
								var __comp = component;
								var __args = newArg;
								$(el).one('initcomplete.alopexui', function() {
									return __comp[methodname].apply(__comp, __args);
								});
							}
							return component[methodname].apply(component, newArg);
						}
					}
				}
			}
		},
		
		_setter: function(methodname, args) {
			return this.each(function() {
				var dataType = ($(this).prop('alopextype'))?$(this).prop('alopextype'): [];
				if($.alopex.util.isValid(this.getAttribute('data-type'))) {
					dataType = $.alopex.util.arrayjoin(new Array(this.getAttribute('data-type')), dataType);
				}
				if (dataType.length > 0) {
					var newArg = [this];
					for ( var i = 0; i < args.length; i++) {
						newArg.push(args[i]);
					}
					for(var i=0; i<dataType.length; i++) {
						var component = $.alopex.widget[dataType[i]];
						var method = component[methodname];
						if(dataType[i] == methodname) { // init method
							if(component && component._constructor) { 
								component._constructor.apply(component, [this, $.extend($.alopex.util.getOptions(this), args.length>0?args[0]:undefined)]);
								break;
							}
						} else if(method && typeof method == 'function'){
							if ($.alopex.util.isValid(component)) {
								if(!$.alopex.util.isValid(this.alopex)) { // init process not started 
									component._constructor.apply(component, [this, $.extend($.alopex.util.getOptions(this), args.length>0?args[0]:undefined)]);
									component[methodname].apply(component, newArg);
								} else if(!$.alopex.util.isConverted(this)) { // init started, but not finished.
									// in case the componenet is not converted
									var __comp = component;
									var __args = newArg;
									$(this).one('initcomplete.alopexui', function() {
										__comp[methodname].apply(__comp, __args);
									});
								} else { // converted
									component[methodname].apply(component, newArg);
								}
								
								break;
							}
						}
					}
				} else if($.alopex.widget[methodname]) { // CASE : no data-type attribute, but constructor method called
					var component = $.alopex.widget[methodname];
					if(component.pre) {
						component.pre.apply(component, [this]);
					}
				}
			});
		}
	});
	
	$.fn.convert = function() {
		return this.each(function(){
			$.alopex.convert(this);
		});
	};
	
	$.fn.setEnabledAll = function(flag) {
		var $el = this;
		$el.find('input[data-type], select[data-type], button[data-type], textarea[data-type]').each(function() {
			$(this).setEnabled(flag);
		});
	};

})(jQuery);
