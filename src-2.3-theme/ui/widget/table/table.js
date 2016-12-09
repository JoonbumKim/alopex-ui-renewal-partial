(function($) {
	$.alopex.widget.table = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'table',

		defaultClassName: 'af-table Table',
		wrapperClassName: 'af-table-wrapper af-default ' + $.alopex.config.defaultComponentClass.table + '-wrapper',
		scrollerClassName: 'af-table-scroller ' + $.alopex.config.defaultComponentClass.table + '-scroller',

		setters: ['table', 'hideColumn', 'showColumn','tableSort'],
		getters: [],
		
//		renderTo: function(el) {
//			alert($(el).parent('div[class*="-scroller"]').length);
//			if($(el).parent('div[class*="-scoller"]').length == 0) {
//				return '<div class="' + this.wrapperClassName + '" af-dynamic>' + 
//					'<div class="' + this.scrollerClassName + '" af-dynamic>' + 
//						'<table></table>' + 
//					'</div>' + 
//				'</div>';	
//			} else {
//				return '<table></table>';
//			}
//		},

		resizeThreshold: 10,
		resizing: false,
		resizeReady: true,

		properties: {},

		style: function(el) {
		},

		event: function(el) {

		},

		tableSort: function(el, header, orderBy) {
		    $.alopex.widget.table.sort(header, orderBy);
		},

		init: function(el) {
			var $el = $(el);
			if( (!$.alopex.util.isValid($el.attr('data-scroller-use')) || $.alopex.util.parseBoolean($el.attr('data-wrapper'))) && $el.parent('div[class*="-scroller"]').length == 0) {
				$el.wrap('<div class="' + this.wrapperClassName + '" af-dynamic>');
				$el.wrap('<div class="' + this.scrollerClassName + '" af-dynamic>');
			} 
			$.extend(el, {
				scroller: null,
				hscroller: null,
				resizingHeader: null,
				scrolling: false,
				sorting: false,
				resizing: false,
				editing: false,
				highlighting: false,
				theme: null
			});
			this._addColgroup(el);
			$el.css({
				'table-layout': 'fixed'
			});
			if ($el.css('min-width') === '0px') {
				$el.css({
					'min-width': '100%'
				});
			}
			if (!$.alopex.util.isValid(el.style.width)) {
				$el.css({
					'width': '100%'
				}); // 과연 진짜 답은?
			}

			var $wrapper = $el.closest('.af-table-wrapper, .' + $.alopex.config.defaultComponentClass.table + '-wrapper');
			$wrapper.css({
				'overflow': 'hidden',
				'position': 'relative'
			});
			el.wrapper = ($wrapper.length > 0) ? $wrapper[0] : el;
			el.head = $.alopex.widget.table.getTableHead(el);
			if ($.alopex.util.isValid(el.head)) {
				el.head.table = el; // 헤더가 나눠지더라도 테이블 참조할 수 있도록.
				$(el.head).addClass('af-table-head');
			}
			if ($.alopex.util.isValid($(el).attr('data-height'))) {
				$(el.wrapper).css('height', $(el).attr('data-height')); // data-height 사이즈에 따라 wrapper 결정.
			}
			if ($.alopex.util.isValid($(el).attr('data-width'))) {
				var target = el.hscroller ? el.hscroller : el.wrapper;
				$(target).css('width', $(el).attr('data-width')); // data-width는 너비결정.
			}
			// init에서 항상 convert 다시 하지 않도록
			// convert 제외한 나머지만 수행하도록 수정
			// $.alopex.widget.table.refresh(el);
			this._refreshForEtc(el);
		},
		_refreshForConvert:function(el) {
			$.each(el.children, function(){$.alopex.convert(this);});
		},
		_refreshForEtc:function(el){
			var $el = $(el);
			
			if (navigator.userAgent.indexOf('MSIE 7') !== -1) {
				$el.removeAttr('data-scroll');
			}

			if (!el.sorting && $el.find('[data-sortable]').length > 0) {
				this._enableSorting(el);
				el.sorting = true;
			}
			if (!el.resizing && $el.find('[data-resizable="true"]').length > 0) {
				this._enableResizing(el);
				el.resizing = true;
			} else if (el.resizing) {
				this._refreshColgroup(el);
			}
			$(el).find('[data-editable="true"]').addClass('af-table-editor Editor');
			if (!el.editing && $el.find('[data-editable="true"]').length > 0) {
				this._enableEditing(el);
				el.editing = true;
			}
			if (!el.highlighting && $el.attr('data-highlight')) {
				var allow = 'td,th';
				if ($el.attr('data-highlight') === 'body') {
					allow = 'tbody td, tbody th';
				}
				$el.find(allow).css('cursor', 'pointer');
				$(el.wrapper).on('click', allow, this._addTableHighlight);
				el.highlighting = true;
			}

			if (!$(el).is(':hidden')) {
				if (!el.scrolling && $el.attr('data-scroll') !== undefined) {
					this._enableScrolling(el);
					el.scrolling = true;
				}
				
				this._refreshTableHead(el);

				if ($(el).attr('data-scroll') !== undefined) {
					// table의 크기는 cell의 내용에 따라 내벼려 두고, 
					// scroll refresh
					this._refreshTableScroll(el);
				}
				
			}
		},
		refresh: function(el) {
			this._refreshForConvert(el);
			this._refreshForEtc(el);
		},

		/**
		 * Add div for scrolling functionality
		 * @param el
		 */
		_enableScrolling: function(el) {
			// 모바일에서는 세로 스크롤, 데스크탑에서는 가로&세로 스크롤로 사용.
			var $el = $(el);
			var $scroller = $el.closest('.' + this.scrollerClassName +  ', .'+$.alopex.config.defaultComponentClass.table+'-scroller');
			el.scroller = ($scroller.length > 0) ? $scroller[0] : null;
			el.scroller.el = el;
			$(el.wrapper).css({
				'overflow': 'hidden'
			}); // 가로 스크롤의 경우, 
			var $colgroup = $(el).find('colgroup').clone(true);

			// body 영역 스크롤의 경우, 헤더부분 absolute으로 띄우기.
			if ($(el).attr('data-scroll') === 'body') {
				if (window.browser === 'mobile') {
					$(el.scroller).css({
						'overflow': 'hidden',
						'overflow-y': 'auto'
					});
					// 헤더 분리.
					if (el.head) {
						var $dummyHeader = $(el.head).clone(true).appendTo(el);
						el.clone = $(el).clone(true).removeAttr('id').removeAttr('data-type').empty()[0];
						$(el.wrapper).prepend(el.clone);
						$(el.head).prepend($colgroup);
						$(el.head).appendTo(el.clone);
						$(el.head).css({
							'z-index': '1',
							'position': 'absolute',
							'display': 'table',
							'table-layout': 'fixed'
						}); // head가 2개이상의 row로 구성된 경우.
						$dummyHeader.remove();
						//              this._refreshTableHead(el);
						//              dummyHeader.css('visibility', 'hidden');
					}

					// 가로 스크롤러 추가. (세로와 가로 스크롤러 분리)
					var $hscroller = $('<div></div>').attr('class', el.theme + ' af-table-hscroller');
					$hscroller.css({
						'overflow': 'hidden',
						'overflow-x': 'auto',
						'-webkit-overflow-scrolling': 'touch'
					});
					$(el.wrapper).wrap($hscroller[0]);
					el.hscroller = el.wrapper.parentNode;
					el.hscroller.el = el;
				} else {
					// 헤더 absolute로 띄우기.
					if (el.head) {
						$(el.head).css({
							'float': 'left',
							'position': 'absolute',
							'top': '0px',
							'display': 'table',
							'table-layout': 'fixed'
						});
						$(el.head).prepend($colgroup);
					}
					$(el.scroller).css({
						'overflow': 'auto'
					});
					$(el).css({
						'overflow': 'hidden'
					});
					$(el.scroller).bind('scroll', function(e) { // 가로 스크롤 시, 헤더 너비 조정.
						var target = e.currentTarget;
						var el = target.children[0];
						$(el.head).css({
							'left': (target.scrollLeft * -1) + 'px'
						});
					});
				}

				$(el.head).find('tr').css('display', 'table-row');

				if (navigator.userAgent.toLowerCase().indexOf('android') !== -1) {
					// 안드로이드 경우, 이벤트 처리.
					$(el.hscroller).bind('touchstart', function(e) {
						var el = e.currentTarget.el;
						el.started = true;
						el.x = e.originalEvent.touches[0].clientX;
						el.y = e.originalEvent.touches[0].clientY;
					});
					$(el.hscroller).bind('touchmove', function(e) {
						var el = e.currentTarget.el;
						if (el.started) {
							el.x = Math.abs(e.originalEvent.touches[0].clientX - el.x);
							el.y = Math.abs(e.originalEvent.touches[0].clientY - el.y);
							if (el.x > el.y) {
								$(el.hscroller).css({
									'overflow': 'hidden',
									'overflow-x': 'auto'
								});
								$(el.scroller).css('overflow', 'hidden');
							} else {
								$(el.hscroller).css('overflow-x', 'hidden');
								$(el.scroller).css({
									'overflow': 'hidden',
									'overflow-y': 'auto'
								});
							}
							el.started = false;
						}
					});
				}
			} else {
				$(el.scroller).css({
					'overflow': 'auto',
					'overflow-scrolling': 'touch'
				});
			}
		},

		_refreshTableHead: function(el) {
			if (!$.alopex.util.isValid(el.head)) {
				return;
			}

			var tbodyrow = $(el).find('tbody > tr');
			var tbody = $(el).find('tbody');
			var twidth = el.offsetWidth;
			if (tbodyrow.length > 0) {
				// in case the databind is used, table row in index 0 is template
				twidth = tbodyrow[tbodyrow.length-1].offsetWidth;  
			} else if (tbody.length > 0) {
				twidth = tbody[0].offsetWidth;
			}

			var $head = $(el.head);
			$head.css({
				'table-layout': '',
				'width': twidth+'px' // 100% cannot be used, scroll in IE take few pixels 
			});
			if(twidth == 0) {
				$head.css({
					'width': '100%'
				});
			}
//			if (el.offsetWidth === el.wrapper.offsetWidth) {
//				$head.css({
//					'width': '100%'
//				});
//			} else {
//				$head.css({
//					'width': twidth + 'px'
//				});
//			}

			var element = el;
			setTimeout(function() { // webkit 버그로 인하여, 'table-layout' 속성이 제대로 적용되지 않음.
				var $el = $(element);
				$head.css({
					'table-layout': 'fixed'
				});

				// table head와 body의 보더 맞추는 코드
				// thead와 tr 너비 크기가 틀린 경우 발견. 테이블내 tr 엘리먼트 너비 값을 조회한 후 틀린경우, 헤더에서 너비 조정.
				//        var prev = null;
				//        var $temprow = null;
				//        var $tr = $el.closest('.af-table-wrapper').find('tr');
				//        if($tr.length < 5) {
				//          var columnCount = $.alopex.table.getColumnCount(element.wrapper);
				//          var str = '<tr>';
				//          for(var i=0; i<columnCount; i++) { str += '<td></td>'; }
				//          str += '</tr>';
				//          $temprow = $(str);
				//          $(el).find('tbody').append($temprow);
				//          $tr = $el.closest('.af-table-wrapper').find('tr');
				//        }
				//        
				//        for ( var i = 0; i < $tr.length; i++) {
				//          if (prev === null) {
				//            prev = $tr[i].offsetWidth;
				//          } else {
				//            if (prev !== $tr[i].offsetWidth) {
				//              $head.css('width', (headerWidth - (prev - $tr[i].offsetWidth)) + 'px');
				//              break;
				//            }
				//          }
				//        }
				//        
				//        if($temprow !== null) {
				//          $temprow.remove();
				//        }

			}, 10);
		},

		/**
		 * todo
		 * 1. header size adjustment
		 * 2. scroller height adjustment
		 */
		_refreshTableScroll: function(el) {
			var $scroller = $(el.scroller);
			var scrollerHeight = el.wrapper.offsetHeight;
			if ($(el).attr('data-scroll') === 'all') {
				$scroller.css('margin-top', '0');

			} else {
				if (window.browser === 'mobile') {
					// 모바일 경우, hscroller가 추가로 생성됨. 이 떄문에 wrapper의 width를 조정해줘야 가로 스크롤이 동작함.
					$(el.wrapper).css('width', el.offsetWidth + 'px');
				}
				// header size adjustment
				if ($.alopex.util.isValid(el.head)) {
					scrollerHeight -= el.head.offsetHeight;
					$scroller.css('margin-top', el.head.offsetHeight + 'px');
				}
			}
			$scroller.css('height', scrollerHeight + 'px');
		},

		hideColumn: function(el, index) {
			$(el).find('col:nth-child(' + (index + 1) + ')').addClass('af-hidden');
		},

		showColumn: function(el, index) {
			$(el).find('col:nth-child(' + (index + 1) + ')').removeClass('af-hidden');
		},

		clear: function(el) {
			$(el).find('tr').each(function() {
				if ($(this).closest('thead').length > 0) {
					return;
				}
				if ($(this).find('th').length > 0) {
					return;
				}
				$(this).remove();
			});
		},

		_addTableHighlight: function(e) {
			var cell = e.target;
			cell = $(cell).closest('tr,td, th')[0];
			var row = $(cell).closest('tr')[0];
			var head = $(cell).closest('th')[0];
			var table = $(cell).closest('table')[0];

			var isHeader = false;
			if (head !== undefined) {
				isHeader = true;
			}

			$(table).find('.af-table-row').removeClass('af-table-row');
			$(table).find('.af-table-cell').removeClass('af-table-cell');
			$(table).find('.af-table-column').removeClass('af-table-column');

			if (isHeader) {
				var index = $.alopex.widget.table.getColumnIndex(cell);
				$(table).find('td:nth-child(' + (index + 1) + '),' + 'th:nth-child(' + (index + 1) + ')').addClass('af-table-column');
			} else {
				$(row).addClass('af-table-row');
				$(cell).addClass('af-table-cell');
			}
		},

		/**
		 * table 헤더 리턴. 밑에 일치가 안된다.
		 *  1. <thead>태그가 존재할 경우, thead리턴. 
		 *  2. <thead> 없을 시, <th>태그의 부모<tr> 리턴.
		 *  3. null 리턴. 
		 * 
		 * @param el
		 * @returns
		 */
		getTableHead: function(el) {
			var thead = null;
			if ($(el).find('thead').length > 0) {
				thead = $(el).find('thead')[0];
			} else if ($(el).find('th').length > 0) {
				thead = $(el).find('th')[0].parentNode;
			}
			return thead;
		},

		getTableBody: function(el) {
			var tbody;
			if ($(el).find('tbody').length > 0) {
				tbody = el.tBody ? el.tBody : $(el).find('tbody')[0];
			} else {
				tbody = el;
			}
			return tbody;
		},

		getRowIndex: function(td) {
			var tr = td.parentNode;
			var table = tr;
			while (table.tagName.toLowerCase() !== 'table') {
				table = table.parentNode;
			}
			var tbody = table.tableBody;
			var cnt = 0;
			for ( var i = 0; i < tbody.rows.length; i++) {
				if (tbody.rows[i] === table.tableHead) {
					continue;
				} else if (tbody.rows[i] === tr) {
					return cnt;
				}
				cnt++;
			}
			return cnt;
		},

		getColumnIndex: function(td) {
			var tr = td.parentNode;
			if ($.alopex.util.isValid(tr.cells)) {
				for ( var i = 0; tr.cells.length; i++) {
					if (tr.cells[i] === td) {
						return i;
					}
				}
			}
			return -1;
		},

		_enableEditing: function(el) {
			$(el.wrapper).on('click', '[data-editable="true"]', $.alopex.widget.table._editHandler);
		},

		_disableEdit: function(el) {
			var thead = el.tableHead;
			var tbody = el.tableBody;

			$(thead).find('[data-editable="true"]').each(function() {
				var th = this;
				var columnIndex = $.alopex.widget.table.getColumnIndex(th);

				for ( var i = 0; i < tbody.rows.length; i++) {
					if (tbody.rows[i] === thead) {
						continue;
					}
					$(tbody.rows[i]).find('td:nth-child(' + (columnIndex + 1) + ')').unbind('click', $.alopex.widget.table._editHandler);
				}
			});
		},

		_editHandler: function(e) {
			var cell = $(e.target).closest('td')[0];
			var table = $(cell).closest('table')[0];

			// td 안에 textnode 말고 다른
			if (cell.children !== undefined && cell.children.length > 0) {
				return;
			}

			var input = document.createElement('input');
			$(input).val(cell.text = $(cell).text());
			$.alopex.widget.table.tmpInput = input;
			$.alopex.widget.table.tmp = cell;
			$(cell).text('').append(input).addClass('af-editing Editing');

			//        var temp = cell.style.height;
			$(input).focus();
			$.alopex.widget.table._disableEdit(table);

			function focusout(e) {
				e.stopImmediatePropagation();
				e.preventDefault();

				var input = $.alopex.widget.table.tmpInput;
				var text = $(input).val();
				if (input.parentNode.text !== text) {
					$(input.parentNode).addClass('af-edited Edited');
					table.edited = true;
				}
				$(input.parentNode).text(text).removeClass('af-editing Editing');
				$(input).remove();
				$.alopex.widget.table._enableEditing(table);
			}

			$(input).bind('focusout', function(e) {
				focusout(e);
			});
			$(input).bind('keydown', function(e) {
				if (e.keyCode !== 13 && e.keyCode !== 27) {
					return;
				}
				focusout(e);
			});
		},

		/**
		 * colgroup 태그가 없을 시 추가한다. (사이즈 조정에 사용됨)
		 * @param el
		 */
		_addColgroup: function(el) {
			// colgroup
			var rowgroups = $(el).find('tr');
			rowgroups = rowgroups[rowgroups.length - 1];
			var colgroup = $(el).find('colgroup');
			if (colgroup.length === 0) {
				colgroup = document.createElement('colgroup');
				for ( var i = 0; i < rowgroups.children.length; i++) {
					var temp = document.createElement('col');
					$(temp).appendTo(colgroup);
				}
				$(colgroup).insertBefore(el.children[0]);
			} else {
				colgroup = colgroup[0];
			}
		},

		_refreshColgroup: function(el) {
			var rowgroups = $(el).find('tr');
			if (rowgroups.length > 0) {
				var maxtd = 0, i;
				rowgroups.each(function(idx, elem) {
					var len = $(elem).children('td').length;
					maxtd = len > maxtd ? len : maxtd;
				});
				var dummytr = $('<tr>').css('height', '0px');
				for (i = 0; i < maxtd; i++) {
					dummytr.append('<td>&nbsp;</td>');
				}
				dummytr.insertAfter(rowgroups.last());
				var colgroup = $(el).find('colgroup');
				var tempArr = [];
				var len;
				for (i = 0, len = maxtd; i < len; i++) {
					var width = (dummytr.children('td').eq(i).offsetWidth);
					tempArr.push(width);
				}
				for (i = 0; i < tempArr.length; i++) {
					$(el).find('col:nth-child(' + (i + 1) + ')').css('width', tempArr[i]);
				}
				dummytr.remove();
			}
		},

		/**
		 * 컬럼이 리사이즈 가능 하도록 한다.
		 * @param el
		 */
		_enableResizing: function(el) {
			if (window.browser !== 'mobile') { // Desktop Only Function
				// register event handler
				$(el.wrapper).on('mousedown', '[data-resizable="true"]', this._resizeStartHandler).on('mousemove', '[data-resizable="true"]', this._checkResizeCondition);
				$(el.wrapper).find('[data-resizable="true"]').each(function() {
					this.table = el;
					var btn = document.createElement('div');
					$(btn).addClass('af-table-resize ResizeIcon').appendTo(this);
				});
				$(el.rows[0].cells).each(function(index) {
					this.index = index;
				});
				$(el).on('selectstart', function(e) {
					return false;
				});
				$(el).on('dragstart', function(e) {
					return false;
				});
			}

		},

		_resizeStartHandler: function(e) {
			var target = e.currentTarget;
			var el = target.table;
			var tableWidth = el.offsetWidth;
			$(el).css({
				'width': tableWidth + 'px',
				'min-width': ''
			});
			if ($.alopex.widget.table.resizeready) {
				$.alopex.widget.table.resizing = true;
				$.alopex.widget.table.resizingEl = target;
				$(document).bind('mousemove', $.alopex.widget.table._resizeMoveHandler);
				$(document).bind('mouseup', $.alopex.widget.table._resizeEndHandler);
				if ($.alopex.util.isValid($('body').css('cursor'))) {
					$('body').data('cursor', $('body').css('cursor'));
				}
				$('body').css('cursor', 'col-resize').css('text-overflow', 'ellipsis');
			}
		},

		_resizeMoveHandler: function(e) {
			if ($.alopex.widget.table.resizing) {
				var col = $.alopex.widget.table.resizingEl;
				var el = col.table;
				var pos = $.alopex.util.getScrolledPosition(col);
				var left = pos.left;
				var width = e.pageX - left;

				if (col.width && width < col.width && Math.abs(col.width - col.offsetWidth) > 3) {
					$.alopex.widget.table._resizeColumn(col, col.offsetWidth);
					col.width = col.offsetWidth;
				} else {
					$.alopex.widget.table._resizeColumn(col, width);
					col.width = width;
				}
				$.alopex.widget.table._refreshTableScroll(el);
			}
		},

		_resizeEndHandler: function(e) {
			if ($.alopex.widget.table.resizing) {
				var target = $.alopex.widget.table.resizingEl;
				$.alopex.widget.table.resizing = false;
				$.alopex.widget.table.resizingEl = null;
				$(document).unbind('mousemove', $.alopex.widget.table._resizeMoveHandler);
				$(document).unbind('mouseup', $.alopex.widget.table._resizeEndHandler);
				if ($.alopex.util.isValid($('body').data('cursor'))) {
					$('body').css('cursor', $('body').data('cursor'));
				} else {
					$('body').css('cursor', '').css('background', '');
				}
			}
		},

		_checkResizeCondition: function(e) {
			var el = $(e.target).closest('[data-resizable="true"]')[0];
			var pos = $.alopex.util.getScrolledPosition(el);
			var curright = pos.left + el.offsetWidth;
			if ($(el).css('cursor') !== 'col-resize') {
				$(el).data('cursor', '');
			}
			if (e.pageX >= curright - $.alopex.widget.table.resizeThreshold) {
				$(el).css('cursor', 'col-resize');
				$.alopex.widget.table.resizeready = true;
			} else {
				$(el).css('cursor', $(el).data('cursor'));
				$.alopex.widget.table.resizeready = false;
			}
		},

		/**
		 * @param {HTMLCellElement} th target header td element.
		 * @param {integer} width width of td element;
		 */
		_resizeColumn: function(th, width) {
			var table = th.table;
			var $table = $(table);
			var head = table.head;
			$(th).css('width', width + 'px');
			//        $(th.table.wrapper).css({'display':'inline-block', 'width':''})
			$($table).find('colgroup > col:nth-child(' + (th.index + 1) + ')').each(function() {
				var colWidth = $($table).find('tr:first-child').find('td,th')[th.index].offsetWidth;
				var oldColWidth = this.width ? this.width : colWidth;
				var oldTableWidth = this.tableWidth ? this.tableWidth : parseInt($table.css('width').replace('px', ''), 10);
				var diff = width - oldColWidth;
				this.width = width;
				this.style.width = width + 'px'; // for ie7
				$(this).css('width', width + 'px'); // for ie8, ie9
				this.tableWidth = (oldTableWidth + diff);
				$table.css('width', this.tableWidth + 'px');
				$(head).css('width', this.tableWidth + 'px');
			});
		},

		// 
		_enableSorting: function(el) {
			var rows = el.head;
			$(rows).find('th, td').each(function(index) {
				if ($(this).attr('data-sortable') === undefined && $(this).attr('data-sort-function') === undefined) {
					return;
				}
				this.columnIndex = index;
				this.table = el;
				var icon = document.createElement('span');
				$(icon).addClass('af-icon Icon');
				$(this).append(icon).css('cursor', 'pointer');
			});
			$(el.wrapper).on('click', '[data-sortable], [data-sort-function]', $.alopex.widget.table._sort);
		},

		_sort: function(e) {
			var headColumn = e.currentTarget;
			$.alopex.widget.table.sort(headColumn);
		},

		sort: function(target, orderBy) {
			if (target === undefined) {
				target = this;
			}

			var table = target.table;
			if (table) {
				var index = target.columnIndex;
				var tbody = table.tBodies[0];
				var array = [];
				var valArr = [];
				for ( var i = 0; i < tbody.rows.length; i++) {
					if (tbody.rows[i].cells.length > 0 && tbody.rows[i].cells[0].tagName.toLowerCase() === 'th') {
						continue;
					}
					array.push([this._getInnerText(tbody.rows[i].cells[index]), tbody.rows[i]]);
				}
				var sort_function;
				if ($(target).attr('data-sort-function') !== undefined) {
					sort_function = window[$(target).attr('data-sort-function')];
				} else {
					var type = $(target).attr('data-sortable');
					switch (type) {
					case 'number':
						sort_function = $.alopex.util.sort_numeric;
						break;
					case 'date':
						valArr = $.alopex.util.formatDate(valArr);
						sort_function = $.alopex.util.sort_date;
						break;
					default:
						sort_function = $.alopex.util.sort_default;
						break;
					}
				}
				$(target).siblings().removeClass('af-table-ascending AscendingOrder').removeClass('af-table-descending DescendingOrder');
				//   orderBy  여부 확인하여 정렬. 2016.01.25 ys.park 
				if(orderBy!== undefined) {
				    if (orderBy.toLowerCase() === 'desc') {
					$(target).removeClass('af-table-ascending AscendingOrder');
					$(target).addClass('af-table-descending DescendingOrder');
					array = $.alopex.util.mergeSort(array, sort_function, false);
				    } else {
					$(target).removeClass('af-table-descending DescendingOrder');
					$(target).addClass('af-table-ascending AscendingOrder');
					array = $.alopex.util.mergeSort(array, sort_function, true);
				    }
				}else{
    				    if (target.className.indexOf('af-table-ascending AscendingOrder') !== -1) {
    					$(target).removeClass('af-table-ascending AscendingOrder');
    					$(target).addClass('af-table-descending DescendingOrder');
    					array = $.alopex.util.mergeSort(array, sort_function, false);
    				    } else {
    					$(target).removeClass('af-table-descending DescendingOrder');
    					$(target).addClass('af-table-ascending AscendingOrder');
    					array = $.alopex.util.mergeSort(array, sort_function, true);
    				    }
				}
				for (i = 0; i < array.length; i++) {
					tbody.appendChild(array[i][1]);
				}
			}

		},

		_getInnerText: function(node) {
			// 현재 alopex UI Framework componenet value를 가져와야 함.
			// node가 정의되지 않앗거나, 복합 구조일 경우 빈 스트링 리턴.
			if (!node) {
				return '';
			}

			return node.innerHTML;
		},

		getColumnCount: function(el) {
			var $el = $(el);
			var count = 0;

			var $tr = $el.find('tr');
			for ( var i = 0; i < $tr.length; i++) {
				var colCount = $tr.find('td, th').length;
				if (colCount > count) {
					count = colCount;
				}
			}
			return count;
		}
	});

})(jQuery);