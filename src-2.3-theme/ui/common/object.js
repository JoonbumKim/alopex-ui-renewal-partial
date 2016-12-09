(function($) {
	/*********************************************************************************************************
	 * object
	 *********************************************************************************************************/
	$.alopex.widget.object = {

		widgetName: 'object',
		/**
		 * reference to parent class
		 * this.parent.setEnabled()
		 */
		parent: null, // parent class pointing

		/**
		 * default properties and value
		 */
		defaultClassName: 'af-object',

		/**
		 * getter & setter api
		 */
		getters: ['getEnabled'],
		setters: ['addPressHighlight', 'addHoverHighlight', 'setEnabled', 'refresh'],

		/**
		 * default properties of component class
		 */
		properties: {
			// element-based properties.
			enabled: true,
			_markup: null, // orignal markup
			_wrapper: null // root of component after converting
		},

		/**
		 * when the user want to add event handler like the following
		 */
		eventHandlers: {
//		        key: {event: 'dragstart selectstart', selector: '', data: {}, handler: '_cancelEventHandler'}
		},

		refresh: function(el) {
			var wrapper = this._getProperty(el, '_wrapper');
			var markup = this._getProperty(el, '_markup');
			if (wrapper && markup) {
				markup = $(markup)[0];
				$(wrapper).replaceWith(markup);
				$(markup)[this.widgetName]();
			}
		},

		/**
		 * in the case the markup should be changed 
		 */
		markup: function(el, options) {
			el.alopex = $.extend({}, this.properties, options);
			if(!el.alopexoptions) {
				el.alopexoptions = {};
			}
			el.alopexoptions = $.extend(el.alopexoptions, this.properties, options);
			this._setProperty(el, '_markup', el.outerHTML); 

			var render = this.renderTo(el, options);
			if (render) {
				var $template = $(render);
				var wrapper = this._generateMarkup($template[0], el);
				this._setProperty(el, '_wrapper', wrapper);
			}
		},

		/**
		 * To add default style of component
		 */
		style: function(el, options) {
			this._addDefaultClass(el);
		},

		event: function(el, options) {
			this._addEventListener(el);
		},

		init: function(el, options) {
			var datatype = ($(el).prop('alopextype'))?$(el).prop('alopextype'): [];
			datatype.push($(el).attr('data-type'));
			$(el).prop('alopextype', datatype);
		},

		defer: function(el, option) {
			if(this.setEnabled) {
				this.setEnabled(el, $.alopex.util.parseBoolean(el.alopexoptions.enabled));
				if($.alopex.util.isValid(el.alopexoptions.disabled)) {
					this.setEnabled(el, !$.alopex.util.parseBoolean(el.alopexoptions.disabled));
				}
			}
			$(el).attr('data-converted', 'true');
			$(el).trigger('initcomplete.alopexui');
//			for ( var attr in el.dataset) {
//				var functionName = 'set' + attr[0].toUpperCase() + attr.substring(1, attr.length);
//				if ($.alopex.util.isValid(this[functionName])) {
//					$(el)[functionName](el.dataset[attr]);
//				}
//			}
		},

		_getInitHandlers: function(el) {
			function __constructor(element, widget, constructor) {
				this.element = element;
				this.widget = widget;
				this.constructor = constructor;
			}

			var markups = [];
			var styles = [];
			var events = [];
			var inits = [];
			var defers = [];
			var type = $(el).attr('data-type');
			var widget = $.alopex.widget[type];
			if (widget) {
				var parent = widget;
				while (parent) {
					if (parent['markup']) {
						markups.unshift(new __constructor(el, widget, parent['markup']));
					}
					if (parent['style']) {
						styles.unshift(new __constructor(el, widget, parent['style']));
					}
					if (parent['event']) {
						events.unshift(new __constructor(el, widget, parent['event']));
					}
					if (parent['init']) {
						inits.unshift(new __constructor(el, widget, parent['init']));
					}
					if (parent['defer']) {
						// defer 함수는 조상 함수가 가장 나중에 호출된다.
						defers.push(new __constructor(el, widget, parent['defer']));
					}
					parent = parent.parent;
				}
			}

			return {
				markup: markups,
				style: styles,
				event: events,
				init: inits,
				defer: defers
			};
		},

		_constructor: function(el, option) {
			if(el) {
				var inits = $.alopex.widget.object._getInitHandlers(el);
				var argsTemplate = [];
				for ( var i = 1; i < arguments.length; i++) {
					argsTemplate[i] = arguments[i];
				}
				for ( var i = 0; i < inits.markup.length; i++) {
					argsTemplate[0] = inits.markup[i].element;
					inits.markup[i].constructor.apply(inits.markup[i].widget, argsTemplate);
				}
				for ( var i = 0; i < inits.style.length; i++) {
					argsTemplate[0] = inits.style[i].element;
					inits.style[i].constructor.apply(inits.style[i].widget, argsTemplate);
				}
				for ( var i = 0; i < inits.init.length; i++) {
					argsTemplate[0] = inits.init[i].element;
					inits.init[i].constructor.apply(inits.init[i].widget, argsTemplate);
				}
				for ( var i = 0; i < inits.event.length; i++) {
					argsTemplate[0] = inits.event[i].element;
					inits.event[i].constructor.apply(inits.event[i].widget, argsTemplate);
				}
				for ( var i = 0; i < inits.defer.length; i++) {
					argsTemplate[0] = inits.defer[i].element;
					inits.defer[i].constructor.apply(inits.defer[i].widget, argsTemplate);
				}
			}
			
		},

		/**
		 * function with '_' keyword must be the inner function 
		 * add the handler registered in eventHandlers
		 */
		_addEventListener: function(el) {
			var $el = $(el);
			// widget constructor 이벤트 처리.
			for ( var i in this.eventHandlers) {
				var args = [this.eventHandlers[i].event];
				if (this.eventHandlers[i].selector) {
					args.push(this.eventHandlers[i].selector);
				}
				if (this.eventHandlers[i].data) {
					args.push(this.eventHandlers[i].data);
				}
				args.push(this[this.eventHandlers[i].handler]);

				$el.on.apply($el, args);
			}
		},

		/**
		 * default classname assign
		 */
		_addDefaultClass: function(el) {
			var classname;
			var theme = ' ' + $.alopex.config.themeName;
			if (el.getAttribute('data-theme')) {
				theme = ' ' + el.getAttribute('data-theme');
			}			
			if(el.getAttribute('data-classinit')) {
			} else {
				// 
				if (el.className !== undefined && el.className !== '') {
					// class name define
					if (theme !== ' af-default') {
						classname = el.className + theme;
					} else {
						classname = el.className;
					}
				} else { // no class
					classname = this.defaultClassName + theme;
				}
				if ($.alopex.util.isValid(el.getAttribute('data-style')) || $.alopex.util.isValid(el.getAttribute('data-addclass'))) { // CustomStyle apply.
					var addclass = el.getAttribute('data-addclass') || el.getAttribute('data-style');
					classname += ' ' + addclass;
				}
				$(el).addClass(classname);
			}
			
		},

		/**
		 * add event handler for press event 
		 */
		addPressHighlight: function(el, selector) {
			if (selector) {
				$(el).on('move', selector, {
					classname: $.alopex.config.pressedClassName
				}, this._removeClassName);
				$(el).on('pressed', selector, {
					classname: $.alopex.config.pressedClassName
				}, this._addClassName);
				$(el).on('unpressed', selector, {
					classname: $.alopex.config.pressedClassName
				}, this._removeClassName);
			} else {
				$(el).on('move', {
					classname: $.alopex.config.pressedClassName
				}, this._removeClassName);
				$(el).on('pressed', {
					classname: $.alopex.config.pressedClassName
				}, this._addClassName);
				$(el).on('unpressed', {
					classname: $.alopex.config.pressedClassName
				}, this._removeClassName);
			}
		},

		addHoverHighlight: function(el, selector) {
			if (selector) {
				$(el).on('mouseenter focusin', selector, {
					classname: $.alopex.config.hoveredClassName
				}, this._addClassName);
				$(el).on('mouseleave focusout', selector, {
					classname: $.alopex.config.hoveredClassName
				}, this._removeClassName);
			} else {
				$(el).on('mouseenter focusin', {
					classname: $.alopex.config.hoveredClassName
				}, this._addClassName);
				$(el).on('mouseleave focusout', {
					classname: $.alopex.config.hoveredClassName
				}, this._removeClassName);
			}
		},
		
		/**
		 * remove 
		 */
		removePressHighlight: function(el, selector) {
			if (selector) {
				$(el).off('move', selector, {
					classname: $.alopex.config.pressedClassName
				}, this._removeClassName);
				$(el).off('pressed', selector, {
					classname: $.alopex.config.pressedClassName
				}, this._addClassName);
				$(el).off('unpressed', selector, {
					classname: $.alopex.config.pressedClassName
				}, this._removeClassName);
			} else {
				$(el).off('move', {
					classname: $.alopex.config.pressedClassName
				}, this._removeClassName);
				$(el).off('pressed', {
					classname: $.alopex.config.pressedClassName
				}, this._addClassName);
				$(el).off('unpressed', {
					classname: $.alopex.config.pressedClassName
				}, this._removeClassName);
			}
		},

		removeHoverHighlight: function(el, selector) {
			if (selector) {
				$(el).off('mouseenter focusin', selector, {
					classname: $.alopex.config.hoveredClassName
				}, this._addClassName);
				$(el).off('mouseleave focusout', selector, {
					classname: $.alopex.config.hoveredClassName
				}, this._removeClassName);
			} else {
				$(el).off('mouseenter focusin', {
					classname: $.alopex.config.hoveredClassName
				}, this._addClassName);
				$(el).off('mouseleave focusout', {
					classname: $.alopex.config.hoveredClassName
				}, this._removeClassName);
			}
		},

		_eventBlockHandler: function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		},

		_setProperty: function(el, key, value) {
			if (el.alopex) {
				el.alopex[key] = value;
				//          el.setAttribute('data-'+key, value);
			}

		},

		_getProperty: function(el, key) {
			return el.alopex[key];
		},

		setEnabled: function(el, boolEnabled) {
			var $el = $(el);
			if (typeof boolEnabled !== 'boolean') {
				boolEnabled = $.alopex.util.parseBoolean(boolEnabled);
			}
			if (boolEnabled) {
				this._setProperty(el, 'enabled', true);
				this._removeDisabledStyle(el);
				el.removeAttribute('disabled');
				if (el.attributes['tabindex']) {
					if($el.attr('tabindex') == -1) {
						if(el.originalTabIndex) {
							el.setAttribute('tabindex', el.originalTabIndex);
						} else {
							el.setAttribute('tabindex', '0');
						}
					}
				}
			} else {
				this._setProperty(el, 'enabled', false);
				this._addDisabledStyle(el);
				el.setAttribute('disabled', 'disabled');
				if (el.attributes['tabindex']) {
					if($el.attr('tabindex') != -1) {
						el.originalTabIndex = $el.attr('tabindex'); 
						el.setAttribute('tabindex', '-1');
					}
				}
			}
		},

		getEnabled: function(el) {
			return this._getProperty(el, 'enabled');
		},

		_addClassName: function(e) {
			var el = e.currentTarget;
			switch (el.getAttribute('data-type')) {
			case 'select' | 'textinput' | 'textarea':
				break;
			default:
				$(el).addClass(e.data.classname);
				break;
			}
		},

		_removeClassName: function(e) {
			var el = e.currentTarget;
			switch (el.getAttribute('data-type')) {
			case 'select' | 'input':
				break;
			default:
				$(el).removeClass(e.data.classname);
			}
		},

		_addDisabledStyle: function(el) {
		    $(el).addClass($.alopex.config.disabledClassName);
		    if( ($(el).hasClass("Checkbox") || $(el).hasClass("Radio")) && (($(el).parent().get(0).tagName === "LABEL") && ($(el).parent().hasClass("ImageRadio") || $(el).parent().hasClass("ImageCheckbox")))){
			$(el).parent().addClass($.alopex.config.disabledClassName);
		    }

		},

		_removeDisabledStyle: function(el) {
		    $(el).removeClass($.alopex.config.disabledClassName);
		    if( ($(el).hasClass("Checkbox") || $(el).hasClass("Radio")) && (($(el).parent().get(0).tagName === "LABEL")  && ($(el).parent().hasClass("ImageRadio") || $(el).parent().hasClass("ImageCheckbox")))){
			$(el).parent().removeClass($.alopex.config.disabledClassName);
		    }
		},

		_cancelEventHandler: function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		},

		/**
		 * componenet markup
		 * if a component's HTML markup is equal to the markup developer need to write, don't need this property
		 * idea : Component's tobe markup and put 'markupIdentifier' attribute on dynamically added element
		 */
		//*
		renderTo: function() {
			return null;
		},
		markupIdentifier: 'af-dynamic',
		_generateMarkup: function(template, el) {
			var wrapper;
			if (template.attributes[this.markupIdentifier]) {

				wrapper = template.cloneNode(true);
				wrapper.innerHTML = "";
				template.removeAttribute(this.markupIdentifier);
				$(el).wrap(wrapper);
				el = el.parentNode;
			}

			for ( var i = 0; i < template.children.length; i++) {
				var child = template.children[i];
				if (child.attributes[this.markupIdentifier]) {

					if (i > 0) {
						var newChild = child.cloneNode(true);
						$(newChild).insertAfter(el.children[i - 1]);
					} else {
						if (template.children.length === 1) {
							break;
						}
						var newChild = child.cloneNode(true);
						$(el).prepend(newChild);
					}

					child.removeAttribute(this.markupIdentifier);
				}
			}

			for ( var i = 0; i < template.children.length; i++) {
				this._generateMarkup(template.children[i], el.children[i]);
			}

			return (wrapper) ? wrapper : el;
		}
	// */
	};

})(jQuery);
