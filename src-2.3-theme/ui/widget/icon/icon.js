(function($) {

	$.alopex.widget.icon = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'icon',
		defaultClassName: 'af-icon Icon',

		setters: ['icon', 'setIcon'],

		setIcon: function(el, icon) {
			$(el).addClass(icon);
		},

		properties: {
			position: 'default',
			size: 14
		},

		init: function(el, options) {
			var $el = $(el);
			if ($.alopex.util.isValid(el.display)) {
				$(el).css('display', el.display);
			} else {
				$(el).css('display', 'inline-block');
			}
			var $parent = $(el.parentNode);
			if($parent.attr('class') && $parent.attr('class').indexOf('Button') != -1) { // button 클래스 하위에 적용. // alopex component만 적용?? TODO 추후 결정.
				$el.css('position', 'absolute');
				
				var position = this._getProperty(el, 'position');
				var size = this._getProperty(el, 'size');
				switch (position) {
				case 'center':
					$el.css({
						'top': '50%',
						'left': '50%',
						'margin-top': '-' + parseInt(size, 10) / 2 + 'px', // image가 14*14 이므로 size 값을 가지고 top과 left에 모두 사용 가능
						'margin-left': '-' + parseInt(size, 10) / 2 + 'px'
					});
					$parent.prepend($el);
					$parent.addClass('af-icon-center');
					
					break;
				case 'top':
					$el.css({
						'top': '10px',
						'left': '50%',
						'margin-left': '-' + parseInt(size, 10) / 2 + 'px'
					});
					$parent.prepend($el);
					$parent.addClass('af-icon-top');
					$parent.css({
						'padding-top': (parseInt(size, 10) * 5 / 4) + 'px'
					});
					break;
				case 'bottom':
					$el.css({
						'bottom': '10px',
						'left': '50%',
						'margin-left': '-' + parseInt(size, 10) / 2 + 'px'
					});
					$parent.append($el);
					$parent.addClass('af-icon-bottom');
					$parent.css({
						'padding-bottom': (parseInt(size, 10) * 5 / 4) + 'px'
					});
					break;
				case 'right':
					$el.css({
						'right': '10px',
						'top': '50%',
						'margin-top': '-' + parseInt(size, 10) / 2 + 'px'
					});
					$parent.append($el);
					$parent.addClass('af-icon-right');
					$parent.css({
						'padding-right': (14 + parseInt(size, 10) * 5 / 4) + 'px'
					});
					break;
				case 'left':
					/*falls through*/
				default:
					$el.css({
						'left': '10px',
						'top': '50%',
						'margin-top': '-' + parseInt(size, 10) / 2 + 'px'
					});
					$parent.prepend($el);
					$parent.addClass('af-icon-left');
					$parent.css('padding-left', (14 + parseInt(size, 10) * 5 / 4) + 'px');
					break;
				}
			}
		}
	});

})(jQuery);