(function($) {
	// MessageBox 호출
	var imagepath = '/Resources/www/build/css/images/';

	function messagebox(type, option) {
		if($('.af-dialog-mask:hidden').length != 0)
			$('.af-dialog-mask:hidden').remove();
		if ($(document).find('.messagebox').length != 0)
			return;
		var icon;
		var msg = '';
		if (typeof (option) == 'object') {
			msg = option.msg
		} else {
			msg = option
		}
		var markup = '<div id="dialog_messagebox" data-type="dialog" class="messagebox container">' + '<div class="messageWrap clearfix">'
			+ '<div class="msg_icon ' + type + '"></div>' + '<div class="msg_txt" id="text"></div>' + '</div>' + '<div class="msgBtnWrap">'
			+ '<button id="msgBtn" data-type="button"><span class="btn_icon"></span><span class="btn_txt">OK</span></button>' + '</div>'
			+ '</div>';
		var $dialog = $(markup).appendTo(document.body).convert().open({
			modal : true
		});
		var $label = $dialog.find('#text');
		$label.html(msg.replace('\n', '<br>'));
		//$label.css('margin-top', (($label.height() - 10) * -1 / 2) + 'px');

		$('#msgBtn').on('click', function(e) {
			$dialog.close().remove();
		}).focus();
		
		$('#dialog_messagebox').close(function() {
			$('#dialog_messagebox').remove();
			if(option.ok)
				option.ok();
		});
	};

	function confirmbox(option) {
		if($('.af-dialog-mask:hidden').length != 0)
			$('.af-dialog-mask:hidden').remove();
		
		if ($(document).find('.messagebox').length != 0)
			return;
		
		var icon;
		var msg;

		var markup = '<div id="dialog_messagebox" data-type="dialog" class="messagebox container">' + '<div class="messageWrap clearfix">'
			+ '<div class="msg_icon confirm"></div>' + '<div class="msg_txt" id="text"></div>' + '</div>' + '<div class="msgBtnWrap">'
			+ '<button id="msgBoxOk" class="btn_common black noicon"><span class="btn_icon"></span><span class="btn_txt">OK</span></button>'
			+ '<button id="msgBoxCancel" class="btn_common black noicon"><span class="btn_icon"></span><span class="btn_txt">Cancel</span></button>' + '</div>'
			+ '</div>';

		if (option.id != undefined) {
			$a.service("SKENS.CM.Biz.MsgMgmtBiz#GetMsgDetail", {
				MESSAGEID : option.id
			}, function(ds) {
				if (ds.recordSets.table1.nc_list.length != 0) {
					msg = ds.recordSets.table1.nc_list[0].MESSAGEBODY;

					var $dialog = $(markup).appendTo(document.body).convert().open({
						modal : true
					});;
					var $label = $dialog.find('#text');
					$label.html(msg.replace('\n', '<br>'));
					
					var cancelCallback;
					if (option.cancel) {
						cancelCallback = option.cancel;
					}
					// ok버튼
					$('#msgBoxOk').on('click', function(e) {
						if (option.ok) {
						    $('#dialog_messagebox').close().remove();
						    option.ok();
						} else {
							$('#dialog_messagebox').close().remove();
						}
					}).focus();
					
					
					// 취소버튼
					$('#msgBoxCancel').on('click', function() {
					    $('#dialog_messagebox').close().remove();
					});
					
					$('#dialog_messagebox').close(function() { // close 시 콜백함수 등록.
						$('#dialog_messagebox').remove();
						if (cancelCallback) {
							cancelCallback();
						}
					});
					
				} else {
					messagebox('error', '잘못된 Message ID를 입력했습니다.');
				}
			});
		} else if (option.msg != undefined) {
			msg = option.msg

			var $dialog = $(markup).appendTo(document.body).convert().open({
				modal : true
			});;
			var $label = $dialog.find('#text');
			$label.html(msg.replace('\n', '<br>'));
			
			var cancelCallback;
			if (option.cancel) {
				cancelCallback = option.cancel;
			}
			
			// ok버튼
			$('#msgBoxOk').on('click', function(e) {
				if (option.ok) {
				    $('#dialog_messagebox').close(function(){
				    	option.ok();
				    });
				    $('#dialog_messagebox').close().remove();
				} else {
					$('#dialog_messagebox').close().remove();
				}
			}).focus();
			
			// 취소버튼
			$('#msgBoxCancel').on('click', function() {
			    $('#dialog_messagebox').close().remove();
			});
			
			$('#dialog_messagebox').close(function() { // close 시 콜백함수 등록.
				$('#dialog_messagebox').remove();
				if (cancelCallback) {
					cancelCallback();
				}
			});
		} else {
			messagebox('error', '잘못된 Parameter 입니다.');
		}
	};

	$.extend($.alopex, {
		info: function(msg) {
			return messagebox('error', msg);
		},
		
		error : function(msg) {
			messagebox('error', msg);
		},
		confirm: function(option) {
			confirmbox(option);
		}
		
	})
	
})(jQuery);