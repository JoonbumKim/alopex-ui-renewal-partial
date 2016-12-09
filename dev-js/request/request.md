

# Request

## Basic

`$a.request`함수는 비동기 HTTP(Ajax) 통신을 요청하는 함수로 통신 파리미터 자동 생성 및 응답 데이터 자동 바인드 기능을 제공합니다.


```
$a.request('serviceId', {
		
	data: {}, // 통신 parameter
	
	success: function(res) { 
		// 통신이 성공적으로 이루어 진 경우 호출되는 콜백함수
	},
	
	fail: function(res) {
		// 통신은 성공적으로 이루어 졌으나, 서버오류가 발생한 경우 호출되는 콜백함수
	},
	

	error: function(errObject) {
		// 통신이 실패한 경우 호출되는 콜백함수
	}
});
```
<br>

### 통신 샘플

<div class="eg">
<div class="egview">

<button class="Button" id="btn_request">조회</button>
<script>
$("#btn_request").click(function(){
			$a.request.setup({
		    url : function(id, param) {
		        return 'http://ui.alopex.io/2.3/started/education/' + id; // $a.request 서비스 ID가 적용될 것이다
		    },
		    method: 'get',
		    timeout: 30000,
		    before: function(id, option) {
		        this.requestHeaders["Content-Type"] ="application/json; charset=UTF-8";
		        // ...
		    },
		    after: function(res) {			 
		    	
	//	        if( fail condition ) {
	//	            this.isSuccess = false; // isSuccess false인 경우,  after 다음에 request fail callback이 호출 됨
	//	        }
		    }
		});
	
	
		$a.request('response.json', { // 서비스 ID
		//data : {"key1":"value1", "key2":"value2"}, // 통신 parameter
		success : function(res) {
			// 통신이 성공적으로 이루어 진 경우 호출되는 콜백함수
			alert("success!!\n\nres :: \n\n" + JSON.stringify(res));
		},

		fail : function(res) {
			// 통신은 성공적으로 이루어 졌으나, 서버오류가 발생한 경우 호출되는 콜백함수
			alert("fail!!\n\nres :: \n\n" + JSON.stringify(res));
		},

		error : function(errObject) {
			// 통신이 실패한 경우 호출되는 콜백함수
			alert("error!!\n\nerrObject :: \n\n" + JSON.stringify(errObject));
		}
	})
});
</script>
</div>

```
<button class="Button" id="btn_request">조회</button>
```

```
$("#btn_request").click(function(){
			$a.request.setup({
			    url : function(id, param) {
			        return 'http://ui.alopex.io/2.3/started/education/' + id; // $a.request 서비스 ID가 적용될 것이다
			    },
			    method: 'get',
			    timeout: 30000,
			    before: function(id, option) {
			        this.requestHeaders["Content-Type"] ="application/json; charset=UTF-8";
			        // ...
			    },
			    after: function(res) {			 
			    	
		//	        if( fail condition ) {
		//	            this.isSuccess = false; // isSuccess false인 경우,  after 다음에 request fail callback이 호출 됨
		//	        }
			    }
		});
	
	
		$a.request('response.json', { // 서비스 ID
			// get 방식 이기 때문에 통신 body 주석 처리
			//data : {"key1":"value1", "key2":"value2"}, // 통신 parameter
			success : function(res) {
				// 통신이 성공적으로 이루어 진 경우 호출되는 콜백함수
				alert("success!!\n\nres :: \n\n" + JSON.stringify(res));
			},
	
			fail : function(res) {
				// 통신은 성공적으로 이루어 졌으나, 서버오류가 발생한 경우 호출되는 콜백함수
				alert("fail!!\n\nres :: \n\n" + JSON.stringify(res));
			},
	
			error : function(errObject) {
				// 통신이 실패한 경우 호출되는 콜백함수
				alert("error!!\n\nerrObject :: \n\n" + JSON.stringify(errObject));
			}
	})
});
```
</div>



	

### Request 오브젝트 

`$a.request` 함수 호출 시 참조되는 정보를 가지고 있는 오브젝트입니다. 

`$a.request.setup` 함수를 통해 지정된 설정값이 저장됩니다.

- Request {object}
	- id {string}
		- HTML 통신 서비스 id
	- data {object}
		- 요청 파라미터
	- requestHeaders {object}
		- 요청 전문 헤더
	- responseHeaders {object}
		- 응답 전문 헤더
	- response {object}
		- 응답 데이터 오브젝트
	- responseText {string}
		- 응답 데이터 문자열
	- dataType {string}
		- 'json' (default) , 'jsonp', 'xml' - response - 서버에서 반환되는 데이터 형식을 지정
	- jsonp {string}
		- dataType을 'jsonp' 요청시 서버 응답되는 callback 함수 이름 지정 callback 파라미터로 지정한 함수이름이 전달 됩니다. 
		- jsonp : 미 지정시 ( 'jsonp_callback_' + Math.round(100000 * Math.random()) callback파라미터로 생성하여 전달)			
	- useServiceId {boolean}
		-  true(default), false - serviceId 파라미터 사용 여부
	- originalResponse {string}
		- error 발생 시 responseText 값
	- status {object}
		- error 정보 오브젝트
	- statusText {string} 
		- error 문자열
	- platform {string} 
		- 설정된  platform으로, `$a.request.setup` 설정의 이름을 정해주는 것
		- 디폴트 값은 "default"
		- 빌트인으로,  platform : "NEXCORE.J2EE", "NEXCORE.NET" 가 있습니다.
	- url {string | function} 
		- 서버 URL 문자열 또는 함수의 리턴값이 URL을 의미 
	- method {string | function} 
		- 통신 method
	- before {function}
		- 공통 전처리 함수
	- after {function}
		- 서버와 통신 이후 호출되는 공통 후처리 함수
		- 통신 성공/실패 여부 판단 등에 활용
	- success {function}
		- 요청 성공 시 호출되는 공통 콜백 함수
	- fail {function}
		- 서버로부터 응답은 받았으나, 서버오류 등으로 요청 실패한 경우 호출되는 콜백함수
	- error {function}
		- 서버와의 통신 오류 시 호출되는 콜백함수
	- timeout {integer}
		- 요청 timeout 시간 설정 (ms 단위)
	- isSuccess {boolean} 
		- `after` 후처리에서 성공/실패 판단 후 이 속성값을 `false`로 지정하여 `fail` 콜백함수가 호출되도록 설정
		- 후처리에서 사용되는 성공/실패 여부 판단





### Request 공통 Setup

통신 요청에 공통으로 사용되는 옵션값 및 로직을 미리 설정하여, 화면에서 호출되는 `$a.request`함수의 코드를 최소화합니다.

#### 공통옵션 지정

`timeout`, `method`, `success` 옵션 등 모든 `$a.request` 함수에서 동일하게 사용되는 옵션은 `$a.request.setup`함수를 통해 기본값으로 설정합니다.
설정된 값은 `Request 오브젝트`에 저장됩니다.

```
// common.js 등 업무 공통 js 내에 추가
// 실행 시, 모든 `$a.request` 함수의 'url'은 ''http://ui.alopex.io/2.3/started/education/' + id,
// 'platform'은 'default', 'method'는 'get', 'timeout'은 30000으로 선택되어 통신합니다.
$a.request.setup({
	url : function(id, param) {
			return 'http://ui.alopex.io/2.3/started/education/' + id; // $a.request 서비스 ID가 적용될 것이다
	},
	method: 'get',  // 또는 'post'
	timeout: 30000,
});
```

#### 공통 콜백함수 등록

모든 통신에서 공통으로 사용되는 로직을 정의합니다.

`$a.request` 함수는 `before`, `after`, `success` 등 시점에 따라 다양한 함수를 작성할 수 있는데, 이 중 모든 요청에 공통으로 사용되는 로직은 `$a.request.setup` 함수를 통해 등록합니다.

#### 샘플 : 공통 전처리

통신 요청을 보내기 전 요청헤더의 "Content-Type"을 "application/json; charset=UTF-8" 값으로 입력하는 예제입니다.
```
$a.request.setup({
	before: function(id, option) {
		this.requestHeaders["Content-Type"] ="application/json; charset=UTF-8";
	}
});
```
예제의 before 함수에서 `this`는 [Request 오브젝트](#Basic_Request오브젝트)를 의미하고, 이 오브젝트의 `requestHeaders`는 요청 헤더를 의미합니다. 요청헤더에 'Content-Type'을 지정합니다.

#### 샘플 : 공통 후처리

서버로부터 응답을 받은 이후 요청이 성공적으로 이루어 진 것을 판단하기 위한 로직은 모든 서비스 요청에 동일합니다. 

이런 성공/실패 판단 로직을 셋업함수의 `after` 함수에 등록합니다.
```
$a.request.setup({
	after: function(res) {
		if( fail condition ) {
			this.isSuccess = false
		}
	}
})
```

>`Request 오브젝트`의 `isSuccess` 속성값을 `false`로 지정하면 요청에 대한 응답을 실패로 지정합니다.


### 통신 서비스 식별

`$a.request` 함수의 첫번째 파라미터로 서비스 키로 서버에서 제공하는 서비스를 구분합니다.

>서버 구현 별로 서비스를 구분하는 방식은 다르므로 이 방식에 따라 서비스 키를 활용하는 로직은 공통 전처리함수에서 정의합니다.

아래 예제들처럼 다양한 방식으로 서비스를 구분합니다.

다음 예제는 파라미터의 서비스키를 활용해 서비스 호출 시 마다 다른 서버 URL로 요청하는 예제입니다.

```
$a.request.setup({
	url : function(id, param) {
		return '/services/' + id;
	}
});
```

다음은 서비스 키를 요청헤더에 내에 입력하여 서버와 서비스를 식별하는 경우의 예제입니다.

```
$a.request.setup({
	before: function(id, option) {
		// 식별자를 요청헤더에 위치
		this.requestHeaders['serviceid'] = id;
	}
});
```

다음은 서비스 키를 통신 파라미터 내에 입력하는 경우의 예제입니다.

```
$a.request.setup({
	before: function(id, option) {
		// 식별자를 요청 파라미터에 위치
		this.data.serviceid = id;
	}
});
```


### 파라미터 자동 생성

`$a.request`함수의 `data`옵션을 리터럴 오브젝트로 지정하지 않고 마크업 셀렉터(또는 CSS 셀렉터라고도 불리며 HTML을 선택하는 문법)로 지정하면, 해당 영역에서 데이터를 파싱하여 통신 파라미터에 추가합니다.

```
data: '#grid',
data: ['#form', '#grid'], // 한 개이상의 영역의 경우 배열의 형태로 셀렉터 정의.
```

파라미터 자동 생성 기능은 내부적으로 [Alopex UI 데이터바인드](javascript.html?target=databind#basic_통신연계)를 사용하기 때문에, HTML 엘리먼트에 `data-bind` 속성이 정의되어야 합니다.

화면에서 읽어온 데이터는 사전에 지정된 데이터 위치에 추가됩니다. 









### 응답 데이터 자동 바인드

`$a.request` 함수의 `success` 옵션을 다음과 같이 특정 영역의 셀렉터로 지정하여 선택된 영역에 데이터를 바인드합니다.

[통신 파라미터 자동 생성](#Basic_파라미터자동생성)과 같이 데이터바인드하고자 하는 영역의 셀렉터를 입력합니다.

```
success: '#grid', // 한 영역에 데이터 바인드하는 경우
success: ['#grid', '#form'], // 한 개 이상의 영역에 데이터 바인드하는 경우
success: ['#grid', function(res) {

}], // 자동 바인딩 하고, 콜백함수 호출.
```


### 통신 인터페이스

파라미터 자동 생성 및 응답 데이터 자동 바인드 기능은 데이터의 위치에 대한 `규칙`이 필요합니다. 

통신 파라미터 구성 시 또는 자동 바인딩 시 어느 데이터를 가져와야 되는지 어디에 데이터를 저장해야 하는지 알아야 되기 때문입니다.

Alopex UI는 데이터를 크게 `그리드 형태의 배열 타입 데이터`와 `그 외 모든 데이터`(오브젝트 및 기본 primitive 데이터) 두가지로 분류하여 
플랫폼 별로 이 데이터 위치를 지정하는 방식을 제공합니다.

디폴트 통신 인터페이스와 J2EE, .NET 프레임워크 통신 인터페이스를 통해 플랫폼별로 이 위치를 어떻게 정하는 지 살펴봅니다.

#### 디폴트 통신 인터페이스

`Request 오브젝트` 내 `platform` 속성의 디폴트 값은 `default`입니다.

`$a.request.setup` 함수에서 `platform`을 설정하지 않을 경우, 아래와 같은 통신 인터페이스를 사용합니다.

아래 샘플 데이터는 통신 시 사용되는 파라미터를 리터럴 오브젝트 형태로 표현한 것입니다.

```
{
	// 그리드 데이터. 
	// 오브젝트 형태로 구성되고 내부에 list 키로 배열 데이터 전달합니다.
	// currnetLength, currentPage, perPage, totalLength 키로 페이징 정보 전달합니다.
	griddata: {
		list: [],
		currentLength: ''
		currentPage: ''
		perPage: ''
		totalLength: ''
	},
	
	// 오브젝트 데이터 등 FORM 또는 데이터에서 읽은 데이터는 루트 경로에 위치하여 전달합니다.
	name: 'Hong, Gil-Dong'
	password: 'password',
	....
	
}
```

모든 데이터는 오브젝트 루트에 위치하며, 그리드 데이터는 다음 형식에 따릅니다.

```
{
	list: [],
	currentLength: ''  // 현재 페이지에 할당된 데이터 수
	currentPage: '' // 선택된 페이지
	perPage: '' // 한 페이지 당 최대 데이터 수
	totalLength: ''  // 전체 데이터 수
}
```
위의 데이터 예제를 사용하여 자동 바인딩을 하고자 하는 경우, HTML코드와 Javascript코드는 다음과 같습니다.

```
<form id="form">
	<input data-bind="value:name">
	<input data-bind="value:password">
</form>
<div id="grid" data-bind="grid: griddata"></div>
```

```
$a.request({
	success: ['#form', '#grid']
});
```


### 파라미터 자동 생성 / 응답 데이터 자동 바인드 샘플 코드
grid와 form 컴퍼넌트에 입력된 데이터를 자동으로 통신 파라미터에 추가 합니다. form의 input, radio 부분에 임의 값을 입력/선택하시고 '파라미터 자동 생성 테스트' 버튼을 눌러보세요. 본 예제에서는  [Alopex Grid](http://grid.alopex.io/html/docs.html) 를 활용한 예제입니다.
<div class="eg">
<div class="egview">

	<div id="gr2"></div>
	<div id="bindarea2">
		<p>ID : <input class="Textinput" data-bind="value: id"> 
		   PW : <input class="Textinput" type="password" data-bind="value: password"></p>
		<label><input class="Radio" name="gender" type="radio" value="male" data-bind="checked:gender"> male </label>
		<label><input class="Radio" name="gender" type="radio" value="female" data-bind="checked:gender"> female</label>
	</div>
	<button class="Button Margin-top-5" id="btn_auto_param">파라미터 자동 생성 테스트</button>
	<div id="gr3"></div>
<script>
	var gridData2 = [
					{
						"name": "Vera",
						"phone": "138-955-8109",
						"email": "eu.odio@maurisblanditmattis.ca"
					},
					{
						"name": "Autumn",
						"phone": "369-405-2973",
						"email": "Quisque@loremsemper.com"
					}
				];
	
	$('#gr2').alopexGrid({
		autoColumnIndex: true,
		fitTableWidth: true,
		defaultColumnMapping : 
	    {//모든 컬럼에 정렬 옵션이 적용됩니다.
	        align: 'center'
	    },
		columnMapping : [
			 {
				key : 'name',
				title : 'name'
			}, {
				key : 'phone',
				title : 'phone'
			}, {
				key : 'email',
				title : 'email'
			}
		],
		data:  gridData2
		});

	$("#btn_auto_param").click(function(){
			$a.request.setup({
			    url : function(id, param) {
			       //  return 'http://localhost:9000/2.3/started/education/' + id; // $a.request 서비스 ID가 적용될 것이다
			        return 'http://ui.alopex.io/2.3/started/education/' + id; // $a.request 서비스 ID가 적용될 것이다
			    },
			    method: 'post',
			    timeout: 30000,
			    before: function(id, option) {
			        alert("request!!\n\n입력된 데이터를 자동으로 추출합니다!!\n\ndata :: " + JSON.stringify(this.data));
			    }
			});
		
			$a.request('response.json', { // 서비스 ID
				data : [$('#gr2').alopexGrid("dataGet"), "#bindarea2"], // #gr2 데이터 전체 보내기
				//data : ['#gr2', "#bindarea2"], // #gr2 데이터 중 added, edited, deleted 변경 데이터만 보내기 
				success : function(res) {
					// 통신이 성공적으로 이루어 진 경우 호출되는 콜백함수
					alert("success!!\n\nres :: \n\n" + JSON.stringify(res));
					/*
					res : 					
					{
					    "dataSet": {
					        "message": {
					            "result": "OK",
					            "messageId": "M3000000",
					            "messageName": "정상처리입니다."
					        },
					        "recordSets": {
					            "grid_todolist": {
					                "nc_list": [
					                    {
					                        "number": "1",
					                        "todo": "Check Email"
					                    },
					                    {
					                        "number": "2",
					                        "todo": "Dentist's appoinment"
					                    },
					                    {
					                        "number": "3",
					                        "todo": "Wash car"
					                    },
					                    {
					                        "number": "4",
					                        "todo": "Pick up kids"
					                    },
					                    {
					                        "number": "5",
					                        "todo": "pay bills"
					                    }
					                ]
					            }
					        }
					    }
					}
					*/

					var gridData3 = res.dataSet.recordSets.grid_todolist.nc_list;

						$('#gr3').alopexGrid({
							title: "response 데이터를 이용해 새로운 그리드에 데이터를 바인딩 합니다.",
							autoColumnIndex: true,
							fitTableWidth: true,
							defaultColumnMapping : 
						    {//모든 컬럼에 정렬 옵션이 적용됩니다.
						        align: 'center'
						    },
							columnMapping : [
								 {
									key : 'number',
									title : 'number'
								}, {
									key : 'todo',
									title : 'todo'
								}
							],
							data:  gridData3
						});
				},
	
				fail : function(res) {
					// 통신은 성공적으로 이루어 졌으나, 서버오류가 발생한 경우 호출되는 콜백함수
					alert("fail!!\n\nres :: \n\n" + JSON.stringify(errObject));
				},
	
				error : function(errObject) {
					// 통신이 실패한 경우 호출되는 콜백함수
					alert("error!!\n\nres :: \n\n" + JSON.stringify(errObject));
				}
			})
		});
</script>
</div>

```
	<div id="gr2"></div>
	<div id="bindarea2">
		<p>ID : <input class="Textinput" data-bind="value: id"> 
		   PW : <input class="Textinput" type="password" data-bind="value: password"></p>
		<label><input class="Radio" name="gender" type="radio" value="male" data-bind="checked:gender"> male </label>
		<label><input class="Radio" name="gender" type="radio" value="female" data-bind="checked:gender"> female</label>
	</div>
	<button class="Button Margin-top-5" id="btn_auto_param">파라미터 자동 생성 테스트</button>
	<div id="gr3"></div>
```

```
	var gridData2 = [
					{
						"name": "Vera",
						"phone": "138-955-8109",
						"email": "eu.odio@maurisblanditmattis.ca"
					},
					{
						"name": "Autumn",
						"phone": "369-405-2973",
						"email": "Quisque@loremsemper.com"
					}
				];
	
	$('#gr2').alopexGrid({
		autoColumnIndex: true,
		fitTableWidth: true,
		defaultColumnMapping : 
	    {//모든 컬럼에 정렬 옵션이 적용됩니다.
	        align: 'center'
	    },
		columnMapping : [
			 {
				key : 'name',
				title : 'name'
			}, {
				key : 'phone',
				title : 'phone'
			}, {
				key : 'email',
				title : 'email'
			}
		],
		data:  gridData2
		});

	$("#btn_auto_param").click(function(){
			$a.request.setup({
			    url : function(id, param) {
			       return 'http://ui.alopex.io/2.3/started/education/' + id; // $a.request 서비스 ID가 적용될 것이다
			    },
			    method: 'post',
			    timeout: 30000,
			    before: function(id, option) {
			        alert("request!!\n\n입력된 데이터를 자동으로 추출합니다!!\n\ndata :: " + JSON.stringify(this.data));
			    }
			});
		
			$a.request('response.json', { // 서비스 ID
				data : [$('#gr2').alopexGrid("dataGet"), "#bindarea2"], // #gr2 데이터 전체 보내기
				//data : ['#gr2', "#bindarea2"], // #gr2 데이터 중 added, edited, deleted 변경 데이터만 보내기 
				success : function(res) {
					// 통신이 성공적으로 이루어 진 경우 호출되는 콜백함수
					alert("success!!\n\nres :: \n\n" + JSON.stringify(res));
					/*
					res : 					
					{
					    "dataSet": {
					        "message": {
					            "result": "OK",
					            "messageId": "M3000000",
					            "messageName": "정상처리입니다."
					        },
					        "recordSets": {
					            "grid_todolist": {
					                "nc_list": [
					                    {
					                        "number": "1",
					                        "todo": "Check Email"
					                    },
					                    {
					                        "number": "2",
					                        "todo": "Dentist's appoinment"
					                    },
					                    {
					                        "number": "3",
					                        "todo": "Wash car"
					                    },
					                    {
					                        "number": "4",
					                        "todo": "Pick up kids"
					                    },
					                    {
					                        "number": "5",
					                        "todo": "pay bills"
					                    }
					                ]
					            }
					        }
					    }
					}
					*/

					var gridData3 = res.dataSet.recordSets.grid_todolist.nc_list;

						$('#gr3').alopexGrid({
							title: "response 데이터를 이용해 새로운 그리드에 데이터를 바인딩 합니다.",
							autoColumnIndex: true,
							fitTableWidth: true,
							defaultColumnMapping : 
						    {//모든 컬럼에 정렬 옵션이 적용됩니다.
						        align: 'center'
						    },
							columnMapping : [
								 {
									key : 'number',
									title : 'number'
								}, {
									key : 'todo',
									title : 'todo'
								}
							],
							data:  gridData3
						});
				},
	
				fail : function(res) {
					// 통신은 성공적으로 이루어 졌으나, 서버오류가 발생한 경우 호출되는 콜백함수
					alert("fail!!\n\nres :: \n\n" + JSON.stringify(errObject));
				},
	
				error : function(errObject) {
					// 통신이 실패한 경우 호출되는 콜백함수
					alert("error!!\n\nres :: \n\n" + JSON.stringify(errObject));
				}
			})
		});
```
</div>




#### 통신 데이터 인터페이스 변경 시 가이드

>디폴트 통신 인터페이스 외에 다른 데이터 인터페이스를 사용하고자 하는 경우에 새로운 플랫폼을 생성하여 데이터 위치를 다시 정의합니다.


#### 플랫폼 정의

`$a.request.setup`함수는 파라미터를 어떻게 전달하는 냐에 따라 다르게 동작합니다.
첫번쨰 파라미터로 문자열을 전달하는 경우 플랫폼을 정의하는 기능을 하여 첫번째 파라미터는 새로운 플랫폼의 이름을 의미하고, 두번째 파라미터에 새로운 플랫폼의 통신 인터페이스를 지정합니다.
반면 첫번째 파라미터를 오브젝트로 전달하는 경우, 공통 옵션을 설정하는 기능을 합니다.

다음 예제는 플랫폼을 정의 하기 위한 호출로, 첫번째 파라미터로 새로운 플랫폼의 이름을 전달합니다.


```
$a.request.setup('platform-name', {
	
	// 통신에 사용되는 데이터 구조
	interface: {
		grid: {},
		object: {}
	},
	
	// grid 엘리먼트에서 읽은 배열 타입의 데이터 및 페이징 정보 
	grid: function(elem, data) {
		var key = elem.id;
		return  {
			list: data.grid[key].list,
			currentLength: data.grid[key].currentLength,
			currentPage: data.grid[key].currentPage,
			perPage: data.grid[key].perPage,
			totalLength: data.grid[key].totalLength
		}
	},
	
	// form 엘리먼트 등에서 읽은 데이터로 primitive 데이터
	object: function(elem, data) {
		return data.object;
	}
});
```

두번째 파라미터로 플랫폼에서 사용할 통신 인터페이스에 대한 정보를 `interface`, `grid`, `object`를 통해 입력합니다. 

`interface`은 통신에 사용되는 데이터 인터페이스를 리터럴 오브젝트 형태로 입력합니다. 
이 오브젝트 형태대로 통신 파라미터 구조가 생성됩니다.

`grid`는 그리드 데이터가 통신 인터페이스 어디에 위치하는 지 지정합니다. 
함수로 정의하며 파라미터로 데이터가 연결될 `그리드 엘리먼트`와 통신에 사용되는 `통신 인터페이스 데이터`오브젝트가 전달됩니다.
두번째 파라미터로 전달된 오브젝트를 통해 데이터의 경로를 지정합니다. 
그리드의 경우 데이터외에 페이징 정보도 필요로 하기 때문에, 위의 예제와 같은 오브젝트 구조로 경로를 지정합니다. 

위의 예제를 보면 현재 선택된 페이지의 그리드 데이터는 `data.grid.grid_id.list`, 현재 선택된 페이지의 데이터 수는 `data.grid.grid_id.currentLength`,
현재 선택된 페이지는 `data.grid.grid_id.currentPage`, 페이지 별 표시되는 최대 데이터 수는 `data.grid.grid_id.perPage`, 
전체 데이터 수는 `data.grid.grid_id.totalLength`에 위치합니다.

`object`는 그리드 데이터 외 나머지 데이터들이 위치하는지 지정하며, 위 예제는 경로가 `data.object`로 지정됩니다. 


### NEXCORE J2EE 통신 인터페이스

[SK C&C NEXCORE J2EE 프레임워크](http://nexcore.skcc.com/ko/solution/framework/j2ee/)에서 사용되는 통신 인터페이스는 빌트인으로 제공됩니다. 

```
// `NEXCORE.J2EE` 플랫폼 사용하기 위해 `platform` 속성을 지정합니다.
$a.request.setup({
	platform: 'NEXCORE.J2EE'
});
```

NEXCORE J2EE 프레임워크는 통신 시 다음과 같은 인터페이스를 사용합니다.

```
{
	dataSet: {
		message: {
			result: 'OK' // 서버 통신 성공/실패 여부 판단
		},
		fields: {
			// 오브젝트 형태의 데이터 
		},
		recordSets: {
			// N개의 배열 형태 데이터가 저장.
			rs1: {
				nc_list: [],
				nc_pageNo: 1,
				nc_recordCount: 10,
				nc_recordCountPerPage: 10,
				nc_totalRecordCount: 139
			}
		}
	},
	transaction: {
		id: '' // HTTP 통신 서비스를 구분하는 식별자
	},
	attributes: {}
}
```

그리드 데이터는 `dataSet.recordSets` 하위에 그리드 아이디를 키로 위치(한개 이상의 그리드 데이터가 존재)하고, 그 외 데이터는 `dataSet.fields` 필드에 위치합니다. 

`dataSet.recordSets` 필드는 오브젝트 타입의 데이터로 여러 그리드 데이터가 다른 키로 존재할 수 있습니다. 'NEXCORE.J2EE'에서 사용하는 그리드 데이터는 다음 구조를 가집니다.

위 예제는  `rs1` 키로 한 개의 그리드 데이터가 존재합니다. 

```
{
	nc_list: [],  // 데이터 배열 
	nc_pageNo: 1, // 선택된 페이지
	nc_recordCount: 10, // 현재 선택된 페이지의 데이터 수
	nc_recordCountPerPage: 10, // 한 페이지에서 최대 데이터 수
	nc_totalRecordCount: 139 // 모든 데이터 수
}
```



#### NEXCORE J2EE 플랫폼 설정 샘플 

`NEXCORE.J2EE` 플랫폼을 정의 하는 코드 샘플은 다음과 같습니다.

```
$a.request.setup('NEXCORE.J2EE', {
	interface: {
		dataSet: {
			message: {},
			fields: {},
			recordSets: {}
		},
		transaction: {},
		attributes: {}
	},
	
	object: function(elem, data) {
		return data.dataSet.fields;
	},
	
	grid: function(elem, data) {
		var bindkey = $(elem).attr('data-bind')? ($(elem).attr('data-bind').replace(/\s*grid\s*:/gi, '').trim()) : undefined;
		var key = bindkey || elem.id;
		return {
			list: data.dataSet.recordSets[key].nc_list,
			currentPage: data.dataSet.recordSets[key].nc_pageNo,
			perPage: data.dataSet.recordSets[key].nc_recordCountPerPage,
			currentLength: data.dataSet.recordSets[key].nc_recordCount,
			totalLength : data.dataSet.recordSets[key].nc_totalRecordCount
		};
	}
});
```

`interface` 속성에 J2EE 플랫폼에서 사용되는 통신 인터페이스를 리터럴 오브젝트로 표현합니다.
`object` 속성에는 그리드 외 데이터들이 `data.dataSet.fields`에 위치하는 것을 지정합니다. 
`grid` 속성에는 다음의 값을 지정하여 그리드데이터 위치를 지정하는데, 함수가 리턴되는 오브젝트 형태를 주목합니다.

```
{
	list: data.dataSet.recordSets[key].nc_list,
	currentPage: data.dataSet.recordSets[key].nc_pageNo,
	perPage: data.dataSet.recordSets[key].nc_recordCountPerPage,
	currentLength: data.dataSet.recordSets[key].nc_recordCount,
	totalLength : data.dataSet.recordSets[key].nc_totalRecordCount
}
```

위의 정의는 그리드 데이터는 `data.dataSet.recordSets` 하위의 그리드 키로 오브젝트를 생성하고 
그 오브젝트 하위 `nc_list`, `nc_pageNo`, `nc_recordCountPerPage`, `nc_recordCount`, `nc_totalRecordCount` 경로에 데이터가 저장됩니다. 



### NEXCORE .NET 통신 인터페이스

[SK C&C NEXCORE .NET 프레임워크](http://nexcore.skcc.com/ko/solution/framework/net/)에서 사용되는 통신 인터페이스는 빌트인으로 제공됩니다. 

```
// `NEXCORE.NET` 플랫폼 사용하기 위해 `platform` 속성을 지정합니다.
$a.request.setup({
	platform: 'NEXCORE.NET'
});
```

NEXCORE .NET 프레임워크는 통신 시 다음과 같은 인터페이스를 사용합니다.

```
request : {
	ServiceType : {}, // 서비스 타입
	ServiceName : {}, // 서비스 명
	ServiceData : {
		DataSet : {
			DataSetName : {},
			Tables : [{
						TableName : "Table1", // 그리드 명
						Rows : [], // 그리드 배열 데이터
						PageNumber : 1, // 그리드 현재 페이지
						RowspPage : 20 // 그리드 페이지 당 데이터 수
					}]
		},
		Hashtable: {} // 오브젝트 형태의 form 데이터
	}
}
```

그리드 데이터는 `ServiceData.DataSet.Tables` 하위 배열에 오브젝트 형태로(한개 이상의 그리드 데이터가 존재) 위치하고, 그 외 데이터는 `ServiceData.Hashtable` 필드에 위치합니다. 

`ServiceData.Hashtable` 필드는 오브젝트 타입의 데이터로 여러 그리드 데이터가 다른 키로 존재할 수 있습니다. 'NEXCORE.NET'에서 사용하는 그리드 데이터는 다음 구조를 가집니다.

위 예제는  `Table1` 키로 한 개의 그리드 데이터가 존재합니다. 

```
{
	TableName : "Table1", // 그리드 명
	Rows : [], // 그리드 배열 데이터
	PageNumber : 1, // 그리드 현재 페이지
	RowspPage : 20 // 그리드 페이지 당 데이터 수
}
```



#### NEXCORE .NET 플랫폼 설정 샘플 

`NEXCORE.NET` 플랫폼을 정의 하는 코드 샘플은 다음과 같습니다.

```
	$a.request.setup('NEXCORE.NET', { // platform
		interface : {
			request : {
				ServiceType : {}, // 서비스 타입
				ServiceName : {}, // 서비스 명
				ServiceData : {
					DataSet : {
						DataSetName : {},
						Tables : [] // grid 데이터
					},
					Hashtable: {} // form 데이터
				}
			}
		},
		object : function(elem, data) {
			return data.request.ServiceData.Hashtable;
		},
		grid : function(elem, data) {
			var key;
			if ($.alopex.util.isValid(elem.key)) {
				key = elem.key;
			} else {
				key = getGridKey(elem);
			}
			var Tables = data.request.ServiceData.DataSet.Tables;
			var gridData = null;
			$.each(Tables, function(i, v){
				if(v.TableName === key) gridData = v;
			});
			if(gridData === null){
				gridData = { "TableName" : key };
				Tables.push(gridData);
			}
			return {
				list : gridData.Rows,
				currentPage : gridData.PageNumber,
				perPage : gridData.RowspPage,
				currentLength : gridData.RowsLength,
				totalLength : gridData.TotalRowsLength,
				setList: function(list) {
					gridData.Rows = list;
				},
				setCurrentPage: function(currentPage) {
					gridData.PageNumber = currentPage;
				},
				setperPage: function(perPage) {
					gridData.RowspPage = perPage;
				},
				setcurrentLength: function(currentLength) {
					gridData.RowsLength = currentLength;
				},
				settotalLength: function(totalLength) {
					gridData.TotalRowsLength = totalLength;
				}
			};
		}
	});
```

`interface` 속성에 .NET 플랫폼에서 사용되는 통신 인터페이스를 리터럴 오브젝트로 표현합니다.
`object` 속성에는 그리드 외 데이터들이 `data.request.ServiceData.Hashtable`에 위치하는 것을 지정합니다. 
`grid` 속성에는 다음의 값을 지정하여 그리드데이터 위치를 지정하는데, 함수가 리턴되는 오브젝트 형태를 주목합니다.

```
{
	list : gridData.Rows,
	currentPage : gridData.PageNumber,
	perPage : gridData.RowspPage,
	currentLength : gridData.RowsLength,
	totalLength : gridData.TotalRowsLength,
}
```

## Functions

### $a.request (serviceId, options)

통신을 요청하는 함수입니다.

- parameter

	- serviceId {String} Required  
		- 통신 서비스를 구분하는 식별자
		
	- options {object} Optional
		- data {object | function | string | array}
			- 서비스 요청 시 동반되는 파라미터 정보를 정의합니다.
			- 네가지 타입을 지원합니다.
				- object 
					- 서버에 전달할 데이터를 오브젝트 형태로 입력.
				- function (id, options)
					- parameter
						- id: serviceId
						- options: 통신 옵션들
					- 조건 판단등의 함수로 데이터 처리가 필요한 경우 사용.
					- 함수의 리턴값이 통신 파라미터로 사용됩니다.
				- string
					- 선택 영역에서 데이터를 읽어서 인자를 자동 생성
				- array
					- 자동 파라미터 생성 기능을 사용하고, 그 외 함수를 사용하고자 하는 경우 활용.
					
		- success {function | string | array}
			- 통신이 성공적으로 실행됬을 때의 액션을 정의합니다.
			- 아래 세 타입을 지원합니다.
				- function
					- parameter
						- response object
					- 콜백함수
				- string
					- 응답 데이터 자동 데이터바인드
				- array
					- 자동 바인딩 기능을 사용하고, 그 외 사용자 함수를 사용하고자 하는 경우 활용.
					
		- fail {function}
			- parameter
				- response object
			- 서버로부터 요청에 대한 응답이 왔으나,서버오류가 발생한 경우 호출되는 콜백함수
			
		- error {function}
			- parameter
				- error object
			- 네트워크 장애 등 요청이 서버로 전달되지 않은 경우에 호출되는 콜백함수			
			
				
- sample code
	
``` 
$a.request('getUsers', {
	
	data: { // 통신 파라미터를 오브젝트로 정의
		param1: '',
		param2: ''
	}
	
	data: '#form', // 셀렉터를 이용한 파라미터 자동 생성 
	data: ['#form', '#grid'], // 복수개의 셀렉터를 이용한 파라미터 자동 생성 
	
	data: function(id, option) {
		return {}; // 함수로 지정 시 리턴된 오브젝트가 통신 파라미터로 사용
	},

	success: '#grid',  // 선택된 셀렉터로 자동 데이터바인드
	success: ['#form', '#grid'], // 복수개의 셀렉터로 자동 데이터바인드
	
	success: function(res) {  // 함수 사용가능
		alert('데이터를 성공적으로 받아왔습니다.');
	},
	
	success: ['#grid', function(res) { // 자동데이터바인드와 함수를 맵핑해서 사용 가능
		alert('데이터를 성공적으로 받아왔습니다.');
	}],
	
	fail: function(res) { // 개별 통신 로직에서 통신 실패 처리 가능
	}
	
	error: function(res) { // 개별 통신 로직에서 통신 오류 처리 가능
	}
})
```

> 위 예제는 `data`, `success` 속성들의 다양한 사용법에 대한 예제를 보여주는 것입니다.
> 
> 다음과 같이 2개 이상의 동일한 속성을 지정할 수는 없습니다. 
> 
> 예로, `success` 속성에 함수를 지정하면 자동 바인딩 기능을 사용하지 못하며, 데이터 바인드의 `.setData` 함수를 사용하여 바인드하는 방식을 권장합니다.


### $a.request.setup ([platform_name], options)

request 함수 사용 시의 디폴트 값을 설정합니다.

- options {object} : request 함수의 설정값입니다.
	- platform_name {string} optional
		- 셋업함수로 새로운 플랫폼을 정의하거나 기존 플랫폼을 재정의하고자 하는 플랫폼 이름

	- options {object} Required
		- 오브젝트에 사용되는 옵션들
		- interface {object}
			- 새로운 플랫폼 정의 시 통신 인터페이스 구조를 리터럴 오브젝트 형태로 설정합니다.
		- object {function}
			- 새로운 플랫폼 정의 시 오브젝트 데이터의 참조 위치를 결정합니다.
			- parameter
				- elem {HTML element}
					- 데이터가 바인드 될 HTML 엘리먼트
				- data {object}
					- 서버로부터 받은 응답 오브젝트
					- 이 오브젝트를 이용하여 데이터 참조 위치를 결정합니다.
			- return 
				- 오브젝트 데이터가 저장될 경로를 리턴합니다. (파라미터로 전달된 데이터 기준)
		- grid {function}
			- 새로운 플랫폼 정의 시 그리드 데이터의 참조 위치를 결정합니다.
			- parameter
				- elem {HTML element}
					- 데이터가 바인드 될 HTML 엘리먼트
				- data {object}
					- 서버로부터 받은 응답 오브젝트
					- 이 오브젝트를 이용하여 데이터 참조 위치를 결정합니다.
			- return 
				- 그리드 오브젝트에 해당 정보가 저장될 경로를 리턴합니다. (파라미터로 전달된 데이터 기준)
		- platform {string}
			- request API는 다양한 플랫폼의 인터페이스 포맷을 지원합니다.
			- platform 옵션은 현재 어떤 플랫폼을 사용하는 지를 명시합니다.
		- url {string | function}
			- 서버의 url을 지정합니다. 
			- function을 사용하여 동적인 url 지정이 가능합니다.
		- method {string | function} 
			- "GET" or "POST" 등 요청 타입을 지정합니다.
			- function을 사용하여 동적인 url 지정이 가능합니다.
		- async {boolean}
			- 동기/비동기 통신을 설정합니다.
			- 디폴트 값은 true(비동기 통신)
		- before {function}
			- 서버에 요청을 보내기 전 "통신 전처리"를 수행하기 위한 함수를 정의합니다.
		- after {function}
			- 서버에서 응답을 받은 이후, 호출되는 "응답 후처리"를 정의합니다.
		- error {function}
			- 네트워크 장애 또는 타임아웃 등의 Exception으로 인하여 서버로부터 응답이 전달되지 않은 경우 호출되는 콜백함수를 지정합니다.
		- fail {function}
			- 요청이 실패한 경우에는 콜백함수가 호출됩니다.
			- success / fail 의 판단은 설정의 after 함수에서 this.isSuccess 값을 통해 지정합니다.


