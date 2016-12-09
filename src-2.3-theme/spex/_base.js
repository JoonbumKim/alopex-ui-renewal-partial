/**
 * _base.js 는 alopex-client.js 내부에서 사용하는 함수 및 변수들 정의한 부분. 
 * @param $
 */
!function($) {
	var eventname = 'ready';
	window.isAlopexReady = false;
	
	if(window.alopexController) {
		eventname = 'alopexready';
	}
	$(document).on(eventname, function() {
		window.isAlopexReady = true;
	});
	
	
}(jQuery);



!function($) {
	$.extend($.alopex, {
		session: function() {
			
			if (isAlopexWindowPopup()) {
				var $parent = window.opener.$a;
				return $parent.session.apply(this, arguments);
			} else if (checkAlopexWindowParent() && window.parent && window.parent != window && window.parent.$a) {
				var $parent = window.parent.$a;
				return $parent.session.apply(this, arguments);
			} else {
				if (arguments.length == 1) {
					return memoryPreference.get(arguments[0]);
				} else if (arguments.length > 1) {
					memoryPreference.put.apply(memoryPreference, arguments);
				}
			}
		},
		
		cookie: function() {
			if (arguments.length == 1) {
				return preference.get(arguments[0]);
			} else if (arguments.length > 1) {
				preference.put.apply(preference, arguments);
			}
		}
	});
	$.alopex.session.clear = function() {
		if(arguments.length === 0){
			memoryPreference.removeAll();
		}
		else if(arguments.length === 1){
			memoryPreference.remove(arguments[0]);
		}
	};
	$.alopex.cookie.clear = function() {
		preference.removeAll();
	};
}(jQuery);

!function($) {
	$.alopex.validator = window.Validator,
	window.$a = $.alopex;
}(jQuery);
