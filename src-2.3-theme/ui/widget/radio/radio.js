(function($) {
	/***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * radio
	 **********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	$.alopex.widget.radio = $.alopex.inherit($.alopex.widget.object, {
		widgetName : 'radio',
		defaultClassName : 'af-radio Radio',
		defaultTextClassName : 'af-radio-text',
		defaultWrapClassName : 'af-wrapradio',
		defaultWrapSpanClassName : 'af-wrapradio-span',
		setters : [ 'radio', 'setSelected' ],
		getters : [ 'getValue', 'getText' ],

		properties : {
			wrap : false
		},

		init : function(el, options) {
			var $el = $(el);
			el.options = $.extend(true, {}, this.properties, options);
			//IE8에서 input type변경 불가.
			try {
				$el.attr('type', 'radio');
			} catch(e) {
			}
			
			if (el.options.wrap || $.alopex.util.parseBoolean(el.alopexoptions.wrap)) {
				// $el.attr('data-type', 'wrapradio').wrapradio();
				if (el.className) {
					if (el.className.indexOf(this.defaultClassName) !== -1) {
						$el.addClass(this.defaultWrapClassName);
					}
					$el.after('<span class="' + el.className + '-span"></span>');
				} else {
					$el.after('<span class="' + this.defaultWrapSpanClassName + '"></span>');
				}
			}
			
//			Galaxy S6 Edge (SM-G925, Android 5.1.1) 디폴트 브라우저에서 ImageRadio 버튼 클릭하여도 change 이벤트 trigger되지 않는 버그 발생. 추가적으로 click 이벤트일 때에도 change를 trigger 해주자
//			S6 Edge 5.0.2 SamsungBrowser/3.0 정상
//			Note 4 5.1.1 SamsungBrowser/2.1 정상
//			Note 5 5.1.1 SamsungBrowser/3.4 정상
//			S6 Edge 5.1.1 SamsungBrowser/3.2 문제 발생
			var userInfo = navigator.userAgent;
			if(userInfo.indexOf("SamsungBrowser/3.2") != -1){
				$el.on('click', function(e){
					$(this).trigger('change');
				});
			}
			
			$el.on('change', function(e){
				var $parent = $(e.currentTarget).parent('label');
				var currName = $(e.currentTarget).attr('name');
				$(document.body).find('input[name=' + currName+ ']').parent('label.' + $.alopex.widget.radio.defaultTextClassName).removeClass('Checked');
		    	
				$parent.addClass('Checked');
			});
			
			if(el.checked || el.getAttribute('checked') == 'checked') {
				$(el).trigger('change');
			}
		},

		style : function(el) {
			var $labels = $('label[for="' + el.id + '"]');
			if (el.id){
				var $labels = $('label[for="' + el.id + '"]');
				if( $labels.length ){
					$labels.addClass(this.defaultTextClassName);
					return;
				} 
			}
			$(el).parent('label').addClass(this.defaultTextClassName);
		},

		setSelected : function(el) {
			if (el.tagName === 'INPUT') {
				el.checked = true;
			}
			$(el).parent('label').addClass('Checked');
			$(el).trigger('change');
		},

		getValue : function(el) {
			var radioList = $('input[name=' + el.name + ']:checked');
			if (radioList.length > 0) {
				return $(radioList[0]).val();
			}
			return null;
		},

		getText : function(el) {
			var radioList = $('input[name=' + el.name + ']:checked');
			if (radioList.length > 0) {
				var obj = radioList[0];
				var elId = $(obj).attr('id');
				var $label = $(el).parent().find('label[for="' + elId + '"]');
				if ($label.length == 0) {
					$label = $(el).parent('label');
				}
				return $label.text();
			}
			return null;
		}
	});

})(jQuery);