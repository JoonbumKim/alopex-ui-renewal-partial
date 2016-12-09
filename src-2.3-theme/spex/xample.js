!function($) {
	/**
	 * 공통 설정 부분.
	 * before : 전처리, 
	 * after : success 판단 여부 처리 
	 * success : 성공 시 공통으로 처리해주는 후처리. 
	 * url : "" or function() {return "http://localhost:9000";}
	 * method : "GET" or "POST" or function() { return "GET";}
	 */
	$.alopex.request.setup({
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
//		after : function(res) {
//			this.isSuccess = true | false;
//		},
//		success : function(res) {
//		},
//		fail: function(res) {
//		},
//		error  : function(err) {
//		}
	});
	
	
	$.alopex.navigate.setup({
		/**
		 * 이 함수를 통해 navigate 함수의 경로가 바뀌는 것을 조정할 수 있습니다.
		 */
		url: function(url, param) {
			var targetUrl = url;
//			var baseDirectory = '/html/';
//			var semanticUrl = window.location.href.split('?')[0];
//			semanticUrl = semanticUrl.replace('//', '');
//			semanticUrl = semanticUrl.substring(semanticUrl.indexOf('/') + 1); // protocol & domain 부분 제외. 절대 경로. '/FM/dd/
//			var currentUrlPath = semanticUrl.split('/');
//			var urlPath = targetUrl.split('/');
//			if(!$.alopex.util.isValid(currentUrlPath[currentUrlPath.length-1])) {
//				currentUrlPath.pop();
//			}
//			if(!$.alopex.util.isValid(urlPath[urlPath.length-1])) {
//				urlPath.pop();
//			}
//			var extension = '';
//			var path = currentUrlPath[currentUrlPath.length-1];
//			if(path.split('.').length>1) {
//				extension = path.split('.')[path.split('.').length-1].toLowerCase().trim();
//			}
//			var hasHTMLExtension = (extension == 'html');
//			
//			if(url.indexOf('/') == 0) { // 절대 경로.
//				if(currentUrlPath.length == urlPath.length) { // 절대 경로로 navigate함수 호출하고, 그에 따라 이동.
//					// do Nothing!
//				} else { // 모바일 프레임워크와 같이 /html/ 디렉토리가 기준이 되어 이동하는 케이스.
//					targetUrl = (baseDirectory + targetUrl);
//					if(hasHTMLExtension) { 
//						// Controller 사용 시 html확장자를 가지고 있는 경우, 
//						// 이동 기준이 되는 디렉토리가 html 폴더 기준으로 이동하는 것이 표준.
//						targetUrl += (targetUrl.lastIndexOf('.html') + 5 == targetUrl.length? '': '.html');
//					}
//				}
//			} else {
//				
//			}
			
			
			return targetUrl;
		}
	});
}(jQuery);



