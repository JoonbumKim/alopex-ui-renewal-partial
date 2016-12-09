

# Storage

## Basic

클라이언트 영역(웹브라우저, 모바일 브라우저, 모바일 애플리케이션 등)에서 데이터를 저장하거나 읽어오는 API 입니다. 

이 함수들을 통해 현재 화면에서 가지고 있는 데이터를 다른 화면과 공유합니다. 가령 게시판 검색에 적용한 조건을 스토리지에 저장하여 사용자가 로그인 할 때마다 기존 설정을 재활용 할 수 있도록 할 수 있습니다.

## Functions

### $a.session

세션 영역에 데이터를 저장하거나 읽어오는 함수입니다.


```
$a.session('key'); // getter 함수 형태
$a.session('key', 'this is data stored.'); // setter 함수 형태(String object)
$a.session('key', {"key1" : "value1"}); // setter 함수 형태(JSON object)
```
- parameter
	- key {string}
		- 저장할 데이터의 키입니다.
	- value {anything} optional
		- `$a.session` 함수를 setter함수로 호출할 경우, 저장할 데이터입니다.
		- 이 파라미터가 존재할 경우, 함수는 setter함수입니다
		- 이 파라미터가 존재하지 않는 경우, 함수는 getter함수입니다.
		- 
- return
	- {string | undefined}
		- 다음의 경우, `undefined`가 리턴됩니다.
			- setter 함수로 사용된 경우
			- getter 함수로 사용되고, 파라미터로 전해진 `key`에 저장된 데이터가 존재하지 않는 경우
		- 다음의 경우, 문자열 타입 데이터가 리턴됩니다.
			- getter 함수로 사용되고, 데이터가 존재하는 경우

<style>
	.ColorPink {background: pink}
	.ColorPink:hover {background: #F396A6}
</style>
<div class="eg">
<div class="egview">
	<span class="Margin-bottom-10 Margin-right-10">KEY : <input type="text" id="myKey" class="Textinput"></span>
	<span class="Margin-bottom-10 Margin-right-10">VALUE : <input type="text" id="myVal" class="Textinput"></span>
	<button id="btn_session" class="Button"></button>
</div>
```
<style>
	.ColorPink {background: pink}
	.ColorPink:hover {background: #F396A6}
</style>
```
```
<span class="Margin-bottom-10 Margin-right-10">KEY : <input type="text" id="myKey" class="Textinput"></span>
<span class="Margin-bottom-10 Margin-right-10">VALUE : <input type="text" id="myVal" class="Textinput"></span>
<button id="btn_session" class="Button"></button>
```
```
$a.page(function(){
	function toggleButton(){
		var sessionKey = $('#myKey').val();
		var sessionValue = $('#myVal').val();
		if (sessionKey!="") {
		    if (sessionValue=="") {
		    	$('#btn_session').text("Get Session").removeClass('ColorPink');
		    } else {
		    	$('#btn_session').text("Set Session").addClass('ColorPink');
		    };
	    }else{
	    	$('#btn_session').text("Key를 넣으세요.").removeClass('ColorPink');
	    }
	}
	toggleButton();

	$('#myKey').on('keyup change',function(){
	    toggleButton();	    
	});
	$('#myVal').on('keyup change',function(){
	    toggleButton();	    
	});

	$('#btn_session').on('click', function() {
		var sessionKey = $('#myKey').val();
		var sessionValue = $('#myVal').val();
		var btnTxt = $(this).text();
		var storedValue = $a.session(sessionKey);
		
		//console.log("btnTxt:"+btnTxt);
		//console.log(sessionKey, sessionValue);

		if (sessionKey==""){
			alert("KEY 값이 없습니다.");
		} else if (btnTxt =="Get Session" && storedValue!=undefined) {
			
			alert(sessionKey+" 세션값 : " +storedValue);
		} else if(btnTxt =="Set Session"){
			$a.session(sessionKey, sessionValue);
			alert(sessionKey+" 세션 저장 성공");
		}
	});
});
```
</div>


<script>
$a.page(function(){
	function toggleButton(){
		var sessionKey = $('#myKey').val();
		var sessionValue = $('#myVal').val();
		if (sessionKey!="") {
		    if (sessionValue=="") {
		    	$('#btn_session').text("Get Session").removeClass('ColorPink');
		    } else {
		    	$('#btn_session').text("Set Session").addClass('ColorPink');
		    };
	    }else{
	    	$('#btn_session').text("Key를 넣으세요.").removeClass('ColorPink');
	    }
	}
	toggleButton();

	$('#myKey').on('keyup change',function(){
	    toggleButton();	    
	});
	$('#myVal').on('keyup change',function(){
	    toggleButton();	    
	});

	$('#btn_session').on('click', function() {
		var sessionKey = $('#myKey').val();
		var sessionValue = $('#myVal').val();
		var btnTxt = $(this).text();
		var storedValue = $a.session(sessionKey);
		
		//console.log("btnTxt:"+btnTxt);
		//console.log(sessionKey, sessionValue);

		if (sessionKey==""){
			alert("KEY 값이 없습니다.");
		} else if (btnTxt =="Get Session" && storedValue!=undefined) {
			
			alert(sessionKey+" 세션값 : " +storedValue);
		} else if(btnTxt =="Set Session"){
			$a.session(sessionKey, sessionValue);
			alert(sessionKey+" 세션 저장 성공");
		}
	});
});

</script>


### $a.session.clear(key)

세션 영역에 저장된 데이터 중 전달한 파라미터인 key에 매핑된 데이터를 삭제 합니다.  
$a.session.clear(key)와 같이 key를 명시한 경우, key에 해당하는 데이터만 삭제 됩니다.  
$a.session.clear()와 같이 파라미터를 명시하지 않은 경우, 모든 데이터가 삭제 됨을 유의하시기 바랍니다.  



### $a.cookie

웹브라우저 쿠키 영역에 데이터를 저장하거나 가져오는 함수를 제공합니다.

- parameter
	- key {string}
		- 저장할 데이터의 키입니다.
	- value {anything} optional
		- `$a.cookie` 함수를 setter함수로 호출할 경우, 저장할 데이터입니다.
		- 이 파라미터가 존재할 경우, 함수는 setter함수입니다
		- 이 파라티터가 존재하지 않는 경우, 함수는 getter함수입니다.
	- expires {number | DateObject} optional
		- 쿠키의 만료일자를 지정합니다.
		- number를 입력하면 해당 일수만큼 만료일자가 늘어납니다.
		- Date Object를 입력하여 만료일을 지정합니다.

- return
	- {string | undefined}
		- 다음의 경우, `undefined`가 리턴됩니다.
			- setter 함수로 사용된 경우
			- getter 함수로 사용되고, 파라미터로 전해진 `key`에 저장된 데이터가 존재하지 않는 경우
		- 다음의 경우, 문자열 타입 데이터가 리턴됩니다.
			- getter 함수로 사용되고, 데이터가 존재하는 경우


```
$a.cookie('key'); // getter 함수 형태
$a.cookie('key', 'this is data stored.'); // setter 함수 형태 
$a.cookie('key', 'this is data stored.', 2); // 만료일을 이틀 뒤로 지정 
$a.cookie('key', 'this is data stored.', DateObject); // DateObject에서 지정한 날짜를 만료일로 지정
```
	
