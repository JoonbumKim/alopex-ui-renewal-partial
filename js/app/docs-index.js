/*
 * document page중 index페이지에 link
 */

var markdownContents;

var showdownConverter;
var createCircleProgress = null;
var resizeCircleProgress = null;
var removeCircleProgress = null;

$(document).ready(function() {
	
//	$('.page-menu').prepend($('.page-header h1'));
//	$('.page-header').remove();
//	
//	$('.page-menu').prepend('<div class="menu-header"><a href="../../index.html"><img src="../../img/header_logo_black.png"></a><div>');
//	
//	$('.page-menu ul li:first ul').empty().attr('class', 'lnb');
	
	//리뉴얼로 인한 로직 변경
	//var paths = window.location.pathname.split('/');
	var pTarget=getURLParameter('target');
	//var filename = paths[paths.length - 2] + '.md';
	var filename = '';
	if(pTarget != undefined){
		filename= pTarget+'/'+pTarget + '.md';
	}else{
		
		var paths = window.location.pathname.split('/');
		var tmpFileName =paths[paths.length - 1]
		filename= tmpFileName.substr(0,tmpFileName.length-5) + '.md';
	}
	if (!showdownConverter && typeof Showdown !== 'undefined') {
		showdownConverter = new Showdown.converter({
			extensions: ['github', 'table']
		});
	}
	if (showdownConverter) {
		$.ajax(filename).done(function(data) {
			markdownContents = showdownConverter.makeHtml(data);
			
			$('#document-content-body-loadhtml').html('<div class="md-manual">' + markdownContents + '</div>');
			$('pre').each(function() {
				if($(this).find('> code').length>0) {
					$(this).addClass('prettyprint');
					$(this).find('> code').addClass('pretty');
				}
			});
			
			//$('pre').attr('class', 'prettyprint');
			$.alopex.convert($('#document-content-body-loadhtml')[0]);
			prettyPrint();
			
			// md 파일에서 script 로딩시킬 때, mdload 이벤트 핸들러를 등록하고, 핸들러에서 md에 필요한 script 를 로드 하면 됨
			// progressbar.md 참조 $(document).on('mdload', function(){ ... });
			setTimeout(function(){
				$(document).trigger('mdload');
			}, 100);
			
			// ZeroClipboard copy to clipboard 적용
			doZeroClipboard();
			
			scrollToHash();
			 var menuArr =[];
			 var menuInfo={};
			 menuInfo.pageId= $('.sub-content h1').html();
			
			 
			 var h2, h3, h4 = ''; 
			//리뉴얼로 인한 로직 변경
			  $('.sub-content__title span, .sub-content h3, .sub-content h4').each(function(i ,ele){
			  	
			    var id = ele.innerHTML.replace(/[^\w|\ㄱ-ㅎ가-힣]/gi, '');
			    
			    if (ele.tagName === 'SPAN'){
			      	h2 = id;
			      	menuArr.push({"id":id,"text":ele.innerHTML,"items":[]});
				 
			    } else if (ele.tagName === 'H3'){
			    	
			      	id = h2 + '_' + id;
			      	h3 = id;
			      	
			      	menuArr[menuArr.length-1].items.push({"id":id,"text":ele.innerHTML,"items":[]})
			      	  
			    } else if (ele.tagName === 'H4'){
			      	id = h3 + '_' + id;
			      	h4 = id;
			      	var targetIdx=menuArr.length-1;
			    
			        if(menuArr[targetIdx].items[menuArr[targetIdx].items.length-1] != undefined){
			        	menuArr[targetIdx].items[menuArr[targetIdx].items.length-1].items.push({"id":id,"text":ele.innerHTML,"items":[]});
					     
			        }
			      	}
			    ele.id = id;
			   
			  });
			  //필요한 링크 정보 취합 후 좌측 메뉴 생성
			  menuInfo.menu=menuArr;
			  createLnb(menuInfo); //common.js 에 있는 lnb 생성 함수 호출
			
		});
	}

	createCircleProgress = function() {
		this.progress = document.getElementById('progress');
		this.generateSize();

		this.progress.style.backgroundImage = 'url(../../img/progress_fin_all.png)';
		this.progress.style.width = '102px';
		this.progress.style.height = '102px';
		$(this.progress).insertAfter(this.overlay);
		this.progressTick = 0;
		var _this = this;
		this.ptimer = setInterval(function() {
			var pos = (7 - _this.progressTick % 8) * (102) + 'px' + ' 0px';
			if (_this.progressTick % 8 == 7) {
				_this.progressTick = -1;
			}
			_this.progress.style.backgroundPosition = pos;
			_this.progressTick++;
		}, 100);

	};
	resizeCircleProgress = function() {
		this.generateSize();
	};

	removeCircleProgress = function() {
		var that = this;
		$(this.progress).fadeOut(function() {
			if (that.ptimer) {
				clearInterval(that.ptimer);
				that.ptimer = null;
			}
			if (that.progress) {
				$(that.progress).remove();
				that.progress = null;
			}
		});
	};

	$(window).bind('hashchange', onHashChange);

	createContent();

	loadContentByCurrentHash();


});

function refreshAlopexGrid(){
	if(window.AlopexGrid && $.fn.alopexGrid)
		$('.alopexgrid').alopexGrid('updateOption');
}


function createContent() {
	var html = '<div id="document-content" tabindex="-1" style="outline:0;">';
	html = '';
	
//	html += '<div class="gnb clearfix">';
//	html += '	<ul>';
//	html += '		<li><a href="../../index.html">Home</a></li>';
//	html += '		<li><a href="../../docs/docs-index.html">Docs</a></li>';
//	html += '		<li><a href="../apis-home.html">APIs</a></li>';
//	html += '		<li><a href="../../pages/download.html">Download</a></li>';
//	html += '	</ul>';
//	html += '</div>';

//	html += '<div id="document-content-body">';
//	html += '  <div id="example">';
//	html += '     <h2 id="example_title"></h2>';
//    html += '     <p id="example_description"></p>';
//	html += '  </div>';
	html += '   <div id="document-content-body-loadhtml">';
//	html += '  </div>';
//	html += '  <div id="source-code">';
//	html += '   </div>';
//	html += ' </div>';
//	html += '</div>';
//	html += '<span id="progress">';
//	html += '</span>';
	$('.sub-content').html(html);
}

function onHashChange() {
	var hash = window.location.hash;
	
	if (hash === '') {
		window.history.back();
	} else {
		loadContentByCurrentHash();
	}
}

function scrollToHash(){
	
	var hash = window.location.hash;
	
	if (hash && hash.substr(1).length) {
		var hashEl;
		if (typeof (hash.split('_')[1]) === 'undefined') {
		  hashEl = document.getElementById((hash.substr(1)).toLowerCase());
		} else {
		  hashEl = document.getElementById((hash.split('_')[1]).toLowerCase());
		}
		if (hashEl !== null && typeof (hashEl) !== 'undefined' && hashEl.offsetTop !== 'undefined') {
		  window.scrollTo(0, hashEl.offsetTop);
		}
	}
}

function loadContentByCurrentHash() {
	var hash = window.location.hash;
	if (hash === '') {
		hash = '#!basic'; //IE7, Android 2.3 browser history remains both # and #basic
	}
	
	if(hash == '#!basic') {// basic경우에만 보여주게 처리.
//		$('.page-menu ul').collapseAll().expand(0);
	}
	
	if (hash.match("#!")) {//example
		_loadContentByHashKey(hash);
	} else {
		if($('.md-manual').length === 0){
			$('#document-content-body-loadhtml').html('<div class="md-manual">' + (markdownContents == undefined ? '' : markdownContents) + '</div>');
			$('pre').each(function() {
        if($(this).find('> code').length>0) {
          $(this).addClass('prettyprint');
          $(this).find('> code').addClass('pretty');
        }
      });
      
      $.alopex.convert($('#document-content-body-loadhtml')[0]);
      prettyPrint();
      
      scrollToHash();
		}
		
		hideProgress();
		$('#example').remove();
    $('#source-code').remove();
		$('.footer-container').show();
	}
}

function _loadContentByHashKey(hash) {

	var currentLocation = window.location.pathname;
	var currentContext = currentLocation.substring(currentLocation.lastIndexOf('/') + 1, currentLocation.indexOf('-index'));
	loadContentByOriginalUrl(currentContext + '-' + hash.substring(2) + '.html');
	//  if (hash.match('#!examples')) {
	//    $('#example').show();
	//  } else {
	//      $('#example').hide();
	//  }
}

function loadContentByOriginalUrl(url) {
	//FIXME this code block must be called after alopex controller javascript(in partial html) loaded
	try {

		var nocacheUrl = url + '?x=' + (new Date()).getTime(); //for nocache
		//$('#document-content').css('opacity', '0');
		createContent();
		showProgress();
		if(
//				nocacheUrl.indexOf('event-basic.html') == -1 && // 에외 케이스. (md 파일로 작성 안되어 있는 경우)
//				nocacheUrl.indexOf('overlay-basic.html') == -1 && 
//				nocacheUrl.indexOf('theme-basic.html') == -1 &&
				nocacheUrl.indexOf('-basic.html') != -1) {
			window.location.hash = "#basic";
		} else {
			$('#document-content-body-loadhtml').navigate(nocacheUrl)
			.done(function(data, status, jqxhr) {
				$.alopex.convert($('#document-content-body-loadhtml')[0]);
				var matches = data.match(/<title>(.*?)<\/title>/);
				if (matches !== null && matches !== '') {
					var title = matches[1];
					document.title = title;
				}
				_onLoad(url);
				$(document).ready(function() {
					hideProgress();
				});
				//$('#document-content').css('opacity', '1');
				if ($.alopex.datasource) {
					$.alopex.datasource.search();
				}
				
			});
		}
		
	} catch (e) {
	}
}

function _onLoad(url) {

	if (url.match('examples')) {
		var key = url.substring(url.lastIndexOf('-') + 1, url.lastIndexOf('.'));

		var json = $.parseJSON($('#example_data').html());
		var example = json[key];
		$('#example > h2').html(example.title); // example_title id가 날라감.
		$('#example_description').html(example.description);
		var nocacheUrl = url + '?x=' + (new Date()).getTime(); //for nocache
		$.get(nocacheUrl, function(sourceCode) {
			var escapedSourceCode = '<pre class="prettyprint"><xmp>' + sourceCode + '</xmp></pre>';
			$('#source-code').html(escapedSourceCode);
			prettyPrint();
		});
	} else {
		//    $('#example_title').html('');
		//    $('#example_description').html('');
		//    $('#source-code').html('');
		$('#example').remove();
		$('#source-code').remove();
		$('pre').addClass('prettyprint');
		prettyPrint();
	}

}
var p = null;

function showProgress() {
	p = $('body').progress();
}

function hideProgress() {

	if (p) {
		p.extendOption({
			duration: 200
		});
		p.remove();
	}
}

if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}
}

$(document).ajaxSuccess(function(){
	refreshAlopexGrid();
});


//Copy to Clipboard Button in all pages at once
function doZeroClipboard(){
	
	$('.eg pre.prettyprint').each(function(index, Element){
		$(this).prepend('<div class="getSource">copy</div>');
	});

	if($(".getSource").length <= 0) return;
	
	var client = new ZeroClipboard( $('.getSource') );

	  client.on( 'ready', function(event) {
	    // console.log( 'movie is loaded' );

	    client.on( 'copy', function(event) {
	      event.clipboardData.setData('text/plain', $(event.target).next().text());
	    } );

	    client.on( 'aftercopy', function(event) {
	      // console.log('Copied text to clipboard: ' + event.data['text/plain']);
	    } );
	  } );

	  client.on( 'error', function(event) {
	    // console.log( 'ZeroClipboard error of type "' + event.name + '": ' + event.message );
	    ZeroClipboard.destroy();
	  } );
}

function getURLParameter(param)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == param)
        {
            return sParameterName[1];
        }
    }
}