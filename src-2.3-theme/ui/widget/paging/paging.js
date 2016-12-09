(function($) {

	/*********************************************************************************************************
	 * button
	 *********************************************************************************************************/
	$.alopex.widget.paging =
	$.alopex.widget.pagination = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'pagination',
		/**
		 * property 
		 */
		// class property
		defaultClassName: 'af-paging Paging',
		
		classNames: {
			
		},

		setters: ['pagination', 'paging', 'setTotalPage', 'setMaxPage', 'setSelectedPage', 'setCurrentPage', 'setDataLength', 'setPerPage', 'setPageLink'],
		getters: ['getSelectedPage', 'getCurrentPage', 'getDataLength', 'getPerPage'],

		// button widget common options
		widgetOptions: {

		},
		
		destHandler: {
			'first': {
				classname: 'af-paging-first',
				handler: '_first'
			},
			'previous': {
				classname: 'af-paging-prev',
				handler: '_prev'
			},
			'prev': {
				classname: 'af-paging-prev',
				handler: '_prev'
			},
			'previouspages': {
				classname: 'af-paging-prevgroup',
				handler: '_prevgroup'
			},
			'prev-group': {
				classname: 'af-paging-prevgroup',
				handler: '_prevgroup'
			},
			'next': {
				classname: 'af-paging-next',
				handler: '_next'
			},
			'nextpages': {
				classname: 'af-paging-nextgroup',
				handler: '_nextgroup'
			},
			'next-group': {
				classname: 'af-paging-nextgroup',
				handler: '_nextgroup'
			},
			'last': {
				classname: 'af-paging-last',
				handler: '_last'
			}
		},
		
		buttonHandler: {
			'First': {
				handler: '_first'
			},
			'Prev': {
				handler: '_prev'
			},
			'Prev-group': {
				handler: '_prevgroup'
			},
			'Next': {
				handler: '_next'
			},
			'Next-group': {
				handler: '_nextgroup'
			},
			'Last': {
				handler: '_last'
			}
		},
			
		// element options
		options: {

		},

		// 엘리먼트 내 이벤트 바인딩 해야 되는 부분
		// selector가 없는 경우에는 element에 등록됨.
		eventHandlers: {
		},
		
		properties: {
			maxpage: 10,
			pagelink: 10,
			totalpage: 10,
			startpage: 1, // 현재 그룹의 시작 페이지
			endpage: 10, // 현재 그룹의 마지막 페이지
			perpage: 10,
			datalength: 0,
			selectedPage: 1,
			pagingType: null
		},
		
		getPerPage: function(el) {
			return el.perpage;
		},
		
		getDataLength: function(el) {
			return el.datalength;
		},
		
		setCurrentPage: function(el) {
			return this.setSelectedPage(el);
		},
		
		setDataLength: function(el, datalength) {
			el.datalength = datalength;
			$(el).attr('data-datalength', datalength);
			el.totalpage = Math.ceil(el.datalength / el.perpage);
			this.setTotalPage(el, el.totalpage);
		},
		
		setPerPage: function(el, perpage) {
			el.perpage = perpage;
			$(el).attr('data-perpage', perpage);
			el.totalpage = Math.ceil(el.datalength / el.perpage);
			this.setTotalPage(el, el.totalpage);
		},

		event: function(el) {
//			this.addHoverHighlight(el);
//			this.addPressHighlight(el);
		},
		
		

		init: function(el, options) {
			var $el = $(el);
			var $links = $(el).find('a:not([data-dest], .Prev, .Prev-group, .First, .Next, .Next-group, .Last)');
			$links.each(function(index, el) {
				$links.eq(index).attr('data-page', index+1);
			});
			$.extend(el, {
				pages: null,
				nextbutton: $el.find('[data-dest*="next"], .next').eq(0)
			}, this.properties, options);
			
			el.pagelink = el.maxpage = parseInt($el.attr('data-maxpage'), 10) || parseInt($el.attr('data-pagelink'), 10) || $links.length || el.maxpage;
			$(el).attr('data-maxpage', el.maxpage);
			$(el).attr('data-pagelink', el.pagelink);

			// data-_generateLink : 이 플래그 있을 시 page 링크 자동 추가.
			el.pagingType = $el.attr('data-generateLink');
			this._generateLink(el);
			
			el.datalength = ($el.attr('data-datalength')) ? parseInt($el.attr('data-datalength'), 10) : el.datalength;
			$(el).attr('data-datalength', el.datalength);
			
			el.perpage = ($el.attr('data-perpage')) ? parseInt($el.attr('data-perpage'), 10) : el.perpage;
			$(el).attr('data-perpage', el.perpage);
			
//			el.totalpage = ($el.attr('data-totalpage')) ? parseInt($el.attr('data-totalpage'), 10) : Math.ceil(el.datalength/el.perpage);
			el.totalpage = ($el.attr('data-totalpage')) ? parseInt($el.attr('data-totalpage'), 10) : $links.length;
			
			$(el).attr('data-totalpage', el.totalpage);

			this._addPageEventHandler(el);
			this._addButtonEventHandler(el);
			var selectedPgae = parseInt($el.attr('data-selected'), 10) || parseInt($el.find('.selected').attr('data-page'), 10) || parseInt($el.find('.Selected').attr('data-page'), 10) || 1;
			this.setSelectedPage(el, selectedPgae);
			$el.bind('selectstart', function(e) {
				return false;
			});
		},

		_first : function(e) {
			var el = e.currentTarget.element;
			if (el.selectedPage !== 1) {
				var targetpage = 1;
				$.alopex.widget.pagination.setSelectedPage(el, targetpage);
				$(el).trigger('pagechange', [ targetpage ]);
			}
		},

		_last : function(e) {
			var el = e.currentTarget.element;
			if (el.selectedPage !== el.totalPage) {
				var targetpage = el.totalpage;
				$.alopex.widget.pagination.setSelectedPage(el, targetpage);
				$(el).trigger('pagechange', [ targetpage ]);
			}
		},

		_prev: function(e) {
			var el = e.currentTarget.element;
			if (el.selectedPage !== 1) {
				var targetpage = el.selectedPage - 1;
				$.alopex.widget.pagination.setSelectedPage(el, targetpage);
				$(el).trigger('pagechange', [targetpage]);
			}
		},

		_prevgroup: function(e) {
			var el = e.currentTarget.element;
			var targetpage;
			if (el.startpage !== 1) {
				targetpage = el.startpage - el.maxpage;
				$.alopex.widget.pagination.setSelectedPage(el, targetpage);
				$(el).trigger('pagechange', [targetpage]);
			} else {
//				targetpage = 1;
			}
			
		},

		_next: function(e) {
			var el = e.currentTarget.element;
			if (el.selectedPage !== el.totalpage) {
				var targetpage = el.selectedPage + 1;
				$.alopex.widget.pagination.setSelectedPage(el, targetpage);
				$(el).trigger('pagechange', [targetpage]);
			}
		},

		_nextgroup: function(e) {
			var el = e.currentTarget.element;
			var targetpage;
			if (el.endpage !== el.totalpage) {
				targetpage = el.startpage + el.maxpage;
				$.alopex.widget.pagination.setSelectedPage(el, targetpage);
				$(el).trigger('pagechange', [targetpage]);
			} else {
//				targetpage = el.totalpage;
			}
			
		},

		_addPageEventHandler : function(el) {
			__ALOG('pages === ', el.pages);
			var that = this;
			$(el.pages).on('click', function(e) {
				var alink = e.currentTarget;
				that.setSelectedPage(alink.container, alink.page);
				var el = $(alink).closest('[data-type="pagination"]');
				$(el).trigger('pagechange', [ alink.page ]);
			});
		},
		
		
		_addButtonEventHandler : function(el) {
			var $el = $(el);
			// 이동 버튼 관련 코드.
			var buttons = $el.find('[data-dest]');
			if (buttons.length == 0) { // if markup is written with new conversion.
				for ( var i in this.buttonHandler) {
					var $button = $el.find('.' + i).on('click', this[this.buttonHandler[i].handler]);
					if($button.length > 0) {
						$button[0].element = el;
					}
				}
			} else {
				for (var i = 0; i < buttons.length; i++) {
					var dest = $(buttons[i]).attr('data-dest');
					buttons[i].element = el;
					buttons.eq(i).addClass(this.destHandler[dest].classname).attr('data-type', 'button').button().on('click', this[this.destHandler[dest].handler]);
				}
			}
		},

		_removeLink: function(el) {
			for ( var i = 0; i < el.pages.length; i++) {
				if (el.tagName.toLowerCase() === 'ul') { // NH custom
					$(el.pages).parents('li').remove();
				} else {
					$(el.pages).remove();
					break;
				}
			}

		},

		_generateLink: function(el) {
			var i;
			if ($(el).find('a:not([data-dest])').length === 0) {
				for (i = 0; i < el.maxpage; i++) {
					var alink = document.createElement('a');
					if (el.pagingType !== 'mobile') {
						alink.innerHTML = i + 1 + '';
					}

					if (el.tagName.toLowerCase() === 'ul') { // NH custom
						var li = document.createElement('li');
						$(alink).appendTo(li);
						$(li).css('display', 'none');
						if (el.nextbutton.length > 0) {
							$(li).insertBefore($(el.nextbutton).parents('li'));
						} else {
							$(li).appendTo(el);
						}
					} else {
						$(alink).css('display', 'none');
						if (el.nextbutton.length > 0) {
							$(alink).insertBefore(el.nextbutton);
						} else {
							$(alink).appendTo(el);
						}
					}
				}
			}

			el.pages = $(el).find('a:not([data-dest], .Prev, .Prev-group, .First, .Next, .Next-group, .Last)');
			for (i = 0; i < el.pages.length; i++) {
				el.pages[i].page = i + 1;
				el.pages[i].index = i;
				el.pages[i].container = el;
				if (el.pagingType === 'mobile') {
					$(el.pages[i]).addClass('af-paging-mobile');
				} else {
					$(el.pages[i]).addClass('af-paging-number');
				}
			}
		},

		/**
		 * 페이지 indicator 내에 페이지 정보 수정.
		 * @param {integer} page 페이지 그룹 내에 들어갈 특정 페이지.
		 */
		_changePageGroup: function(el, page) {
			el.startpage = 1;
			el.endpage = el.maxpage;
			if (el.maxpage !== 0) {
			  while (page > el.endpage) {
			    el.startpage += el.maxpage;
			    el.endpage += el.maxpage;
			  }
			}
			if (el.endpage > el.totalpage) {
				el.endpage = el.totalpage;
			}
			for ( var i = 0; i < el.pages.length; i++) {
				if (el.startpage + i <= el.totalpage) {
					if (el.tagName.toLowerCase() === 'ul') { // NH custom
						$(el.pages[i]).parents('li').css('display', '');
					} else {
						$(el.pages[i]).css('display', '');
					}

					el.pages[i].page = el.startpage + i;
					if (el.pagingType !== 'mobile') {
						el.pages[i].innerHTML = el.startpage + i;
					}
				} else {
					if (el.tagName.toLowerCase() === 'ul') { // NH custom
						$(el.pages[i]).parents('li').css('display', 'none');
					} else {
						$(el.pages[i]).css('display', 'none');
					}
					el.pages[i].page = NaN;
				}
			}
		},

		_enableAllButton: function(el) {
			$(el).find('[data-dest], .first, .prev, .prev-group, .next, .next-group, .last')
				.setEnabled(true).css('visibility', 'visible');
		},

		_disableButton: function(el, btnType) {
			var $button = $(el).find('[data-dest="' + btnType + '"]');
			if($button.length == 0) { // 새로운 스타일에서는 
				$(el).find('.'+btnType).setEnabled(false);
			} else {
				if ($(el).attr('data-button-behavior') === 'disable') {
					$button.setEnabled(false);
				} else if ($(el).attr('data-button-behavior') === 'show'){
				} else {
					$button.css('visibility', 'hidden');
				}
			}
		},

		getSelectedPage: function(el) {
			return el.selectedPage;
		},
		
		getCurrentPage: function(el) {
			return this.getSelectedPage(el);
		},

		setTotalPage: function(el, totalpage, destpage) {
			totalpage = parseInt(totalpage, 10);
			el.totalpage = totalpage;
			$(el).attr('data-totalpage', totalpage);
			if (el.selectedPage > totalpage) {
			  el.selectedPage = totalpage;
			}
			//this._changePageGroup(el, el.selectedPage);
			if ($.alopex.util.isValid(destpage)) {
				this.setSelectedPage(el, destpage);
			} else {
			  this.setSelectedPage(el, el.selectedPage);
			}
		},

		setSelectedPage: function(el, page) {
			page = parseInt(page, 10);
			this._changePageGroup(el, page);

			var strong = $(el).find('strong');
			if (strong.length !== 0) {
				$(strong[0]).replaceWith(strong[0].children);
			}
			for ( var i = 0; i < el.pages.length; i++) {
				el.pages.eq(i).removeClass('af-paging-selected Selected');
				if (el.startpage + i === page) {
					el.pages.eq(i).addClass('af-paging-selected Selected').children().wrap('<strong></strong>');
				}
			}
			el.selectedPage = page;

			this._enableAllButton(el);
			if (el.selectedPage === 1) { // disable first button
				this._disableButton(el, 'first');
				this._disableButton(el, 'prev');
			}
			if (el.selectedPage === 1) { // disable prev button
				
			}
			if (el.startpage === 1) { // disable prev group button
				this._disableButton(el, 'prev-group');
			}
			if (el.selectedPage === el.totalpage) { // disable next button
				this._disableButton(el, 'next');
			}
			if (el.endpage === el.totalpage) { // disable next group button
				this._disableButton(el, 'next-group');
			}
			if (el.selectedPage === el.totalpage) { // disable last button
				this._disableButton(el, 'last');
			}
		},

		setMaxPage: function(el, page, destpage) {
			page = parseInt(page, 10);
			el.maxpage = page;
			el.pagelink = page;
			$(el).attr('data-pagelink', page);
			$(el).attr('data-maxpage', page);
			
			this._removeLink(el);
			this._generateLink(el);
			this._addPageEventHandler(el);
			if ($.alopex.util.isValid(destpage)) {
				this.setSelectedPage(el, destpage);
			} else {
				this.setSelectedPage(el, el.selectedPage);
			}
		},
		
		setPageLink: function(el, page, destpage) {
			return this.setMaxPage(el, page, destpage);
		}
		
	});

})(jQuery);