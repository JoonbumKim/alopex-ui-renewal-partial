(function($) {
	if (window['AlopexOverlay']) {
		return;
	}
	var defaultOverlayOption = {
		bgColor : '#fff',
		duration : 0,
		durationOff : 0,
		opacity : 0.7,
		progress : false,
		createProgress : null,
		resizeProgress : null,
		removeProgress : null,
		appendIn : false,
		complete : null
	};

	// 해당 element에 맞는 크기의 overlay용 div를 만들어서 리턴한다.
	var AlopexOverlay = function(elem, option) {
		if (!elem) {
			return null;
		}
		this.option = $.extend({}, defaultOverlayOption, option);
		if (elem === document || elem === document.body) {
			this.option.appendIn = true;
		}
		this.target = elem === document ? document.body : elem;
		this.overlay = null;
		this.ptimer = null;
		this.progress = null;
		this.on = false;

		this.init = function(complete) {
			this.remove();
			this.on = true;
			var css = {};
			var jelem = $(this.target);
			if (jQuery.support.opacity) {
				css['opacity'] = this.option.opacity;
			} else {
				css['filter'] = 'Alpha(opacity=' + (this.option.opacity * 100)
						+ ')';
			}
			css['background-color'] = this.option.bgColor;
			css['z-index'] = 99990;
			css['position'] = 'absolute';
			css['border-radius'] = jelem.css('border-radius');
			css = $.extend(css, this.generateSize());

			this.overlay = $('<div></div>').css(css).addClass('alopex_overlay')[0];
			var cfunc = complete || this.option.complete;
			jelem[this.option.appendIn ? 'append' : 'after']($(this.overlay)
					.fadeIn(this.option.duration, function() {
						if (typeof cfunc === 'function') {
							cfunc();
						}
					}));
			if (this.option.progress) {
				if (typeof this.option.createProgress === 'function') {
					// 내부 함수에서는 this.target과 this.overlay를 가지고 제어를 할 수 있게 된다.
					// custom progress는 생성한 progress element의 root를 리턴한다.
					// 타이머 사용시 this.ptimer를 사용하도록 한다.
					// 생성한 프로그레스 element는 alopex_progress클래스를 가지도록 한다.
					this.option.createProgress.call(this);
				}
			}
			return this;
		};
		this.extendOption = function(option) {
			if (option) {
				this.option = $.extend({}, this.option, option);
			}
		};
		this.generateSize = function() {
			var css = {};
			var jelem = $(this.target);
			if (this.target === document || this.target === document.body) {
				this.target = document.body;
				jelem = $(document.body);
				css['width'] = css['height'] = '100%';
				css['top'] = css['left'] = 0;
				css['position'] = 'fixed';
			} else if (jelem.css('position') === 'relative'
					&& this.option.appendIn) {
				css['width'] = css['height'] = '100%';
				css['top'] = css['left'] = 0;
			} else {
				var relparent = false;
				$(this.target).parents().each(function(i, el) {
					if ($(this).css('position') === 'relative') {
						relparent = true;
					}
				});
				if (relparent) {
					var poffset = $(this.target.parentElement).offset();
					css['width'] = jelem.outerWidth();
					css['height'] = jelem.outerHeight();
					css['top'] = jelem.offset().top - poffset.top;
					css['left'] = jelem.offset().left - poffset.left;
				} else {
					css['width'] = jelem.outerWidth();
					css['height'] = jelem.outerHeight();
					css['top'] = jelem.offset().top;
					css['left'] = jelem.offset().left;
				}
			}
			return css;
		};
		this.resize = function() {
			// this.overlay.animate(this.generateSize());
			$(this.overlay).css(this.generateSize());
			if (this.option.progress) {
				if (typeof this.option.resizeProgress === 'function') {
					this.option.resizeProgress.call(this);
				}
			}
			return this;
		};
		this.remove = function(complete) {
			var dur = this.option.durationOff;
			this.on = false;
			if (typeof this.option.removeProgress === 'function') {
				this.option.removeProgress.call(this);
			}
			$(this.target).find('.alopex_progress').remove();
			$(this.target).find('.alopex_overlay').add(this.overlay).fadeOut(
					dur, function() {
						if (typeof complete === 'function') {
							complete();
						}
						$(this).remove();
					});
			return this;
		};
		this.init();
	};

	AlopexOverlay.defaultOption = defaultOverlayOption;

	var defaultOverlayProgress = function() {
		var dur = this.option.duration;
		var pcss = {
			position : 'absolute',
			margin : '0 auto',
			// overflow:'hidden',
			display : 'inline-block',
			'*display' : 'inline',
			zoom : 1,
			'text-align' : 'center',
			'z-index' : 99991
		};
		var bcss = {
			display : 'block',
			float : 'left',
			width : '12px',
			height : '12px',
			margin : '4px',
			'border-radius' : '3px'
		};
		var p = this.progress = $('<div></div>').css(pcss).addClass(
				'alopex_progress');
		var b = [];
		var blocknum = 3;
		for (var i = 0; i < blocknum; i++) {
			b
					.push($('<div></div>').css(bcss).addClass(
							'alopex_progress_block'));
			p.append(b[i]);
		}
		// this.progress.insertAfter(this.overlay);
		this.progress.fadeIn(dur).insertAfter(this.overlay);
		p.css('left', this.generateSize().left + $(this.overlay).innerWidth()
				/ 2 - p.width() / 2);
		p.css('top', this.generateSize().top + $(this.overlay).innerHeight()
				/ 2 + $(this.target).scrollTop() - p.height() / 2);
		var pcolor = [ '#68838B', '#BFEFFF', '#BFEFFF' ];
		var intervalFunc = function() {
			for (var i = 0; i < b.length; i++) {
				b[i].css('background-color', pcolor[i]);
			}
			pcolor.unshift(pcolor.pop());
		};
		intervalFunc();
		this.ptimer = setInterval(intervalFunc, 150);
		return p;
	};
	var defaultOverlayProgressResize = function() {
		var p = this.progress, size = this.generateSize();
		p.css('left', size.left + $(this.overlay).innerWidth() / 2 - p.width()
				/ 2);
		p.css('top', size.top + $(this.overlay).innerHeight() / 2 - p.height()
				/ 2);
	};
	var defaultOverlayProgressRemove = function() {
		var dur = this.option.durationOff;
		var that = this;
		if (this.progress) {
			$(this.progress).fadeOut(dur, function() {
				if (that.ptimer) {
					clearInterval(that.ptimer);
					that.ptimer = null;
				}
				$(that.progress).remove();
				that.progress = null;
			});
		}
	};

	defaultOverlayOption['createProgress'] = defaultOverlayProgress;
	defaultOverlayOption['resizeProgress'] = defaultOverlayProgressResize;
	defaultOverlayOption['removeProgress'] = defaultOverlayProgressRemove;
	defaultOverlayOption['stepProgress'] = null;

	window['AlopexOverlay'] = AlopexOverlay;
	$.each([ 'progress', 'overlay' ], function(i, v) {
		$.fn[v] = function(op) {
			if (!this.length) {
				return;
			}
			var overlay = $(this[0]).data('alopexOverlay');
			var option = $.extend({
				progress : (v === 'progress')
			}, op);
			if (!overlay || !overlay.on) {
				overlay = new AlopexOverlay(this[0], option);
				$(this[0]).removeData('alopexOverlay');
				$(this[0]).data('alopexOverlay', overlay);
			}
			overlay.extendOption(op);
			return overlay;
		};
	});
	
	window.AlopexProgressCount = 0;
	function PlatformUIComponent() {}
	PlatformUIComponent.prototype.showProgressDialog = function(option) {
		var wrapper = document.getElementById('AlopexProgress');
		if(!wrapper) {
			var wrapper = document.createElement('div');
			wrapper.setAttribute('id', 'AlopexProgress');
			var image = document.createElement('div');
//			image.setAttribute('src', '../../build/images/common/loading_1.gif');
//			image.setAttribute('style', ' ');
			image.setAttribute('class', 'af-progress-sample');
			wrapper.appendChild(image);
			document.body.appendChild(wrapper);
		}
		var progressMask = document.getElementById('AlopexProgressMask');
		if(!progressMask) {
			var progressMask = document.createElement('div');
			progressMask.setAttribute('id', 'AlopexProgressMask');
			progressMask.setAttribute('class', 'af-progress-sample-mask');
			document.body.appendChild(progressMask);
		}
		window.AlopexProgressCount ++ ;
	};

	PlatformUIComponent.prototype.dismissProgressDialog = function() {
		window.AlopexProgressCount --;
		if(window.AlopexProgressCount == 0) {
			var wrapper = document.getElementById('AlopexProgress');
			if(wrapper) {
				wrapper.parentNode.removeChild(wrapper);
			}
			var progressMask = document.getElementById('AlopexProgressMask');
			if(progressMask) {
				progressMask.parentNode.removeChild(progressMask);
			}
		}
	};
	platformUIComponent = new PlatformUIComponent();

})(jQuery);
