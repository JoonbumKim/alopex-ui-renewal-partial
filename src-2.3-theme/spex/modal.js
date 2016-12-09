!function($) {
	$.extend($.alopex, {
		
		alopex_blockTargetParent: null,
		/**
		 * 화면에 모달뷰 띄우는 함수.
		 */
		block: function(targetParent, blockname) {
			var $html, $body;
			
			var targetParentScrollTop = 0;
			
			if ($.alopex.util.isValid(targetParent.document)) {
				$.alopex.alopex_blockTargetParent = targetParent.document;
				$html = $(targetParent.document).find('html');
				$body = $(targetParent.document).find('body');
				
				/**
				 * [Hong-HyunMin 2016.01.28] window modal기능을 사용시에 block위치가 이상한 경우에 대한 처리.
				 * document.body.scrollTop 은 스크롤시에 페이지의 상단의 위치값을 반환하거나 부여한다.
				 * 하지만 HTML 코드 상단에 DTD 가 선언되어 있다면 scrollTop이 재구실을 못해버리는 문제가 발생된다.
				 * document.documentElement.scrollTop을 사용하려 하나, documentElement는 크롬에서 문제 발생으로 인한 분기 처리.
				 */
				var ua = window.navigator.userAgent;
				if(ua.indexOf('Chrome') != -1) {
					targetParentScrollTop = $body[0].scrollTop;
				}
				else {
					targetParentScrollTop = targetParent.document.documentElement.scrollTop;
				}
			} else {
				$html = $('html');
				$body = $('body');
			}

			var $modalview = $('<div></div>').attr('data-alopexmodal', 'true').appendTo($body);
			if(blockname){
				$modalview.attr("data-blockname", blockname);
			}
			$modalview.css({
				"position": "absolute",
				"top": targetParentScrollTop,
				"left": "0",
//				"width": $(targetParent).width() + "px",
//				"height": $(targetParent).height() + "px",
				"width": "100%",
				"height": "100%",
				"z-index": "9999",
				"opacity": "0.7",
				"background-color": "#111"
			});

			$.alopex.__htmlHeight = $html[0].style.height;
			$.alopex.__htmlWidth = $html[0].style.width;
			$.alopex.__bodyHeight = $body[0].style.height;
			$.alopex.__bodyWidth = $body[0].style.width;
			$html.css({
				height: '100%',
				width: '100%'
			});
			$body.css({
				height: '100%',
				width: '100%',
				overflow: 'hidden'
			});

			$modalview.on('mousedown.alopexbloack mouseup.alopexblock scroll.alopexblock', function(e) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			});
		},

		/**
		 * 화면에 있는 모달뷰 제거하는 함수.
		 */
		unblock: function(blockname) {
			var selector = blockname ? 'div[data-blockname=' + blockname + ']' : 'div[data-alopexmodal]';
			
			var $html, $body;
			if ($.alopex.util.isValid($.alopex.alopex_blockTargetParent)) {
				$html = $($.alopex.alopex_blockTargetParent).find('html');
				$body = $($.alopex.alopex_blockTargetParent).find('body');
			} else {
				$html = $('html');
				$body = $('body');
			}

			$html[0].style.height = ($.alopex.__htmlHeight) ? $.alopex.__htmlHeight : '';
			$html[0].style.width = ($.alopex.__htmlWidth) ? $.alopex.__htmlWidth : '';
			$body[0].style.height = ($.alopex.__bodyHeight) ? $.alopex.__bodyHeight : '';
			$body[0].style.width = ($.alopex.__bodyWidth) ? $.alopex.__bodyWidth : '';
			$body.css({overflow: ''});

			$($.alopex.alopex_blockTargetParent).find(selector).remove();
		}
	});
}(jQuery);
