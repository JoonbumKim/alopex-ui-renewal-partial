(function($) {

	/*********************************************************************************************************
	 * button
	 *********************************************************************************************************/
	$.alopex.widget.groupbutton = $.alopex.inherit($.alopex.widget.group, {
		widgetName: 'groupbutton',
		defaultClassName: 'af-groupbutton Groupbutton',
		defaultThemeName: 'af-default af-horizontal',
		setters: ['groupbutton'],
		getters: [],
		
		init: function(el) {
			var $el = $(el);
			$el.on('change', 'input', function(e) {
				var input = e.currentTarget;
				if($(input).parent('label').length>0) {
					var $inputs = $el.find('input');
					for(var i=0; i<$inputs.length; i++) { // radio가 들어가 있는 경우 고려하여 loop 돌면서 체크 
						if($inputs.eq(i).is(':checked')) {
							$inputs.eq(i).parent('label').addClass('af-checked Checked');
						} else {
							$inputs.eq(i).parent('label').removeClass('af-checked Checked');
						}
					}
				}
				
			});
		}
	});

})(jQuery);

