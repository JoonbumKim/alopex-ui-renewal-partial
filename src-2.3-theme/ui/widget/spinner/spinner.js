(function($) {

	$.alopex.widget.spinner = $.alopex.inherit($.alopex.widget.baseinput, {
		widgetName: 'spinner',
		defaultClassName: 'af-spinner Spinner',
		setters: ['spinner', 'setEnabled'],
		getters: [],
		
		properties: {
			min: 'default',
			max: 'default',
			step: 1,
			// Time 에 대한 default option 값 
			hours : '12H',
			locale : 'ko',
			ampm_en : ['AM', 'PM'],
			ampm_ko : ['오전', '오후']
		},

		init: function(el, options) {
			var $wrapper, $up, $down, $el = $(el);
			if(el.tagName.toLowerCase() == 'div') {
				$wrapper = $el;
				$up = $(el).find('.Up');
				$down = $(el).find('.Down');
				el = el.querySelector('input');
			} else {
				$el.wrap('<div class="' + el.className + ' af-spinner-wrapper"></div>');
				$wrapper = $(el.parentNode);
				$wrapper.append('<a class="af-spinner-button-up"></a>');
				$wrapper.append('<a class="af-spinner-button-down"></a>');
				$up = $el.siblings('.af-spinner-button-up');
				$down = $el.siblings('.af-spinner-button-down'); 
			}

			$el = $(el);
			el.type = 'text'; // type="number" create browser default clear button
			$.extend(el, $.alopex.widget.spinner.properties, options);;
			
			if ( $wrapper.hasClass("Time") ){
				$up.on('click', $.alopex.widget.spinner._timeUpHandler);
				$down.on('click', $.alopex.widget.spinner._timeDownHandler);
				var $inputs = $wrapper.find('input');
				$inputs.on('keydown', $.alopex.widget.spinner._timeKeydownHandler);
				$inputs.on('blur', $.alopex.widget.spinner._timeBlurHandler);
				$inputs.on('change', $.alopex.widget.spinner._timeChangeHandler);
				
				var div = el.parentElement;	
				var hh, mm, ampm;
				hh = div.querySelector('[data-hour]');
				if ( hh ){
					hh.value = '00';
					hh.maxLength = 2; 
					if ( el.hours == '24H'){ // (default) 12H | 24H
						hh.max = 23; 
						hh.min = 0 ;
					} else {
						hh.max = 12; 
						hh.min = 1 ;
						$(div).attr('data-hours', '12H');
					}
					hh.step = 1; 
					hh.offset = 0 ;
				}
				
				mm = div.querySelector('[data-minute]');
				if ( mm ){
					mm.type = 'text';
					mm.value = '00';
					mm.max = 59; 
					mm.min = 0 ;
					mm.maxLength = 2; 
					mm.step = 1; 
					mm.offset = 0 ;
				}
				
				ampm = div.querySelector('[data-ampm]');
				if( ampm ){
					ampm.maxLength = 2; 
					ampm.type = 'text';
					if ( el.locale.toLowerCase() === 'ko'){
						ampm.am = el.ampm_ko[0];
						ampm.pm = el.ampm_ko[1];
					} else {
						ampm.am = el.ampm_en[0];
						ampm.pm = el.ampm_en[1];
					}
					ampm.value = ampm.am;
				}
			} else {
				$up.on('click', $.alopex.widget.spinner._upHandler);
				$down.on('click', $.alopex.widget.spinner._downHandler);
				$el.on('keydown', $.alopex.widget.spinner._keydownHandler);
//				$el.on('keyup', $.alopex.widget.spinner._keyupHandler)
				
				$up.data('element', el);
				$down.data('element', el);
				
				if(el.max != 'default') {
					el.max = parseFloat(el.max);
					if(el.value && el.value>el.max) {
						el.value = el.max;
					}
				}
				if(el.min != 'default') {
					el.min = parseFloat(el.min);
					if(el.value && el.value<el.min) {
						el.value = el.min;
					}
				}
			}		
			// 테마 작업 시 css를 수정했는데, 아래의 인라인 설정 때문에 적용이 안되고 있음
			// spinner - 아래의 인라인 설정은 alopex-ui.css 에서 처리하고 있기 때문에 동적으로 다시 처리 할 필요 없음. 주석처리
//			$wrapper.css({
//				position: 'relative',
//				display: 'inline-block'
//			});
//			
//			
//			$up.add($down).css({
//				position:'absolute',
//				display:'block',
//				height:'50%',
//				width:'15px',
//				right:'0'
//			});
//			$up.css({
//				top:'0'
//			});
//			$down.css({
//				bottom:'0'
//			});
			
			
		},
		
		
		_upHandler: function(e){
			var el = $(e.currentTarget).data('element');
			$.alopex.widget.spinner.valueUp(el);
		},
		
		
		_downHandler: function(e) {
			var el = $(e.currentTarget).data('element');
			$.alopex.widget.spinner.valueDown(el);
		},
		
		_keydownHandler: function(e){
			var el = e.currentTarget;
			var $wrapper = $(el).closest('.af-spinner-wrapper');
			if($wrapper.hasClass('af-disabled Disabled')) return;
			if(e.which === 38) { // up
				$.alopex.widget.spinner.valueUp(el);
			} else if(e.which === 40) { // down
				$.alopex.widget.spinner.valueDown(el);
//			} else if(e.which >= 48 && e.which <= 57){ // other key
//				el.prevValue = $(el).val();
//				$(el).off('keydown', $.alopex.widget.spinner._keydownHandler);
//			} else if(e.shiftKey == false){
			}
		},
		
		
		/**
		 * _timeBlurHandler 
		 * Time 의 Input 선택 후, up/down 클릭 시 선택한 인풋에 대한 처리를 하기 위해
		 * blur 되는 시점에 lastFocused 에 input을 저장
		 */
		_timeBlurHandler : function(e){
			var input = e.currentTarget;
			var el = input.parentElement;
			el._lastFocused = input;
		},
		/**
		 * _timeChangeHandler
		 * Time 이 변경 후  유효성 판단 ? 혹은 AMPM 설정 
		 */
		_timeChangeHandler : function(e){
			var input = e.currentTarget;
			var value = input.value;
			if ( ( input.hasAttribute('data-hour') || input.hasAttribute('data-minute') ) && (value.length == 1) ){
				input.value = '0' + value;
			}			
			if (  input.hasAttribute('data-hour') && input.max == 23){
				var ampm = input.parentElement.querySelector('[data-ampm]');
				if( ampm && value >= 12 ) {
					$(ampm).val(ampm.pm);
				} else if ( ampm ){
					$(ampm).val(ampm.am);
				}
			} else if ( input.hasAttribute('data-ampm') ){
				var hour = input.parentElement.querySelector('[data-hour]').value;
				if( hour >= 12 ) {
					$(input).val(input.pm);
				} else {
					$(input).val(input.am);
				}
			}
			// 두 글자 씩 입력받은 후에는 다음 input으로 이동
			
		},
		/**
		 * _timeUpHandler
		 * Time에서 up 버튼을 눌렀을 때
		 */
		_timeUpHandler: function(e){
			var el = e.currentTarget.parentElement;
			if ( el._lastFocused ){
				el = el._lastFocused;
			} else {
				el = el.querySelector('input');
			}
			if( el.hasAttribute('data-hour')){
				$.alopex.widget.spinner.valueUp(el);
			} else if (  el.hasAttribute('data-minute') ){
				$.alopex.widget.spinner.valueUp(el);
			} else if (  el.hasAttribute('data-ampm')){
				$(el).val(el.am);
			}
			$(el).trigger('change');
			$(el).focus();
		},
		/**
		 * _timeUpHandler
		 * Time에서 down 버튼을 눌렀을 때
		 */
		_timeDownHandler: function(e) {
			var el = e.currentTarget.parentElement;
			if ( el._lastFocused ){
				el = el._lastFocused;
			} else {
				el = el.querySelector('input');
			}
			if(  el.hasAttribute('data-hour')){
				$.alopex.widget.spinner.valueDown(el);
			} else if ( el.hasAttribute('data-minute') ){
				$.alopex.widget.spinner.valueDown(el);
			} else if (  el.hasAttribute('data-ampm')){
				$(el).val(el.pm);
			}
			$(el).trigger('change');
			$(el).focus();
		},
		/**
		 * _timeKeydownHandler
		 */
		_timeKeydownHandler: function(e){
			var el = e.currentTarget;
			var $el = $(el);
			var $wrapper = $el.closest('.af-spinner-wrapper');
			if($wrapper.hasClass('af-disabled Disabled')) return;

			if(e.which === 38) { // up
				if (  el.hasAttribute('data-ampm')){
					$el.val(el.am);
				} else {
					$.alopex.widget.spinner.valueUp(el);
				}
			} else if(e.which === 40) { // down
				if (  el.hasAttribute('data-ampm') ){
					$el.val(el.pm);
				} else {
					$.alopex.widget.spinner.valueDown(el);
				}
			} else if (e.which === 37){ // left
				$el.prevAll('input:first').focus();
			} else if (e.which === 39){ // right
				$el.nextAll('input:first').focus();
			} else if ( el.hasAttribute('data-hour') || el.hasAttribute('data-minute') ){
				if( e.which >= 48 && e.which <= 57 ) { // other key
					$.alopex.widget.spinner._inputKeyHandler(el, e.which);
				} else if (e.which >= 96 && e.which <= 105 ){
					$.alopex.widget.spinner._inputKeyHandler(el, e.which-48);
				} else {
					el.offset = 0; 
					el.value = '00';
				}
			} 

		},
		
		
		_inputKeyHandler : function(el, keyCode){
			if ( el.offset == 0 ){
				el.value = '0' + String.fromCharCode(keyCode);
				el.offset++;
			} else if ( el.offset == 1 ){
				el.prevValue = el.value;
				// [#3211] prevValue 값이 없는 경우 
				if ( typeof el.prevValue[1] === "undefined" ){
					el.prevValue = '00';
				}
				var num = parseFloat ( el.prevValue[1]+ String.fromCharCode(keyCode) );
				var $nextInput = $(el).nextAll('input:first').focus();
				if ( num > el.max ) {
					if ($nextInput.is('[data-hour]') || $nextInput.is('[data-minute]')){
						$nextInput.val('0'+String.fromCharCode(keyCode));
					} 
				} else {
					el.value = el.prevValue[1]+ String.fromCharCode(keyCode);
				}
				el.offset = 0 ;
			} 
			$(el).trigger('change');
		},
		
//		_keyupHandler: function(e){
//			var el = e.currentTarget;
//			if(e.which >= 48 && e.which <= 57){ // other key
//				var newval = $(el).val();
//				if(newval < parseFloat(el.min) || newval > parseFloat(el.max)) {
//					$(el).val(el.prevValue);
//				}
//				$(el).on('keydown', $.alopex.widget.spinner._keydownHandler);
//				
//			}
//		},
		
		valueUp: function(el) {
			if(el.tagName.toLowerCase() == 'div') {
				el = el.querySelector('input');
			}
			var value = parseFloat(el.value);
			var max = 0;
			var min = 0;
			if(!isNaN(value)) { // valid number
				var split = el.value.split('.');
				var result = 0;
				
				if(el.max != 'default') {
					max = parseFloat(el.max);
				}
				if(el.min != 'default') {
					min = parseFloat(el.min);
				}
				if(max && value > max) { // typed-in value is greater than data-max value
					result = max;
				} else if(min && value < min) {
					result = min;
				} else {
					result = $.alopex.util.addFloat(el.value, el.step);
				}
				if(el.max == 'default' || result <= parseFloat(el.max)) {
					el.value = result;
				}
				$(el).trigger('change');
			}
		},
		
		valueDown: function(el) {
			if(el.tagName.toLowerCase() == 'div') {
				el = el.querySelector('input');
			}
			var value = parseFloat(el.value);
			var max = 0;
			var min = 0;
			if(!isNaN(value)) { // valid number
				var split = el.value.split('.');
				var result = 0;
				
				if(el.max != 'default') {
					max = parseFloat(el.max);
				}
				if(el.min != 'default') {
					min = parseFloat(el.min);
				}
				if(max && value > max) { // typed-in value is greater than data-max value
					result = max;
				} else if(min && value < min) {
					result = min;
				} else {
					result = $.alopex.util.addFloat(el.value, el.step*-1);
				}
				if(el.min == 'default' || result >= parseFloat(el.min)) {
					el.value = result;
				}
				$(el).trigger('change');
			}
		},
		
		setEnabled: function(el, flag) {
		    var $up;
			var $down;
			
			if(el.tagName.toLowerCase() == 'div') {
			    el = el.querySelector('input');
			    $up = $(el).siblings('.Up');
			    $down = $(el).siblings('.Down');
			}else{
			    $up = $(el).siblings('.af-spinner-button-up');
			    $down = $(el).siblings('.af-spinner-button-down');
			}
			var $el = $(el);
			var $wrapper = $el.closest('.af-spinner-wrapper');
			
			if($(el.parentElement).hasClass("Time")){
				$up.off('click', $.alopex.widget.spinner._timeUpHandler);
				$down.off('click', $.alopex.widget.spinner._timeDownHandler);
			} else{
				$up.off('click', $.alopex.widget.spinner._upHandler);
				$down.off('click', $.alopex.widget.spinner._downHandler);
			}
			
			if(flag) {
				if($(el.parentElement).hasClass("Time")){
					$up.on('click', $.alopex.widget.spinner._timeUpHandler);
					$down.on('click', $.alopex.widget.spinner._timeDownHandler);
				} else{
					$up.on('click', $.alopex.widget.spinner._upHandler);
					$down.on('click', $.alopex.widget.spinner._downHandler);
				}
				$el.removeAttr('readonly');
				$el.removeAttr('Disabled');
				$el.removeClass('af-disabled Disabled');
				$wrapper.removeClass('af-disabled Disabled');
				$up.removeClass('af-disabled Disabled');
				$down.removeClass('af-disabled Disabled');
			} else {
				$el.attr('readonly', true);
				$el.attr('Disabled','Disabled');
				$up.off('click');
				$down.off('click');
				$el.addClass('af-disabled Disabled');
				$up.addClass('af-disabled Disabled');
				$down.addClass('af-disabled Disabled');
				$wrapper.addClass('af-disabled Disabled');
			}
		}
		
	});
})(jQuery);


