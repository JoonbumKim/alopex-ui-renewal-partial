
(function($) {
	/**
	 * TODO : 
	 * - carousel markup & how to fix the size
	 * 
	 */
	$.alopex.widget.carousel = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'carousel',
		/**
		 * property 
		 */
		// class property
		defaultClassName: 'af-carousel Carousel',

		setters: ['carousel', 'nextSlide', 'prevSlide', 'setIndex','stopAutoSlide', 'startAutoSlide', 'setAutoSlideDuration'],
		getters: [],

		eventHandlers: {
			
		},

		properties: {
			width: 0, // wrapper width
			currentpage: 1, // current page of carousel, start from 1.
			totalpage: 0,
			position: 0, // carousel transform position
			maxPosition: 0,
			pages: null,
			prevButton: null,
			nextButton: null,
			paging: null,
			playControlButton: null,
			playButton: null,
			pauseButton: null,
			slidable: null,
			animationDuration: 400,
			autoSlidemode:false,
			autoSlideDuration: 5000
		},
		
		setEnabled: null,

		init: function(el, options) {
			var $el = $(el);
			var $obj = $.alopex.widget.object;

			$el.css({
				'overflow' : 'hidden',
				'position' : 'relative'
			});

			$.extend(el, $.alopex.widget.carousel.properties, options);

			el.pages = $el.find('[data-role="page"], .Page');
			el.pagingHeight = 50;
			el.pageHeight = (el.pages[0].offsetHeight > 0) ? el.pages[0].offsetHeight : el.offsetHeight - el.pagingHeight;
			
			el.width = el.offsetWidth;
			el.totalpage = el.pages.length;
			el.playControlButton = $el.attr('data-playControlButton');
			
			el.prevButton = $el.find('[data-role="prev"]').addClass('prev');
			el.nextButton = $el.find('[data-role="next"]').addClass('next');
			
			
			if(el.prevButton.length == 0) {
				el.prevButton = $el.find('.Prev');
			}
			if(el.nextButton.length == 0) {
				el.nextButton = $el.find('.Next');
			}
			el.paging = $el.find('[data-role="pagination"], .Paging');
			
			if (el.playControlButton === "true") {
			    
			    var divPlay = document.createElement('div');
			    $(divPlay).attr('class', 'Display-inblock');
			    $(divPlay).attr('style', 'margin-top: -2px;');
			    
			    var playIcon  = document.createElement('span');
			    $(playIcon).attr('class', 'Icon Play');
			    
			    divPlay.appendChild(playIcon);
			    
			    var pauseIcon  = document.createElement('span');
			    $(pauseIcon).attr('class', 'Icon Pause');
			    
			    divPlay.appendChild(pauseIcon);
			    el.paging.append(divPlay);
			    
			    el.playButton = $el.find('.Paging>div .Play');
			    el.pauseButton = $el.find('.Paging>div .Pause');
			    
			    
			  
			}
			
			el.maxPosition = -1 * el.width * (el.totalpage - 1);

			el.paging.attr({
				'data-type': 'pagination',
				'data-generatelink': 'mobile',
				'data-maxpage': el.pages.length,
				'data-totalpage': el.pages.length
			}).pagination();

			
			
			
			
			// slidable initiation
			el.slidable = el.querySelector('.Scroller');
			if(!el.slidable) {
				el.slidable = document.createElement('div');
			}
			el.slidable.element = el;
			el.appendChild(el.slidable);
			$(el.slidable)
				.css({
//					'height': (el.offsetHeight - el.pagingHeight) + 'px',
					'width': el.width * el.pages.length + 'px',
					'transform': 'translate3d(0px, 0px,0px)',
					'-ms-transform': 'translateZtranslate3d(0px, 0px,0px)',
					'padding': '0'
				});

			// page initiation
			if ($.alopex.util.isValid(el.pages)) {
				el.pages
				.css({
					'width': el.width + 'px',
					'position': 'relative',
//					'height': '100%',
					'float': 'left'
				})
				.each(function(index) {
					this.index = index;
				});
				for ( var i = 0; i < el.pages.length; i++) {
					el.slidable.appendChild(el.pages[i]);
				}
				
				
			}
			
			if($(el).attr('data-autoSlidemode') === 'true') {
			    el.autoSlidemode = true;
			    if($(el).attr('data-autoSlideDuration') > 0){
				el.autoSlideDuration = $(el).attr('data-autoSlideDuration');
			    }
			    this._evt_autoSlide(el, true);
			}
			
			
		},
		
		event: function(el, options) {
			// event handler binding
			var carousel = $.alopex.widget.carousel;
			el.paging.on('pagechange', carousel._evt_pagechange);
			el.prevButton.on('click', carousel._evt_prev_btn);
			el.nextButton.on('click', carousel._evt_next_btn);
			if (el.playControlButton === "true") {
			    el.playButton.on('click', carousel._evt_play_btn);
			    el.pauseButton.on('click', carousel._evt_pause_btn);
			}
			// 20150608 김준범
			// resize event handler 중복 적용 제거
//			$(window).on('resize', {object: el}, this._evt_resize);
			$(el.slidable).on('pressed', carousel._evt_pressed);
			if(window.browser == 'mobile') { // scroll 또는 swipe 이벤트 판단을 위해 필요.
				$(el.slidable).on('touchmove', carousel._evt_move);
			} else {
				$(el.slidable).on('swipemove', carousel._evt_swipemove);
				this._addSwipeEvent(el); // 데스크탑의 경우에만 넣어줌.
			}
			$(window).on('resize', {object: el}, this._evt_resize);
		},
		
		_evt_resize: function(e){
			el = e.data.object;
			el.width = el.offsetWidth;
			$(el.slidable)
//				.css('height', (el.offsetHeight - el.pagingHeight) + 'px')
				.css('width', el.width * el.pages.length + 'px');
			el.pages.css('width', el.width + 'px').css('position', 'relative');
			el.position = -1 * (el.currentpage - 1) * el.width;
			$.alopex.widget.carousel._slide(el, el.position);
		},
		
		_addSwipeEvent: function (el, once) {
			var method = 'on';
			if(once) {
				method = 'one';
			}
			var swipeEventHandler = this._evt_swipe;
			if(el.buttons) { // tabs 엘리먼트가 아닐 경우만 호출.
				swipeEventHandler = $.alopex.widget.tabs._evt_swipe;
			}
			//$(el.slidable)[method]('swipemove', this._evt_swipemove);
			$(el.slidable)[method]('swipecancel', this._evt_swipecancel);
			$(el.slidable)[method]('swipe', {
				distanceX: 60	// 100px 이상 swipe될 경우, 페이지 이동.
			}, swipeEventHandler);
			
		},
		
		_removeSwipeEvent: function(el) {
			$(el.slidable).off('swipemove', this._evt_swipemove);
			$(el.slidable).off('swipecancel', this._evt_swipecancel);
			$(el.slidable).off('swipe', {
				distanceX: 60	// 100px 이상 swipe될 경우, 페이지 이동.
			}, this._evt_swipe);
		},
		
		_slide: function(el, position, duration) {
			if ($.alopex.widget.carousel.transitionSupport) {
				$(el.slidable).css({
					'transition': 'all ' + duration + 'ms ease-in-out',
					'-ms-transition': 'all ' + duration + 'ms ease-in-out'
				});
				
				$(el.slidable).css('transform', 'translate(' + (position) + 'px,0)');
				$(el.slidable).css('transform', 'translate3d(' + (position) + 'px,0,0)');
				
				setTimeout(function() {
					$(el.slidable).css({
						'transition': 'all 0 ms ease-in-out',
						'-ms-transition': 'all 0 ms ease-in-out'
					});
				}, duration);
			} else {
				// 20150608 김준범
				// IE 7, 8에서 element absolute 시 resize 되기 때문에
				// absolute 다음으로 위치 변경
//				var height = $(el).css('height');
				
				$(el.slidable).css({
					position: 'absolute'
				});
				
				var height = $(el).css('height');
				
				$(el.slidable).animate({ 
					left: (position) + 'px' 
				}, duration);
				if(height != undefined) {
					$(el).css('height', height);
				}
			}
		},
		
		
		

		_evt_pagechange: function(e, page) {
			var el = $(e.currentTarget).parent('[data-type="carousel"]')[0];
			var distance = el.currentpage - page;
			el.position = el.position + distance * el.width;
			el.currentpage = page;
			
			$.alopex.widget.carousel._slide(el, el.position, 300);
		},

		_evt_prev_btn: function(e) {
			var el = $(e.currentTarget).parent('[data-type="carousel"]')[0];
			$(el).prevSlide();
		},

		_evt_next_btn: function(e) {
			var el = $(e.currentTarget).parent('[data-type="carousel"]')[0];
			//      $(el.slidable).css('transition', 'all ' + el.animationDuration + ' ease-in-out');
			$(el).nextSlide();
		},
		
		_evt_play_btn: function(e) {
		    var el = $(e.currentTarget).parent().parent().parent();
		    $(el).nextSlide();
		    $(el).startAutoSlide(el);
		},

		_evt_pause_btn: function(e) {
		    var el = $(e.currentTarget).parent().parent().parent();
		    $(el).stopAutoSlide(el);
		},
		
		_evt_move: function(e) {
			var el = e.currentTarget.element;
			if(!el.pressed) {
				return false;
			}
			var point;
			var touches = e.touches || e.originalEvent.touches;
			if(touches && touches.length > 0) {
				touches = touches[0];
				point = {
					x: touches.clientX? touches.clientX: 0,
					y: touches.clientY? touches.clientY: 0
				};
			} else {
				point = {
					x: e.clientX,
					y: e.clientY
				}
			}
			if(el.mode == 'vertical') {
				// prevent안하고 내비둔다.
				__ALOG('==== 현재 스크롤 ====== ');
			} else if(el.mode == 'horizontal') {
				e.preventDefault();
				__ALOG('==== 현재 스와이프  ====== ');
				distanceX = point.x - el.presspoint.x;
				if (Math.abs(distanceX) > el.width) {
					distanceX = distanceX / distanceX * el.width;
				}
				e.preventDefault(); // android에서는 e.preventDefault 호출해줘야 계속 touchmove 이벤트 발생.
				$.alopex.widget.carousel._slide(el, el.position+distanceX, 0);
			} else { // 미정.
				//e.preventDefault();
				$.alopex.widget.carousel._removeSwipeEvent(el);
				if(Math.abs(el.presspoint.y - point.y) > 10) {
					el.mode = 'vertical';
					__ALOG('==== 버티컬 모드로 진입 ====== ');
				} else { // swipe event handle
					__ALOG('==== 스와이프  모드로 진입 ====== ');
					el.mode = 'horizontal';
					$.alopex.widget.carousel._addSwipeEvent(el, true);
				}
			}
		},

		/**
		 * the event handler for pressed event
		 * it will attach the slides to the both side of current page slide.
		 */
		_evt_pressed: function(e, c) {
			var el = $(e.currentTarget).parent('[data-type="carousel"]')[0];
			el.mode = null;
			el.pressed = true;
			$(el.slidable).css({
					'transition': 'all 0s ease-in-out',
					'-ms-transition': 'all 0s ease-in-out'
				});
			if(window.browser == 'mobile') {
				var touches = e.touches || e.originalEvent.touches || e.originalEvent.originalEvent.touches;
				if(touches && touches.length > 0) {
					touches = touches[0];
					el.presspoint = {
						x: touches.clientX? touches.clientX: 0,
						y: touches.clientY? touches.clientY: 0
					};
				}
			} else {
				el.presspoint = {
					x: e.clientX,
					y: e.clientY
				};
			}
		},

		_evt_swipemove: function(e, c) {
			var el = $(e.currentTarget).parent('[data-type="carousel"]')[0];
			if(!el.pressed) {
				return ;
			}
			if (Math.abs(c.distanceX) > el.width) {
				c.distanceX = c.distanceX / c.distanceX * el.width;
			}
			e.preventDefault(); // android에서는 e.preventDefault 호출해줘야 계속 touchmove 이벤트 발생.
			$.alopex.widget.carousel._slide(el, el.position+c.distanceX, 0);
		},

		_evt_swipe: function(e, c) {
			var el = $(e.currentTarget).parent('[data-type="carousel"]')[0];
			var duration = (el.width - Math.abs(c.distanceX)) / c.speed * 1000;
			if (duration > 500) {
				duration = 500;
			}
			if (c.distanceX < 0) { // 좌측 이동
				$(el).nextSlide({animationDuration: duration});
			} else { // 우측 이동
				$(el).prevSlide({animationDuration: duration});
			}
			el.press = false;
			$(el).trigger('swipechange', [el.currentpage-1]);
		},

		_evt_swipecancel: function(e, c) {
			var el = $(e.currentTarget).parent('[data-type="carousel"]')[0];
			$.alopex.widget.carousel._slide(el, el.position, 200);
			el.pressed = false;
		},

		
		
		_evt_autoSlide: function(el, loop, duration) {
		    var duration = (duration)? duration : el.autoSlideDuration;
		    
		    
		    if(loop){
			    clearInterval(el.autoSlideTime);
			    el.autoSlideTime = setInterval(function() {
        			if (el.currentpage < el.totalpage) {
        			    $(el).nextSlide();
        			}else if (el.currentpage == el.totalpage) {
        			    $(el).setIndex(0);
        			}
        		    }, duration);
		    }else{
			clearInterval(el.autoSlideTime);
		    }
		},
		
		
		stopAutoSlide: function(el) {
		    this._evt_autoSlide(el, false);
		},
		
		
		startAutoSlide: function(el) {
		    this._evt_autoSlide(el, true);
		},
		
		setAutoSlideDuration: function(el, duration) {
		    el.autoSlideDuration = duration;
		    this._evt_autoSlide(el, true, duration);
		},
		
		
		
		
		
		nextSlide: function(el, options) {
			var duration = (options && options.animationDuration)? options.animationDuration : el.animationDuration;
			if (el.currentpage < el.totalpage) {
				el.position -= el.width;
				el.currentpage++;
				el.paging.setSelectedPage(el.currentpage, true);
			}
			$.alopex.widget.carousel._slide(el, el.position, duration);
		},

		prevSlide: function(el, options) {
			var duration = (options && options.animationDuration)? options.animationDuration : el.animationDuration;
			if (el.currentpage > 1) {
				el.position += el.width;
				el.currentpage--;
				el.paging.setSelectedPage(el.currentpage, true);
			}
			$.alopex.widget.carousel._slide(el, el.position, duration);
		},
		
		setIndex : function(el, index, options) {
			if(index < 0 || index >= el.pages.length) {
				return ;
			}
			var duration = (options && options.animationDuration != undefined)? options.animationDuration : el.animationDuration;
			el.position = el.width*index*-1;
			el.currentpage = index+1;
			el.paging.setSelectedPage(el.currentpage, true);
			$.alopex.widget.carousel._slide(el, el.position, duration);
		},

		transitionSupport: (function() {
			if (navigator.userAgent.indexOf('MSIE') !== -1 && navigator.userAgent.indexOf('MSIE 10') === -1) {
				return false;
			}
			return true;
		})()
	});

})(jQuery);