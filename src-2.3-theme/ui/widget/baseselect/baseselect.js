(function($) {

	/*********************************************************************************************************
	 * select
	 *********************************************************************************************************/
	$.alopex.widget.baseselect = $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'baseselect',
		defaultClassName: 'af-baseselect',
		getters: ['getValues', 'getTexts'],
		setters: ['baseselect', 'setPlaceholder', 'setSelected', 'clear', 'refresh', 'selectionInitialization'],

		init: function(el, option) {
			var placeholder = this._getProperty(el, 'placeholder');
			if(placeholder) {
				this.setPlaceholder(el, placeholder);
			}
		},
		
		setPlaceholder: function(el, text) {
			var $el = $(el);
			if($el.find('[data-placeholder]').length == 0) {
				$el.prepend('<option value="" selected="selected" data-placeholder="true" disabled>' + text + '</option>');
				$el[0].options[0].selected = true;
				if(el.divSelect){ // select.Divselect 방식이면
					$(el.divSelect).refresh();
//					$el.trigger("change");
				}
			}
		},
		
		selectionInitialization: function(el) {
			var $el = $(el);
				if($el[0].options != undefined){
					if($el[0].options[0].disabled && $el[0].options[0].getAttribute("data-placeholder") == "true"){
						$el[0].options[0].disabled = false; // 잠시 false 로 하고, 강제 선택할 수 있게 한 후, 선택되면 다시 disabled 해준다
					}
					$el[0].options[0].selected = true;
					$el[0].options[0].disabled = true;
				}
		},
		
		setSelected: function(el, text) {
			// check null
			if (el.children.length === 0) {
				return;
			}
			var flag = true, i;
			for (i = 0; i < el.children.length; i++) {
				if (el.children[i].text === text) {
					$(el.children[i]).prop('selected', true);
					flag = false;
				}
			}
			if (flag) {
				for (i = 0; i < el.children.length; i++) {
					if (el.children[i].value === text) {
						$(el.children[i]).prop('selected', true);
						//el.textfield.innerHTML = el.children[i].text;
					}
				}
			}
			$(el).trigger('change');
		},

		getValues: function(el) {
			var tmpValuesArr = [];
			if (el.multi) {
				$(el).find('option:selected').each(function() {
					tmpValuesArr.push($(this).val());
				});
				return tmpValuesArr;
			} else {
				var result = [];
				$(el).find('option:selected').each(function() {
					result.push(this.value);
				});
				return result;
			}
		},

		getTexts: function(el) {
			var tmpTextsArr = [];
			if (el.multi) {
				$(el).find('option:selected').each(function() {
					tmpTextsArr.push($(this).text());
				});
				return tmpTextsArr;
			} else {
				var result = [];
				$(el).find('option:selected').each(function() {
					result.push($(this).text());
				});
				return result;
			}
		},
		
		clear: function(el) {
			var $el = $(el); 
			$el.empty();
			//data-placeholder
			var parent = el.parentNode;
			var placeholder = null;
			if ( $.alopex.util.isValid(el.getAttribute('data-placeholder')) ) {  // select 테그에 data-placeholder 있는 경우
				placeholder = el.getAttribute('data-placeholder');
			}else if( parent && parent.tagName === 'DIV'
					&& parent.getAttribute('data-type') === 'divselect'
					&& $.alopex.util.isValid(parent.getAttribute('data-placeholder')) ){
				placeholder = parent.getAttribute('data-placeholder');
			}
			if(placeholder){
				$el.prepend('<option value="" selected="selected" disabled>' + placeholder + '</option>');
				$el[0].options[0].selected = true;
				el.originWidth = $el.width();
			}
			this.refresh(el);
		},

		refresh: function(el) { 
			var $el = $(el);

			// el.alopexoptions.wrap -> undefined로 인한 error 발생. isDivselect 추가. Divselect일 경우는 isDivselect로 판단
			var isDivselect = false;
			if($(el.parentNode) && $(el.parentNode).attr('data-type') == 'divselect' || el.divSelect){
				isDivselect = true;
			}
			if (isDivselect || $.alopex.util.parseBoolean(el.alopexoptions.wrap)) {
				var text = $el.find(':selected').text() || '';
				$.alopex.widget.divselect._setText(el.parentNode, text);
			}
		}
	});

})(jQuery);