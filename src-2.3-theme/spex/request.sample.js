//
//!function($) {
//
//	/**
//	 * 공통 설정 부분.
//	 * before : 전처리, 
//	 * after : success 판단 여부 처리 
//	 * success : 성공 시 공통으로 처리해주는 후처리. 
//	 * url : "" or function() {return "http://localhost:9000";}
//	 * method : "GET" or "POST" or function() { return "GET";}
//	 */
//	$.alopex.request.setup({
//		platform: 'NEXCORE.J2EE',
//		//url : "http://150.28.65.2:7001/web/stand.jmd",
//		/* 조건에 따라 다른 url에 지정이 가능하다. */
//		url: function() {
//			if(true){
//				return "http://150.28.65.2:7001/web/stand.jmd";
//			}
//			return 'dddd'
//		},
//		//*/
//		method : "POST",
//		timeout: 3000,
//		before : function(id, option) { // before
//			// 전처리기.
//			$('body').progress(); //progress bar 시작
//		},
//		after : function() {
//			// response 받아서 여기서 성공판단.
//			log('after ==== ');
//			$('body').progress().remove();  //progress 종료
//		},
//		success : function() {
//			
//		},
//		fail: function(res) {
//			$('body').progress().remove();  //progress 종료
//			log('errorcode = ', res);
//			alert( ' FAIL! ' ); 
//		},
//		error  : function() {
//			$('body').progress().remove();  //progress 종료
//			log('errorcode = ' + this.status + ' message = ' + this.statusText);
//			alert( ' Error! ' ); 
//			
//		}
//	});
//}(jQuery);
