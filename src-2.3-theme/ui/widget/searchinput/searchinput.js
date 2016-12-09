(function($) {

  /*********************************************************************************************************
   * search input
   *********************************************************************************************************/
  $.alopex.widget.searchinput = $.alopex.inherit($.alopex.widget.object, {
    widgetName: 'searchinput',
    defaultClassName: 'af-searchinput',
    defaultClearClassName: 'af-clear-button',
    setters: ['searchinput'],
    
    /**
     * markup은 ui 컴퍼넌트가 
     */
    markup: function() {
      return '<div>' +
              '<span af-dynamic class="af-icon af-default search"></span>' +
              '<input class="af-textinput af-default" />' +
              '<span af-dynamic class="af-icon af-default remove-sign"></span>' +
            '</div>';
    },
    
    properties: {
      clear: null
    },
    
    eventHandlers: {
      keydown: {event: 'keyup', handler: '_keyupHandler'},
      change: {event: 'change', handler: '_changeHandler'},
      clearclick: {event: 'click', selector: '[data-clear]', handler: '_clear'}
    },
    
    _clear: function(e) {
      
    },
    
    
    style: function(el) {
      /**
       * 하위 노드부터 스타일을 변경되어야 하는데, 이부분에서 막힘.
       * 아이콘들은 현재 알로펙스로 변경되지 않은 상태.
       * 
       */
    }
  });

})(jQuery);