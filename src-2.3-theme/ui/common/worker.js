+(function($){
    //initial convert worker. should run after alopex object has properly constructed.
    $(function() {
        // add jQuery Plugin
        var apis = {};
        for ( var name in $.alopex.widget) {
            for ( var i = 0; i < $.alopex.widget[name].getters.length; i++) {
                var api = $.alopex.widget[name].getters[i];
                apis[api] = null;
            }
        }

        for ( var name in apis) {// Register Alopex UI Getter API
            $.fn[name] = new Function('return $.alopex._getter.call(this, "' + name + '", arguments)');
        }

        apis = {};
        for ( var name in $.alopex.widget) {
            for ( var i = 0; i < $.alopex.widget[name].setters.length; i++) {
                var api = $.alopex.widget[name].setters[i]
                apis[api] = null;
            }
        }

        for ( var name in apis) { // Register Alopex UI Setter API
            $.fn[name] = new Function('return $.alopex._setter.call(this, "' + name + '", arguments)');
        }
        $.alopex.checkBrowser();
        $.alopex.convert('body');

    });
})(jQuery);
