var n = Number(new Date());
var currentPath = window.location.pathname;
var currentHref = window.location.href;
var paths = currentPath.split('/');
var lastPath = currentPath.substring(currentPath.lastIndexOf('/')).toLowerCase();
if (lastPath === '/' || lastPath === '/index.html'){

    document.write('<link rel="stylesheet" type="text/css" href="./dist/css/alopex-ui-default.css" />');
    document.write('<link rel="stylesheet" href="./css/alopex-web.css" />');
    document.write('<script type="text/javascript"  src="./js/libs/jquery/jquery-1.11.3.js"></script>');
    document.write('<script type="text/javascript"  src="./dist/script/alopex-ui.js"></script>');
    document.write('<script type="text/javascript"  src="./js/app/common.js"></script>');

}else if (lastPath === '/download.html'){

    document.write('<link rel="stylesheet" type="text/css" href="../dist/css/alopex-ui-default.css" />');
    document.write('<link rel="stylesheet" type="text/css" href="../css/alopex-web.css" />');

    document.write('<script type="text/javascript"  src="../js/libs/jquery/jquery-1.11.3.js"></script>');
    document.write('<script type="text/javascript"  src="../dist/script/alopex-ui.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/handlebars/handlebars.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/affix/affix.js"></script>');
    document.write('<script type="text/javascript"  src="../js/app/common.js"></script>');

}else if (lastPath === '/javascript.html'){


    document.write('<link rel="stylesheet" type="text/css" href="../dist/css/alopex-ui-default.css" />');

    document.write('<link rel="stylesheet" type="text/css" href="../css/mddocs.css" />');
    document.write('<link rel="stylesheet" type="text/css" href="../css/alopex-web.css" />');
    document.write('<link rel="stylesheet" type="text/css" href="../css/prettify.css" />');
    document.write('<link rel="stylesheet" href="http://grid.alopex.io/dist/css/alopex-grid.css" />');

    document.write('<script type="text/javascript"  src="../js/libs/jquery/jquery-1.11.3.js"></script>');
    document.write('<script type="text/javascript"  src="../dist/script/alopex-ui.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/affix/affix.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/markdown/showdown.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/markdown/github.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/markdown/table.js"></script>');
    document.write('<script type="text/javascript"  src="../js/app/docs-index.js"></script>');
    document.write('<script type="text/javascript"  src="../js/app/prettify.js"></script>');
    document.write('<script type="text/javascript" src="../js/libs/zeroclipboard/ZeroClipboard.js"></script>');
    document.write('<script type="text/javascript"  src="../js/app/common.js"></script>');

    document.write('<script id="grid_trial" type="text/javascript" src="http://grid.alopex.io/dist/script/alopex-grid-trial.min.js"></script>');

    
}else{
    document.write('<link rel="stylesheet" type="text/css" href="../dist/css/alopex-ui-default.css" />');
    document.write('<link rel="stylesheet" type="text/css" href="../css/mddocs.css" />');
    document.write('<link rel="stylesheet" type="text/css" href="../css/alopex-web.css" />');
    document.write('<link rel="stylesheet" type="text/css" href="../css/prettify.css" />');

    document.write('<script type="text/javascript"  src="../js/libs/jquery/jquery-1.11.3.js"></script>');
    document.write('<script type="text/javascript"  src="../dist/script/alopex-ui.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/affix/affix.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/markdown/showdown.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/markdown/github.js"></script>');
    document.write('<script type="text/javascript"  src="../js/libs/markdown/table.js"></script>');
    document.write('<script type="text/javascript"  src="../js/app/docs-index.js"></script>');
    document.write('<script type="text/javascript"  src="../js/app/prettify.js"></script>');
    document.write('<script type="text/javascript" src="../js/libs/zeroclipboard/ZeroClipboard.js"></script>');
    document.write('<script type="text/javascript"  src="../js/app/common.js"></script>');

    if(currentHref.indexOf("multiselect") != -1 || currentHref.indexOf("splitter") != -1  || currentHref.indexOf("fileupload") != -1 ){
    	document.write('<link rel="stylesheet" type="text/css" href="../dist/css/src/alopex-ext.css" />');
    	document.write('<script type="text/javascript"  src="../dist/script/src/alopex-ext.js"></script>');
    	document.write('<script type="text/javascript"  src="../dist/script/src/alopex-ext-setup.js"></script>');
    }
    
    if(currentHref.indexOf("webeditor") != -1){
	    	document.write('<link rel="stylesheet" type="text/css" href="../dist/script/src/webeditor/alopex-webeditor.css" />');
	    	document.write('<script type="text/javascript"  src="../dist/script/src/webeditor/alopex-webeditor.js"></script>');
	    	document.write('<script type="text/javascript"  src="../dist/script/src/webeditor/alopex-webeditor-setup.js"></script>');
	    	document.write('<script type="text/javascript"  src="../dist/script/src/webeditor/lang/alopex-ko-KR.js"></script>');
    }
    
    if(currentHref.indexOf("chart") != -1){
    		document.write('<script src="../dist/script/src/amcharts/javascript_chart/amcharts/amcharts.js"></script>');
        document.write('<script src="../dist/script/src/amcharts/javascript_chart/amcharts/serial.js"></script>');
        document.write('<script src="../dist/script/src/amcharts/javascript_chart/amcharts/pie.js"></script>');
        document.write('<script src="../dist/script/src/amcharts/javascript_chart/amcharts/gauge.js"></script>');
        document.write('<script src="../dist/script/src/amcharts/javascript_chart/amcharts/themes/light.js"></script>');
        document.write('<script src="../dist/script/src/amcharts/javascript_chart/amcharts/themes/dark.js"></script>');
        document.write('<link rel="stylesheet" href="../dist/script/src/amcharts/javascript_chart/amcharts/plugins/export/export.css" />');
        document.write('<script src="../dist/script/src/amcharts/javascript_chart/amcharts/plugins/export/export.js"></script>');
    }
    
}