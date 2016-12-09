!function($) {
	$.alopex.decorator = function(config) {
		this.process = function() {
			config.template = this.template;
			var decorator = $('script[type="text/alopex-decorator"]').attr('data-decorator');
			var metas = config.options.metas;
			for (i in metas) {
				var tag = '<meta';
				for (j in metas[i]) {
					var metaAttr = metas[i][j];
					tag += ' ' + metaAttr.prop + '="' + metaAttr.value + '"';
				}
				tag += '/>'
				$('head').prepend(tag);
			}
			if(config[decorator || config.options.defaultDecorator]){
				config[decorator || config.options.defaultDecorator]();
			}

			//깜빡임 현상을 방지하기 위하여 HTML을 display:none했다가 show
			$('html').show();
		}
		return this;
	};

	$.alopex.view = function(name, view) {
		var inst = $.alopex.viewConfig.views[name];
		if (inst == undefined && view !== undefined) {
			inst = new $.alopex._view(name, view);
			$.alopex.viewConfig.views[name] = inst;
		}
		return inst;
	}

	$.alopex.viewSetup = function(options) {
		$.extend($.alopex.viewConfig.settings, options);
	};

	$.alopex.viewConfig = {
		views: {},
		settings: {
			templateBasePath: 'source/templates',
			templateFileExtension: '.html'
		}
	}

	$.alopex._view = function(name, view) {
		this.name = name;
		$.extend(this, view);
	}
	
	$.alopex._view.prototype = {
		template: function(model) {
			var templateName = this.templateName || (this.name + $.alopex.viewConfig.settings.templateFileExtension);
			var method = AlopexWebApp.Templates[$.alopex.viewConfig.settings.templateBasePath + '/' + templateName];
			if(method && typeof method == 'function') {
				return method(model);
			}
			return '';
		},
		render: function(model) {
			var outlet = this.outlet || this.name;
			model = model || this.model;
			model = (model && typeof model === 'function') ? model() : model;
			var $outlet = $('[data-outlet="' + outlet + '"]');
			
			$outlet.html(this.template(model));
			$outlet.convert(); //alopex ui convert
		}
	};
}(jQuery);