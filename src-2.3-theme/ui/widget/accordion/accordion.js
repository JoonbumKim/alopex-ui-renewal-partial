// TODO : animation, trigger-to-open event, collapse other content when one open. 

(function($) {

	$.alopex.widget.accordion = $.alopex.inherit($.alopex.widget.object, {

		widgetName: 'accordion',
		defaultClassName: 'af-accordion Accordion',

		setters: ['accordion', 'expandAll', 'collapseAll', 'setDataSource', 'expand', 'collapse', 'expandByMenuId', 'collapseByMenuId'],
		getters: [],

		eventHandlers: {
//			cancel: {
//				event: 'dragstart selectstart',
//				handler: '_cancelEventHandler'
//			}
		},

		init: function(el, options) {
			var $el = $(el);
			var that = this;
			$.extend(el, this.options, options); 
			$el.find('li').each(function() {
				var li = this;
				for ( var i = 0; i < li.children.length; i++) {
					if (li.children[i].tagName.toLowerCase() === 'a' && li.children.length > 1) {
						$(li).addClass('af-expandable Expandable');
						break;
					}
				}
			});
			$el.find('li > a').each(function() {
				that.addHoverHighlight(this);
				that.addPressHighlight(this);
				$(this).next().addClass('af-accordion-sub');
			});

			// 최초 상태는 not Expended,  display:none 으로 해준다
			$el.find('.af-accordion-sub').each(function() { // ul
				$(this).css("display", "none");
				var $li = $(this).parent("li.af-expandable.Expandable");
				$li.removeClass('af-accordion-expand Expanded');
			});
			
			// 어코디언 클릭 이벤트 핸들러 바인딩
			$el.find('li > a').bind('click', function(e) {
				var $a = $(e.target); // a
				var $enpandable = $a.next(".af-accordion-sub");
				var $li = $a.parent("li.af-expandable.Expandable");
				
				if ($li.is('li.af-expandable.Expandable')) { // li 가 펼침가능 클래스를 가지면
					$li.toggleClass('af-accordion-expand Expanded'); // 펼쳐짐 클래스 토글
					if ($li.hasClass('af-accordion-expand Expanded')) { // 토글 후 펼쳐짐 클래스 추가된 경우	
						$enpandable.css('display', ''); // >> block
						$el.trigger('open', [$a[0]]);
					} else { // 토글 후 펼쳐짐 클래스 제거된 경우
						$enpandable.css('display', 'none'); // >> none
						$el.trigger('close', [$a[0]]);
					}
				}
			});
		},
		
		_changeStatus: function(el, enpandable, doExpand){ // target == ul
			var $el = $(el);
			var $enpandable = $(enpandable);
			var $a = $enpandable.prev("a");
			var $li = $a.parent("li.af-expandable.Expandable");

			if(doExpand){ // true이면 펼치기
				while( $enpandable.length ){
					$enpandable.css('display', ''); // >> block
					$li.addClass('af-accordion-expand Expanded');
					// 상위 Expandable에 대해서 모두 펼치기
					$li = $enpandable.parent("li.af-expandable.Expandable");
					$enpandable = $li.parent("ul.af-accordion-sub");
				}
				$li.addClass('af-accordion-expand Expanded');
				$el.trigger('open', [$a[0]]);
			}else{ // false이면 닫기
				$enpandable.css('display', 'none'); // >> none
				$el.trigger('close', [$a[0]]);
				$li.removeClass('af-accordion-expand Expanded');
				// 하위 Expanded에 대해서 모두 닫기
				$enpandable.find("li.af-expandable.Expandable").removeClass('af-accordion-expand Expanded');
				$enpandable.find("ul.af-accordion-sub").css('display', 'none');
			}
		},
		
		expand: function(el, index) { // index는 ul.af-accordion-sub 마크업 순서 (위에서부터 0 1 2 3)
			$(el).find('.af-accordion-sub').eq(index).each(function() {
				var target = this; // ul
				$.alopex.widget.accordion._changeStatus(el, target, true);
			});
		},
		
		expandAll: function(el) {
			$(el).find('.af-accordion-sub').each(function() {
				var target = this;
				$.alopex.widget.accordion._changeStatus(el, target, true);
			});
		},
		
		collapse: function(el, index) {
			$(el).find('.af-accordion-sub').eq(index).each(function() {
				var target = this;
				$.alopex.widget.accordion._changeStatus(el, target, false);
			});
		},
		
		collapseAll: function(el) {
			$(el).find('.af-accordion-sub').each(function() {
				var target = this;
				$.alopex.widget.accordion._changeStatus(el, target, false);
			});
		},

		setDataSource: function(el, jsonArray) {
			$(el).empty();
			this._createNode(el, jsonArray);
			el.phase = undefined;
			$(el).accordion();
		},

		expandByMenuId : function(el, menuid){
			var $target = $(el).find("[data-menuid="+menuid+"]");

			if ( $target.children(".af-accordion-sub").length ) {
				$.alopex.widget.accordion._changeStatus(el, $target.children(".af-accordion-sub"), true);
			} else if ( $target.parent(".af-accordion-sub").length ){
				$.alopex.widget.accordion._changeStatus(el, $target.parent(".af-accordion-sub"), true);
			}
		},

		collapseByMenuId : function(el, menuid){
			var $target = $(el).find("[data-menuid="+menuid+"]");
			if ( $target.children(".af-accordion-sub").length ) {
				$.alopex.widget.accordion._changeStatus(el, $target.children(".af-accordion-sub"), false);
			}
		},
		_createNode: function(el, jsonArray) {
			for ( var i = 0; i < jsonArray.length; i++) {
				var item = jsonArray[i];
				var li = $('<li></li>').appendTo(el)[0];
				if ($.alopex.util.isValid(item.id)) {
					$(li).attr('data-id', item.id);
				}
				var a = $('<a></a>').appendTo(li)[0];
				if ($.alopex.util.isValid(item.linkUrl)) {
					$(a).attr('href', item.linkUrl);
				}
				if ($.alopex.util.isValid(item.iconUrl)) {
					$('<img/>').attr('src', item.iconUrl).appendTo(li);
				}
				//        $('<span></span>').html(item.text).appendTo(a);
				$(a).text(item.text);

				if ($.alopex.util.isValid(item.items)) {
					var subul = $('<ul></ul>').appendTo(li)[0];
					this._createNode(subul, item.items);
				}
			}
		}
		
	});

})(jQuery);

// constructor : markup, style, init, event, defer: timing issue에 사용.
 