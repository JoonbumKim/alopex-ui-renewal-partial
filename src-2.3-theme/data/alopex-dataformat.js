!function($) {
	
	var FORMATTER_ATTRIBUTE = 'data-bind-format';
	$(document).ready(function(){
		$(document.body).on('focus', '['+FORMATTER_ATTRIBUTE+']', function(e) {
			var element = e.currentTarget;
			var unformatted = $.alopex.unformat(element.value, $(element).attr(FORMATTER_ATTRIBUTE));
			element.value = unformatted;
		});
		
		$(document.body).on('blur', '['+FORMATTER_ATTRIBUTE+']', function(e) {
			var element = e.currentTarget;
			var formatted = $.alopex.format(element.value, $(element).attr(FORMATTER_ATTRIBUTE));
			element.value = formatted;
		});
	});
	
	$.alopex.format = function(text, formatterName) {
		if($.alopex.Formatter[formatterName]) {
			return $.alopex.Formatter[formatterName].toFormat(text);
		} else {
			return text;
		}
	};
	
	$.alopex.unformat = function(text, formatterName) {
//		if($.alopex.Formatter[formatterName] && $.alopex.Formatter[formatterName].validate()) {
		if($.alopex.Formatter[formatterName]) {
			return $.alopex.Formatter[formatterName].toValue(text);
		} else {
			return text;
		}
	};
	
	$.alopex.Formatter = {};
	
	/**
	 * 10000000 <-> 10,000,000
	 */
	$.alopex.Formatter.currency = {
		toFormat: function(text) {
			var splitted,
				charArray,
				i, formatted, filtered;
			filtered = text.toString().replace(/[^0-9\.]/gi, '');
			if(filtered === text.toString() && (filtered.match(/\./gi) === null || filtered.match(/\./gi).length===1)) { //
				splitted = text.toString().split('.');
				charArray = splitted[0].split('');
			} else {
				return text;
			}
			
			for(i=charArray.length-3;i>0;i-=3) {
				charArray.splice(i, 0, ',');
			}
			formatted = charArray.join('');
			if(splitted.length == 2) {
				formatted += formatted[1];
			}
			return formatted;
		},
		toValue: function(formatted) {
			return formatted.replace(new RegExp(',', 'g'), '');
		},
		validate: function(ch) {
			if (ch < 32 || ch >= 48 && ch <= 57 || ch === 127) {
				return true;
			}
			return false;
		}
	};

	/**
	 * 10000000 <-> $10,000,000
	 */
	$.alopex.Formatter.dollar = {
		toFormat: function(str) {
			if (isNaN(parseInt($.alopex.Formatter.currency.toFormat(str)))) {
				return str;
			} else {
				return '$' + $.alopex.Formatter.currency.toFormat(str);
			}
		},
		toValue: function(formatted) {
			return $.alopex.Formatter.currency.toValue(formatted.replace('$', ''));
		},
		validate: function(ch) {
			return $.alopex.Formatter.currency.validate(ch);
		}
	};
	
	$.alopex.Formatter.date = {
		normalize: function() {
			return 'yyyy/MM/dd';
		},
		toFormat: function(str) {
			var match = str.match(/(\d{4})(\d{2})(\d{2})/);
			if ( match ){
				return  match[1] + '/' + match[2] + '/' + match[3];
			} else {
				return '';
			}
		},
		toValue: function(formatted) {
			//return formatted;
			return formatted.replace(new RegExp('/', 'g'), '');
		},
		validate: function(ch) {
			var match = ch.match(/(\d{4})(\d{2})(\d{2})/);   
			
			var dtYear = match[1];  
			var dtMonth = match[2];
			var dtDay= match[3];

		    if (dtMonth < 1 || dtMonth > 12) 
		        return false;
		    else if (dtDay < 1 || dtDay> 31) 
		        return false;
		    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
		        return false;
		    else if (dtMonth == 2) 
		    {
		        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
		        if (dtDay> 29 || (dtDay ==29 && !isleap)) 
		                return false;
		    }
		    return true;
		}
	};
	
	$.alopex.Formatter.time = {
			normalize : function(){
				return 'hh:mm:ss';
			},
			toFormat: function(str) {
				var match = str.match(/(\d{2})(\d{2})(\d{2})/);
				if ( match ){
					return  match[1] + ':' + match[2] + ':' + match[3];
				} else {
					return '';
				}
			},
			toValue: function(formatted) {
				//return formatted;
				return formatted.replace(new RegExp(':', 'g'), '');
			},
			validate: function(ch) {
				var match = str.match(/(\d{2})(\d{2})(\d{2})/);
				
				var HH = match[1];  
				var MM = match[2];
				var SS= match[3];

			    if (HH < 0 || HH > 24) 
			        return false;
			    else if (MM < 0 || MM > 59) 
			        return false;
			    else if (SS < 0 || SS > 59) 
			        return false;
			    return true;
			}
		};
	
	
	$.alopex.addFormatter = function(formatter) {
		$.extend(true, $.alopex.Formatter, formatter);
	};
	
}(jQuery);