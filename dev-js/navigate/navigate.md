

# Navigation


## Functions

### $a.navigate(url, param)

특정 화면(url)으로 이동하며, 파라미터 데이터(param)를 전달합니다.

- parameter
	- url {string}
		- 이동할 화면 식별자입니다.
		- 절대경로, 상대경로, 아이디(이 경우, `$a.navigate.setup` 함수를 이용해 url 조작필요) 사용 가능합니다.
	-  param {object}
		- 이동할 화면에 전달할 파라미터 데이터
		- [$a.page.init](javascript.html?target=page#Functions_apageparameter) 함수의 `param`인자로 전달됩니다.
```
$a.navigate('customer/list'); // (url)
$a.navigate('customer/detail', {id: 'customer1'}); // (url, param)
```
<p>
<div class="eg">
<div class="egview">
<div class="Margin-bottom-10">navigate-examples.html 로 이동 및 param 전달</div>
	id: <input id="id1" type="text" class="Textinput" value="myId">
	password: <input id="pw1" type="text" class="Textinput"  value="myPwd1234">
	<button id="btn_navigate1" class="Button">화면이동</button>
</div>
```
<div>navigate-examples.html 로 이동 및 param 전달</div>
<button id="btn_navigate1" class="Button">화면이동</button>
```
```
$('#btn_navigate1').on('click', function() {
	var myId = $('#id1').val();
	var myPwd = $('#pw1').val();
	$a.navigate('navigate/navigate-examples.html',{id: myId, password: myPwd});
});
```
</div>
<script>
	
	$('#btn_navigate1').on('click', function() {
		var myId = $('#id1').val();
		var myPwd = $('#pw1').val();
		$a.navigate('navigate/navigate-examples.html',{id: myId, password: myPwd});
	});
</script>

<div class="eg">
<div class="egview">
이동 후 navigate-examples.html 화면 소스
</div>
```
$a.page({
	init: function(id, param) {
	    $a.page.method = 'POST';
	    $('#content').setData(param); //  {id: 'myId', password: "myPwd1234"}
	}
});
```
```
<div>		
	<h3>param을 통해 받은정보 </h3>
	<div id="content">
		<table class="Table">
			<tr>
				<td>아이디</td><td data-bind="text:id"></td>
			</tr>
			<tr>
				<td>패스워드</td><td data-bind="text:password"></td>
			</tr>
		</table>
	</div>		
</div>
```

</div>


### $a.back(results)

히스토리 스택 상 이전 화면으로 이동하며, results 데이터를 전달합니다.
이전 화면이 로드되면 `$a.page.init` 함수의 `param`인자로 전달됩니다.

- parameter
	- results {object}
		- 이전 화면에 전달할 데이터
		- 이 결과 데이터는 다음 함수로 전달됩니다.
			- `$a.page.init` 함수의 두번째 파라미터로 전달됩니다.

<div class="eg">
<div class="egview">
<div>1) navigate-examples-back1.html 로 이동</div>
<button id="btn_navigate_back" class="Button">화면이동</button>
</div>
```
<div>navigate-examples-back1.html 로 이동</div>
<button id="btn_navigate_back" class="Button">화면이동</button>
```
```
	$('#btn_navigate_back').on('click', function() {
		$a.navigate('navigate/navigate-examples-back1.html' , {pageNum:document.URL});
	});
```
</div>
<script>
	$('#btn_navigate_back').on('click', function() {
		$a.navigate('navigate/navigate-examples-back1.html' , {pageNum:document.URL});
	});
</script>

<div class="eg">
<div class="egview">
<div> 2) navigate-examples-back1.html 페이지 </div>
</div>
```
$a.page({
	init: function(id, param) {
		// param.pageNum : 이전 페이지의 정보
		$('h1').after('<span>From :'+param.pageNum+' page</span>'); 

		var thispage = 1;
		var pdata = {pageNum:thispage}; // 이 페이지의 정보 

	    $('#btn_back').on('click', function() {
	    	// 'Back' 버튼 을 누르면 현재페이지 정보(pdata)를 들고 이전페이지로 이동 
			$a.back(pdata); 
		});

		$('#btn_navigate_next').on('click', function() {
			// 'Next' 버튼을 누르면  현재페이지 정보(pdata)를 들고 url로 이동
			$a.navigate('navigate-examples-back'+(thispage+1)+'.html', pdata);  
		});

		$('body').setData(pdata); // 현재페이지 정보 세팅 
	}
});
```
```
<div>		
	<h1 data-bind="text:pageNum"></h1>
	<div>
		<button id="btn_back" class="Button">Back</button>
		<button id="btn_navigate_next" class="Button">Next</button>
	</div>			
</div>
```
</div>




### $a.navigate.setup(option)

`$a.navigate`, `$a.backTo` 함수에 입력된 url파라미터를 동적으로 변경 가능합니다.
이 기능을 통해, 함수를 호출할 때 전달하는 url 파라미터는 상대주소, 절대주소가 아닌 아이디 형태로 전달이 가능합니다.

- parameter
	- option {object}
		- url {function}
			- url을 동적으로 변경하는 함수입니다.
			- parameter
				- `$a.navigate` 함수의 파라미터와 동일합니다.

```
$a.navigate.setup({
	url: function(url, param) {
		return '/www/html/' + url + '.html';
	}
});

$a.navigate('customer/list'); // url은 String 타입이어야 합니다.
```
