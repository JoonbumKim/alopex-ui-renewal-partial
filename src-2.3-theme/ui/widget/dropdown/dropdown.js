(function($) {

	$.alopex.widget.dropdown = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'dropdown',
		defaultClassName: 'af-dropdown Dropdown',
		setters: ['dropdown', 'addHandler', 'setDataSource', 'open', 'close', 'toggle', 'refresh', 'select'],
		getters: ['getDataSource'],

		markup: function(el, options) {
			var $el = $(el);
			$.extend(true, el, {
				opentrigger: 'click', // the event which the base element will trigger to OPEN the dropdown menu
				closetrigger: 'click', // the event which the base element will trigger to CLOSE the dropdown menu
				submenutrigger: null,
				base: $(el).prev(),
				curstate: 'closed',
				position: 'bottom',
				cssstyle: {
					'position': 'absolute',
					'top': '0px',
					'left': '0px'
				},
				trigger: 'click',
				margin: 3,
				focusmove: 'false',
				classname: [''],
				callback: []

			}, options);

			var $base = $(el.base);
			if ($base.length === 0) {
				return;
			}
			el.base = $base[0];
			$base.each(function() {
				this.dropdown = el;
			});
			$base.attr('tabindex', '0');
			this.refresh(el);
		},
		_baseEventBind: function(el) {
			
			var $base = $(el.base);
			if($base.length === 0){
				console.log(el.base + " is an INVALID selector");
				return;
			}
			el.base = $base[0];
			$base.each(function() {
				this.dropdown = el;
			});
			$base.attr('tabindex', '0');
			this.refresh(el);
			
			// el triggered event
			if (el.opentrigger !== undefined && el.opentrigger === el.closetrigger) {
				$base.on(el.opentrigger, $.alopex.widget.dropdown._toggle);
			} else {
				if (el.opentrigger) {
					$base.on(el.opentrigger, $.alopex.widget.dropdown._open);
				}
				if (el.closetrigger) {
					$base.on(el.closetrigger, $.alopex.widget.dropdown._close);
				}
			}
			
			// blur시 드랍다운 close 처리.
			$base.on('blur', $.alopex.widget.dropdown._blurHandler);
			$base.on('keydown', $.alopex.widget.dropdown._inputBaseKeyDownHandler);
		},
		init: function(el, options) {
			var $el = $(el);
			
			var $lis = $(el).find('li');
			if($lis.length){
				var data = [];
				$lis.each(function(){
					var li_obj = {};
					li_obj = $.extend(li_obj, {id : $(this).attr('id'), text : $(this).text()});
					var $a = $(this).find('a');
					if($a.length){
						li_obj = $.extend({}, li_obj, {link : $a.attr('href')});
					}
					data.push(li_obj);
				});
				el.userInputDataSource = data;
			}else{
				// ul > li 구조가 아닌 경우는 Alopex UI Dropdown 표준이 아니므로, .html()을 저장한다
				el.userInputDataSource = $(el).html();
			}
			
			$el.on('click', 'li', {
				element: el
			}, $.alopex.widget.dropdown._clickHandler);

			// submenu open을 담당하는 이벤트 명시.
			if (el.submenutrigger === 'click') {
				$el.on('click', 'li', {
					element: el
				}, $.alopex.widget.dropdown._toggleHandler);
			} else { // hover 
				$el.on('mouseenter', 'li', {
					element: el
				}, $.alopex.widget.dropdown._openSubmenu);
				$el.on('mouseleave', 'li', {
					element: el
				}, $.alopex.widget.dropdown._closeSubmenu);
			}
			
			// hover시 af-focus 표시.
			$el.on('mouseleave mouseenter', 'li.af-menuitem', function(e) {
			  var target = e.currentTarget;

			  var $target = $(target);
			  var $el = $target.closest('[data-type]');
			  $el.find('*').filter('.af-focused.Focused').removeClass('af-focused Focused');

			  var inputEl = $(e.currentTarget).find('input');
			  if (inputEl) {
			    var type = $(e.currentTarget).find('input').attr('type');
			    if (type == 'checkbox' || type == 'text' || type == 'button') {
			      return;
			    }
			  }
 
			  var selectEl = $(e.currentTarget).find('select');
			  if (selectEl.length > 0) {
			    return;
			  }

			  if (target.className.indexOf('af-disabled Disabled') === -1) {
			    $target.addClass('af-focused Focused');
			  }
			});
			
			this._baseEventBind(el);
			$(el).bind('keydown', $.alopex.widget.dropdown._inputBaseKeyDownHandler);
		},

		refresh: function(el) {
			var $el = $(el);
			$el.find('li').each(function() {
				var $row = $(this);
				if ($row.attr('data-role') === 'divider') {
					$row.addClass('af-dropdown-divider');
				} else if ($row.attr('data-role') === 'header') {
					$row.addClass('af-dropdown-header');
				} else {
					$row.addClass('af-menuitem');
				}
			});
			$el.find('ul').addClass('af-submenu');
			$el.find('.af-submenu').parent().addClass('af-expandable');
			$el.find('.af-submenu').parent().addClass('Expandable');
			$el.css(el.cssstyle);
			$el.hide();
		},

		_blurHandler: function(e) {
			var dropdown = e.currentTarget.dropdown;
			//      $(dropdown).close();
		},

		addHandler: function(el, callback) {
			el.callback.push(callback);
		},

		_toggle: function(e) {
			var target = e.currentTarget;
			var el = target.dropdown;
			$(el).toggle();
		},

		_open: function(e) {
			var target = e.currentTarget;
			var el = target.dropdown;
			if($.alopex.util.isValid(el.userInputDataSource)){
				$(el).open();
			}else{
				console.error('Dropdown Element has no data');
			}
		},

		_close: function(e) {
			
			if(e.type !== 'mouseleave'){
				var target = e.currentTarget;
				var el = target.dropdown;
				$(el).close();
				return;
			}
			
			var mouseLeaveEvent = e;			
			var dropdown_closeX;
			var dropdown_closeY;
			
			// button 에서  open된 ul로  마우스 이동하면 button에서 mouseleave 발생하고, ul로 가기도 전에 ul이 close 되어 버림 (button 과 ul의 화면상의 간격 때문)
			// 특정 시간(200ms) 후에 마우스 커서가 ul 위에 있는 경우에는 close 하지 않는 것으로 수정
			
			// 특정 시간(200ms) 후 ul로 마우스 커서 이동 뒤, ul에서 mouseleave 하면 ul 닫히도록 수정
			
			// e.currentTarget가 ul 이면
			if($(e.currentTarget).filter('ul.Dropdown').length > 0){
				var el = e.currentTarget;
				var $el = $(e.currentTarget);
				$el.close();
				$el.off(el.closetrigger, $.alopex.widget.dropdown._close);
				return;
			}
				
			// e.currentTarget가 button 이면
				mouseLeaveEvent.mouseMoveHandler = function(mouseMoveEvent, mouseLeaveEvent){
					dropdown_closeX = mouseMoveEvent.pageX;
					dropdown_closeY = mouseMoveEvent.pageY;
				};
				
				$(document).on("mousemove", mouseLeaveEvent.mouseMoveHandler);

				var func = function(mouseLeaveEvent){
					var target = mouseLeaveEvent.currentTarget;
					var el = target.dropdown;

					var x = dropdown_closeX;
					var y = dropdown_closeY;
					
					var dropdownUlTop = $(el).offset().top;
					var dropdownUlleft = $(el).offset().left;
					var dropdownUlOuterHeight = $(el).outerHeight();
					var dropdownUlOuterWidth = $(el).outerWidth();
					
					if(x >= dropdownUlleft && x <= (dropdownUlleft + dropdownUlOuterWidth)
							&& y >= dropdownUlTop && y <= (dropdownUlTop + dropdownUlOuterHeight)){
						// 일정시간 뒤에 마우스 커서가 ul 위에 있다. close 하지 않는다.
					}else{
						$(el).close();
					}
					
					$(document).off("mousemove", mouseLeaveEvent.mouseMoveHandler);
				};
				
				$.alopex.util.delayFunction(func, 200, mouseLeaveEvent);
		},

		_closeByKey: function(e) {
				var target = e.target;
				var arr = $.alopex.widget.dropdown.activeList;
				for ( var i = 0; i < arr.length; i++) {
					var el = $.alopex.widget.dropdown.activeList.shift();
					if ((el !== target && $(target).closest(el).length === 0) && (el.base !== target && $(target).closest(el.base).length === 0)) {
						// 드랍다운 영역이 아닌 배경화면 및 다른 컴퍼넌트 클릭.
						setTimeout(function(){ // 이벤트 타이밍 이슈로 닫고 다시 열림
							$(el).close();
						}, 200);
						
					} else {
						$.alopex.widget.dropdown.activeList.push(el);
					}
				}
		},

		toggle: function(el) {
			var $el = $(el);
			if (el.curstate === 'closed' && $.alopex.util.isValid(el.userInputDataSource)) {
				$el.open();
			} else {
				$el.close();
			}
		},

		_toggleHandler: function(e) {
			var li = e.currentTarget;
			if (li.className.indexOf('af-expandable') !== -1) {
				$.alopex.widget.dropdown.toggleSubmenu(li);
			}
		},

		_clickHandler: function(e) {
			var li = e.currentTarget;
			var el = e.data.element;
			for ( var i = 0; i < el.callback.length; i++) {
				el.callback[i].apply(el, [e]);
			}

			var subMenuEl = $(li).find('ul');
			if (subMenuEl.length > 0) {
				return;
			}

			var inputEl = $(li).find('input');
			if (inputEl) {
				var type = $(li).find('input').attr('type');
				if (type == 'checkbox' || type == 'text') {
					return;
				}
			}

			var selectEl = $(li).find('select');
			if (selectEl.length > 0) {
				return;
			}

			if ( el.base.tagName && (el.base.tagName.toLowerCase() === 'input' || e.which !== undefined) ) { // 키보드로 클릭한 경우, 가상 이벤트가 발생하기 때문에 e.which 값 undefined.
				if( $(li).attr('data-role') != 'empty' && $(li).text()){
					$(el.base).val($(li).text()).change();
				}
				$(el).close();
			}
			$(el).trigger("select", el);
		},

		_openSubmenu: function(e) {
			var li = e.currentTarget;
			$.alopex.widget.dropdown.openSubmenu(li);
		},

		_closeSubmenu: function(e) {
			var li = e.currentTarget;
			$.alopex.widget.dropdown.closeSubmenu(li);
		},

		openSubmenu: function(li) {
			var $li = $(li);
			var inputEl = $(li).find('input');
			if (inputEl) {
				var type = $(li).find('input').attr('type');
				if (type == 'checkbox' || type == 'text' || type == 'button') {
					return;
				}
			}

			var selectEl = $(li).find('select');
			if (selectEl.length > 0) {
				return;
			}

			if ($li.attr('class') && $li.attr('class').indexOf('af-expandable') !== -1) {
				$li.addClass('af-expanded');
				$li.find('> ul').css('display', 'inline-block');
			}
		},

		closeSubmenu: function(li) {
			var $li = $(li);
			var inputEl = $(li).find('input');
			if (inputEl) {
				var type = $(li).find('input').attr('type');
				if (type == 'checkbox' || type == 'text' || type == 'button') {
					return;
				}
			}

			var selectEl = $(li).find('select');
			if (selectEl.length > 0) {
				return;
			}

			if ($li.attr('class') && $li.attr('class').indexOf('af-expandable') !== -1) {
				$li.removeClass('af-expanded');
				$li.find('> ul').css('display', 'none');
			}
		},

		toggleSubmenu: function(li) {
			var $li = $(li);
			if ($li.attr('class').indexOf('af-expanded') !== -1) {
				$.alopex.widget.dropdown.closeSubmenu(li);
			} else {
				$.alopex.widget.dropdown.openSubmenu(li);
			}
		},

		_htmlGenerator: function(data) {
			var markup = '';
			for ( var i = 0; i < data.length; i++) {
				markup += '<li';
				if (data[i].id !== undefined) {
					markup += ' id="' + data[i].id + '"';
				}
				markup += '><a';
				if (data[i].link !== undefined) {
					markup += ' href="' + data[i].link + '"';
				}
				markup += '>';
				if (data[i].text !== undefined) {
					markup += data[i].text;
				}
				if (data[i].items) {
					markup += '</a><ul>';
					markup += $.alopex.widget.dropdown._htmlGenerator(data[i].items);
					markup += '</ul></li>';
				} else {
					markup += '</a></li>';
				}

			}
			return markup;
		},
		getDataSource: function(el) {
			// string 이든, object 이든 사용자가 setDateSource에 인자로 넘긴 데이터를 그대로 가지고 있다가 리턴해준다.
			if($.alopex.util.isValid(el.userInputDataSource)) return el.userInputDataSource;
		},
		setDataSource: function(el, data) {
			var $el = $(el);
			switch (typeof data) {
			case 'string':
				$el.html(data);
				break;
			case 'object':
				$el.html($.alopex.widget.dropdown._htmlGenerator(data));
				break;
			default:
				break;
			}
			$(el).refresh();
			// string 이든, object 이든 사용자가 setDateSource에 인자로 넘긴 데이터를 그대로 가지고 있는다.
			el.userInputDataSource = data;
		},
		_inputBaseKeyDownHandler: function(e) {
			var base = this;
			var el = base.dropdown;

			if (typeof el !== 'undefined') {
				if (e.which === 40) {// down
					if (el.curstate === 'closed') {
						$(el).open();
					}
					$.alopex.widget.dropdown._focusNext(el);
					e.preventDefault();
				} else if (e.which === 38) { // up
					$.alopex.widget.dropdown._focusPrev(el);
					e.preventDefault();
				} else if (e.which === 27) { // esc
					$(el).close();
				} else if (e.which === 39) { // right
					$.alopex.widget.dropdown._focusChild(el);
				} else if (e.which === 37) { // left
					$.alopex.widget.dropdown._focusParent(el);
				} else if (e.which === 13) { // enter
					var $focused = $(el).find('.af-focused.Focused');
					if ($focused.length > 0) {
						//            $focused.attr('tabindex', '0')[0].focus();
						e.preventDefault();
						$(el).find('.af-focused.Focused').trigger('click');
					}

				}
			}
		},

		_select: function(el) {

		},

		_focus: function(el, li) {
			$(el).find('.af-focused.Focused').removeClass('af-focused Focused');
			$(li).addClass('af-focused Focused');
			if (el.focusmove === 'true') {
				li.focus();
			}
			var ul = li.parentNode; // 스크롤이 존재할 경우, scrollTop을 조정해준다.
		    try{
		    	if(li.offsetTop + li.offsetHeight > ul.offsetHeight) {
			    	ul.scrollTop = li.offsetTop + li.offsetHeight - ul.offsetHeight;
			    }
		    }catch(e){}
		},

		_isValidMenu: function($li) {
			if ($li.length <= 0) {
				return true;
			}
			var li = $li[0];
			if (!li.className) {
				return false;
			}
			if (li.className.indexOf('af-menuitem') === -1) {
				return false;
			}
			if (li.className.indexOf('af-disabled Disabled') !== -1) {
				return false;
			}
			if (li.className.indexOf('af-dropdown-header') !== -1) {
				return false;
			}
			if (li.className.indexOf('af-dropdown-divider') !== -1) {
				return false;
			}
			return true;
		},

		_focusPrev: function(el) {
			if (typeof el === undefined) {
				el = this;
			}
			var $el = $(el);
			var $focused = $el.find('.af-focused.Focused');
			var $prev = $focused.prev('li');
			while (!$.alopex.widget.dropdown._isValidMenu($prev)) {
				$prev = $prev.prev('li');
			}
			if ($focused.length !== 0 && $prev.length > 0) {
				$.alopex.widget.dropdown._focus(el, $prev[0]);
			}
		},

		_focusNext: function(el) {
			if (typeof el === undefined) {
				el = this;
			}
			var $el = $(el);
			var $focused = $el.find('.af-focused.Focused');
			var $next = $focused.next('li');
			while (!$.alopex.widget.dropdown._isValidMenu($next)) {
				$next = $next.next('li');
			}
			if ($focused.length === 0 && $el.find('li').length > 0) {
				$.alopex.widget.dropdown._focus(el, $el.find('li')[0]);
			} else if ($next.length !== 0) {
				$.alopex.widget.dropdown._focus(el, $next[0]);
			}
		},

		_focusChild: function(el) {
			if (typeof el === undefined) {
				el = this;
			}
			var $el = $(el);
			var $focused = $el.find('.af-focused.Focused');
			var $submenu = $focused.find('.af-submenu');
			if ($submenu.length > 0 && $submenu.find('li.af-menuitem').length > 0) {
				$.alopex.widget.dropdown.openSubmenu($focused[0]);
				$.alopex.widget.dropdown._focus(el, $submenu.find('li.af-menuitem')[0]);
			}
		},

		_focusParent: function(el) {
			if (typeof el === undefined) {
				el = this;
			}
			var $el = $(el);
			var $focused = $el.find('.af-focused.Focused');
			var $parent = $focused.parents('.af-expandable').eq(0);

			if ($parent.length > 0) {
				$.alopex.widget.dropdown.closeSubmenu($parent[0]);
				$.alopex.widget.dropdown._focus(el, $parent[0]);
			}
		},

		activeList: [],

		open: function(el, selector) {
			var $el = $(el);

			if($a.util.isValid(selector) && $a.util.isStringType(selector)){
				// base 변경
				
				var $base = $(el.base);
				
				// 기존 event 제거
				if($base.length !== 0){
					if (el.opentrigger !== undefined && el.opentrigger === el.closetrigger) {
						$base.off(el.opentrigger, $.alopex.widget.dropdown._toggle);
					} else {
						if (el.opentrigger) {
							$base.off(el.opentrigger, $.alopex.widget.dropdown._open);
						}
						if (el.closetrigger) {
							$base.off(el.closetrigger, $.alopex.widget.dropdown._close);
						}
					}
					
					// blur시 드랍다운 close 처리.
					$base.off('blur', $.alopex.widget.dropdown._blurHandler);
					$base.off('keydown', $.alopex.widget.dropdown._inputBaseKeyDownHandler);
				}

				el.base = selector;
				$.alopex.widget.dropdown._baseEventBind(el);
				$el.find('.af-focused.Focused').removeClass('af-focused Focused');
			}
			
			$el.css({
				'display': 'block'
			});
			var dropdownWidth = el.offsetWidth;
			var dropdownHeight = el.offsetHeight;
			var baseWidth = el.base.offsetWidth;
			var baseHeight = el.base.offsetHeight;

			// 팝업 띄우는 거
			var parent = el.offsetParent;
			while(parent) {
				if(parent === document.body || $(parent).css('position') === 'relative' || $(parent).css('position') === 'absolute') {
					break;
				}
				parent = el.offsetParent;
			}

			var basePosition = $.alopex.util.getRelativePosition(el.base); // base엘리먼트의 화면 포지션..
			var coorPosition = $.alopex.util.getRelativePosition(parent); // 엘리먼트 기준.
			var baseLeft = basePosition.left - coorPosition.left;
			var baseTop = basePosition.top - coorPosition.top;

			var top = 0;
			var left = 0;
			switch (el.position) {
			case 'top':
				left = baseLeft;
				top = baseTop - dropdownHeight - el.margin;
				break;
			case 'left':
				left = baseLeft - dropdownWidth - el.margin;
				top = baseTop;
				break;
			case 'right':
				left = baseLeft + baseWidth + el.margin;
				top = baseTop;
				break;
			case 'bottom':
				/* falls through */
			default:
				left = baseLeft;
			top = baseTop + baseHeight + el.margin;
			break;
			}

			// 드랍다운 위치가 윈도우 사이즈보다 클때 보정해준다.
//			var renderWidth = $.alopex.util.getRelativePosition(el).left + dropdownWidth;
//			var windowWidth = $(window).width();
//			if (renderWidth > windowWidth) {
//				left = left - (renderWidth - windowWidth + el.margin);
//			}
//			var renderHeight = $.alopex.util.getRelativePosition(el).top + dropdownHeight;
//			var windowHeight = $(window).height();
//			if (renderHeight > windowHeight) {
//				top = top - (renderHeight - windowHeight + el.margin);
//			}

			$el.css({
				'left': left + 'px',
				'top': top + 'px'
			});
			$.alopex.widget.dropdown.activeList.push(el);
			el.curstate = 'opened';
			$(document).bind('pressed', $.alopex.widget.dropdown._closeByKey);
		},

		close: function(el) {
			var $el = $(el);
			for ( var i = 0; i < $.alopex.widget.dropdown.activeList.length; i++) {
				if ($.alopex.widget.dropdown.activeList[i] === el) {
					$.alopex.widget.dropdown.activeList.splice(i, 1);
					break;
				}
			}
			el.curstate = 'closed';
			$el.hide();

			//$el.find('.af-focused.Focused').removeClass('af-focused Focused');
			$(document).unbind('pressed', $.alopex.widget.dropdown._closeByKey);
			$el.trigger("close.dropdown");
		},
		
		select: function(el, param) {
			if($.alopex.util.isValid(param)){
				var $aElement = null;
				if($a.util.isNumberType(param)){
					$aElement = $(el).find("li>a").eq(param);
				}else if($.isPlainObject(param) && $a.util.isValid(param.id)){
					$aElement = $(el).find("li#" + param.id + ">a");
				}
				
				// a 테그 클릭 (element 의 click api 사용. href 이동하는 이벤트 까지 수행시키기 위해)
				if( $aElement && $aElement.length !== 0){
					$aElement[0].click();
					
					// li 테그 포커스 및 하이라이트
					var $li = $aElement.parent("li.af-menuitem");
					if($li.length !== 0){
						$.alopex.widget.dropdown._focus(el, $li[0]);
					}
				}
			}
		}

	});
})(jQuery);