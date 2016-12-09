
# Setup

## Basic

Alopex UI 컴포넌트의 옵션 중 공통적으로 적용할 옵션들을 미리 셋업할 수 있습니다.

## Alopex UI 공통 설정

일반적인 Alopex UI 프레임워크의 설정을 지정할 수 있습니다.
이에 해당하는 사항은 다음과 같습니다.

- 클래스 로딩 방식 사용 유무
	- classLoader : true or false (디폴트는 true)
- 클래스 로딩 방식 사용 시, 컴퍼넌트를 정의하는 클래스명
	- 디폴트 컴퍼넌트 클래스명 : 각 컴퍼넌트의 이름과 동일하며, 클래스명 첫 글자가 대문자로 시작합니다.
- 컴퍼넌트 셀렉터
	- 특정 셀렉터를 지정하여 컴퍼넌트화 합니다.
	- 예: '.Paging>.link' 
	- 페이징 컴퍼넌트 하위에 link 태그를 버튼 컴퍼넌트로 변환


### 클래스 로딩 기능 사용 설정

2.3 버전에서는 클래스 속성으로 컴퍼넌트를 인식합니다. 해당 기능을 사용하지 않지 않을 경우, 아래와 같이 `$a.setup` 함수를 통해 설정합니다.

<div class="eg">
```
$a.setup({
	// 클래스 로딩 방식 사용하지 않습니다. 2.2 버젼의 data-type 방식으로 사용.
	classLoader: false 
});
```
</div>

### Alopex UI 이벤트 클래스명 변경

Alopex UI 프레임워크에서 동적으로 HTML 엘리먼트에 추가되는 클래스명의 이름을 지정합니다. 

<div class="eg">
```
$a.setup({
    selectedClassName: 'Selected',
    disabledClassName: 'Disabled',
});
```
</div>

### 컴퍼넌트 디폴트 클래스명 변경

3rd-party 라이브러리 사용, 스타일 클래스 충돌 등의 원인으로 Alopex UI 프레임워크에서 디폴트로 정의된 클래스명을 변경하고자 하는 경우, 다음과 같이 컴퍼넌트의 클래스명을 변경할 수 있습니다.

<div class="eg">
```
$a.setup({
	defaultComponentClass: {
    	button: 'btn', 
        carousel: 'crsel',
        togglebutton: 'toggle'
    }
});
```
</div>

defaultComponentClass 키의 값에 변경하고자 하는 컴퍼넌트와 해당 컴퍼넌트를 의미하는 클래스를 지정합니다.


### 셀렉터를 이용한 컴펀넌트 변환

클래스로 컴퍼넌트화 하는 방식 외에 CSS 셀렉터를 사용하여 특정 조건의 HTML엘리먼트를 Alopex UI 컴퍼넌트로 사용할 수 있습니다.

<div class="eg">
```
$a.setup({
	componentSelector: {
    	'.Paging>.link' : 'button'
    }
})
```
</div>

위의 예제는 `Paging` 클래스를 가지고 있는 엘리먼트의 하위에 `link` 클래스를 가지고 있는 엘리먼트가 있는 경우, 이 엘리먼트를 버튼으로 변환하라는 의미입니다.


## 컴퍼넌트 설정

Alopex UI에서 디폴트로 제공하는 속성과 다른 속성값을 디폴트로 사용하고자 하는 경우, 컴퍼넌트에 대한 기본 설정값을 지정합니다.
예로, Alopex UI 프레임워크에서 제공하는 `dialog` 컴퍼넌트는 모달뷰를 디폴트 속성으로 가지고 있습니다. 그러나 프로젝트 진행 시 모든 화면에서 모달뷰를 사용하지 않을 경우, 공통 소스에 아래와 같이 컴퍼넌트 설정값을 변경합니다.

<div class="eg">
```
$a.setup('dialog', {
    modal: false
});
```
</div>

## Functions

### $a.setup(options)

Alopex UI 공통 속성을 지정합니다.

- parameter
	- options {JSON}


### $a.setup(componentName, options)

각 컴포넌트에서 사용되는 옵션들 중 공통적으로 적용해서 사용하고자하는 옵션이 있을때 
`$a.setup` 함수를 사용합니다.

- parameter
	- componentName {string}
		- Alopex UI 컴포넌트명
	- options {JSON}
		- 해당 컴포넌트의 옵션

`$a.setup` 함수를 이용하여 datepicker와 dialog, tree의 공통 옵션을 셋업 하는 예제입니다.

<div class="eg">
```
// datepicker 컴포넌트 셋업
$a.setup('datepicker', {
    selectyear: true,
    selecmonth: true,
    showothermonth: true,
    showbottom: true,
    locale: 'en'
});

// tree 컴포넌트 셋업
$a.setup('tree', {
	    idKey : 'code',
	    textKey :'title',
	});

// dialog 컴포넌트 셋업
$a.setup('dialog', {
    modal: true,
    movable: true
});
```
</div>

위 컴포넌트에 적용할 수 있는 옵션들은 [datepicker option](../dev-component/component.html?target=datepicker#Functions_showDatePickerfunctioncallbackJSONoption), 
[dialog option](../dev-component/component.html?target=dialog#Functions_openoption),
[tree option](../dev-component/component.html?target=tree#Functions)
 을 참고하여 주십시오.

컴포넌트 셋업을 하면 모든 페이지의 컴포넌트에 해당 옵션이 적용되게 됩니다.
>위에서 선언한 컴포넌트 셋업 옵션은 개별 페이지에서 설정한 옵션 값에 의해서 overwrite 될 수 있습니다. 

>즉, 단위 페이지에서 선언한 옵션 값이 공통 옵션 값보다 우선합니다.

