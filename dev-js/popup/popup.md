

# Popup

## Basic

윈도우 팝업, 레이어 팝업 등 다양한 팝업을 `$a.popup` 하나의 함수로 호출할 수 있도록 제공합니다.  
팝업의 크기를 지정하지 않으면   window 크기보다 조금 작은 사이즈로 채워집니다. 

### 레이어 팝업

#### iframe 영역 추가 (디폴트)
`$a.popup` 함수의 `url` 파라미터로 전달된 화면을 레이어 팝업으로 표시합니다.  
`$a.popup` 함수로 화면에 나타난 레이어 팝업은 기본적으로 팝업 컨텐트 영역에 `iframe` 엘리먼트가 생성되어, 팝업 내 화면과 기존 화면의 네이밍 충돌을 방지합니다.

<div class="eg">
<div class="egview">
<button id="btn_popup" class="Button">Popup ( iframe : true )</button> 
</div>
```
<!-- Parent html -->
<button id="btn_popup" class="Button">Popup ( iframe : true )</button> 
```
```
<!-- Parent html -->
$('#btn_popup').click( function() {
     $a.popup({
           url: "popup/popup.html" // 팝업에 표시될 HTML
         , iframe: true // default
    });
 });
```
```
<!-- Child html -->
<!-- iframe: true 인 경우, DOCTYPE html head title meta link body 등 포함 시켜야 합니다. -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Popup Data</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<link rel="stylesheet" type="text/css" href="../../dist/css/alopex-ui-default.css" />
	
	<script type="text/javascript"  src="../../js/libs/jquery/jquery-1.10.1.js"></script>
	<script type="text/javascript"  src="../../dist/script/alopex-ui.min.js"></script>	
</head>
<body>
	<button class="Button">child</button>
</body>
</html>
```

</div>
<script>
$('#btn_popup').click( function() {
     $a.popup({
           url: "popup/popup.html" // 팝업에 표시될 HTML
         , iframe: true // default
    });
 });
</script>

#### iframe 영역 제거

`$a.popup` 함수의 `iframe` 옵션을 `false`로 지정하여, `iframe`을 생성하지 않습니다.  
팝업 소스는 임의의 div 영역에 삽입되고, 화면에 보여지게 됩니다.

<div class="eg">
<div class="egview">
<button id="btn_popupnoiframe" class="Button">Popup ( iframe : false )</button> 
</div>
```
<!-- Parent html-->
<button id="btn_popupnoiframe" class="Button">Popup ( iframe : false )</button> 
```
```
<!-- Parent html-->
$('#btn_popupnoiframe').click( function() {
	$a.popup({
	    url: "popup/popup_noframe.html",
	    iframe: false,  // default 는 true
	});
});
```
```
<!-- Child html -->
<!-- iframe: false 인 경우, DOCTYPE html head title meta link body 등 제거 시켜야 합니다. -->
<script>
		$a.page(function() {
		    this.init = function(id, param) {

		    };
		});
</script> 
<div>Child</div>
```

</div>
<script>
$('#btn_popupnoiframe').click( function() {
	$a.popup({
	    url: "popup/popup_noframe.html",
	    iframe: false,  // default 는 true
	});
});
</script>

<span class="Font-bold Text-underline">여기서 주의하실 점은, 팝업 소스에 이미 로딩한 라이브러리(alopex-ui, jQuery에 대한 js, css 등)를 다시 로딩하지 않도록 해야 한다는 것입니다.</span>  
이는 이미 로딩하고 사용중인 js/css 를 새로운 상태로 override하는 것이 되어, 기존의 메모리를 잃어버리고, 업무적 오류를 발생 시킵니다.  
따라서 팝업 소스는 DOCTYPE/html/head/title/meta/link/body등이 제외된 tag(보통 body 내부에 마크업되어지는)들과 script만 있도록 해야 합니다.  
이 경우, 화면에 동적으로 [다이얼로그 컴퍼넌트](../dev-component/component.html?target=dialog#basic)를 생성하고 그 내부에 화면을 로드한 것과 동일합니다.  
(이와 반대로, iframe: true인 경우에는 parent와 확실히 구별된 child 영역에서만 새로운 js, css를 로딩하기 때문에 문제가 되지 않습니다.)  


### 윈도우 팝업

`$a.popup` 함수의 `windowpopup` 옵션을 `true`로 지정하여 윈도우팝업을 엽니다.  
윈도우 팝업을 사용하는 경우, [W3C window.open API](http://www.w3schools.com/jsref/met_win_open.asp) 에서 제공하는 옵션을 설정합니다.  
앞의 option 값과 중복되는 경우 "other"에 선언된 내용이 우선순위를 가집니다.  
윈도우 팝업 타이틀 변경 예시 : <code>window.onload = function() { this.document.title = "your new title"; } // load된 문서에서 처리</code>

<div class="eg">
<div class="egview">
<button id="btn_windowpopup" class="Button">window Popup</button> 
</div>
```
<!-- Parent html-->
<button id="btn_windowpopup" class="Button">window Popup</button> 
```
```
<!-- Parent html-->
$('#btn_windowpopup').click( function(e) {
    $a.popup({ 
          url: "popup/popup.html"
         ,windowpopup: true
         ,other: "width=1000,height=400,top=200,left=100,scrollbars=yes"
    });
    $(e.target).blur();
    
 });
```
```
<!-- Child html -->
<!-- iframe: true 또는 windowpopup: true 인 경우, DOCTYPE html head title meta link body 등 포함 시켜야 합니다. -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Popup Data</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<link rel="stylesheet" type="text/css" href="../../dist/css/alopex-ui-default.css" />	
	<script type="text/javascript"  src="../../js/libs/jquery/jquery-1.10.1.js"></script>
	<script type="text/javascript"  src="../../dist/script/alopex-ui.min.js"></script>	
	<script>
		window.onload = function() { this.document.title = "your new title"; } // load된 문서에서 처리
	</script>
</head>
<body>
	<button class="Button">child</button>
</body>
</html>
```
</div>
<script>
$('#btn_windowpopup').click( function(e) {
    $a.popup({ 
          url: "popup/popup.html"
         ,windowpopup: true
         ,other: "width=1000,height=400,top=200,left=100,scrollbars=yes"
    });
    $(e.target).blur();
 });
</script>   

### 팝업창 데이터 처리

`윈도우 팝업` 또는 `iframe 레이어 팝업`의 경우, 현재 실행되는 윈도우와 팝업 윈도우가 다르기 때문에 상호간에 데이터를 전달할 수 있어야 합니다.

#### 파라미터 전달

기존 윈도우에서 팝업창에 데이터를 전달하고자 하는 경우, `$a.popup` 함수의 `data` 옵션을 통해 전달합니다. 


이 데이터는 팝업창 내 `$a.page.init` 함수 두번째 인자로 전달됩니다.

<div class="eg">
<div class="egview">
<button id="btn_data_send" class="Button">파라미터 전달</button>


</div>
```
<!-- Parent html -->
<button id="btn_data_send" class="Button">파라미터 전달</button>
```
```
<!-- Parent html -->
$('#btn_data_send').click( function() {
     $a.popup({
        url: "popup/popup_data_send.html" 
      , data: {"item" :"red"} // 전달할 데이터          
      , iframe: true         
    });
 });
```
```
<!-- Child html -->
<!-- iframe: true 또는 windowpopup: true 인 경우, DOCTYPE html head title meta link body 등 포함 시켜야 합니다. -->
전달 받은 데이터 :: <span id="spanData" class="Font-bold Font-big"></span>
```
```
<!-- Child html -->
<script>
$a.page(function() {
    this.init = function(id, param) {
    	// 팝업창 내 $a.page.init 함수 두번째 인자로 전달
        $('#spanData').text(param["item"]);
    }
});
</script>	
```
</div>

<script>
$('#btn_data_send').click( function() {
     $a.popup({
        url: "popup/popup_data_send.html" 
      , data: {"item" :"red"}           
      , iframe: true         
    });
 });
</script>


#### 팝업창 결과값 전달

팝업 창을 닫을 때는 `$a.close` 함수를 호출하여 팝업창을 닫고, 결과 데이터를 파라미터로 전달합니다.

	
이렇게 전달된 결과 데이터는 `$a.popup 함수`의 옵션 파라미터로 전달된 콜백함수의 인자로 전달됩니다.

<div class="eg">
<div class="egview">
<button id="btn_popupdata" class="Button">파라미터 전달 및 받기</button> 
</div>
```
<!-- Parent html-->
<button id="btn_popupdata" class="Button">파라미터 전달 및 받기</button> 
```
```
<!-- Parent html-->
$('#btn_popupdata').click( function() {
     $a.popup({
        url: "popup/popup_data.html" 
      , data: {"item" :"red"}
      , iframe: true        
      , callback: function (data) { // $a.close(data) API 사용 시 동작하는 콜백
      		if(data !== null){ // 팝업 우측 상단 x 버튼으로 닫을 경우, $a.close(data); 와 같이 data를 넘겨주지 않으므로 data === null이다.
      			alert("팝업에서 가져온 데이터를 이용하여 버튼 이름 스타일 변경\n\ndata :: " + JSON.stringify(data));
				$('#btn_popupdata').css("color", data);
      		}
		}
	  , alias: "flag1"
	  , xButtonClickCallback : function(el){  // 우측 상단 X 버튼으로 닫을 경우 동작하는 콜백
                  if(el.alias === "flag1"){
                      if(confirm("저장되지 않은 데이터가 있습니다. 창을 닫으시겠습니까?")){
                          return true; // true를 return 시, 내부적으로 close 동작이 자동 수행됩니다.
                      }else{
                          return false; // false를 return 시, 내부적으로 close하는 동작을 제어 합니다.
                      }
                  }
        }         
    });
 });
```
</div>
<script>
$('#btn_popupdata').click( function() {
     $a.popup({
        url: "popup/popup_data.html" 
      , data: {"item" :"red"}
      , iframe: true        
      , callback: function (data) { // $a.close(data) API 사용 시 동작하는 콜백
      		if(data !== null){ // 팝업 우측 상단 x 버튼으로 닫을 경우, $a.close(data); 와 같이 data를 넘겨주지 않으므로 data === null이다.
      			alert("팝업에서 가져온 데이터를 이용하여 버튼 이름 스타일 변경\n\ndata :: " + JSON.stringify(data));
				$('#btn_popupdata').css("color", data);
      		}
		}
	  , alias: "flag1"
	  , xButtonClickCallback : function(el){  // 우측 상단 X 버튼으로 닫을 경우 동작하는 콜백
                  if(el.alias === "flag1"){
                      if(confirm("저장되지 않은 데이터가 있습니다. 창을 닫으시겠습니까?")){
                          return true; // true를 return 시, 내부적으로 close 동작이 자동 수행됩니다.
                      }else{
                          return false; // false를 return 시, 내부적으로 close하는 동작을 제어 합니다.
                      }
                  }
        }         
    });
 });
</script>

<div class="eg">
<div class="egview">
	popup_data.html
</div>
```
<!-- Child html-->
<!-- iframe: true 또는 windowpopup: true 인 경우, DOCTYPE html head title meta link body 등 포함 시켜야 합니다. -->
<div id="popup_wrap">		
	<span>popup_data.html</span>
	<div id="popCont"></div>
	<button id="btn_closePop" class="Button">close</button>		
</div>
```
```
<!-- Child html-->
$a.page(function() {
	this.init = function(id, param) {
	    // $a.popup() 이 넘겨받은 data를 param으로 전달.
	    var color = param["item"];
	    var text = "팝업을 닫으면 팝업버튼 색상이 "+color+"로 변경됩니다.";
	    $('#popCont').html(text);
	    $('#btn_closePop').click( function(){ // close 버튼을 누르면 
			$a.close(color); // 데이터를 팝업을 띄운 윈도우의 callback에 전달 
	    });
	}
});
```
</div>

 `$a.close()` 함수를 호출한 경우에도해당 콜백함수가 호출됩니다.(단, 데이터 전달은 되지 않습니다)

## Functions

### $a.popup(option)

팝업창을 여는 함수입니다.

- parameter 
	- option {object}
		- 팝업창의 옵션 정보
		- url {string}
			- 팝업창에서 보여질 화면의 주소
		- data {object}
			-  팝업창에 전달할 데이터
		- callback {function}
			- 팝업창이 닫힐 때 호출되는 콜백함수.
			- 팝업창 윈도우 컨텍스트에서 `$a.close`함수를 호출할 경우 호출됩니다.
		- modal {boolean}
			- 팝업창을 열 때, 모달 존재 여부
		- width {integer}
			- 팝업창의 너비
		- height {integer}
			- 팝업창의 높이
		- center {boolean}
			- 팝업창의 위치가 가운데 위치할 지 여부
		- windowpopup {boolean}
			- 윈도우 팝업 여부
			- 디폴트 설정은 false로 지정됩니다.
		- iframe {boolean}
			- windowpopup이 false일 경우에 적용.
			- 레이어 팝업으로 팝업창을 연 경우, 내부에 iframe으로 존재 여부
			- 디폴트 설정은 true로 지정됩니다.
		- other {string}
			- 윈도우 팝업을 사용하는 경우, [W3C window.open API](http://www.w3schools.com/jsref/met_win_open.asp) 에서 제공하는 옵션을 설정합니다.
			- 앞의 option 값과 중복되는 경우 other에 선언된 내용이 우선순위를 가집니다.
			- 적용 방법 예시는 [Alopex UI 윈도우 팝업](#Basic_윈도우팝업) 가이드를 참고 바랍니다.
			- 윈도우 팝업 타이틀 변경 예시 : <code>window.onload = function() { this.document.title = "your new title"; } // load된 문서에서 처리</code>
		- title {string | boolean}
		    - 타이틀을 지정합니다.
		    - true | false 로 지정 시 상단 타이틀 바 사용 여부를 지정.
		- alias {anything}
			- 사용자가 필요 시 설정하는 다이얼로그의 별칭
			- alias를 유니크한 값으로 부여하면 식별자로 사용 가능
		- xButtonClickCallback {function}
      		- 다이얼로그 우측 상단 기본 닫기 X 버튼 클릭 시 호출되는 콜백
		- resizable {boolean}
      		- 팝업창의 리사이즈 사용 여부
- return
	- 레이어 팝업의 경우, 생성된 dialog 컴퍼넌트 엘리먼트
	- 이 엘리먼트를 활용하여 팝업창을 닫습니다.
```
 pop = $a.popup({ ....});
```
<p>
<div class="eg">
<div class="egview">
<button id="btn_popupOpts" class="Button">Popup with Options</button>
<button id="close1" class="Button">close Popup</button>
</div>
```
<button id="btn_popupOpts" class="Button">Popup with Options</button>
<button id="close1" class="Button">close Popup</button> 
```
```
$('#btn_popupOpts').click( function() {
	pop1 = $a.popup({
	        url: "popup/popup.html" 
	      , data: "data"
	      , modal: false
	      , windowpopup: false              
	      , iframe: true                 
	      , width : 300     // 넓이 px
	      , height : 300    // 높이 px
	      , movable:true    // 이동 가능 
	      , resizable:true	// 리사이즈
	      , center: false 
	      , title : "팝업1"
	      , callback : function(data) { // 팝업창을 닫을 때 실행 
	          	alert("popup closed!"); 
      	}
	});
});
 
$('#close1').click( function(){
	$(pop1).close();
});	
```
</div>
<script>
$('#btn_popupOpts').click( function() {
	pop1 = $a.popup({
	        url: "popup/popup.html" 
	      , data: "data"
	      , modal: false
	      , windowpopup: false              
	      , iframe: true                 
	      , width : 300    // 넓이 px
	      , height : 300   // 높이 px
	      , movable:true   // 이동 가능 
	      , resizable:true // 리사이즈
	      , center: false 
	      , title : "팝업1"
	      , callback : function(data) { // 팝업창을 닫을 때 실행 
	          	alert("popup closed!"); 
      	}
	});
});
 
$('#close1').click( function(){
	$(pop1).close();
});	
</script> 

### $a.close(data)

윈도우 팝업 또는 iframe 레이어 팝업 등으로 팝업창을 연 경우, 다른 윈도우 컨텍스트에서 화면이 실행됩니다.  
이 경우 팝업창 내부에서 팝업창을 닫고 팝업창을 연 윈도우 컨텍스트에 데이터를 전달하기 위해 `$a.close` 함수를 사용합니다.  
([팝업창 결과값 전달 참고](#Basic_팝업창데이터처리_팝업창결과값전달))

- parameter
	- data {object}
		- 메인 윈도우 콜백함수에 전달할 데이터

같은 윈도우 컨텍스트에서 var pop1 = $a.popup({ ... }); 와 같이 return 값으로 팝업을 변수에 저장하였을 경우는 아래와 같이 close 할 수 있습니다.
```
$('#close').click( function(){
	$(pop1).close();
});
```

### $a.popup.setup(option)

`$a.popup` 함수에서 공통적으로 사용되는 값을 `$a.popup`함수 호출되기 이전 공통 영역에서 설정합니다.

예로 모든 팝업창의 너비, 높이값이 동일하면 `setup` 함수를 이용하여 너비 및 높이 정보를 설정합니다.

- parameter
	- option {object}
		- `$a.popup` 함수의 옵션 중 모든 팝업창에서 공통으로 사용될 옵션
		- url {function}
			- `option`의 `url` 키는 [$a.navigate.setup](javascript.html?target=navigate#Functions_anavigatesetupoption) 함수와 마찬가지로 동적으로 url 정보를 변경합니다.

```
$a.popup.setup({
	width: 1000,
	height: 500,
	center: true
});
```
