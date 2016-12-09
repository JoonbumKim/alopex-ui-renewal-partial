(function($) {

	/*********************************************************************************************************
	 * button
	 *********************************************************************************************************/
	$.alopex.widget.basebutton = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'basebutton',
		/**
		 * property 
		 */
		// class property
		defaultClassName: 'af-basebutton',

		setters: ['basebutton'],
		getters: [],
		
		properties: {
			
		},

		eventHandlers: {
			cancel: {
				event: 'dragstart selectstart',
				handler: '_cancelEventHandler'
			}
		},

		event: function(el) {
			this.addHoverHighlight(el);
			this.addPressHighlight(el);
		},

		init: function(el) {
			if (el.tagName.toLowerCase() === 'a') {
				el.setAttribute('tabindex', '0');
			}
			if (!el.getAttribute('type')) {
				el.setAttribute('type', 'button');
			}
		}
	});

})(jQuery);

// constructor : markup, style, init, event, defer: used in timing issue