(function($) {

	/***************************************************************************
	 * autocomplete
	 **************************************************************************/
	$.alopex.widget.autocomplete = $.alopex.inherit($.alopex.widget.object, {
		widgetName : 'autocomplete',
		setters : ['autocomplete', 'setOptions', 'setEnabled', 'select', 'setCustomFilter'],
		getters : ['getSelectedData', 'clear'],
		properties: {
			textinput : null,
			dropdown : null,
			noresultstr : 'No Results',
			lastKeyword : "",
			url : null,
			method : "GET",
			datatype : "json",
			paramname : null,
			source : undefined,
			minlength : 0,
			fitwidth : true,
			maxheight : '',
			select : null,
			selectedDataDefault : undefined, 
			selected : undefined,
			maxresult : 100,
			resetbutton : false,
			customfilter : null,
			enterselectfirst : false
		},
		init : function(el, option) {
			$.extend(el, this.properties, option);
			if ( $(el).find('input').length === 0 ){
				$(el).append('<input class="Textinput">');
			}
			el.textinput = $(el).find('input').first().attr("class", "Textinput")[0];
			$a.convert(el.textinput);
			
			if ( $(el).is('[data-dynamic-dropdown]')){
				el.dropdown = null;
				el.dropdown = $.alopex.widget.autocomplete._makeDropdown(el);
			} else if ( $(el).find('ul').length === 0 ){
				$(el).append('<ul class="Dropdown"></ul>');
				el.dropdown = $(el).find('ul').first().attr("class", "Dropdown")[0];
			}
			$a.convert(el.dropdown);
			
			if (el.resetbutton) {
				$.alopex.widget.autocomplete._resetButtonHandler(el);
			}
			if (el.openbutton) {
				$.alopex.widget.autocomplete._openButtonHandler(el);
			}
			if (el.enterselectfirst){
				$(el.textinput).on("keydown.selectFirst", $.alopex.widget.autocomplete._selectFirstHandler);
			}
			if (el.fitwidth){
				$(el.dropdown).width($(el.textinput).outerWidth()-2*parseInt($(el.textinput).css('border-left-width'))) // border 1px * 2 을 제하여 주어야 함
			}
			
			$(el.dropdown).css('minWidth', $(el.textinput).outerWidth());
/*			el.fitwidth
				? $(el.dropdown).width($(el.textinput).outerWidth()-2*parseInt($(el.textinput).css('border-left-width'))) // border 1px * 2 을 제하여 주어야 함
				: $(el.dropdown).css('display', 'inline-block');*/
			$(el.dropdown).css('maxHeight', el.maxheight);
			$(el.dropdown).css('overflow-y','auto');

			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);
			$(el.dropdown).addHandler($.alopex.widget.autocomplete._selectHandler);
			
			if( $.alopex.util.isValid(el.source) ){
				el.source = JSON.parse(el.source)
				//$.alopex.widget.dropdown.setDataSource(el.dropdown, el.source);
				$.alopex.widget.autocomplete._filterSource(el, $(el.textinput).val());
			}
			this.setEnabled(el, el.enabled);
		},
		_resetButtonHandler : function(el){
			var browserName = $a.util.getBrowserName();
			if( (browserName.indexOf("Microsoft Internet Explorer 9") != -1 ) || (browserName.indexOf("Chrome") != -1)){
				var originWidth = $(el.textinput).outerWidth();
				$(el.textinput).css('padding-right', '30px');
				$(el.textinput).outerWidth(originWidth);
			}
			$(el.textinput).next().hasClass("Clear")
				? el.resetbuttonEl = $(el.textinput).next()
				: el.resetbuttonEl = $('<div class="Clear">x</div>').insertAfter(el.textinput);
			el.resetbuttonEl[0].element = el ;
			el.resetbuttonEl.on('click', function(e) {
				var target = e.currentTarget;
				var $el = $(target.element);
				if (!$el.is('.af-disabled Disabled')) {
					$.alopex.widget.autocomplete.clearInput(target.element.textinput);
					target.element.selected = undefined;
					e.preventDefault();
					e.stopPropagation();
				}
			});
		},
		
		_openButtonHandler : function(el){
			var browserName = $a.util.getBrowserName();
			if( (browserName.indexOf("Microsoft Internet Explorer 9") != -1 ) || (browserName.indexOf("Chrome") != -1)){
				// IE9, Chrome : clearButton 이 없는 브라우저 버전
				var originWidth = $(el.textinput).outerWidth();
				$(el.textinput).css('padding-right', '30px');
				$(el.textinput).outerWidth(originWidth);
			}
			if ( $(el).find(".Opener").length ) {
				el.openbuttonEl = $(el).find(".Opener");
			} else {
				el.openbuttonEl = $('<div class="Opener"></div>').insertAfter(el.textinput);
			}
			el.openbuttonEl[0].element = el ;
			el.openbuttonEl.off('click.opener', $.alopex.widget.autocomplete._openerHandler);
			el.openbuttonEl.on('click.opener', $.alopex.widget.autocomplete._openerHandler);
		},
		
		_openerHandler : function(e){
			var el = e.currentTarget.parentElement;
			// dynamic-dropdown 일 경우에는 click 이벤트를 통해 dropdown 생성하는 과정이 필요함
			if( !el.dropdown && $(el).is("[data-dynamic-dropdown]")){
				e.currentTarget = el.textinput;
				$(el.textinput).trigger("click.autocomplete");
				return;
			}
			$(el.dropdown).toggle();
		},
		_selectHandler : function(e){
			var el;
			var dropdown = $(e.currentTarget).parent(".Dropdown")[0];
			if ( $(dropdown).attr("data-base")){
				el = $($(dropdown).attr("data-base")).parent(".Autocomplete")[0];
			} else {
				el = e.currentTarget.parentElement.parentElement;
			}
			el.lastKeyword = e.currentTarget.innerText;
			el.selected = e.currentTarget.parentElement.userInputDataSource[$(dropdown).find("li").index(e.currentTarget)];
			// addHandler는 텍스트가 바뀌기 전에 수행되므로, 값을 미리 바꿔줌
			// select 함수 안에서 getSelectedData 호출 시, 값이 변경되지 않아 undefined 발생
			if( $(e.currentTarget).attr('data-role') != 'empty'){
				$(el.textinput).val(e.currentTarget.innerText);
			}
			
			if( typeof el.select === "function" ){
				el.select(e, el.selected);
			}
		},
		setOptions : function(el, data){
			$.extend(el, data);
			if( el.dropdown && $.alopex.util.isValid(data.source) ){
				$.alopex.widget.dropdown.setDataSource(el.dropdown, data.source);
			}
			if( data.enterselectfirst ){
				$(el.textinput).off("keydown.selectFirst");
				$(el.textinput).on("keydown.selectFirst", $.alopex.widget.autocomplete._selectFirstHandler);
			} else if ( data.enterselectfirst === false ){
				$(el.textinput).off("keydown.selectFirst");
			}
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);
		},
		_keyupHandler : function(e){

			// [20160503 kjb - e.keyCode 이용해서 키보드의 기능키 등 불필요한  키 입력에 대해서는 return 처리]

			var el = e.currentTarget;
			var text = $(el).val();
			var divEl = el.parentElement;
			var req = {};
			req.data = {};
			req.el = divEl;
						
			if( e.keyCode !== 13 && !divEl.dropdown && $(divEl).attr("data-dynamic-dropdown") ){
				divEl.dropdown = $.alopex.widget.autocomplete._makeDropdown(divEl);
			}
			
			// minLength 와 같거나 큰 길이의 입력에 대해서만 동작
			if( e.keyCode !== 13 && divEl.lastKeyword != text ){
				divEl.lastKeyword = text;
				if( divEl.minlength <= text.length ){
					// 데이터 가져오는 우선 순위를 url > source 로 정함
					if ( divEl.url ){
						req.url = divEl.url;
						divEl.paramname? req.data[divEl.paramname] = text : req.data = text;
						req.method = divEl.method;
						req.dataType = divEl.datatype;
						req.success = function(res){
							if( res.length > this.el.maxresult ){
								res.length = this.el.maxresult;
							}
							$.alopex.widget.dropdown.setDataSource(this.el.dropdown, res);
							$.alopex.widget.autocomplete._noResultHandler(this.el);
							$(this.el.dropdown).open();
						}
						$a.request(null, req);
					}else if( typeof divEl.source === "object" || typeof divEl.source == "string"){
						if ( typeof divEl.source === "string"){
							divEl.source = JSON.parse(divEl.source);
						}
						$.alopex.widget.autocomplete._filterSource(divEl, text);
						$(el.dropdown).open();
					}
				}else{
					$(el.dropdown).html('');
					$.alopex.widget.autocomplete._noResultHandler(divEl);
					$(el.dropdown).close();
				}
			}else if( e.keyCode !== 13 && divEl.lastKeyword == text ){
				$(el.dropdown).open();
			}else {
				return;
			}
		},
		
		_filterSource : function(el, text){
			
			var dd = el.dropdown;
			var result ; 
			if (el.customfilter && (typeof el.customfilter === "function")){
				result = el.customfilter(el, el.source, text);
			}else {
				result = $.alopex.widget.autocomplete._defaultFilter(el, el.source, text);
			}
			
			$.alopex.widget.dropdown.setDataSource(dd, result);
			$.alopex.widget.autocomplete._noResultHandler(el);
		},
		
		_generateReg : function(filter, text){
			
			
			if( $.alopex.util.isValid(filter)){
				var filterArr = filter.replace(/ /g,'').split("|");
				var regStr  = "";
				if( filterArr.indexOf("ignoreWhitespace") !== -1 ){
					text = text.replace(/ /g,'');
				}
				if( filterArr.indexOf("prefix") !== -1 || filterArr.indexOf("equal") !== -1 ){
					regStr += "^";
				}
				regStr += text ;
				if( filterArr.indexOf("suffix") !== -1 || filterArr.indexOf("equal") !== -1 ){
					regStr += "$";
				}
				var regExp;
				
				if( filterArr.indexOf("caseSensitive") !== -1 ){
					regExp = new RegExp(regStr);
				} else {
					regExp = new RegExp(regStr, "i");
				}
				return regExp;
			} else {
				return new RegExp(text, "i");
			}
			
		},
		
		
		_defaultFilter : function(el, source, text){
			
			var reg = $.alopex.widget.autocomplete._generateReg(el.filter, text);
			var result = [] ;
			
			if (text == ""){
				return el.source;
			}
						
			for ( var i = 0 ; i < source.length ; i++ ) {
				var item = source[i];
				if ( item.text !== undefined ){
					if ( reg.test(item.text) == false ){
						continue;
					}
				} else if ( typeof item === "string"){
					if ( reg.test(item) == false ){
						continue;
					}
				} else {
					continue;
				}
				result.push(item);
			}
			if( result.length > el.maxresult ){
				result.length = el.maxresult;
			}
			
			return result;
		},
		
		setCustomFilter : function(el, filter){
			if (typeof filter === "function"){
				el.customfilter = filter;
			} else if ( $.alopex.util.parseBoolean(filter) == false ){
				el.customfilter = null;
			}
		},
		
		setEnabled : function(el, flag) {
			$(el.textinput).setEnabled(flag);
			if( !el.dropdown ) return;
			$(el.dropdown).setEnabled(flag);
			if ( flag ) {
				$(el.textinput).off(el.dropdown.opentrigger, $.alopex.widget.dropdown._toggle);
				$(el.textinput).on(el.dropdown.opentrigger, $.alopex.widget.dropdown._toggle);
				if (el.openbuttonEl){
					$(el.openbuttonEl).off('click.opener', $.alopex.widget.autocomplete._openerHandler);
					$(el.openbuttonEl).on('click.opener', $.alopex.widget.autocomplete._openerHandler);
				}
			} else {
				$(el.textinput).off(el.dropdown.opentrigger, $.alopex.widget.dropdown._toggle);
				if (el.openbuttonEl){
					$(el.openbuttonEl).off('click.opener', $.alopex.widget.autocomplete._openerHandler);
				}
			}
		},
		
		_setDataSource : function(dd, data){
			switch (typeof data) {
			case 'string':
				$el.html(data);
				break;
			case 'object':
				$.alopex.widget.autocomplete._htmlGenerator(dd, data);
				break;
			default:
				break;
			}
			$(dd).refresh();
			// [20160503 kjb - 아래 주석 풀었음]
			dd.userInputDataSource = data;
		},
		_noResultHandler : function(el){
			if ( $(el.dropdown).find('li').length === 0 ){
				$(el.dropdown).append('<li class="af-disabled Disabled" data-role="empty">'+el.noresultstr+'</li>');
			}
		},
		_htmlGenerator: function(dd, data) {
			var item;

			$(dd).html('');

			for( var i = 0 ; i < data.length ; i++ ){
				item = document.createElement('li');
				if ( data[i].id !== undefined ) {
					item.id = data[i].id;
				}
				if ( data[i].text !== undefined ){
					item.innerText = data[i].text;
				} else if ( data[i].value !== undefined ){
					item.innerText = data[i].value;
				} else {
					item.innerText = data[i];
				}
				item.data = data[i];
				$(dd).append(item);
			}
		},
		getSelectedData : function(el){
			if( $.alopex.util.isValid(el.selected) && (el.selected.text === $(el.textinput).val()) ){
				return el.selected;
			} 
			return el.selectedDataDefault; 
		},
		clearInput : function(el) {
			$(el).val('');
		},
		select : function(el, index){
			$(el.dropdown).select(index);
		},
		
		_makeDropdown  : function(el){
			$(el.textinput).off("click");
			$(el.textinput).off("click.autocomplete");
			// 랜덤 아이디로 Textinput 과 Dropdown 연결(data-base)
			var baseId = 'Alopex_base_' + parseInt(Math.random()*10E3);
			el.textinput.id = baseId;
			var dropdown = $("<ul class='Dropdown' data-base='#"+baseId+"'><li></li></ul>").appendTo(document.body)[0];
			$a.convert(dropdown);
			el.dropdown = dropdown;
			$(dropdown).addHandler($.alopex.widget.autocomplete._selectHandler);
			// 동적으로 생성한 Dropdown 은 삭제되어야 하므로, 드롭다운의 close 핸들러 처리 
			$(dropdown).on("close.dropdown", $.alopex.widget.autocomplete._removeDropdown);
			
			// Dropdown CSS init
			$(el.dropdown).css('minWidth', $(el.textinput).outerWidth());
			el.fitwidth
				? $(el.dropdown).width($(el.textinput).outerWidth()-2*parseInt($(el.textinput).css('border-left-width'))) // border 1px * 2 을 제하여 주어야 함
				: $(el.dropdown).css('display', 'inline-block');
			$(el.dropdown).css('maxHeight', el.maxheight);
			$(el.dropdown).css('overflow-y','auto');
			
			return dropdown;
		},
		
		_removeDropdown : function(e){
			var el = e.currentTarget;
			$(el.base).removeAttr("data-base");
			// Dropdown 삭제 후에는 Textinput 클릭 시 오픈할 대상이 없어지므로
			// 삭제 시 임시 핸들러를 붙여준다. 
			$(el.base).off('keydown', $.alopex.widget.dropdown._inputBaseKeyDownHandler);
			$(el.base).on("click.autocomplete", function(e){
				var el = e.currentTarget.parentElement;
				var dropdown = $.alopex.widget.autocomplete._makeDropdown(el);
				el.dropdown = dropdown;
				$.alopex.widget.autocomplete._filterSource(el, $(el).find("input").val());
				$(dropdown).open();
			});
			$(el).remove();
			el.base.parentElement.dropdown = null;
		},
		
		_selectFirstHandler : function(e){
			var el = e.currentTarget.parentElement;
			
			if( e.keyCode === 13 && $(el.dropdown).find("li.Focused").length === 0 ){
				$(el).select(0);
			} 
			return true;
		}
		
 	});
})(jQuery);
