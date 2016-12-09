(function($) {
	
	
	// 변경되는 부분. 
	/**
	 * 변경되는 부분
	 * 
	 * fileupload 관련된 최소 기능 제공.
	 * 
	 * 서버에서 오는 response가 다를 수 있다.  --> parsing 하는 룰이 달라져야 한다.
	 * progress 처리는 ? 따로 구현해야 되나? 서버랑 맞춰야 되나?
	 * cancel은 가능한가?
	 * ajax로 보낼수 있는지 (FormData)
	 * 
	 * 
	 */

	function FileSelector(options) {
		this.form;
		this.input;
		this.files;
		this.add;
		this.iframe;
		this.selected = [];
		this.options = options; // file options : multiple , success
	}

	FileSelector.prototype.addForm = function(element) {
		var iframe_id = '_iframe_' + Math.random();
		this.iframe = document.createElement('iframe');
		this.iframe.setAttribute('id', iframe_id);
		this.iframe.setAttribute('name', iframe_id);
		this.form = document.createElement('form');
		this.form.setAttribute('method', 'post');
		this.form.setAttribute('enctype', 'multipart/form-data');
		this.form.setAttribute('target', iframe_id);

		$(this.iframe).appendTo('body')//.hide();
		$(this.form).appendTo(element);
		$(element).css('overflow', 'hidden');
	};

	FileSelector.prototype.addInput = function() {
		// 기존 input이 있을 경우,
		if (this.input) {
			this.selected.push(this.input);
			$(this.input).hide();
		}
		

		this.input = document.createElement('input');
		this.input.setAttribute('type', 'file');
		this.input.setAttribute('name', 'file');

		if (this.options.multiple) {
			this.input.setAttribute('multiple', true);
		}
		$(this.input).css({
			display : 'block',
			top : 0,
			right : 0,
			height : '100%',
			width : '100%',
			'font-size' : '1000px'
		});
		$(this.input).css({
			position : 'absolute',
			right : '0px',
			top : '0px',
			height : '40px',
			width : '200px',
			opacity : 0
		});

		var that = this;
		$(this.input).on('change', function(e) {
			if (e.target.files) { // file api가 있는경우, IE는 10+
				that.files = e.target.files;
			} else {
				that.files = [ {
					name : e.target.value
				} ];
			}
			if (that.options.success) {
				that.options.success.apply(this, [ that.files ]);
			}
		});
		$(this.input).appendTo(this.form);
	};

	FileSelector.prototype.upload = function(options) {
		this.form.action = options.url;

		var $inputs = $(this.form).find('input[type="file"]');
		if ($inputs.length > 2)
			$inputs.eq(0).remove();

		var that = this;
		window.aa = this.iframe
		$(this.iframe).one('load', function(e) {
			var result;
			var error;
			try {
				error = {
					code: 'E001',
					message: 'Cross-Domain'
				};
				result = $(that.iframe.contentDocument.body).find('pre').html();
				error = {
					code: 'E002',
					message: 'JSON Parse Error'
				};
				result = JSON.parse(result);
			} catch (e) {}
			
			if(result && ((options.isSuccess && options.isSuccess(result)) || (!options.isSuccess))) {
				options.success(result);
			} else {
				options.error(error);
			}
			
//			e.preventDefault();
		});

		if (options.success) {
			window._uploadSuccessCallback = options.success;
		}
		if (options.error) {
			window._uploadErrorCallback = options.error;
		}
		$(this.form).trigger('submit');
	};

	FileSelector.prototype.removeSelected = function(filename) {
		for (var i = 0; i < this.selected.length; i++) {
			if (this.selected[i].value == filename) {
				$(this.selected[i]).remove();
				this.selected.splice(i, 1);
				break;
			}
		}
	};

	$.fn.fileselect = function(options) {
		var element = this[0];
		var file = new FileSelector(options);
		file.addForm(element);
		file.addInput();
		return file;
	};

})(jQuery);

// constructor : markup, style, init, event, defer: timing issue에 사용.
