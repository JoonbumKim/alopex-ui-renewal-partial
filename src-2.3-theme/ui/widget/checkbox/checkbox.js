(function($) {
	$.alopex.widget.checkbox = $.alopex.inherit($.alopex.widget.object, {
		widgetName : 'checkbox',
		defaultClassName : 'af-checkbox Checkbox',
		defaultTextClassName : 'af-checkbox-text',
		defaultWrapClassName : 'af-wrapcheckbox',
		defaultWrapSpanClassName : 'af-wrapcheckbox-span',
		getters : [ 'getValues', 'getTexts', 'getCheckedLength' ],
		setters : [ 'checkbox', 'setCheckAll', 'setChecked', 'setValues', 'toggle' ],

		properties : {
			wrap : false
		},

		init : function(el, options) {
			var $el = $(el);
			el.options = $.extend(true, {}, this.properties, options);

			//IE8에서는 input type변경 불가.
			try {
				$el.attr('type', 'checkbox');
			} catch(e) {
			}
			
			if (el.options.wrap || $.alopex.util.parseBoolean(el.alopexoptions.wrap)) {
				// $el.attr('data-type', 'wrapcheckbox').wrapcheckbox();
				if (el.className) {
					if (el.className.indexOf(this.defaultClassName) !== -1) {
						$el.addClass(this.defaultWrapClassName);
					}
					$el.after('<span class="' + el.className + '-span"></span>');
				} else {
					$el.after('<span class="' + this.defaultWrapSpanClassName + '"></span>');
				}
			}
			
			$el.on('change', function(e){
				if(e.currentTarget.checked) {
					$(e.currentTarget).attr("checked", "checked");
					$(e.currentTarget).parent('label').addClass('Checked');
				} else {
					$(e.currentTarget).removeAttr("checked");
					$(e.currentTarget).parent('label').removeClass('Checked');
				}
			});
			
			if(el.checked || el.getAttribute('checked') == 'checked') {
				$(el).parent().addClass('Checked');
				$(el).prop('checked', true);
			}
		},

		style : function(el) {
			if (el.id) {
				$('label[for="' + el.id + '"]').addClass(this.defaultTextClassName);
			} else {
				$(el).parent('label').addClass(this.defaultTextClassName);
			}
		},

		properties : {
			quickResponse : false
		},

		setQuickResonse : function(el, bool) {
			// TODO
		},

		setCheckAll : function(el, bool, changeTrigger) {
			if (!$.alopex.util.isValid(bool)) {
				bool = true;
			}
			if (!$.alopex.util.isValid(changeTrigger)) {
				changeTrigger = true;
			}
			var $checkList = $('input[name=' + el.name + ']');
			$checkList.prop('checked', bool);
			$checkList.parent('label').addClass('Checked');

			if (changeTrigger) {
				$checkList.trigger('change');
			}
		},

		setChecked : function(el, bool, changeTrigger) {
			if (!$.alopex.util.isValid(bool)) {
				bool = true;
			}
			if (!$.alopex.util.isValid(changeTrigger)) {
				changeTrigger = true;
			}
			if (el.tagName === 'INPUT') {
				$(el).prop('checked', bool);
				$(el).parent('label').addClass('Checked');
			}
			if (changeTrigger) {
				$(el).trigger('change');
			}
		},

		getValues : function(el) {
			var tmpValuesArr = [];

			var checkList = $('input[name=' + el.name + ']:checked');
			for (var i = 0; i < checkList.length; i++) {
				var obj = checkList[i];
				tmpValuesArr.push($(obj).val());
			}
			return tmpValuesArr;
		},

		setValues : function(el, array, changeTrigger) {
			if (!$.alopex.util.isValid(changeTrigger)) {
				changeTrigger = true;
			}
			var $checkList = $('input[name=' + el.name + ']').prop('checked', false);
			for (var i = 0; i < $checkList.size(); i++) {
				var checkbox = $checkList.get(i);
				for (var j = 0; j < array.length; j++) {
					if (checkbox.value === array[j]) {
						$(checkbox).prop('checked', true);
						array.splice(j, 1);
					}
				}
			}
			if (changeTrigger) {
				$checkList.trigger('change');
			}
		},

		getTexts : function(el) {
			var tmpTextsArr = [];
			var checkList = $('input[name=' + el.name + ']:checked');
			for (var i = 0; i < checkList.length; i++) {
				var obj = checkList[i];
				var elId = $(obj).attr('id');
				var $label = $(document.body).find('label[for=\"' + elId + '\"]');
				if($label.length==0) {
					$label = $(obj).parent('label');
//		        	$label = $(el).parent('label');
		        }
				tmpTextsArr.push($label.text());
			}
			return tmpTextsArr;
		},

		getCheckedLength : function(el) {
			var $checkList = $('input[name=' + el.name + ']:checked');
			return $checkList.size();
		},

		toggle : function(el, changeTrigger) {
			if (!$.alopex.util.isValid(changeTrigger)) {
				changeTrigger = true;
			}
			var $checkList = $('input[name=' + el.name + ']');
			for (var i = 0; i < $checkList.size(); i++) {
				// var obj = checkList[i];
				var obj = $checkList.get(i);
				if ($(obj).prop('checked')) {
					$(obj).prop('checked', false);
				} else {
					$(obj).prop('checked', true);
				}
			}

			if (changeTrigger) {
				$checkList.trigger('change');
			}
		}
	});
})(jQuery);