(function($) {

	$.alopex.widget.navmenu = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'navmenu',
		defaultClassName: 'af-navmenu Navmenu',
		setters: ['navmenu'],
		getters: [],
		
		properties: {},

		init: function(el) {
			var that = this;
			el.eventState = 'init';
			$(el).find('ul').addClass('af-navmenu-sub').css('display', 'none');
			$(el).find('li').each(function() {
				var li = this;
				var $li = $(li);
				if ($li.find('>ul').find('>li').length > 0) {
					// li button화 하여 focus가게 하기.
					that.addHoverHighlight(li);
					that.addPressHighlight(li);

					$($li).addClass('af-expandable Expandable');
					$($li).append($(document.createElement('span')).addClass('af-navmenu-icon ArrowIcon')[0]);
				}
			});
			$(el).bind('dragstart selectstart', function(e) {
				return false;
			});
			$.alopex.widget.navmenu.resizeHandler();
			$(window).bind('resize', $.alopex.widget.navmenu.resizeHandler);
		},
		
		

		_setTabIndex: function(el) {
			var i;
			if (el && el.children) {
				var liButtons = el.children;
				for (i = 0; i < liButtons.length; i++) {
					if (i === 0) {
						$(liButtons[i]).attr('tabindex', '0');
					} else {
						$(liButtons[i]).attr('tabindex', '-1');
					}
				}
			}

			if ($(el).children().length > 0) {
				for (i = 0; i < $(el).children().length; i++) {
					$($(el).children()[i]).find('li').attr('tabindex', -1);
				}
			}
		},

		setDataSource: function(el, jsonArray) {
			$(el).empty();
			//var ul = $('<ul></ul>').appendTo(el)[0];
			$.alopex.widget.navmenu._createNode(el, jsonArray);
			el.phase = undefined;
			$(el).navmenu();
		},

		_createNode: function(el, jsonArray) {
			for ( var i = 0; i < jsonArray.length; i++) {
				var item = jsonArray[i];
				var li = $('<li></li>').appendTo(el)[0];
				if ($.alopex.util.isValid(item.id)) {
					$(li).attr('data-id', item.id);
				}
				var a = $('<a></a>').appendTo(li)[0];
				if ($.alopex.util.isValid(item.linkUrl)) {
					$(a).attr('href', item.linkUrl);
				}
				if ($.alopex.util.isValid(item.iconUrl)) {
					$('<img/>').attr('src', item.iconUrl).appendTo(li);
				}
				//        $('<span></span>').html(item.text).appendTo(a);
				$(a).text(item.text);

				if ($.alopex.util.isValid(item.items)) {
					var subul = $('<ul></ul>').appendTo(li)[0];
					$.alopex.widget.navmenu._createNode(subul, item.items);
				}
			}
		},

		resizeHandler: function() {
			var menus = $('ul[data-type="navmenu"]');
			var clientWidth = document.documentElement.clientWidth;
			if (clientWidth <= 600) { // mobile
				menus.removeClass('af-desktop').addClass('af-mobile').each(function() {
					$.alopex.widget.navmenu.removeMobileEvent(this);
					$.alopex.widget.navmenu.removeDesktopEvent(this);
					$.alopex.widget.navmenu.addMobileEvent(this);
				});

			} else {
				menus.addClass('af-desktop').removeClass('af-mobile').each(function() {
					$.alopex.widget.navmenu.removeMobileEvent(this);
					$.alopex.widget.navmenu.removeDesktopEvent(this);
					$.alopex.widget.navmenu.addDesktopEvent(this);
				});
			}
			menus.find('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
		},

		addDesktopEvent: function(el) {
			var tempEl = el;

			$(el).bind('keydown', function(e) {
				var target = e.target;

				var code = (e.keyCode ? e.keyCode : e.which);
				switch (code) {
				case 27: // ESC
					var parentNav = $(target).closest('ul');

					while ($(parentNav).attr('data-type') !== 'navmenu') {
						parentNav.find('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
						parentNav = $(parentNav.parent()).closest('ul');
					}
					$(parentNav.find('.af-navmenu-expand.Expanded').find('> a')).focus();
					parentNav.find('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					break;
				default:
					return;
				}
				e.stopPropagation();
				e.preventDefault();
			});

			$(el).bind('focusin', function(e) {
				var target = e.target;
				var parentNav = $(target).closest('ul');
				var li;
				if (parentNav !== undefined && parentNav[0] === tempEl) {
					li = $(target).closest('li')[0];
					if ($(li).attr('class') !== undefined && $(li).hasClass('af-expandable Expandable')) {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
						$(li).addClass('af-navmenu-expand Expanded').find('> ul').css('display', 'inline-block');
					} else {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					}
				} else {
					//$(tempEl).find('li').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					li = $(target).closest('li')[0];
					if ($(li).attr('class') !== undefined && $(li).hasClass('af-expandable Expandable')) {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
						$(li).addClass('af-navmenu-expand Expanded').find('> ul').css('display', 'inline-block');
					} else {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					}
				}
			});

			$(el).focusout(function(e) {
				var target = e.target;
				var parentNav = $(target).closest('ul');
				var isParent = false;
				if (target !== undefined && $(parentNav).attr('class') !== undefined && $(parentNav).attr('class').indexOf('af-navmenu') !== -1) {
					isParent = false;
				} else {
					isParent = true;
				}

				if (isParent && parentNav[0] !== tempEl) {
					$(tempEl).find('li').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
				}
			});

			$(el).bind('mouseleave', function(e) { // hoverend to mousemove
				var target = e.target;
				var parentNav = $(target).closest('ul');

				while ($(parentNav).attr('data-type') !== 'navmenu') {
					parentNav.find('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					parentNav = $(parentNav.parent()).closest('ul');
				}
				parentNav.find('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
			});

			$(el).bind('mousemove', function(e) { // hoverend to mousemove
				var target = e.target;
				var parentNav = $(target).closest('ul');
				var li;
				if (parentNav !== undefined && parentNav[0] === tempEl) {
					li = $(target).closest('li')[0];
					if ($(li).attr('class') !== undefined && $(li).hasClass('af-expandable Expandable')) {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
						$(li).addClass('af-navmenu-expand Expanded').find('> ul').css('display', 'inline-block');
					} else {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					}
				} else {
					//$(tempEl).find('li').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					li = $(target).closest('li')[0];
					if ($(li).attr('class') !== undefined && $(li).hasClass('af-expandable Expandable')) {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
						$(li).addClass('af-navmenu-expand Expanded').find('> ul').css('display', 'inline-block');
					} else {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					}
				}
			});
		},

		removeDesktopEvent: function(el) {
			$(el).unbind('click').unbind('keydown');
		},

		addMobileEvent: function(el) {
			var tempEl = el;
			$(el).find('li').bind('click', function(e) {
				var target = e.target;
				var parentNav = $(target).closest('ul');
				var li;
				if (parentNav !== undefined && parentNav[0] === tempEl) {
					li = $(target).closest('li')[0];
					if ($(li).attr('class') !== undefined && $(li).hasClass('af-expandable Expandable')) {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
						$(li).addClass('af-navmenu-expand Expanded').find('> ul').css('display', 'inline-block');
					} else {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					}
				} else {
					//$(tempEl).find('li').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					li = $(target).closest('li')[0];
					if ($(li).attr('class') !== undefined && $(li).hasClass('af-expandable Expandable')) {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
						$(li).addClass('af-navmenu-expand Expanded').find('> ul').css('display', 'inline-block');
					} else {
						$(li).siblings('.af-navmenu-expand.Expanded').removeClass('af-navmenu-expand Expanded').find('> ul').css('display', 'none');
					}
				}
			});
		},

		removeMobileEvent: function(el) {
			$(el).find('li').unbind('click');
		}
	});

})(jQuery);


