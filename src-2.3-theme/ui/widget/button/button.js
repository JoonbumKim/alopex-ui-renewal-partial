(function($) {

	/*********************************************************************************************************
	 * button
	 *********************************************************************************************************/
	$.alopex.widget.button = $.alopex.inherit($.alopex.widget.basebutton, {
		widgetName: 'button',
		defaultClassName: 'af-button Button',
		setters: ['button'],
		getters: [],

		init: function(el) {
			var $el = $(el);
			if ($el.attr('data-role') == 'toggle') { 
				// basebutton : to keep prev version compatibility 
				$el.attr('data-type', 'togglebutton').togglebutton();
			}
		}
	});

})(jQuery);

