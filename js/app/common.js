/*google analytics*/

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-40606653-4', 'alopex.io');
ga('send', 'pageview', location.pathname + location.hash);

var path='..';
var currentMenu=''; //현재 2 Depth Menu 
var lnbData =''; // lnb 검색시 원복을 위한 변수
$a.page(function() {
    this.init = function(id, param) {
    	var currentPath = window.location.pathname;
    	var paths = currentPath.split('/');
    	var lastPath = currentPath.substring(currentPath.lastIndexOf('/'));
    	if (lastPath === '/' || lastPath === '/index.html'){
    	    path = '.';
    	    cls = 'idx';
    	    $.getJSON(path+'/releasenote.json', setDownloadGroup);
    	 }
    	currentMenu=paths[paths.length - 1].split('.html')[0];
    		//상단 메뉴 불러오기
    	 $.getJSON(path+'/gnbMenu.json',loadgnb);
    	 //좌측 메뉴는 ./js/app/docs-index.js 에서 호출.(md 파일 컨버팅 후 취득된 hash tag 정보에 따라 좌측 3메뉴 구성)
    	 createFooter();
    	 
    	
    	 
    }
})


function loadgnb(data){
	
	$('#gnb_menu').setDataSource(data.menus); 
}
 


function createFooter(){
  var lastBuildTime = '2016-01-04 01:53 PM';
  var html = '';
	  html+='<div class="footer-txt">'
	  html+='<p class="Font-bold Font-big Confirm Margin-top-10 Margin-bottom-10" style="color:rgb(223,82,72);">This Site created with Alopex UI</p>'
	  html+='<div class="footer-txt__secondtxt">'
	  html+='<p>Last build date: <span id="lastBuildTime">' + lastBuildTime + '</span></p>'
	  html+='<p>Icon licensed under <span class="color-red">CC BY 3.0</span></p>'
	  html+='<p>Copyright &copy; 2010-2016 SK Holdings. All rights reserved.</p>'
	  html+='</div>'
	  html+='<div class="footer-sns">'
	  html+='<a href="http://nexcore.skcc.com/support"><img src="'+path+'/images/footer_sns.png" alt="Nexcore 바로가기" /></a>'
	  html+='</div>'
	  html+='</div>'
      $('.footer').append(html);
        $.getJSON('../../build.json', function(data){
        lastBuildTime = data["lastBuildTime"];
        $('#lastBuildTime').html(lastBuildTime);
      });
      
}

function setDownloadGroup(data){
  
  var currentVer = data.currentVersion;
  var html = '';
  html += '<a class="btn-source_download" href="./dist/zip/alopexui-' + currentVer + '.zip">Latest Source Download</a>'
  html += '<a class="btn-boiler_download" href="./started/education/AlopexUI_Beginner.zip">Beginner Project</a>'
	html +=
  $('.content-top__download').html(html);
  
}
function createLnb(param){
	lnbData = param; //lnb 데이터를 저장.
	var hash = 	window.location.hash;
	var pageId = param.pageId;
	document.title=pageId+' | Alopex UI';
	var pageMenus=param.menu;
	$.getJSON(path+'/lnbMenu.json',function(data){
		var menus = data[currentMenu];
		var index =0;
		if(menus != undefined) {
			if(menus.length > 0) {
				$(".sub-nav").append('<ul class="Accordion" id="lnbArea"></ul>'); 
				for(var i=0; i < menus.length; i++) {
					var text = menus[i].text;
					var link = menus[i].linkUrl;
					var menuId = i;

				    if(pageId.toLowerCase()==text.toLowerCase()){
				    	$("#lnbArea").append('<li id=l_li_'+menuId+'><a id=l_li_a_'+menuId+'>● '+text+'</a></li>');
						index=i;
						if(pageMenus.length != 0){
							var subHtml='<ul>';
							$.each(pageMenus , function(i, val) { 
						     //3뎁스가 있을 경우
								if(val.items.length != 0){
									subHtml += '<li><a href="#'+val.id+'">'+val.text+'</a><ul>';
									$.each(val.items , function(j, val2) {
										//4뎁스가 있는 경우
										if(val2.items.length != 0){
											subHtml += '<li><a href="#'+val2.id+'">'+val2.text+'</a><ul>';
											
											$.each(val2.items , function(k, val3) {
												subHtml += '<li><a href="#'+val3.id+'">'+val3.text+'</a></li>';
											});
											subHtml += '</ul></li>';
										}else{
											subHtml += '<li ><a href="#'+val2.id+'">'+val2.text+'</a></li>';
										}
										
									});
									subHtml += '</ul></li>';
								}else{
									//3뎁스 메뉴 없을 때
									subHtml += '<li><a href="#'+val.id+'">'+val.text+'</a></li>';
								}
							});
							subHtml += '</ul>';
							$("#"+"l_li_"+menuId).append(subHtml)
						}
					}else{
						//현재 선택된 메뉴가 아닌 목록 타이틀
						$("#lnbArea").append('<li id=l_li_'+menuId+'><a href="'+link+'" id=l_li_a_'+menuId+'>● '+text+'</a></li>');
						
					}
				}
//				
				$('#lnbArea').convert();
			    
			   if($('#lnbArea').find("[href='"+hash+"']").length>0){ // hash 링크가 있는 a 태그
				  var hashEl = $('#lnbArea').find("[href='"+hash+"']");
				  
				 hashEl[0].click();
				// $(hashEl[0]).parent().parent().parent().expand();
				  $('#lnbArea').expand(0);
			   }else{
				   $('#lnbArea').expand(0);
			   }
		
			}
		}

		
		
		    affixSet();
		    naviSizeSet(); 
		
		
	});
}

$(window).resize(naviSizeSet);


//좌측메뉴 포지션 설정
function affixSet(){
//    	console.log('-------affixSet------------');
	$('.js-affixed-element-top').affix({
	    offset: {
	      top: 153
	    , bottom: 314
	    }
	  });
	
	$('.sub-nav').find('ul').bind('click', function(e) {
	    naviSizeSet();
	});
		
}

function naviSizeSet(){
    var height = 0;
    
    if($('.sub-nav').find('ul').attr('class') === 'List') {
    	 height = 668;
    	// height = 750;
    }else{
        height = $('.sub-nav').find('ul').height();
    }
    
    var winHeight = $(window).height();
    var docScroll = $(document).scrollTop();
    
    if(docScroll < 153){
	winHeight = winHeight -(173- docScroll);
    }
    if (height < (winHeight - docScroll)) {
        $('.sub-nav__wrap').css('height', height + 20);
        $('.sub-nav').css('height',height + 20);
    }else{
       $('.sub-nav__wrap').css('height',winHeight - 40);
        $('.sub-nav').css('height',winHeight  - 40);
    }
}

function lnbSearch(str){
  if($.trim(str) != ''){
	$.getJSON(path+'/lnbMenu.json',function(data){
		$("#lnbArea").remove();
		var menus = data[currentMenu];
		var index =0;
		if(menus != undefined) {
			if(menus.length > 0) {
				$(".sub-nav").append('<ul class="Accordion" id="lnbArea"></ul>'); 
				for(var i=0; i < menus.length; i++) {
					if(menus[i].text.toLowerCase().indexOf(str.toLowerCase())!=-1){
					  var text = menus[i].text;
					  var link = menus[i].linkUrl;
					  var menuId = i;
               		//현재 선택된 메뉴가 아닌 목록 타이틀
				      $("#lnbArea").append('<li id=l_li_'+menuId+'><a href="'+link+'" id=l_li_a_'+menuId+'>● '+text+'</a></li>');
				  }	
				}
				$('#lnbArea').convert();
			}
		}
		    affixSet();
		    naviSizeSet(); 
	});
  }else{
	  $("#lnbArea").remove();
	  createLnb(lnbData);
  }	
	
}
