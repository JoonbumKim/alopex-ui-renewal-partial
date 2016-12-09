//(function($) {
//	if ($.alopex.widget.scrollview) {
//		return;
//	}
//	$.alopex.widget.scrollview = {
//		scrollview: function(options) {
//			try {
//				var el = this;
//
//				$.alopex.widget.panel.refresh.apply(el);
//
//				if (window.browser === 'mobile' && typeof iScroll !== 'undefined') {
//
//					var iScrollOption = {};
//					if ((/iphone|ipad/gi).test(navigator.appVersion)) {
//						iScrollOption.useTransform = true;
//					} else {
//
//						if ($(el).find('input').length > 0 || $(el).find('textarea').length > 0) {
//							iScrollOption.useTransform = false;
//						} else {
//							iScrollOption.useTransform = true;
//						}
//					}
//					iScrollOption.onBeforeScrollStart = function(e) {
//						var target = e.target;
//						while (target.nodeType !== 1) {
//							target = target.parentNode;
//						}
//
//						if (target.tagName !== 'SELECT' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
//							e.preventDefault();
//						}
//					};
//					iScrollOption.checkDOMChanges = true;
//					el.style.position = 'relative';
//					el.scroll = new iScroll(el, iScrollOption);
//					$(window).bind('resize', function(e) {
//						try {
//							el.scroll.refresh();
//						} catch (event) {
//							throw new Error(event);
//						}
//					});
//				} else {
//					// TO fix IE7 Bug. Without this statement,
//					// scroll content will be visible.
//					$(el).css('position', 'relative');
//					$(el).css('overflow', 'hidden');
//					if (el.children.length >= 1) {
//						if (el.offsetHeight < el.children[0].offsetHeight) {
//							$(el).css('overflow-y', 'scroll');
//						}
//						if (el.offsetWidth < el.children[0].offsetWidth) {
//							$(el).css('overflow-x', 'scroll');
//						}
//					}
//				}
//			} catch (e) {
//				throw new Error('scroll create ==== ' + e);
//			}
//		},
//
//		refresh: function() {
//			var el = this;
//			if (el.scroll) {
//				el.scroll.refresh();
//			} else {
//				if (el.offsetHeight < el.children[0].offsetHeight) {
//					$(el).css('overflow-y', 'scroll');
//				}
//				if (el.offsetWidth < el.children[0].offsetWidth) {
//					$(el).css('overflow-x', 'scroll');
//				}
//			}
//			$.alopex.widget.panel.refresh.apply(el);
//
//		}
//	};
//
//	$.alopex.chainapi.push('setEnabled');
//
//})(jQuery);
