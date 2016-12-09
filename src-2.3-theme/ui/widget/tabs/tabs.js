(function($) {
	$.alopex.widget.tabs = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'tabs',
		defaultClassName: 'af-tabs Tabs',
		setters: ['tabs', 'setTabIndex','setTabByContent', 'setEnabled', 'setEnabledByContent', 'reload', 'clear', 'removeTab', 'setBeforeunload', 'addTab', '_refeshButtonGroup', 'setDraggable', 'setTabWidth', 'cancelThisTabChange'],
		getters: ['getCurrentTabIndex', 'getTabContentByIndex', 'getCurrentTabContent', 'getButtonsGroup', 'getButtons', 'getContent', 'getActiveButtons', 'getLength', 'isEnabled', 'getTitleByIndex', 'getSubTabByIndex'],

		requestButton: null,

		properties: {
			buttons: null,
			buttonGroup: null,
			tabstrigger: 'click',
			eventState: 'init',
			carousel: false, // indicate if carousel function is used.
			wrapper: null, // tab content wrapper: necessary for carousel
			removebutton: false,
			initfocus: false,
			beforeunload: {},
			buttonScroller: false, // 스크롤을 좌우버튼으로 할 경우 true
			useremoveall: false, // 전체 탭 제거 버튼 사용할 경우 true  (data-use-removeall="false")
			draggable: false, // tab 버튼을 Drag & Drop 하여 위치 변경 가능하게 할 경우 true
			tabwidth: null, // default tab width
			depth2position: null,
			refreshbutton : false
		},
		
		classNames: {
			removebutton: 'RemoveButton',
			refreshbutton : 'RefreshButton'
		},
		getLength: function(el) {
			if(el.buttons) {
				return el.buttons.length;
			}
			return 0;
		},
		getButtonsGroup: function(el) {
			return el.buttonGroup;
		},
		getButtons: function(el) {
			return el.buttons;
		},
		getContent: function(el, index, index2) {
			$.alopex.widget.tabs.getTabContentByIndex(el, index, index2); 
		},
		getTitleByIndex: function(el, index, index2) {
			if(el.buttons && el.buttons[index]) {
				if(index2){
					try{
						var text = $(el.buttons[index].depth2Tabs.buttons[index2]).find("p").text();/*.filter(function() {
						  return this.nodeType == 3;
						}).text();*/
						// p 태그 이므로 nodeType == 1 이여서 빈스트링("") 리턴하므로, filter 함수 제거 		
						return text;
					}catch(err){
						return;
					}
				}
				
				var text = $(el.buttons[index]).contents().filter(function() {
					  return this.nodeType == 3;
					}).text();
				return text;
			}
		},

		reload: function(el, index, callback) {
			if(el.buttons && el.buttons[index]) {
				// 현재 페이지에 구성된 탭이 아닌경우에만 적용.
				// local tab content는 제외.
				if($(el.buttons[index]).attr('data-content').indexOf('#') != 0) { 
					this._loadHTML(el.buttons[index], el, callback);
				}

			}
			else{
				console.error("Can't find any Content by the index[" + index + "]");
			}
		},

		setBeforeunload: function(el, index, beforeunload){
			var $el = $(el);
			if(!el.options.beforeunload) {
				el.options.beforeunload = {};
			}
			el.options.beforeunload[index] = beforeunload;
		},

		init: function(el, options) {
			var $el = $(el);
			el.options = $.extend(true, {}, this.properties, options);
			el._currentTabIndex = -1;
			el.depth = 1;
			
			if(el.options && el.options.depth2position == "top"){
				// To-Do...
			}else if(el.options && el.options.depth2position == "left"){
				$(el).addClass('Vertical');
			}
			
			if($(el).find(".ButtonScroller").length > 0){ // false 이면 일반 Scroll 사용한다는 의미
				el.options.buttonScroller = true;
				
				$(el).prepend('<button class="Button ScrollerbuttonL"><span class="Icon Chevron-left" data-position="center"></span></button>').find(".ScrollerbuttonL").convert();
				$(el).prepend('<button class="Button ScrollerbuttonR"><span class="Icon Chevron-right" data-position="center"></span></button>').find(".ScrollerbuttonR").convert();
			}
			
			if(el.options && el.options.useremoveall){
				$(el).prepend('<button class="Button RemoveAllTabs"><span class="Icon Remove" data-position="center"></span></button>').find(".RemoveAllTabs").convert();
			}
			
			// lazy loading : data-lazy-load 속성이 들어간 경우, 선택된 탭 이외의 탭 컨텐트는 나중에 converting 한다. 
			// loading 시간 단축.
			if (el.options.lazyload === 'true') {
				$el.find('[data-type]').each(function() {
					this.options.phase = 'pending';
				});
			}

			var eventAttr = this._getProperty(el, 'tabstrigger');
			if (eventAttr === 'hover' || eventAttr === 'hovering') {
				el.options.tabstrigger = 'hoverstart';
			}

			var removeBtnAttr = this._getProperty(el, 'removebutton');
			if (removeBtnAttr) {
				el.options.removebutton = removeBtnAttr;
			}

			el.buttonGroup = $el.find('> ul, >div.Scroller>ul');
			
			//this._setTabWidth(el);
			
			if (el.buttonGroup.length === 0) {
				el.buttonGroup = $el.find('.af-tabs-button-group');
				el.buttons = el.buttonGroup.find('> li');
			} else {
				el.buttonGroup.addClass('af-tabs-button-group');
				el.buttons = el.buttonGroup.find('> li');
				
				this._setButtongroupWidth(el);	
			}
			// li default로 ellipsis 적용
			$(el.buttons).addClass("Ellipsis");
			
			el.removebuttons = [];
			
			if (el.buttons.length > 0) {
				el.buttons.on('click', function(e) { // default 이벤트 무시.
					e.preventDefault(); // stop navigating to 'ajax loding page'
				});
				
				var buttonWidth = -1;
				
				if(this._getProperty(el,'contentsdisplay') == 'flex') {
					buttonWidth = el.buttonGroup.innerWidth() / el.buttons.length; // innerWidth : Get the current computed inner width (including padding but not border)
				}
				
				for ( var i = 0; i < el.buttons.length; i++) {
					this._makeTabButton(el, el.buttons[i], i, buttonWidth);
				}

				$.alopex.widget.tabs._setTabIndex(el, 0, el.options.initfocus);
				$(el).on('keydown', $.alopex.widget.tabs._keyEventHandler);
			}
			this._setTabWidth(el);
			this._unbindEvent(el);
			this._bindEvent(el);
			
			$.alopex.widget.tabs._resizeHandler(el);
			// Resize 이벤트 등록 
			$(window).resize(this._resizeEvent(el, this._resizeHandler));

			// init 시점에서 draggable=false이면 아무것도 안한다
			if(el.options && el.options.draggable){
				var i;
				for ( i = 0 ; i < el.buttons.length ; i++) {
					$(el.buttons[i]).attr("draggable", true);
					$(el.buttons[i]).on("dragstart", this._tabDrag);
					$(el.buttons[i]).on("drop", this._tabDrop);
					$(el.buttons[i]).on("dragover", this._allowTabDrop);
				}
			}
		},

		// 공통 함수로 빼는 함수 
		_resizeEvent: function(el, handler){
		    window.resizeEvt;
		    $(window).resize(el, function(e)
		    {
		        window.resizeEvt = handler(el) ;
		    });
		},

		// 공통 함수로 뺀다면, widget 별로 _resizeHandler 호출하는 형태가 될 것임
		_resizeHandler : function(el){
			var $el = $(el);
			var $ul = $el.find('>ul');
			var $scroller = $el.find('.Scroller');
			var marginLeft = parseFloat($(el).css("margin-left")); 
			if($scroller.length){
				$scroller.css('width', '1');
				$ul.css('width', '1');
				$el.css('width', '100%');				
				// 2Depth 인 경우에는 margin-left 값을 가지므로, 그만큼 뺀 값을 너비 값으로 설정 
				if ( (typeof marginLeft === "number") && marginLeft > 0 ){
					$scroller.css('width', $el.width() - marginLeft );
					$el.css('width', $el.width() - marginLeft);
				} else{
					$scroller.css('width', $el.width());
					$el.css('width', $el.width());
				}
				$ul.css('width', ' ');
			}
			
			var $depth2 = $el.find(">.af-tabs-content >.Vertical-sub-tabs");
			var $subTabs = $depth2.find(">div");
			if ( $depth2.length ){
				// 컨텐츠 영역의 border 값을 빼줌
				var $divVerticalsubtabs = $depth2.first().parent();
				var border = parseInt($divVerticalsubtabs.css('border-left'));
				if(isNaN(border)){ // IE 의 경우 .css('border-left') 하면 NaN 이기에 .css('border-left-width')를 사용. 소수점 나올 수 있으니 parseFloat
					border = parseFloat($divVerticalsubtabs.css('border-left-width'));
				}
				$depth2.css('width', $el.width() + marginLeft - border );
				$subTabs.css('width', $el.width());
			}
			
			$.alopex.widget.tabs._setButtongroupWidth(el);
			
		},
		
		// 탭 버튼(li) 너비에 'px' 붙여서 string 리턴
		_validationTabWidth: function(width){
			if(width === null) return null;
			var _width = width;
			if($a.util.isNumberType(_width)){ // 숫자만 있는 number or string 인 경우
				return _width + 'px';
			}else{ // 숫자가 아닌 string이 들어간 상태. 예를 들어 px 또는 % 와 같은.
				_width = width.split('px')[0];
				if($a.util.isNumberType(_width)){
					return _width + 'px';
				}else{
					console.error('arg "' + width + '" is not correct type');
					return null;
				}
			}
		},
		
		setTabWidth: function(el, width){
			var result = $.alopex.widget.tabs._validationTabWidth(width);
			if(result != null){
				el.options.tabwidth = width;
				$(el).attr('data-tab-width', el.options.tabwidth);
				this._setTabWidth(el); //  li width를 먼저 설정해주고,
				this._setButtongroupWidth(el); //  그 다음에 ul 너비를 설정 해준다
				$.alopex.widget.tabs._resizeHandler(el);
			}
		},
		setDraggable: function(el, flag) {
			var i;
			var button;
			var events;
			
			if(flag) {
				el.options.draggable = true;
			}else{
				el.options.draggable = false;
			}
			
			for ( i = 0 ; i < el.buttons.length ; i++) {
				button = el.buttons[i];
				events = $._data(button, "events");
				
				if(flag){ // Draggable 이벤트 추가
					var draggable = $(button).attr("draggable");
					if(draggable == undefined || draggable == false || draggable == "false") {
						$(button).attr("draggable", true);
					}
					// 이벤트 핸들러 없으면 추가
					if(!events.dragstart) 	$(button).on("dragstart", this._tabDrag);
					if(!events.drop) 		$(button).on("drop", this._tabDrop);
					if(!events.dragover) 	$(button).on("dragover", this._allowTabDrop);
				}else{  // Draggable 이벤트 제거
					var draggable = $(button).attr("draggable");
					if(draggable == true || draggable == "true") {
						$(button).attr("draggable", false);
					}
					// 이벤트 핸들러 있으면 제거
					if(events.dragstart) $(button).off("dragstart", this._tabDrag);
					if(events.drop) 	$(button).off("drop", this._tabDrop);
					if(events.dragover) 	$(button).off("dragover", this._allowTabDrop);
				}
			}
		},
		_tabDrag: function(e) {
			var el = e.target;
			var $el = $(el);
			var index = $el.parent('ul').children('li').index(el)
		    var $tabEl = $el.closest('div.Tabs');
		    $tabEl.prop("dragging_index", index);
		},
		_tabDrop: function(e) {
			var el = e.target;
			var $el = $(el);
			var $tabEl = $(el).closest('div.Tabs');
			var dragging_index = $tabEl.prop("dragging_index");
			
			if(dragging_index == undefined) return;
			
			var draggingTab = $el.parent('ul').children('li').get(dragging_index);
			var liWidth = $el.width();
			var leftEnd = $el.offset().left;

			var mouse_clientX;
			if(!e || !e.clientX) {
				mouse_clientX = window.event.clientX;
			}else{
				mouse_clientX = e.clientX;
			}

			if(mouse_clientX > leftEnd + (liWidth/2)){	
				$(draggingTab).insertAfter($el);
			}else{
				$(draggingTab).insertBefore($el);
			}
			$.alopex.widget.tabs._refeshButtonGroup($tabEl[0]);
			
			//drop 한 탭 선택 및 포커스 주기
			var newIndex = $el.parent('ul').children('li').index(draggingTab);
			$.alopex.widget.tabs._setTabIndex($tabEl[0], newIndex, true);
			
			e.preventDefault();
		},
		_allowTabDrop: function(e) {
		    e.preventDefault();
		},
		defer: function(el, options){
			if(el.options && el.options.carousel) {
				var timer = setInterval(function() { // waiting for all contents rendered
					if(!$(el).is(':hidden')) {
						clearInterval(timer);
						if(el.options && el.options.carousel) {
							$(el).find('> .af-tabs-content, >div:not(.Scroller)').attr('data-role', 'page');
							$(el).attr('data-type', 'carousel').carousel();
						}
					}
				}, 200);
			}
		},

		_evt_swipe: function(e, c) {
			__ALOG('swipe');
			var el = $(e.currentTarget).parent('[data-type="carousel"]')[0];
			var duration = (el.width - Math.abs(c.distanceX)) / c.speed * 1000;
			if (duration > 500) {
				duration = 500;
			}
			var destindex = el._currentTabIndex;
			if (c.distanceX < 0) { // 좌측 이동
				do {
					destindex ++;
				}while(!$.alopex.widget.tabs.isEnabled(el, destindex) && destindex < el.buttons.length);
			} else { // 우측 이동
				do {
					destindex --;
				}while(!$.alopex.widget.tabs.isEnabled(el, destindex) && destindex >= 0);
			}
			if(destindex == -1 || destindex >= el.buttons.length) {
				$.alopex.widget.tabs._setTabIndex(el, el._currentTabIndex);
			} else {
				$.alopex.widget.tabs._setTabIndex(el, destindex);
			}
			el.press = false;
			$(el).trigger('swipechange', [el._currentTabIndex]);
		},

		_keyEventHandler: function(e) {
			var target = e.target;
			var originalTarget = target;
			var el = e.currentTarget;
			if ($(el.buttons).filter(target).length <= 0) {
				return;
			}
			var found = false;

			while ($.alopex.util.isValid(target) && !found) {
				var code = e.keyCode !== null ? e.keyCode : e.which;
				switch (code) {
				case 9: // tab
					return;
				case 37: // left
				case 38: // up
					if ($(target).prev().length !== 0) {
						target = $(target).prev()[0];
					} else {
						target = $(target).siblings().last()[0];
					}
					e.preventDefault();
					break;
				case 39: // right
				case 40: // down
					if ($(target).next().length !== 0) {
						target = $(target).next()[0];
					} else {
						target = $(target).siblings().first()[0];
					}
					e.preventDefault();
					break;
				default:
					return;
				}
				var that = $.alopex.widget.tabs;
				if(that.isEnabled(el, target.index) || target == originalTarget ) {
					found = true;
				}
			}

			$.alopex.widget.tabs._setTabIndex(target.element, target.index, true);
			e.preventDefault();
		},

		refreshButtons: function(el, index, setFocus) {
			el.buttonGroup.children().attr('aria-selected', 'false').attr('tabindex', '-1').removeClass('af-selected Selected');
//			el.buttonGroup.children().find('.RefreshButton').hide();
			if (setFocus == true) {
				el.buttonGroup.children().eq(index).attr('aria-selected', 'true').attr('tabindex', '0').addClass('af-selected Selected').focus();
			} else {
				el.buttonGroup.children().eq(index).attr('aria-selected', 'true').attr('tabindex', '0').addClass('af-selected Selected');
			}
//			el.buttonGroup.children().eq(index).find('.RefreshButton').show();
		},

		_loadHTML: function(button, el, callback) {
			// var tmpContent = button.content;
			this.requestButton = button;
			var isIframe = $(button).attr('data-content-iframe');
			
			$.alopex.loading = true;
			if(isIframe === "true" || isIframe === true) {
				var iframe = $('<iframe></iframe>')
				.attr('src', $(button).attr('data-content'))
				.attr('name', $(button).attr('data-content-iframe-id'))
				.attr('id', $(button).attr('data-content-iframe-id'))
				
				$(button.content).html(iframe);
				// data-content-iframe true Tabs에서 setTabIndex(index) API 이용하여 동일 index가 연속(중복) 호출되면, iframe contents를 중복 request 하는 현상 발생
				// iframe contents를 중복 request하면서 iframe contents 내 jquery lib 에서 error 발생 ( IE11 SCRIPT5007: 정의되지 않음 또는 null 참조인 'random' 속성을 가져올 수 없습니다. )
				// html(iframe) 호출 시 이미 컨텐츠 request 한 상태이므로, $(button.content).html(iframe); 직 후, button.loadType를 local로 변경한다.
				// 이렇게 되면 setTabIndex(index) API 이용하여 동일 index가 연속(중복) 호출되더라도, iframe contents 중복 request 하지 않게 된다(정상)
				// iframe onload 콜백에서 button.loadType = 'local'; 이 다시 수행되는데, 기존 로직이므로 유지한다.
				button.loadType = 'local'; // 한 번 load 이후에는 local 로 바꿔준다. local 이면, _setTabIndex() 의 _loadHTML()를 더 이상 수행하지 않는다. (=컨텐츠 다시 요청하지 않는다.)
				iframe.on({
					load : function() {
						button.loadType = 'local'; // 한 번 load 이후에는 local 로 바꿔준다. local 이면, _setTabIndex() 의 _loadHTML()를 더 이상 수행하지 않는다. (=컨텐츠 다시 요청하지 않는다.)
						$(el).trigger('tabchange', $.alopex.widget.tabs._getIndexArrayFromButton(button));

						if(callback) {
							callback();
						}
					}
			    });
				
			} else {
				var asyncFlag = false; // 기본 sync 
				if($(button).attr('data-subtab-button1') == undefined){
					// 서브탭 탭버튼이 아닌 메인탭 탭버튼인 경우 sync
					asyncFlag = false;
				}else if($(button).attr('data-subtab-button1') != "true"){
					// 서브탭 탭버튼인데, 첫 번째이면 sync (첫 화면 빠른 로딩)
					// 서브탭 탭버튼인데, 첫 번째 아니면 async (숨은 화면 느린 로딩)
					asyncFlag = true; // async
				}
				var url = $(button).attr('data-url') || $(button).attr('data-content');
				if(url.charAt(0) === "#"){
					// HiQ1 로컬은 발생 안하나, 개발계 올리면 url앞에 # 붙어서 sso 에러 발생한다고 함
					url = url.replace("#", ""); // 일단, 맨 앞에 # 있다면 1개만 없애준다.
				}
				$.ajax({
					url : url,
					cache : false,
					async : asyncFlag,
					complete : function(xhr, status) {
						var button = $.alopex.widget.tabs.requestButton;
						if(status === 'error') {
							var msg = '<p>해당 웹페이지를 사용할 수 없음</p>' + '<p style="color:red;">' + xhr.statusText + '</p>';
							$(button.content).html(msg);
						} else {
							button.loadType = 'local';  // 한 번 load 이후에는 local 로 바꿔준다. local 이면, _setTabIndex() 의 _loadHTML()를 더 이상 수행하지 않는다. (=컨텐츠 다시 요청하지 않는다.)
							$(button.content).html(xhr.responseText).convert();
							$(el).trigger('tabchange', $.alopex.widget.tabs._getIndexArrayFromButton(button));
							$(document).trigger('alopexuiready'); // -> init
							if(callback) {
								callback(); // tabchange
							}
							$(window).trigger("resize"); // 탭 컨텐츠가 길 경우, 세로스크롤 생기고 가로스크롤이 생기는 현상 방지
						}
					}
				});
			}
		},

		getCurrentTabIndex: function(el) {
			if(el.depth === 1){
				return el._currentTabIndex;
			}else if(el.depth === 2){
				return [el._currentTabIndex, el.buttons[el._currentTabIndex].depth2Tabs._currentTabIndex];
			}
		},
		
		// data-content attr 문자열 리턴
		getCurrentTabContent: function(el) {
			if(el.depth === 1){
				return el._currentTabContent;
			}else if(el.depth === 2){
				return [el._currentTabContent, el.buttons[el._currentTabIndex].depth2Tabs._currentTabContent];
			}
		},
		
		// content 를 감싸는 div 리턴
		getTabContentByIndex: function(el, index, index2) {
			if($.alopex.util.isValid(index) && el.buttons && el.buttons[index]){
				if(index2){
					try{
						return el.buttons[index].depth2Tabs.buttons[index2].content;
					}catch(err){
						return;
					}
				}
				return el.buttons[index].content;
			}else{
				return null;
			}
		},

		setTabByContent: function(el, conName) {
			if (el.buttonGroup.length > 0) {
				var index = el.buttonGroup.find('[data-content="' + conName + '"]').index();
				if(!this.isEnabled(el, index)) {
					return;
				}
				this._setTabIndex(el, index);
			}
		},

		// beforetabchange 이벤트 핸들러에서 사용하면, _setTabIndex 시작 시점에 탭 체인지를 막는 코드가 수행됨
		cancelThisTabChange: function(el) {
			el.canceltabchange = true;
		},
		setTabIndex: function(el, index, setFocus){
			var $el = $(el);
			// _setTabIndex 에서 이벤트 트리거 시, 2Depth의 경우 이벤트가 2번 호출됨 
			// beforetabchange, tabchange 이벤트 호출은 setTabIndex 에서 처리하고
			// 그 외의 실질적인 동작은 _setTabIndex 함수를 호출하여 처리
			if( typeof index === "object"){ // subTab에 대한 setTabIndex 인 경우
				var depth1 = index[0];
				var depth2 = index[1];
				if( !$.alopex.widget.tabs.isEnabled(el, depth1, depth2)) {
					return;
				}
				var subTab = $(el).getSubTabByIndex(depth1);
				$el.trigger('beforetabchange', index);
				if(el.canceltabchange === true){
					el.canceltabchange = false;
					return;
				}
				$.alopex.widget.tabs._setTabIndex(el, depth1, setFocus);
				$.alopex.widget.tabs._setTabIndex(subTab, depth2, setFocus);
			} else { 
				if( el.isDepth2Tab ){
					var currentTab = $.alopex.widget.tabs.getSubTabByIndex(el, index);
					if (currentTab) {
						$el.trigger('beforetabchange', [index, currentTab._currentIndex]);
					} else {
						// addTab을 통한 1depth 생성 시, 2 depth 가 그려지지 않은 상태에서 setTabIndex 를 호출하게됨
						// 서브 탭의 커런트인덱스를 가져올수 없으므로 depth2 값을 0으로 설정하여 보냄
						$el.trigger('beforetabchange', [index, 0]);
					}
				} else {
					$el.trigger('beforetabchange', [index]);
				}
				if(el.canceltabchange === true){
					el.canceltabchange = false;
					return;
				}
				$.alopex.widget.tabs._setTabIndex(el, index, setFocus);
				if( el.isDepth2Tab && el.buttons[el._currentTabIndex].depth2Tabs ){
					var subEl = el.buttons[el._currentTabIndex].depth2Tabs;
					$.alopex.widget.tabs._setTabIndex(subEl, subEl._currentTabIndex, false);
				}
			}
		},
		_setTabIndex: function(el, index, setFocus) {
			var $el = $(el);
			
			if(!this.isEnabled(el, index)) {
				return;
			}
			
			//$el.trigger('beforetabchange', $.alopex.widget.tabs._getIndexArrayFromButton(el.buttons[index]));
			if(el.canceltabchange === true){
				el.canceltabchange = false;
				$.alopex.widget.tabs._setTabIndex(el, el._currentTabIndex, true);
				return;
			}

			if(el.options && el.options.beforeunload && el.options.beforeunload[el._currentTabIndex]) {
				if(el.options && el.options.beforeunload[el._currentTabIndex]() === false) {
					return;
				}
			}
			
			el._currentTabIndex = index; // 탭 변경에 따른 현재 탭인덱스 갱신
			var that = this;
			var contents = [];
			// var isAjax = false;
			if (el.buttonGroup.length > 0) {
				var buttons = el.buttonGroup.children();
				el._currentTabContent = $(buttons[index]).attr('data-content');
				$(buttons).each(function(i, v) {
					var button = v;
					// 이전 E&S에서 선택되지 않은 콘텐트  5px로 지정해 주었다, 나중에 풀어주는 형태로 짰는데, 왜 그런지 까먹음.
					// 이전에 탭에 캐러셀 적용 시 스타일 문제가 있었던 거로 기억하는데 자세한건 모름.
					// 우선 제외. IDE쪽이랑 문제생김. 나중에 문제되면 저한테 알려주세요.
//					$(button.content).css('height', '5px'); // unselected content must not affect the height of the tabs
					if (i === index) {
						if ($el.attr('data-flexbox') === 'true') {
							$(button.content).css({
								'display': '-webkit-box'
							});
						} else {
							$(button.content).css('display', 'block');
						}
//						$(button.content).css('height', ''); // 위의 5px 삭제와 짝.

						if (button.loadType === 'ajax') {
							isAjax = true;
							that._loadHTML(button, el);
						} else {
							// 탭이 바뀔때 tabchange 이벤트 발생. 인자로는 index 넘겨줌.
							// $.alopex.convert(button.content, true); // 강제 변환. //콘텐츠가 한화면에 있기 때문에 이미 컨버팅 된 상태.
							// 1depth 선택 + 2depth 선택 중복 호출 되는 현상 방지 
							var indexArray = $.alopex.widget.tabs._getIndexArrayFromButton(button);
							if( el.isDepth2Tab && indexArray.length === 2 ){
								$(el).trigger('tabchange', $.alopex.widget.tabs._getIndexArrayFromButton(button));
							} else if ( !el.isDepth2Tab ){
								$(el).trigger('tabchange', $.alopex.widget.tabs._getIndexArrayFromButton(button));
							}
						}
					} else {
						contents.push(button.content);
					}
				});
				if(el.options && el.options.carousel) {
					$el.setIndex(index, {animationDuration: 0}); // carousel 인덱스 선택.
//					for(var i=0; i<contents.length; i++) {
//					$(contents[i]).css('height', '10px');
//					}
				} else {
					for(var i=0; i<contents.length; i++) {
						var $content = $(contents[i]);
						if(el.depth === 1){
							$content.find("> div.Vertical-sub-tabs > div.af-tabs-content").css('display', 'none');
						}
						$content.css('display', 'none');
					}
				}
				this.refreshButtons(el, index, setFocus);
				
				if(el.options && el.options.buttonScroller){
					this._moveScrollToShowTabButton(el);
					this._toggleButtonScrollDisabled(el);
				}	
			}
		},

		clear: function(el, index) {
			var $content = $(this.getContent(el, index));
			if($.alopex && $.alopex.page) {
				for(var i in $.alopex.page) {
					if($.alopex.page.hasOwnProperty(i) && i.indexOf('#') == 0 && $content.find(i).length > 0) {
						delete $.alopex.page[i];
					}
				}
			}
			$content.empty();
			if(this.getButtons(el) && this.getButtons(el)[index]) {
				this.getButtons(el)[index].loadType = 'ajax';
			}
		},

		setEnabledByContent: function(el, flag, conName) {
			if (el.buttonGroup.length > 0) {
				var index = el.buttonGroup.find('[data-content="' + conName + '"]').index();
				if(index === -1 && this._isDepth2Tab(el)){
					$.each(el.buttons, function(index, button){
						index = button.depth2Tabs.buttonGroup.find('[data-content="' + conName + '"]').index();
						if(index !== -1) {
							el = button.depth2Tabs;
							return false;
						}
					});
				}
				if(flag != this.isEnabled(el, index)) {
					this.setEnabled(el, flag, index);
				}
			}
		},

		// index가 있을 경우, 
		setEnabled: function(el, flag, index) {
			if(index != undefined) {
				if(index instanceof Array) { // 
					for(var i=0; i<index.length; i++) {
						this._setEnabled(el, flag, index[i]);
					}
				} else {
					this._setEnabled(el, flag, index);
				}
			} else { // index가 존재 하지 않는 경우, 전체 탭버튼이 다 적용.
				for(var i=0; i<el.buttons.length; i++) {
					this._setEnabled(el, flag, i);
				}
			}
		},

		_addDisabledStyle: function(el, index) {
			var $button = $(el.buttons).eq(index).addClass('af-disabled Disabled');
			if (el.options.removebutton) {
				$(el.removebuttons).eq(index).addClass('af-disabled Disabled');
			} else if($(el.buttons).eq(index).find('.'+this.classNames.removebutton).length > 0) {
				$button.find('.'+this.classNames.removebutton).addClass('af-disabled Disabled');
			}
			if (el.options.refreshbutton) {
				$(el.refreshbuttons).eq(index).addClass('af-disabled Disabled');
			} else if($(el.buttons).eq(index).find('.'+this.classNames.refreshbutton).length > 0) {
				$button.find('.'+this.classNames.refreshbutton).addClass('af-disabled Disabled');
			}
		},

		_removeDisabledStyle: function(el, index) {
			var $button = $(el.buttons).eq(index).removeClass('af-disabled Disabled');
			if (el.options.removebutton) {
				$(el.removebuttons).eq(index).removeClass('af-disabled Disabled');
			} else if($(el.buttons).eq(index).find('.'+this.classNames.removebutton).length > 0) {
				$button.find('.'+this.classNames.removebutton).removeClass('af-disabled Disabled');
			}
			if (el.options.refreshbutton) {
				$(el.refreshbuttons).eq(index).removeClass('af-disabled Disabled');
			} else if($(el.buttons).eq(index).find('.'+this.classNames.refreshbutton).length > 0) {
				$button.find('.'+this.classNames.refreshbutton).removeClass('af-disabled Disabled');
			}
		},

		isEnabled: function(el, index, index2) {
			if (index < 0 || el.buttons.length <= index) {
				console.error("[Alopex] index : " + index + " is not valid");
				return false;
			}
			if ( index2 && ( index2 < 0 || el.buttons[index].depth2Tabs.buttons.length <= index2 ) ){
				console.error("[Alopex] index : [" + index + ","+index2+"] is not valid");
				return false;
			}
			return !$(el.buttons).eq(index).hasClass('af-disabled Disabled');
		},

		_setEnabled: function(el, flag, index) {
			if(flag) {
				if(!this.isEnabled(el, index)) {
					this._bindEvent(el, index);
					this._removeDisabledStyle(el, index);
				}
			} else {
				this._unbindEvent(el, index);
				this._addDisabledStyle(el, index);
			}
		},

		// 뎁스 1 탭 클릭 시 뎁스 2 탭중 하나 클릭해주자
		_selectCallback: function(e) {
			var that = $.alopex.widget.tabs;
			var tabBtn = e.currentTarget;
			var el = tabBtn.element;

			// li 내의 p, a 등이 클릭된 경우 .index 를 이미 가지고 있는 li 까지 올라간다.
			while (tabBtn.index === null || tabBtn.index === undefined) {
				tabBtn = tabBtn.parentNode;
			}
			var index = $.inArray(tabBtn, el.buttons);
			tabBtn.defaultStyleClass = $(tabBtn).attr('class');
			
			// 기존에는 2 Depth에 대해 $(subTab).setTabIndex(depth2) 만 가능했지만 
			// setTabIndex([depth1, depth2]) 가 가능하므로 한번에 호출함
			// beforetabchange, tabchange 이벤트를 중복 호출하게 되는 것도 방지. 
			if ( el.depth === 2 ){
				var depth1Tabs = tabBtn.depth1Tabs;
				that.setTabIndex(depth1Tabs, [depth1Tabs._currentTabIndex, index]);
			} else if ( el.isDepth2Tab && el.depth === 1) {
				var theTab = $.alopex.widget.tabs.getSubTabByIndex(el, index); // 옮겨갈 탭
				that.setTabIndex(el, [index, theTab._currentTabIndex]); //that._setTabIndex(el, index);
			} else {
				that.setTabIndex(el, index);
			}			
			el.options.eventState = 'focused';
			
/*			try{
				if(el.options.depth2position && el.depth === 1){
					var dummy = {};
					var index2 = tabBtn.depth2Tabs._currentTabIndex;
					dummy.currentTarget = tabBtn.depth2Tabs.buttons[index2];
					$.alopex.widget.tabs._selectCallback(dummy);
				}
			}catch(err){}
			*/
		},

		removeTab: function(el, index, index2) {
			var originalEl = el;
			var originalIndex = index;
			var originalIndex2 = index2;
			
			if(index2 !== undefined){
				if(!el.buttons[index]) return;
				el = el.buttons[index].depth2Tabs;
				index = index2;
			}

			var originIndex = index;
			if (!el.buttons || el.buttons.length == 0) {
				el.buttons = el.buttonGroup.find('> li');
			}
			
			if(!el.buttons[index]) return;
			
			$(originalEl).trigger('removetab', [originalIndex, originalIndex2]);
			
			$(el.buttons[index].content).remove();
			$(el.buttons[index]).remove();
			el.buttons[index] = null;
			el.buttons.splice(index, 1);
			if(el.removebuttons){
				el.removebuttons[index] = null;
				el.removebuttons.splice(index, 1);
			}
			
			$.alopex.widget.tabs._re_setTabIndex(el);
			$.alopex.widget.tabs._setButtongroupWidth(el);

			if(el.buttons.length > 0){
				// index 리무브 버튼 누른 탭
				// el._currentTabIndex 현재 열려있는 탭
				// 탭 삭제된 이 후에 포커스 될 탭을 지정해준다.
				if(index === el._currentTabIndex){
					var length_remaining = $.alopex.widget.tabs.getLength(el);
					if(length_remaining - 1 >= index){
						$.alopex.widget.tabs.setTabIndex(el, index, true);
					}else if(length_remaining - 1 < index){
						$.alopex.widget.tabs.setTabIndex(el, index - 1, true);
					}
				}
			}else if(el.buttons.length == 0){
				// remove 하면 addTab이 불가 하여 삭제 안함
				// $(el).remove();
				// 대신, addTab 시 show() 해준다.
				//$(el).hide();
			}
		},
		_re_setTabIndex: function(el) { // (탭 삭제 등의 이유로) 현재 active 탭을 기준으로 el._currentTabIndex 현재 인덱스로 갱신해준다
			$.each(el.buttons, function( index, value ) {
				value.index = index;
				
				if($(value).hasClass("Selected")
						|| $(value).hasClass("af-selected")
						|| $(value).attr("aria-selected") === "true"
						|| $(value).attr("tabindex") === "0"){
					
					el._currentTabIndex = index;
				}
			});
		},
		_setRemoveBtnEvent: function(e) {
			var removeBtn = e.currentTarget;
			var el = removeBtn.parentElement.element;
			var index = $.inArray(this.parentElement, el.buttons);
			$(el).trigger('removebuttnclick');
			$.alopex.widget.tabs.removeTab(el, index);
		},
		
		_setRefreshBtnEvent: function(e) {
			var refreshBtn = e.currentTarget;
			var el = refreshBtn.parentElement.element;
			var index = $.inArray(this.parentElement, el.buttons);
			$(el).trigger('refreshbuttonclick');
			$.alopex.widget.tabs.reload(el, index);
		},

		_bindEvent: function(el, index) {
			var that = this;
			var $button;
			if(index) {
				$button = $(el.buttons).eq(index);
			} else {
				$button = $(el.buttons);
			}

			if ($button.length == 0) {
				return;
			}

			$button.each(function() {
				that.addHoverHighlight(this);
				that.addPressHighlight(this);
			});

			// add event handler for tab change
			$button.on(el.options.tabstrigger, this._selectCallback);
			
			/* removebutton event */
			var $removeBtn;
			if (el.options.removebutton) {
				if(index) {
					$removeBtn = $(el.removebuttons).eq(index);
				} else {
					$removeBtn = $(el.removebuttons);
				}
			} else {
				$removeBtn = $button.find('.'+$.alopex.widget.tabs.classNames.removebutton);
			}
			
			if($removeBtn && $removeBtn.length>0) {
				$removeBtn.each(function() {
					that.addHoverHighlight(this);
					that.addPressHighlight(this);
				});
				$removeBtn.on('click', this._setRemoveBtnEvent);
			}
			/* refreshbutton event */
			var $refreshBtn;
			if (el.options.refreshbutton) {
				if(index) {
					$refreshBtn = $(el.refreshbuttons).eq(index);
				} else {
					$refreshBtn = $(el.refreshbuttons);
				}
			} else {
				$refreshBtn = $button.find('.'+$.alopex.widget.tabs.classNames.refreshbutton);
			}
			
			if($refreshBtn && $refreshBtn.length>0) {
				$refreshBtn.each(function() {
					that.addHoverHighlight(this);
					that.addPressHighlight(this);
				});
				$refreshBtn.on('click', this._setRefreshBtnEvent);
			}
		},
		
		_unbindEvent: function(el, index) {
			var that = this;
			var $button;
			if (index != undefined) {
				$button = $(el.buttons).eq(index);
			} else {
				$button = $(el.buttons);
			}

			if ($button.length == 0) {
				return;
			}

			$button.each(function() {
				that.removeHoverHighlight(this);
				that.removePressHighlight(this);
			});

			// add event handler for tab change
			$button.off(el.options.tabstrigger, this._selectCallback);
			
			if (el.options.removebutton) {
				var $removeBtn;
				if(index) {
					$removeBtn = $(el.removebuttons).eq(index);
				} else {
					$removeBtn = $(el.removebuttons);
				}

				if ($removeBtn.length == 0) {
					return;
				}

				$removeBtn.each(function() {
					that.removeHoverHighlight(this);
					that.removePressHighlight(this);
				});

				$removeBtn.off('click', this._setRemoveBtnEvent);
			}
			if (el.options.refreshbutton) {
				var $refreshBtn;
				if(index) {
					$refreshBtn = $(el.refreshbuttons).eq(index);
				} else {
					$refreshBtn = $(el.refreshbuttons);
				}

				if ($refreshBtn.length == 0) {
					return;
				}

				$refreshBtn.each(function() {
					that.removeHoverHighlight(this);
					that.removePressHighlight(this);
				});

				$refreshBtn.off('click', this._setRefreshBtnEvent);
			}
		},
		_showButtonScrollerPosition : function(el, isScrollbuttonShow) {
		
			var added_buttons = $(el).find(".ScrollerbuttonL, .ScrollerbuttonR, .RemoveAllTabs");
			
			$(added_buttons).each(function(){
				el[$(this).attr('class')] = $(this).attr('class');
				this.el = el; // 나중에 참조하기 위해 (_clickScrollbutton 에서)
				
				// 탭 크기에 맞게 버튼의 높이를 조정해준다
				if(el.buttons && el.buttons.length > 0){		
					var margin = $(this).css('margin').split('px')[0];
					$(this).css('min-height', $(el.buttons[0]).height() - (Number(margin) *  2));
				}
			});
			
			// 사용자 정의한 것 사용 가능 $.alopex.widget.tabs.scrollButtonClickCallback = function(e) { ... }
			var userClickCallback = this._clickScrollbutton;
			if($.alopex.util.isValid($.alopex.widget.tabs.scrollButtonClickCallback) && typeof $.alopex.widget.tabs.scrollButtonClickCallback === 'function'){
				userClickCallback = $.alopex.widget.tabs.scrollButtonClickCallback;
			}

			if(isScrollbuttonShow){
				this._toggleButtonScrollDisabled(el);
				// 스크롤 버튼 보여주기
				added_buttons.show();
				added_buttons.off("mouseup", userClickCallback); // 혹시 바인딩 되어 있는데 또 하게 될 수 있으니 일단 off 해주고 나서 on 해주자
				added_buttons.on("mouseup", userClickCallback);
			}else{
				// 스크롤 버튼 없애기
				added_buttons.hide();
				added_buttons.off("mouseup", userClickCallback);
			}
			// G-proQ 구매자재 scrollButtonClickCallback 프로젝트 재정의 내용 백업
/*				$.alopex.widget.tabs.scrollButtonClickCallback = function(e) {
			
						var btn = e.currentTarget;
						var el = btn.el; // tabs element
						
						if($(btn).hasClass("ScrollerbuttonL")){
							
							//$.alopex.widget.tabs._setTabIndex(el, el._currentTabIndex - 1); // 한 칸 왼쪽으로
							$.alopex.widget.tabs._setTabIndex(el, 0); // 왼쪽 끝으로 이동
							$.alopex.widget.tabs._moveScrollToShowTabButton(el);
							
						}else if($(btn).hasClass("ScrollerbuttonR")){
							
							//$.alopex.widget.tabs._setTabIndex(el, el._currentTabIndex + 1); // 한 칸 오른쪽으로
							$.alopex.widget.tabs._setTabIndex(el, el.buttons.length - 1); // 오른쪽 끝으로 이동
							$.alopex.widget.tabs._moveScrollToShowTabButton(el);
							
						}else if($(btn).hasClass("RemoveAllTabs")){
							// tab index 0 부터 끝까지 삭제
							//while(el.buttons.length > 0){
							//	$.alopex.widget.tabs.removeTab(el, 0);
							//}
							
							// tab index 1 부터 끝까지 삭제
							while(el.buttons.length > 1){
								$.alopex.widget.tabs.removeTab(el, 1);
							}
			
							$.alopex.widget.tabs._setButtongroupWidth(el);
						}
						return false;
					};	*/
			
		},
		// 좌우측에 탭이 가려져서 안보일 경우, 내부적으로 브라우저 가로 스크롤을 이동시켜서 활성화된 탭이 화면에 보이도록 함
		_moveScrollToShowTabButton : function(el) {
			
			var $buttonScroller = $(el).find(".ButtonScroller");	
			if($buttonScroller.length === 0) return; // .ButtonScroller 없으면 아래의 내용 수행할 필요 없음
			
			var $currentTabButton = $( this._getButtonByTabIndex(el) );
			
				// 우측 1칸 이동의 경우
				var tabLeft = $currentTabButton.offset().left + $currentTabButton.outerWidth(); // 포커스탭 우상단 위치
				var wapperLeft = $buttonScroller.offset().left + $buttonScroller.innerWidth(); // 탭그룹 우상단 위치
				if(tabLeft > wapperLeft){
					if(this._isfirstTabSelected(el)){
						$buttonScroller.scrollLeft(10000); // 끝으로
					}else{
						var scrollPosition = $buttonScroller.scrollLeft();
						$buttonScroller.scrollLeft( scrollPosition + ( tabLeft - wapperLeft ) ); // 탭 우측 끝에 가려서 안보이는 부분 만큼만 스크롤 우측으로 이동
					}
					
				}

				var tabLeft = $currentTabButton.offset().left // 포커스탭 좌상단 위치
				var wapperLeft = $buttonScroller.offset().left // 탭그룹 좌상단 위치
				if(tabLeft < wapperLeft){
					if(0 === el._currentTabIndex){
						$buttonScroller.scrollLeft(0); // 처음으로
					}else{
						var scrollPosition = $buttonScroller.scrollLeft();
						$buttonScroller.scrollLeft( scrollPosition - ( wapperLeft - tabLeft ) ); // 탭 좌측 끝에 가려서 안보이는 부분 만큼만 스크롤 좌측으로 이동
					}
					
				}
		},
		_toggleButtonScrollDisabled : function(el) {
			if(this._isfirstTabSelected(el)) {
				$(el).find('.ScrollerbuttonL').setEnabled (false);
				$(el).find('.ScrollerbuttonR').setEnabled (true);
			}else if(this._isLastTabSelected(el)){
				$(el).find('.ScrollerbuttonL').setEnabled (true);
				$(el).find('.ScrollerbuttonR').setEnabled (false);
			}else{
				$(el).find('.ScrollerbuttonL').setEnabled (true);
				$(el).find('.ScrollerbuttonR').setEnabled (true);
			}
			
			if(el.options && el.options.useremoveall){ // 전체 탭 삭제 버튼 사용하는 경우 (data-use-removeall 속성 true 인 경우)
				$(el).find('.RemoveAllTabs').setEnabled (true);
				// 구매자재 pjt RemoveAllTabs 기능 사이트 커스터마이징에서, mousedown 이벤트에서 커스텀 전체탭 삭제(메인탭 이외 탭 모두 삭제) 수행되도록 했고, setEnabled false가 되도록 해줬기 때문에,  이 부분의 소스에서 안전하게 setEnabled true를 해주었다.   
			}
		},
		_isfirstTabSelected : function(el) {
			return (el._currentTabIndex === 0);
		},
		_isLastTabSelected : function(el) {
			return (el._currentTabIndex === this._getLastIndex(el));
		},
		_getLastIndex : function(el) {
			return el.buttons.length - 1;
		},
		_getButtonByTabIndex : function(el) {
			return el.buttons[el._currentTabIndex];
		},
		_clickScrollbutton : function(e) {

			var btn = e.currentTarget;
			var el = btn.el; // tabs element
			
			if($(btn).hasClass("ScrollerbuttonL")){
				
				$.alopex.widget.tabs._setTabIndex(el, el._currentTabIndex - 1); // 한 칸 왼쪽으로
//				$.alopex.widget.tabs._setTabIndex(el, 0); // 왼쪽 끝으로 이동
				$.alopex.widget.tabs._moveScrollToShowTabButton(el);
				
			}else if($(btn).hasClass("ScrollerbuttonR")){
				
				$.alopex.widget.tabs._setTabIndex(el, el._currentTabIndex + 1); // 한 칸 오른쪽으로
//				$.alopex.widget.tabs._setTabIndex(el, el.buttons.length - 1); // 오른쪽 끝으로 이동
				$.alopex.widget.tabs._moveScrollToShowTabButton(el);
				
			}else if($(btn).hasClass("RemoveAllTabs")){

				while(el.buttons.length > 0){
					$.alopex.widget.tabs.removeTab(el, 0);
				}

				$.alopex.widget.tabs._setButtongroupWidth(el);
			}
			return false;
		},
		
		
		_setButtongroupWidth : function(el) {

			var $el = $(el);
			var $scroller = $el.find('>div.Scroller');
			//scroll사용할 경우
			if($scroller.length > 0) {

				var totalWidth = 0;
				
				$(el.buttonGroup[0]).find('> li').each(function() {
					if(this.style.width){
						var num = this.style.width.replace(/[^0-9]/g,"");
						totalWidth += Number(num);
					}else{
						totalWidth += $.alopex.widget.tabs._getCouputedWidth(this);
					}
					
				});
				
				if(el.options && el.options.buttonScroller){ // .ButtonScroller 사용했을 경우에만 동작
					if(totalWidth > $(el).innerWidth()){
						this._showButtonScrollerPosition(el, true);
					}else{
						this._showButtonScrollerPosition(el, false);
					}
				}
				
				if ( $scroller.length && $scroller.width() > totalWidth){
					$(el.buttonGroup).css('width', $scroller.width());
				} else if( $el.width() > totalWidth ){
					$(el.buttonGroup).css('width', $el.width());
				} else{
					
					// FIS Pjt. hynix 테마에서 Fixed Tabs 1px ul:before 조건문 수행하여 맞으면 최종 ul에 1픽셀 더해준다.
					var selectedElement = document.querySelector('.Tabs.Fixed > ul, .Tabs.Fixed > .Scroller > ul');
					var additional = 0;
					if(selectedElement){
						var _style = window.getComputedStyle(selectedElement, ':before');
						
						if(_style && _style.getPropertyValue('width') && _style.getPropertyValue('width').indexOf("1px") !== -1){
							additional = 1; // 최종 ul에 1픽셀 더해준다.
						}
					}
					$(el.buttonGroup).css('width', (totalWidth + additional) + 'px');
				}
			}
			
		},
		
		// el은 하나의 li element 이다
		_getCouputedWidth : function(el) {
			var style = window.getComputedStyle(el); // all the CSS properties of an element after applying the active stylesheets
			var outerWidth = $(el).outerWidth(); // padding, border 포함 너비
			var width = Number(style.width.replace("px", ""));
			var paddingLeft = Number(style.paddingLeft.replace("px", ""));
			var paddingRight = Number(style.paddingRight.replace("px", ""));
			var borderLeft = Number(style.borderLeftWidth.replace("px", ""));
			var borderRight = Number(style.borderLeftWidth.replace("px", ""));
			
			width = width - parseInt(width);
			paddingLeft = paddingLeft - parseInt(paddingLeft);
			paddingRight = paddingRight - parseInt(paddingRight);
			borderLeft = borderLeft - parseInt(borderLeft);
			borderRight = borderRight - parseInt(borderRight);
			
			return width + outerWidth + paddingLeft + paddingRight + borderLeft + borderRight;
		},
		
		// div를 가져와서 ul>li 형태의 탭버튼으로 만들어준다.
		// this._makeTabButton(tabs, li[0], -1, -1);
		_makeTabButton: function(el, tabButton, index, buttonOuterWidth) {
			var prevContent = el.buttonGroup; // ul
			var $tabButton = $(tabButton); // li
			var $el = $(el); // div
			el._currentTabIndex = index;
			tabButton.element = el;
			tabButton.index = index;
			tabButton.depth = 1;
			if(el.options && el.options.removebutton) {
				// 버튼을 만들어서 붙여준다.
				if (!tabButton.removeBtn) {
					var tempButtonEl = document.createElement('button');
					var $tempButtonEl = $(tempButtonEl);
					// class='RemoveButton af-tabs-removebutton'
					$tempButtonEl.attr('type', 'button');
					$tempButtonEl.addClass(this.classNames.removebutton);
					$tempButtonEl.addClass('af-tabs-removebutton');
					$tempButtonEl.appendTo(tabButton); // li 에 append 해준다
					
					tabButton.removeBtn = tempButtonEl;
					// init 에서 el.removebuttons = []; 초기화함
					if(el.removebuttons == undefined) {
						el.removebuttons = []; 초기화
					}
					el.removebuttons.push(tabButton.removeBtn); // [다름-확인필요] 1 엘리먼트 배열
				}
			} else {
				// remove 버튼 배열로 가져와서 저장한다
				el.removebuttons = $el.find('.'+this.classNames.removebutton); // [다름-확인필요] 2 제이쿼리 엘리먼트 배열
			}
			
			if(el.options && el.options.refreshbutton) {
				// 버튼을 만들어서 붙여준다.
				var isIframe = $tabButton.attr("data-content-iframe");
				if ( (isIframe === "true" || isIframe === true) && !tabButton.refreshBtn) {
					var tempRefreshButtonEl = document.createElement('button');
					var $tempRefreshButtonEl = $(tempRefreshButtonEl);
					// class='RemoveButton af-tabs-removebutton'
					$tempRefreshButtonEl.attr('type', 'button');
					$tempRefreshButtonEl.addClass(this.classNames.refreshbutton);
					$tempRefreshButtonEl.addClass('af-tabs-refreshbutton');
					$tempRefreshButtonEl.appendTo(tabButton); // li 에 append 해준다
					if($tempRefreshButtonEl.siblings("." + this.classNames.removebutton).length > 0){ // RemoveButton 과 겹치지 않게 처리
						var right = $tempRefreshButtonEl.css("right");
						
						$tempRefreshButtonEl.css("right", parseInt(right) + $tempRefreshButtonEl.outerWidth() + 2); // 2 간격
					}
					$tabButton.css("padding-right", 38); // title 과 RefreshButton 이 겹치지 않게 일단 패딩 조절했으나, 추후에는 기준 정해서 조절해야 함
					tabButton.refreshBtn = tempRefreshButtonEl;
					// init 에서 el.removebuttons = []; 초기화함
					if(el.refreshbuttons == undefined) {
						el.refreshbuttons = [];
					}
					el.refreshbuttons.push(tabButton.refreshBtn); // [다름-확인필요] 1 엘리먼트 배열
				}
			} else {
				// remove 버튼 배열로 가져와서 저장한다
				el.refreshbuttons = $el.find('.'+this.classNames.removebutton); // [다름-확인필요] 2 제이쿼리 엘리먼트 배열
			}
			
			$tabButton.appendTo(el.buttonGroup);

			// 신규탭 위치가 div.Scroller 밖으로 넘어가면, 신규탭이 보이지 않기 때문에
			// 스크롤 끝으로 이동해준다.
			// appendTo 한 직후는 탭이 순간적으로 2번째 줄로 내려갔다가 스크롤에 의해 다시 1번째 줄로 위치 이동하는데,
			// 위치 이동 후 스크롤 끝으로 이동시키기 위해 setTimeout을 사용했다.
			var $scrolldiv = $(el).children(":first-child");
			var hasScroller = $scrolldiv.hasClass("Scroller");

			if(!$tabButton.hasClass('af-tabs-button')){ // 클래스 없으면 추가
				$tabButton.addClass('af-tabs-button');
			}
			if(!$tabButton.find('img').hasClass('af-tabs-button-icon')){ // 클래스 없으면 추가
				$tabButton.find('img').addClass('af-tabs-button-icon');
			}
			
			if(buttonOuterWidth != -1) {
				$tabButton.outerWidth(buttonOuterWidth);
			}

			var $linktabButton = (tabButton.tagName.toLowerCase() === 'li') ? $tabButton : $tabButton.find('li');
			var address = null;
			if($linktabButton.attr('data-content') != undefined){ // undefined 아니면
				address = $linktabButton.attr('data-content').split('#');
			}
			
			if(address == null || address == undefined || address == "" || address == [""]){
				console.error("'data-content' attribute in the Tabs component is not defined.");
				return;
			}
			
			
			else if (address.length === 1) { // data-content="tabs-targetpath.html" > split > ["tabs-targetpath.html"]
				tabButton.loadType = 'ajax';
			} else if (address.length >= 2) { // data-content="#tab1" > split > ["", "tab1"]
				if (address[0] === '' || address[0] === document.URL.split('#')[0]) {
					tabButton.loadType = 'local';
					tabButton.hashAddr = address[1]; // # 제외한 것
				} else {
					tabButton.loadType = 'ajax';
				}
			}

			switch (tabButton.loadType) {
			case 'local':
				var $content = $(el).find('#' + tabButton.hashAddr);
				if ($content.length > 0) {
					tabButton.content = $content[0];
				} else {
					// #aaa.bbb 이런 아이디 경우 jquery selector 작업시 오류 발생.  .bbb 를 class 로 인식하는 듯..
					var content = document.getElementById(tabButton.hashAddr);
					if($.alopex.util.isValid(content)){
						tabButton.content = content;
					} else {
						tabButton.content = document.createElement('div');
						$(tabButton.content).attr('id', tabButton.hashAddr);
						
						if(hasScroller){
							$(tabButton.content).insertAfter($scrolldiv[0]); // scroller 있으면 스크롤러 div 다음에
						}else{
							$(tabButton.content).insertAfter(prevContent); // scroller 없으면 ul(=prevContent) 다음에
						}
					}
				}
				break;
			case 'ajax': // ajax 요청으로 지정 시 동적으로 content 영역 insert.
				tabButton.content = document.createElement('div');
				if(hasScroller){
					$(tabButton.content).insertAfter($scrolldiv[0]); // scroller 있으면 스크롤러 div 뒤에
				}else{
					$(tabButton.content).insertAfter(prevContent); // scroller 없으면 ul 뒤에
				}
				break;
			default:
				break;
			}
//			prevContent = tabButton.content;
			if (!$.alopex.util.isValid($(tabButton.content).attr('class'))) {
				$(tabButton.content).addClass('af-tabs-content');
			}
			
			if(el.options && el.options.depth2position == "left" && tabButton.depth2data){
				
				$el.one("depth2tabready", function(){
					
					$(el).css({
						"margin-left" : 40
					});
					
//					// 2 Depth 인 경우에는 left tab가 위치하는 너비만큼(margin-left)
//					// 뺀 너비 값을 Scroller의 너비로 설정 
//					var $scroller = $(el).find('.Scroller');
//					if ( $scroller.length ){
//						$scroller.css('width', $(el).width() - 40 );
//					}
					var subEl = tabButton.depth2Tabs;
					if(!subEl){
						// Vertical-sub-tabs 탭 컴퍼넌트 추가
						var div = document.createElement("DIV");
						div.className = "Tabs Vertical-sub-tabs";
						// 각 Vertical-sub-tabs 탭 컴퍼넌트는 각 li에서 참조
						subEl = tabButton.depth2Tabs = div;
						subEl.buttonGroup = document.createElement("UL");
						subEl.buttonGroup.className = 'af-tabs-button-group';
						div.appendChild(subEl.buttonGroup);
						subEl.buttonGroup = $(subEl.buttonGroup); // jquery 객체로 변환
						subEl.depth = 2;
						subEl.buttonGroup.buttons = [];
						subEl.buttons = [];
						subEl.options = {};
						subEl.options.tabstrigger = el.options.tabstrigger;
						tabButton.content.appendChild(subEl);
					}

					$.each(tabButton.depth2data, function(index, data){
						var $li = $('<li><p>'+ data.title +'</p></li>');
						var li = $li[0];
						li.depth = 2;
//						var subContentId = "sub" + Math.floor(Math.random()*10000);
						$li.attr( "data-content", ("#"+ data.url) ); // ex) "sub3946"
						$li.addClass("Ellipsis");
						$li.attr( "data-url", data.url ); // ex) "abc.html"
						if(index === 0){				
							// sub tab의 li 이면서 첫 번째 li 임을 표시
							// sub tab 첫 번째 li 는 ajax sync (sync가 로딩 빠르다. 첫 컨텐츠는 가져오기/렌더 우선적으로 수행)
							// sub tab 그 밖의 li 들은 ajax async (async는 로딩 느리다. 그 밖의 컨텐츠는 hide 한 상태로 천천히 가져옴)
							$li.attr( "data-subtab-button1", true);
						}
						$li.on('click', function(e) { // default 이벤트 무시.
							e.preventDefault(); // stop navigating to 'ajax loding page'
						});
						var $ul = $(subEl.buttonGroup);
						$ul.append(li);
						subEl.buttonGroup.buttons = $ul.find('>li');
						subEl.buttons = subEl.buttonGroup.buttons;
						
						var subContent = document.createElement("DIV");
						var $subContent = $(subContent);
						$subContent.css('display', 'none');
						$subContent.addClass("af-tabs-content");
						subContent.url = data.url;
						$(subEl).append(subContent);
						
						li.content = subContent;
						li.element = subEl;
						li.depth1Tabs = el;
						li.index = subEl.buttonGroup.buttons.length - 1;
						li.loadType = 'ajax'; // 일단.. 통신으로 가져오는 것만 가능하도록
						
						$.alopex.widget.tabs.setTabIndex(subEl, li.index, false);
					});
					
					$.alopex.widget.tabs._unbindEvent(subEl);
					$.alopex.widget.tabs._bindEvent(subEl);
					
					$.alopex.widget.tabs._resizeHandler(el);
					
					// 20161122 HiQ1 - 디폴트 기능 변경. 최초 subTab addTab 후 0번째 _setTabIndex 하는 것 주석처리
					//$.alopex.widget.tabs._setTabIndex(subEl, 0, false);
				});
				
			}

		},
		addTab: function() {
			var li = null;
			var $li = null;
			var tabs = arguments[0]; // tabs === el
			$(tabs).show();
//			var isDepth2 = false;
			if(arguments.length == 4){
//				isDepth2 = true;
				// arguments[0] - tabs element
				// arguments[1] - title
				// arguments[2] - #contentId
				// arguments[3] - depth2 data  [ {title:"title", url:"url.html"}, {...}, {...}, ... ]
				var li = $(tabs).find('li[data-content="'+arguments[2]+'"]')[0];
				var $li = $(li);
				if( li && li.depth2Tabs ){ // 해당 contentId 가 있는 경우
					if ( $.alopex.util.isValid(arguments[1]) ){
						$li.html(arguments[1]);
					}
					if ( tabs.buttons[0].element == tabs ){
						$(tabs).find(".Vertical-sub-tabs").show();
					}
					$.alopex.widget.tabs.setTabIndex(tabs, li.index, true);
					$.alopex.widget.tabs._addSubTab(tabs, li.depth2Tabs, arguments[3]);
					// 20161122 HiQ1 - 디폴트 기능 변경. 최초 subTab addTab 후 0번째 _setTabIndex 하는 것 주석처리
//					$.alopex.widget.tabs.setTabIndex(tabs, [li.index, 0], true);
					$.alopex.widget.tabs._resizeHandler(tabs);
					return;
				} else {
					$li = $('<li></li>');
					$li.attr('data-content', arguments[2]);
					$li.html(arguments[1]);
					$li[0].depth2data = arguments[3];
					tabs.isDepth2Tab = true;
				}
			}
			// case 1. addTab(titleString, contentId),  contentId : 'filename.html' or div id string
			else if (arguments.length == 3) {
				if(arguments[0].options.depth2position == "left"){
					console.error('Invalid arguments.\nIf you set [data-depth2-position="left"] attribute, the number of arguments would be wrong.');
				}
				// arguments[0] - tabs element
				// arguments[1] - title
				// arguments[2] - content
				$li = $('<li></li>');
				$li.attr('data-content', arguments[2]);
				$li.html(arguments[1]);
			}
			// case 2. addTab(htmlString)
			else {
				if(arguments[0].options.depth2position == "left"){
					console.error('Invalid arguments when you call .addTab() API.\nIf you set [data-depth2-position="left"] attribute, the number of arguments might be wrong.');
				}
				// arguments[0] - tabs element
				// arguments[1] - html
				$li = $(arguments[1]);
			}
			li = $li[0];
			
			$li.addClass("Ellipsis");
			this._setTabWidth(tabs); // .Scroll 사용 시에만 로직 수행됨
 
			this._makeTabButton(tabs, li, this._getLastIndex(tabs)+1, -1);
			tabs.buttons = tabs.buttonGroup.find('> li');
			
			this._setTabWidth(tabs);  // .Scroll 사용 시에만 로직 수행됨
			this._unbindEvent(tabs, tabs.buttons.length -1);
			this._bindEvent(tabs, tabs.buttons.length -1);
			
			// addTab 시 변경된 너비의 합산 또한 변경해서 ul에 inline style width가 정상 변경되도록 한다.
			this._setButtongroupWidth(tabs);
			
			$.alopex.widget.tabs.setTabIndex(tabs, $.alopex.widget.tabs._getLastIndex(tabs), true);
			$(tabs).find(".ButtonScroller").scrollLeft(10000); // 끝으로
			
			// draggable true 일 경우, 새 탭에 대하여 drag & drop 이벤트 핸들러 추가 해준다
			if(tabs.options.draggable){
				this.setDraggable(tabs, true);
			}
			
			$.alopex.widget.tabs._resizeHandler(tabs);
			
			// 뎁스1 만들고, 그 후 뎁스2 만든다.
			$(tabs).trigger("depth2tabready");
		},
		_refeshButtonGroup: function(el) {
			var $el = $(el);
			el.buttonGroup = $el.find('> ul, >div.Scroller>ul');

			if (el.buttonGroup.length === 0) {
				el.buttonGroup = $el.find('.af-tabs-button-group');
				el.buttons = el.buttonGroup.find('> li');
			} else {
				el.buttonGroup.addClass('af-tabs-button-group');
				el.buttons = el.buttonGroup.find('> li');
			}
			
			// remove 버튼 배열로 가져와서 저장한다
			el.removebuttons = $el.find('.'+this.classNames.removebutton);
		},
		_setTabWidth: function(el) {
			var $el = $(el);
			if(this._getProperty(el,'contentsdisplay') == 'flex'  || $el.attr('data-display-flex') == "true") {
				var buttons = el.buttonGroup.find('li.af-tabs-button');
				var buttonWidth = el.buttonGroup.innerWidth() / buttons.length;
				
				for ( var i = 0; i < buttons.length; i++) {
					$(buttons[i]).outerWidth(buttonWidth);
				}
			}
			// Fixed 
			else if($el.hasClass("Fixed")){
				if($el.children("div.Scroller").length === 0 && $el.children("ul.af-tabs-button-group").length > 0){ // Fixed 인데 Scroller 없으면 추가
					var div = document.createElement("DIV");
					div.className = "Scroller";
					$el.children("ul.af-tabs-button-group").wrap(div);
				}
				var result = $.alopex.widget.tabs._validationTabWidth(el.options.tabwidth);
				if(result != null){
					$el.find(".Scroller ul li").css("width", el.options.tabwidth);
				}
			}
		},
		_isDepth2Tab: function(el){
			// 조건 강화 필요
			return Boolean(el.options && el.options.depth2position);
		},
		_getIndexArrayFromButton: function(button){
			if(button.depth === 1){
				return [button.index];
			}else if(button.depth === 2){
				return [button.depth1Tabs._currentTabIndex, button.index];
			}
		},
		getSubTabByIndex : function(el, index){
			if($.alopex.widget.tabs.isEnabled(el, index)){
				return el.buttons[index].depth2Tabs;
			}
		},
		_makeSubTab : function(el, subEl, data){
			var $li = $('<li><p>'+ data.title +'</p></li>');
			var li = $li[0];
			li.depth = 2;
			$li.attr( "data-content", ("#"+ data.url) ); // ex) "sub3946"
			$li.addClass("Ellipsis");
			$li.attr( "data-url", data.url ); // ex) "abc.html"
			/* if(index === 0){				
				// sub tab의 li 이면서 첫 번째 li 임을 표시
				// sub tab 첫 번째 li 는 ajax sync (sync가 로딩 빠르다. 첫 컨텐츠는 가져오기/렌더 우선적으로 수행)
				// sub tab 그 밖의 li 들은 ajax async (async는 로딩 느리다. 그 밖의 컨텐츠는 hide 한 상태로 천천히 가져옴)
				$li.attr( "data-subtab-button1", true);
			}*/
			$li.on('click', function(e) { // default 이벤트 무시.
				e.preventDefault(); // stop navigating to 'ajax loding page'
			});
			var $ul = $(subEl.buttonGroup);
			$ul.append(li);
			subEl.buttonGroup.buttons = $ul.find('>li');
			subEl.buttons = subEl.buttonGroup.buttons;
			
			var subContent = document.createElement("DIV");
			var $subContent = $(subContent);
			$subContent.css('display', 'none');
			$subContent.addClass("af-tabs-content");
			subContent.url = data.url;
			$(subEl).append(subContent);
			
			li.content = subContent;
			li.element = subEl;
			li.depth1Tabs = el;
			li.index = subEl.buttonGroup.buttons.length - 1;
			li.loadType = 'ajax'; // 일단.. 통신으로 가져오는 것만 가능하도록
			
			$.alopex.widget.tabs.setTabIndex(subEl, li.index, false);
		},
		
		_addSubTab : function(el, subEl, depth2data){

			$.each(depth2data, function(index, data){
				$.alopex.widget.tabs._makeSubTab(el, subEl, data);
			});
			
			$.alopex.widget.tabs._unbindEvent(subEl);
			$.alopex.widget.tabs._bindEvent(subEl);
		}

	});
})(jQuery);