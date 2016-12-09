# Multiselect

## Basic
멀티셀렉트(Multiselect) 컴포넌트는 셀렉트 박스의 다수의 option을 체크박스로 선택할 수 있는 컴포넌트입니다.

<select class="Multiselect">
    <option value="korea">Korea</option>
    <option value="usa">USA</option>
    <option value="japan">Japan</option>
    <option value="china">China</option>
</select>

```
<select class="Multiselect">
    <option value="korea">Korea</option>
    <option value="usa">USA</option>
    <option value="japan">Japan</option>
    <option value="china">China</option>
</select>
```

멀티셀렉트 컴포넌트는 [jQuery UI Multiselect Widget](https://github.com/ehynds/jquery-ui-multiselect-widget)를 wrapping한 구조로 되어 있습니다. 그렇기 때문에 기존 컴포넌트와는 별개로 아래 3가지 파일 링크가 필요합니다.

	- alopex-ext.js
		jquery-ui.js, jquery-ui-multiselect.js, jquery-ui-multiselect-filter.js가 merge된 파일
	- alopex-ext-setup.js
		Multiselect에 대한 widget 확장 셋업
	- alopex-ext.css
		Multiselect에 대한 스타일링

이 문서는 [jQuery UI Multiselect Widget](https://github.com/ehynds/jquery-ui-multiselect-widget)의 일부 기능을 설명하고 있습니다. 기타 기능은 [jQuery UI Multiselect Widget](https://github.com/ehynds/jquery-ui-multiselect-widget)에서 확인 바랍니다.


### Multiselect - DataBinding 연계

Multiselect Component에 DataBinding 연계하는 샘플입니다.  
"options" 키를 이용해 option 엘리먼트를 생성하고, "selectedOptions" 키를 이용하여 선택할 option 엘리먼트를 지정합니다.  
	
<div class="eg">
<div class="egview">
	<select id="multi" class="Multiselect" data-bind="options: selectOptions1, selectedOptions: selected1">
	</select>
	<button class="Button" id="set">setData</button>
	<button class="Button" id="get">getData</button>
</div>
```
<label>
	<select id="multi" class="Multiselect"
		data-bind="options: selectOptions1, selectedOptions: selected1">
	</select>
	<button class="Button" id="set">setData</button>
	<button class="Button" id="get">getData</button>
```
```
$("#set").click(function(){
	$('#multi').setData({
		selectOptions1: [{value: 'opt1', text: '첫번째 옵션'}, {value: 'opt2', text: '두번째 옵션'}],
		selected1: 'opt2'
	});
});
    		
$("#get").click(function(){
	alert(JSON.stringify($('#multi').getData()));
});
```
</div>

<script>
$("#set").click(function(){
	$('#multi').setData({
		selectOptions1: [{value: 'opt1', text: '첫번째 옵션'}, {value: 'opt2', text: '두번째 옵션'}],
		selected1: 'opt2'
	});
});
    		
$("#get").click(function(){
	alert(JSON.stringify($('#multi').getData()));
});
</script>

```
$('#my-select').multiselect({
		beforeopen: function(){
			//멀티셀렉트 표시 직전 이벤트
		},
		open: function(){
			//멀티셀렉트 표시 시 이벤트
		},
		beforeclose: function(){
			//닫기 직전 이벤트
		},
		close: function(){
			//닫기 시 이벤트
		},
		checkAll: function(){
			//전체선택 시 이벤트
		},
		uncheckAll: function(){
			//전체선택해제 시 이벤트
		},
		click: function(){
			//체크박스 선택 시 이벤트
		}
	});
```


## Attribute

### class {string}

- "Multiselect"  
	- 해당 엘리먼트가 Multiselect 컴포넌트이라는 것을 지정합니다.

## Functions

### .multiselect(callback)
멀티셀렉트 내 시점 별로 이벤트 핸들러를 등록합니다.

- "parameter"
	- callback {obejct}
		- 시점별 콜백 함수 오브젝트

```
$('#my-select').multiselect({
		beforeopen: function(){
			//멀티셀렉트 표시 직전 이벤트
		},
		open: function(){
			//멀티셀렉트 표시 시 이벤트
		},
		beforeclose: function(){
			//닫기 직전 이벤트
		},
		close: function(){
			//닫기 시 이벤트
		},
		checkAll: function(){
			//전체선택 시 이벤트
		},
		uncheckAll: function(){
			//전체선택해제 시 이벤트
		},
		click: function(){
			//체크박스 선택 시 이벤트
		}
	});
```


## Setup
setup 자바스크립트에서 멀티셀렉트의 기본 속성을 공통으로 설정합니다. 

```
$a.setup('multiSelect', {
	multiple : true,
	noneSelectedText : '선택하세요',
	header : true,
	minWidth : 200,
	selectedList : 2,
	checkAllText : '전체선택',
	uncheckAllText : '전체해제',
	selectedText : '#개 선택됨',
	filter : true,
	label : '필터',
	placeholder : '검색어를 입력하세요',
	checkedheader : true,
	menuWidth : 'auto',
	htmlBind: true
});
```

- header {boolean}
	- true
		- 전체선택/헤제, 닫기 아이콘 등 포함한 헤더 표시 여부
- height {int}
	- 175
		- 체크박스 컨테이너의 px 높이
- minWidth {int}
	- 180
		- 위젯의 최소 폭. 'auto' 로 세팅하면 자동 너비
- checkAllText {string}
	- "전체선택"
		- 전체 선택의 텍스트
- uncheckAllText {string}
	- "전체해제"
		- 선택 해제의 텍스트
- noneSelectedText {string}
	- "선택하세요"
		- 아무것도 선택되지 않았을 때의 텍스트
- selectedText {string}
	- "#개 선택됨"
		- 선택된 값들의 표시 방법
- selectedList {int}
	- 2
		- 해당 개수까지만 선택된 값에 나열하여 보여주고, 그 이상의 개수는 selectedText로 표현
- show {array}
	- "empty"
		- Open시 효과 지정. ex: ['slide', 500]
- hide {array}
	- "empty"
		- Close시 효과 지정. ex: ['explode', 500]
- autoOpen {boolean}
	- false
		- 초기화 시 자동 open 옵션
- multiple {boolean}
	- true
		- false일 경우 checkbox 대신 radio로 표시됨
- filter {boolean}
	- true
		- 텍스트 박스 필터링 여부
- label {string}
	- "필터"
		- 필터링 텍스트 앞쪽에 붙는 레이블
- placeholder {string}
	- "검색어를 입력하세요"
		- 필터링 텍스트 박스의 기본 표시 문구
- checkedheader {boolean}
	- true  
		- header에 checkAll 영역 노출여부
- menuWidth {number|'auto'} 
	- number
		- 리스트 영역의 width 값 설정
	- 'auto'
		- 'auto'의 경우는 내용에 맞게 width 늘어남
- htmlBind {boolean}
	- true
		- default
	- false
		- option의 & 등의 표시가 깨지는 경우에 false를 사용. &lt;b&gt;text&lt;/b&gt; 등과 같은 html append는 동작하지 않음.