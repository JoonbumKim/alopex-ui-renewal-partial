(function($) {

	$.alopex.widget.list = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'list',
		defaultClassName: 'af-list List',
    setters: ['list', 'refresh'],
    
		eventHandlers: {
			hover: {
				event: 'mouseover',
				handler: ''
			}
		},

		event: function(el) {
			this.addHoverHighlight(el, 'li');
			this.addPressHighlight(el, 'li');
		},

		init: function(el) {
			this.refresh.call(this, el);
		},

		refresh: function(el) {
			var i, j;
			var that = this;
			$(el).find('>li').each(function() {
				var row = this;
				if ($(row).attr('data-converted') === 'true') {
					return;
				}

				$(row).bind('click', function(e) {
					var target = e.currentTarget;
					$(target).siblings('li').removeClass('af-pressed');
					$(target).addClass('af-pressed');
				});

				if (!$.alopex.util.isValid($(row).attr('class'))) {
				  if ($(row).attr('data-role') === 'divider') {
				    $(row).addClass('af-list-divider');
				  } else {
				    $(row).addClass('af-list-row');
				  }
				}

				// 이미지(thumbnail 처리)
				var img;
				if ($(row).find('img').length === 1) {
					img = $(row).find('img')[0];
					$(img).addClass('af-list-thumbnail');
					if ($.alopex.util.parseBoolean($(img).attr('data-icon'))) {
						//						$(img).addClass('af-list-thumbnail-icon');
					} else {

					}
				}

				// Title
				$(row).find('h1, h2, h3').each(function() {
					$(this).addClass('af-list-title');
				});

				//				var icon = $(row).find('[data-icon]');
				//				if (icon.length > 0) {
				//					icon.each(function() {
				//						$(this).addClass('af-list-icon af-list-icon-' + $(this).attr('data-icon'));
				//					});
				//				}

				var btn = $(row).find('a');
				if (btn.length > 0) {
					that.addHoverHighlight(row);
					that.addPressHighlight(row);
				}
				if (btn.length === 1) {
					$(btn[0]).addClass('af-list-btn');
				} else if (btn.length === 2) {
					$(btn[0]).addClass('af-list-btn first');
					$(btn[1]).addClass('af-list-btn split');
					that.addHoverHighlight(btn[1]);
					that.addPressHighlight(btn[1]);
				}

				// accordian code
				if (row.getAttribute('data-id')) {
					row.className += ' af-accordion';
					var accordianId = row.getAttribute('data-id');
					$(el).find('#' + accordianId).css('display', 'none');
					$(row).bind('click', function(e) {
						var row = e.currentTarget;
						that.toggle(row);
					});
				}

				//				var rowHeight = row.offsetHeight;
				//				var textblock = document.createElement('div'); // text 영역 wrapper.
				//				$(textblock).attr('class', 'af-list-text');
				//				var children;
				//				if (img) {
				//					var siblings = img.parentNode.childNodes;
				//					for (j = 0; j < siblings.length;) {
				//						if (siblings[j] === img) {
				//							j++;
				//							return;
				//						}
				//						$(siblings[j]).appendTo(textblock);
				//					}
				//					$(textblock).insertAfter(img);
				//				} else if (btn && btn.length > 0) {
				//					children = btn[0].childNodes;
				//					for (j = 0; j < children.length; j) {
				//						$(children[j]).appendTo(textblock);
				//					}
				//					$(textblock).appendTo(btn[0]);
				//				} else {
				//					children = row.childNodes;
				//					for (j = 0; j < children.length; j) {
				//						$(children[j]).appendTo(textblock);
				//					}
				//					$(textblock).appendTo(row);
				//				}
				$(row).attr('data-converted', 'true');
			});
		}

	});

})(jQuery);