# Ajax Request & 데이터 바인딩 in IDE

## Basic

Alopex IDE 도구를 사용하는 경우, Ajax 통신의 함수 및 데이터 바인딩 방식이 이전의 개발 방법과 다르게 처리됩니다.

이 문서는 IDE를 통해 자동 생성되는 HTML 문서 내 마크업 속성 및 Javascript 소스 형태 및 함수에 대해 설명 합니다.


## 데이터 바인딩 

Alopex IDE 도구를 사용하는 경우, 통신을 통해 가져오는 바인딩을 적용하기 위해 `바인드매니저`를 활용합니다.

`바인드 매니저`는 에디터 도구 오른쪽에 위치한 탭(Property, Object, Service) 중 `Service` 탭을 선택하고 해당 탭 컨텐트에 `Bind Manager`를 클릭합니다.

`바인드 매니저` 다이얼로그에서는 화면에 표시되는 데이터의 그룹을 생성합니다.
데이터의 그룹 별로 해당 그룹의 데이터 구조를 구성하고, 구조 내 각각의 데이터와 화면의 엘리먼트를 매핑합니다.

Alopex IDE를 통해 데이터 바인딩을 정의하면 데이터 바인드 정보가 HTML 엘리먼트의 data-bind 속성에 정의됩니다.

```
<input type="text" data-bind="<databind control>:<data key>@<databind group>" />
```

## Ajax 통신

Alopex IDE 도구에서 서비스 리퀘스트를 정의하는 경우, 두개의 javascript 소스가 생성됩니다.

- 공통 Javascript 소스
	- 여러 화면 소스에서 참조하며, 통신 시 디폴트로 사용되는 값을 정의합니다.
	- 예로, 모든 서비스 리퀘스트의 url 주소가 동일하거나 특정 패턴을 가지고 있는 경우, 이를 공통 소스에 정의합니다.
	- 모든 통신에서 특정 전처리 또는 후처리 프로세스가 필요한 경우, 이를 공통 소스에 정의합니다.
- 페이지 Javascript 소스
	- Alopex IDE 도구에서 HTML 파일을 생성하는 경우, 비즈니스 로직을 작성하기 위한 파일이 같이 생성됩니다.
	- 이 소스에 각 리퀘스트의 정보를 저장합니다.

### 통신 공통 정의

Alopex IDE 도구 `Service`탭에서 `Setup` 버튼을 클릭하여 공통으로 사용되는 디폴트 값을 정의합니다.

```
var common = $a.page(function() {

    this.<전처리 함수 이름> = function(req, next) {
        //console.log('before', arguments);
        next();
    };
    $a.request.setup({
        platform: "",
        url: function(urlkey, req) {
            return 'http://localhost:9200/service?' + urlkey;
        },
        method: "POST",
        async: true,
        timeout: 1000,
        parameter: {
            transaction: {
                id: ""
            },
            dataSet: {
                fields: {},
                recordSets: {}
            }
        },
        response: {
            transaction: {
                id: ""
            },
            dataSet: {
                fields: {},
                recordSets: {}
            }
        },
        before: "<전처리 커스텀 함수 이름>",
        success: "",
        error: "",
        fail: "",
        headers: {
            "Content-type": "application/json;"
        }
    });
});
```

### 이벤트 콜백함수

Alopex에서 제공하는 리퀘스트 함수는 아래와 같은 시점에 콜백함수가 실행되도록 지원합니다

- before
	- 통신 송신하기 전 호출되는 콜백함수입니다.
	- 함수 형태
		- function (request, next)
			- parameter
				- request {object}
					- 통신 리퀘스트의 설정을 가지고 있는 오브젝트입니다.
					- 해당 오브젝트의 값을 변경해서 설정을 변경할 수 있습니다.
				- next {function}
					- 해당 함수를 명시적으로 호출해야 다음 단계로 진행이 되며 통신의 요청이 이루어 집니다.
- after 
	- 요청된 통신에 대한 응답이 수신된 직 후 호출
	- 통신의 성공/실패 여부 판단
- success
	- 서버로부터 응답이 정상적으로 수신된 경우
- error
	- 서버가 응답되지 않는 경우
	- 네트워크 손실, 서버 다운 등의 경우
- fail
	- 서버로부터 응답이 수신되었으나, 정상 응답이 아닌 경우
	- fail 상태의 판단은 `after` 시점에 판단합니다.


### 통신 오브젝트

#### Request

`$a.request` 함수 호출 시 참조되는 정보를 가지고 있는 오브젝트입니다. 

`$a.request.setup` 함수를 통해 지정된 설정값이 저장됩니다.

- Request {object}
	- id {string}
		- HTML 통신 서비스 id
	- data {object}
		- 요청 파라미터
	- requestHeaders {object}
		- 요청 전문 헤더

#### Response

- Response {object}
	- id {string}
		- HTML 통신 서비스 id
	- data {object}
		- 요청 파라미터
	- requestHeaders {object}
		- 요청 전문 헤더


### 함수

#### $a.request.setup (setting)

`$a.request` 함수와 같이 사용할 수 있는 통신 설정의 디폴트 값을 정의합니다.

- paramter
	- setting
		- url {function}
			- 서버의 url을 정의합니다. 함수의 리턴값이 URL 값으로 사용됩니다.
			- 함수 타입으로 지정하여 상황에 맞게 동적으로 URL값을 지정할 수 있습니다.
			- 인자로 주어지는 urlkey와 request 오브젝트를 이용해 서비스 리퀘스트의 URL값을 지정합니다.
			```
			url: function(urlkey, req) {
            	return 'http://10.102.25.1/'+urlkey;
            }
			```
        - method {string}
			- HTTP 통신의 method 타입을 지정합니다.
			- 'GET', 'POST' 등
		- async {boolean}
			- 통신이 동기/비동기로 이루어 질지를 결정하는 설정입니다.
		- timeout {number}
			- 통신 타임아웃 threshold를 지정합니다.
		- parameter {object}
			- 통신 시 `요청` 데이터가 특정 포맷으로 구성된 경우, 해당 포맷을 지정합니다.
			- 플랫폼에 따라 통신 데이터 포맷이 존재하는 경우 사용됩니다.
		- response {object}
			- `응답` 데이터의 포맷을 지정합니다.
			- parameter는 요청에 대한 기본 포맷, response는 응답에 대한 기본 포맷을 지정합니다.
		- headers {object}
			- HTTP 통신의 헤더를 지정합니다.
			```
            headers: {
            	"Content-type" : "application/json;charset=UTF-8"
            }
            ```
		- before {string}
			- `before` 시점에 호출되는 콜백함수의 이름을 지정합니다.
			- 콜백함수는 `$a.page` 내 public 함수로 정의합니다.
			- 콜백 함수 parameter
				- req {object}
					- 설정 정보를 저장하고 있는 request 오브젝트. 
				- next {function}
					- 명시적으로 다음 단계로 진행하기 위해 호출.
			- 샘플 소스
			```
            $a.page(function() {
            	this.beforeCallback = function(req, next) {
                    req.url = '<new url>';
                    if(validate()) {
                        next(); // 유효한 경우 진행 처리.
                    }
                };
                
                $a.request.setup({
                	...
                	before: 'beforeCallback'
                    ...
                });
            })
            ```
		- after {string}
			- `after` 시점에 호출되는 콜백함수의 이름을 지정합니다.
			- 콜백함수는 `$a.page` 내 public 함수로 정의합니다.
			- 콜백 함수 parameter
				- req {object}
					- 요청 정보를 가지고 있는 request 오브젝트.
				- res {object}
					- 응답 정보를 가지고 있는 response 오브젝트.
				- next {function}
					- 다음 단계로 진행하기 위해 호출.
		- platform
			- `$a.request` 함수를 동시에 적용하고자 하는 경우, 플랫폼을 지정합니다.


#### $a.request.register (serviceList)

도구에서 정의한 각 리퀘스트의 설정을 등록합니다.

- parameter
	- serviceList {object}
		- 화면 내 서비스 리퀘스트 별 설정 정보

```
        $a.request.register({
        	service1: {
            	urlkey: '', // service key와 동일한 값으로 설정됨. 변경 가능.
                parameter: { // 요청 파라미터에 정적 데이터
                	'dataSet.transaction.id': 'users' // dot(.) notation으로 정의된 데이터 경로
                },
                parabind: { // 화면에서 읽어온 값을 요청 파라미터에 포함.
                	'dataSet.fields': '<databind set id>'
                },
                databind: {
                	'dataSet.recordSets.users.nc_list': '<databind set id>'
                },
                before: ['pageBeforeCallback1', 'pageBeforeCallback2'],
                after: ['pageAfterCallback'],
                success: 'pageSuccessCallback',
                error: 'pageErrorCallback',
                fail: 'pageFailCallback'
            }
        })
        ```

#### $a.request.sendRegistered (serviceId)

`$a.request.register` 함수로 정의한 리퀘스트를 보냅니다.
Alopex IDE에서 제공되는 서비스 리퀘스트를 호출하는 형태는 이벤트 발생 & 타 서비스 리퀘스트가 성공적으로 이루어 진 경우 두가지 케이스 입니다.
케이스 별로 다른 서비스를 호출해 줘야 되는 경우에는 Alopex IDE 도구에서 서비스 리퀘스트 트리거를 지정하지 않고, `$a.request.sendRequest`함수를 호출하여 통신을 트리거합니다.

- parameter
	- serviceId {string}
		- 호출하려는 서비스 리퀘스트 아이디

```
$a.request.register({
	service1: { ... },
    service2: { ... }
});

$a.request.sendRegistered('service1');
```
