/**
 * baseinput : parent of input elements
 */
$.alopex.widget.baseinput = $.alopex.inherit($.alopex.widget.object, {
	widgetName: 'baseinput',
	eventHandlers: {
	//      focus: {event: 'focus', handler: '_focusHandler'},
	//      blur: {event: 'blur', handler: '_blurHandler'}
	},

	event: function(el) {
		this.addHoverHighlight(el);
	},

	init: function(el) {
//		if (!$.alopex.util.isValid(el.getAttribute('type'))) {
//			var datatype = el.getAttribute('data-type');
//			el.setAttribute('type', datatype);
//		}
	},

	properties: {

	}

});