(function($) {

	$.alopex.widget.tooltip = $.alopex.inherit($.alopex.widget.object, {

		defaultClassName: 'af-tooltip Tooltip',

		getters: [],
		setters: ['tooltip', 'open', 'close', 'toggle'],

		properties: {
			tooltiptrigger: 'default',
			opentrigger: 'mouseenter',
			closetrigger: 'mouseleave',
			animation: 'none',
			animationtime: '300',
			track: 'false',
			position: 'auto',
			cssstyle: {
				'position': 'absolute',
				'top': '0px',
				'left': '0px'
			},
			currentstate: 'closed',
			opencallback: null,
			closecallback: null,
			margin: 10
		},

		style: function(el, options) {
			var $el = $(el);
			if ($el.attr('data-type') !== 'tooltip') {
				var tooltip = document.createElement('div');
				var $tooltip = $(tooltip);
				$tooltip.attr({
					'data-type': 'tooltip'
				});
				$tooltip.html($el.attr('title'));
				$tooltip.insertAfter(el);
				$tooltip.tooltip();
				return;
			}

			// default property
			this.properties.base = $(el).prev();
			__ALOG('properties', this.properties);
			$.extend(el, this.properties, options);
			$el.css(el.cssstyle);
			$el.css('display', 'none');
		},

		pre: function(el, options) {
			var title = $(el).attr('title');
			var $tooltip = $('<div data-type="tooltip">' + title + '</div>').insertAfter(el);
			$tooltip.tooltip();
		},

		init: function(el, options) {
			var $base = $(el.base);
			if ($base.length === 0) {
				return;
			}
			el.base = $base[0];
			$base.each(function() {
				this.tooltip = el;
			});
			if (el.tooltiptrigger === 'default') {
				$base.off('.alopexuitooltip');
				$base.on(el.opentrigger+'.alopexuitooltip', $.alopex.widget.tooltip._show);
				$base.on(el.closetrigger+'.alopexuitooltip', $.alopex.widget.tooltip._hide);
			} else if(el.tooltiptrigger) {
				$base.off('.alopexuitooltip');
				el.opentrigger = el.closetrigger = el.tooltiptrigger;
				$base.on(el.opentrigger+'.alopexuitooltip', $.alopex.widget.tooltip._toggle);
			}
		},

		_show: function(e) {
			var el = e.currentTarget.tooltip;
			$(el).open(el.opencallback);
		},

		_hide: function(e) {
			var el = e.currentTarget.tooltip;
			$(el).close(el.closecallback);
		},

		_toggle: function(e) {
			var el = e.currentTarget.tooltip;
			$(el).toggle();
		},

		open: function(el, callback) {
			var rop = $.alopex.util.getOptions(el);
			if($(rop.base).length) {
				el.base = rop.base;
				this.init(el, rop);
			}
			if(rop.position && rop.position !== el.position) {
				el.position = rop.position;
			}
			var $el = $(el);

			$el.css({
				'display': 'block'
			});
			var tooltipWidth = el.offsetWidth;
			var tooltipHeight = el.offsetHeight;
			var baseWidth = el.base.offsetWidth;
			var baseHeight = el.base.offsetHeight;
			var parent = el.offsetParent;
			while(parent) {
				if(parent == document.body || $(parent).css('position') === 'relative' || $(parent).css('position') === 'absolute') {
					break;
				}
				parent = parent.offsetParent;
			}
			var basePosition = $.alopex.util.getRelativePosition(el.base); // base엘리먼트의 화면 포지션..
			var coorPosition = $.alopex.util.getRelativePosition(parent); // 엘리먼트 기준.
			var baseLeft = basePosition.left - coorPosition.left;
			var baseTop = basePosition.top - coorPosition.top;

			var top = 0;
			var left = 0;
			switch (el.position) {
			case 'top':
				left = baseLeft + (baseWidth / 2) - (tooltipWidth / 2);
				top = baseTop - tooltipHeight - el.margin;
				$el.addClass('top Top');
				break;
			case 'bottom':
				left = baseLeft + (baseWidth / 2) - (tooltipWidth / 2);
				top = baseTop + baseHeight + el.margin;
				$el.addClass('bottom Bottom');
				break;
			case 'left':
				left = baseLeft - tooltipWidth - el.margin;
				top = baseTop + (baseHeight / 2) - (tooltipHeight / 2);
				$el.addClass('left Left');
				break;
			case 'right':
				left = baseLeft + baseWidth + el.margin;
				top = baseTop + (baseHeight / 2) - (tooltipHeight / 2);
				$el.addClass('right Right');
				break;
			default:
				//bottom
				left = baseLeft + (baseWidth / 2) - (tooltipWidth / 2);
			top = baseTop + baseHeight + el.margin;
			if (left < 0) {
				// right
				left = baseLeft + baseWidth + el.margin;
				top = baseTop + (baseHeight / 2) - (tooltipHeight / 2);
				$el.addClass('right Right');
			} else if (top + tooltipHeight > screen.Height) {
				left = baseLeft + (baseWidth / 2) - (tooltipWidth / 2);
				top = baseTop - tooltipHeight - el.margin;
				$el.addClass('top Top');
			} else if (left + tooltipWidth > screen.width) {
				left = baseLeft - tooltipWidth - el.margin;
				top = baseTop + (baseHeight / 2) - (tooltipHeight / 2);
				$el.addClass('left Left');
			} else {
				$el.addClass('bottom Bottom');
			}
			}
			$el.css({
				'left': left + 'px',
				'top': top + 'px'
			});

			switch (el.animation) {
			case 'slide':
				var height = el.offsetHeight;
				$(el).css('height', '0px');
				$(el).animate({
					'height': height + 'px'
				}, parseInt(el.animationtime, 10));
				$(el).css('height', 'auto');
				break;
			case 'fade':
				$(el).css('opacity', '0');
				$(el).animate({
					'opacity': '1'
				}, parseInt(el.animationtime, 10));
				break;
			default:
				$(el).css('display', 'block');
			break;
			}

			el.currentstate = 'opened';

			if ($.alopex.util.isValid(callback)) {
				if (typeof callback === 'string') {
					window[callback].apply();
				} else {
					callback.apply();
				}
			}
		},

		close: function(el, callback) {
			var $el = $(el);
			var $base = $(el.base);

			$el.removeClass('top bottom left right Top Bottom Left Right');
			switch (el.animation) {
			case 'slide':
				$(el).animate({
					'height': '0px'
				}, parseInt(el.animationtime, 10), function() {
					$(el).css({
						'height': 'auto',
						'display': 'none'
					});
				});
				break;
			case 'fade':
				$(el).fadeOut(el.animationtime, function(e) {
					$(el).css('display', 'none');
				});
				break;
			default:
				$(el).css('display', 'none');
			break;
			}
			el.currentstate = 'closed';

			if ($.alopex.util.isValid(callback)) {
				if (typeof callback === 'string') {
					window[callback].apply();
				} else {
					callback.apply();
				}
			}
		},

		toggle: function(el, callback) {
			if (el.currentstate === 'opened') {
				$(el).close(callback);
			} else {
				$(el).open(callback);
			}
		}

	});

})(jQuery);