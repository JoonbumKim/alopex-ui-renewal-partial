(function($) {

	$.alopex.widget.daterange = $.alopex.inherit($.alopex.widget.object, {
	  widgetName: 'daterange',
	  defaultClassName: 'af-daterange Daterange',
	  setters: ['daterange', 'setEnabled', 'clear', 'refresh'],
	  getters: [],
	  
	  classNames: {
		  startdate: 'Startdate',
		  enddate: 'Enddate'
	  },

	  id_startdate: 'startdate',
	  id_enddate: 'enddate',
	  id_widget: 'daterange',

	  properties: {
	    date: new Date(),
	    format: 'yyyy-MM-dd',
	    selectyear: false,
	    selectmonth: false,
	    pickertype: 'daily',
	    autodisable: true,
	    resetbutton: false,
	    callback: null,
	    blurcallback: null,
	    placeholder: true
	  },

	  init: function(el, options) {
		  var $el = $(el);
		  el.options = $.extend(true, {}, this.properties, options);
		  $.alopex.widget.dateinput.refresh_format(el, options);
		  
		  if (el.options.pickertype == 'weekly') {
		    el.options.showothermonth = true;
		  }
		  el._start = $el.find('[data-role="' + this.id_startdate + '"], .' + this.classNames.startdate);
		  el._end = $el.find('[data-role="' + this.id_enddate + '"], .' + this.classNames.enddate);

		  el._start.attr('data-type', 'dateinput').dateinput($.extend(true, {}, el.options, {callback: this._startEventHandler}));
		  el._end.attr('data-type', 'dateinput').dateinput($.extend(true, {}, el.options, {callback: this._endEventHandler}));
//		  el._start.add(el._end).on('blur', {callback: el.options.blurcallback}, function(e) {
//		  var el = $(e.currentTarget).closest('[data-type="daterange"]')[0];
//		  e.data.callback.call(el);
//		  });
		  
		  if(el.options.resetbutton) {
		    if(el._start.length>0 && el._start[0].resetbutton && el._start[0].resetbutton.length > 0) {
		      el._start[0].resetbutton[0].daterange = el;
		    }
		    if(el._end.length>0 && el._end[0].resetbutton && el._end[0].resetbutton.length > 0) {
		      el._end[0].resetbutton[0].daterange = el;
		    }
		  }
		  this.setEnabled(el, el.options.enabled);
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
		// datepicker click 을 통하지 않고, 동적으로 date가 입력된 경우 체크하여 min/max date에 반영시킨다.
		_dynamicBindingCheck: function(el){
			var startDate = $(el._start).find('input').val();
			var endDate = $(el._end).find('input').val();
			var result = {};
			if ($.alopex.util.isValid(startDate)) {
				//$.extend(true, result, {mindate: $a.widget.daterange._generateDate(el, startDate)});
				$.extend(true, result, {mindate: $a.widget.dateinput.generateDate(el, startDate)});
			}else{
				// '' 값도 추가한다. 동적으로 ''값이 된 경우, 이에 맞게 min/max를 없애줘야 한다.
				$.extend(true, result, {mindate: ''});
			}
			
			if ($.alopex.util.isValid(endDate)) {
				//$.extend(true, result, {maxdate: $a.widget.daterange._generateDate(el, endDate)});
				$.extend(true, result, {maxdate: $a.widget.dateinput.generateDate(el, endDate)});
			}else{
				// '' 값도 추가한다. 동적으로 ''값이 된 경우, 이에 맞게 min/max를 없애줘야 한다.
				$.extend(true, result, {maxdate: ''});
			}
			// result를 넘겨 dateinput에서 min/max를 update 해준다.
			return result;
		},
		refresh: function(el) {
		    var startDate = $(el._start).val();
		    var endDate = $(el._end).val();
		    if ($.alopex.util.isValid(endDate)) {
		      $(el._start).update({
		        'maxdate': $a.widget.daterange._generateDate(el, endDate)
		      });
		    }
		    if ($.alopex.util.isValid(startDate)) {
		      $(el._end).update({
		        'mindate': $a.widget.daterange._generateDate(el, startDate)
		      });
		    }
		},
		
		_startEventHandler: function(date, datestr, certainDatesName, certainDatesInfo, e) {
		  var el = $(this).closest('[data-type="daterange"], .'+$.alopex.config.defaultComponentClass.daterange)[0];
		  // var format = el.options.format;
		  // var seperator = format.replace('yyyy', '').replace('MM', '').replace('dd', '').substring(0,1);

		  if(el.options.autodisable) {
		    if (el.options.pickertype == 'weekly') {
		      $(el._start).findAll('input').val(datestr['startdate']);
		      $(el._end).findAll('input').val(datestr['enddate']);
		    } else {
		    	
		    	if($(el._start).find("input").val() > $(el._end).find("input").val()){
		    		$(el._end).find("input").val("");
		    	}
		    	if(!el._end.hasClass("NoLimit")){
		    		var dateObj = new Date(date.year, Number(date.month)-1, date.day);
				      //var dateObj = $.alopex.widget.daterange._getDate(el, datestr, seperator);
				      el._end.update({mindate: dateObj});  
		    	}
		    }
		  }
		  if(el.options.callback) {
		    el.options.callback.call(el, date, datestr);
		  }
		},

		_endEventHandler: function(date, datestr, certainDatesName, certainDatesInfo, e) {
		  var el = $(this).closest('[data-type="daterange"], .'+$.alopex.config.defaultComponentClass.daterange)[0];
		  // var format = el.options.format;
		  // var seperator = format.replace('yyyy', '').replace('MM', '').replace('dd', '').substring(0,1);

		  if(el.options.autodisable) {
		    if (el.options.pickertype == 'weekly') {
		      $(el._start).findAll('input').val(datestr['startdate']);
		      $(el._end).findAll('input').val(datestr['enddate']);
		    } else {
		    	if($(el._start).find("input").val() > $(el._end).find("input").val()){
		    		$(el._start).find("input").val("");
		    	}
		    	if(!el._start.hasClass("NoLimit")){
			      var dateObj = new Date(date.year, Number(date.month)-1, date.day);
			      //var dateObj = $.alopex.widget.daterange._getDate(el, datestr, seperator);
			      el._start.update({maxdate: dateObj});
		    	}
		    }
		  }

		  if(el.options.callback) {
		    el.options.callback.call(el, date, datestr, certainDatesName, certainDatesInfo, e);
		  }
		},

		setEnabled: function(el, flag) {
			flag = $.alopex.util.parseBoolean(flag);
			el._start.setEnabled(flag);
			el._end.setEnabled(flag);
		},

		clear: function(el) {
		  $(el._start).clear();
		  $(el._end).clear();
		  $(el._start).update({maxdate: ''});
		  $(el._end).update({mindate: ''});
		}
	});
	
//	$.alopex.registerSetup('daterange', function(option) {
//		$.alopex.widget.daterange.properties = option;
//	});

})(jQuery);