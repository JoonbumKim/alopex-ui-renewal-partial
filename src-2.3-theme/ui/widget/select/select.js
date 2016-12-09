(function($) {
  $.alopex.widget.select = $.alopex.inherit($.alopex.widget.baseselect, {
    widgetName: 'select',
    defaultClassName: 'af-select Select',
    getters: ['getValues', 'getTexts'],
    setters: ['select', 'setPlaceholder', 'setSelected', 'clear', 'refresh', 'setSelectSize'],

    properties: {
      wrap : false
    },

    init: function(el, options) {
      var $el = $(el);
      el.alopexoptions = $.extend(true, {}, this.properties, options);

      if (el.alopexoptions.wrap || $.alopex.util.parseBoolean(el.alopexoptions.wrap)) {
        $el.attr('data-type', 'divselect').divselect();
      }
      if ($el.attr('data-select-multiple') == 'true') {
        $el.attr('multiple', 'multiple');
        defaultStyleClass = 'af-multiselect';
        $el.bind('selectstart click', function(e) {
          return false;
        });
      }
      
      // size="4" 와 같이 attr 추가해준다
      if (el.alopexoptions.selectsize) {
    	  this.setSelectSize(el);
      }
      
    },
    
    
    // setters 에 넣은 경우,
    // 내부에서는 this.setSelectSize(el); 형태로 call
    // 외부에서는 $(selector).setSelectSize(size); 형태로 call 해도 첫번째 인자에 el 자동으로 들어감
    setSelectSize: function(el, size){
      var _size = null;
      var userSize = size;
      var alopexoptionsSize = el.alopexoptions.selectsize;
      
      if($.alopex.util.isPlusInt(userSize)){
    	  _size = size;
      }else if($.alopex.util.isPlusInt(alopexoptionsSize)){
    	  _size = alopexoptionsSize;
      }
  	  
      if(_size != null){
    	  el.setAttribute("size", _size);
    	  el.setAttribute("data-select-size", _size + "");
      }
    }
    
    
  });
})(jQuery);