(function($) {

	$.alopex.widget.panel = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'panel',
		defaultClassName: 'af-panel Panel',

		setters: ['panel', 'refresh', 'scrollToElement'],
		getters: [],

		properties: {

		},

		eventHandlers: {},

		init: function(el, options) {
			var $el = $(el);
			if (el.getAttribute('data-fill') !== undefined) {
				$.alopex.widget.panel._fill(el);
			}
			if ($.alopex.util.parseBoolean(el.getAttribute('data-scroll'))) {
				this._makeScrollable(el);
			}
			$(window).bind('resize', $.alopex.widget.panel._resize);

			if ($el.attr('data-responsive') !== undefined) {
				$el.css('float', 'left').css('width', '100%');
				$(window).bind('resize', $.alopex.widget.panel._responsive);
				this._responsive();
			}
		},

		_responsive: function() {
			$('[data-responsive]').each(function() {
				var el = this;
				var width = 100;
				var parentWidth = parseFloat($(el).attr('data-responsive').split('-')[0]);
				var panelWidth = parseFloat($(el).attr('data-responsive').split('-')[1]);
				var clientWidth = document.documentElement.clientWidth;

				if (clientWidth <= $.alopex.responsive.threshold) {

				} else if (clientWidth > $.alopex.responsive.threshold && clientWidth <= 900) {
					width = panelWidth / parentWidth * 100;
				} else {
					width = panelWidth / parentWidth * 100;
				}
				$(el).css('width', width + '%');
			});
		},

		_makeScrollable: function(el) {
			try {
				//        var el = this;
				if (window.browser === 'mobile' && typeof iScroll !== 'undefined') {
					var iScrollOption = {};
					if ((/iphone|ipad/gi).test(navigator.appVersion)) {
						iScrollOption.useTransform = true;
					} else {

						if ($(el).find('input').length > 0 || $(el).find('textarea').length > 0) {
							iScrollOption.useTransform = false;
						} else {
							iScrollOption.useTransform = true;
						}
					}
					iScrollOption.onBeforeScrollStart = function(e) {
						var target = e.target;
						while (target.nodeType !== 1) {
							target = target.parentNode;
						}

						if (target.tagName !== 'SELECT' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
							e.preventDefault();
						}
					};
					iScrollOption.checkDOMChanges = true;
					el.style.position = 'relative';
					el.scroll = new iScroll(el, iScrollOption);
					el.scroll.onScrollEnd = function(e) {
						$(el).trigger('scrollend', e);
					};
				} else {
					// For IE7.
					$(el).css('position', 'relative');
					$(el).css('overflow', 'auto');
					if (el.children.length >= 1) {
						if (el.offsetHeight < el.children[0].offsetHeight) {
							$(el).css('overflow-y', 'scroll');
						}
						if (el.offsetWidth < el.children[0].offsetWidth) {
							$(el).css('overflow-x', 'scroll');
						}
					}
				}
			} catch (e) {
				throw new Error('[makeScrollable] ' + e);
			}
		},

		scrollToElement: function(el, selector, time) {
			if (window.browser === 'mobile') {
				el.scroll.scrollToElement(selector, time);
			} else {
				if ($(el).find(selector).length > 0) {
					el.scrollTop = $(el).find(selector)[0].offsetHeight;
				}

			}
		},

		_resize: function(e) {
			$('[data-type="panel"]').refresh();
		},

		refresh: function(el) {
			if (el.getAttribute('data-fill') !== undefined) {
				$.alopex.widget.panel._fill(el);
			}
			if ($.alopex.util.parseBoolean(el.getAttribute('data-scroll'))) {
				$.alopex.widget.panel._scroll_refresh(el);
			}
		},

		_scroll_refresh: function(el) {
			if (el.scroll) {
				el.scroll.refresh();
			} else {
				$(el).css('overflow', 'auto');
				if (el.children.length >= 1) {
					if (el.offsetHeight < el.children[0].offsetHeight) {
						$(el).css('overflow-y', 'scroll');
					}
					if (el.offsetWidth < el.children[0].offsetWidth) {
						$(el).css('overflow-x', 'scroll');
					}
				}
			}
		},

		_fill: function(el) {
			var setting = el.getAttribute('data-fill');
			var tmp = el.style.display;
			el.style.display = 'none';
			switch (setting) {
				case 'vertical':
					this.fillVertical(el);
					break;
				case 'horizontal':
					this.fillHorizontal(el);
					break;
				case 'both':
					this.fillVertical(el);
					this.fillHorizontal(el);
					break;
				default:
					break;
			}
			el.style.display = tmp;
		},

		fillVertical: function(el) {
			var parentHeight = $(el.parentNode).height() - (el.parentNode.offsetHeight - el.parentNode.clientHeight);
			var siblingHeight = 0;
			var children = el.parentNode.children;
			for ( var i = 0; i < children.length; i++) {
				if (children[i] !== el) {
					// check floated element
					if (children[i].style.position !== 'absolute') {
						siblingHeight += $(children[i]).height();
						if (!isNaN(parseInt($(children[i]).css('margin-top'), 10))) {
							siblingHeight += parseInt($(children[i]).css('margin-top'), 10);
						}
						if (!isNaN(parseInt($(children[i]).css('margin-bottom'), 10))) {
							siblingHeight += parseInt($(children[i]).css('margin-bottom'), 10);
						}
					}
				}
			}

			$(el).css('height', (parentHeight - siblingHeight) + 'px');
		},

		fillHorizontal: function(el) {
			var parentWidth = $(el.parentNode).width() - (el.parentNode.offsetWidth - el.parentNode.clientWidth);
			var siblingWidth = 0;
			var children = el.parentNode.children;
			for ( var i = 0; i < children.length; i++) {
				if (children[i] !== el) {
					if (children[i].style.position !== 'absolute') {
						siblingWidth += $(children[i]).width();
						if (!isNaN(parseInt($(children[i]).css('margin-left'), 10))) {
							siblingWidth += parseInt($(children[i]).css('margin-left'), 10);
						}
						if (!isNaN(parseInt($(children[i]).css('margin-right'), 10))) {
							siblingWidth += parseInt($(children[i]).css('margin-right'), 10);
						}
					}
				}
			}
			$(el).css('width', (parentWidth - siblingWidth) + 'px');
		}
	});

})(jQuery);

// constructor : markup, style, init, event, defer: timing issue에 사용.