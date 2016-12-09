!function($) {
	
	// popup API를 사용해 팝업을 띄울 경우, window.name으로 아이디 전달.
	var _id = window.name;
	var _config = null;
	var _data = null;

	/**
	 * 팝업 id를 생성하여 리턴
	 */
	function _GenerateId(popid) {
		var length = $.alopex.popup.names.length;
		var suffix = $.alopex.util.isValid(popid) ? popid : parseInt(Math.random()*10E3);
		var id = 'Alopex_Popup_' + suffix;
		$.alopex.popup.names.push(id);
		return id;
	}

	/**
	 * dialog 띄우는 함수. setting에 따라 다르게 세팅.
	 */
	function _DialogOpen(setting, base) {
		var dialog = document.getElementById(setting.id);
		var $dialog = $(dialog);
		if ($dialog.length == 0) {
			var markup = '<div id="' + setting.id + '" data-type="dialog"';
			if (setting.modalclose) {
				markup += 'data-modalclose="true" ';
			}
			if (setting.toggle) {
				markup += 'data-toggle="true" ';
			}
			markup += '>';
			if (setting.iframe) {
				// 기존에는 $iframe[0].contentWindow.name = setting.id; 등으로 iframe 내 window.name에 dialog id 를 전달했으나
				// IE10 indexed db is only available on websites with http or https url schemes 이 발생하면서 iframe 내 window의 name이 빈값인 경우가 발생
				// 마크업에서 iframe name 속성에 id로 설정 >> iframe 내 global window의 name의 값이 된다.
				markup += '<iframe name="' + setting.id + '" data-type="panel" data-fill="vertical" style="width:100%;overflow:auto;border:0"></iframe>';
			} else if(setting.scroll){ //scroll을 위한 div
				markup += '<div></div>'
			}
			markup += '</div>';
			if(base) {
				$dialog = $(markup).appendTo(base).dialog(); // 다이얼로그 생성.
			} else {
				$dialog = $(markup).appendTo('body').dialog(); // 다이얼로그 생성.
			}
			
			dialog = document.getElementById(setting.id);
		}

		if (setting.center === true) {
			setting.top = ($(window).height() - setting.height) / 2;
			setting.left = ($(window).width() - setting.width) / 2;
		} else {
			//setting에 left, top가 없는 경우 값을 0으로 처리.
			if(false === $.alopex.util.isValid(setting.left)){
				setting.left = 0;
			}
			if(false === $.alopex.util.isValid(setting.top)){
				setting.top = 0;
			}
		}

		// 콜백 옵션이 있을 경우, 오픈 시 close 이벤트 핸들러로 등록.
		// 이부분이 dialog.js 내에서 처리되고 있었으나, 팝업의 dependent한 코드는 이쪽에서 처리.
		// 팝업으로 오픈한 dialog는 DOM에서 제거.
		$dialog.one('close', function(e) {
			var dialog = e.currentTarget;
			var $dialog = $(dialog);
			var index = $.inArray(dialog.id, $.alopex.popup.names);
			if (dialog && index !== -1) {
				$.alopex.popup.names.splice(index, 1);

				if(dialog.blocker) {
					$(dialog.blocker).remove();
				}
				$dialog.remove();
				
//			    [2016-10-18]ESH 다중 팝업시 스크롤 이슈 해결.
//			    팝업이 아닌 경우에만 body영역에 스크롤을 재생성 하도록 설정.
//				팝업을 닫는 시점에 body 영역은 팝업이 없으면, 스크롤을 생성 하도록 처리.
				
//				[2016-10-24]ESH IE10에서 remove() 했는데도 find('.Dialog').length 가 1개 남아 있는 현상 발생
//				id="div_dialog" 라는 Dialog 컴퍼넌트 존재
//				if($(document.body).find('.Dialog').length == 0){
				
//				[2016-11-08] Tango Chrome 에서 $(document.body).find('div').filter('.Dialog-mask') 하면 $(dialog.blocker).remove() 했음에도 엘리먼트 찾아짐. 단 display:none인 상태로. 아래에 :visible 추가
					var $allBlocks = $(document.body).find('div').filter('.Dialog-mask:visible');
					if($allBlocks.length === 0){
						 var body = document.body;
					     var scrollTop = Math.abs(parseInt(body.style.top));
					     $(body).css({
					        'top': '',
					        'position': this.bodyposition? this.bodyposition: '',
					            'width': this.bodywidth? this.bodywidth: ''
					     });
					    
					     // dialog 닫힐때 scrollTop 위치 세팅
					     if (window.browser === 'ie' || $.alopex.util.isValid(window.browser) && window.browser.indexOf('Microsoft Internet Explorer') !== -1){
					        $(document.documentElement).scrollTop(dialog.scrollTopValue);
					     } else {
					        $(body).scrollTop(scrollTop);
					     }
					}
					$allBlocks = null;

				if(setting.callback) {
					if(!$.alopex.popup.result && $dialog && $dialog.prop('callbackData')){
						setting.callback($dialog.prop('callbackData'));
						$dialog.prop('callbackData', null)
					}else{
						setting.callback($.alopex.popup.result);
						$.alopex.popup.result = null;
					}
				}
			}
		});

		$dialog.prop('alopexPopupSetting', setting);
		if (setting.iframe) {
			// var url = setting.url + '?'; // querystring으로 parameter전달.
			// if(setting.data) {
			// url += 'parameters=' + encodeURIComponent(JSON.stringify((setting.data)));
			// }

			if(!setting.preLoading) {
				$dialog.open(setting);
			}

			$dialog.find('iframe').on('load', function() {
				// setting.modal = false;
				if(setting.preLoading) {
					$dialog.open(setting);
				}
				
				var $iframe = $dialog.find('iframe');
				$iframe.refresh();
				
				// parent > child access 의 경우, cross-domain 으로 막힐 때 예외처리
				if(isAlopexIframeChild($iframe[0].contentWindow)) $iframe[0].contentWindow.alopexready = true;
//				$dialog.find('iframe')[0].contentWindow.alopexready = true;
			});
			
//			var $iframe = $dialog.find('iframe');
//			
//			isAlopexIframeChild에서 window, window.$, window.$.alopex 체크 하는데,
//			window는 있는데, window.$는 아직 없을 경우 false 를 리턴하기 때문에
//			$iframe[0].contentWindow.name = setting.id; 가 수행되지 않는 경우 발생.
//			이 경우를 대비하여 아래처럼 window가 일단 있을 때는 setting.id를  popupdataKey에 넣어주고, iframe page init 호출 시 사용한다.
//			try{
//				if($.alopex.util.isValid($iframe[0].contentWindow)){
//					$iframe[0].contentWindow.name = setting.id;
//				}
//			}catch(e){}
			
			// parent > child access 의 경우, cross-domain 으로 막힐 때 예외처리
//			if(isAlopexIframeChild($iframe[0].contentWindow)) $iframe[0].contentWindow.name = setting.id;
//			$dialog.find('iframe')[0].contentWindow.name = setting.id;
			
			setTimeout(function() { 
				/**************** 
				 * windowpopup 콜백에서 다이얼로그 팝업을 띄울 경우 setTimeout 없으면 load 이벤트가 발생하지 않음.
				 * resource 요청을 window 팝업 쪽에서 수행하는 것으로 판단. 
				 **/
				$dialog.find('iframe').attr('src', setting.url);
			}, 0);
		} else {
			// dialog without iframe has the same context. undo stringify.
			// JSON.parse(setting.data)에서 setting.data가 undefined일 경우 JSON.parse 에러남.
			if(setting.data){
				$a.dialogdata = JSON.parse(setting.data);
			}else{
				$a.dialogdata = null;
			}
			
			$.alopex.loading = true;
			
			(setting.scroll ? $dialog.find('div') : $dialog).load(setting.url, function() {//scroll을 사용한 경우에는 child div에 컨텐츠 로드
				$dialog.open(setting);
				$.alopex.convert(dialog);
				$(document).trigger('alopexuiready');
			});
		}
		return dialog;
	}

	function _WindowOpen(setting, base) {
		var param = '';
		if (setting.width) {
			param += 'width=' + setting.width + ',';
		}
		if (setting.height) {
			param += 'height=' + setting.height + ',';
		}
		if (setting.center === true) {
			var topPositon = Math.max((window.screen.height - parseInt(setting.height)) / 2 - 50, 0) - $('body')[0].scrollTop;
			param += 'top=' + topPositon + ',';
			param += 'left=' + (window.screen.width - parseInt(setting.width)) / 2 + ',';
		} else {
			param += 'top=0,';
			param += 'left=0,';
		}
		if (setting.scroll === true) {
			param += 'scrollbars=yes,';
		}
		if (setting.other) {
			param += setting.other;
		}
		if (setting.modal === true) {
			// parent 창에 blocking이 되도록 수정.
			if(checkAlopexWindowParent()) {
				$a.block(window.parent, setting.id);
			}
		}
		if (!$.alopex.util.isValid(base)) {
			base = window;
		}
		/**
		 * 윈도우 띄우는데 타이밍 이슈 해결.
		 * 이 코드 없으면 IE9에서 $a.popup(다이얼로그) 콜백에서 $a.popup(윈도우)를 띄울 때 새로 뜬 윈도우가 뒤로 이동됨.
		 */
		setTimeout(function() {
			var popup = base.open(setting.url, setting.id, param);
			$.alopex.popup.children.push(popup);
		}, 0);
	}
	
	/**
	 * window.open으로 팝업을 연 경우, 호출됩니다.
	 * 기능 1. 부모창의 beforeunloadHandler 호출
	 */
	function beforeunloadHandlerInChild(){
		if(isAlopexWindowPopup()){
			window.opener.$a.beforeunloadHandlerInParent(_id, $.alopex.popup.result);
		}
	}
	
	/********************************************
	 * 열린 popup context에서 필요한 코드.
	 ********************************************/
	// window popup PopupData setting
	try{
		if (isAlopexWindowPopup()) {
			// 팝업 종료 시 처리 : 팝업 창 닫힐 때 메인화면 modal unblock 함수 실행.
			$(window).on('beforeunload', beforeunloadHandlerInChild);
			if(window.opener.$.alopex && window.opener.$.alopex.popup.config && window.opener.$.alopex.popup.config[_id]) {
				_config = window.opener.$.alopex.popup.config[_id];
				if ($.alopex.util.isValid(_config) && $.alopex.util.isValid(_config.data) && _config.id === _id) {
						_data = JSON.parse(_config.data);
				}
			}
		} else if(checkAlopexWindowParent()) {
			// dialog popup PopupData setting
			$(window.parent.document).find('[data-type="dialog"]').each(function(i, elem) {
				_config = $(elem).prop('alopexPopupSetting');
				if ($.alopex.util.isValid(_config) && $.alopex.util.isValid(_config.data) && elem.id === _id) {
						_data = JSON.parse(_config.data);
				}
			});
		}
	}catch(e){}
	
	/********************************************/
	
	
	// 메인화면이 닫힐 경우, 자신이 띄운 팝업들 닫기.
	// TODO 메인화면이 닫혀도 window 하위창들이 닫히지 않음.
//	$(window).on('beforeunload', closeChildren(null));

	$.extend($.alopex, {
		popupdata : _data,
		/**
		 * 윈도우 팝업, 다이얼로그 팝업(with/without iframe) 
		 * 
		 * @args option {
		 * 	scroll: '',
		 *  modal: '',
		 *  heigth: '',
		 *  center: ''
		 *  url: '',
		 *  callback: ''
		 *  iframe: '',
		 * }
		 */
		popup : function(option, base) {
			// options
			// scroll, modal, width, height, center, scroll, modal, url, callback,
			// popup id 지정 : 이 아이디를 가지고 부모창에서 인자를 가져감.
			// default setting.
			
			// 사용자가 임의 입력한 name이 있고, name을 이용해 생성한 id를 가진 팝업이 있다면 팝업 생성을 막는다.
			// 팝업 생성하는 버튼을 빠르게 2번 이상 클릭하면 같은 팝업이 2개 이상 생성되는 이슈 방지용 
			if($.alopex.util.isValid(option.popid)){
				if($.inArray("Alopex_Popup_" + option.popid, $.alopex.popup.names) !== -1) return;
//				if($("div").filter("[id=Alopex_Popup_" + option.popid + "]").length > 0) return;
			}
					
			var setting = {
				id : _GenerateId(option.popid),
				title : (option.title || option.url)
			};
			$.extend(setting, $.alopex.popup.defaultOptions, option);
			if(setting.width === 0){
				setting.width = parseInt(window.innerWidth * 0.9);
			}
			if(setting.height === 0){
				setting.height = parseInt(window.innerHeight * 0.9);
			}

			var _urlFixer = ($.alopex.popup.defaultOptions.url) ? $.alopex.popup.defaultOptions.url : $.alopex._navigationCofig.url;
			setting.url = _urlFixer(setting.url, setting.data); // $a.navigate.setup으로 정의된 url정보를 같이 사용.

			// IE9 에서 array JSON 데이터 전송시 이상현상 발생하므로 data는 stringify 해서 넘긴다.
			if (setting.data) {
				setting.data = JSON.stringify(setting.data);
			}
			$.alopex.popup.config[setting.id] = setting;
			if (setting.windowpopup) { // window open으로 띄우기
				_WindowOpen(setting, base);
			} else {
				return _DialogOpen(setting, base);
			}
		},

		/**
		 * 현재 팝업창을 종료하는 함수. (popup 윈도우 내 스크립트 에서 실행)
		 * window popup과 iframe이 감싸줘 있는 경우, open 함수 실행 시점과 close 함수 호출 시점의 context가 달라진다.
		 * 
		 * @param data
		 *            popup창을 띄운 윈도우의 콜백함수의 인자로 전달됩니다.
		 */
		close: function(data) { 	
			var config;
			// opener가 있을때 window 팝업창 닫기
			if (isAlopexWindowPopup() && window.opener.$.alopex.popup.children.length != 0) {

				// window popup & iframe내에서
				config = window.opener.$.alopex.popup.config[_id]; // callback 함수 찾기 위해.
//				if (config && $.isFunction(config.callback)) {
//					config.callback(data); // TODO 이 부분도 x 버튼으로 닫힐 때 호출되도록 처리. 
//				}
				$.alopex.popup.result = data; //TODO
				//closeChildren(window.opener.$.alopex.popup.children);
				window.name = '';
				window.close();
			} else {
				if(checkAlopexWindowParent()){
					// 다이얼로그를 찾아서 닫기
					if(window !== window.parent) {
						$ = window.parent.$; // close 할때도 부모에 붙어잇는 jquery를 참조하여야지 dialog 로직이 정상적으로 동작.
						window.parent.$.alopex.popup.result = data;
					} else {
						$.alopex.popup.result = data;
					}
					
					var $activeDialogEl = null;
					
					$.each($(window.parent.document).find('[id*="Alopex_Popup_"]'), function(i, ele) {
						ele = $(ele);
						if($activeDialogEl == null) {
							$activeDialogEl = ele;
						} else{
							if(ele.css('z-index') > $activeDialogEl.css('z-index')) {
								$activeDialogEl = ele;
							}
						}
					});
					
					// 20160818 ESH 부모>자식팝업>손자팝업에서 손자팝업 데이터를 클로즈 콜벡 > 자식팝업으로, 자식 클로즈 시 부모로 전달하면
					// $activeDialogEl.close(); setTimeout 시점 차 때문에 손자 데이터가 null로 부모에 정확히 전달 안됨
					// >>> prop에 한번 더 넣어주고 setting.callback 호출 시 2군데 확인 후 데이터 전달
					$activeDialogEl.prop('callbackData', data);
					
					config = $activeDialogEl.prop('alopexPopupSetting');
					if ($.alopex.util.isValid(config)) {
						
						if(config.beforeCloseHandler && typeof config.beforeCloseHandler === 'function'){
							config.beforeCloseHandler($activeDialogEl[0]);
						}
						
						// dialoglist에서 close 하는 다이얼로그 제거
						if ($.alopex.util.isValid(window.parent.$.alopex.widget.dialog.dialoglist)) {
							var arr = window.parent.$.alopex.widget.dialog.dialoglist;
							for (var i = 0; i < window.parent.$.alopex.widget.dialog.dialoglist.length; i++) {
								if (arr[i] == $activeDialogEl[0]) {
									arr.splice(i, 1);
								}
							}
						}

						// jquery-1.11.2.js, jquery-1.11.3.js의 dispatch 부분 if ( ret !== undefined ) {
						// 'undefined'이(가) 정의되지 않았습니다  IE 에러 메시지 발생
						// close 이벤트에 딜레이 주고, element remove 타이밍을 늦춘다
						setTimeout(function(){
							$activeDialogEl.close();
						}, 0);
						
						
					    //[2016-10-18]ESH 다중 팝업시 스크롤 이슈 해결.
					    //팝업이 아닌 경우에만 body영역에 스크롤을 재생성 하도록 설정.
						//팝업을 닫는 시점에 body 영역은 팝업이 없으면, 스크롤을 생성 하도록 처리. 
						//($dialog.one('close', function(e)에서 처리)하도록 주석 처리.
						//
						// dialog 닫힐때 scrollTop 위치 세팅
						/*
						var scrollTop = $activeDialogEl[0].scrollTopValue;
						$(window.parent.document.body).css({
							'top' : '',
							'position' : '',
							'width' : ''
						});
						if (window.browser === 'ie' || 
							$.alopex.util.isValid(window.browser) && window.browser.indexOf('Microsoft Internet Explorer') !== -1){
							$(window.parent.document.documentElement).scrollTop(scrollTop);
						} else {
							$(window.parent.document.body).scrollTop(scrollTop);
						}
						*/

						// HESS project Bug Fix. (IE9, IE10에서 iframe 팝업창에서 인풋 텍스트 포커스 간 이후 부모창에 커서 안가는 문제때문에 주석 처리.)
						// $activeDialogEl.remove();
					}
				}
			}
		},
		
	 /**
	 * window.open으로 오픈한 팝업에서 beforeunloadHandlerInParent를 호출합니다.
	 * beforeunload 이벤트 시 close 행위, reload 행위 중 어떤 행위를 수행하는지 판별
     * close 행위일 경우, 모달블럭제거, close콜백 수행, 메모리정리
	 */
		beforeunloadHandlerInParent : function(popupId, parameter){
			
			var _popupId = popupId;
			var _parameter = JSON.stringify(parameter);
			
			// close, reload 둘다 beforeunload 를 통해 후처리 여부 판단하는데, beforeunload 만으로 구분이 안되서
			// setTimeout 후 윈도우 살아있으면 reload, 아니면 close라고 판단
			setTimeout(function(){
				var windows = $.alopex.popup.children;
				var isClosed = true;
				for(var i = 0 ; i < windows.length ; i++){
					try{
						if(windows[i].name === _popupId){
							// 자식창을 새로고침 한 경우
							isClosed = false;
						}
						
//						else{ 
//							 // 자식창을 close 한 경우 ($a.close 로 닫을 경우 window.name = '' 해주기 때문에 if 조건으로 가지 않는다.)
//						}
					}catch(e){
						// catch 로 오는 경우 == 자식창을 close 한 경우
						// IE 10  windows[i].name 에서 [error] Access is Denied 발생
						// Access is Denied 또한 이미 닫힌 윈도우라는 의미
					}
				}
				if(isClosed){
					// Case 1. beforeunload because of window close
					
					var _config = $.alopex.popup.config[_popupId]; // 설정 다시 받아옴.
					if (_config) {
						// unblock
						if (_config.modal) {
							$a.unblock(_popupId);
						}
						
						// callback
						if(_config.callback) {
							try{ // IE의 경우 window.opener를 통해 접근할 경우, 제대로 된 타입이 전달 안됨.. 우선 실행.
								_config.callback.call(window, JSON.parse(_parameter));
							} catch(e){}
						}
					}
					
					// 메모리 정리
					var index = $.inArray(_popupId, $.alopex.popup.names);
					if (index !== -1) {
						$.alopex.popup.names.splice(index, 1);
					}
				}else{
					// Case 2. beforeunload because of window reload
				}
				
			}, 300);
		}
	});


	$.extend($.alopex.popup, {
		setup : function(option) {
			$.extend($.alopex.popup.defaultOptions, option);
		},
		
		/* 팝업 아이디 저장 */
		names : [],
		/* 윈도우 팝업으로 띄울 경우, 자신이 띄운 popup을 저장. 자신이 닫힐 경우, 자신 오픈한 팝업은 같이 종료. */
		children : [],
		/* 팝업 정보 저장소. */
		config: {},
		
		result: null,
		
		/* 팝업 관련된 */
		defaultOptions : {
			/* 팝업 너비 */
			width : parseInt(window.innerWidth * 0.9),
			/* 팝업 높이 */
			height : parseInt(window.innerHeight * 0.9),
			/* 팝업 타입 */
			type : 'blank',
			/* 팝업 가운데 위치 */
			center : true,
			/* 팝업 스크롤 유무 */
			scroll : true,
			/* 팝업 모달뷰 유무 */
			modal : true,
			/* 팝업 창이 접히는 토글 버튼 존재 유무 */
			modalclose : false,
			/* iframe 유무 */
			iframe : true,
			/* 윈도우 팝업으로 띄울 지 여부 */
			windowpopup : false,
			/* 팝업 창이 접히는 토글 버튼 존재 유무 */
			toggle : false,
			/* iframe사용 시 화면 로딩 후 팝업 오픈 or 팝업 오픈 후 화면 로딩*/
			preLoading :  true,
			/* dialog close 전에 수행될 로직*/
			beforeCloseHandler : null
		}
	});
}(jQuery);