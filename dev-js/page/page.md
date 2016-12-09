

# Page
## Basic

`$a.page` 함수는 웹 페이지 로딩에 대한 초기화 시점을 보장하여 
Alopex UI 컴포넌트와 애플리케이션 자바스크립트 함수를 규격화된 형태로 작성할 수 있도록 하는 페이지 컨트롤러 함수입니다.


### 초기화

`$a.page`로 전달하는 함수의 `init` 함수는 화면이 로드되고 처음으로 호출되어 화면을 초기화하는 함수입니다.

```
$a.page(function() {
	// 초기화 함수
	this.init = function(id, param) {
		...
	}
});
```

이 함수의 파라미터로는 `id`와 `param`이 전달되며, `id`는 화면의 아이디를 의미하고, `param`은 화면 이동 함수 또는 팝업 함수에서 전달되는 파라미터 데이터입니다.

- `init` 함수의 시점보장
-  웹 페이지가 로드된 이후 호출
-  Alopex UI 컴포넌트의 변환 작업이 완료된 이후 호출
-  [tabs 컴포넌트](../dev-component/component.html?target=tabs#basic)의 동적 탭이 로드되고 Alopex UI 컴포넌트 변환이 완료된 이후
-  팝업창이 나타나고 내부의 Alopex UI 컴포넌트 변환이 완료된 이후 호출


`$a.page`의 `init 함수`를 통해 초기화 함수를 일원화된 형태로 작성할 수 있습니다.

### 파라미터 전달

`$a.page 함수`의 `init 함수`의 파라미터로 데이터를 전달 받습니다. 

-  [$a.navigate 함수](javascript.html?target=navigate#basic)의 파라미터 데이터
-  [$a.back 함수](javascript.html?target=navigate#basic)의 결과 데이터
-  [$a.popup](javascript.html?target=popup#basic)함수의 파라미터 데이터

### 사용자함수 정의

화면 내에 사용되는 변수 및 함수는 `$a.page` Scope 내에 정의하는 것을 표준으로 하여, 글로벌 Scope에 불필요한 변수 및 함수들을 방지합니다.

#### Private 함수
`$a.page`내부에서만 사용가능한 함수는 아래와 같이 `$a.page` Scope에 정의 하여 사용합니다.

```
$a.page(function() {
	
	this.init = function(id, param) {
        privateFunction();
    };
	
    function privateFunction() { // private 함수
    	...
    }
});
```

#### Public 함수
`$a.page`외부에서 사용가능한 함수는 아래와 같이 `$a.page` 내부에서 `this` Scope에 정의 합니다.
정의된 Public함수는 `$a.page`의 리턴 값으로 접근하여 사용합니다.


<div class="eg">
<div class="egview">
<a href="page/page-examples-public.html" target="_black">public 샘플보기</a>
</div>
```
var main = $a.page(function() { // 'main' 리턴 
    this.init = function(id, param) {
    	//....
    };

    this.publicFunction = function() { // Public 함수
       alert("public function - MAIN!");
    }
});

$a.page(function() {
	this.init = function(id, param) {
		$('#btn_public').on('click', function() {
			main.publicFunction(); //
		});
	};
});
```
</div>

## Functions

### $a.page(parameter)

화면의 로직을 함수 내에 정의합니다.

- parameter
	- object
		- 화면 내에서 사용되는 변수 및 함수를 가진 오브젝트
		- init {function}
			- 화면 로직의 시작점이 되는 함수
			- parameter
				- id {string} 화면 ID
				- param {object}
					- 다음 데이터가 이 param 파라미터로 전달됩니다.
					- `navigate` 함수로 화면 이동한 경우, 이전 화면에서 전달된 데이터
					- 팝업창을 연 경우, 메인창에서 전달된 데이터
					- `back` 함수로 이동한 경우, 전달된 결과 데이터


<div class="eg">
<div class="egview">
<div>1) page-examples.html 로 이동</div>
<button id="btn_page" class="Button">화면이동</button>
</div>
```
<div>1) page-examples.html 로 이동</div>
<button id="btn_page" class="Button">화면이동</button>
```
```
$('#btn_page').on('click', function() {
	$a.navigate('page/page-examples.html' , {pageInfo:document.URL}); // pageInfo : 현재 페이지 url
});
```
</div>
<script>
	$('#btn_page').on('click', function() {
		$a.navigate('page/page-examples.html' , {pageInfo:document.URL});
	});
</script>

<div class="eg">
<div class="egview">
<div>  navigate함수를 이용해 페이지 이동후 page-examples.html </div>
</div>
```
$a.page({
	init: function(id, param) {
		$("#btn_request").click(function(){
			$a.request(
				/* 
				생략
				 */
			);		

	        initGrid();// 그리드 초기화

			function initGrid() {
				$('#grid').alopexGrid({
					/* 
					생략
					 */
				});
			};
		});
	}

	$('body').setData(param); // param으로 받은 이전 페이지 정보 세팅 

	$('#btn_back').on('click', function() { 
		$a.back(); // 이전 페이지로 이동
	});
});
```
```
<div>
	<div id="grid"></div>
	<div>
		<button id="btn_back" class="Button">Back</button>
		<strong>이전페이지 :</strong>		
		<span data-bind="text:pageInfo"></span>
	</div>				
</div>
```
</div>


				
<script>
$a.page(function() {
	this.init = function() {
		//console.log('init');
	};

});


$a.page(function() {
	this.init = function() {
		//console.log('init2');
	};

});




$a.page({
	// 초기화 함수
	init: function(id, param) {
		$a.page.method = 'POST';
		$a.page.getGridData(param.id);
		
	},
	
	method: 'GET', // 화면에서 사용되는 변수
	
	getGridData: function(id) { // 화면에서 사용되는 함수.
		/* function implementation area */
		
	}
});
</script>
