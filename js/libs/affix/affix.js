/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))
     // .on('click.bs.affix.data-api',  $.proxy(this.checkPosition, this))

    this.$element     = $(element)
    this.$document    = $(document)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()
    var documentHeight = this.$document.height()

       
    var initializing   = this.affixed == null
    var colliderTop    = scrollTop
    var colliderHeight = targetHeight

    if ((offsetTop != null && scrollTop <= offsetTop) || scrollTop == 0) return 'top'
    if ((offsetBottom != null && (scrollTop + targetHeight >= scrollHeight - offsetBottom)) || scrollTop + targetHeight == documentHeight) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    //if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())
    var change = false;

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null
    		 
      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
      change = true;
    }
   	var winHeight = $(window).height();
	var docScroll = $(document).scrollTop();
	 var height = $('.sub-nav').find('ul').height();
	
	var bottomTop =   0;

	var scrollTop    = $(document).scrollTop()
	var position     = this.$element.offset()
	var targetHeight =  $(window).height()
	var documentHeight = this.$document.height()

    if (affix == 'bottom') {
	
	    
	    $('.sub-nav__wrap').css('height',100 + winHeight - ((scrollTop + targetHeight) - (scrollHeight - offsetBottom)));
	    $('.sub-nav').css('height', 100 + winHeight -  ((scrollTop + targetHeight) - (scrollHeight - offsetBottom)));      
	  
	this.$element.offset({ top: (scrollHeight - (winHeight) - offsetBottom  )  + (offsetBottom - (scrollHeight - (docScroll + winHeight ))) + 32} );

    }else if (affix == 'top') {
	
	if(docScroll < 153){ // top 영역의 높이 값 153 + 20은 top 에서 메뉴 떨어진 간격
	    winHeight = winHeight -(173 - docScroll);
	}
	
	if (height < (winHeight - docScroll)) {
	    $('.sub-nav__wrap').css('height', height+ 10);
	    $('.sub-nav').css('height',height+ 10);
	
	}else{
	    
	   $('.sub-nav__wrap').css('height',winHeight);
	    $('.sub-nav').css('height',winHeight);
	}
    }else{
	if (height < (winHeight - docScroll)) {
	    $('.sub-nav__wrap').css('height', height+ 10);
	    $('.sub-nav').css('height',height+ 10);
	
	}else{
	    
	   $('.sub-nav__wrap').css('height',winHeight - 40);
	    $('.sub-nav').css('height',winHeight - 40);
	}
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
