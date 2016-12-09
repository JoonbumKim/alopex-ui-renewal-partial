(function($) {

	$.alopex.widget.dateinput = $.alopex.inherit($.alopex.widget.object, {
		widgetName : 'dateinput',
		defaultClassName : 'af-dateinput Dateinput',
		classNames: {
			clearButton: 'Clear',
			calendar: 'Calendar'
		},
		setters : [ 'dateinput', 'setEnabled', 'update', 'clear' ],
		getters : [],

		properties : {
			date : new Date(),
			format : 'yyyy-MM-dd',
			image : false,
			selectyear : false,
			selectmonth : false,
			pickertype : 'daily',
			position : 'bottom|left',
			mindate : null,
			maxdate : null,
			callback : null,
			resetbutton : false,
			blurcallback : null,
			certaindatestxt : {
				unavailabletxt : ''
			},
			placeholder : true,
			weekday : false,
			locale : 'ko'
		},
		//[2016-11-31] 
		_validationDate : function(el, value){
			//[2016-11-28] 수정 START
			//[2016-11-28] 패턴에 맞지 않는 날짜가 임의의 날짜로 생성되는 오류 수정 EX> MM/dd/yyyy : 16/10/11 = 11/16/2010
			//[2016-11-28] 날짜의 포멧을 format에 맞춰서 pattern check를 먼저 처리 함.[https://nexcore.skcc.com/support/issues/3346] 
			var format = el.options.format.replace(/[^a-z]/gi, '');	//패턴의 특수기호를 삭제

			//사용자가 날짜의 format 문자를 대소문자를 구별할 수 없게 입력하는 경우에 대비해 전부 소문자로 치환.
			//format이 다음과 같은 mmddyyyy 나 yyyymmdd 인 경우에 체크해서 처리 함.
			if(format.toLowerCase() == "mmddyyyy" || format.toLowerCase() == "yyyymmdd"){
				// 디폴트 yyyymmdd
				var regexTxt = /^(1|2|3|4|5|6|7|8|9)\d{3}(0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])$/; //format에 따른 정규식
				if(format.toLowerCase() == "mmddyyyy"){
					regexTxt = /^(0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(1|2|3|4|5|6|7|8|9)\d{3}$/;
				}
				value = value.replace(/[^\d]+/g, '');	//입력한 날짜의 특수기호를 삭제
				if(new RegExp(regexTxt).test(value)){
					return value;
				}else{
					return "";
				}
			}else{
				return value;
			}
			//[2016-11-28] 수정 END
		},
		
		generateDate : function(el, value){
			
			var format = el.options.format;
			var date, year, month, day;
			format = format.replace(' ', '').replace('EEEE', '').replace('EEE', '');			
			if( format.indexOf('MMM') >= 0 ){
				return new Date(value);
			}else {
				value = value.replace(' ', '').replace(/[ㄱ-ㅎ|가-힣|a-z|A-Z]+/, '');
			}
			var yearStartIdx = format.indexOf('yyyy');
			var monthStartIdx = format.indexOf('MM');
			var dayStartIdx = format.indexOf('dd');
			
			var dateReg1 = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
			var dateReg2 = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
			
			var dateRegMonthly =  /^\d{4}[./-]\d{2}$/;
			
			if (el.options.pickertype === 'daily' || el.options.pickertype === 'weekly') {
				
				
				
				if ( !isNaN(Number(value)) && value.length == 8 ) {
					if ( yearStartIdx > dayStartIdx ) {
						return new Date(value.substr(0, 2)+"/"+value.substr(2, 2)+"/"+value.substr(4, 4));
					} else {
						return new Date(value.substr(0, 4)+"/"+value.substr(4, 2)+"/"+value.substr(6, 2));
					}
				} else if ( value.match(dateReg1) || value.match(dateReg2) ){
					return new Date(value);
				} else if ( value.length >= 8 ){
					return new Date(value.substr(yearStartIdx, 4)+"/"+value.substr(monthStartIdx, 2)+"/"+ value.substr(dayStartIdx, 2));
				} /*else {
					return new Date();
				}*/
			}else if( el.options.pickertype === 'monthly'){
				
				if ( !isNaN(Number(value)) && value.length == 6 ) {
					if ( yearStartIdx > monthStartIdx ) {
						return new Date(value.substr(2, 4)+"/"+value.substr(4, 2));
					} else {
						return new Date(value.substr(0, 4)+"/"+value.substr(4, 2));
					}
				} else if ( value.match(dateRegMonthly) ){
					return new Date(value);
				} else if ( value.length >= 8 ){
					return new Date(value.substr(yearStartIdx, 4)+"/"+value.substr(monthStartIdx, 2));
				} 

			}
			
			return new Date();
		},

		_generateDate : function(el, value) {
			var format = el.options.format;
			var seperator = format.replace('yyyy', '').replace('MM', '').replace('dd', '').substring(0, 1);
			var date, year, month, day;
			var yearStartIdx = format.indexOf('yyyy');
			var monthStartIdx = format.indexOf('MM');
			var dayStartIdx = format.indexOf('dd');
			if (el.options.pickertype === 'daily' || el.options.pickertype === 'weekly') {
				if (value.indexOf(seperator) == -1 && value.length == 8) { // 숫자만 입력한 경우.
					if (yearStartIdx > 0) {
						value = value.substr(0, 2) + seperator + value.substr(2, 2) + seperator + value.substr(4, 4);
					} else {
						value = value.substr(0, 4) + seperator + value.substr(4, 2) + seperator + value.substr(6, 2);
					}
					$(el).trigger('change');
				}
				if (!$.alopex.util.isValid(value)) {
					return new Date();
				} else if (!$.alopex.util.isValid(seperator)) {
					return new Date(value.substr(yearStartIdx, 4), Number(value.substr(monthStartIdx, 2)) - 1, value.substr(dayStartIdx, 2));
				} else {
					if (yearStartIdx > 0 && yearStartIdx > monthStartIdx) {
						year = value.split(seperator)[2];
						if (monthStartIdx == 0) {
							month = Number(value.split(seperator)[0]) - 1;
							day = value.split(seperator)[1];
						} else {
							month = Number(value.split(seperator)[1]) - 1;
							day = value.split(seperator)[0];
						}
						return new Date(year, month, day);
					} else if (yearStartIdx > 0 && yearStartIdx < monthStartIdx){
						return new Date(value.split(seperator)[1], Number(value.split(seperator)[2]) - 1, value.split(seperator)[0]);
					} else {
						year = value.split(seperator)[0];
						if (monthStartIdx > dayStartIdx) {
							month = Number(value.split(seperator)[2]) - 1;
							day = value.split(seperator)[1];
						} else {
							month = Number(value.split(seperator)[1]) - 1;
							day = value.split(seperator)[2];
						}
						return new Date(year, month, day);
					}
				}
			} else if (el.options.pickertype === 'monthly') {
				if (value.indexOf(seperator) == -1 && value.length == 6) { // 숫자만 입력한 경우.
					if (yearStartIdx > 0) {
						value = value.substr(0, 2) + seperator + value.substr(2, 4);
					} else {
						value = value.substr(0, 4) + seperator + value.substr(4, 2);
					}
					$(el).trigger('change');
				}
				if (!$.alopex.util.isValid(value)) {
					return new Date();
				} else if (!$.alopex.util.isValid(seperator)) {
					return new Date(value.substr(yearStartIdx, 4), Number(value.substr(monthStartIdx, 2)) - 1);
				} else {
					if (yearStartIdx > 0) {
						return new Date(value.split(seperator)[1], Number(value.split(seperator)[0]) - 1);
					} else {
						return new Date(value.split(seperator)[0], Number(value.split(seperator)[1]) - 1);
					}
				}
			}
		},

		init : function(el, options) {
			var isClassLoad = false;
			var wrapper;
			if(el.tagName.toLowerCase() == 'div') {
				wrapper = el;
				el = el.querySelector('input');
				isClassLoad = true;
			}
			var $el = $(el);
			el.options = $.extend(true, {}, this.properties, options);
			el.options.position = options.pickerposition;
			
			this.refresh_format(el, options);

			if( el.options.format.indexOf('EEEE')){
				$el.attr('maxlength', el.options.format.length + 6);
			} else {
				$el.attr('maxlength', el.options.format.length);
			}
			if (el.options.placeholder) {
				$el.attr('placeholder', el.options.format);
			}
			if (el.options.defaultdate) {
				$el.attr('defaultdate', el.options.defaultdate);
			}

			this.addHoverHighlight(el);
			this.addPressHighlight(el);

			if(isClassLoad) {
				var $wrapper = $(wrapper);
				if($wrapper.find('.'+this.classNames.calendar).length>0) {
					el.imagebutton = $wrapper.find('.'+this.classNames.calendar);
				}
				if($wrapper.find('.'+this.classNames.clearButton).length>0) {
					el.resetbutton = $wrapper.find('.'+this.classNames.clearButton);
				}
				
			} else {
				if (el.options.image !== false) { // data-image 속성이 존재하는 경우,
					// var height = parseInt($el.css('height'));
					el.imagebutton = $('<div></div>').insertAfter(el).addClass('af-dateinput-image');
					if (el.options.image !== '') { // data-image 속성에 값이 지정된 경우
						$(el.imagebutton).css('background-image', 'url(' + el.options.image + ')');
					}
					
				}
				if (el.options.resetbutton) {
					el.resetbutton = $('<div>x</div>').insertAfter(el).addClass('af-reset-button');
					
				}
			}

			if( el.options.format && el.options.inputwidth == 'auto'){
				if ( el.options.format.indexOf('EEEE') >= 0 && el.options.locale == 'en'){
					$el.css('width', ( el.options.format.length + 7) * 8);
				} else {
					$el.css('width', ( el.options.format.length + 3) * 8);
				}
				
			} else if (!isNaN(Number(el.options.inputwidth))){
				$el.css('width', el.options.inputwidth);
			}
			
			if(el.imagebutton) {
				el.imagebutton[0].element = el;
			}
			if(el.resetbutton) {
				el.resetbutton[0].element = el;
				el.resetbutton.on('click', function(e) {
					var target = e.currentTarget;
					var $el = $(target.element);
					if (!$el.is('.af-disabled Disabled')) {
						if (target.daterange) {
							$(target.daterange).clear();
						} else {
							$.alopex.widget.dateinput.clear(target.element);
						}
						e.preventDefault();
						e.stopPropagation();
					}
				});
			}
			// $el.attr('readonly', true);
			// IE에서는 type 바꾸는것을 허용하지 않음
			if (!$.alopex.util.isValid($el.attr('type'))) {
				$el.attr('type', 'text');
			}
			this.setEnabled(el, el.options.enabled);
			$el.on('blur', this._blurHandler);
		},

		_blurHandler : function(e) {
			var that = $.alopex.widget.dateinput;
			var el = e.currentTarget;
			var value = $(el).val();
			var format = el.options.format;
			var locale = el.options.locale ? el.options.locale.toUpperCase() : "KO"; // default Locale : "KO" 
			
			// data-default-date="false" 일 경우, 틀린 포맷 (예:20161299) 입력 시, 오늘 날짜로 입력 되버리는 현상 수정을 위해 이 시점에 validation 수행
			value = $.alopex.widget.dateinput._validationDate(el, value);
			
			// 기존 generateDate 는 요일 형식을 제대로 변환해주지 못해서 일단 새로운 함수로 대체
			if ((value === '' && el.options.defaultdate === false ) || (value === '' && $(el).hasClass('af-disabled Disabled') )) {
				$(el).val('');
				return;
			}else{
				var date = that.generateDate(el, value)// that._generateDate(el, value);
				var dateString =  $.alopex.widget.dateinput._getDateString(date, format, locale);
	
				if ( date === undefined || isNaN(date.getTime()) ){
					$(el).val('');
					$(el).trigger('change');
					if (el.options.blurcallback) {
						el.options.blurcallback(el, value);
					}
				} else if ( dateString != value ) {
					// 날짜가 유효하다면
					// 해당 포맷에 맞게 날짜/요일 문자열을 만들어줌 				
					$(el).val(dateString);
					return;
				}
			}
		},

		update : function(el, options) {
			if(el.tagName.toLowerCase() == 'div') {
				el = el.querySelector('input');
			}
			$.extend(true, el.options, options);
			
			this.refresh_format(el, options);
			
			// inputwidth = 'auto'
			// 한글 과 영어의 길이 차이가 크므로 en 업데이트 시에는 길이 조정이 필요함 
			if ( el.options.inputwidth == 'auto' && el.options.format.indexOf('EEEE') >= 0 && el.options.locale == 'en'){
				$(el).css('width', ( el.options.format.length + 7) * 8);
			} 

		},
		
		refresh_format : function(el, options){
			
			// arg0 : el.options 기존 설정
			// arg1 : options 새로운 설정
			
			// 1. 새로운 설정으로 pickertype만 설정 했을 때, 이에 맞게 기존 설정 format도 변경해준다
			if($.alopex.util.isValid(options.pickertype) && options.format === undefined){
				
				// <div class="Dateinput" data-pickertype="daily">와 같이 적용했는데, 기존 설정에 dd가 없는 경우,
				// data-format을 설정하지 않았기 때문에 default인 'yyyy-MM-dd' 기준으로 수정한다
				if((options.pickertype === 'daily' || options.pickertype === 'weekly') && el.options.format.indexOf('dd') === -1){
						el.options.format = 'yyyy-MM-dd';
						$(el).attr("data-format", el.options.format);
					}
				
				// <div class="Dateinput" data-pickertype="monthly">와 같이 적용했는데, 기존 설정에 dd가 있는 경우, dd를 뺀다
				if(options.pickertype === 'monthly' && el.options.format.indexOf('dd') !== -1){
					
					var format = el.options.format;
					if(format.length === 8){
						format = format.replace("dd", "");
					}else{
						var temp = format.replace('yyyy', '').replace('MM', '').replace('dd', '');
						var seperator;
						seperator = (temp.length === 0 ? "" : temp.substring(0, 1));
						
						var yearStartIdx = format.indexOf('yyyy');
						var monthStartIdx = format.indexOf('MM');
	
						if(yearStartIdx > monthStartIdx){
							format = 'MM' + seperator + 'yyyy';
						}else{
							format = 'yyyy' + seperator + 'MM';
						}
					}
					el.options.format = format;
					$(el).attr("data-format", el.options.format);				
					
				}
				
			}
			
			// 2. format만 설정 했을 때, format에 맞게 pickertype도 변경해준다
			if($.alopex.util.isValid(options.format) && options.pickertype === undefined){
				
				// <div class="Dateinput" data-format="MM/dd/yyyy">와 같이 적용했는데, 기존 설정이 pickertype : "monthly"인 경우,
				// 기존 설정 pickertype을 새로운 설정 format에 맞게 수정해준다
				if(options.format.indexOf('dd') !== -1 && el.options.pickertype === 'monthly'){
					el.options.pickertype = 'daily';
					$(el).attr("data-pickertype", el.options.pickertype);
					}
				
				// <div class="Dateinput" data-format="MM/yyyy">와 같이 적용했는데, 기존 설정이 pickertype : "daily"인 경우,
				// 기존 설정 pickertype을 새로운 설정 format에 맞게 수정해준다
				if(options.format.indexOf('dd') === -1 && el.options.pickertype === 'daily'){
					el.options.pickertype = 'monthly';
					$(el).attr("data-pickertype", el.options.pickertype);
					}
			}
			
			// 3. 둘 다 했는데, format은 일별(MM/dd/yyyy)이고, pickertype을 월별(monthly)로 하는 등 오류 설정을 했을 때는, format에 모든 것을 맞춘다
			if($.alopex.util.isValid(options.format) && $.alopex.util.isValid(options.pickertype)){
				
				if(options.format.indexOf('dd') !== -1 && options.pickertype === 'monthly'){
					el.options.pickertype = 'daily';
					$(el).attr("data-pickertype", el.options.pickertype);
				}
				
				if(options.format.indexOf('dd') === -1 && (options.pickertype === 'daily' || options.pickertype === 'weekly')){
					el.options.pickertype = 'monthly';
					$(el).attr("data-pickertype", el.options.pickertype);
				}
			}
			
		},

		setEnabled : function(el, flag) {
			if(el.tagName.toLowerCase() == 'div') {
				el = el.querySelector('input');
			}
			var $el = $(el);
			flag = $.alopex.util.parseBoolean(flag);
			$(el).off('click', this._clickEventHandler);
			$(el.imagebutton).off('click', this._clickEventHandler);
			if (flag) {
				if (el.imagebutton) {
					$(el.imagebutton).on('click', this._clickEventHandler);
				} else {
					$el.on('click', this._clickEventHandler);
				}
				$el.add(el.imagebutton).removeClass('af-disabled Disabled');
				$el.removeAttr('readonly');
			} else {
				$el.add(el.imagebutton).addClass('af-disabled Disabled');
				$el.attr('readonly', true);
			}
		},

		clear : function(el) {
			if(el.tagName.toLowerCase() == 'div') {
				el = el.querySelector('input');
			}
			$(el).val('');
			$(el).trigger('change');
		},

		_clickEventHandler : function(e) {
			var that = $.alopex.widget.dateinput;
			var el = e.currentTarget.element || e.currentTarget;
			var value = $(el).val();
			var date = that.generateDate(el, value); // _generateDate(el, value);
			date = (isNaN(date.getYear())) ? null : date;
			var option = $.extend(true, {}, $.alopex.widget.dateinput.properties, el.options, {
				date : date
			});
			var mindate = $(el).attr('data-mindate');
			if (mindate) {
				option.mindate = that.generateDate(el, mindate); // _generateDate(el, value);
			}
			var maxdate = $(el).attr('data-maxdate');
			if (maxdate) {
				option.maxdate = that.generateDate(el, maxdate); // _generateDate(el, value);
			}

			// datepicker click 을 통하지 않고, 동적으로 date가 입력된 경우 체크하여 min/max date에 반영시킨다.
			var dynamicMinMax = null;
			if($(el).parent().parent().attr('data-type') === 'daterange'){
				// 인자로 div.daterange element를 보낸다
				dynamicMinMax = $a.widget.daterange._dynamicBindingCheck($(el).parent().parent()[0]);
			
				// start input 테그를 클릭했고 && maxdate 동적으로 변경된 경우
				if($(el).parent().hasClass('Startdate') && !$(el).parent().hasClass('NoLimit')){
					// '' 인 경우 null 처리를 통해 disabled를 해제시켜준다
					option.maxdate = dynamicMinMax.maxdate === '' ? null : dynamicMinMax.maxdate;
				}
				// end input 테그를 클릭했고 && mindate 동적으로 변경된 경우
				if($(el).parent().hasClass('Enddate') && !$(el).parent().hasClass('NoLimit')){
					option.mindate = dynamicMinMax.mindate === '' ? null : dynamicMinMax.mindate;
				}
			}
			
			$(el).showDatePicker(function(date, value, certainDatesName, certainDatesInfo, e) {
				if (certainDatesInfo && !certainDatesInfo.isClickToClose) {
					if ($.alopex.util.isValid(option.certaindatestxt.unavailabletxt)) {
						var text = option.certaindatestxt.unavailabletxt;
						text = text.split('{0}').join(certainDatesName);
						alert(text);
					}
					return;
				}
				if (el.options.pickertype === 'weekly') {
					
					if($(el).parent().parent().attr('data-type') === 'daterange'){
						if ($(el).attr('data-role') === 'startdate') {
							 $(el).val(value['startdate']);
						 } else {
							 $(el).val(value['enddate']);
						 }
					}else{
						$(el).val(value['startdate'] + " ~ " + value['enddate']);
					}
					 
				} else {
					$(el).val(value);
				}
				$(el).trigger('change'); // trigger datamodel set.
				if (el.options.callback) {
					el.options.callback.call(el, date, value, certainDatesName, certainDatesInfo, e);
				}
			}, option);
		},
		
		_getDateString : function(date, format, locale) {
			if(!(date instanceof Date)) {
				return ;
			}
			var fullyear = date.getFullYear();
			var month = date.getMonth() + 1;
			var dateObj = date.getDate();
			// d  		일 1자리	 	3	
			// dd 		일 2자리 		03
			if (format.indexOf('dd') > 0){ 
				dateObj = ((dateObj < 10)? '0' : '') + dateObj;
			}
			// M  		월 1자리 		8	
			// MM  		월 2자리 		08	
			// MMM 	 	약식 문자열 	Aug 또는 8
			// MMMM 	전체 문자열 	August 또는 8 -> DatePicker에서 전체 문자열이 지원되지 않으므로 아직 미구현
			if (format.indexOf('MMM') >= 0){
				var mmm =  $.alopex.datePicker["MONTHS_"+locale][date.getMonth()];
				if ( mmm && mmm.length > 3) { mmm = mmm.substring(0, 3); } 
				format = format.replace('yyyy', fullyear).replace('dd', dateObj).replace('d', dateObj);
				format = format.replace('MMMM', mmm).replace('MMM', mmm);
			} else if (format.indexOf('MM') >= 0){
				month = ((month < 10)? '0' : '') + month;
			} 
			format = format.replace('yyyy', fullyear).replace('MM', month).replace('M', month).replace('dd', dateObj).replace('d', dateObj);
			// EEE 	 	약식 문자열 	Tue 또는 화
			// EEEE 	전체 문자열 	Tuesday 또는 화
			if ( format.indexOf('EEEE') >= 0 ){
				format = format.replace('EEEE', $.alopex.datePicker["WEEKDAYS_"+locale][date.getDay()]);
			} else if ( format.indexOf('EEE') >= 0 ) {
				var weekday =  $.alopex.datePicker["WEEKDAYS_"+locale][date.getDay()];
				format = format.replace('EEE', (weekday.length > 3) ? weekday.substring(0, 3) : weekday);
			}
			return format;
		}
	});

})(jQuery);