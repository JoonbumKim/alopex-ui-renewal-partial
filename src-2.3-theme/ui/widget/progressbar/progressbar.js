(function($) {
	
	$.alopex.widget.progressbar= $.alopex.inherit($.alopex.widget.object, {
		widgetName: 'progressbar',
		/**
		 * property 
		 */
		// class property
		defaultClassName: 'af-progressbar Progressbar',

		setters: ['progressbar', 'setValue', 'setOptions'],
		getters: ['getValue'],

		properties: {
			starttext : null,
			endtext : null,
			textColor : null
		},

		eventHandlers: {
		},
		
		init: function(el, option) {
			
			$.extend(el, this.properties, option);
			
			var progEl;
			if(el.progEl){
				progEl = el.progEl 
			}else{
				progEl = document.createElement('div');
			}
			
			progEl.minValue = 0;
			progEl.maxValue = 100;
			progEl.value = 0;
			$(progEl).attr('style', 'position:relative; left:0px;'); // top:0px; width:0px');
			el.appendChild(progEl);
			$(progEl).css('height', $(el).css('height'));
			progEl.maxWidth = $(el).css('width').split('px')[0];

			var defaultVal = $(el).attr('data-default');
			if ($.alopex.util.isValid(defaultVal)) {
				progEl.value = defaultVal;
				$(progEl).css('border', $(el).css('border'));
				$(progEl).css('width', (progEl.maxWidth * (defaultVal / progEl.maxValue)) + 'px');
			}
			else{
				$(progEl).css('width', '0px');
			}
			
			if( $(el).hasClass('Progress-text')){
				
				option.showText = true;
				
				var textEl;
				if(el.textSpan){
					textEl = el.textSpan;
				}else{
					textEl = document.createElement('span');
				}
				
				$(textEl).attr('style', 'position: absolute; ');//top: 0px;
				$(textEl).css('height', ($(el).css('height')));
				$(textEl).css('width', ($(el).css('width')));
				//$(textEl).css('left', ($(el).css('width').split('px')[0] / 2 - 35) + 'px');
				
				if (el.starttext) {
					textEl.startProg = el.starttext;
					$(textEl).text(textEl.startProg);
				}else{
					$(textEl).text("0%");
				}
				if (el.endtext){
					textEl.endProg = el.endtext;
				}
				if ($.alopex.util.isValid(el.textColor) && el.textColor) {
					$(textEl).css('color', el.textColor);
				}
				if ($.alopex.util.isValid(defaultVal)) {
					if (defaultVal === "100" && textEl.endProg) {
						$(textEl).text(textEl.endProg);
					} else if (defaultVal === "0" && textEl.startProg) {
						$(textEl).text(textEl.startProg);
					} else {
						$(textEl).text(defaultVal + '%');
					}
				}
				$(progEl).append(textEl);
				$(textEl).appendTo(progEl);
				
				el.textSpan = textEl;
			}

			
//			var overlayEl;
//			if(el.overlayEl){
//				overlayEl = el.overlayEl 
//			}else{
//				overlayEl = document.createElement('div');
//			}
//
//			$(overlayEl).attr('style',
//					'position:relative; ' + 'opacity: 0; filter: progid:DXImageTransform.Microsoft.Alpha(opacity=60); ' + '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=30)";');
//			$(overlayEl).css('height', $(progEl).css('height'));
//			$(overlayEl).css('background-color', $(progEl).css('height'));
//			progEl.appendChild(overlayEl);
			el.progEl = progEl;
//			el.overlayEl = overlayEl;
		
		},
		
		setOptions: function(el, options) {
			
			var progEl;
			if(el.progEl){
				progEl = el.progEl 
			}else{
				progEl = el.children[0];
			}

//			var overlayEl;
//			if(el.overlayEl){
//				overlayEl = el.overlayEl 
//			}else{
//				overlayEl = progEl.children[0];
//			}

			// background color
			if ($.alopex.util.isValid(options.bgColor)) {
				$(progEl).css('background-color', options.bgColor);
			}
			if ($.alopex.util.isValid(options.bgUrl)) {
				$(progEl).css('background-image', 'url(' + options.bgUrl + ')');
			}
//			if ($.alopex.util.isValid(options.overlayColor)) {
//				$(overlayEl).css('background-color', options.overlayColor);
//			}
			if ($.alopex.util.isValid(options.showText) && options.showText) {
				var textEl;
				if(el.textSpan){
					textEl = el.textSpan;
				}else{
					textEl = document.createElement('span');
				}
				
				$(textEl).attr('style', 'position: absolute;'); //top: 0px;
				$(textEl).css('height', ($(el).css('height')));
				$(textEl).css('left', ($(el).css('width').split('px')[0] / 2 - 35) + 'px');
				if ($.alopex.util.isValid(options.textArray) && options.textArray) {
					textEl.startProg = options.textArray[0];
					textEl.endProg = options.textArray[1];
					//$(textEl).text(textEl.startProg);
					var value = progEl.value;
					
					if (value === 100 && textEl.endProg) {
						$(textEl).text(textEl.endProg);
					} else if (value === 0 && textEl.startProg) {
						$(textEl).text(textEl.startProg);
					}
				}
				//
				$(progEl).append(textEl);
				$(textEl).appendTo(progEl);
				
				el.textSpan = textEl;

			}else if($.alopex.util.isValid(options.showText) && !options.showText){
				if(el.textSpan){
					$(el.textSpan).remove();
				}
			}
			if ($.alopex.util.isValid(options.textColor) && options.textColor) {
				if(el.textSpan){
					$(el.textSpan).css('color', options.textColor);
				}
			}
		},
		setValue: function(el, value) {
			var progEl = el.children[0];
//			var overlayEl = progEl.children[0];

			progEl.value = value;
			$(progEl).css('border', $(el).css('border'));
			$(progEl).css('width', (progEl.maxWidth * (value / progEl.maxValue)) + 'px');

//			$(overlayEl).css('width', $(progEl).css('width'));

			var textEl = $(progEl).children('span')[0];

			if (textEl !== undefined && $(el).hasClass('Progress-text')) {
				if (value === 100 && textEl.endProg) {
					$(textEl).text(textEl.endProg);
				} else if (value === 0 && textEl.startProg) {
					$(textEl).text(textEl.startProg);
				} else {
					$(textEl).text(value + '%');
				}
			}
		},
		getValue: function(el) {
			var progEl = el.children[0];
			var value = progEl.value;
			if (value > progEl.maxValue) {
				value = progEl.maxValue;
			} else if (value < progEl.minValue) {
				value = progEl.minValue;
			}
			return value;
		}
	});

})(jQuery);

