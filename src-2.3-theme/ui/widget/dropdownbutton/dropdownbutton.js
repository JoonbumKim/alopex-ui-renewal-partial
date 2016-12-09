(function($) {

	$.alopex.widget.dropdownbutton = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'dropdownbutton',
		defaultClassName: 'af-button af-dropdownbutton Dropdownbutton',
		setters: ['dropdownbutton', 'setText', 'addHandler', 'setDataSource', 'select'],
		getters: ['getText', 'getDataSource'],

		properties: {
			dropdown: null,
			update: 'true'
		},

		init: function(el, options) {
			if(el.tagName.toLowerCase() == 'div') {
				el = $(el).find('>button, >a, >input');
			}
			var $el = $(el);

			var $menu = $el.next().add($(options.menu));
			if ($menu.length === 0 || $menu[0].tagName.toLowerCase() !== 'ul') {
				return;
			}
			$.extend(el, $.alopex.widget.dropdownbutton.properties, options);
			el.dropdown = $menu[0];
			// 변환
			$(el).button();
			$menu.attr('data-type', 'dropdown').dropdown();

			el.dropdown.base = el;
		},

		defer: function(el, options) {
			if(el.tagName.toLowerCase() == 'div') {
				el = $(el).find('>button, >a, >input');
			}
			var $menu = $(el.dropdown);
			$menu.addHandler($.alopex.widget.dropdownbutton._defaultHandler);
		},

		_defaultHandler: function(e) {
			var menu = e.data.element;
			var li = e.currentTarget;
			var text = $(li).text();
			if (menu.base.update !== 'false') {
				if( $(li).find('ul').length == 0 ){
					$(menu.base).text(text);
				}
			}
			e.stopPropagation();
		},

		setText: function(el, text) {
			if(el.tagName.toLowerCase() == 'div') {
				el = $(el).find('>button, >a, >input');
			}
			$(el).text(text);
		},

		getText: function(el) {
			if(el.tagName.toLowerCase() == 'div') {
				el = $(el).find('>button, >a, >input');
			}
			return $(el).text();
		},

		addHandler: function(el, handler) {
			if(el.tagName.toLowerCase() == 'div') {
				el = $(el).find('>button, >a, >input');
			}
			$(el.dropdown).addHandler(handler);
		},

		setDataSource: function(el, data) {
			if(el.tagName.toLowerCase() == 'div') {
				el = $(el).find('>button, >a, >input');
			}
			$(el.dropdown).setDataSource(data);
		},
		
		getDataSource: function(el) {
			return $(el.dropdown).getDataSource();
		},
		
		select: function(el, param) {
			if(el.tagName.toLowerCase() == 'div') {
				el = $(el).find('>button, >a, >input');
			}
			$(el.dropdown).select(param);
		}

	});

})(jQuery);
