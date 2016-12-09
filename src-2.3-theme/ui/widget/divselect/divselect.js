(function($) {

  /*********************************************************************************************************
   * divselect
   *********************************************************************************************************/
  $.alopex.widget.divselect = $.alopex.inherit($.alopex.widget.object, {
    widgetName: 'divselect',
    defaultClassName: 'af-select Divselect',
    eventHandlers: {
      change: {
        event: 'change',
        handler: '_changeHandler'
      }
    },
    getters: ['getValues', 'getTexts'],
    setters: ['divselect', 'setPlaceholder', 'setSelected', 'clear', 'refresh', 'setEnabled', 'selectionInitialization'],
    properties: {
      select: null
    },

//    renderTo: function(el) {
//      return '<div class="af-select-wrapper ' + el.className + '" af-dynamic data-select-wrapper="true"><select></select></div>';
//    },

    markup: function(el) {
    },

    init: function(el, option) {
    	var $el = $(el);
    	
    	if(el.tagName.toLowerCase() == 'div') {
    		var div = el;
    		var $div = $(div);
    		$el = $div.find('>select');
    		el = $el[0];
    		// select 에 focus 갈 경우, divselect에서는 div에 focus 표시를 해줘야 한다
    		$el.on("focus", function(){
    			$div.addClass("ui-state-focus");
    		});
    		$el.on("blur", function(){
    			$div.removeClass("ui-state-focus");
    		});
    		
    	} else {
    		$el.wrap('<div class="af-select-wrapper ' + el.className + '" af-dynamic data-select-wrapper="true"></div>');
    		$(el.parentNode).append('<span></span>');
    		
    		// <select class="Divselect" ... 로 사용한 경우에 대한 표시 (HiQ1 1차 방식)
    		// if(el.divSelect) 를 이용해서 판별
    		el.divSelect = el.parentNode;
    	}
    	if(option.placeholder) {
			this.setPlaceholder(el, option.placeholder);
		}
    	
    	var $selectedItem = $el.find(':selected');
    	//IE8에서 querySelectorAll('option:checked')에러남.
//    	var selectedItem = el.querySelectorAll('option:checked')[0];
    	if ($.alopex.util.isValid($selectedItem[0])) {
    		var text = $selectedItem.text();
        	this._setText(el.parentNode, text);
        	
        	if(el.divSelect){ // <select class="Divselect"
        		el.divSelect._value = $selectedItem.val();
        	}else{ // <div class="Divselect"
        		el._value = $selectedItem.val();
        	}
    	}
    },

	selectionInitialization: function(el) {
		var select = null;
    	if(el.tagName.toLowerCase() == 'div') {
    		select = $(el).find('>select')[0];
    	}
    	$.alopex.widget.baseselect.selectionInitialization(select);
    	
    	this.refresh(el);
	},
    _changeHandler: function(e) {
      var wrapper;
      if(e.currentTarget.tagName.toLowerCase() == 'select') {
    	  wrapper = e.currentTarget.parentNode;
      } else {
    	  wrapper = e.currentTarget;
      }
      var selectedItem = $(e.currentTarget).find(':selected')[0];
      wrapper._value = $(selectedItem).val() ? $(selectedItem).val().toString() : "";
      wrapper._text = $(selectedItem).text() ? $(selectedItem).text().toString() : "";
    //IE8에서 querySelectorAll('option:checked')에러남.
     //var selectedItem = wrapper.querySelectorAll('option:checked')[0];
      if ($.alopex.util.isValid(selectedItem)) {
    	  var text = $(selectedItem).text();
    	  $.alopex.widget.divselect._setText(wrapper, text);
      }
    },

    setPlaceholder: function(el, text) {
    	if(el.tagName.toLowerCase() == 'div') {
    		el = $(el).find('>select')[0];
    	}
    	$.alopex.widget.baseselect.setPlaceholder(el, text);
    },

    setSelected: function(el, text) {
    	if(el.tagName.toLowerCase() == 'div') {
    		el = $(el).find('>select')[0];
    	}
    	$.alopex.widget.baseselect.setSelected(el, text);
    },

    refresh: function(el) {
    	if(el.tagName.toLowerCase() == 'div') {
    		el = $(el).find('>select')[0];
    	}
    	$.alopex.widget.baseselect.refresh(el);
    },

    getValues: function(el) {
    	if(el.tagName.toLowerCase() == 'div') {
    		el = $(el).find('>select')[0];
    	}
    	return $.alopex.widget.baseselect.getValues(el);
    },

    getTexts: function(el) {
    	if(el.tagName.toLowerCase() == 'div') {
    		el = $(el).find('>select')[0];
    	}
    	return $.alopex.widget.baseselect.getTexts(el);
    },

    clear: function(el) {
    	if(el.tagName.toLowerCase() == 'div') {
    		el = $(el).find('>select')[0];
    	}
    	$.alopex.widget.baseselect.clear(el);
    },

    setEnabled: function(el, bool) {
    	if(el.tagName.toLowerCase() == 'div') {
    		el = $(el).find('>select')[0];
    	}
		$.alopex.widget.baseselect.setEnabled(el, bool);
		if (bool) {
			$(el.parentNode).removeClass('af-disabled Disabled');
		} else {
			$(el.parentNode).addClass('af-disabled Disabled');
		}
    },

    _setText: function(wrapper, text) {
		text = text || '';
		$(wrapper).find('>span').text(text);
    }
  });

})(jQuery);