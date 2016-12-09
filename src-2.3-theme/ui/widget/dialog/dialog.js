(function($) {

	$.alopex.widget.dialog = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'dialog',
		defaultClassName: 'af-dialog Dialog',
		maxZindex: 1001,
		dialoglist: [], // opened dialog

		properties: {
			dialogtype: null,
			animation: 'show',
			animationtime: 500,
			resizable: false,
			dialogmovable: false,
			modal: false,
			top:null,
			left:null,
			modalScroll: false,
			modalscrollhidden: true,
			modalclose: false,
			scroll: false,
			toggle: false
		},

		element: [],
		getters: [],
		setters: ['dialog', 'open', 'close', 'ok', 'cancel', 'confirm', 'closed', 'reposition'],

		defer: function(el, options) {
			$(el).css('display', 'none');
		},

		init: function(el, options) {
		  var $el = $(el);
		  for ( var i in options) {
		    if (options[i] === 'true' || options[i] === 'false') {
		      options[i] = $.alopex.util.parseBoolean(options[i]);
		    }
		    if ($.alopex.util.isNumberType(options[i])) {
		      options[i] = parseInt(options[i], 10);
		    }
		  }
		  $.extend(el, this.properties, options);
		  // data-* attribute와 open 함수 호출시 parameter의 키가 다름으로 인한 처리.
		  if (el.dialogmovable) {
		    el.movable = el.dialogmovable;
		  }
		  if (el.dialogmodal) {
		    el.modal = el.dialogmodal;
		  }
		  if (el.height) {
		    $el.css('height', el.height);
		  }
		  if (el.width) {
		    $el.css('width', el.width);
		  }
		  // dialog position style은 fixed로 수정.  by YSM 20130702
		  $el.attr('style', ($el.attr('style') ? $el.attr('style') : '') + ';position:fixed;z-index:1001;opacity:0;overflow:hidden;'); 


		  //contents
		  if ($.alopex.util.isValid($el.children()[0])) {
		    el.contents = $el.children();
		  }

		  this._setDialogType(el, el.dialogtype);
		  this._setResizable(el, el.resizable);
		  this._setMovable(el, el.movable);
		  this._setModal(el, el.modal);

		  if(window.browser != 'mobile') {
		    $el.on('pressed focusin', $.alopex.widget.dialog._clickMoveToTop); // 선택된 다이얼로그가 상위로 올라오게 처리.
		    $el.on('keydown', $.alopex.widget.dialog._addKeydownEvent);
		    $el.on('click', function(e){
		    	// dialog 포커스를 잃어버렸을 때, ESC 키를 통해 close() 가 호출되지 않는다.
		    	// 클릭 시 tabindex 활성화 해준다. 이 후, ESC 키를 통해 close() 가 호출된다.
		    	$(e.currentTarget).attr("tabindex", "1");
		    });
		  }

		  //origin size setting
		  el.originWidth = $el.width();
		  el.originHeight = $el.height();


		  // mobile 기기에서 키패드에 의해 다이얼로그가 가려지는 현상으로 인하여 강제 올리기.
		  if(window.browser == 'mobile') { 
		    var __dialog = el;
		    __dialog.lifted = false;
		    var iframeTop = 0;

		    function _dialog_reposition() {
		      var element = document.activeElement;
		      if(element.tagName.toLowerCase() == 'iframe') {
		        iframeTop = $(element).offset().top;
		        element = element.contentWindow.document.activeElement;
		      } else if(element.tagName.toLowerCase() == 'body') {
		        element = $(element).find(':focus');
		        if(element.length>0) {
		          element = element[0];
		        } else {
		          return false;
		        }
		      }
		      var elementTop = $.alopex.util.getPagePosition(element).top + iframeTop;
		      var elementBottom = elementTop + element.offsetHeight;
		      var currentWindowHeight = $(window).height();

		      if(elementBottom >= currentWindowHeight && // 현재 선택된 엘리먼트가 가려질때.
		          __dialog.windowheight > currentWindowHeight) { // 윈도우가 줄어 들었을
		        __dialog.liftedHeight = Math.abs(elementBottom - currentWindowHeight)+50;
		        __dialog.lifted = true;
		        $el.css('top', (parseInt(el.style.top) - __dialog.liftedHeight) + 'px');
		      } else if(__dialog.windowheight < currentWindowHeight && __dialog.lifted) {
		        $el.css('top', (parseInt(el.style.top) + __dialog.liftedHeight) + 'px');
		        __dialog.lifted = false;
		      }
		      __dialog.windowheight = currentWindowHeight;
		    }
		    $(window).on('resize', _dialog_reposition);
//		    $(el).on('focusin', function(e) {
//		    _dialog_reposition();
////	    alert('focusin');
//		    });
		  }
		},

		_addKeydownEvent: function(e) {
		  var el = e.currentTarget;
		  var $el = $(el);
		  var code = e.keyCode !== null ? e.keyCode : e.which;

		  switch (code) {
		  case 27:
		    $el.close();
		    break;
		  case 9:
		    if (el.modal) { // 모달인 경우, 다이얼로그 내의 엘리먼트 만 포커스 가도록 설정.
		      var selectorcondition = 'a[href], area[href], input:not([disabled]), select:not([disabled]), '
		        + 'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
		      if (e.shiftKey) {
		        if (document.activeElement === $(this)[0] || document.activeElement === $(this).find(selectorcondition).first()[0]) {
		          $($el.find(selectorcondition).last()).focus();
		          e.preventDefault();
		        }
		        break;
		      }
		      if (document.activeElement === $(this).find(selectorcondition).last()[0]) {
		        $($el.find(selectorcondition).first()).focus();
		        e.preventDefault();
		      }
		    }
		    break;
		  default:
		    break;
		  }
		},

		_setDialogType: function(el, type) {
		  $(el.header).remove();
		  $(el.button).remove();
		  $(el.closebtn).remove();
		  $(el.confrimbtn).remove();
		  $(el.okbtn).remove();
		  $(el.cancelbtn).remove();

		  if (type === 'blank' || type === 'close' || type === 'confirm' || type === 'okcancel') {
		    // header
		    el.header = document.createElement('div');
		    $(el.header).attr('class', 'dialog_header Header');
		    
		    var isTheme = $.alopex.util.isAlopexTheme();
		    
		    /**
		     * [Hong-HyunMin 2016.01.05] 기존에 동작하지 않았으나 2016.01.05 요청사항에 의해 동작하도록 변경.
		     * DialogToggle class는 현재 theme에만 적용되어 있음. Theme 에서만 동작 함.
		     */
		    if(el.toggle && isTheme) {
		      var togglebtn = document.createElement('button');
		      togglebtn.dialog = el;
		      $(togglebtn).attr('class', 'DialogToggle');
		      
		      /**
		       * [Hong-HyunMin 2016.01.05] toggle btn 이 클릭 되었을시..
		       */
		      $(togglebtn).click(function(e) {
		    	
		    	//펼칠때의 기준이 되는 높이
		    	var standardHeight = $.alopex.widget.dialog._dialogStandardHeight(el);
		    	
		    	//접을때의 기준이 되는 높이.
		    	var headerHeight = $.alopex.widget.dialog._dialogHeaderHeight(el);
		    	
		    	//접혀있을때.
		    	if(e.currentTarget.dialog.folded) {
		    	  //펼치기 이벤트가 완료된 이후에, scroll을 사용하는 옵션인 경우, 스크롤의 위치를 다시 재조정 해줌.
		          $(e.currentTarget.dialog).animate({height: standardHeight +'px'}, 300, function() {
		        	  if (el.scroll || (el.contents && el.contents.attr("data-dialog-scroll")) === "true") {
		        		  $.alopex.widget.dialog._calculateHeight(el);
		        	  }
		          });
		          
		          //folded 의 상태를 false 로 변경(펼쳐짐)
		          e.currentTarget.dialog.folded = false;
		          
		          //버튼의 클래스를 접혀진 클래스를 삭제.
		          $(togglebtn).removeClass('Expanded');
		        } 
		    	//펼쳐있을때
		    	else {
		          e.currentTarget.dialog.defaultHeight = $(e.currentTarget.dialog).height();
		          e.currentTarget.dialog.folded = true;
		          
		          $(e.currentTarget.dialog).animate({height: headerHeight+'px'}, 300);
		          
		          $(togglebtn).addClass('Expanded');
		        }
		       /**
			     * [Hong-HyunMin 2016.02.23] toggle btn 이 클릭 되었을시 이벤트 추가
			     */
		    	$(el).trigger('dialogToggleEnd');
		    	
		      });
		      this.addHoverHighlight(togglebtn);
		      this.addPressHighlight(togglebtn);
		      el.header.appendChild(togglebtn);
		    }

		    var closebtn = document.createElement('button');
		    //closebtn.type = 'button';
		    closebtn.dialog = el;
		    $(closebtn).attr('class', 'dialog_btn DialogBtn');		    
		    $(closebtn).attr('type', 'button');
		    var closeFlag = true;
		    $(closebtn).click(function(e) {
		    	
		    	if($.alopex.util.isValid(el.xButtonClickCallback) && typeof el.xButtonClickCallback === 'function'){
		    		closeFlag = el.xButtonClickCallback(el);
		    	}
		    	
		    	if(closeFlag){
		    		$(e.currentTarget.dialog).close();
		    	}
		      
		    });
		    this.addHoverHighlight(closebtn);
		    this.addPressHighlight(closebtn);
		    el.header.appendChild(closebtn);

		    $(el).prepend(el.header);

		    //contents
		    if ($.alopex.util.isValid(el.contents)) {
		      $.each(el.contents, function(i, elem) {
		        el.appendChild(elem);
		      });
		    }
		    
		    /**
		     * [Hong-HyunMin 2016.01.15] 기존 css와 Theme의 css 차이가 있어 변경.(close, confirm, okcancel)
		     */
		    if (type === 'close') {

		      el.button = document.createElement('div');
		      el.closebtn = document.createElement('button');
		      el.closebtn.dialog = el;
		      $(el.closebtn).text('Close');
		      
		      if(isTheme == false){
		    	  //button
			      $(el.button).attr('class', 'dialog_btn DialogBtn');
			      this.addHoverHighlight(el.button);
			      this.addPressHighlight(el.button);
			      if (!el.resizable) {
			        $(el.button).attr('style', 'padding-bottom:0px ;');
			      }
			      $(el.closebtn).attr('data-type', 'button');
			      $(el.closebtn).attr('style', 'float:right;');
		      }
		      else{
		    	  $(el.button).attr('class', 'Dialog-btnwrap');
		    	  this.addHoverHighlight(el.button);
				  this.addPressHighlight(el.button);
		    	  $(el.closebtn).attr('data-type', 'button');
			      $(el.closebtn).attr('class', 'Button Default');
		      }
		      
		      $(el.closebtn).button();
		      $(el.closebtn).on('click', function(e) {
			    	  var el = e.currentTarget.dialog;
			    	  $(el).close();
		      });

		      el.button.appendChild(el.closebtn);
		      el.appendChild(el.button);
		      
		    } else if (type === 'confirm') {
		    	
		    	el.button = document.createElement('div');
		    	el.confirmbtn = document.createElement('button');
		    	$(el.confirmbtn).text('Confirm');
			  
		    	if (isTheme == false){
		    		$(el.button).attr('class', 'dialog_btn DialogBtn');
		    		this.addHoverHighlight(el.button);
		    		this.addPressHighlight(el.button);
		    		if (!el.resizable) {
		    			$(el.button).attr('style', 'padding-bottom:0px ;');
		    		}
		    		$(el.confirmbtn).attr('data-type', 'button');
		    		$(el.confirmbtn).attr('style', 'float:right;');
		    	}
		    	else{
		    		$(el.button).attr('class', 'Dialog-btnwrap');
		    		this.addHoverHighlight(el.button);
		    		this.addPressHighlight(el.button);
		    		$(el.confirmbtn).attr('data-type', 'button');
		    		$(el.confirmbtn).attr('class', 'Button Default');
		    	}
		    	
		    	$(el.confirmbtn).button();
		    	el.button.appendChild(el.confirmbtn);
		    	el.appendChild(el.button);
		      
		    } else if (type === 'okcancel') {
		    	
		    	el.button = document.createElement('div');
		    	el.okbtn = document.createElement('button');
		    	$(el.okbtn).text('Ok');
		    	el.cancelbtn = document.createElement('button');
		    	$(el.cancelbtn).text('Cancel');
		    	if (isTheme == false){
		    		$(el.button).attr('class', 'dialog_btn DialogBtn');
		    		this.addHoverHighlight(el.button);
				    this.addPressHighlight(el.button);
				    if (!el.resizable) {
				    	$(el.button).attr('style', 'padding-bottom:0px ;');
				    }
				    $(el.okbtn).attr('data-type', 'button');
				    $(el.okbtn).attr('style', 'position: absolute;right: 80px;');
				    
				    $(el.cancelbtn).attr('data-type', 'button');
				    $(el.cancelbtn).attr('style', 'float:right;');
		    	}
		    	else{
		    		$(el.button).attr('class', 'Dialog-btnwrap');
		    		this.addHoverHighlight(el.button);
				    this.addPressHighlight(el.button);
				    $(el.okbtn).attr('data-type', 'button');
				    $(el.okbtn).attr('class', 'Button Default');
				    $(el.cancelbtn).attr('data-type', 'button');
				    $(el.cancelbtn).attr('class', 'Button Default');
		    	}
		      $(el.okbtn).button();
		      $(el.cancelbtn).button();

		      el.button.appendChild(el.okbtn);
		      el.button.appendChild(el.cancelbtn);
		      el.appendChild(el.button);
		    }
		  }
		},

		_setModal: function(el, modal) {
		  // modal 일때만 blocker 생성
		  if (!$.alopex.util.isValid(el.blocker) && modal) {
		    el.blocker = document.createElement('div');
		    el.blocker.dialog = el;
		    // [IE7] 바디영역에 block를 붙히는 경우, HTML markup의 상황에 따라 다이얼로그 z-index가 큼에도 불구하고 다이얼로그가 뒤로 이동됨.
		    // 이에 따라, block를 다이얼로그와 동일 depth에 위치.
		    //          document.body.appendChild(el.blocker);
		    //          el.parentNode.appendChild(el.blocker);
		    el.parentNode.appendChild(el.blocker);
		    $(el.blocker).addClass('af-dialog-mask ' +$.alopex.config.defaultComponentClass.dialog + '-mask');
		    $(el.blocker).css({
		      'opacity': '0.5',
		      'overflow': 'hidden',
		      'display': 'none',
		      'z-index': '999',
		      'position': 'fixed',
		      'left': '0',
		      'top': '0',
		      '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)',
		      'width': '100%',
		      'height': '100%'
		    });
		    //TODO: blocker에서 이벤트 막아주기 위해 아래와 같이 처리하였으나, 다이얼로그에서 스크롤 이벤트 발생시 영향 있음.
		    // HTML markup 상 현재 구조에서는 어쩔수 없음. 마크업 변경 또는 다른대안 필요.
		    if (el.modalScroll == undefined || el.modalScroll !== 'true') {
		      $(el.blocker).on('touchstart touchmove', function(e) {
		        e.preventDefault();
		        e.stopPropagation();
		        return false;
		      });
		    }

		    if(el.modalclose) {
		      $(el.blocker).on('pressed', function(e) {
		        var el = e.currentTarget.dialog;
		        $(el).close();
		      });					
		    }
		  }
		},

		_setMovable: function(el, movable) {
		  var $el = $(el);
		  var dialog = $.alopex.widget.dialog;
		  if (movable && window.browser !== 'mobile') {
		    var childrenLength = $el.children().length;
		    if (childrenLength > 0) {
		      if ($.alopex.util.isValid(el.header)) {
		        $(el.header).on('pressed', this._preMoveDialog);
		        $(el.header).css('cursor', 'move');
		      } else {
		        $($el.find('[data-dialog-movecursor=true]')[0]).on('pressed', this._preMoveDialog);
		        $($el.find('[data-dialog-movecursor=true]')[0]).css('cursor', 'move');
		      }
		    }
		  } else {
		    if ($.alopex.util.isValid(el.header)) {
		      $(el.header).off('pressed', this._preMoveDialog);
		      $(el.header).css('cursor', '');
		    } else {
		      $($el.find('[data-dialog-movecursor=true]')[0]).off('pressed', this._preMoveDialog);
		      $($el.find('[data-dialog-movecursor=true]')[0]).css('cursor', '');
		    }
		  }
		},

		_setResizable: function(el, resizable) {
		  var dialog = $.alopex.widget.dialog;
		  if (resizable && window.browser !== 'mobile') {
		    //footer
		    el.footer = document.createElement('div');

		    el.resizeHandleLeft = document.createElement('div');
		    $(el.resizeHandleLeft).attr('style', 'position:absolute;top:0px;left:0px;width:2px;' + 'height:100%;cursor:w-resize;');

		    el.resizeHandleRight = document.createElement('div');
		    $(el.resizeHandleRight).attr('style', 'position:absolute;top:0px;right:0px;width:2px;' + 'height:100%;cursor:col-resize;');

		    el.resizeHandleBottom = document.createElement('div');
		    $(el.resizeHandleBottom).attr('style', 'position:absolute;left:0px;bottom:0px;' + 'width:100%;height:2px;cursor:s-resize;');

		    el.resizeHandleBoth = document.createElement('div');
		    $(el.resizeHandleBoth).attr('class', 'resizeBtn ResizeBtn');

		    el.footer.appendChild(el.resizeHandleLeft);
		    el.footer.appendChild(el.resizeHandleRight);
		    el.footer.appendChild(el.resizeHandleBottom);
		    el.footer.appendChild(el.resizeHandleBoth);
		    el.appendChild(el.footer);

		    el.resizeHandleLeft.dialog = el.resizeHandleRight.dialog = el.resizeHandleBottom.dialog = el.resizeHandleBoth.dialog = el;

		    $(el.resizeHandleLeft).on('pressed', this._preResizeDialog);
		    $(el.resizeHandleRight).on('pressed', this._preResizeDialog);
		    $(el.resizeHandleBottom).on('pressed', this._preResizeDialog);
		    $(el.resizeHandleBoth).on('pressed', this._preResizeDialog);
		  } else {
		    $(el.footer).remove();
		  }
		},

		_preMoveDialog: function(e, ae) {
		  document.onselectstart = function() {
		    return false;
		  };

		  var dialog = $.alopex.widget.dialog;
		  var offset = $(this).offset();
		  var data = {};
		  data.x = ae.pageX - offset.left;
		  data.y = ae.pageY - offset.top;
		  data.element = e.currentTarget;
		  $(document).on('move.alopexDialogMove', data, $.alopex.widget.dialog._moveDialog).on('unpressed.alopexDialogMove', data, $.alopex.widget.dialog._postMoveDialog);
		},

		_moveDialog: function(e, ae) {
		  var x = ae.pageX - $(window).scrollLeft();
		  var y = ae.pageY - $(window).scrollTop();
		  if (!e.data.element) {
		    return;
		  }

		  var el = e.data.element;
		  var parent = el.parentElement;

		  $(parent).css('left', x - e.data.x + 'px');
		  if ((parent.offsetLeft) <= 0) {
		    $(parent).css('left', '0px');
		  }
		  if (parent.offsetLeft >= ($(window).width() - $(parent).width())) {
		    $(parent).css('left', ($(window).width() - $(parent).width()) + 'px');
		  }
		  $(parent).css('top', y - e.data.y + 'px');
		  if (parent.offsetTop <= 0) {
		    $(parent).css('top', '0px');
		  }
		  if ($(window).height() <= (parent.offsetTop + $(parent).height())) {
		    $(parent).css('top', ($(window).height() - $(parent).height()) + 'px');
		  }
		},
		
		_postMoveDialog: function(e, ae) {
		  $(document).off('.alopexDialogMove');
		  document.onselectstart = function() {
		    return true;
		  };
		},

		_preResizeDialog: function(e) {
		  var target = e.currentTarget;
		  var el = target.dialog;
		  
		  //[2016-10-13] popup에서 resize기능을 사용하는 경우. 
		  //리사이즈가 시작되기 전에 pointer-events를 통해 iframe으로 부터 발생하는 event 접근을 막는다.
		  if(el.iframe == true && el.resizable == true){
			  $(el).find('iframe').css('pointer-events', 'none');
		  }
		  
		  var dialog = $.alopex.widget.dialog;
		  $(el.resizeHandleLeft).on('swipemove', $.alopex.widget.dialog._resizeLeftDialog).on('unpressed', $.alopex.widget.dialog._postResizeDialog);
		  $(el.resizeHandleRight).on('swipemove', $.alopex.widget.dialog._resizeRightDialog).on('unpressed', $.alopex.widget.dialog._postResizeDialog);
		  $(el.resizeHandleBottom).on('swipemove', $.alopex.widget.dialog._resizeBottomDialog).on('unpressed', $.alopex.widget.dialog._postResizeDialog);
		  $(el.resizeHandleBoth).on('swipemove', $.alopex.widget.dialog._resizeBothDialog).on('unpressed', $.alopex.widget.dialog._postResizeDialog);
		  
		  document.onselectstart = function() {
		    return false;
		  };
		},

		_postResizeDialog: function(e) {
		  var target = e.currentTarget;
		  var el = target.dialog;

		  $(el.resizeHandleLeft).off('swipemove');
		  $(el.resizeHandleRight).off('swipemove');
		  $(el.resizeHandleBottom).off('swipemove');
		  $(el.resizeHandleBoth).off('swipemove');
		  
		  //[2016-10-13] popup에서 resize기능을 사용하는 경우.
		  // 리사이즈가 끝나는 시점에 pointer-events를 삭제해서 iframe으로 부터 발생하는 event를 사용 할 수 있도록 한다(ex> 스크롤)
		  if(el.iframe == true && el.resizable == true){
			  $(el).find('iframe').css('pointer-events', '');
		  }
		  
		  /**
		   * [Hong-HyunMin 2016.02.23] Dialog의 resize가 종료된 시점에 이벤트 실행.
		   */
		  $(el).trigger('dialogResizeEnd');
		  
		  document.onselectstart = function() {
		    return true;
		  };
		},

		_resizeLeftDialog: function(e, ae) {
		  var x = ae.pageX - $(window).scrollLeft();
		  var el = e.currentTarget;
		  var parent = el.parentElement.parentElement;

		  var offsetRight = $(window).width() - (parent.offsetLeft + $(parent).width());
		  var gap = parent.offsetLeft - x;
		  var resizedX = $(parent).width() + gap;
		  
		  /**
		   * [Hong-HyunMin 2016.01.05] Dialog의 Width가 option에 설정한 Width까지 resize 되는 것이 아니라, originWidth resize되기 때문에
		   * oprion 에 widht를 지정한 경우, 해당 값으로 처리하고 그렇지 않은 경우에만 originWidth를 사용하도록 변경함.
		   * parent.originWidth - > standardWidth
		   */
		  var standardWidth = $.alopex.widget.dialog._dialogStandardWidth(parent); 
		  
		  if (resizedX <= standardWidth) {
		    resizedX = standardWidth;
		    $(parent).css('width', resizedX + 'px');
		    $(parent).children().each(function() {
		      if (this.nodeName !== 'BUTTON') {
		        $(this).css('width', resizedX + 'px');
		      }
		    });
		    if ((offsetRight - ae.startX) <= standardWidth) {
		      $(parent).css('left', ae.startX + 'px');
		    }
		  } else {
		    if ((parent.offsetLeft) <= 0) {
		      $(parent).css('left', '3px');
		    } else {
		      $(parent).css('left', x + 'px');
		      $(parent).css('width', resizedX + 'px');
		      $(parent).children().each(function() {
		        if (this.nodeName !== 'BUTTON') {
		          $(this).css('width', resizedX + 'px');
		        }
		      });
		    }
		  }
		},

		_resizeRightDialog: function(e, ae) {
		  document.onselectstart = function() {
		    return false;
		  };

		  var x = ae.pageX - $(window).scrollLeft();
		  var el = e.currentTarget;
		  var parent = el.parentElement.parentElement;

		  var resizedX = x - parent.offsetLeft;
		  
		  /**
		   * [Hong-HyunMin 2016.01.05] Dialog의 Width가 option에 설정한 Width까지 resize 되는 것이 아니라, originWidth resize되기 때문에
		   * option 에 widht를 지정한 경우, 해당 값으로 처리하고 그렇지 않은 경우에만 originWidth를 사용하도록 변경함.
		   * parent.originWidth - > standardWidth
		   */
		  var standardWidth = $.alopex.widget.dialog._dialogStandardWidth(parent); 
		  
		  if (resizedX < standardWidth) {
		    resizedX = standardWidth;
		  }

		  $(parent).css('width', resizedX + 'px');
		  $(parent).children().each(function() {
		    if (this.nodeName !== 'BUTTON') {
		      $(this).css('width', resizedX + 'px');
		    }
		  });
		  if ($(parent).width() >= ($(window).width() - parent.offsetLeft)) {
		    $(parent).css('width', ($(window).width() - parent.offsetLeft - 3) + 'px');
		    $(parent).children().each(function() {
		      if (this.nodeName !== 'BUTTON') {
		        $(this).css('width', ($(window).width() - parent.offsetLeft) + 'px');
		      }
		    });
		  }
		},

		_resizeBottomDialog: function(e, ae) {
		  document.onselectstart = function() {
		    return false;
		  };

		  var y = ae.pageY - $(window).scrollTop();

		  var el = e.currentTarget;
		  var parent = el.parentElement.parentElement;

		  var resizedY = y - parent.offsetTop;

		  /**
		   * [Hong-HyunMin 2016.01.05] Dialog의 스크롤과 resize를 병행하는 경우에, contents class영역의 높이가 조절되지 않는 경우에 대한 개선
		   */
		  var minusHeight = $.alopex.widget.dialog._dialogMinusHeight(parent); 
		  var scrollValid = $.alopex.widget.dialog._dialogScrollValid(parent); 
		  var resizableValid = $.alopex.widget.dialog._dialogResizableValid(parent); 
		  
		  /**
		   * [Hong-HyunMin 2016.01.15] Theme인 경우에, 버튼의 높이를 포함해서 contents 영역의 높이를 조정 하기 위한 처리.
		   */
		  var isTheme = $.alopex.util.isAlopexTheme();
		  var contentsClass = '.contents';
		  var btnDivClass = '.dialog_btn';
		  var btnAreaHeightResult = 0;
		  if(isTheme){
			  contentsClass = '.Dialog-contents';
			  btnDivClass = '.Dialog-btnwrap';
			  
			  if($.alopex.util.isValid(parent.button)){
				  var btnAreaHeight = $(parent.button).css('margin-bottom').replace('px','');
				  var btnAreaHeight2 = $(parent.button).find('.Button').css('line-height').replace('px',''); 
				  btnAreaHeightResult = Number(btnAreaHeight) + Number(btnAreaHeight2);
			  }
			  
			  //[Hong-HyunMin 2016.02.12] toggle인 경우에 _resizeBottomDialog 시에 toggle의 Expanded를 위한 처리.
			  if(true == parent.toggle){
				  e.currentTarget.dialog.folded = false;
				  $(parent).find('.DialogToggle').removeClass('Expanded');
			  }
		  }
		  
		  /**
		   * [Hong-HyunMin 2016.01.05] 옵션이 리사이즈이거나 마크업에 리사이즈 속성을 적용한 경우.
		   */
		  if(resizableValid){
			  
			  //펼칠때의 기준이 되는 높이
			  var standardHeight = $.alopex.widget.dialog._dialogStandardHeight(parent);
		    	
			  //접을때의 기준이 되는 높이.
			  var headerHeight = $.alopex.widget.dialog._dialogHeaderHeight(parent);
			  
			  if(standardHeight == 0 && headerHeight == 0){
				  standardHeight = 270;
			  }
			  
			  //standardHeight 보다 리사이즈 하려는 값이 작은 경우 standardHeight을 기준으로 높이 값 변경.
			  if (resizedY < standardHeight) {
				  $(parent).css('height', standardHeight + 'px');
				  $(parent).find(contentsClass).css('height', standardHeight - headerHeight - btnAreaHeightResult + 'px');
				  
				  //[2016-10-11]iframe이 true/false인 경우 popup으로 판단. contents의 높이를 변경 함
				  if(parent.iframe == true){
					 $(parent).find('iframe').css('height', standardHeight - headerHeight - btnAreaHeightResult + 'px');
				  }
				  if(parent.iframe == false){
					  $(parent.contents).css('height', standardHeight - headerHeight  + 'px');
				  }
				  
			  }
			  else{
				  $(parent).css('height', resizedY + 'px');
				  $(parent).find(contentsClass).css('height', resizedY - headerHeight - btnAreaHeightResult + 'px');
				  
				  //[2016-10-11]iframe이 true/false인 경우 popup으로 판단. contents의 높이를 변경 함
				  if(parent.iframe == true){
					  $(parent).find('iframe').css('height', resizedY - headerHeight + 'px');
				  }
				  if(parent.iframe == false){
					  $(parent.contents).css('height', resizedY - headerHeight  + 'px');
				  }
				  
			  }
			  
			  //standardHeight 보다 리사이즈 하려는 값이 window영역을 넘지 않도록 하기 위한 처리
			  if ($(parent).height() >= ($(window).height() - parent.offsetTop)) {
				  $(parent).css('height', ($(window).height() - parent.offsetTop - 3) + 'px');
			  }
		  }
		},

		_resizeBothDialog: function(e, ae) {
		  $.alopex.widget.dialog._resizeRightDialog(e, ae);
		  $.alopex.widget.dialog._resizeBottomDialog(e, ae);
		},

		_clickMoveToTop: function(e) {
		  //var el = (e) ? e.currentTarget : this.element[this.element.length-1];
		  var dialog = $.alopex.widget.dialog;
		  //var dialogLength = dialog.dialoglist.length;

		  var runMoveToTop = true;
		  $.each(dialog.dialoglist, function(index, value) {
		    if (dialog.dialoglist[index].modal) {
		      runMoveToTop = false;
		      return;
		    }
		  });

		  if (runMoveToTop) {
		    $.alopex.widget.dialog._moveToTop(e);
		  }
		},

		_moveToTop: function(e) {
		  var el = (e) ? e.currentTarget : this.element[this.element.length-1];
		  var $el = $(el);
		  var dialog = $.alopex.widget.dialog;
		  var dialogLength = dialog.dialoglist.length;

		  if (dialogLength <= 1) {
		    $el.css('z-index', dialog.maxZindex);
		    if (el.modal) {
		      $(el.blocker).css('z-index', dialog.maxZindex - 1);
		    }
		    return;
		  }

		  $.each(dialog.dialoglist, function(index, value) {
		    if (dialog.dialoglist[index] === el) {
		      var topEl = dialog.dialoglist.splice(index,1);
		      dialog.maxZindex = 1000 + dialogLength;
		      $el.css('z-index', dialog.maxZindex);
		      if (el.modal) {
		        $(el.blocker).css('z-index', dialog.maxZindex - 1);
		      }

		      dialog.dialoglist = topEl.concat(dialog.dialoglist);
		      var maxZindex = dialog.maxZindex;
		      for(var i=1;i<dialogLength;i++) {
		        maxZindex--;
		        $(dialog.dialoglist[i]).css('z-index', maxZindex);
		        if (dialog.dialoglist[i].modal) {
		          $(dialog.dialoglist[i].blocker).css('z-index', maxZindex - 1);
		        }
		      }
		    }
		  });
		},

		open: function(el, obj, callbck) {
		  var $el = $(el);
		  //open check
		  if ($el.is(':visible') && $el.css('opacity') != '0') {
		    return;
		  }
		  if ($.alopex.util.isValid(obj)) {
			if ($.alopex.util.isValid(obj.height)) {
				$el.css('height', obj.height);
			}
			if ($.alopex.util.isValid(obj.width)) {
			    $el.css('width', obj.width);
			}

			if ($.alopex.util.isValid(obj.top)) {
		    	  el.top = obj.top;
		    }
			
			if ($.alopex.util.isValid(obj.left)) {
		    	  el.left = obj.left;
		    }
			
		    // 새롭게 옵션에 설정된 값 반영.
		    if (obj.type !== undefined) { // null, ""  허용
//		    	el.dialogtype = obj.type || el.dialogtype;
		      el.dialogtype = obj.type;
		      
		      //[Hong-HyunMin 2016.01.05] Dialog  Toggle 옵션 추가.
		      if ($.alopex.util.isValid(obj.toggle)) {
		    	  el.toggle = obj.toggle;
		      }
		      
		      this._setDialogType(el, el.dialogtype); // 타입 재지정.
		    }
		    if ($.alopex.util.isValid(obj.resizable)) {
		      this._setResizable(el, obj.resizable);
		    }
		    if ($.alopex.util.isValid(obj.movable)) {
		      this._setMovable(el, obj.movable);
		    }
		    if ($.alopex.util.isValid(obj.modal)) {
		      this._setModal(el, obj.modal);
		    }

		    for (i in obj) {
		      if (obj[i] === 'true' || obj[i] === 'false') {
		        obj[i] = $.alopex.util.parseBoolean(obj[i]);
		      }
		      if ($.alopex.util.isNumberType(obj[i])) {
		        obj[i] = parseInt(obj[i], 10);
		      }
		    }
		    $.extend(el, obj);
		  }
		  // set open button
		  if ($.alopex.util.isValid(document.activeElement) && document.activeElement.tagName !== "BODY") {
		    el.target = document.activeElement;
		  } else if ($.alopex.util.isValid(window.event)) {
		    el.target = window.event.srcElement;
		  }

			// div.Header 가 있는 경우(el.dialogtype !== null) div.Header에 텍스트노드 있으면 제거하고, el.title을 append해준다.
		  var $children = $el.children();
		  if ($children.length > 0) {
		  	// if ($.alopex.util.isValid(el.title)) {
		    if ($.alopex.util.isValid(el.title) && (el.dialogtype !== null && el.dialogtype !== "null")) {
		    	var $elementsInHeader = $($children[0]).contents();
		      for (var i = 0; i < $elementsInHeader.length; i++) {
		        if ($elementsInHeader[i].nodeType === 3) {
		          $children[0].removeChild($elementsInHeader[i]);
		        }
		      }
		      
		      if(el.title == false || el.title =='false') {
		    	  $($children[0]).remove();
		      } else {
		    	  $($children[0]).append(el.title);
		      }
		    }
		  }

		  if (el.modal) { 
		    // 20140715 
		    // 이전 다이얼로그 오픈 시 바디 스크롤 막기위해서 처리 히스토리
		    // body 영역의 width & height을 윈도우 영역과 맞추고 overflow:hidden 처리로 스크롤이 안되게 처리.
		    // 이렇게 처리해도 
		    $(el.blocker).css('display', 'block');

		    if (el.modalscrollhidden) {
		      if(document.body.style.position != 'fixed' && document.body.style.position != 'absolute') {
		        this.bodyposition = document.body.style.position;
		        this.bodywidth = document.body.style.width;
		        
		        var scrollbarWidth =  $.alopex.widget.dialog._scrollbarWidth();
		        
		        
		        if (window.browser === 'ie' || 
						$.alopex.util.isValid(window.browser) && window.browser.indexOf('Microsoft Internet Explorer') !== -1){
		          el.scrollTopValue = $(document.documentElement).scrollTop();
		        } else {
		          el.scrollTopValue = $(document.body).scrollTop();
		        }
		        $('body').css({
		          'top': (el.scrollTopValue * -1) + 'px',
		          'position': 'fixed',
		          'width':  $('body').innerWidth() +'px'
		        });
		        
		        
		        
		        
		   	// 20160321 모달창에선  scroll 이벤트를 동작 하지 않도록.
		        //$(window).bind('mousewheel.modal touchmove.modal scroll.modal',function (e) { e.preventDefault() });
		        // 20160321 모달창에선  해당 위치에 scroll 고정하도록.
		        //var body_scroll = $(window).scrollTop();
		        //$(window).bind('scroll.modal', function(){
		        //   $(document).scrollTop(body_scroll);
		        //});
		   
		        
		      }
		    }
		  }

		  $el.css('display', 'block');
		  $el.css('opacity', '1');

		  // -webkit-transform 버그로 fixed position 역할을 제대로 못해줌.
		  // 이 경우, 바디 및에 붙혀줌.
		  if($el.closest('[data-carousel]').length > 0 || $el.closest('[data-carousel]').length > 0) {
		    $el.appendTo('body');
		    $(el.blocker).appendTo('body');
		  }
		  var centerTop = ($(window).height() - el.offsetHeight) / 2;
		  var centerLeft = ($(window).width() - el.offsetWidth) / 2;
		  // set dialog position
		  if (!$.alopex.util.isValid(el.top)) {
		    $el.css('top',(centerTop + this.dialoglist.length * 10) + 'px'); 
		  }else{
			$el.css('top', el.top + 'px'); 
		  }
		  if (!$.alopex.util.isValid(el.left)) {
		    $el.css('left', (centerLeft + this.dialoglist.length * 10) + 'px');
		  }else{
			  $el.css('left', el.left + 'px');  
		  }
		  if(el.scroll && el.contents) {
		  	el.contents.attr('data-dialog-scroll', true);
		  }

		  // dialog - el.contents 에 data-dialog-scroll를 쓴 경우 동적 스크롤 추가되도록 수정
		  if (el.scroll || (el.contents && el.contents.attr("data-dialog-scroll")) === "true") {
			    this._calculateHeight(el);
			  }
		  // dialog position이 'absolute'일 경우, top & left 계산.

		  switch (el.animation) {
		  case 'slide':
		    $el.css('top', (el.offsetHeight * -1) + 'px');
		    $el.animate({
		      'top': $.alopex.util.isValid(el.top) ? el.top : (centerTop + this.dialoglist.length * 10)   + 'px'
		    }, el.animationtime);
		    break;
		  case 'fade':
		    $el.css('opacity', '0');
		    $el.animate({
		      'opacity': '1'
		    }, el.animationtime);
		    break;
		  default:
		    break;
		  }
		  //	 $(document.body).css('overflow', 'hidden'); // position: fixed 처리로 인해 불필요. 주석처리 20140715

		  this.element.push(el);
		  this.dialoglist.push(el);
		  this._moveToTop();
		  el.windowheight = $(window).height();
		  $(window).bind('resize.dialogWin',function (e) {$.alopex.widget.dialog._reposition(e, el); });
		  // 개발자도구 IE7모드에서, tabindex="0" 속성 사용시 focus함수 호출하면 브라우져 뻗음.
		  // 일반 IE7모드에서는 focus이벤트가 계속 발생.
		  //        $el.attr('tabindex', '0');
		  var selectorcondition = 'a[href], area[href], input:not([disabled]), select:not([disabled]), '
		    + 'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
		  $el.find(selectorcondition).eq(0).focus();

		  if (callbck) {
		    callbck.apply();
		  }
		  
		  /**
		   * [Hong-HyunMin 2016.01.27] Dialog를 open할 시에 resize된 경우에 대비해, resize를 원래의 사이즈로 돌려서 open하도록 처리 함.
		   * popup과 같이 사용하기 때문에, popup이 아닌경우에만 동작하도록 처리함.
		   */
		  var isPopUp = /Alopex_Popup_/.test($el.attr('id'));
		  if(false == isPopUp){
			var isTheme = $.alopex.util.isAlopexTheme();
			var contentsClass = '.contents';
			var btnDivClass = '.dialog_btn'
			var minusBtnHeight = 0;
			var btnAreaHeightResult = 0;
			if(isTheme){
			  contentsClass = '.Dialog-contents';
			  btnDivClass = '.Dialog-btnwrap';
			  
			  if($.alopex.util.isValid(el.button)){
				  var btnAreaHeight = $(el.button).css('margin-bottom').replace('px','');
				  var btnAreaHeight2 = $(el.button).find('.Button').css('line-height').replace('px',''); 
				  btnAreaHeightResult = Number(btnAreaHeight) + Number(btnAreaHeight2);
			  }
			}
	
			var originWidth = $.alopex.widget.dialog._dialogStandardWidth(el);
			var originHeight = $.alopex.widget.dialog._dialogStandardHeight(el);
			var headerHeight = $.alopex.widget.dialog._dialogHeaderHeight(el);
			
			$el.find(contentsClass).css('width', originWidth + 'px');
			$el.find(btnDivClass).css('width', originWidth + 'px');
			$el.find('.ResizeBtn').parents('div').eq(0).css('width',originWidth + 'px');
			$(el.header).css('width', originWidth + 'px');
			
			if(btnAreaHeightResult > 0){
				$el.find(contentsClass).css('height', originHeight - headerHeight - btnAreaHeightResult + 'px');
			}
			else{
				$el.find(contentsClass).css('height', originHeight - headerHeight + 'px');
			}
		  }
		  $el.trigger('open');
		},

		closed: function(el, callback) {
			$(el.closebtn).on('click', function() {
				callback();
			});
		},
		ok: function(el, callback) {
		  $(el.okbtn).on('click', function() {
		    callback();
		  });
		},

		cancel: function(el, callback) {
		  $(el.cancelbtn).on('click', function() {
		    callback();
		  });
		},

		confirm: function(el, callback) {
		  $(el.confirmbtn).on('click', function() {
		    callback();
		  });
		},

		close: function(el, callback) {
		  var $el = $(el);
		  try{
		    // close callback 등록.
		    if ($.alopex.util.isValid(callback)) {
		      el.closecallback = callback;
		    } else {
		      el.closecallback = '';
		    }

		    //var dialog = $.alopex.widget.dialog;
		    if ($el.is(':hidden')) {
		      return;
		    }
		    for(var i=0; i<this.element.length; i++) {
		      if(el == this.element[i]) {
		        this.element.splice(i, 1);
		        break;
		      }
		    }

		    $el.css('z-index', 1001);
		    $.alopex.util.arrayremove(this.dialoglist, el);
		    if (this.dialoglist.length == 0) {
		      this.maxZindex = 1001;
		    }
		    
		    //[2016-10-18]ESH 다중 팝업시 스크롤 이슈 해결.
		    //팝업이 아닌 경우에만 body영역에 스크롤을 재생성 하도록 설정.
		    var isPopUp = /Alopex_Popup_/.test($el.attr('id'));
			if(false == isPopUp){
				if (el.modal) { 
					var body = document.body;
					var scrollTop = Math.abs(parseInt(body.style.top));
					$(body).css({
						'top': '',
						'position': this.bodyposition? this.bodyposition: '',
								'width': this.bodywidth? this.bodywidth: ''
					});
					
					
					// 20160321 scroll 이벤트를 다시 동작 하도록.
					//setTimeout(function (){
					//	  $(window).unbind( "mousewheel.modal touchmove.modal scroll.modal");
					//}, 300);
					
					// dialog 닫힐때 scrollTop 위치 세팅
					if (window.browser === 'ie' || $.alopex.util.isValid(window.browser) && window.browser.indexOf('Microsoft Internet Explorer') !== -1){
						$(document.documentElement).scrollTop(el.scrollTopValue);
					} else {
						$(body).scrollTop(scrollTop);
					}
				}
			}
		    
		    
		    if(el.iframe === true){
		    	$(el).find('iframe')[0].src="about: blank";
		    }
		    // 다이얼로그가 닫힐 때 close 이벤트를 발생하고, 이로 인한 처리는 팝업에서 처리하도록...
		    $(el).trigger('close');

		    if(window.browser == 'mobile') {
		      setTimeout(function (){
		        $.alopex.widget.dialog._close(el);
		      }, 400);
		    } else {
		      $.alopex.widget.dialog._close(el);
		    }

		    // modal 사용 경우, 바디에 걸려있는 스크롤 락 해제.
		    $(window).unbind('resize.dialogWin');
		    $(el.okbtn).off('click');
		    $(el.cancelbtn).off('click');
		    $(el.closebtn).off('click');
		    $(el.confirmbtn).off('click');

		    if ($.alopex.util.isValid(el.target)) {
		      $(el.target).focus();
		    }
		  }catch(e){

		  }
		},
		
		_close: function(el) {
		  var $el = $(el);
		  switch (el.animation) {
		  case 'slide':
		    $el.animate({
		      'top': (el.offsetHeight * -1) + 'px'
		    }, el.animationtime, function(e) {
		      if (el.modal) {
		        $(el.blocker).css('display', 'none');
		      }
		      $el.css('display', 'none');
		    });
		    break;
		  case 'fade':
		    $el.animate({
		      'opacity': '0'
		    }, el.animationtime, function(e) {
		      if (el.modal) {
		        $(el.blocker).css('display', 'none');
		      }
		      $el.css('display', 'none');
		    });
		    break;
		  default:
		    if (el.modal) {
		      $(el.blocker).css('display', 'none');
		    }
		  $el.css('display', 'none');

		  break;
		  }

		  if($.alopex.util.isValid(el.closecallback)) {
		    el.closecallback();
		  }
		},

		// scroll 영역 height 계산
		_calculateHeight: function(el) {
		  var $el = $(el);
		  var parentHeight = $el.outerHeight(true);
		  var siblingHeight = 0;
		  $el.children().each(function(i, elem) {
		    var arr = ['meta', 'title', 'script', 'link'];
		    if (!$(elem).attr('data-dialog-scroll') && $(elem).css('position') !== 'absolute' 
		      && $.inArray(elem.nodeName.toLowerCase(), arr) === -1) {
		      siblingHeight += $(elem).outerHeight(true);
		    }
		  });
		  
		  /**
		   * [Hong-HyunMin 2016.01.15] 테마와 테마 버튼에 따른 스크롤 위치계산값 변경.
		   */
		  var minusHeight = $.alopex.widget.dialog._dialogMinusHeight(el); 
		  var scrollValid = $.alopex.widget.dialog._dialogScrollValid(el); 
		  
		  var isTheme = $.alopex.util.isAlopexTheme();
			
		  var contentsClass = '.contents';
		  var btnDivClass = '.dialog_btn';
		  var btnAreaHeightResult = 0;
		  if(isTheme){
			  contentsClass = '.Dialog-contents';
			  btnDivClass = '.Dialog-btnwrap';
			  
			  if($.alopex.util.isValid(el.button)){
				  var btnAreaHeight = $(el.button).css('margin-bottom').replace('px','');
				  var btnAreaHeight2 = $(el.button).find('.Button').css('line-height').replace('px',''); 
				  btnAreaHeightResult = Number(btnAreaHeight) + Number(btnAreaHeight2);
			  }
		  }
		  
		  if(scrollValid){
			  $el.find('[data-dialog-scroll=true]').css('height', (parentHeight - siblingHeight - btnAreaHeightResult) + 'px');
		  }
		  else {
			  $el.find('[data-dialog-scroll=true]').css('height', (parentHeight - siblingHeight) + 'px');
		  }
		  
		  $el.find('[data-dialog-scroll=true]').css('overflow-y', 'auto');
		},

		reposition: function(el) {
		  var $el = $(el);
		  if ($.alopex.util.isValid(el.top)) {
		    var centerTop = ($(window).height() - $el.outerHeight()) / 2;
		    $el.css('top', (centerTop + $.alopex.widget.dialog.dialoglist.length * 10) + 'px');
		  }

		  if ($.alopex.util.isValid(el.left)) {
			    var centerLeft = ($(window).width() - $el.outerWidth()) / 2;
			    $el.css('left', (centerLeft + $.alopex.widget.dialog.dialoglist.length * 10) + 'px');
		  }
		  if ($.alopex.util.isValid(el) && el.modal) {
		    $(el.blocker).css('height', $(document).height() + 'px');
		    $(el.blocker).css('width', $(document).width() + 'px');
		  }
		},

		_reposition: function(e, el) {
//		  alert('screen.height === ' + screen.height + ', window height === ' + $(window).height())
		  e.preventDefault();
		  //var el = $.alopex.widget.dialog.element;
		  var $el = $(el);
		  if (!$.alopex.util.isValid(el.top)) {
			    var centerTop = ($(window).height() - $el.outerHeight()) / 2;
			    $el.css('top', (centerTop + $.alopex.widget.dialog.dialoglist.length * 10) + 'px');
		  }

		  if (!$.alopex.util.isValid(el.left)) {
			    var centerLeft = ($(window).width() - $el.outerWidth()) / 2;
			    $el.css('left', (centerLeft + $.alopex.widget.dialog.dialoglist.length * 10) + 'px');
		  }

		  if ($.alopex.util.isValid(el) && el.modal) {
		    $(el.blocker).css('height', $(document).height() + 'px');
		    $(el.blocker).css('width', $(document).width() + 'px');
		  }
		},
		
		/**
		 * [Hong-HyunMin 2016.01.15] Dialog의 기본 높이를 return.
		 */
		_dialogStandardHeight: function(el){
			if($.alopex.util.isValid(el)){
				if($.alopex.util.isValid(el.height)){
					return el.height;
				}
				else{
					return el.originHeight;
				}
			}
			else{
				return 0;
			}
		},
		
		/**
		 * [Hong-HyunMin 2016.01.15] Dialog의 기본 넓이를 return.
		 */
		_dialogStandardWidth: function(el){
			if($.alopex.util.isValid(el)){
				if($.alopex.util.isValid(el.width)){
					return el.width;
				}
				else{
					return el.originWidth;
				}
			}
			else{
				return 0;
			}
		},
		
		/**
		 * [Hong-HyunMin 2016.01.15] Dialog의 Resize시에 css별로 빼줘야 하는 높이 값.
		 */
		_dialogMinusHeight: function(el){
			var minusHeight = 0;
			if($(el.contents).attr('class') == 'contents'){
				minusHeight = 18;
			}
			if($(el.contents).attr('class') == 'Dialog-contents'){
				minusHeight = 14;
			}
			return minusHeight;
		},
		
		/**
		 * [Hong-HyunMin 2016.01.15] Dialog의 Header영역의 높이를 return.
		 */
		_dialogHeaderHeight: function(el){
			if($.alopex.util.isValid(el)){
				if($.alopex.util.isValid(el.header)){
					return $(el.header).height();
				}
				else{
					return 0;
				}
			}
			else{
				return 0;
			}
		},
		
		/**
		 * [Hong-HyunMin 2016.01.15] Dialog의 option 또는 mark attribute에 의한 scroll여부 확인
		 * ** scroll markup인 data-dialog-scroll는 contents 영역에 선언 한다.
		 */
		_dialogScrollValid: function(el){
			var scrollValid = false;
			if(el.scroll == true){
				scrollValid =  true;
			}
			if($(el.contents).attr('data-dialog-scroll') == true || $(el.contents).attr('data-dialog-scroll') == 'true'){
				scrollValid =  true;
			}
			return scrollValid;
		},
		
		
		
		_scrollbarWidth: function() {
		    var parent, child, width;

		    if(width===undefined) {
			var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
		        widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).width();
			$outer.remove();
			width =  99 - widthWithScroll;
		    }

		   return width;
		},
		
		
		/**
		 * [Hong-HyunMin 2016.01.15] Dialog의 option 또는 mark attribute에 의한 resizable여부 확인
		 * ** resizable markup인 data-resizable는 Dialog 영역에 선언 한다.
		 */
		_dialogResizableValid: function(el){
			var resizableValid = false;
			if(el.resizable == true){
				resizableValid =  true;
			}
			if($(el).attr('data-resizable') == true || $(el).attr('data-resizable') == 'true'){
				resizableValid =  true;
			}
			return resizableValid;
		},

		id: {
		  value: null,
		  enumerable: true,
		  configurable: false,
		  writable: true
		}
	});
})(jQuery);
