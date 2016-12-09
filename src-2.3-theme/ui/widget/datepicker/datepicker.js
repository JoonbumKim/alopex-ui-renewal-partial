(function($) {
	if ($.alopex.datePickerMap) {
		return;
	}
	//-----------------------DatePicker----------------------//TODO

	/**
	 * 생성된 Datepicker객체들을 보관하며 set, get, remove 메소드 제공.
	 */
	$.alopex.datePickerMap = {

		datePickerObj: {},

		setObject: function(id, obj) {
			this.datePickerObj[id] = obj;
		},

		getObjectByNode: function(node) {
			var temp = $(node);
			while (temp.attr('data-type') !== 'af-datepicker') {
				temp = temp.parent();
			}
			return this.datePickerObj[temp.attr('id')];
		},

		getObjectById: function(id) {
			var objId = '';
			if (id.indexOf('datepicker_') < 0) {
				objId = 'datepicker_' + id;
			} else {
				objId = id;
			}
			return this.datePickerObj[objId];
		},

		removeObjectById: function(id) {
			var objId = '';
			if (id.indexOf('datepicker_') < 0) {
				objId = 'datepicker_' + id;
			} else {
				objId = id;
			}
			delete this.datePickerObj[objId];
		},

		removeObjectByNode: function(node) {
			var temp = $(node);
			while (temp.attr('data-type') !== 'af-datepicker') {
				temp = temp.parent();
			}
			delete this.datePickerObj[temp.attr('id')];
		}
	};

	/**
	 * DatePicker 구성을 위한 Property 및 method
	 */
	$.alopex.datePicker = {

		MONTHS_KO: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		MONTHS_EN: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		MONTHS_JA: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		MONTHS_ZH: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],

		WEEKDAYS_KO: ['일', '월', '화', '수', '목', '금', '토'],
		WEEKDAYS_EN: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		WEEKDAYS_JA: ['日', '月', '火', '水', '木', '金', '土'],
		WEEKDAYS_ZH: ['日', '一', '二', '三', '四', '五', '六'],

		POSTFIX_KO: ['년', '월', '일'],
		POSTFIX_EN: ['', '', ''],
		POSTFIX_JA: ['年', '月', '日'],
		POSTFIX_ZH: ['年', '月', '日'],

		DESC_PREVYEAR_KO: '이전년도',
		DESC_PREVYEAR_EN: 'previous year',
		DESC_PREVYEAR_JA: '前年',
		DESC_PREVYEAR_ZH: '前一年',

		DESC_NEXTYEAR_KO: '다음년도',
		DESC_NEXTYEAR_EN: 'next year',
		DESC_NEXTYEAR_JA: '翌年',
		DESC_NEXTYEAR_ZH: '明年',

		DESC_PREVMONTH_KO: '이전 월',
		DESC_PREVMONTH_EN: 'previous month',
		DESC_PREVMONTH_JA: '先月',
		DESC_PREVMONTH_ZH: '上个月',

		DESC_NEXTMONTH_KO: '다음 월',
		DESC_NEXTMONTH_EN: 'next month',
		DESC_NEXTMONTH_JA: '来月',
		DESC_NEXTMONTH_ZH: '下个月',

		DESC_CLOSE_KO: '닫기',
		DESC_CLOSE_EN: 'close',
		DESC_CLOSE_JA: '終了',
		DESC_CLOSE_ZH: '关闭',
		

		DESC_YEARSELECT_KO : '년도 선택',
		DESC_YEARSELECT_EN : 'year select',
		DESC_YEARSELECT_JA : '年を選択',
		DESC_YEARSELECT_ZH : '年份选择',

		DESC_MONTHSELECT_KO : '월 선택',
		DESC_MONTHSELECT_EN : 'month select',
		DESC_MONTHSELECT_JA : '月選択',
		DESC_MONTHSELECT_ZH : '月份选择',

		DESC_MONTH_SUMMARY_KO : '월을 선택할 수 있는 달력입니다.',
		DESC_MONTH_SUMMARY_EN : 'you can select month.',
		DESC_MONTH_SUMMARY_JA : '月を 選べるカレンダーです.',
		DESC_MONTH_SUMMARY_ZH : '选择月份的日历.',

		DESC_MONTH_CAPTION_KO : '월 달력',
		DESC_MONTH_CAPTION_EN : 'month picker',
		DESC_MONTH_CAPTION_JA : '月カレンダー',
		DESC_MONTH_CAPTION_ZH : '月份日历',

		DESC_DAY_SUMMARY_KO : '날짜를 선택할 수 있는 달력입니다.',
		DESC_DAY_SUMMARY_EN : 'you can select a day.',
		DESC_DAY_SUMMARY_JA : '日にちを選べるカレンダーです.',
		DESC_DAY_SUMMARY_ZH : '选择日期的日历.',

		DESC_DAY_CAPTION_KO : '달력',
		DESC_DAY_CAPTION_EN : 'datepicker',
		DESC_DAY_CAPTION_JA : 'カレンダー',
		DESC_DAY_CAPTION_ZH : '日历',

		DESC_TODAY_BTN_KO : '오늘',
		DESC_TODAY_BTN_EN : 'Today',
		DESC_TODAY_BTN_JA : '今日',
		DESC_TODAY_BTN_ZH : '今天',

		currentDate : null, // today info
		weekdays : [],
		months : [],
		dateFormat : null,
		datePostfix : [],
		localeInfo : "ko", // 내부용 변수
		locale : "ko", // 사용자용 변수, localeInfo와 locale 중 표준을 locale로 맞추기 위해 신규 추가
		certainDates : [],
		mindate : null,
		maxdate : null,

		descPrevYear : null,
		descNextYear : null,
		descPrevMonth : null,
		descNextMonth : null,
		descClose : null,
		descYearSelect : null,
		descMonthSelect : null,
		descMonthSummary : null,
		descMonthCaption : null,
		descDaySummary : null,
		descDayCaption : null,
		descTodayBtn : null,

		daysInMonth : [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
		calendarBody : null, // '일' 표시 영역(tbody)
		calendarMonth : null, // header의 '월' 라벨 영역
		calendarYear : null, // header의 '연도' 라벨 영역
		prevMonth : null,
		nextMonth : null,
		prevYear : null,
		nextYear : null,
		btn_close : null,
		_renderCache : [],
		targetElem: null, //datePicker의 위치에 기준이 되는 element
		_callback: null,
		closeCallback: null,
		calendarContainer: null,
		datePickerTheme: 'af-default',//default 테마 Class명
		datePickerInlineTheme: 'af-inline Inline',
		currentArea: null,
		inline: false,
		pickertype: 'daily',
		selectyear : false,
		selectmonth : false,
		showothermonth : false,
		showbottom : false,
		bottomdate : null,
		weekperiod : 1,
		defaultdate : true,
		position : "left|bottom",

		/**
		 * @param {json} param : json형의 option 값.
		 */
		setDefaultDate: function(param) {
			try {
				this.currentDate = new Date(); // default : today
				if ($.alopex.util.isValid(param) && param.hasOwnProperty('defaultdate')) {
					this.defaultdate = param.defaultdate;
				}
				if ($.alopex.util.isValid(param)) {
					if (param.hasOwnProperty('date')) {
						var obj = param.date;
						if (obj instanceof Date) {
							this.currentDate = obj;
						} else {
							if (!$.alopex.util.isValid(obj.year) || !$.alopex.util.isNumberType(obj.year) || obj.year < 1900 || obj.year > 2100 || !$.alopex.util.isValid(obj.month) ||
									!$.alopex.util.isNumberType(obj.month) || obj.month < 1 || obj.month > 12 || !$.alopex.util.isValid(obj.day) || !$.alopex.util.isNumberType(obj.day) || obj.day > 31 ||
									obj.day < 1) {
								throw '[DatePicker Error] Invalid Date => ' + obj.year + '-' + obj.month + '-' + obj.day;
							}
							this.currentDate = new Date(obj.year, (obj.month - 1), obj.day);
						}
					}
				}
			} catch (e) {
				//        __ALOG(e);
			}
		},

		/**
		 * @param {json} param : return 되는 날짜 정보 format의 key, value.
		 * ex) {'format' : 'yyyy-MM-dd'}.
		 */
		setFormat: function(param) {
			var formatStr = 'yyyyMMdd'; //default
			if ($.alopex.util.isValid(param) && param.hasOwnProperty('format') && $.alopex.util.isValid(param.format)) {
				var pattern = /[Y|m|D|e]/g;
				if (!pattern.test(param.format)) {
					formatStr = param.format;
				} else {
					//          __ALOG('[DatePicker Error] Invalid Date Pattern' + '(y, M, d, E only) => ' + param.format);
				}
			}
			this.dateFormat = formatStr;
		},

		/**
		 * @param {json} param : 달력에 표시되는 월, 요일 영역의 Locale 정보.
		 * ex) {'locale' : 'ko | en | ja | zh'}.
		 */
		setLocale: function(param) {

			if ($.alopex.util.isValid(param) && param.hasOwnProperty('locale')) {
				localeStr = param.locale;
			}else{
				localeStr = this.localeInfo;
			}

			switch (localeStr) {
			case 'en':
				this.weekdays = this.WEEKDAYS_EN;
				this.months = this.MONTHS_EN;
				this.datePostfix = this.POSTFIX_EN;
				this.descPrevYear = this.DESC_PREVYEAR_EN;
				this.descNextYear = this.DESC_NEXTYEAR_EN;
				this.descPrevMonth = this.DESC_PREVMONTH_EN;
				this.descNextMonth = this.DESC_NEXTMONTH_EN;
				this.descClose = this.DESC_CLOSE_EN;
				this.descYearSelect = this.DESC_YEARSELECT_EN;
				this.descMonthSelect = this.DESC_MONTHSELECT_EN;
				this.descMonthSummary = this.DESC_MONTH_SUMMARY_EN;
				this.descMonthCaption = this.DESC_MONTH_CAPTION_EN;
				this.descDaySummary = this.DESC_DAY_SUMMARY_EN;
				this.descDayCaption = this.DESC_DAY_CAPTION_EN;
				this.descTodayBtn = this.DESC_TODAY_BTN_EN;
				this.localeInfo = 'en';
				break;

			case 'ko':
				this.weekdays = this.WEEKDAYS_KO;
				this.months = this.MONTHS_KO;
				this.datePostfix = this.POSTFIX_KO;
				this.descPrevYear = this.DESC_PREVYEAR_KO;
				this.descNextYear = this.DESC_NEXTYEAR_KO;
				this.descPrevMonth = this.DESC_PREVMONTH_KO;
				this.descNextMonth = this.DESC_NEXTMONTH_KO;
				this.descClose = this.DESC_CLOSE_KO;
				this.descYearSelect = this.DESC_YEARSELECT_KO;
				this.descMonthSelect = this.DESC_MONTHSELECT_KO;
				this.descMonthSummary = this.DESC_MONTH_SUMMARY_KO;
				this.descMonthCaption = this.DESC_MONTH_CAPTION_KO;
				this.descDaySummary = this.DESC_DAY_SUMMARY_KO;
				this.descDayCaption = this.DESC_DAY_CAPTION_KO;
				this.descTodayBtn = this.DESC_TODAY_BTN_KO;
				this.localeInfo = 'ko';
				break;

			case 'ja':
				this.weekdays = this.WEEKDAYS_JA;
				this.months = this.MONTHS_JA;
				this.datePostfix = this.POSTFIX_JA;
				this.descPrevYear = this.DESC_PREVYEAR_JA;
				this.descNextYear = this.DESC_NEXTYEAR_JA;
				this.descPrevMonth = this.DESC_PREVMONTH_JA;
				this.descNextMonth = this.DESC_NEXTMONTH_JA;
				this.descClose = this.DESC_CLOSE_JA;
				this.descYearSelect = this.DESC_YEARSELECT_JA;
				this.descMonthSelect = this.DESC_MONTHSELECT_JA;
				this.descMonthSummary = this.DESC_MONTH_SUMMARY_JA;
				this.descMonthCaption = this.DESC_MONTH_CAPTION_JA;
				this.descDaySummary = this.DESC_DAY_SUMMARY_JA;
				this.descDayCaption = this.DESC_DAY_CAPTION_JA;
				this.descTodayBtn = this.DESC_TODAY_BTN_JA;
				this.localeInfo = 'ja';
				break;

			case 'zh':
				this.weekdays = this.WEEKDAYS_ZH;
				this.months = this.MONTHS_ZH;
				this.datePostfix = this.POSTFIX_ZH;
				this.descPrevYear = this.DESC_PREVYEAR_ZH;
				this.descNextYear = this.DESC_NEXTYEAR_ZH;
				this.descPrevMonth = this.DESC_PREVMONTH_ZH;
				this.descNextMonth = this.DESC_NEXTMONTH_ZH;
				this.descClose = this.DESC_CLOSE_ZH;
				this.descYearSelect = this.DESC_YEARSELECT_ZH;
				this.descMonthSelect = this.DESC_MONTHSELECT_ZH;
				this.descMonthSummary = this.DESC_MONTH_SUMMARY_ZH;
				this.descMonthCaption = this.DESC_MONTH_CAPTION_ZH;
				this.descDaySummary = this.DESC_DAY_SUMMARY_ZH;
				this.descDayCaption = this.DESC_DAY_CAPTION_ZH;
				this.descTodayBtn = this.DESC_TODAY_BTN_ZH;
				this.localeInfo = 'zh';
				break;

			default:
				this.weekdays = this.WEEKDAYS_KO;
				this.months = this.MONTHS_KO;
				this.datePostfix = this.POSTFIX_KO;
				this.descPrevYear = this.DESC_PREVYEAR_KO;
				this.descNextYear = this.DESC_NEXTYEAR_KO;
				this.descPrevMonth = this.DESC_PREVMONTH_KO;
				this.descNextMonth = this.DESC_NEXTMONTH_KO;
				this.descClose = this.DESC_CLOSE_KO;
				this.descYearSelect = this.DESC_YEARSELECT_KO;
				this.descMonthSelect = this.DESC_MONTHSELECT_KO;
				this.descMonthSummary = this.DESC_MONTH_SUMMARY_KO;
				this.descMonthCaption = this.DESC_MONTH_CAPTION_KO;
				this.descDaySummary = this.DESC_DAY_SUMMARY_KO;
				this.descDayCaption = this.DESC_DAY_CAPTION_KO;
				this.descTodayBtn = this.DESC_TODAY_BTN_KO;
				this.localeInfo = 'ko';
			}
			
			this.locale = this.localeInfo; // 내부에서 최종적으로 설정된 localeInfo를 locale변수에 동기화 해준다.
		},

		/**
		 * 특정 style을 적용하기 위한 날짜들의 정보를 저장.
		 * 
		 * @param {json}
		 *            param : option값, 'certainDates' key에 날짜정보들이 존재.
		 */
		setCertainDates: function(param) {

			if ($.alopex.util.isValid(param) && param.hasOwnProperty('certainDates')) {
				this.certainDates = param.certainDates;
			}
		},

		setThemeClass: function(param) {

			if ($.alopex.util.isValid(param) && param.hasOwnProperty('themeClass')) {
				this.datePickerTheme = param.themeClass;
			}
		},

		setInline: function(param) {
			if ($.alopex.util.isValid(param) && param.hasOwnProperty('inline')) {
				this.inline = param.inline;
			}
		},

		setMenuSelect: function(param) {
			if ($.alopex.util.isValid(param) && 
					(param.hasOwnProperty('selectyear') || param.hasOwnProperty('selectmonth') 
							|| param.hasOwnProperty('selectYear') || param.hasOwnProperty('selectMonth'))) {
				this.selectyear = param.selectyear || param.selectYear;
				this.selectmonth = param.selectmonth || param.selectMonth;
			}
		},

		setPickerType: function(param) {
			if ($.alopex.util.isValid(param) && (param.hasOwnProperty('pickertype') || param.hasOwnProperty('pickerType'))) {
				this.pickertype = param.pickertype || param.pickerType;
			}
		},
		
		setShowOtherMonth: function(param) {
			if ($.alopex.util.isValid(param) && (param.hasOwnProperty('showOtherMonth') || param.hasOwnProperty('showOthermonth') || param.hasOwnProperty('showotherMonth') || param.hasOwnProperty('showothermonth'))) {
				this.showothermonth = param.showOtherMonth || param.showOthermonth || param.showotherMonth || param.showothermonth;
			}
		},
		
		setShowBottom: function(param) {
			if ($.alopex.util.isValid(param) && (param.hasOwnProperty('showBottom') || param.hasOwnProperty('showbottom'))) {
				this.showbottom = param.showBottom || param.showbottom;
			}
		},

		setBottomDate: function(param) {
		  if ($.alopex.util.isValid(param) && (param.hasOwnProperty('bottomDate') || param.hasOwnProperty('bottomdate'))) {
		    this.bottomdate = param.bottomDate || param.bottomdate;
		  }
		},

		setWeekPeriod: function(param) {
		  if ($.alopex.util.isValid(param) && (param.hasOwnProperty('weekPeriod') || param.hasOwnProperty('weekperiod'))) {
		    this.weekperiod = param.weekPeriod || param.weekperiod;
		  }
		},

		setCloseCallback: function(param) {
			if ($.alopex.util.isValid(param) && param.hasOwnProperty('closeCallback')) {
				this.closeCallback = param.closeCallback;
			}
		},

		setMinDate: function(param) {
			var now = new Date();
			if ($.alopex.util.isValid(param) && ($.alopex.util.isValid(param.mindate) || ($.alopex.util.isValid(param.minDate)))) {
				this.mindate = param.mindate || param.minDate;
				this.mindate.setHours(0);
				this.mindate.setMinutes(0);
				this.mindate.setMilliseconds(0);
			} else if (this.selectyear) {
				this.mindate = new Date(now.getFullYear() - 10, 0, 1, 0, 0, 0);
			} else {
				this.mindate = new Date(now.getFullYear() - 100, 0, 1, 0, 0, 0);
			}
			//      if(this.currentDate < this.mindate){
			//        this.currentDate = this.mindate;
			//      }
		},

		setMaxDate: function(param) {
			var now = new Date();
			if ($.alopex.util.isValid(param) && ($.alopex.util.isValid(param.maxdate) || ($.alopex.util.isValid(param.maxDate)))) {
				this.maxdate = param.maxdate || param.maxDate;
				this.maxdate.setHours(0);
				this.maxdate.setMinutes(0);
				this.maxdate.setMilliseconds(0);
			} else if (this.selectyear) {
				this.maxdate = new Date(now.getFullYear() + 10, 11, 31, 0, 0, 0);
			} else {
				this.maxdate = new Date(now.getFullYear() + 100, 11, 31, 0, 0, 0);
			}
			//      if(this.maxdate < this.currentDate){
			//        this.currentDate = this.maxdate;
			//      }

			//mindate가 maxdate 보다 클 경우 둘 다 default로 초기화
			if (this.maxdate < this.mindate) {
				if (this.selectyear) {
					this.mindate = new Date(now.getFullYear() - 10, 0, 1, 0, 0, 0);
					this.maxdate = new Date(now.getFullYear() + 10, 11, 31, 0, 0, 0);
				} else {
					this.mindate = new Date(now.getFullYear() - 100, 0, 1, 0, 0, 0);
					this.maxdate = new Date(now.getFullYear() + 100, 11, 31, 0, 0, 0);
				}
			}
		},

		/**
		 * 전달받은 날짜가 특정 날짜의 정보에 저장된 날짜인지 확인. true이면
		 * 전달받은 type에 따라 해당 값을 return, 저장된 날짜가 아니면 false return.
		 *
		 * @param {number} day : 특정 날짜 정보를 조회 할 날짜일수.
		 * @param {string} type : true일 경우 return할 key 값('name' | 'styleClass').
		 * @return {date | boolean false} 저장된 날짜가 아니면 false return.
		 */
		_isCertainDate: function(day) {
		  for ( var i = 0; i < this.certainDates.length; i++) {
		    var certainDateInfo = this.certainDates[i];
		    for ( var j = 0; j < certainDateInfo.dates.length; j++) {
		      if (this.currentYearView === certainDateInfo.dates[j].getFullYear() && this.currentMonthView === certainDateInfo.dates[j].getMonth() && Number(day) === certainDateInfo.dates[j].getDate()) {
		        return certainDateInfo;
		      }
		    }
		  }

		  return false;
		},

		_isCertainDateOtherMonth: function(day, prev) {
		  if (prev) {
		    for ( var i = 0; i < this.certainDates.length; i++) {
		      var certainDateInfo = this.certainDates[i];
		      for ( var j = 0; j < certainDateInfo.dates.length; j++) {
		        if (this.currentYearView === certainDateInfo.dates[j].getFullYear() && (this.currentMonthView-1) === certainDateInfo.dates[j].getMonth() && Number(day) === certainDateInfo.dates[j].getDate()) {
		          return certainDateInfo;
		        }
		      }
		    }
		  } else {
		    for ( var i = 0; i < this.certainDates.length; i++) {
		      var certainDateInfo = this.certainDates[i];
		      for ( var j = 0; j < certainDateInfo.dates.length; j++) {
		        if (this.currentYearView === certainDateInfo.dates[j].getFullYear() && (this.currentMonthView+1) === certainDateInfo.dates[j].getMonth() && Number(day) === certainDateInfo.dates[j].getDate()) {
		          return certainDateInfo;
		        }
		      }
		    }
		  }

		  return false;
		},

		_isBelowMinDate: function(day) {
		  var currentDate;
		  if (arguments.length === 1) {
		    currentDate = new Date(this.currentYearView, this.currentMonthView, day, 0, 0, 0);
		  } else {
		    currentDate = new Date(this.currentYearView, arguments[0], arguments[1], 0, 0, 0);
		  }
		  if (currentDate < this.mindate) {
		    return true;
		  } else {
		    return false;
		  }
		},

		_isBelowMinDateOtherMonth: function(day, prev) {
		  var currentDate;
		  if (prev) {
		    currentDate = new Date(this.currentYearView, (this.currentMonthView-1), day, 0, 0, 0);
		  } else {
		    currentDate = new Date(this.currentYearView, (this.currentMonthView+1), day, 0, 0, 0);
		  }
		  if (currentDate < this.mindate) {
		    return true;
		  } else {
		    return false;
		  }
		},

		_isAboveMaxDate: function(day) {
		  var currentDate;
		  if (arguments.length === 1) {
		    currentDate = new Date(this.currentYearView, this.currentMonthView, day, 0, 0, 0);
		  } else {
		    currentDate = new Date(this.currentYearView, arguments[0], arguments[1], 0, 0, 0);
		  }
		  if (this.maxdate < currentDate) {
		    return true;
		  } else {
		    return false;
		  }
		},

		_isAboveMaxDateOtherMonth: function(day, prev) {
		  var currentDate;
		  if (prev) {
		    currentDate = new Date(this.currentYearView, (this.currentMonthView-1), day, 0, 0, 0);
		  } else {
		    currentDate = new Date(this.currentYearView, (this.currentMonthView+1), day, 0, 0, 0);
		  }
		  if (this.maxdate < currentDate) {
		    return true;
		  } else {
		    return false;
		  }
		},

		/**
		 * formatStr에 따라 날짜 정보를 적용 한 후 지정된 callback 함수에 return.
		 * @param {json} dateObj : 날짜정보 (year, month, day).
		 * @param {string} formatStr : 날짜 format 문자열.
		 * @param {string} certainDatesName :
		 *  특정 날짜정보들의 집합 중 선택된 정보의 'name' key의 value.
		 */
		getDateByFormat: function(dateObj, formatStr, certainDatesInfo, e) {
			//return 할 (json)date. value는 string 형 임.
			var date = {
				year : dateObj.year + '',
				month : dateObj.month + '',
				day : dateObj.day + ''
			};
			var dateStr = this._getFormattedDate(dateObj, formatStr);

			this._callback(date, dateStr, certainDatesInfo.name, certainDatesInfo, e);
			if ($.alopex.util.isValid(this.closeCallback)) {
				this.closeCallback();
			}
		},
		
		/**
		 * formatStr에 따라 날짜 정보를 적용 한 후 지정된 callback 함수에 return.
		 * @param {array} dateArr : 날짜정보 어레이 (year, month, day).
		 * @param {string} formatStr : 날짜 format 문자열.
		 * @param {string} certainDatesName :
		 *  특정 날짜정보들의 집합 중 선택된 정보의 'name' key의 value.
		 */
		getWeekDateByFormat: function(dateArr, formatStr, certainDatesInfo, e) {
		  //return 할 (json)date. value는 string 형 임.
		  var dateArrObj = {
		      startdate : {
		        year : dateArr[0].year + '',
		        month : dateArr[0].month + '',
		        day : dateArr[0].day + ''
		      },
		      enddate : {
		        year : dateArr[1].year + '',
		        month : dateArr[1].month + '',
		        day : dateArr[1].day + ''
		      }
		  };

		  var dateStr = {
		      startdate : this._getFormattedDate(dateArrObj['startdate'], formatStr),
		      enddate : this._getFormattedDate(dateArrObj['enddate'], formatStr)
		  };

		  this._callback(dateArrObj, dateStr, certainDatesInfo.name, certainDatesInfo, e);
		  if ($.alopex.util.isValid(this.closeCallback)) {
		    this.closeCallback();
		  }
		},
		
		_getFormattedDate: function(dateObj, formatStr) {
			var dateStr = '';

			var param_date = new Date(dateObj.year, (dateObj.month - 1),
					dateObj.day);

			var i = 0;
			var num_y = 0; // the number of 'y'
			var num_M = 0; // the number of 'M'
			var num_d = 0; // the number of 'd'
			var num_E = 0; // the number of 'E'
			var delegator = []; // 구분자 보관
			var value_type = []; // 입력한 Format 순서에 맞게 날짜 타입 보관(년, 월, 일, 요일)
			var resultData = []; // delegator와 join하기 전의 최종 데이터

			// default formatStr 설정.
			if (!$.alopex.util.isValid(formatStr)) {
				formatStr = 'yyyyMMdd';
			}

			var value_split = formatStr.split('');
			var dividerStr = '';

			/**
			 * 해당 캐릭터가 DateFormat에 해당하는 캐릭터인지 여부 확인.
			 * 
			 * @param {string}
			 *            char : 체크할 캐릭터.
			 * @return {Boolean} DateFormat에 해당 하는 캐릭터 인지 여부.
			 */
			function isDateFormat(char) {
				if (char === 'y' || char === 'M' || char === 'd'
						|| char === 'E' || char === undefined || char === null
						|| char === '') {

					return true;
				} else {
					return false;
				}
			}

			// Format 타입 parsing
			while (i < value_split.length) {

				if (value_split[i] === 'y') {
					num_y = (formatStr.split('y').length - 1);
					i += num_y;
					value_type.push('y-' + num_y);

					if (isDateFormat(value_split[i])) {
						delegator.push('');
					}

				} else if (value_split[i] === 'M') {
					num_M = (formatStr.split('M').length - 1);
					i += num_M;
					value_type.push('M-' + num_M);

					if (isDateFormat(value_split[i])) {
						delegator.push('');
					}

				} else if (value_split[i] === 'd') {
					num_d = (formatStr.split('d').length - 1);
					i += num_d;
					value_type.push('d-' + num_d);

					if (isDateFormat(value_split[i])) {
						delegator.push('');
					}

				} else if (value_split[i] === 'E') {
					num_E = (formatStr.split('E').length - 1);
					i += num_E;
					value_type.push('E-' + num_E);

					if (isDateFormat(value_split[i])) {
						delegator.push('');
					}

				} else {
					dividerStr += value_split[i];

					if (isDateFormat(value_split[i + 1])) {
						delegator.push(dividerStr);
						dividerStr = '';
					}
					i++;
				}
			}

			// Format에 따른 Date data setting
			for (i = 0; i < value_type.length; i++) {
				var temp = value_type[i].split('-');

				switch (temp[0]) {

				case 'y': // 연도 data setting
					var temp_year = param_date.getFullYear();

					if (temp[1] === '2') { // yy
						resultData.push(temp_year.toString().substring(2, 4));
					} else if (temp[1] === '4') { // yyyy
						resultData.push(temp_year.toString());
					} else {
						resultData.push(temp_year.toString());
					}
					break;

				case 'M': // 월 data setting
					var temp_month = param_date.getMonth();

					if (temp[1] === '1') { // M
						resultData.push(temp_month + 1);

					} else if (temp[1] === '2') { // MM
						resultData.push((temp_month + 1) < 10 ? '0'
								+ (temp_month + 1) : (temp_month + 1));

					} else if (temp[1] === '3') { // MMM
						resultData.push(this._monthToStr(temp_month, false));

					} else if (temp[1] === '4') { // MMMM
						resultData.push(this._monthToStr(temp_month, true));

					} else {
						resultData.push((temp_month + 1) < 10 ? '0'
								+ (temp_month + 1) : (temp_month + 1));
					}
					break;

				case 'd': // 일 data setting
					if (this.pickertype == 'monthly') {
						break;
					}
					var temp_date = param_date.getDate();
					if (temp[1] === '1') { // d
						resultData.push(temp_date);
					} else if (temp[1] === '2') { // dd
						resultData.push(temp_date < 10 ? '0' + temp_date : temp_date);
					} else {
						resultData.push(temp_date < 10 ? '0' + temp_date : temp_date);
					}
					break;
				case 'E': // 요일 data setting
					var temp_day = param_date.getDay();
					if (temp[1] === '3') {
						resultData.push(this._dayToStr(temp_day, false));
					} else if (temp[1] === '4') {
						resultData.push(this._dayToStr(temp_day, true));
					} else {
						resultData.push(this._dayToStr(temp_day, false));
					}
					break;
				}
			}

			// 구분자와 Date data binding
			for (i = 0; i < resultData.length; i++) {
				dateStr += resultData[i];
				if (delegator.length !== 0) {
					if (i <= delegator.length) {
						dateStr += delegator[i];
					}
				}
			}
			return dateStr;
		},
		
		/**
		 * datepicker 닫기(내부 함수)
		 */
		_close: function(e) {
			var obj = null;

			if (!$.alopex.util.isValid(e)) {
				obj = this;

				if (obj.overlayElement) {
					setTimeout(function() {
						$(obj.overlayElement).remove();
					}, 300);
				}
				if (!obj.inline) {
					$(obj.targetElem).focus();
					$(obj.calendarContainer).remove();
					$.alopex.datePickerMap.removeObjectById(obj.calendarContainerId);
				}

			} else {
				obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);

				if (obj.overlayElement) {
					setTimeout(function() {
						$(obj.overlayElement).remove();
					}, 300);
				}
				if (!obj.inline) {
					$(obj.targetElem).focus();
					$(obj.calendarContainer).remove();
					$.alopex.datePickerMap.removeObjectByNode(e.currentTarget);
				}
			}

			$(window).unbind('hashchange', obj._onHashChange);
			$(window).unbind('resize', obj._resizeHandler);
			$(document.body).unbind('pressed', obj._mouseDownHandler);
			$(document.body).unbind('keydown', obj._addKeyEvent);

		},

		_addKeyEvent: function(e) {

			var that = e.data.obj;
			var currentAreaValue;
			var isCtrl = false;
			var isShift = false;

			that.currentArea = $(document.activeElement);
			currentAreaValue = $(that.currentArea)[0].value;

			//Ctrl 키 press 여부
			if (e.ctrlKey) {
				isCtrl = true;
			}

			//Shift 키 press 여부
			if (e.shiftKey) {
				isShift = true;
			}

			var code = (e.keyCode ? e.keyCode : e.which);
			var resultValue;
			switch (code) {
			case 13: //enter
			case 32: //space
				$(that.currentArea).trigger('click');

				if(!(currentAreaValue === 'prevYear' || currentAreaValue === 'nextYear' ||
            currentAreaValue === 'prevMonth' || currentAreaValue === 'nextMonth' ||
            $(that.currentArea).attr('data-type') === 'af-datepicker')){
          $(that.targetElem).focus();
        }

				e.preventDefault();
				e.stopPropagation();
				break;
			case 9: // click

				if (isShift) {
					if ($(that.currentArea).attr('data-type') === 'af-datepicker') {
						$(that.targetElem).focus();
						that._close();
						e.preventDefault();
					}
				} else {
					if ($(that.currentArea)[0].value === 'close') {
						$(that.calendarContainer).focus();
						e.preventDefault();
					}
				}
				break;
			case 37: //left

			  if(currentAreaValue === 'prevYear' || currentAreaValue === 'nextYear' ||
            currentAreaValue === 'prevMonth' || currentAreaValue === 'nextMonth' ||
            currentAreaValue === 'close' || $(that.currentArea).attr('data-type') === 'af-datepicker'){

					that.currentArea = $(that.calendarContainer).find('a.af-today');
					if ($(that.currentArea)[0] == undefined) {
            currentAreaValue = 2;
          } else {
            currentAreaValue = $(that.currentArea)[0].value;
          }
				}

				if ((currentAreaValue - 1) <= 0) {
					$(that.prevMonth).trigger('click');
					resultValue = that._getNumDaysOfMonth();
				} else {
					resultValue = currentAreaValue - 1;
				}

				that.currentArea = $(that.calendarContainer).find('[href=#' + resultValue + ']');
				$(that.currentArea).focus();

				e.preventDefault();
				break;
			case 39: //right

			  if(currentAreaValue === 'prevYear' || currentAreaValue === 'nextYear' ||
            currentAreaValue === 'prevMonth' || currentAreaValue === 'nextMonth' ||
            currentAreaValue === 'close' || $(that.currentArea).attr('data-type') === 'af-datepicker'){
          
					that.currentArea = $(that.calendarContainer).find('a.af-today');
					if ($(that.currentArea)[0] == undefined) {
            currentAreaValue = 0;
          } else {
            currentAreaValue = $(that.currentArea)[0].value;
          }
				}

				if ((currentAreaValue + 1) > that._getNumDaysOfMonth()) {
					$(that.nextMonth).trigger('click');
					resultValue = 1;
				} else {
					resultValue = currentAreaValue + 1;
				}

				that.currentArea = $(that.calendarContainer).find('[href=#' + resultValue + ']');
				$(that.currentArea).focus();

				e.preventDefault();
				break;
			case 38: //up

			  if ((e.target.nodeName) === 'SELECT') {
          return;
        }
        
        if(currentAreaValue === 'prevYear' || currentAreaValue === 'nextYear' ||
            currentAreaValue === 'prevMonth' || currentAreaValue === 'nextMonth' ||
            currentAreaValue === 'close' || $(that.currentArea).attr('data-type') === 'af-datepicker'){
          
					that.currentArea = $(that.calendarContainer).find('a.af-today');
					if ($(that.currentArea)[0] == undefined) {
            currentAreaValue = 8;
          } else {
            currentAreaValue = $(that.currentArea)[0].value;
          }
				}

				if ((currentAreaValue - 7) <= 0) {
					$(that.prevMonth).trigger('click');
					resultValue = that._getNumDaysOfMonth() + (currentAreaValue - 7);
				} else {
					resultValue = currentAreaValue - 7;
				}

				that.currentArea = $(that.calendarContainer).find('[href=#' + resultValue + ']');
				$(that.currentArea).focus();

				e.preventDefault();
				break;
			case 40: //down
			  if ((e.target.nodeName) === 'SELECT') {
          return;
        }
        
        if(currentAreaValue === 'prevYear' || currentAreaValue === 'nextYear' ||
            currentAreaValue === 'prevMonth' || currentAreaValue === 'nextMonth' ||
            currentAreaValue === 'close' || $(that.currentArea).attr('data-type') === 'af-datepicker'){
          
					that.currentArea = $(that.calendarContainer).find('a.af-today');
					if ($(that.currentArea)[0] == undefined) {
            currentAreaValue = -6;
          } else {
            currentAreaValue = $(that.currentArea)[0].value;
          }
				}
				if ((currentAreaValue + 7) > that._getNumDaysOfMonth()) {
					resultValue = (currentAreaValue + 7) - that._getNumDaysOfMonth();// should be before trigger
					$(that.nextMonth).trigger('click');
				} else {
					resultValue = currentAreaValue + 7;
				}
				that.currentArea = $(that.calendarContainer).find('[href=#' + resultValue + ']');
				$(that.currentArea).focus();
				e.preventDefault();
				break;
			case 27: // escape
				$(that.targetElem).focus();
				that._close();
				e.preventDefault();
				break;
			case 36: // home
				if (isCtrl) {
					that.currentYearView = that._getCurrentYear();// '연도' 라벨의 값
					that.currentMonthView = that._getCurrentMonthToInteger();// '월' 라벨의 값
					//          that.calendarYear.innerHTML = that._addLocalePostfix(that.currentYearView, 'y');
					//          that.calendarMonth.innerHTML = that._addLocalePostfix(that._getMonthToString(true), 'm');
					this.setText(this.calendarYear, this._addLocalePostfix(this.currentYearView, 'y'));
					this.setText(this.calendarMonth, this._addLocalePostfix(this._getMonthToString(true), 'm'));
					while (that.calendarBody.hasChildNodes()) {
						that.calendarBody.removeChild(that.calendarBody.lastChild);
					}
					that.calendarBody.appendChild(that._renderCalendar());
					that.currentArea = $(that.calendarContainer).find('a.af-today');
					$(that.currentArea).focus();
				} else {
					that.currentArea = $(that.calendarContainer).find('[href=#1]');
					$(that.currentArea).focus();
				}
				e.preventDefault();
				break;
			case 35: // end
				that.currentArea = $(that.calendarContainer).find('[href=#' + that._getNumDaysOfMonth() + ']');
				$(that.currentArea).focus();
				e.preventDefault();
				break;
			case 33: //pageUp

				if (currentAreaValue === 'prevYear' || currentAreaValue === 'nextYear' || currentAreaValue === 'prevMonth' || currentAreaValue === 'nextMonth' || currentAreaValue === 'close' ||
						$(that.currentArea).attr('data-type') === 'af-datepicker') {

					that.currentArea = $(that.calendarContainer).find('a.af-today');
					currentAreaValue = $(that.currentArea)[0].value;
				}

				if (isShift) {
					$(that.prevYear).trigger('click');

					//윤년처리 - 현재  2월 29일을 선택 중일 경우
					if (that.currentMonthView === 1 && currentAreaValue === 29) {
						resultValue = 28;
					} else {
						resultValue = currentAreaValue;
					}
				} else {
					$(that.prevMonth).trigger('click');

					if (that._getNumDaysOfMonth() < currentAreaValue) {
						resultValue = that._getNumDaysOfMonth();
					} else {
						resultValue = currentAreaValue;
					}
				}

				that.currentArea = $(that.calendarContainer).find('[href=#' + resultValue + ']');
				$(that.currentArea).focus();

				e.preventDefault();
				break;
			case 34: //pageDown

				if (currentAreaValue === 'prevYear' || currentAreaValue === 'nextYear' || currentAreaValue === 'prevMonth' || currentAreaValue === 'nextMonth' || currentAreaValue === 'close' ||
						$(that.currentArea).attr('data-type') === 'af-datepicker') {

					that.currentArea = $(that.calendarContainer).find('a.af-today');
					currentAreaValue = $(that.currentArea)[0].value;
				}

				if (isShift) {
					$(that.nextYear).trigger('click');

					//윤년처리 - 현재  2월 29일을 선택 중일 경우
					if (that.currentMonthView === 1 && currentAreaValue === 29) {
						resultValue = 28;
					} else {
						resultValue = currentAreaValue;
					}
				} else {
					$(that.nextMonth).trigger('click');

					if (that._getNumDaysOfMonth() < currentAreaValue) {
						resultValue = that._getNumDaysOfMonth();
					} else {
						resultValue = currentAreaValue;
					}
				}

				that.currentArea = $(that.calendarContainer).find('[href=#' + resultValue + ']');
				$(that.currentArea).focus();

				e.preventDefault();
				break;
			default:
				if (!isCtrl && !isShift) {
					$(that.targetElem).focus();
					that._close();
				}
				break;
			}

		},

		/**
		 * Locale에 따른 년, 월, 일 데이터의 postfix를 add 하여 값을 리턴함.
		 * @param {string} paramStr : postfix를 add할 대상이 되는 string data.
		 * @param {string} type : 년, 월, 일 type 명시 ( 'y' | 'm' | 'd', | 'E').
		 * @return {String} : postfix를 add한 결과 string.
		 */
		_addLocalePostfix: function(paramStr, type) {

			var resultStr = paramStr + '';

			switch (type) {
			case 'y': //year
				resultStr += this.datePostfix[0];
				break;

			case 'm': //month
				resultStr += this.datePostfix[1];
				break;

			case 'd': //day
				resultStr += this.datePostfix[2];
				break;

			}

			return resultStr;

		},

		_getCurrentYear: function() {

			return this.currentDate.getFullYear();
		},

		_getCurrentMonthToInteger: function() {

			return this.currentDate.getMonth();
		},

		_getCurrentMonthToString: function(full) {
			var date = this.currentDate.getMonth();

			return this._monthToStr(date, full);
		},

		_getCurrentDay: function() {
			return this.currentDate.getDate();
		},

		_getMonthToInteger: function() {

			return this.currentMonthView;
		},

		_getMonthToString: function(full) {

			var date = this.currentMonthView;

			return this._monthToStr(date, full);
		},

		/**
		 * 각 월의 일수를 return - 윤년 계산(2월).
		 * @return {number} 각 월의 일수.
		 */
		_getNumDaysOfMonth: function(year, month) {
		  if ($.alopex.util.isValid(year) && $.alopex.util.isValid(month)) {
		    return (month === 1 && !(year & 3) && (year % 1e2 || !(year % 4e2))) ? 29 : this.daysInMonth[month];
		  } else {
		    return (this._getMonthToInteger() === 1 && !(this.currentYearView & 3) && (this.currentYearView % 1e2 || !(this.currentYearView % 4e2))) ? 29 : this.daysInMonth[this._getMonthToInteger()];
		  }
		},

//		_getNumDaysOfMonth: function() {
//		  
//		  return (this._getMonthToInteger() === 1 && !(this.currentYearView & 3) && (this.currentYearView % 1e2 || !(this.currentYearView % 4e2))) ? 29 : this.daysInMonth[this._getMonthToInteger()];
//		},

		/**
		 * html element 동적 rendering
		 *
		 * @param {string} nodeName rendering할 html태그명.
		 * @param {json} attributes html 태그의 속성 : value.
		 * @param {string} content html 태그 내의 내용(innerHTML).
		 * @return {html} rendering된 html.
		 */
		_render: function(nodeName, attributes, content) {
			var element;

			if (!(nodeName in this._renderCache)) {
				this._renderCache[nodeName] = document.createElement(nodeName);
			}

			element = this._renderCache[nodeName].cloneNode(false);

			if (attributes !== null) {
				for ( var attribute in attributes) {
					element[attribute] = attributes[attribute];
				}
			}

			if (content !== null && content !== undefined) {
				if (typeof (content) === 'object') {
					element.appendChild(content);
				} else {
					element.innerHTML = content;
				}
			}

			return element;
		},

		_monthToStr: function(date, full) {
			return ((full === true) ? this.months[date] : ((this.months[date].length > 3) ? this.months[date].substring(0, 3) : this.months[date]));
		},

		_dayToStr: function(date, full) {
			return ((full === true) ? this.weekdays[date] : ((this.weekdays[date].length > 3) ? this.weekdays[date].substring(0, 3) : this.weekdays[date]));
		},

		/**
		 *
		 * 연도 컨트롤 버튼의 click 시
		 * - 1900~2100년의 범위만 허용
		 */
		_clickYear: function() {

			if (this.currentYearView < 1900) {

				//허용 범위 중 Minimum
				this.currentYearView = 1900;
			} else if (this.currentYearView > 2100) {

				//허용 범위 중 Maximum
				this.currentYearView = 2100;
			}

			//min, max date 처리
			if (this.currentYearView === this.mindate.getFullYear() && this.currentMonthView < this.mindate.getMonth()) {
				this.currentMonthView = this.mindate.getMonth();
			}

			if (this.currentYearView === this.maxdate.getFullYear() && this.maxdate.getMonth() < this.currentMonthView) {
				this.currentMonthView = this.maxdate.getMonth();
			}

			//      this.calendarYear.innerHTML = this._addLocalePostfix(
			//          this.currentYearView, 'y');
			//      this.calendarMonth.innerHTML = this._addLocalePostfix(this
			//          ._getMonthToString(true), 'm');
			this.setText(this.calendarYear, this._addLocalePostfix(this.currentYearView, 'y'));
			if (this.calendarMonth) { // not available in month picker
				this.setText(this.calendarMonth, this._addLocalePostfix(this._getMonthToString(true), 'm'));
			}

			while (this.calendarBody.hasChildNodes()) {
				this.calendarBody.removeChild(this.calendarBody.lastChild);
			}
			if (this.pickertype === 'daily' || this.pickertype === 'weekly') {
				// '일' 영역 rendering
				this.calendarBody.appendChild(this._renderCalendar());
			} else if (this.pickertype === 'monthly') {
				// '월' 영역 re-rendering
				this.calendarBody.appendChild(this._renderMonth());
			} else {

			}

			return false;
		},

		setText: function(targetEl, value) {
			if (targetEl.tagName.toLowerCase() === 'input' || targetEl.tagName.toLowerCase() === 'select') {
				$(targetEl).val(value);
			} else {
				$(targetEl).text(value);
			}
		},

		/**
		 * 월 컨트롤 버튼의 click 시
		 */
		_clickMonth: function() {

			if (this.currentMonthView < 0) {
				this.currentYearView--;

				if (this.currentYearView < 1900) {
					this.currentYearView = 1900;
				}

				// '12월' 부터 다시 시작.
				this.currentMonthView = 11;

				this.setText(this.calendarYear, this._addLocalePostfix(this.currentYearView, 'y'));
				this.setText(this.calendarMonth, this._addLocalePostfix(this._getMonthToString(true), 'm'));
				//        this.calendarYear.innerHTML = this._addLocalePostfix(
				//            this.currentYearView, 'y');
				//        this.calendarMonth.innerHTML = this._addLocalePostfix(this
				//            ._getMonthToString(true), 'm');

			} else if (this.currentMonthView > 11) {
				this.currentYearView++;

				if (this.currentYearView > 2100) {
					this.currentYearView = 2100;
				}

				// '1월' 부터 다시 시작.
				this.currentMonthView = 0;

				//        this.calendarYear.innerHTML = this._addLocalePostfix(
				//            this.currentYearView, 'y');
				//        this.calendarMonth.innerHTML = this._addLocalePostfix(this
				//            ._getMonthToString(true), 'm');
				this.setText(this.calendarYear, this._addLocalePostfix(this.currentYearView, 'y'));
				this.setText(this.calendarMonth, this._addLocalePostfix(this._getMonthToString(true), 'm'));

			} else {
				//        this.calendarMonth.innerHTML = this._addLocalePostfix(this
				//            ._getMonthToString(true), 'm');
				this.setText(this.calendarMonth, this._addLocalePostfix(this._getMonthToString(true), 'm'));
			}

			// '일' 영역 re-rendering
			while (this.calendarBody.hasChildNodes()) {
				this.calendarBody.removeChild(this.calendarBody.lastChild);
			}
			this.calendarBody.appendChild(this._renderCalendar());

			return false;
		},

		/**
		 * 연도 컨트롤 버튼의 click handler 설정.
		 */
		_bindYearHandler: function() {
			var that = this;

			$(that.prevYear).unbind('click');
			$(that.nextYear).unbind('click');
			$(that.prevYear).children().unbind('focus');
			$(that.prevYear).children().unbind('focusout');
			$(that.nextYear).children().unbind('focus');
			$(that.nextYear).children().unbind('focusout');

			//mindate의 year가 현재 year와 같을 경우
			if (that.mindate.getFullYear() === that.currentYearView) {
				$.alopex.widget.object._addDisabledStyle($(that.prevYear).children());

			} else {
				$.alopex.widget.object._removeDisabledStyle($(that.prevYear).children());

				$(that.prevYear).bind('click', function(e) {
					var obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);
					obj.currentYearView--;
					return obj._clickYear();
				});

				$(that.prevYear).children().bind('focus', function(e) {
					$(this).trigger('hoverstart');
				});

				$(that.prevYear).children().bind('focusout', function(e) {
					$(this).trigger('hoverend');
				});

				$.alopex.widget.object.addPressHighlight($(that.prevYear).children()[0]);
				$.alopex.widget.object.addHoverHighlight($(that.prevYear).children()[0]);
			}

			//maxdate의 year가 현재 year와 같을 경우
			if (this.maxdate.getFullYear() === this.currentYearView) {
				$.alopex.widget.object._addDisabledStyle($(that.nextYear).children());

			} else {
				$.alopex.widget.object._removeDisabledStyle($(that.nextYear).children());

				$(that.nextYear).bind('click', function(e) {
					var obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);
					obj.currentYearView++;
					return obj._clickYear();
				});

				$(that.nextYear).children().bind('focus', function(e) {
					$(this).trigger('hoverstart');
				});

				$(that.nextYear).children().bind('focusout', function(e) {
					$(this).trigger('hoverend');
				});

				$.alopex.widget.object.addPressHighlight($(that.nextYear).children()[0]);
				$.alopex.widget.object.addHoverHighlight($(that.nextYear).children()[0]);
			}

		},

		/**
		 * 월 컨트롤 버튼의 click handler 설정.
		 */
		_bindMonthHandler: function() {
			var that = this;

			if (this.pickertype !== 'daily' && this.pickertype !== 'weekly') {
				return;
			}

			$(that.prevMonth).unbind('click');
			$(that.nextMonth).unbind('click');
			$(that.prevMonth).children().unbind('focus');
			$(that.prevMonth).children().unbind('focusout');
			$(that.nextMonth).children().unbind('focus');
			$(that.nextMonth).children().unbind('focusout');

			//mindate의 month가 현재 month와 같을 경우
			if (this.mindate.getMonth() === this.currentMonthView && this.mindate.getFullYear() === this.currentYearView) {
				$.alopex.widget.object._addDisabledStyle($(that.prevMonth).children());

			} else {
				$.alopex.widget.object._removeDisabledStyle($(that.prevMonth).children());

				$(that.prevMonth).bind('click', function(e) {
					var obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);
					obj.currentMonthView--;
					return obj._clickMonth();
				});

				$(that.prevMonth).children().bind('focus', function(e) {
					$(this).trigger('hoverstart');
				});

				$(that.prevMonth).children().bind('focusout', function(e) {
					$(this).trigger('hoverend');
				});

				$.alopex.widget.object.addPressHighlight($(that.prevMonth).children()[0]);
				$.alopex.widget.object.addHoverHighlight($(that.prevMonth).children()[0]);
			}

			//maxdate의 month가 현재 month와 같을 경우
			if (this.maxdate.getMonth() === this.currentMonthView && this.maxdate.getFullYear() === this.currentYearView) {
				$.alopex.widget.object._addDisabledStyle($(that.nextMonth).children());

			} else {
				$.alopex.widget.object._removeDisabledStyle($(that.nextMonth).children());

				$(that.nextMonth).bind('click', function(e) {
					var obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);
					obj.currentMonthView++;
					return obj._clickMonth();
				});

				$(that.nextMonth).children().bind('focus', function(e) {
					$(this).trigger('hoverstart');
				});

				$(that.nextMonth).children().bind('focusout', function(e) {
					$(this).trigger('hoverend');
				});

				$.alopex.widget.object.addPressHighlight($(that.nextMonth).children()[0]);
				$.alopex.widget.object.addHoverHighlight($(that.nextMonth).children()[0]);
			}
		},

		/**
		 * 일 버튼의 click handler 설정.
		 */
		_bindDayHandler: function() {
			var that = this;
			var i, x;

			function isValidAnchor(element) {
				if (element.innerHTML === '') {
					return false;
				}
				if (element.className.indexOf('af-disabled Disabled') !== -1) {
					return false;
				}
				return true;
			}

			function _focusHandler(e) {
				if (!isValidAnchor(e.currentTarget)) {
					return false;
				}
				$(this).trigger('hoverstart');
			}
			function _focusoutHandler(e) {
				if (!isValidAnchor(e.currentTarget)) {
					return false;
				}
				$(this).trigger('hoverend');
			}

			function _clickHandler(e) {
			  if (!isValidAnchor(e.currentTarget)) {
			    e.preventDefault();
			    e.stopPropagation();
			    return false;
			  }
			  var obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);
			  var date;
			  var dateArr = [];
			  if (obj.pickertype === 'daily') {
			    if ($(e.currentTarget).attr('href').indexOf('next') == 1) {
			      date = {
			        'year': obj.currentYearView,
			        'month': obj.currentMonthView + 2,
			        'day': this.innerHTML
			      };
			    } else if ($(e.currentTarget).attr('href').indexOf('prev') == 1) {
			      date = {
			        'year': obj.currentYearView,
			        'month': obj.currentMonthView,
			        'day': this.innerHTML
			      };
			    } else {
			      date = {
			        'year': obj.currentYearView,
			        'month': obj.currentMonthView + 1,
			        'day': this.innerHTML
			      };
			    }
			  } else if (obj.pickertype === 'monthly') {
			    date = {
			      'year': obj.currentYearView,
			      'month': this.month,
			      'day': 1
			    };
			  } else if (obj.pickertype === 'weekly') {

			    if ($(this).find('a').eq(0).attr('href').indexOf('prev') == 1){
			      dateArr.push({
			        'year': obj.currentYearView,
			        'month': obj.currentMonthView,
			        'day': $(this).find('a').eq(0).text()
			      });
			    } else {
			      dateArr.push({
			        'year': obj.currentYearView,
			        'month': obj.currentMonthView + 1,
			        'day': $(this).find('a').eq(0).text()
			      });
			    }

			    if ($(this).find('a').eq(6).attr('href').indexOf('next') == 1){
			      dateArr.push({
			        'year': obj.currentYearView,
			        'month': obj.currentMonthView + 2,
			        'day': $(this).find('a').eq(6).text()
			      });
			    } else {
			      dateArr.push({
			        'year': obj.currentYearView,
			        'month': obj.currentMonthView + 1,
			        'day': $(this).find('a').eq(6).text()
			      });
			    }
			  }
			  e.preventDefault();
			  e.stopPropagation();

			  var certainDatesInfo = true;
			  if (obj.pickertype === 'weekly') {
			    for(var i=0;i<$(this).find('a').length;i++) {
			      certainDatesInfo = that._isCertainDate($(this).find('a').eq(i).text());
			      if (certainDatesInfo) {
			        break;
			      }
			    }

			    if (certainDatesInfo) {
			      obj.getWeekDateByFormat(dateArr, obj.dateFormat, certainDatesInfo, e);
			    } else {
			      obj.getWeekDateByFormat(dateArr, obj.dateFormat, false, e);
			    }
			  } else {
			    certainDatesInfo = that._isCertainDate(this.innerHTML);

			    if (certainDatesInfo) {
			      obj.getDateByFormat(date, obj.dateFormat, certainDatesInfo, e);
			    } else {
			      obj.getDateByFormat(date, obj.dateFormat, false, e);
			    }
			  }

			  if (!obj.inline) {
			    if (!certainDatesInfo || certainDatesInfo.isClickToClose) {
			      obj._close(e);
			    }
			  }

			  return false;
			}

			if (this.pickertype === 'weekly') {
			  $(this.calendarBody).on('focus', 'tr', _focusHandler);
			  $(this.calendarBody).on('focusout', 'tr', _focusoutHandler);
			  $(this.calendarBody).on('click', 'tr', _clickHandler);
			  $(this.calendarBody).on('click', 'tr', function(e) {
			    return false;
			  });
			  $.alopex.widget.object.addPressHighlight(this.calendarBody, 'tr');
			  $.alopex.widget.object.addHoverHighlight(this.calendarBody, 'tr');
			} else {
			  $(this.calendarBody).on('focus', 'a', _focusHandler);
			  $(this.calendarBody).on('focusout', 'a', _focusoutHandler);
			  $(this.calendarBody).on('click', 'a', _clickHandler);
			  $(this.calendarBody).on('click', 'a', function(e) {
			    return false;
			  });

			  $.alopex.widget.object.addPressHighlight(this.calendarBody, 'a');
			  $.alopex.widget.object.addHoverHighlight(this.calendarBody, 'a');
			}


		},

		/**
		 * 요일 영역 html 생성 및 바인딩
		 * @return {html} 요일 영역의 html element.
		 */
		_renderWeekdays: function() {
			var that = this;
			var html = document.createDocumentFragment();

			for ( var i = 0; i < that.weekdays.length; i++) {

				//일요일(Sun)을 빨간색으로 표시
				if (i === 0) {
					html.appendChild(that._render('th', {
						className: 'af-datepicker-weekdays holiday Weekdays Holiday'
					}, that.weekdays[i].substring(0, 3)));
				} else if (i !== 0 && i % 6 === 0) {
					html.appendChild(that._render('th', {
						className: 'af-datepicker-weekdays saturday Weekdays Sat'
					}, that.weekdays[i].substring(0, 3)));
				} else {
					html.appendChild(that._render('th', {
						className: 'af-datepicker-weekdays Weekdays'
					}, that.weekdays[i].substring(0, 3)));
				}
			}
			return html;
		},

		/**
		 * 분기 영역 구성.
		 * @return {html} '월'영역을 구성한 html element.
		 */
		_renderQtrly: function() {
			return '';
		},

		/**
		 * 월 영역 구성.
		 * @return {html} '월'영역을 구성한 html element.
		 */
		_renderMonth: function() {
			var i = 0, j = 0, rowNum = 3, colNum = 4, thismonth;
			var html = document.createDocumentFragment();
			for (; i < rowNum; i++) {
				var row = this._render('tr', {
					className: 'af-datepicker-tableRow Row'
				}, '');
				for (j = 0; j < colNum; j++) {
					thismonth = i * 4 + j;

					var month = this._render('a', {
						month: thismonth + 1,
						className: 'af-datepicker-month Month' + ((this._getCurrentMonthToInteger() == thismonth) ? ' af-today Today' : ''),
						href: '#' + (i + j + 1)
					}, this._addLocalePostfix(this._monthToStr(thismonth, true), 'm'));
					if (this._isBelowMinDate(thismonth, 1) || this._isAboveMaxDate(thismonth, 1)) {
						$.alopex.widget.object._addDisabledStyle(month);
						$(month).attr('tabindex', '-1');
					}
					row.appendChild(this._render('td', {
						className: 'af-datepicker-tableCell Cell'
					}, month));
				}
				html.appendChild(row);
			}
			
			this._bindYearHandler();
			this._bindMonthHandler();

			return html;
		},

		/**
		 * 일 영역 구성.
		 * @return {html} '일'영역을 구성한 html element.
		 */
		_renderCalendar: function() {

			var firstOfMonth = new Date(this.currentYearView, this.currentMonthView, 1).getDay();
			var numDays = this._getNumDaysOfMonth();
			var dayCount = 0;
			var html = document.createDocumentFragment();
			var row = this._render('tr');
			var element, i;

			//첫번째 일 이전의 이전달 '일' 영역에 대한 공백
			if (this.showothermonth) {
        // 전월 날짜가져오기
			  var year = this.currentYearView;
			  var prevMonth = this.currentMonthView - 1;
			  if (prevMonth === -1) {
			    prevMonth = 11;
			    year = year - 1;
			  }
			  var prevNumDays = this._getNumDaysOfMonth(year, prevMonth);

			  var prevMonthDay = prevNumDays - firstOfMonth + 1;
			  for (i = 1; i <= firstOfMonth; i++) {
			    element = this._render('td', {
			      className : 'af-datepicker-tableCell Cell'
			    }, this._render('a', {
			      className : 'af-datepicker-prev-month-day PrevMonthDay',
			      value : prevMonthDay,
			      href : '#prev' + prevMonthDay
			    }, prevMonthDay));

			    var certainDateInfo = this._isCertainDateOtherMonth(prevMonthDay, true);

			    if (certainDateInfo) {
			      $(element).children().addClass(certainDateInfo.styleClass);
			      $(element).children().attr('title', certainDateInfo.title);
			    }

			    if (this._isBelowMinDateOtherMonth(prevMonthDay, true) || this._isAboveMaxDateOtherMonth(prevMonthDay, true)) {
			      $.alopex.widget.object._addDisabledStyle($(element).children());
			      $(element).children().attr('tabindex', '-1');
			      
			    }

			    row.appendChild(element);
          
          prevMonthDay++;
          dayCount++;
        }
      } else {
        for (i = 1; i <= firstOfMonth; i++) {
          row.appendChild(this._render('td', {
            className : 'af-datepicker-tableCell Cell'
          }, '&nbsp;'));
          dayCount++;
        }
      }

			for (i = 1; i <= numDays; i++) {

				if (dayCount === 7) {
					html.appendChild(row);
					row = this._render('tr');
					dayCount = 0;
				}

				//일요일일때 날짜를 빨간색으로 표시
				if (dayCount === 0) {
					element = this
							._render(
									'td',
									{
										className: 'af-datepicker-tableCell Cell'
									},
									this
											._render(
													'a',
													{
														className: (i === this._getCurrentDay() && this.currentMonthView === this._getCurrentMonthToInteger() && this.currentYearView === this._getCurrentYear()) ? 'af-datepicker-day af-today Day Today'
																: 'af-datepicker-day holiday Day Holiday',
														value: i,
														href: '#' + i
													}, i));
				} else if (dayCount === 6) {
					element = this
							._render(
									'td',
									{
										className: 'af-datepicker-tableCell Cell'
									},
									this
											._render(
													'a',
													{
														className: (i === this._getCurrentDay() && this.currentMonthView === this._getCurrentMonthToInteger() && this.currentYearView === this._getCurrentYear()) ? 'af-datepicker-day af-today Day Today'
																: 'af-datepicker-day saturday Day Sat',
														value: i,
														href: '#' + i
													}, i));
				} else {
					element = this
							._render(
									'td',
									{
										className: 'af-datepicker-tableCell Cell'
									},
									this
											._render(
													'a',
													{
														className: (i === this._getCurrentDay() && this.currentMonthView === this._getCurrentMonthToInteger() && this.currentYearView === this._getCurrentYear()) ? 'af-datepicker-day af-today Day Today'
																: 'af-datepicker-day Day',
														value: i,
														href: '#' + i
													}, i));
				}

				var certainDateInfo = this._isCertainDate(i);

				if (certainDateInfo) {
				  $(element).children().addClass(certainDateInfo.styleClass);
				  $(element).children().attr('title', certainDateInfo.title);
				}

				if (this._isBelowMinDate(i) || this._isAboveMaxDate(i)) {
				  $.alopex.widget.object._addDisabledStyle($(element).children());
				  $(element).children().attr('tabindex', '-1');
				}

				row.appendChild(element);

				dayCount++;
			}

			//마지막 일 이후의 다음달 '일' 영역에 대한 공백
			if (this.showothermonth) {
			  for (i = 1; i <= (7 - dayCount); i++) {
			    element = this._render('td', {
			      className : 'af-datepicker-tableCell Cell'
			    }, this._render('a', {
			      className : 'af-datepicker-next-month-day NextMonthDay',
			      value : i,
			      href : '#next' + i
			    }, i));

			    var certainDateInfo = this._isCertainDateOtherMonth(i, false);

			    if (certainDateInfo) {
			      $(element).children().addClass(certainDateInfo.styleClass);
			      $(element).children().attr('title', certainDateInfo.title); // title 추가 
			    }

			    if (this._isBelowMinDateOtherMonth(i, false) || this._isAboveMaxDateOtherMonth(i, false)) {
			      $.alopex.widget.object._addDisabledStyle($(element).children());
			      $(element).children().attr('tabindex', '-1');
			    }

			    row.appendChild(element);
			  }
			} else {
			  for (i = 1; i <= (7 - dayCount); i++) {
			    row.appendChild(this._render('td', {
			      className : 'af-datepicker-tableCell Cell'
			    }, '&nbsp;'));
			  }
			}

			html.appendChild(row);

			this._bindYearHandler();
			this._bindMonthHandler();

			return html;
		},
		
		/**
     * Bottom 영역 구성.
     * @return {element} Bottom 영역을 구성한 element.
     */
		_renderBottom: function(bottomDate) {
		  var element = this._render('div',{
		    className: 'af-datepicker-bottom Bottom'
		  });

		  var childEl = this._render('div',{
		    className: 'af-datepicker-childbottom ChildBottom'
		  });
		  element.appendChild(childEl);

		  var todayButton = this._render('button',{
		    className: 'af-datepicker-bottom-button BottomButton'
		  }, this.descTodayBtn);
		  childEl.appendChild(todayButton);

		  function _todayButtonTapHandler(e) {
		    var obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);
		    var date = {};

		    e.preventDefault();
		    e.stopPropagation();

		    if ($.alopex.util.isValid(bottomDate)) {
		      date = {
		          'year': bottomDate.getFullYear(),
		          'month': bottomDate.getMonth() + 1,
		          'day': bottomDate.getDate()
		      };
		    } else {
		      var currentDate = new Date();
		      date = {
		          'year': currentDate.getFullYear(),
		          'month': currentDate.getMonth() + 1,
		          'day': currentDate.getDate()
		      };
		    }
		    obj.getDateByFormat(date, obj.dateFormat, false);

		    if (!obj.inline) {
		      obj._close(e);
		    }
		    return false;
		  }

		  var date = {};
		  if ($.alopex.util.isValid(bottomDate)) {
		    date = {
		        'year': bottomDate.getFullYear(),
		        'month': bottomDate.getMonth() + 1,
		        'day': bottomDate.getDate()
		    };
		  } else {
		    var currentDate = new Date();
		    date = {
		        'year': currentDate.getFullYear(),
		        'month': currentDate.getMonth() + 1,
		        'day': currentDate.getDate()
		    };
		  }
		  var bottomText = this._render('span',{
		    className: 'af-datepicker-bottom-text BottomText'
		  }, this._getFormattedDate(date, this.dateFormat));
		  childEl.appendChild(bottomText);
		  
	    $(todayButton).bind('click', _todayButtonTapHandler);
		  
		  return element;
		},

		/**
		 * DatePicker 초기화
		 *
		 * [Hong-HyunMin 2016.01.29] Datepicker의 위치를 option을 통해 조정 할수 있도록 해달라는 요건 처리.
		 * 해당 기능은, Right기능만을 우선으로 개발 했음.
		 * 
		 * option 에 postionRight를 추가 했음.
		 *
		 */
		_initialise: function(option) {

			var that = this;

			if (this.currentDate < this.mindate) {
				this.currentYearView = this.mindate.getFullYear();
				this.currentMonthView = this.mindate.getMonth();
			} else if (this.currentDate > this.maxdate) {
				this.currentYearView = this.maxdate.getFullYear();
				this.currentMonthView = this.maxdate.getMonth();
			} else {
				this.currentYearView = this._getCurrentYear();// '연도' 라벨의 값
				this.currentMonthView = this._getCurrentMonthToInteger();// '월' 라벨의 값
			}

			this.calendarContainer = this._render('div', {
				className: 'af-datepicker Datepicker'
			});
			if(this.pickertype === 'weekly') {
				$(this.calendarContainer).addClass('Weekly');
			}
			$(this.calendarContainer).attr('data-type', 'af-datepicker');

			if (this.inline) {
				$(this.calendarContainer).attr('data-datepicker-inline', 'true');
				$(this.calendarContainer).addClass(this.datePickerInlineTheme);
			}

			//default 테마 적용.
			$(this.calendarContainer).addClass(this.datePickerTheme);

			//중복 생성 방지를 위해 datepicker_ 를 prefix로 id 부여.
			this.calendarContainer.id = this.calendarContainerId;

			//dstepicker의 head(header) 구성
			var header = this._render('div', {
				className: 'af-datepicker-header Header'
			});

			//연도 영역
			var subheader01 = this._render('div', {
				className: ((this.pickertype === 'daily' || this.pickertype === 'weekly') ? 'af-subHeader-year SubheaderYear' : 'af-subHeader-year-wide SubheaderYearWide')
			});

			//월 영역
			var subheader02 = this._render('div', {
				className: 'af-subHeader-month SubheaderMonth'
			});

			this.prevYear = this._render('span', {
				className: 'af-prev-year PrevYear'
			}, this._render('a', {
				className: 'af-datepicker-control Control',
				value: 'prevYear',
				
				title: this.descPrevYear
			}, ''));
			if (this.selectyear) {
				var content = '';
				var curYear = this.currentYearView;
				//__ALOG(this.mindate, this.maxdate)
				var minYear = (this.mindate === null) ? curYear - 10 : this.mindate.getFullYear();
				var maxYear = (this.maxdate === null) ? curYear + 10 : this.maxdate.getFullYear();
				for ( var i = minYear; i <= maxYear; i++) {
					content += '<option';
					if (i === curYear) {
						content += ' selected';
					}
					content += '>' + this._addLocalePostfix('' + i, 'y') + '</option>';
				}

				this.calendarYear = this._render('select', {
					className: 'af-current-year-select CurrentYearSelect',
					title: this.descYearSelect
				}, '');
				$(this.calendarYear).append(content);

				$(this.calendarYear).bind('change', function(e) {
					var obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);
					obj.currentYearView = parseInt($(e.currentTarget).val(), 10);
					return obj._clickYear();
				});
			} else {
				this.calendarYear = this._render('span', {
					className: 'af-current-year CurrentYear'
				}, this._addLocalePostfix(this.currentYearView, 'y'));
			}
			this.nextYear = this._render('span', {
				className: 'af-next-year NextYear'
			}, this._render('a', {
				className: 'af-datepicker-control Control',
				value: 'nextYear',
				
				title: this.descNextYear
			}, ''));

			//subheader에 연도 영역 append
			subheader01.appendChild(this.prevYear);
			subheader01.appendChild(this.nextYear);
			subheader01.appendChild(this.calendarYear);
			header.appendChild(subheader01);

			if (this.pickertype === 'daily' || this.pickertype === 'weekly') {
				this.prevMonth = this._render('span', {
					className: 'af-prev-month PrevMonth'
				}, this._render('a', {
					className: 'af-datepicker-control Control',
					value: 'prevMonth',
					title: this.descPrevMonth
				}, ''));
				if (this.selectmonth) {
					var content = '';
					for ( var i = 1; i <= 12; i++) {
						content += '<option';
						if (this.months[i-1] === this._getMonthToString(true)) {
							content += ' selected';
						}
						content += '>' + this._addLocalePostfix('' + this.months[i-1], 'm') + '</option>';
					}
					this.calendarMonth = this._render('select', {
						className: 'af-current-month-select CurrentMonthSelect',
						title: this.descMonthSelect
					}, '');
					$(this.calendarMonth).append(content);
					$(this.calendarMonth).bind('change', function(e) {
						var obj = $.alopex.datePickerMap.getObjectByNode(e.currentTarget);
						if (obj.localeInfo === 'en') {
						  obj.currentMonthView = $.inArray($(e.currentTarget).val(), obj.months);
						} else {
						  obj.currentMonthView = parseInt($(e.currentTarget).val(), 10) - 1;
						}
						return obj._clickMonth();
					});
				} else {
					this.calendarMonth = this._render('span', {
						className: 'af-current-month CurrentMonth'
					}, this._addLocalePostfix(this._getMonthToString(true), 'm'));
				}

				this.nextMonth = this._render('span', {
					className: 'af-next-month NextMonth'
				}, this._render('a', {
					className: 'af-datepicker-control Control',
					value: 'nextMonth',
					
					title: this.descNextMonth
				}, ''));

				//subheader에 월 영역 append
				subheader02.appendChild(this.prevMonth);
				subheader02.appendChild(this.nextMonth);
				subheader02.appendChild(this.calendarMonth);
				header.appendChild(subheader02);
			}

			this.calendarContainer.appendChild(header);

			//inline style
			if (!this.inline) {
				this.btn_close = this._render('span', {
					className: 'af-btn-close BtnClose'
				}, this._render('a', {
					className: 'af-datepicker-control Control',
					value: 'close',
					
					title: this.descClose
				}, ''));
				$(this.btn_close).children().bind('click', function(e) { //TODO
					e.preventDefault();
					e.stopPropagation();

					that._close(e);

					return false;
				});
				$(this.btn_close).children().bind('focus', function(e) {
					$(this).trigger('hoverstart');
				});

				$(this.btn_close).children().bind('focusout', function(e) {
					$(this).trigger('hoverend');
				});

				$.alopex.widget.object.addPressHighlight($(this.btn_close).children()[0]);
				$.alopex.widget.object.addHoverHighlight($(this.btn_close).children()[0]);
			}

			if (this.pickertype === 'monthly') {
				//월 영역 생성
				var calendar = this._render('table', {
				  summary: this.descMonthSummary
				});
				var captionSpan = this._render('span', {} , this.descMonthCaption);
        captionSpan.style.cssText = 'visibility:hidden;overflow:hidden;position:absolute;'
          +'top:0;left:0;width:0;height:0;font-size:0;line-height:0;';
        var caption = this._render('caption', {} , captionSpan);
				calendar.appendChild(caption);
				this.calendarBody = this._render('tbody', {}, '');
				this.calendarBody.appendChild(this._renderMonth());
				calendar.appendChild(this.calendarBody);
				this.calendarContainer.appendChild(calendar);

			} else if (this.pickertype === 'quarterly') {

			} else {
				//일 영역 생성
				var calendar = this._render('table', {
					summary : this.descDaySummary
				});
				var captionSpan = this._render('span', {}, this.descDayCaption);
				captionSpan.style.cssText = 'visibility:hidden;overflow:hidden;position:absolute;'
						+ 'top:0;left:0;width:0;height:0;font-size:0;line-height:0;';
				var caption = this._render('caption', {}, captionSpan);
				calendar.appendChild(caption);
				var calendarHeader = this._render('thead', {}, this._render(
						'tr', {}, this._renderWeekdays()));
				calendar.appendChild(calendarHeader);
				this.calendarBody = this._render('tbody', {}, this._renderCalendar());

				calendar.appendChild(this.calendarBody);
				this.calendarContainer.appendChild(calendar);

				if (this.showbottom) {
				  var bottomElement = this._renderBottom(this.bottomdate);
				  this.calendarContainer.appendChild(bottomElement);
				}
			}

			//inline style
			if (!this.inline) {
				this.calendarContainer.appendChild(this.btn_close);
			}
			
			//inline style
			if (!this.inline) {
				$('body').append(this.calendarContainer);
			} else {
				$(this.targetElem).append(this.calendarContainer);
			}
			
			/**
			 * [Hong-HyunMin 2016.01.29] Datepicker의 위치를 option을 통해 조정 할수 있도록 해달라는 요건 처리.
			 * 
			 * option이 존재하는 경우에 
			 * 
			 * [Kim-SoYoung 2016.10.31]
			 *  append 이전 시점에서는 calendar의 width 값을 가져올 수 없어서 positionRight 옵션이 정상 처리되지 않음.
			 *  append 이후에 position 값 설정해야 유효함 
			 */
			if($.alopex.util.isValid(option)){
				//option.postionRight 이 유효한경우에만 실행.
				if($.alopex.util.isValid(option.postionRight)){
					//option.postionRight이 true인 경우에만 실행.
					if(option.postionRight == true){
						//달력이 target element의 오른쪽 끝을 limit로 생성 되도록 함.
						this._setPostionRight(this);
					} else{
						//기본 위치.
						this._setPosition(this);
					}
				} else if ( $.alopex.util.isValid(option.position)){
					this.position = option.position;
					this._setPosition(this, option.position);
				} else{
					//기본 위치.
					this._setPosition(this);
				}
			} else{
				//기본 위치.
				this._setPosition(this);
			}
		},
		
		/**
		 * [Hong-HyunMin 2016.01.29] Datepicker의 위치를 option을 통해 조정 할수 있도록 해달라는 요건 처리.
		 */
		_setPostionRight : function(obj){
			if (obj.inline) {
				return;
			}

			var dialog = $.alopex.widget.dialog;
			var zIndex = 1200;
			if (dialog !== null && window.afDialogNumber > 0) {
				zIndex = dialog.maxZindex + 1;
			}						
			//for mobile phone type
			if (window.browser === 'mobile' && $(window).width() < 768) {

				var centerTop = ($(window).scrollTop()) ? $(window).scrollTop() + ($(window).height() - obj.calendarContainer.offsetHeight) / 2 : document.body.scrollTop +
						($(window).height() - obj.calendarContainer.offsetHeight) / 2;

				var centerLeft = ($(window).scrollLeft()) ? $(window).scrollLeft() + ($(window).width() - obj.calendarContainer.offsetWidth) / 2 : document.body.scrollLeft +
						($(window).width() - obj.calendarContainer.offsetWidth) / 2;

				obj.calendarContainer.style.cssText = 'display: none; position: absolute; z-index: ' + zIndex + '; top: ' + centerTop + 'px; left: ' + centerLeft + 'px;';

				if (!obj.overlayElement) {
					obj.overlayElement = document.createElement('div');
				}

				var overlayHeight = $(document).height();

				obj.overlayElement.style.cssText = 'width:100%; position:absolute;' + 'left:0; margin:0; padding:0; background:#000; opacity:0.5; z-index:1004;' + 'top:0px;' + 'height:' + overlayHeight +
						'px;';
				$('body').append(obj.overlayElement);

			} else {
				var topValue = $(obj.targetElem).offset().top + obj.targetElem.offsetHeight + 5;
				var leftValue = $(obj.targetElem).offset().left;
				
				//Calendar가 표시되어야 할 taget의 넓이, Tooltip position을 응용함.
				var baseWidth = obj.targetElem.offsetWidth;
				var parent = obj.offsetParent;
				while(parent) {
					if(parent == document.body || $(parent).css('position') === 'relative' || $(parent).css('position') === 'absolute') {
						break;
					}
					parent = parent.offsetParent;
				}
				var basePosition = $.alopex.util.getRelativePosition(obj.targetElem); // base엘리먼트의 화면 포지션..
				var coorPosition = $.alopex.util.getRelativePosition(parent); // 엘리먼트 기준.
				var baseLeft = basePosition.left - coorPosition.left;
				
				var calendarWidth = $(obj.calendarContainer).css('width');
				
				leftValue = baseLeft - calendarWidth.split('px')[0] + baseWidth;
				
				if(!$.alopex.util.isNumberType(leftValue)){
					leftValue = $(obj.targetElem).offset().left;
				}
				
				if ($(obj.calendarContainer).width() != $(window).width() &&  // datepicker 스타일이 적용안된 경우.
						(leftValue + $(obj.calendarContainer).width()) > $(window).width()) { //DatePicker가 현재window 너비 밖으로 벗어 날 경우
					leftValue -= (leftValue + $(obj.calendarContainer).width() + 10) - $(window).width();
				}
				
				if(topValue + obj.calendarContainer.offsetHeight >= $(document).height()) {
					//place datepicker upward if its bottom position exceeds document height
					topValue = $(obj.targetElem).offset().top - 5 - obj.calendarContainer.offsetHeight;
				}

				obj.calendarContainer.style.cssText = 'display: none; position: absolute; z-index:' + zIndex + '; top: ' + topValue + 'px; left: ' + leftValue + 'px;';
			}

			$(obj.calendarContainer).css('display', 'block');
		},

		_setPosition: function(obj, position) {

			if (obj.inline) {
				return;
			}

			var dialog = $.alopex.widget.dialog;
			var zIndex = 1200;
			if (dialog !== null && window.afDialogNumber > 0) {
				zIndex = dialog.maxZindex + 1;
			}
			//for mobile phone type
			if (window.browser === 'mobile' && $(window).width() < 768) {

				var centerTop = ($(window).scrollTop()) ? $(window).scrollTop() + ($(window).height() - obj.calendarContainer.offsetHeight) / 2 : document.body.scrollTop +
						($(window).height() - obj.calendarContainer.offsetHeight) / 2;

				var centerLeft = ($(window).scrollLeft()) ? $(window).scrollLeft() + ($(window).width() - obj.calendarContainer.offsetWidth) / 2 : document.body.scrollLeft +
						($(window).width() - obj.calendarContainer.offsetWidth) / 2;

				obj.calendarContainer.style.cssText = 'display: none; position: absolute; z-index: ' + zIndex + '; top: ' + centerTop + 'px; left: ' + centerLeft + 'px;';

				if (!obj.overlayElement) {
					obj.overlayElement = document.createElement('div');
				}

				var overlayHeight = $(document).height();

				obj.overlayElement.style.cssText = 'width:100%; position:absolute;' + 'left:0; margin:0; padding:0; background:#000; opacity:0.5; z-index:1004;' + 'top:0px;' + 'height:' + overlayHeight +
						'px;';
				$('body').append(obj.overlayElement);

			} else {
				var topValue = $(obj.targetElem).offset().top + obj.targetElem.offsetHeight + 5;
				var leftValue = $(obj.targetElem).offset().left;
				
				var parent = obj.offsetParent;
				while(parent) {
					if(parent == document.body || $(parent).css('position') === 'relative' || $(parent).css('position') === 'absolute') {
						break;
					}
					parent = parent.offsetParent;
				}

				if ($(obj.calendarContainer).width() != $(window).width() &&  // datepicker 스타일이 적용안된 경우.
						(leftValue + $(obj.calendarContainer).width()) > $(window).width()) { //DatePicker가 현재window 너비 밖으로 벗어 날 경우
					leftValue -= (leftValue + $(obj.calendarContainer).width() + 10) - $(window).width();
				}
				if(topValue + obj.calendarContainer.offsetHeight >= $(document).height()) {
					//place datepicker upward if its bottom position exceeds document height
					topValue = $(obj.targetElem).offset().top - 5 - obj.calendarContainer.offsetHeight;
				}
				if ( $.alopex.util.isValid(position) ){
					var baseWidth = obj.targetElem.offsetWidth;
					var	baseHeight = obj.targetElem.offsetHeight;
					
					var basePosition = $.alopex.util.getRelativePosition(obj.targetElem); // base엘리먼트의 화면 포지션..
					var coorPosition = $.alopex.util.getRelativePosition(parent); // 엘리먼트 기준.
					var baseLeft = basePosition.left - coorPosition.left;
					var baseTop = basePosition.top - coorPosition.top;
					
					var calendarWidth = $(obj.calendarContainer).outerWidth();
					var calendarHeight = $(obj.calendarContainer).outerHeight();
					
					if ( position.toLowerCase().indexOf("right") >= 0 ){
						if($(obj.targetElem).parent().hasClass("Dateinput") && $(obj.targetElem).next(".Calendar").length ){
							var calendarBtn = $(obj.targetElem).next(".Calendar")[0];
							var $calendarBtn = $(calendarBtn);
							basePosition = $.alopex.util.getRelativePosition(calendarBtn); // base엘리먼트의 화면 포지션..
							baseLeft = basePosition.left - coorPosition.left;
							leftValue = baseLeft + $calendarBtn.outerWidth() - calendarWidth;
						} else {
							leftValue = baseLeft - calendarWidth + baseWidth;
						}
					}
					if (  position.toLowerCase().indexOf("top") >= 0 ) {
						topValue = baseTop - calendarHeight - 5;
					}
				}

				obj.calendarContainer.style.cssText = 'display: none; position: absolute; z-index:' + zIndex + '; top: ' + topValue + 'px; left: ' + leftValue + 'px;';
			}

			$(obj.calendarContainer).css('display', 'block');
		},

		/**
		 * 같은 DatePicker가 이미 열려있는지 체크
		 * @param {string} id : DatePicker 위치의 기준이 되는 target element의 id.
		 * @return {Boolean} : DatePicker가 현재 열려 있는지 여부.
		 */
		_isOpened: function(id) {

			var objId = 'datepicker_' + id;

			if ($.alopex.datePickerMap.datePickerObj.hasOwnProperty(objId)) {
				return true;
			} else {
				return false;
			}
		},

		_mouseDownHandler: function(e) {

			var isDatePicker = false;
			var temp = $(e.target);

			for ( var i = 0; i < 7; i++) {

				if (temp.attr('data-type') === 'af-datepicker' && temp.attr('data-datepicker-inline') !== 'true') {
					isDatePicker = true;
					break;
				}

				temp = temp.parent();
			}

			if (!isDatePicker) {
				for ( var key in $.alopex.datePickerMap.datePickerObj) {
					$.alopex.datePickerMap.datePickerObj[key]._close();
				}
			} else {
				return;
			}
		},

		_resizeHandler: function(e) {
			for ( var key in $.alopex.datePickerMap.datePickerObj) {
				$.alopex.datePickerMap.datePickerObj[key]._setPosition($.alopex.datePickerMap.datePickerObj[key], $.alopex.datePickerMap.datePickerObj[key].position);
			}
		},

		_onHashChange: function(e) {
			for ( var key in $.alopex.datePickerMap.datePickerObj) {
				$.alopex.datePickerMap.datePickerObj[key]._close();
			}
		}

	};

	/**
	 * datepicker 열기
	 */
	$.fn.showDatePicker = function(callback, option) {

		if (!$.alopex.util.isValid(callback) || typeof (callback) !== 'function') {
			//      __ALOG('[DatePicker Error] callback is null or' + 'it is not function type');
			return;
		}

		if (!$.alopex.util.isValid(option)) {
			option = {};
		}

		for ( var key in $.alopex.datePickerMap.datePickerObj) {
			if (!option.inline) {
				$.alopex.datePickerMap.datePickerObj[key]._close();
			}
		}

		var that = $.extend(true, {}, $.alopex.datePicker);
		
//		아래와 같은 setup을 통해 locale을 설정한 것을 내부용 변수 localeInfo에 저장해준다.
//		이 후 부터는 내부적으로 localeInfo를 사용한다.
//		$a.setup("datepicker", {
//			  locale: "zh"
//		  });
		that.localeInfo = that.locale;

		that.targetElem = this[0];
		that._callback = callback;
		that.calendarContainerId = 'datepicker_' + this[0].id;

		that.setDefaultDate(option);
		that.setLocale(option);
		that.setFormat(option);
		that.setCertainDates(option);
		that.setThemeClass(option);
		that.setMenuSelect(option);
		that.setMinDate(option);
		that.setMaxDate(option);
		that.setInline(option);
		that.setPickerType(option);
		if (option.pickertype === 'weekly') {
		  option.showOtherMonth = true;
		  option.showbottom = false;
		}
		that.setShowOtherMonth(option);
		that.setShowBottom(option);
		that.setBottomDate(option);
		that.setWeekPeriod(option);
		
		/**
		 * [Hong-HyunMin 2016.01.29] Datepicker의 위치를 option을 통해 조정 할수 있도록 해달라는 요건 처리.
		 * 해당 기능은, Right기능만을 우선으로 개발 했음.
		 */
		that._initialise(option);
		that._bindYearHandler();
		that._bindMonthHandler();
		that._bindDayHandler();

		//modal style
		if (!that.inline) {
			//for web or tablet type
			if (!(window.browser === 'mobile' && $(window).width() < 768)) {
				$(document.body).bind('pressed', that._mouseDownHandler);
				$(window).bind('hashchange', that._onHashChange);
			}

			$(window).bind('resize', that._resizeHandler);
			$(document.body).bind('keydown', {
				obj: that
			}, that._addKeyEvent);

			$(that.calendarContainer).attr('tabindex', 0);
			$(that.calendarContainer).focus();

			$(that.targetElem).bind('pressed', function(e) {
				e.stopPropagation();
			});
		}

		$(that.calendarContainer).bind('selectstart dragstart', function(e) {
			return false;
		});

		$.alopex.datePickerMap.setObject(that.calendarContainerId, that);
	};

	/**
	 * datepicker 닫기
	 */
	$.fn.closeDatePicker = function() {

		if ($.alopex.datePicker._isOpened(this[0].id)) {
			var obj = $.alopex.datePickerMap.getObjectById(this[0].id);
			obj._close();
		}
	};

	$.alopex.registerSetup('datePicker', function(option) {
		$.extend($.alopex.datePicker, option);
	});
	$.alopex.registerSetup('datepicker', function(option) {
		$.extend($.alopex.datePicker, option);
	});

})(jQuery);