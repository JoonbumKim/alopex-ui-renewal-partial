# DataBinding

## Basic

Alopex UI 데이터바인드는 data-bind 속성을 사용해서 $a.request 통신으로 받은 데이터를 사용자 화면에 바인딩해주는 기능입니다. 사용자 뷰와 데이터가 연결되어 있기 때문에 화면의 데이터를 가져올 때나 다른 데이터를 넣는것도 쉽고 빠르게 수행할 수 있습니다. 화면의 선택 영역에 데이터를 입력(set)하는 함수와 화면의 HTML element 영역 내 데이터를 파싱하여 리턴(get)하는 함수를 제공합니다.  

### API 사용
데이터바인드는 자바스크립트에서 .setData 함수를 호출하여 object를 화면에 입력합니다. Object 내의 데이터가 화면 어느 영역에 어떤 방식으로 매핑되는지 설정은 마크업 내에 data-bind 속성으로 정의합니다.


<div class="eg">
<div class="egview">
<div id="bindarea">
    <p>
    	<input data-bind="value: id" id="databind_input1" class="Textinput">
    	<input data-bind="value: password" type="password" id="databind_input2" class="Textinput Margin-left-10">
	</p>
    <label>
        <input data-bind="checked:gender"  value="male" name="gender" id="databind_input3" class="Radio" type="radio">
        male
    </label>
    <label>
        <input data-bind="checked:gender" value="female" name="gender" id="databind_input4" class="Radio" type="radio">
        female
    </label>
</div>
</div>
```
<div id="bindarea">
    <p>
    	<input data-bind="value: id" id="databind_input1" class="Textinput">
    	<input data-bind="value: password" type="password" id="databind_input2" class="Textinput Margin-left-10">
	</p>
    <label>
        <input data-bind="checked:gender"  value="male" name="gender" id="databind_input3" class="Radio" type="radio">
        male
    </label>
    <label>
        <input data-bind="checked:gender" value="female" name="gender" id="databind_input4" class="Radio" type="radio">
        female
    </label>
</div>
```
```
var data = {
    id: 'ashley',
    password: '*****',
    gender: 'male'
};
$('#bindarea').setData(data);
```
</div>

<script>
var data = {
    id: 'ashley',
    password: '*****',
    gender: 'male'
};
$('#bindarea').setData(data);
</script>

.setData 함수를 호출하여 데이터를 화면에 입력하고, .getData 함수를 호출하여 화면에서 데이터를 읽어옵니다.


<div class="eg">
<div class="egview">
<div id="basic1">
	<input id="checkbox1" type="checkbox" class="Checkbox" name="basic" value="check1" data-bind="checked: mycheckbox"/>
	<label for="checkbox1">Check1</label>
	<input id="checkbox2" type="checkbox" class="Checkbox" name="basic" value="check2" data-bind="checked: mycheckbox"/>
	<label for="checkbox2">Check2</label>
	<input id="checkbox3" type="checkbox" class="Checkbox" name="basic" value="check3" data-bind="checked: mycheckbox"/>
	<label for="checkbox3">Check3</label>

<button id="btn_set" class="Button">SET Data</button>
<button id="btn_get" class="Button">GET Data</button>
</div></div>
```
<div id="basic1">
	<input id="checkbox1" type="checkbox" class="Checkbox" name="basic" value="check1" data-bind="checked: mycheckbox"/>
	<label for="checkbox1">Check1</label>
	<input id="checkbox2" type="checkbox" class="Checkbox" name="basic" value="check2" data-bind="checked: mycheckbox"/>
	<label for="checkbox2">Check2</label>
	<input id="checkbox3" type="checkbox" class="Checkbox" name="basic" value="check3" data-bind="checked: mycheckbox"/>
	<label for="checkbox3">Check3</label>
</div>
<button id="btn_set" class="Button">SET Data</button>
<button id="btn_get" class="Button">GET Data</button>
```
```
$('#btn_set').on('click', function() {
	$('#basic1').setData({mycheckbox: ['check1', 'check2']});
});

$('#btn_get').on('click', function() {
	alert(JSON.stringify($('#basic1').getData()));
});
```
</div>

<script>
$('#btn_set').on('click', function() {
	$('#basic1').setData({mycheckbox: ['check1', 'check2']});
});

$('#btn_get').on('click', function() {
	alert(JSON.stringify($('#basic1').getData()));
});
</script>

### 통신연계

데이터바인드는 Alopex UI 통신 API인 $a.request와 연계해서 사용할 수 있습니다. 두개의 API를 연계해서 사용할 경우 간단한 자바스크립트 사용만으로 화면의 데이터를 바인딩, 데이터 가져오기 작업을 수행할 수 있습니다.  

#### 파라미터 자동 생성

`$a.request`함수의 `data`옵션을 object로 지정하지 않고 마크업 셀렉터(또는 CSS 셀렉터라고도 불리며 HTML을 선택하는 문법)로 지정하면, 해당 영역에서 데이터를 파싱하여 통신 파라미터에 추가합니다.

```
data: '#grid',
data: ['#form', '#grid'], // 한 개이상의 영역의 경우 배열의 형태로 셀렉터 정의.
```

파라미터 자동 생성 기능은 내부적으로 `Alopex UI 데이터바인드`를 사용하기 때문에, HTML 엘리먼트에 `data-bind` 속성이 정의되어야 합니다.

화면에서 읽어온 데이터는 사전에 지정된 위치에 추가됩니다.


#### 응답 데이터 자동 바인드

`$a.request` 함수의 `success` 옵션을 다음과 같이 특정 영역의 셀렉터로 지정하여 선택된 영역에 데이터를 바인드합니다.

[통신 파라미터 자동 생성](javascript.html?target=request#Basic_파라미터자동생성)과 같이 데이터바인드하고자 하는 영역의 셀렉터를 입력합니다.

```
success: '#grid', // 한 영역에 데이터 바인드하는 경우
success: ['#grid', '#form'], // 한 개 이상의 영역에 데이터 바인드하는 경우
success: ['#grid', function(res) {
	// 자동 바인딩 하고, 콜백함수 호출.
}]
```


## Attributes

### data-bind 

데이터를 어떤 방식으로 화면에 추가할 지 정의합니다. 

`data-bind` 속성값은 다음과 같은 형태를 가집니다.

>data-bind="control : data_key"

콜론(:) 캐릭터를 기준으로 왼쪽에 어떤 컨트롤을 사용할 지 지정하고, 오른쪽에 HTML 엘리먼트에 추가될 데이터의 키를 지정합니다.

[attr 컨트롤](#Attributes_databind_control) 또는 [css 컨트롤](#Attributes_databind_control)은 여러 데이터가 한 컨트롤에 추가될 수 있습니다. 이 경우에는 JSON 형태로 속성값을 지정합니다.

>data-bind="control: {option1: data_key, option2: data_key2}"

두 개 이상의 컨트롤이 사용될 경우, 콤마(,) 문자로 컨트롤을 구분합니다.

>data-bind="control1: key1, control2: key2, control3: {option1: key3}"  



#### control

컨트롤은 데이터를 엘리먼트의 어느 속성에 연결할지 정의합니다. 

- html
	- 데이터가 HTML element의 innerHTML에 추가됩니다.

<div class="eg">
<div class="egview">	
<div id="sample1">
	<div data-bind="html : data"></div>
</div></div>
```
<div id="sample1">
	<div data-bind="html : data"></div>
</div>
```
```
$('#sample1').setData({data: '<a href="http://ui.alopex.io" id="html1">Alopex UI</a>'});
```
</div>

<script>
$('#sample1').setData({data: '<a href="http://ui.alopex.io" id="html1">Alopex UI</a>'});
</script>	


- text
	- 데이터를 텍스트로 나타냅니다. HTML element의 innerText 속성에 추가되며, HTML 특수문자가 escape 처리됩니다.
	
<div class="eg">
<div class="egview">	
<div id="sample2">
	<div data-bind="text : data" id="text1"></div>
</div></div>
```
<div id="sample2">
	<div data-bind="text : data" id="text1"></div>
</div>
```
```
$('#sample2').setData({data: '<a href="http://ui.alopex.io">Alopex UI</a>'});
```
</div>

<script>
$('#sample2').setData({data: '<a href="http://ui.alopex.io">Alopex UI</a>'});
</script>

- value
	- `<input type="text">` 또는 `<textarea>` element에 사용되며, 텍스트 입력 값에 데이터를 바인드될 때 사용합니다.

<div class="eg">
<div class="egview">	
<div id="sample3">
	<input class="Textinput" data-bind="value : data" id="value11">
</div></div>
```
<div id="sample3">
	<input class="Textinput" data-bind="value : data" id="value11">
</div>
```
```
$('#sample3').setData({data: 'data'});
```
</div>

<script>
$('#sample3').setData({data: 'data'});
</script>

 - checked
	- 체크박스 또는 라디오 버튼에 사용합니다.
		- 체크박스
			- 체크박스의 경우, 사용되는 패턴이 두 가지가 존재함으로 주의해서 사용합니다.
				- [1] name 속성이 있는 경우 
					- [1-1] name 값이 서로 같은경우 
						- `name`속성에 같은 값을 지정하여 여러 체크박스를 그룹핑을 합니다.
						- 데이터는 배열 타입으로 지정되고, 선택된 체크박스의 `value` 속성값을 가지고 있습니다.
					- [1-2] name 값이 서로다른 경우 
						- `name`속성에 같은 값이 달라 그룹핑되지 않은 상태.
						- 각각의 value값을 가짐. 
				- [2] name 속성이 없는 경우
					- 기본 데이터 값은 true/false로 Boolean 타입으로 지정됩니다.
					- 이 외에 다음 값들을 기본값으로 지원합니다. 이 경우에는 `value` 속성을 지정하여, 어떤 형태의 값을 사용할 지 지정합니다.
						- 'y'/'n', 'yes'/'no', 'Y'/'N', 'YES'/'NO', '0'/'1', 'true'/'false', 'TRUE'/'FALSE'
		- 라디오
			- 라디오의 경우, 여러 옵션 중 하나의 옵션만 선택하고 선택된 값의 `value`값이 데이터로 사용됩니다.
			- 여러 input을 그룹핑하기 위해 `name`속성을 사용합니다.


			
<div class="eg">
<div class="egview">
checked 컨트롤 예제 [1-1] name 속성이 있고 name 값이 서로 같아 그룹핑된 상태<br/><br/>
name이 같은 요소들 중 체크된 요소들의 value를 배열로 리턴합니다.
<hr>
<div id="sample4-1">
	<label> <input class="Checkbox" name="chk0" type="checkbox" value="value1" data-bind="checked:dbchk0" id="check11"> text1 </label> 
	<label> <input class="Checkbox" name="chk0" type="checkbox" value="value2" data-bind="checked:dbchk0" id="check12"> text2 </label> 
	<label> <input class="Checkbox" name="chk0" type="checkbox" value="value3" data-bind="checked:dbchk0" id="check13"> text3 </label>
</div><button id="get4-1" class="Button">GET Data</button>
</div>
```
<div id="sample4-1">
	<label> <input class="Checkbox" name="chk0" type="checkbox" value="value1" data-bind="checked:dbchk0" id="check11"> text1 </label> 
	<label> <input class="Checkbox" name="chk0" type="checkbox" value="value2" data-bind="checked:dbchk0" id="check12"> text2 </label> 
	<label> <input class="Checkbox" name="chk0" type="checkbox" value="value3" data-bind="checked:dbchk0" id="check13"> text3 </label>
</div>
<button id="get4-1" class="Button">GET Data</button>
```
```
$('#sample4-1').setData({dbchk0: ['value1', 'value2']});

$('#get4-1').on('click', function() {
	alert(JSON.stringify($('#sample4-1').getData()));
});

/* 
JSON.stringify($("#sample4-1").getData()); 

"{"dbchk0":[]}" // not checked 
"{"dbchk0":["value1"]}" // text1 checked 
"{"dbchk0":["value1","value2"]}" // text1, text2 checked 
*/ 

```
</div>

<script>
$('#sample4-1').setData({dbchk0: ['value1', 'value2']});

$('#get4-1').on('click', function() {
	alert(JSON.stringify($('#sample4-1').getData()));
});
</script>


<div class="eg">
<div class="egview">
checked 컨트롤 예제 [1-2] name 속성은 있으나 name 값이 서로 달라 그룹핑되지 않은 상태<br/><br/>
name이 같은 요소들 중 체크된 요소들의 value를 배열로 리턴하는데,<br/>
name이 같은 요소가 없기 때문에 각 name 별 체크된 요소들의 value를 배열로 모두 리턴합니다.
<hr>
<div id="sample4-2">
	<label> <input class="Checkbox" name="chk1" type="checkbox" value="value1" data-bind="checked:dbchk1" id="check21"> text1 </label> 
	<label> <input class="Checkbox" name="chk2" type="checkbox" value="value2" data-bind="checked:dbchk2" id="check22"> text2 </label> 
	<label> <input class="Checkbox" name="chk3" type="checkbox" value="value3" data-bind="checked:dbchk3" id="check23"> text3 </label>
</div><button id="get4-2" class="Button">GET Data</button>
</div>
```
<div id="sample4-2">
	<label> <input class="Checkbox" name="chk1" type="checkbox" value="value1" data-bind="checked:dbchk1" id="check21"> text1 </label> 
	<label> <input class="Checkbox" name="chk2" type="checkbox" value="value2" data-bind="checked:dbchk2" id="check22"> text2 </label> 
	<label> <input class="Checkbox" name="chk3" type="checkbox" value="value3" data-bind="checked:dbchk3" id="check23"> text3 </label>
</div>
<button id="get4-2" class="Button">GET Data</button>
```
```
$('#sample4-2').setData({'dbchk1': ['value1'],'dbchk2': ['value2']});

$('#get4-2').on('click', function() {
	alert(JSON.stringify($('#sample4-2').getData()));
});

/* 
JSON.stringify($('#sample4-2').getData());
"{"dbchk1":[],"dbchk2":[],"dbchk3":[]}" // not checked 
"{"dbchk1":["value1"],"dbchk2":[],"dbchk3":[]}" // text1 checked 
"{"dbchk1":["value1"],"dbchk2":["value2"],"dbchk3":[]}" // text1, text2 checked 
*/
```
</div>

<script>
$('#sample4-2').setData({'dbchk1': ['value1'],'dbchk2': ['value2']});

$('#get4-2').on('click', function() {
	alert(JSON.stringify($('#sample4-2').getData()));
});
</script>  




<div class="eg">
<div class="egview">
checked 컨트롤 예제 [2-1] name 속성이 없는 경우.<br/><br/>
설정한 value에 따라 getData()로 리턴되는 값이 달라집니다.<br/>
예를들어,<br/>
value="0"을 설정하면, 체크된 경우 "1"을 리턴하고, 체크 해제된 경우 "0"을 리턴 합니다.<br/>
value="TRUE"을 설정하면, 체크된 경우 "TRUE"를 리턴하고, 체크 해제된 경우 "FALSE"를 리턴 합니다.<br/><br/>

[value 설정 및 리턴 규칙]<br/><br/>
'y': {'true': 'y', 'false': 'n'}<br/>
'n': {'true': 'y', 'false': 'n'}<br/>
'yes': {'true': 'yes', 'false': 'no'}<br/>
'no': {'true': 'yes', 'false': 'no'}<br/>
'Y': {'true': 'Y', 'false': 'N'}<br/>
'N': {'true': 'Y', 'false': 'N'}<br/>
'YES': {'true': 'YES', 'false': 'NO'}<br/>
'NO': {'true': 'YES', 'false': 'NO'}<br/>
'0': {'true': '1', 'false': '0'}<br/>
'1': {'true': '1', 'false': '0'}<br/>
'true': {'true': true, 'false': false}<br/>
'false': {'true': true, 'false': false}<br/>
'TRUE': {'true': 'TRUE', 'false': 'FALSE'}<br/>
'FALSE': {'true': 'TRUE', 'false': 'FALSE'}<br/>
'True': {'true': 'True', 'false': 'False'}<br/>
'False': {'true': 'True', 'false': 'False'}<br/>
'임의의값': {'true': 'true', 'false': 'false'} >> default 로 true/false 리턴

<hr>
<div id="sample5">
	<label> <input class="Checkbox" type="checkbox" value="0" data-bind="checked:db-num01" id="check31"> 0/1 </label> 
	<label> <input class="Checkbox" type="checkbox" value="y" data-bind="checked:db-yn" id="check32"> y/n (= Y/N) </label> 
	<label> <input class="Checkbox" type="checkbox" value="yes" data-bind="checked:db-yesNo" id="check33"> yes/no (= YES/NO)</label> 
	<label> <input class="Checkbox" type="checkbox" value="true" data-bind="checked:db-trueFalse" id="check34"> true/false (= TRUE/FALSE) </label> 
	<label> <input class="Checkbox" type="checkbox" value="value5" data-bind="checked:db-chk5" id="check35"> value5 </label>
</div><button id="get5" class="Button">GET Data</button>
</div>
```
<div id="sample5">
	<label> <input class="Checkbox" type="checkbox" value="0" data-bind="checked:db-num01" id="check31"> 0/1 </label> 
	<label> <input class="Checkbox" type="checkbox" value="y" data-bind="checked:db-yn" id="check32"> y/n (= Y/N) </label> 
	<label> <input class="Checkbox" type="checkbox" value="yes" data-bind="checked:db-yesNo" id="check33"> yes/no (= YES/NO)</label> 
	<label> <input class="Checkbox" type="checkbox" value="true" data-bind="checked:db-trueFalse" id="check34"> true/false (= TRUE/FALSE) </label> 
	<label> <input class="Checkbox" type="checkbox" value="value5" data-bind="checked:db-chk5" id="check35"> value5 </label>
</div>
<button id="get5" class="Button">GET Data</button>
```
```
$('#get5').on('click', function() {
	alert(JSON.stringify($('#sample5').getData()));
});


/* JSON.stringify($("#sample5").getData()); 

'{"db-num01":"0","db-yn":"n","db-yesNo":"no","db-trueFalse":false,"db-chk5":false}' // not checked 
'{"db-num01":"1","db-yn":"n","db-yesNo":"no","db-trueFalse":false,"db-chk5":false}' // '0/1' checked
'{"db-num01":"1","db-yn":"n","db-yesNo":"yes","db-trueFalse":false,"db-chk5":true}' // '0/1', 'yes/no (= YES/NO)', 'value5' checked 

*/
```
</div>

<script>

$('#get5').on('click', function() {
	alert(JSON.stringify($('#sample5').getData()));
});
</script> 


<div class="eg">
<div class="egview">
checked 컨트롤 예제 - radio
<hr>	
<div id="sample6">
    <input id="radio1" type="radio" class="Radio" name="radioGroup6" value="value1" data-bind="checked: radio6">
    <label for="radio1">Radio1</label>
    <input id="radio2" type="radio" class="Radio" name="radioGroup6" value="value2" data-bind="checked: radio6">
    <label for="radio2">Radio2</label>
    <input id="radio3" type="radio" class="Radio" name="radioGroup6" value="value3" data-bind="checked: radio6" checked="checked">
    <label for="radio3">Radio3</label>
    <input id="radio4" type="radio" class="Radio" name="radioGroup6" value="value4" data-bind="checked: radio6">
    <label for="radio4">Radio4</label>
</div><button id="get6" class="Button">GET Data</button>
</div>
```
<div id="sample6">
    <input id="radio1" type="radio" class="Radio" name="radioGroup6" value="value1" data-bind="checked: radio6">
    <label for="radio1">Radio1</label>
    <input id="radio2" type="radio" class="Radio" name="radioGroup6" value="value2" data-bind="checked: radio6">
    <label for="radio2">Radio2</label>
    <input id="radio3" type="radio" class="Radio" name="radioGroup6" value="value3" data-bind="checked: radio6" checked="checked">
    <label for="radio3">Radio3</label>
    <input id="radio4" type="radio" class="Radio" name="radioGroup6" value="value4" data-bind="checked: radio6">
    <label for="radio4">Radio4</label>
</div>
<button id="get6" class="Button">GET Data</button>
```
```
$('#get6').on('click', function() {
	alert(JSON.stringify($('#sample6').getData()));
});
```
</div>

<script>
$('#get6').on('click', function() {
	alert(JSON.stringify($('#sample6').getData()));
});
</script>  
- options
	- select 엘리먼트 내 `option`을 바인드합니다.
- selectedOptions
	- select 엘리먼트의 선택된 값을 바인드합니다.

<div class="eg">
<div class="egview">	
<div id="sample7">
	<select class="Select" data-bind="options: selectOptions1, selectedOptions: selected1" id="select1"></select>
</div></div>
```
<div id="sample7">
	<select class="Select" data-bind="options: selectOptions1, selectedOptions: selected1" id="select1"></select>
</div>
```
```
$('#sample7').setData({
	selectOptions1: [{value: 'opt1', text: '첫번째 옵션'}, {value: 'opt2', text: '두번째 옵션'}],
	selected1: 'opt2'
});
```
</div>

<script>
$('#sample7').setData({
	selectOptions1: [{value: 'opt1', text: '첫번째 옵션'}, {value: 'opt2', text: '두번째 옵션'}],
	selected1: 'opt2'
});
</script>

- attr
	- 데이터를 HTML 엘리먼트의 속성에 바인드합니다

<div class="eg">
<div class="egview">	
<div id="sample8">
	<form id="form">
		<input id="validation" class="Textinput" data-bind="attr: {data-validate-rule: vrule}">
		<input type="submit" class="Button" value="submit" id="submit1">
	</form>
</div></div>
```
<div id="sample8">
	<form id="form">
		<input id="validation" class="Textinput" data-bind="attr: {data-validate-rule: vrule}">
		<input type="submit" class="Button" value="submit" id="submit1">
	</form>
</div>
```
```
$('#form').submit(function(e){
	var result = $('#validation').validate();
	if($('#validation').validate()) {
		alert('유효한 입력값입니다.')
	} else {
		alert(Validator.mergeErrorMessage($('#validation').getErrorMessage()));
	}
	e.stopPropagation();
	e.preventDefault();
	return false;
});

$('#sample8').setData({vrule: '{required: true, minlength: 8, maxlength: 14}'});
```
</div>

<script>
$('#form').submit(function(e){
	var result = $('#validation').validate();
	if($('#validation').validate()) {
		alert('유효한 입력값입니다.')
	} else {
		alert(Validator.mergeErrorMessage($('#validation').getErrorMessage()));
	}
	e.stopPropagation();
	e.preventDefault();
	return false;
});

$('#sample8').setData({vrule: '{required: true, minlength: 8, maxlength: 14}'});
</script>

SVG 태그도 HTML 엘리먼트 중 하나로서, attr 컨트롤을 이용하여 SVG 이클립스 마크업의 CX, CY, RX, RY 등 속성을 바인딩합니다.
<div class="eg">
<div class="egview">
<div id="mySvg">	
	<svg id="mySvg" style="height:140px; width:100%; background-color:#efefef" >
	  <ellipse id="ellipse1"
			data-bind="attr: {cx: cx, cy:cy, rx: rx, ry:ry}, css:{fill:bg, stroke:stroke, stroke-width:strokeWidth}" ></ellipse>
	</svg>
	<table id="svgTable" class="Table">
		<tr>
			<td>cx</td>
			<td><input class="Textinput" data-bind="value:cx" id="cx1"/></td>
		</tr>
		<tr>
			<td>cy</td>
			<td><input class="Textinput" data-bind="value:cy" id="cy1"/></td>
		</tr>
		<tr>
			<td>rx</td>
			<td><input class="Textinput" data-bind="value:rx" id="rx1"/></td>
		</tr>
		<tr>
			<td>ry</td>
			<td><input class="Textinput" data-bind="value:ry" id="ry1"/></td>
		</tr>
		<tr>
			<td>background</td>
			<td><input class="Textinput" data-bind="value:bg" id="bg1"/></td>
		</tr>
		<tr>
			<td>stroke</td>
			<td><input class="Textinput" data-bind="value:stroke" id="stroke1"/></td>
		</tr>
		<tr>
			<td>stroke-width</td>
			<td><input class="Textinput" data-bind="value:strokeWidth" id="strokeWidth1"/></td>
		</tr>
	</table>
	<button id="btn_change" class="Button">변경</button>
</div></div>

```
<div id="mySvg">
	<svg id="mySvg" style="height:140px; width:100%; background-color:#efefef" >
	  <ellipse id="ellipse1"
			data-bind="attr: {cx: cx, cy:cy, rx: rx, ry:ry}, css:{fill:bg, stroke:stroke, stroke-width:strokeWidth}" ></ellipse>
	</svg>
	<table id="svgTable" class="Table">
		<tr>
			<td>cx</td>
			<td><input class="Textinput" data-bind="value:cx" id="cx1"/></td>
		</tr>
		<tr>
			<td>cy</td>
			<td><input class="Textinput" data-bind="value:cy" id="cy1"/></td>
		</tr>
		<tr>
			<td>rx</td>
			<td><input class="Textinput" data-bind="value:rx" id="rx1"/></td>
		</tr>
		<tr>
			<td>ry</td>
			<td><input class="Textinput" data-bind="value:ry" id="ry1"/></td>
		</tr>
		<tr>
			<td>background</td>
			<td><input class="Textinput" data-bind="value:bg" id="bg1"/></td>
		</tr>
		<tr>
			<td>stroke</td>
			<td><input class="Textinput" data-bind="value:stroke" id="stroke1"/></td>
		</tr>
		<tr>
			<td>stroke-width</td>
			<td><input class="Textinput" data-bind="value:strokeWidth" id="strokeWidth1"/></td>
		</tr>
	</table>
	<button id="btn_change" class="Button">변경</button>
</div>	
```
```
$('#btn_change').on('click', function() {
	$('#mySvg').setData($('#svgTable').getData());
});
$('#mySvg').setData({
	cx: 200,
	cy: 80,
	rx: 100,
	ry: 50,
	bg: 'rgb(255, 255, 0)',
	stroke: 'rgb(255, 0, 0)',
	strokeWidth: 3
});
```
</div>

<script>
$('#btn_change').on('click', function() {
	$('#mySvg').setData($('#svgTable').getData());
});
$('#mySvg').setData({
	cx: 200,
	cy: 80,
	rx: 100,
	ry: 50,
	bg: 'rgb(255, 255, 0)',
	stroke: 'rgb(255, 0, 0)',
	strokeWidth: 3
});
</script>


- css
	- 데이터를 CSS 스타일에 적용합니다.

<div class="eg">
<div class="egview">	
<div id="sample9">
	<div>입력란에 원하는 색상의 RGB를 입력하면 아래 배경이 바뀝니다.</div>
	RGB : <input class="Textinput" data-bind="value: background">
	<span> ex) #ffff00 = #ff0 = yellow </span>
	<div id="css1" data-bind="css: {background: background}">이곳에 색상이 바뀝니다.</div>
</div></div>
```
<div id="sample9">
	<div>입력란에 원하는 색상의 RGB를 입력하면 아래 배경이 바뀝니다.</div>
	RGB : <input class="Textinput" data-bind="value: background">
	 <span> ex) #ffff00 = #ff0 = yellow </span>
	<div id="css1" data-bind="css: {background: background}">이곳에 색상이 바뀝니다.</div>
</div>
```
```
$('#sample9').setData({background: '#FF0000'});
$('#sample9 input').on('keyup change',function(){
    var colorCode = $(this).val();
    $('#sample9').setData({background: colorCode});
});
```
</div>

<script>

$('#sample9').setData({background: '#FF0000'});
$('#sample9 input').on('keyup change',function(){
    var colorCode = $(this).val();
    $('#sample9').setData({background: colorCode});
});
</script>

- foreach
	- 배열 타입의 데이터를 화면에 반복적으로 나타냅니다.

<div class="eg">
<div class="egview">	
<div id="sample10">
	<p>list 바인딩</p>
	<ul class="List" data-bind="foreach: list" style="padding-left: 0px;">
		<li>
			<img data-bind="attr: {src: image}"  class="Thumbnail">
			<strong data-bind="text: title"></strong>
			<label data-bind="text: description"></label>
		</li>
	</ul>
	<p>dropdown 바인딩 <b style="color:blue">클릭하세요.</b></p> 
	<input class="Textinput">
	<ul id="dropdown" class="Dropdown" data-bind="foreach: list" style="padding-left: 0px;">
		<li>
			<img style="width:30px;height:30px;vertical-align:middle;" data-bind="attr: {src: image}" >
			<strong data-bind="text: title"></strong>
			<label data-bind="text: description"></label>
		</li>
	</ul>
</div></div>
```
<div id="sample10">
	<p>list 바인딩</p>
	<ul class="List" data-bind="foreach: list" style="padding-left: 0px;">
		<li>
			<img data-bind="attr: {src: image}"  class="Thumbnail" >
			<strong data-bind="text: title"></strong>
			<label data-bind="text: description"></label>
		</li>
	</ul>
	<p>dropdown 바인딩 <b style="color:blue">클릭하세요.</b></p> 
	<input class="Textinput">
	<ul id="dropdown" class="Dropdown" data-bind="foreach: list" style="padding-left: 0px;">
		<li>
			<img style="width:30px;height:30px;vertical-align:middle;" data-bind="attr: {src: image}">
			<strong data-bind="text: title"></strong>
			<label data-bind="text: description"></label>
		</li>
	</ul>
</div>
```
```
$('#sample10').setData({
	list: [{
		image: 'databind/icon/apple.png',
		title: 'Apple',
		description: 'Tool for poisoning a princess'
	}, {
		image: 'databind/icon/crystalshoes.png',
		title: 'Crystal Shoes',
		description: 'Princess Maker'
	}]
});
```
</div>

<script>
$('#sample10').setData({
	list: [{
		image: 'databind/icon/apple.png',
		title: 'Apple',
		description: 'Tool for poisoning a princess'
	}, {
		image: 'databind/icon/crystalshoes.png',
		title: 'Crystal Shoes',
		description: 'Princess Maker'
	}]
});
</script>



- template
 - `template` 컨트롤을 사용하여 트리 구조 등과 같은 재귀 형태의 바인딩을 합니다.
 - 트리 컴퍼넌트에서는 각각의 노드는 자식이 존재하는 경우에 반복적으로 렌더링됩니다. 이렇게 특정 조건에서 반복되는 형태는 template 컨트롤을 지정하여 데이터 바인드 합니다.

<div class="eg">
<div class="egview"> 
<p>
"template" 컨트롤의 "name"으로 어떤 템플릿을 사용할지 정의합니다. "foreach"는 데이터 구조에서 어떤 데이터를 참조하여 템플릿을 그릴지 지정합니다.
다음 예제에서는 트리 노드 오브젝트에서 "items"키에 데이터가 있는지에 따라 트리노드를 렌더링 합니다.
</p>

<ul id="tree" class="Tree" data-bind="template: { name: treeElement, foreach: treedata}"></ul>

<script type="text/html" id="treeElement">
<li>
	<a>
		<img data-bind="attr: {src: iconUrl}" >
		<label data-bind="html: text"></label>
	</a>
	<ul data-bind="template: {name: treeElement, foreach: items}">
	</ul>
</li>
</script></div>
```
<p>
"template" 컨트롤의 "name"으로 어떤 템플릿을 사용할지 정의합니다. "foreach"는 데이터 구조에서 어떤 데이터를 참조하여 템플릿을 그릴지 지정합니다.
다음 예제에서는 트리 노드 오브젝트에서 "items"키에 데이터가 있는지에 따라 트리노드를 렌더링 합니다.
</p>

<ul id="tree" class="Tree" data-bind="template: { name: treeElement, foreach: treedata}"></ul>

<script type="text/html" id="treeElement">
<li>
	<a>
		<img data-bind="attr: {src: iconUrl}" >
		<label data-bind="html: text"></label>
	</a>
	<ul data-bind="template: {name: treeElement, foreach: items}">
	</ul>
</li>
</script>
```
```
var data = {
	treedata: [{
		id: '1',
		text: 'folder',
		iconUrl: 'databind/icon/windows/folder.png',
		items: [{
			id: '1-1',
			text: 'subfolder',
			iconUrl: 'databind/icon/windows/folder.png',
			items: [{
				id: '1-1-1',
				text: 'bmp',
				iconUrl: 'databind/icon/windows/bmp.png',
				items: []
			}, {
				id: '1-1-2',
				text: 'txt',
				iconUrl: 'databind/icon/windows/txt.png',
				items: []
			}, {
				id: '1-1-3',
				text: 'Word File',
				iconUrl: 'databind/icon/windows/word59.png',
				items: []
			}, {
				id: '1-1-4',
				text: 'Archieve',
				iconUrl: 'databind/icon/windows/zip.png',
				items: []
			}]
		}]
	}, {
		id: '2',
		text: 'Unknown',
		iconUrl: 'databind/icon/windows/file.png',
		items: []
	}]
};
$('#tree').setData(data);
$('#tree').tree(); // 데이터 바인딩으로 생성된 엘리먼트를 Tree 컴포넌트화 하는 과정 
```
</div>
<script>
var data = {
	treedata: [{
		id: '1',
		text: 'folder',
		iconUrl: 'databind/icon/windows/folder.png',
		items: [{
			id: '1-1',
			text: 'subfolder',
			iconUrl: 'databind/icon/windows/folder.png',
			items: [{
				id: '1-1-1',
				text: 'bmp',
				iconUrl: 'databind/icon/windows/bmp.png',
				items: []
			}, {
				id: '1-1-2',
				text: 'txt',
				iconUrl: 'databind/icon/windows/txt.png',
				items: []
			}, {
				id: '1-1-3',
				text: 'Word File',
				iconUrl: 'databind/icon/windows/word59.png',
				items: []
			}, {
				id: '1-1-4',
				text: 'Archieve',
				iconUrl: 'databind/icon/windows/zip.png',
				items: []
			}]
		}]
	}, {
		id: '2',
		text: 'Unknown',
		iconUrl: 'databind/icon/windows/file.png',
		items: []
	}]
};
$('#tree').setData(data);
$('#tree').tree(); // 데이터 바인딩으로 생성된 엘리먼트를 Tree 컴포넌트화 하는 과정 
</script> 

- with
	- `with` 컨트롤은 파라미터 데이터로 전달된 데이터가 또 다른 오브젝트를 가지고 있는 경우, 하위 오브젝트가 바인드되는 영역을 지정합니다.
```
{
	key1: 'value1',
	key2: 'value2',
	key3: 'value3',
	key4: {
		key1: 'value1',
		key2: 'value2',
		key3: 'value3'
	}
}
```
위의 예제는 `with` 컨트롤이 왜 필요한지 보여줍니다. 파라미터로 전달된 데이터가 위와 같이 구성되어 있다고 가정할 경우, `key4` 키에 해당하는 데이터를 화면에 추가한다고 하면, 이 부분은 파라미터 데이터와 동일한 오브젝트 키를 사용합니다. 따라서 `key4` 키의 데이터가 화면에 추가될 영역을 `with` 컨트롤을 통해 명시적으로 지정합니다.
	
<style>
	#myMovie img {
		height: 50px;
		width: 35px
	}	
	#myMovie > span {
		display: inline-block;
	    font-size: 14px;
	    background-color: #356E84;
	    border-radius: 10px;
	    padding: 0 10px;
	    color: white;
	    margin: 5px 0;
	}
	#myMovie strong {
	    color: #00A1FF;
	    margin : 0 10px;
	}	
</style>

<div class="eg">
<div class="egview">	
<div id="myMovie">
	<span>대여 가능한 영화목록</span>
	<div>
		<ul class="List" data-bind="foreach:movies">
			<li>
				<a>
					<img data-bind="attr: {alt:description, src : imageUrl}" >
					<strong data-bind="text:title"></strong><span data-bind="text: director"></span>
				</a>
			</li>
		</ul>
	</div>
	<span>대여한 영화</span>
	<form id="myMovieForm" name="input" method="get" data-bind="with: checkout">
		<table class="Table">
			<colgroup>
				<col style="width: 100px;" />
				<col />
			</colgroup>
			<tr>
				<td>영화 이미지</td>
				<td>
					<img data-bind="attr: {alt:description, src : imageUrl}" >
				</td>
			</tr>
			<tr>
				<td>영화 제목</td>
				<td>
					<span data-bind="text:title"></span>
				</td>
			</tr>
			<tr>
				<td>감독</td>
				<td>
					<span data-bind="text: director"></span>
				</td>
			</tr>
		</table>
	</form>
</div></div>
```
<div id="myMovie">
	<span>대여 가능한 영화목록</span>
	<div>
		<ul class="List" data-bind="foreach:movies">
			<li>
				<a>
					<img data-bind="attr: {alt:description, src : imageUrl}" >
					<strong data-bind="text:title"></strong><span data-bind="text: director"></span>
				</a>
			</li>
		</ul>
	</div>
	<span>대여한 영화</span>
	<form id="myMovieForm" name="input" method="get" data-bind="with: checkout">
		<table class="Table">
			<colgroup>
				<col style="width: 100px;" />
				<col />
			</colgroup>
			<tr>
				<td>영화 이미지</td>
				<td>
					<img data-bind="attr: {alt:description, src : imageUrl}" >
				</td>
			</tr>
			<tr>
				<td>영화 제목</td>
				<td>
					<span data-bind="text:title"></span>
				</td>
			</tr>
			<tr>
				<td>감독</td>
				<td>
					<span data-bind="text: director"></span>
				</td>
			</tr>
		</table>
	</form>
</div>
```
```
<style>
	#myMovie img {
		height: 50px;
		width: 35px
	}	
	#myMovie > span {
		padding: 0;
		margin: 0;
		padding-left: 20px !important;
		display: inline-block;
		font-size: 20px;
		font-weight: bold;
	}
	#myMovie strong {
	    color: #00A1FF;
	    margin : 0 10px;
	}	
</style>
```
```

var data = {
	checkout: {
		"imageUrl": "databind/icon/titanic.png",
		"title": "타이타닉",
		"director": "제임스 카메론"
	},
	movies: [
			{
				"imageUrl": "databind/icon/titanic.png",
				"title": "Titanic",
				"director": "James Cameron"
			},
			{
				"imageUrl": "databind/icon/et.png",
				"title": "E.T.",
				"director": "Steven Spilberg"
			},
			{
				"imageUrl": "databind/icon/lovenovel.png",
				"title": "연애소설.",
				"director": "이한"
			},
			{
				"imageUrl": "databind/icon/flag.png",
				"title": "태극기 휘날리며",
				"director": "강제규"
			},
			{
				"imageUrl": "databind/icon/jsa.png",
				"title": "공동경비구역 JSA",
				"director": "박찬욱"
			}]
};


$('#myMovie').setData(data);

```
</div>

<script>
	var data = {
		checkout: {
			"imageUrl": "databind/icon/titanic.png",
			"title": "타이타닉",
			"director": "제임스 카메론"
		},
		movies: [
				{
					"imageUrl": "databind/icon/titanic.png",
					"title": "Titanic",
					"director": "James Cameron"
				},
				{
					"imageUrl": "databind/icon/et.png",
					"title": "E.T.",
					"director": "Steven Spilberg"
				},
				{
					"imageUrl": "databind/icon/lovenovel.png",
					"title": "연애소설.",
					"director": "이한"
				},
				{
					"imageUrl": "databind/icon/flag.png",
					"title": "태극기 휘날리며",
					"director": "강제규"
				},
				{
					"imageUrl": "databind/icon/jsa.png",
					"title": "공동경비구역 JSA",
					"director": "박찬욱"
				}]
	};


$('#myMovie').setData(data);

</script>


- grid
	- [Alopex 그리드](http://grid.alopex.io/)에 데이터바인드를 사용하고자 하는 경우 사용합니다.

<style>
.cell-highlight {
	background-color : red !important;
}
.examples-columnmapping-highlight {
	font-style : italic;
}
.examples-columnmapping-blue {
	background-color : #7AC5CD !important;
}
</style>

<div class="eg">
<div class="egview">	
	<button id="databind1" class="Button">데이터 바인드</button>
	<div id="gridsample" data-bind="grid: griddata"></div>
</div>
```
<button id="databind1" class="Button">데이터 바인드</button>
<div id="gridsample" data-bind="grid: griddata"></div>
```
```
<style>
.cell-highlight {
	background-color : red !important;
}
.examples-columnmapping-highlight {
	font-style : italic;
}
.examples-columnmapping-blue {
	background-color : #7AC5CD !important;
}
</style>
```
```
$a.page(function() {
	this.init = function() {
	
	$('#databind1').click(function(){
		var alpha = ["A","B","C","D","F"];
		var dataList = [];
		for(var i=0;i<5;i++) {
			dataList.push({
				"basic" : "basic " + alpha[i],
				"left" : "left " + alpha[i],
				"right" : "right " + alpha[i],
				"center" : "center " + alpha[i],
				"styleclass" : "styleclass " + alpha[i],
				"highlight" : "Highlight "+alpha[i],
				"sorting" : "Sorting " + alpha[i],
				"sortingNumber" : 8+i
			});
		}
		
		$('#gridsample').setData({
			griddata: {
				list: dataList
			}
		})
	});
	
	
	$("#gridsample").alopexGrid( {
		title : "Grid 데이터바인드 예제", //그리드의 타이틀을 설정.
		pager : false, //페이징 사용하지 않음.
		rowPadding: 10,
		columnMapping : [
			{	//selectorColumn. 행 선택을 위한 셀. 자동으로 가운데 정렬이 됩니다.
				//fixed true. 맨 왼쪽에서부터 연속된 열에 대해 설정된 fixed true 옵션을 통해 고정컬럼을 생성할 수 있습니다.
				columnIndex : 0, width : "30px",
				selectorColumn : true, fixed : true
			},
			{	//numberingColumn. 행이 전체 그리드 데이터 중 몇번째 인지를 표시해 주는 셀. 자동으로 가운데 정렬이 됩니다.
				//fixed true. 맨 왼쪽에서부터 연속된 fixed true 컬럼의 가장 마지막까지 고정컬럼으로 설정이 됩니다.
				columnIndex : 1, title : "1.Numbering,Fix", width : "100px",
				numberingColumn : true, fixed : true
			},
			{	//데이터 매핑을 위한 기본적인 columnMapping 사용입니다.
				columnIndex : 2, key : "basic", title : "2.Default", width : "80px"
			},
			{	//align "right". 데이터를 우측에 정렬하여 보여줍니다.
				//마우스를 올려놓았을 때 보이는 브라우져 말풍선을 표시하지 않습니다.
				columnIndex : 3, key : "right", title : "3.Align Right", width : "100px",
				align : "right", tooltip : false
			},
			{	//align "center". 데이터를 중앙에 정렬하여 보여줍니다.
				columnIndex : 4, key : "center", title : "4.Align Center", width : "100px",
				  align : "center"
			},
			{	//align "left". 데이터를 좌측에 정렬하여 보여줍니다.
				columnIndex : 5, key : "left", title : "5.Align Left", width : "100px",
				align : "left"
			},
			{	//styleclass. string으로 셀에 추가할 클래스를 지정합니다.
				columnIndex : 6, key : "styleclass", title : "6.Styleclass", width : "100px",
				styleclass:"examples-columnmapping-blue"
			},
			{	//highlight. true값을 설정하였을 경우 이 열의 모든 셀은 cell-highlight 클래스를 가집니다.
				columnIndex : 7, key : "highlight", title : "7.Highlight", width : "100px",
				highlight : true
			},
			{	//highlight. 특정 값을 가지는 컬럼만 하이라이트를 가지게 할 때엔 함수를 사용합니다.
				columnIndex : 8, key : "highlight", title : "8.Highlight 2", width : "100px",
				highlight : function(value, data) {
					if(value === "Highlight A") {
						//true를 리턴할 경우 셀은 cell-highlight 클래스를 가집니다.
						return true;
					} else if(value === "Highlight D") {
						//string을 리턴할 경우 cell-highlight 클래스와 리턴된 string을 클래스로 가집니다.
						return "examples-columnmapping-highlight";
					}
				}
			},
			{	//sorting. sorting을 설정할 경우 해당 열은 헤더에 정렬가능 표시가 뜨게 됩니다. 문자열 순서에 따라 정렬을 합니다.
				columnIndex : 9, key : "sorting", title : "9.Sorting", width : "100px",
				sorting : true //또는 sorting : "string"
			},
			{	//sorting. 값을 "number"로 설정할 경우 해당 열은 숫자 크기에 따라 정렬을 합니다.
				//숫자를 문자로 정렬하게 될 경우 8이 10보다 작음에도 불구하고 첫글자인 8이 문자열 순서에서 
				//1보다 크기때문에 의도한 정렬이 이루어지지 않게 되므로 sorting 옵션 설정시 이를 명시해야 합니다. 
				columnIndex : 10, key : "sortingNumber", title : "10.Sorting Numer", width : "140px",
				sorting : "number"
			},
			{	//resizing true. 열의 너비를 조정할 수 있게 하며, 이때 변경되는 너비는 우측의 열에서 빌려옵니다.
				columnIndex : 11, key : "basic", title : "11.Resizing", width : "100px",
				resizing : true
			},
			{	//resizing "self". 열의 너비를 조정할 수 있게 하며, 자기 자신의 너비만 변경합니다.
				columnIndex : 12, key : "basic", title : "12.Resizing Self", width : "100px",
				resizing : "self"
			}
		]
	});
}} );
```
</div>

<script>

$a.page(function() {
	this.init = function() {
	
	$('#databind1').click(function(){
		var alpha = ["A","B","C","D","F"];
		var dataList = [];
		for(var i=0;i<5;i++) {
			dataList.push({
				"basic" : "basic " + alpha[i],
				"left" : "left " + alpha[i],
				"right" : "right " + alpha[i],
				"center" : "center " + alpha[i],
				"styleclass" : "styleclass " + alpha[i],
				"highlight" : "Highlight "+alpha[i],
				"sorting" : "Sorting " + alpha[i],
				"sortingNumber" : 8+i
			});
		}
		
		$('#gridsample').setData({
			griddata: {
				list: dataList
			}
		})
	});
	
	
	$("#gridsample").alopexGrid( {
		title : "Grid 데이터바인드 예제", //그리드의 타이틀을 설정.
		pager : false, //페이징 사용하지 않음.
		rowPadding: 10,
		columnMapping : [
			{	//selectorColumn. 행 선택을 위한 셀. 자동으로 가운데 정렬이 됩니다.
				//fixed true. 맨 왼쪽에서부터 연속된 열에 대해 설정된 fixed true 옵션을 통해 고정컬럼을 생성할 수 있습니다.
				columnIndex : 0, width : "30px",
				selectorColumn : true, fixed : true
			},
			{	//numberingColumn. 행이 전체 그리드 데이터 중 몇번째 인지를 표시해 주는 셀. 자동으로 가운데 정렬이 됩니다.
				//fixed true. 맨 왼쪽에서부터 연속된 fixed true 컬럼의 가장 마지막까지 고정컬럼으로 설정이 됩니다.
				columnIndex : 1, title : "1.Numbering,Fix", width : "100px",
				numberingColumn : true, fixed : true
			},
			{	//데이터 매핑을 위한 기본적인 columnMapping 사용입니다.
				columnIndex : 2, key : "basic", title : "2.Default", width : "80px"
			},
			{	//align "right". 데이터를 우측에 정렬하여 보여줍니다.
				//마우스를 올려놓았을 때 보이는 브라우져 말풍선을 표시하지 않습니다.
				columnIndex : 3, key : "right", title : "3.Align Right", width : "100px",
				align : "right", tooltip : false
			},
			{	//align "center". 데이터를 중앙에 정렬하여 보여줍니다.
				columnIndex : 4, key : "center", title : "4.Align Center", width : "100px",
				  align : "center"
			},
			{	//align "left". 데이터를 좌측에 정렬하여 보여줍니다.
				columnIndex : 5, key : "left", title : "5.Align Left", width : "100px",
				align : "left"
			},
			{	//styleclass. string으로 셀에 추가할 클래스를 지정합니다.
				columnIndex : 6, key : "styleclass", title : "6.Styleclass", width : "100px",
				styleclass:"examples-columnmapping-blue"
			},
			{	//highlight. true값을 설정하였을 경우 이 열의 모든 셀은 cell-highlight 클래스를 가집니다.
				columnIndex : 7, key : "highlight", title : "7.Highlight", width : "100px",
				highlight : true
			},
			{	//highlight. 특정 값을 가지는 컬럼만 하이라이트를 가지게 할 때엔 함수를 사용합니다.
				columnIndex : 8, key : "highlight", title : "8.Highlight 2", width : "100px",
				highlight : function(value, data) {
					if(value === "Highlight A") {
						//true를 리턴할 경우 셀은 cell-highlight 클래스를 가집니다.
						return true;
					} else if(value === "Highlight D") {
						//string을 리턴할 경우 cell-highlight 클래스와 리턴된 string을 클래스로 가집니다.
						return "examples-columnmapping-highlight";
					}
				}
			},
			{	//sorting. sorting을 설정할 경우 해당 열은 헤더에 정렬가능 표시가 뜨게 됩니다. 문자열 순서에 따라 정렬을 합니다.
				columnIndex : 9, key : "sorting", title : "9.Sorting", width : "100px",
				sorting : true //또는 sorting : "string"
			},
			{	//sorting. 값을 "number"로 설정할 경우 해당 열은 숫자 크기에 따라 정렬을 합니다.
				//숫자를 문자로 정렬하게 될 경우 8이 10보다 작음에도 불구하고 첫글자인 8이 문자열 순서에서 
				//1보다 크기때문에 의도한 정렬이 이루어지지 않게 되므로 sorting 옵션 설정시 이를 명시해야 합니다. 
				columnIndex : 10, key : "sortingNumber", title : "10.Sorting Numer", width : "140px",
				sorting : "number"
			},
			{	//resizing true. 열의 너비를 조정할 수 있게 하며, 이때 변경되는 너비는 우측의 열에서 빌려옵니다.
				columnIndex : 11, key : "basic", title : "11.Resizing", width : "100px",
				resizing : true
			},
			{	//resizing "self". 열의 너비를 조정할 수 있게 하며, 자기 자신의 너비만 변경합니다.
				columnIndex : 12, key : "basic", title : "12.Resizing Self", width : "100px",
				resizing : "self"
			}
		]
	});
}});
</script>


## Functions

### .setData(data)

jQuery 셀렉터로 선택한 영역 내 data-bind 속성이 있는 HTML엘리먼트에 데이터를 추가하는 함수입니다.


- parameter
	- data {objct}
		- 화면 UI에 바인드 할 데이터입니다.


<div class="eg">
<div class="egview">	
	<div id="setData1">	
		<p> setData() 함수를 사용하여 데이터 오브젝트를 화면에 바인딩합니다.</p>
		
		<table class="Table">
			<colgroup>
				<col style="width:100px;" />
				<col />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th>Control</th>
					<th>Data</th>
					<th>Rendering Result</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>html</td>
					<td data-bind="text: link"></td>
					<td data-bind="html: link"></td>
				</tr>
				<tr>
					<td>text</td>
					<td data-bind="text: link"></td>
					<td data-bind="text: link"></td>
				</tr>
				<tr>
					<td>value</td>
					<td data-bind="text: input"></td>
					<td>
						<input class="Textinput" data-bind="value: input"/>
					</td>
				</tr>
				<tr>
					<td>checked (radio)</td>
					<td data-bind="text: radio"></td>
					<td>
						<input id="radio11" type="radio" class="Radio" name="radioGroup" value="value1" data-bind="checked: radio"/>
						<label for="radio11">Radio1</label>
						<input id="radio21" type="radio" class="Radio" name="radioGroup" value="value2" data-bind="checked: radio"/>
						<label for="radio21">Radio2</label>
						<input id="radio31" type="radio" class="Radio" name="radioGroup" value="value3" data-bind="checked: radio"/>
						<label for="radio31">Radio3</label>
						<input id="radio41" type="radio" class="Radio" name="radioGroup" value="value4" data-bind="checked: radio"/>
						<label for="radio41">Radio4</label>
					</td>
				</tr>
				<tr>
					<td>checked (checkbox)</td>
					<td data-bind="text: checkbox"></td>
					<td>
						<input id="checkbox11" type="checkbox" class="Checkbox" name="chk" value="check1" data-bind="checked: checkbox"/>
						<label for="checkbox11">Check1</label>
						<input id="checkbox21" type="checkbox" class="Checkbox" name="chk" value="check2" data-bind="checked: checkbox"/>
						<label for="checkbox21">Check2</label>
						<input id="checkbox31" type="checkbox" class="Checkbox" name="chk" value="check3" data-bind="checked: checkbox"/>
						<label for="checkbox31">Check3</label>
					</td>
				</tr>
				<tr>
					<td>checked (checkbox)</td>
					<td data-bind="text: subscription"></td>
					<td>
						<input id="subscription" type="checkbox" class="Checkbox" data-bind="checked: subscription"/>
						<label for="subscription">I would like to subscribe to receive email notification.</label>
					</td>
				</tr>
				<tr>
					<td>options</td>
					<td>
						options: <div data-bind="text: selectOptions1"></div>
						selected: <div data-bind="text: selected1"></div>
					</td>
					<td>
						<select data-bind="options: selectOptions1, selectedOptions: selected1"></select>
					</td>
				</tr>
				<tr>
					<td>options (custom)</td>
					<td>
						options: <div data-bind="text: selectOptions2"></div>
						selected: <div data-bind="text: selected1"></div>
					</td>
					<td>
						<select class="Select" data-bind-option="myvalue:mytext" data-bind="options: selectOptions2, selectedOptions: selected1"></select>
					</td>
				</tr>
				<tr>
					<td>attr</td>
					<td data-bind="text: vrule">
					</td>
					<td>
						<form id="form1">
							<input id="validation1" class="Textinput" data-bind="attr: {data-validate-rule: vrule, data-aaa:vrule}"/>
							<input type="submit" class="Button" value="submit" />
						</form>
					</td>
				</tr>
				<tr>
					<td>attr</td>
					<td data-bind="text: image">
					</td>
					<td>
						<img data-bind="attr: {src: image}" >
					</td>
				</tr>
				<tr>
					<td>css</td>
					<td data-bind="text: background">
					</td>
					<td>
						Background Color: <input class="Textinput" data-bind="value: background, css: {background: background}"/> 
					</td>
				</tr>
				<tr>
					<td>foreach</td>
					<td data-bind="text:list">
					</td>
					<td>
						<ul class="List" data-bind="foreach: list">
							<li>
								<img data-bind="attr: {src: image}" class="Thumbnail" >
								<strong data-bind="text: title"></strong>
								<span data-bind="text: description"></span>
							</li>
						</ul> 
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
```
<div id="setData1">	
		<p> setData() 함수를 사용하여 데이터 오브젝트를 화면에 바인딩합니다.</p>
		
		<table class="Table">
			<colgroup>
				<col style="width:100px;" />
				<col />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th>Control</th>
					<th>Data</th>
					<th>Rendering Result</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>html</td>
					<td data-bind="text: link"></td>
					<td data-bind="html: link"></td>
				</tr>
				<tr>
					<td>text</td>
					<td data-bind="text: link"></td>
					<td data-bind="text: link"></td>
				</tr>
				<tr>
					<td>value</td>
					<td data-bind="text: input"></td>
					<td>
						<input class="Textinput" data-bind="value: input"/>
					</td>
				</tr>
				<tr>
					<td>checked (radio)</td>
					<td data-bind="text: radio"></td>
					<td>
						<input id="radio11" type="radio" class="Radio" name="radioGroup" value="value1" data-bind="checked: radio"/>
						<label for="radio11">Radio1</label>
						<input id="radio21" type="radio" class="Radio" name="radioGroup" value="value2" data-bind="checked: radio"/>
						<label for="radio21">Radio2</label>
						<input id="radio31" type="radio" class="Radio" name="radioGroup" value="value3" data-bind="checked: radio"/>
						<label for="radio31">Radio3</label>
						<input id="radio41" type="radio" class="Radio" name="radioGroup" value="value4" data-bind="checked: radio"/>
						<label for="radio41">Radio4</label>
					</td>
				</tr>
				<tr>
					<td>checked (checkbox)</td>
					<td data-bind="text: checkbox"></td>
					<td>
						<input id="checkbox11" type="checkbox" class="Checkbox" name="chk" value="check1" data-bind="checked: checkbox"/>
						<label for="checkbox11">Check1</label>
						<input id="checkbox21" type="checkbox" class="Checkbox" name="chk" value="check2" data-bind="checked: checkbox"/>
						<label for="checkbox21">Check2</label>
						<input id="checkbox31" type="checkbox" class="Checkbox" name="chk" value="check3" data-bind="checked: checkbox"/>
						<label for="checkbox31">Check3</label>
					</td>
				</tr>
				<tr>
					<td>checked (checkbox)</td>
					<td data-bind="text: subscription"></td>
					<td>
						<input id="subscription" type="checkbox" class="Checkbox" data-bind="checked: subscription"/>
						<label for="subscription">I would like to subscribe to receive email notification.</label>
					</td>
				</tr>
				<tr>
					<td>options</td>
					<td>
						options: <div data-bind="text: selectOptions1"></div>
						selected: <div data-bind="text: selected1"></div>
					</td>
					<td>
						<select data-bind="options: selectOptions1, selectedOptions: selected1"></select>
					</td>
				</tr>
				<tr>
					<td>options (custom)</td>
					<td>
						options: <div data-bind="text: selectOptions2"></div>
						selected: <div data-bind="text: selected1"></div>
					</td>
					<td>
						<select class="Select" data-bind-option="myvalue:mytext" data-bind="options: selectOptions2, selectedOptions: selected1"></select>
					</td>
				</tr>
				<tr>
					<td>attr</td>
					<td data-bind="text: vrule">
					</td>
					<td>
						<form id="form1">
							<input id="validation1" class="Textinput" data-bind="attr: {data-validate-rule: vrule, data-aaa:vrule}"/>
							<input type="submit" class="Button" value="submit" />
						</form>
					</td>
				</tr>
				<tr>
					<td>attr</td>
					<td data-bind="text: image">
					</td>
					<td>
						<img data-bind="attr: {src: image}" >
					</td>
				</tr>
				<tr>
					<td>css</td>
					<td data-bind="text: background">
					</td>
					<td>
						Background Color: <input class="Textinput" data-bind="value: background, css: {background: background}"/> 
					</td>
				</tr>
				<tr>
					<td>foreach</td>
					<td data-bind="text:list">
					</td>
					<td>
						<ul class="List" data-bind="foreach: list">
							<li>
								<img data-bind="attr: {src: image}" class="Thumbnail" >
								<strong data-bind="text: title"></strong>
								<span data-bind="text: description"></span>
							</li>
						</ul> 
					</td>
				</tr>
			</tbody>
		</table>
	</div>
```

```
$a.page(function() {
	this.init = function() {

// 			$.alopex.setup('databind', {
// 				optionsValueKey: 'myvalue',
// 				optionsTextKey: 'mytext'
// 			});


	/***
	  * setData함수를 활용한 데이터 바인딩 예제.
	  * 해당 데이터가 data-bind 옵션에 따라 다양하게 바인딩 됩니다.
	  */
	$('#setData1').setData({
		link: '<a href="http://ui.alopex.io">Alopex UI</a>',
		input : 'input text',
		radio : 'value2',
		checkbox: ['check1', 'check2'],
		subscription : true,
		selectOptions: [],
		vrule: '{required: true, minlength: 8, maxlength: 14}',
		background: 'yellow',
		image : 'http://ui.alopex.io/favicon.ico',
		
// 				selectOptions1: ['option1', 'option2', 'option3'],
		selectOptions1: [{
			TEXT: '빈',
			VALUE: ''
		}, {
			TEXT: '옵션 1',
			VALUE: 'option1'
		}, {
			TEXT: '옵션 2',
			VALUE: 'option2'
		}, {
			TEXT: '옵션 3',
			VALUE: 'option3'
		}],
		selectOptions2: [{
			mytext: '옵션 1',
			myvalue: 'option1'
		}, {
			mytext: '옵션 2',
			myvalue: 'option2'
		}, {
			mytext: '옵션 3',
			myvalue: 'option3'
		}, {
			mytext: '옵션 4',
			myvalue: 'option4'
		}],
		selected1: 'option3',
		selected2: ['option1', 'option2'],
		iftext: '',
		list: [{
			image: 'databind/icon/apple.png',
			title: 'Apple',
			description: 'Tool for poisoning a princess'
		}, {
			image: 'databind/icon/crystalshoes.png',
			title: 'Crystal Shoes',
			description: 'Princess Maker'
		}]
	});
	
	/**
	 * attribute 속성을 바인딩 한 이후 유효성 검사 예제.
	 */
	$('#form1').submit(function(e){
		var result = $('#validation1').validate();
		if($('#validation1').validate()) {
			alert('유효한 입력값입니다.')
		} else {
			alert(Validator.mergeErrorMessage($('#validation1').getErrorMessage()));
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	});
	
}});
```
</div>

<script>
			
$a.page(function() {
	this.init = function() {

// 			$.alopex.setup('databind', {
// 				optionsValueKey: 'myvalue',
// 				optionsTextKey: 'mytext'
// 			});


	/***
	  * setData함수를 활용한 데이터 바인딩 예제.
	  * 해당 데이터가 data-bind 옵션에 따라 다양하게 바인딩 됩니다.
	  */
	$('#setData1').setData({
		link: '<a href="http://ui.alopex.io">Alopex UI</a>',
		input : 'input text',
		radio : 'value2',
		checkbox: ['check1', 'check2'],
		subscription : true,
		selectOptions: [],
		vrule: '{required: true, minlength: 8, maxlength: 14}',
		background: 'yellow',
		image : 'http://ui.alopex.io/favicon.ico',
		
// 				selectOptions1: ['option1', 'option2', 'option3'],
		selectOptions1: [{
			TEXT: '빈',
			VALUE: ''
		}, {
			TEXT: '옵션 1',
			VALUE: 'option1'
		}, {
			TEXT: '옵션 2',
			VALUE: 'option2'
		}, {
			TEXT: '옵션 3',
			VALUE: 'option3'
		}],
		selectOptions2: [{
			mytext: '옵션 1',
			myvalue: 'option1'
		}, {
			mytext: '옵션 2',
			myvalue: 'option2'
		}, {
			mytext: '옵션 3',
			myvalue: 'option3'
		}, {
			mytext: '옵션 4',
			myvalue: 'option4'
		}],
		selected1: 'option3',
		selected2: ['option1', 'option2'],
		iftext: '',
		list: [{
			image: 'databind/icon/apple.png',
			title: 'Apple',
			description: 'Tool for poisoning a princess'
		}, {
			image: 'databind/icon/crystalshoes.png',
			title: 'Crystal Shoes',
			description: 'Princess Maker'
		}]
	});
	
	/**
	 * attribute 속성을 바인딩 한 이후 유효성 검사 예제.
	 */
	$('#form1').submit(function(e){
		var result = $('#validation1').validate();
		if($('#validation1').validate()) {
			alert('유효한 입력값입니다.')
		} else {
			alert(Validator.mergeErrorMessage($('#validation1').getErrorMessage()));
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	});
	
}});
</script>
	
### .getData(JSON option)

jQuery 셀렉터로 선택한 영역 내 HTML엘리먼트 중 data-bind 속성이 명시된 엘리먼트에서 데이터를 가져오는 함수입니다.

- parameter
	- option
		- getData 사용시 옵션으로 원하는 데이터만 선별하여 가져올 수 있습니다.
		- selectOptions {boolean}
			- 셀렉트 컴포넌트의 options 값을 가져올 수 있습니다. (default: false)

- return
	- data {object}
		- 선택된 화면 영역 내에서 읽어온 데이터


<div class="eg">
<div class="egview">	
	<form id="getDataForm" name="input" method="get">
		<table class="Table" data-bind="css: {background: bgColor}">
			<colgroup>
				<col style="width: 100px;" />
				<col />
			</colgroup>
			<tbody>
			<tr>
				<td>table color</td>
				<td class="Text-left"><input class="Textinput " type="text" data-bind="value:bgColor" value="#efefef"></td>
			</tr>
			<tr>
				<td>Name</td>
				<td class="Text-left">
					<input class="Textinput" type="text" data-bind="value:firstname" value="Gil-dong">
					<input class="Textinput" type="text" data-bind="value:lastname" value="Hong">
				</td>
			</tr>
			<tr>
				<td>Password</td>
				<td class="Text-left"><input class="Textinput" type="password" data-bind="value:password" value="password"></td>
			</tr>
			<tr>
				<td>Gender</td>
				<td class="Text-left"><input class="Radio" id="radio1" type="radio"
					name="gender" value="male" data-bind="checked:gender" checked="checked"/> 
					<label for="radio1">male</label> 
					<input class="Radio" id="radio2" type="radio" name="gender" value="female" data-bind="checked:gender" /> 
					<label for="radio2">female</label>
				</td>
			</tr>
			<tr>
				<td>Home Phone</td>
				<td class="Text-left"><input class="Textinput" type="text" data-bind="value:phone" value="02-6400-3333"></td>
			</tr>
			<tr>
				<td>Cell Phone</td>
				<td class="Text-left"><input class="Textinput" type="text" data-bind="value:cell" value="010-2222-2222"></td>
			</tr>
			<tr>
				<td>Description</td>
				<td class="Text-left">
					<textarea class="Textarea" data-bind="value:description">SK C&C Alopex UI Framework Manager</textarea>
				</td>
			</tr>
			<tr>
				<td>Interests</td>
				<td class="Text-left">
					<div id="test">
						<input id="i1" class="Checkbox" type="checkbox" name="interest" value="shopping" data-bind="checked:interest" > 
						<label for="i1">shopping</label>
						<input id="i2" class="Checkbox" type="checkbox" name="interest" value="books" data-bind="checked: interest" checked="checked"> 
						<label for="i2">books</label> 
						<input id="i3" class="Checkbox" type="checkbox" name="interest" value="game" data-bind="checked: interest" > 
						<label for="i3">game</label> 
						<input id="i4" class="Checkbox" type="checkbox" name="interest" value="sports" data-bind="checked: interest" checked="checked" >
						<label for="i4">sports</label>
					</div>
				</td>
			</tr>
			</tbody>
		</table>
		<input id="btn_getData" class="Button" value="데이터 읽기">
	</form>
</div>
```
<form id="getDataForm" name="input" method="get">
	<table data-bind="css: {background: bgColor}">
		<colgroup>
			<col style="width: 100px;" />
			<col />
		</colgroup>
		<tbody>
		<tr>
			<td>table color</td>
			<td class="Text-left"><input class="Textinput" type="text" data-bind="value:bgColor" value="#efefef" ></td>
		</tr>
		<tr>
			<td>Name</td>
			<td class="Text-left">
				<input class="Textinput" type="text" data-bind="value:firstname" value="Gil-dong" >
				<input class="Textinput" type="text" data-bind="value:lastname" value="Hong">
			</td>
		</tr>
		<tr>
			<td>Password</td>
			<td class="Text-left"><input class="Textinput" type="password" data-bind="value:password" value="password"></td>
		</tr>
		<tr>
			<td>Gender</td>
			<td class="Text-left"><input class="Radio" id="radio1" type="radio"
				name="gender" value="male" data-bind="checked:gender" checked="checked"/> 
				<label for="radio1">male</label> 
				<input class="Radio" id="radio2" type="radio" name="gender" value="female" data-bind="checked:gender" /> 
				<label for="radio2">female</label>
			</td>
		</tr>
		<tr>
			<td>Home Phone</td>
			<td class="Text-left"><input class="Textinput" type="text" data-bind="value:phone" value="02-6400-3333"></td>
		</tr>
		<tr>
			<td>Cell Phone</td>
			<td class="Text-left"><input class="Textinput" type="text" data-bind="value:cell" value="010-2222-2222"></td>
		</tr>
		<tr>
			<td>Description</td>
			<td class="Text-left">
				<textarea class="Textarea" data-bind="value:description">SK C&C Alopex UI Framework Manager</textarea>
			</td>
		</tr>
		<tr>
			<td>Interests</td>
			<td class="Text-left">
				<div id="test">
					<input id="i1" class="Checkbox" type="checkbox" name="interest" value="shopping" data-bind="checked:interest" > 
					<label for="i1">shopping</label>
					<input id="i2" class="Checkbox" type="checkbox" name="interest" value="books" data-bind="checked: interest" checked="checked"> 
					<label for="i2">books</label> 
					<input id="i3" class="Checkbox" type="checkbox" name="interest" value="game" data-bind="checked: interest" > 
					<label for="i3">game</label> 
					<input id="i4" class="Checkbox" type="checkbox" name="interest" value="sports" data-bind="checked: interest" checked="checked" >
					<label for="i4">sports</label>
				</div>
			</td>
		</tr>
		</tbody>
	</table>
	<input id="btn_getData" class="Button" value="데이터 읽기">
</form>
```

```
$('#btn_getData').click(function() {
	var getdata = $('#getDataForm').getData();
	//console.log('data == ', getdata);
	alert(JSON.stringify(getdata));
});
```
</div>

<script>
$('#btn_getData').click(function() {
	var getdata = $('#getDataForm').getData();
	//console.log('data == ', getdata);
	alert(JSON.stringify(getdata));
});
</script>


### $a.data.control(control)

새로운 컨트롤을 정의하는 함수입니다. 빌트인(이미 alopex ui에 있는) 컨트롤을 정의 시 빌트인 함수가 오버라이드 됩니다.

> `$a.data.control`을 사용하여 사용자 정의 데이터바인드 컨트롤을 생성할 수 있습니다.
첫번째 파라미터에는 데이터바인드 컨트롤 명을 입력합니다.
`$a.data.control('time',{...`와 같이 정의하였다면 실제 html 엘리먼트에서는 
data-bind="time:timeval" 와 같이 control:key 형태로 사용할 수 있습니다.


- parameter
	- control {object}
		- 새로운 컨트롤의 정의가 담겨있는 오브젝트입니다.
		- contrl 오브젝트 내에 render 함수와 data 함수가 정의됩니다.
		- render {function}
			- render 함수는 데이터가 화면에 렌더링되는 규칙을 정의합니다.
			- parameter
				- key
					- 데이터의 키
				- value
					- 데이터의 값
				- element
					- 데이터가 렌더링되어야 되는 HTML 엘리먼트
				- rule
					- HTML 엘리먼트의 data-bind 속성 규칙
		- data {function}
			- data 함수는 화면에서 데이터 읽어오는 함수입니다.
			- parameter
				- element {HTMLElement}
					- 데이터를 가져와야 하는 HTML 엘리먼트
			- return 
				- HTML 엘리먼트에서 읽은 데이터

#### 컨트롤 파라미터

|속성명|파라미터|설명|
|---|--|-----|
|editable|true/false|change 이벤트 시점에 데이터 편집 여부 설정|
|render|function(element, key, value, data, rule) {...}<br/>key: 데이터 키, <br/>value: 데이터 값, <br/>element: data-bind를 사용한 엘리먼트, <br/>rule: data-bind에 설정한 rule, <br/>data: 뷰 데이터|사용자 정의 데이터바인드 컨트롤을 사용한 엘리먼트가 화면상에 어떻게 렌더링 되는지 설정합니다.|
|data|function(element, key)<br/>element: data-bind를 사용한 엘리먼트, <br/>key: 데이터 키|뷰에서 값을 읽어올때 호출되는 함수를 등록합니다.|
			
```
$a.data.control('number', {
	render : function(element, key, value, data, rule) {
		var formatted = value;
		/* 
			... formatted 변수에 세자리 수마다 추가 ...
		 */
		if (element.tagName.toLowerCase() == 'input') {
			$(element).val(formatted);
		} else {
			$(element).text(formatted);
		}
	},
	data : function(element) {
		var data;
		if (element.tagName.toLowerCase() == 'input') {
			data = $(element).val();
		} else {
			data = $(element).text();
		}
		var unformatted = data.replace(/,/g, '');
		return unformatted;
	}
});
```
<div class="eg">
<div class="egview">
	시간 표현을 위한 4자리 숫자 입력(예: 1130) 후 "time setData" 버튼 클릭
	<br/>
	<input id="userInputTime" class="Textinput"/>
	<button id="setDataWithDataControl" class="Button">time setData</button>
	<br/><br/>
	setData 결과 :
	<span id="setDataResult" data-bind="time:data1" class="Margin-left-10 Font-bold .Font-big"></span>
</div>

```
	시간 표현을 위한 4자리 숫자 입력(예: 1130) 후 "time setData" 버튼 클릭
	<br/>
	<input id="userInputTime" class="Textinput"/>
	<button id="setDataWithDataControl" class="Button">time setData</button>
	<br/><br/>
	setData 결과 :
	<span id="setDataResult" data-bind="time:data1" class="Margin-left-10 Font-bold .Font-big"></span>
```

```
$a.data.control('time',{
    // change 이벤트 시점에 판단하는 기준이 됨.
    editable: true,
    // rendering할때 호출되는 함수.
    render: function(element, key, value, data, rule) {
        if(typeof value != 'string') {
            return ;
        }
        var formatted;
        if(value.length == 4){
            formatted = value.substr(0,2) + ':' + value.substr(2,2);
        }else if (value.length == 0) {
            formatted = value;
        } else {
            return;
        }
        if(element.tagName.toLowerCase() == 'input') {
            $(element).val(formatted);
        } else {
            $(element).text(formatted);
        }
    },
    // 엘리먼트로 부터 값 읽어올 때 호출되는 함수.
    data: function(element) {
        var data;
        if(element.tagName.toLowerCase() == 'input') {
            data = $(element).val();
            //console.log("data", data);
        } else {
            data = $(element).text();
            //console.log("data", data);
        }
        return data.replace(/:/g, '');
    }
		
});

$('#setDataWithDataControl').click(function(){
	$('#setDataResult').setData({
		data1: $("#userInputTime").val()
	});
});
```
</div>

<script>
$a.data.control('time',{
    // change 이벤트 시점에 판단하는 기준이 됨.
    editable: true,
    // rendering할때 호출되는 함수.
    render: function(element, key, value, data, rule) {
        if(typeof value != 'string') {
            return ;
        }
        var formatted;
        if(value.length == 4){
            formatted = value.substr(0,2) + ':' + value.substr(2,2);
        }else if (value.length == 0) {
            formatted = value;
        } else {
            return;
        }
        if(element.tagName.toLowerCase() == 'input') {
            $(element).val(formatted);
        } else {
            $(element).text(formatted);
        }
    },
    // 엘리먼트로 부터 값 읽어올 때 호출되는 함수.
    data: function(element) {
        var data;
        if(element.tagName.toLowerCase() == 'input') {
            data = $(element).val();
           // console.log("data", data);
        } else {
            data = $(element).text();
            //console.log("data", data);
        }
        return data.replace(/:/g, '');
    }
		
});

$('#setDataWithDataControl').click(function(){
	$('#setDataResult').setData({
		data1: $("#userInputTime").val()
	});
});

</script>	


<div class="eg">
<div class="egview">
	<button id="btn_insertDate" class="Button">6자리 숫자입력</button>
	<input class="Textinput" id="dateSpan" data-bind="date:date" data-disabled="true">
</div>
```
	<button id="btn_insertDate" class="Button">6자리 숫자입력</button>
	<input class="Textinput" id="dateSpan" data-bind="date:date" data-disabled="true">
```

```
$a.data.control('date',{
    // change 이벤트 시점에 판단하는 기준이 됨.
    editable: true,
    // rendering할때 호출되는 함수.
    render: function(element, key, value, data, rule) {
        if(typeof value != 'string') {
            return ;
        }
		var match = value.match(/(\d{4})(\d{2})(\d{2})/);
		if ( match ){
			$(element).val(match[1] + '/' + match[2] + '/' + match[3]);
		} else {
			return '';
		}
    },
    // 엘리먼트로 부터 값 읽어올 때 호출되는 함수.
    data: function(element) {
        var data;
        if(element.tagName.toLowerCase() == 'input') {
            data = $(element).val();
        } else {
            data = $(element).text();
        }
        return data.replace(/\//g, '');
    }
		
});

$('#btn_insertDate').click(function(){
	var val = prompt('숫자를 6자리로 입력하세요  예) 20160101');
	
	$('#dateSpan').setData({
		date: val
	});
});
```
</div>

<script>
$a.data.control('date',{
    // change 이벤트 시점에 판단하는 기준이 됨.
    editable: true,
    // rendering할때 호출되는 함수.
    render: function(element, key, value, data, rule) {
        if(typeof value != 'string') {
            return ;
        }
		var match = value.match(/(\d{4})(\d{2})(\d{2})/);
		if ( match ){
			$(element).val(match[1] + '/' + match[2] + '/' + match[3]);
		} else {
			return '';
		}
    },
    // 엘리먼트로 부터 값 읽어올 때 호출되는 함수.
    data: function(element) {
        var data;
        if(element.tagName.toLowerCase() == 'input') {
            data = $(element).val();
        } else {
            data = $(element).text();
        }
        return data.replace(/\//g, '');
    }
		
});

$('#btn_insertDate').click(function(){
	var val = prompt('숫자를 6자리로 입력하세요  예) 20160101');
	
	$('#dateSpan').setData({
		date: val
	});
});

</script>	

