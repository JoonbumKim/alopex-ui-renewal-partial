
<style>
	table tr td:last-child {
	    white-space: normal;
	    text-align: left;
	}
</style>

# Validator

## Basic

input/select 에 입력된 필드 값에 대한 검증기능을 제공합니다. 

### Validation Methods

<table data-type="table">
	<colgroup>
		<col style="width:150px;" />
		<col style="width:100px;" />
		<col />
	</colgroup>
	<thead>
		<tr>
			<th>Method</th>
			<th>Parameter Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>required</td>
			<td>ID Selector, boolean</td>
			<td>해당 필드의 필수 여부. ID selector를 넣은 경우 ID selector에 해당되는
			필드에 value가 있어야 자신을 필수 검증 대상으로 지정합니다. 또한,ID selector가 지정된 경우 
			ID selector가 지정하는 대상 element에 대한 의존성이 있는 것이므로,
			validator를 생성하였다면 대상 element가 validate될 때 자신도 함께 validate가 수행됩니다.</td>
		</tr>
		<tr>
			<td>minlength</td>
			<td>number</td>
			<td>해당 필드의 최소 문자 개수</td>
		</tr>
		<tr>
			<td>maxlength</td>
			<td>number</td>
			<td>해당 필드의 최대 문자 개수</td>
		</tr>
		<tr>
			<td>rangelength</td>
			<td>[number, number]</td>
			<td>해당 필드의 문자 개수가 주어진 수 안에 위치하는가 여부</td>
		</tr>
		<tr>
			<td>minblength</td>
			<td>number</td>
			<td>해당 필드의 최소 바이트 길이</td>
		</tr>
		<tr>
			<td>maxblength</td>
			<td>number</td>
			<td>해당 필드의 최대 바이트 길이</td>
		</tr>
		<tr>
			<td>rangeblength</td>
			<td>[number, number]</td>
			<td>해당 필드의 길이가 주어진 바이트 길이 안에 위치하는가 여부</td>
		</tr>
		<tr>
			<td>min</td>
			<td>number</td>
			<td>해당 필드가 가지는 value의 최소값</td>
		</tr>
		<tr>
			<td>max</td>
			<td>number</td>
			<td>해당 필드가 가지는 value의 최대값</td>
		</tr>
		<tr>
			<td>range</td>
			<td>[number, number]</td>
			<td>해당 필드가 가지는 value값이 주어진 숫자 안에 위치하는가 여부</td>
		</tr>
		<tr>
			<td>email</td>
			<td>boolean</td>
			<td>이메일 형식을 지켰는가 여부</td>
		</tr>
		<tr>
			<td>url</td>
			<td>boolean</td>
			<td>url 형식을 지켰는가 여부(http://..., https://...)</td>
		</tr>
		<tr>
			<td>date</td>
			<td>boolean</td>
			<td>YYYY/MM/DD 또는 YYYY-MM-DD 형식을 지켰는가 여부</td>
		</tr>
		<tr>
			<td>mindate</td>
			<td>string, ID Selector</td>
			<td>date형식이면서, 특정 날짜 또는 날짜 이후의 날짜가 입력되었는가 여부</td>
		</tr>
		<tr>
			<td>maxdate</td>
			<td>string, ID Selector</td>
			<td>date형식이면서, 특정 날짜 또는 날짜 이전의 날짜가 입력되었는가 여부</td>
		</tr>
		<tr>
			<td>daterange</td>
			<td>[date, date] 또는 date대신 ID Selector</td>
			<td>date형식이면서, 특정 날짜 사이의 값이 입력되었는지 여부</td>
		</tr>
		<tr>
			<td>oneof</td>
			<td>[...]</td>
			<td>array에 포함된 값들 중 하나가 입력되었는지 여부</td>
		</tr>
		<tr>
			<td>number</td>
			<td>boolean</td>
			<td>정수값이 입력되었는가 여부</td>
		</tr>
		<tr>
			<td>digits</td>
			<td>boolean</td>
			<td>숫자만(0~9) 입력이 되었는가 여부</td>
		</tr>
		<tr>
			<td>alphabet</td>
			<td>boolean</td>
			<td>영문 알파벳만 입력이 되었는가 여부</td>
		</tr>
		<tr>
			<td>equalTo</td>
			<td>ID Selector, value</td>
			<td>제시된 값과 동일한 값이 필드에 입력되었는가 여부. ID Selector가
			들어온 경우 select된 필드와 값이 동일한가 비교.</td>
		</tr>
		<tr>
			<td>numalpha</td>
			<td>boolean</td>
			<td>숫자 또는 알파벳만 입력되었는가 여부</td>
		</tr>
		<tr>
			<td>nospace</td>
			<td>boolean</td>
			<td>스페이스를 허용하지 않는가 여부</td>
		</tr>
	</tbody>
</table>

<div class="eg">
<div class="egview">
	<form id="form1">
		<div class="Margin-bottom-10">
			<label>기본 메시지(마크업 적용)</label>
			<input id="inputVali1" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" >
			<span data-for="inputVali1" style="color: red;"></span>
		</div>
		<div>
			<label>기본 메시지(javascript 적용)</label>
			<input type="text" id="inputVali1JS" class="Textinput">
			<span data-for="inputVali1JS" style="color: red;"></span>
		</div>
	</form>
</div>
```
<form id="form1">
	<div class="Margin-bottom-10">
		<label>기본 메시지(마크업 적용)</label>
		<input id="inputVali1" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" >
		<span data-for="inputVali1" style="color: red;"></span>
	</div>
	<div>
		<label>기본 메시지(javascript 적용)</label>
		<input type="text" id="inputVali1JS" class="Textinput">
		<span data-for="inputVali1JS" style="color: red;"></span>
	</div>
</form>
```
```
$('#inputVali1').validator();

$('#inputVali1JS').validator({
	rule : {
		required : true,
		minlength : 2,
		maxlength : 10
	}
});
```
</div>
<script type="text/javascript">
$('#inputVali1').validator();

$('#inputVali1JS').validator({
	rule : {
		required : true,
		minlength : 2,
		maxlength : 10
	}
});
</script>

### 기본 오류메시지
Validator 컴포넌트에서 기본적으로 제공하는 오류메시지입니다.

<table data-type="table">
	<colgroup>
		<col style="width:150px;" />
		<col />
	</colgroup>
	<thead>
		<tr>
			<th>Method</th>
			<th>기본 오류메시지</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>required</td>
			<td>반드시 입력해야 하는 항목입니다.</td>
		</tr>
		<tr>
			<td>minlength</td>
			<td>최소 {0}글자 이상 입력하십시오.</td>
		</tr>
		<tr>
			<td>maxlength</td>
			<td>최대 {0}글자 까지 입력 가능합니다.</td>
		</tr>
		<tr>
			<td>rangelength</td>
			<td>{0}에서 {1} 글자 사이로 입력하십시오.</td>
		</tr>
		<tr>
			<td>minblength</td>
			<td>최소 {0}바이트 이상 입력하십시오.</td>
		</tr>
		<tr>
			<td>maxblength</td>
			<td>최대 {0}바이트 까지 입력 가능합니다.</td>
		</tr>
		<tr>
			<td>rangeblength</td>
			<td>{0}에서 {1} 바이트 사이로 입력하십시오.</td>
		</tr>
		<tr>
			<td>min</td>
			<td>최소 입력가능 값은 {0}입니다.</td>
		</tr>
		<tr>
			<td>max</td>
			<td>최대 입력가능 값은 {0}입니다.</td>
		</tr>
		<tr>
			<td>range</td>
			<td>{0}에서 {1} 사이의 값을 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>email</td>
			<td>이메일 형식에 맞게 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>url</td>
			<td>url 형식에 맞게 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>date</td>
			<td>날짜를 YYYY/MM/DD 또는 YYYY-MM-DD 형식에 맞게 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>mindate</td>
			<td>{0} 또는 {0} 이후의 날짜를 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>maxdate</td>
			<td>{0} 또는 {0} 이전의 날짜를 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>daterange</td>
			<td>{0}에서 {1} 사이의 날짜를 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>oneof</td>
			<td>다음중 하나의 값을 입력해 주십시오 : {param}.</td>
		</tr>
		<tr>
			<td>number</td>
			<td>실수를 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>integer</td>
			<td>정수를 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>digits</td>
			<td>숫자만 입력 가능합니다.</td>
		</tr>
		<tr>
			<td>alphabet</td>
			<td>알파벳만 입력 가능합니다.</td>
		</tr>
		<tr>
			<td>equalTo</td>
			<td>{0} 값만 가능합니다.</td>
		</tr>
		<tr>
			<td>numalpha</td>
			<td>숫자 또는 영문자만 입력 가능합니다.</td>
		</tr>
		<tr>
			<td>nospace</td>
			<td>스페이스는 입력할 수 없습니다.</td>
		</tr>
		<tr>
			<td>hangul</td>
			<td>한글만 입력 가능합니다.</td>
		</tr>
		<tr>
			<td>numhan</td>
			<td>숫자 또는 한글만 입력 가능합니다.</td>
		</tr>
		<tr>
			<td>phone</td>
			<td>대시(-)가 들어간 전화번호 형태를 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>mobile</td>
			<td>대시(-)가 들어간 휴대전화번호 형태를 입력해 주십시오.</td>
		</tr>
		<tr>
			<td>decimal</td>
			<td>소숫점 {1}자리를 포함하여 최대 {0}자리까지 허용됩니다.</td>
		</tr>
	</tbody>
</table> 

## Attributes


Validator 동작의 기본 단위는 form을 구성하는 개별 input과 select입니다.

### Input/Select Validator  Attributes

input/select 태그에 대해 HTML 마크업 속성 및 자바스크립트를 이용하여 validator 룰을 적용할 수 있습니다.

#### data-validation-rule

input/select에 적용할 검증 룰을 JSON string 형태로 명시합니다.
검증 룰은 [Validation Methods](#Basic_ValidationMethods) 이름을 키로 하며, 해당 method의 파라미터를 value로 가지는 object입니다.  

 `data-for="id명"` 을 명시한 태그에 오류메시지를 넣을 수 있습니다.
 

#### data-validation-message

input/select에서 수행된 검증결과에 따라 메시지를 출력할 때, [기본메시지](#Basic_기본오류메시지)가 아닌 별도의 에러 메시지를 사용하고자 할 때 사용합니다.

<div class="eg">
<div class="egview">
	<form id="form2">
		<div class="Margin-bottom-10">
			<label>커스텀 메시지(마크업 적용) </label>
			<input id="inputVali2" class="Textinput" type="text" data-validation-rule="{required:true}" data-validation-message="{required:'ID를 반드시 입력하세요!'}" >
			<span data-for="inputVali2" style="color:deepskyblue;"></span>
		</div>
		<div>
			<label>커스텀 메시지(javascript 적용)</label>
			<input type="text" id="inputVali2JS" class="Textinput" >
			<span data-for="inputVali2JS" style="color:deepskyblue;"></span>
		</div>
	</form>
</div>
```
<form id="form2">
	<div class="Margin-bottom-10">
		<label>커스텀 메시지(마크업 적용) </label>
		<input id="inputVali2" class="Textinput" type="text" data-validation-rule="{required:true}" data-validation-message="{required:'ID를 반드시 입력하세요!'}" >
		<span data-for="inputVali2" style="color:deepskyblue;"></span>
	</div>
	<div>
		<label>커스텀 메시지(javascript 적용)</label>
		<input type="text" id="inputVali2JS" class="Textinput" >
		<span data-for="inputVali2JS" style="color:deepskyblue;"></span>
	</div>
</form>
```
```
$('#inputVali2').validator();

$('#inputVali2JS').validator({
	rule : {
		required : true,
		minlength : 2,
		maxlength : 10
	},
    message: {
        required: '이름을 반드시 입력하세요!'
    }
});
```
</div>
<script type="text/javascript">
$('#inputVali2').validator();

$('#inputVali2JS').validator({
    rule : {
        required: true
    },
    message: {
        required: '이름을 반드시 입력하세요!'
    }
});
</script>

#### data-validation-option

input/select를 검증하고자 할 때 사용 가능한 옵션입니다.

<table class="Table">
	<colgroup>
		<col style="width:150px;" />
		<col style="width:80px;" />
		<col />
	</colgroup>
	<thead>
		<tr>
			<th>Option</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>onkeyup</td>
			<td>true</td>
			<td>사용자가 문자열을 입력한 직후에 validation을 수행할 것인가 여부</td>
		</tr>
		<tr>
			<td>onchange</td>
			<td>true</td>
			<td>DOM의 change 이벤트가 발생하였을 때 validation을 수행할 것인가 여부</td>
		</tr>
		<tr>
			<td>onblur</td>
			<td>true</td>
			<td>해당 element가 focus를 잃었을 때 validation을 수행할 것인가 여부</td>
		</tr>
		<tr>
			<td>messageToLabel</td>
			<td>false</td>
			<td>자신의 id를 for attribute에 명시한 label 태그에 오류메시지를 넣도록 할 것인가 여부 </td>
		</tr>
		<tr>
			<td>messageToDatafor</td>
			<td>true</td>
			<td>자신의 id를 data-for attribute에 명시한 태그에 오류메시지를 넣도록 할 것인가 여부</td>
		</tr>
	</tbody>
</table>

```
// 마크업 적용 시
<input type="text" id="rule1" data-validation-option=" { onkeyup : false, onchange : false } ">

// javascript 적용 시
$('#rule1').validator({
	option : {
		onkeyup : false,
		onchange : false,
	}
});

```
<p>
<div class="eg">
<div class="egview">
	<form id="form3">
		<div class="Margin-bottom-10">
			<label>onkeyup:false, onchange:false, onblur:true(마크업 적용)</label>
			<input id="inputVali3" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" data-validation-option="{onkeyup:false, onchange:false}">
			<span data-for="inputVali3" style="color: orange;"></span>
		</div>
		<div>
			<label>onkeyup:false, onchange:false, onblur:true(javascript 적용)</label>
			<input type="text" id="inputVali3JS" class="Textinput">
			<span data-for="inputVali3JS" style="color: orange;"></span>
		</div>
	</form>
</div>
```
<form id="form3">
	<div class="Margin-bottom-10">
		<label>onkeyup:false, onchange:false, onblur:true(마크업 적용)</label>
		<input id="inputVali3" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" data-validation-option="{onkeyup:false, onchange:false}">
		<span data-for="inputVali3" style="color: orange;"></span>
	</div>
	<div>
		<label>onkeyup:false, onchange:false, onblur:true(javascript 적용)</label>
		<input type="text" id="inputVali3JS" class="Textinput">
		<span data-for="inputVali3JS" style="color: orange;"></span>
	</div>
</form>
```
```
$('#inputVali3').validator();

$('#inputVali3JS').validator({
	rule : {
		required : true,
		minlength : 2,
		maxlength : 10
	},
	option : {
		onkeyup : false,
		onchange : false,
	}
});
```
</div>
<script>
$('#inputVali3').validator();

$('#inputVali3JS').validator({
	rule : {
		required : true,
		minlength : 2,
		maxlength : 10
	},
	option : {
		onkeyup : false,
		onchange : false,
	}
});
</script>

### Form Validator Attributes

form 태그에 대해 다음과 같은 속성을 적용할 수 있습니다.

#### data-validation-option

form을 검증하고자 할 때 사용 가능한 옵션입니다.

<table class="Table">
	<colgroup>
		<col style="width:150px;" />
		<col style="width:80px;" />
		<col />
	</colgroup>
	<thead>
		<tr>
			<th>Option</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>onsubmit</td>
			<td>true</td>
			<td>form이 submit될 때에 validation을 수행하여 submit 중지 여부</td>
		</tr>
		<tr>
			<td>submitHandler</td>
			<td>null</td>
			<td>form이 submit될 때에 별도로 수행할 submit handler입니다. onsubmit이 true일 때에
			submitHandler가 지정되어 있으면, preventDefault()를 수행하는 기본 동작 대신
			submitHandler에 지정되어 있는 이벤트 핸들러를 수행하게 됩니다.</td>
		</tr>
		<tr>
			<td>oninit</td>
			<td>false</td>
			<td>validator가 생성되는 즉시 validation 수행 여부.
			기본적으로 사용자가 입력을 시작하면서 부터 validation을 수행하게 됩니다.</td>
		</tr>
	</tbody>
</table>


```
// 마크업 적용 시
<form data-validation-option="{onsubmit:true}">
	...
</form>

// javascript 적용 시
$('form').validator({ option : {
	onsubmit : true,
	submitHandler : function(event) {
		if($(this).validate()) {
			return true;
		} else {
			//submit 진행을 억제
			event.preventDefault();
			return false;
		}
	}
}});
```
<p>
<div class="eg">
<div class="egview">
	<form id="formInit" data-validation-option="{oninit:true}" class="Margin-bottom-10">
		<label>oninit:true form(마크업) </label>
		<input id="inputValiInit" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" >
		<span data-for="inputValiInit" style="color: red;"></span>
	</form>
	<form id="form4" data-validation-option="{onsubmit:true}" class="Margin-bottom-10">
		<label>submit form 검증(마크업 방식)</label>
		<input id="inputVali4" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" data-validation-option="{onkeyup:false, onchange:false, onblur:false}">
		<span data-for="inputVali4" style="color: red;"></span>
		<button id="inputVali4_submit" class="Button" type="submit">submit</button>
	</form>
	<form id="form4JS">
		<label>submit form 검증(javascript 방식)</label>
		<input id="inputVali4JS" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" data-validation-option="{onkeyup:false, onchange:false, onblur:false}">
		<span data-for="inputVali4JS" style="color: red;"></span>
	<button id="inputVali4JS_submit" class="Button" type="submit" >submit</button>
	</form>	
</div>
```
	<form id="formInit" data-validation-option="{oninit:true}" class="Margin-bottom-10">
		<label>oninit:true form(마크업) </label>
		<input id="inputValiInit" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" >
		<span data-for="inputValiInit" style="color: red;"></span>
	</form>
	<form id="form4" data-validation-option="{onsubmit:true}" class="Margin-bottom-10">
		<label>submit form 검증(마크업 방식)</label>
		<input id="inputVali4" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" data-validation-option="{onkeyup:false, onchange:false, onblur:false}">
		<span data-for="inputVali4" style="color: red;"></span>
		<button id="inputVali4_submit" class="Button" type="submit">submit</button>
	</form>
	<form id="form4JS">
		<label>submit form 검증(javascript 방식)</label>
		<input id="inputVali4JS" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" data-validation-option="{onkeyup:false, onchange:false, onblur:false}">
		<span data-for="inputVali4JS" style="color: red;"></span>
	<button id="inputVali4JS_submit" class="Button" type="submit" >submit</button>
	</form>	
```
```
$('#formInit').validator();
$('#form4').validator();

$('#form4JS').validator({ option : {
	onsubmit : true,
	submitHandler : function(event) {
		if($(this).validate()) {
			return true;
		} else {
			//submit 진행을 억제
			event.preventDefault();
			return false;
		}
	}
}});


```
</div>

<script>
$('#formInit').validator();
$('#form4').validator();

$('#form4JS').validator({ option : {
	onsubmit : true,
	submitHandler : function(event) {
		if($(this).validate()) {
			return true;
		} else {
			//submit 진행을 억제
			event.preventDefault();
			return false;
		}
	}
}});

</script>




## Functions


### .validator(Object config)


form/input/select에 valdation 설정하고, 설정을 저장하고 있는 Validation Object를 리턴합니다.

- parameter
	- config {Object} Optional
		- validator가 input/select에 대해 수행된 경우 config object는 다음과 같은 필드를 가집니다.

		<table class="Table">
			<colgroup>
				<col style="width:120px;" />
				<col style="width:70px;" />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th>Config</th>
					<th>Type</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>rule</td>
					<td>object</td>
					<td>해당 필드에 적용할 검증 규칙입니다.</td>
				</tr>
				<tr>
					<td>message</td>
					<td>object</td>
					<td>필드에 적용한 검증규칙 결과에 따라 표시할 사용자 지정 메시지입니다.</td>
				</tr>
				<tr>
					<td>option</td>
					<td>object</td>
					<td>필드에 적용할 validation 옵션입니다.</td>
				</tr>
			</tbody>
		</table>  

		- validator가 form에 대해 수행된 경우 config object는 다음과 같은 필드를 가집니다.
		
		<table class="Table">
			<colgroup>
				<col style="width:120px;" />
				<col style="width:70px;" />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th>Config</th>
					<th>Type</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>elements</td>
					<td>object</td>
					<td>form 안에 위치한 input/select의 name을 key로,
					앞서 설명한 input/select에 적용하는 config object의 형태를 가지는
					object를 value로 가지는 object입니다.
					개별 input/select에 대한 validation rule 설정을
					form을 통해서 수행할 수 있도록 합니다.</td>
				</tr>
				<tr>
					<td>option</td>
					<td>object</td>
					<td>form에 적용할 옵션입니다.</td>
				</tr>
			</tbody>
		</table>

- return
	- Object {Validator}
		- 해당 field의 설정을 저장하는 Validator Object를 리턴합니다.

```
var validator = $('#myinput').validator({rule:{required:true, minlength:2}});
var result = validator.validate();
```
<p>
<div class="eg">
<div class="egview">
	<form id="form5">
		<div class="Margin-bottom-10">
			<label>inputA(2~10자)</label>
			<input id="inputA" class="Textinput" type="text" name="nameA" >
			<span data-for="inputA" style="color:magenta;"></span>
		</div>
		<div>
			<label>inputB(4~8자)</label>
			<input id="inputB" class="Textinput" type="text" name="nameB">
			<span data-for="inputB" style="color:blue;"></span>
		</div>
	</form>
</div>
```
<form id="form5">
	<div class="Margin-bottom-10">
		<label>inputA(2~10자)</label>
		<input id="inputA" class="Textinput" type="text" name="nameA" >
		<span data-for="inputA" style="color:magenta;"></span>
	</div>
	<div>
		<label>inputB(4~8자)</label>
		<input id="inputB" class="Textinput" type="text" name="nameB">
		<span data-for="inputB" style="color:blue;"></span>
	</div>
</form>
```
```
$('#form5').validator({// form에 validator 할 경우
	elements :{ // 아래와같이 input,select의 name 값으로 각기 다른 validator 적용가능.
		"nameA" : {
			rule:{required:true, minlength:2 ,maxlength:10} //(2~10자)
			} 
	   ,"nameB" : {
	   		rule:{required:true, minlength:4 ,maxlength:8} //(4~8자)
	   	   ,message: {required: '입력란이 비어있습니다.'} // 커스텀 메시지
		}
	}
});
```
</div>
<script>
$('#form5').validator({// form에 validator 할 경우
	elements :{ // 아래와같이 input,select의 name 값으로 각기 다른 validator 적용가능.
		"nameA" : {
			rule:{required:true, minlength:2 ,maxlength:10} //(2~10자)
			} 
	   ,"nameB" : {
	   		rule:{required:true, minlength:4 ,maxlength:8} //(4~8자)
	   	   ,message: {required: '입력란이 비어있습니다.'} // 커스텀 메시지
		}
	}
});
</script>


### .validate(Object config)

validator와 거의 동일하나, 해당 input/select/form의 검증 결과 값을 리턴하는 것에 차이가 있습니다.

- parameter
	- config {Object} Optional.
		- validator()의 config와 동일합니다.
		
- return
	- result {Boolean}
		- 해당 input/select/form의 검증결과값을 boolean값으로 리턴합니다.


<style>
	.falseState{border-color: red}
	.falseState:hover {border-color: #FF7100}
</style>
<div class="eg">
<div class="egview">
	<form id="form8" class="Margin-bottom-10">
		<input id="inputVali8" class="Textinput">
		<span data-for="inputVali8" style="color: red;"></span>		
	</form>
	<button id="btn_validator1" class="Button">validator()</button>
	<button id="btn_validate1" class="Button">validate()</button>
</div>
```
<style>
	.falseState{border-color: red}
	.falseState:hover {border-color: #FF7100}
</style>

<form id="form8" class="Margin-bottom-10">
	<input id="inputVali8" class="Textinput">
	<span data-for="inputVali8" style="color: red;"></span>		
</form>
<button id="btn_validator1" class="Button">validator()</button>
<button id="btn_validate1" class="Button">validate()</button>
```
```
$('#btn_validator1').click(function() {
	var validator1 = $('#form8').validator({
		rule : {
			required : true,
			minlength : 2,
			maxlength : 10
		}
	});
	alert(JSON.stringify(validator1));
});
$('#btn_validate1').click(function() {
	var validate1 = $('#form8').validate({
		rule : {
			required : true,
			minlength : 2,
			maxlength : 10
		}
	});
	alert(validate1);
	if (!validate1) {
		$('#inputVali8').addClass("falseState");
		
	} else{
		$('#inputVali8').removeClass("falseState");
	};
});

```
</div>
<script type="text/javascript">

$('#btn_validator1').click(function() {
	var validator1 = $('#form8').validator({
		rule : {
			required : true,
			minlength : 2,
			maxlength : 10
		}
	});
	alert(JSON.stringify(validator1));
});
$('#btn_validate1').click(function() {
	var validate1 = $('#form8').validate({
		rule : {
			required : true,
			minlength : 2,
			maxlength : 10
		}
	});
	alert(validate1);
	if (!validate1) {
		$('#inputVali8').addClass("falseState");
		
	} else{
		$('#inputVali8').removeClass("falseState");
	};
});
</script>


### Validator Object 함수

validator() 함수는 Validator object를 리턴합니다. 이때 리턴되는 Validator 
object는 관련 함수를 제공하며, validator와 관련된 데이터들을 가져올 수 있습니다.

#### .validate()

현재 Validator object가 지시하고 있는 element에 대한 검증을 실시합니다.

- return
	- result {Boolean}

```
var validator = $('#myInput').validator(); 
if(validator.validate()) { //  'true' or 'false'
	alert('Input is valid');
} else {
	alert('Input is not valid');
}
```
<p>
<div class="eg">
<div class="egview">
	<form id="form6">
		<input id="inputVali6" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" >
		<span data-for="inputVali6" style="color: red;"></span>		
	</form>
	<div class="Margin-top-10">
		<label>Valid:<span id="span1"></span></label>
		<button id="btn_validate" class="Button">validate()</button>
	</div>
</div>
```
<form id="form6">
	<input id="inputVali6" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" >
	<span data-for="inputVali6" style="color: red;"></span>
</form>
<div class="Margin-top-10">
	<label>Valid:<span id="span1"></span></label>
	<button id="btn_validate" class="Button">validate()</button>
</div>
```
```

$('#btn_validate').click(function() {
	var validator = $('#inputVali6').validator();
	var validate = validator.validate(); //  'true' or 'false'
	$('#span1').text(validate);
	if(validate) { 
		alert('Input is valid');			
	} else {
		alert('Input is not valid');
	}
});	
```
</div>
<script>
	
	$('#btn_validate').click(function() {
		var validator = $('#inputVali6').validator();
		var validate = validator.validate(); //  'true' or 'false'
		$('#span1').text(validate);
		if(validate) { 
			alert('Input is valid');			
		} else {
			alert('Input is not valid');
		}
	});
</script>


#### .getErrorMessage()

현재 Validator object가 지시하고 있는 target element에 대한 
검증을 실시하였을 때, 발생한 오에 대한 오류메시지를 모두 가져옵니다.

- return
	- result {Object}
		- input/select일 경우 자신에게 발생한 오류메시지를 
		array에 담아서 리턴하며, form일 경우 자신이 가지고 있는 input/select에 대한 
		오류메시지 array를 각기 input/select의 name을 키로하여 저장한 object를 리턴합니다.

```
var validator = $('form').validator();
if(!validator.validate()) {
	var errorstr = '',
	    errormessages = validator.getErrorMessage();
	for(var name in errormessages) {
		for(var i=0; i < errormessages[name].length; i++) {
			errorstr += errormessages[name][i] + '\n';
		}
	}
	$('#errorpanel').text(errorstr);
}
```
<p>
<div class="eg">
<div class="egview">
	<form id="form7">
		<input id="inputVali7" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" >
		<span data-for="inputVali7" style="color: red;"></span>
	</form>
	<button id="btn_getMessage1" class="Button">ELEMENT getErrorMessage()</button>
	<button id="btn_getMessage2" class="Button">FORM getErrorMessage() </button>
	<label>errormessages:<span id="span2" style="white-space: pre;"></span> </label>
</div>
```
<form id="form7">
	<input id="inputVali7" class="Textinput" type="text" data-validation-rule="{required:true, minlength:2, maxlength:10}" >
	<span data-for="inputVali7" style="color: red;"></span>
</form>
<button id="btn_getMessage1" class="Button">ELEMENT getErrorMessage()</button>
<button id="btn_getMessage2" class="Button">FORM getErrorMessage() </button>
<label>errormessages:<span id="span2" style="white-space: pre;"></span> </label>
```
```
$('#form7').validator();
	$('#btn_getMessage1').click(function() { // ELEMENT
		var validator = $('#inputVali7').validator();
		var errorstr = validator.getErrorMessage();
		
		$('#span2').text(errorstr);

	});
	$('#btn_getMessage2').click(function() { // FORM
		var validator = $('#form7').validator();
		var errorstr = '',
		    errormessages = validator.getErrorMessage();
		for(var name in errormessages) {
			for(var i=0; i < errormessages[name].length; i++) {
				errorstr += errormessages[name][i] + '\n';
			}
		}
		$('#span2').text(errorstr);

	});
```
</div>
<script>
	$('#form7').validator();
	$('#btn_getMessage1').click(function() { // ELEMENT
		var validator = $('#inputVali7').validator();
		var errorstr = validator.getErrorMessage();
		
		$('#span2').text(errorstr);

	});
	$('#btn_getMessage2').click(function() { // FORM
		var validator = $('#form7').validator();
		var errorstr = '',
		    errormessages = validator.getErrorMessage();
		for(var name in errormessages) {
			for(var i=0; i < errormessages[name].length; i++) {
				errorstr += errormessages[name][i] + '\n';
			}
		}
		$('#span2').text(errorstr);

	});

</script>

### $a.validator.setup (Object config)
validator 함수 사용 시 공통으로 사용할 수 있는 디폴트 값을  설정합니다. 설정할 수 있는 항목은 [validator(Object config)](#Functions_validatorObjectconfig)와 동일하게 사용할 수 있습니다.

<div class="eg">
	
```
$a.validator.setup({
   message: {
        required:  'Required Form Field',
    }
 })
```
</div>

## Extra Example

### Methods sample usage

attribute 설정을 통해 alopex validator가 제공하는 검증 메소드를 사용하는 예제입니다.

<div class="eg">
<div class="egview">
<div class="sector">
		<p>data-validation-rule="{required:true}" - 필수입력항목</p>
		<div>
			<input class="Textinput" type="text" name="required1"
				id="required1" data-validation-rule="{required:true}"> 
			<button id="btn1-1" class="Button">.validate()</button>
			<button id="btn1-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{minlength:숫자, maxlength:숫자}" - 문자열 갯수를
			검증.</p>
		<div>
			<input class="Textinput" type="text" name="len1" id="len1"
				data-validation-rule="{minlength:6,maxlength:8}" value="test">
			<button id="btn2-1" class="Button">.validate()</button>
			<button id="btn2-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{rangelength:[숫자,숫자]}" - 문자열 갯수 범위를 검증.</p>
		<div>
			<input class="Textinput" type="text" name="len2" id="len2"
				data-validation-rule="{rangelength:[6,8]}" value="test"> 
			<button id="btn3-1" class="Button">.validate()</button>
			<button id="btn3-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{minblength:숫자, maxblength:숫자}" - 문자열의
			바이트길이를 검증</p>
		<p>한글은 UTF-8인코딩에서 3바이트를 차지. 아래의 예제는 6바이트에서 8바이트까지만 허용하므로 한글 3글자는
			9바이트를 차지하여 검증 실패.</p>
		<div>
			<input class="Textinput" type="text" name="len3" id="len3"
				data-validation-rule="{minblength:6,maxblength:8}" value="문자열">
			<button id="btn4-1" class="Button">.validate()</button>
			<button id="btn4-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{rangeblength:[숫자,숫자]}" - 문자열의 바이트길이 범위를
			검증.</p>
		<div>
			<input class="Textinput" type="text" name="len4" id="len4"
				data-validation-rule="{rangeblength:[6,8]}" value="문자열"> 
			<button id="btn5-1" class="Button">.validate()</button>
			<button id="btn5-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{min:숫자,max:숫자,range:[숫자,숫자]}" - 숫자의 최소값
			또는 최대값을 검증</p>
		<p>아래 예제는 50에서 100의 숫자를 허용</p>
		<div>
			<input class="Textinput" type="text" name="mm1" id="mm1"
				data-validation-rule="{min:50,max:100,range:[50,100]}" value="501">
			<button id="btn6-1" class="Button">.validate()</button>
			<button id="btn6-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{decimal:[자릿수길이숫자,소숫점길이숫자]}" - 정수입력을 허용</p>
		<div>
			<input class="Textinput" type="text" name="dec1" id="dec1"
				data-validation-rule="{decimal:[6,3]}" value="123.456"> 
			<button id="btn7-1" class="Button">.validate()</button>
			<button id="btn7-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{digits:true}" - 숫자만 입력 허용</p>
		<div>
			<input class="Textinput" type="text" name="d1" id="d1"
				data-validation-rule="{digits:true}" value="text"> 
			<button id="btn8-1" class="Button">.validate()</button>
			<button id="btn8-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{number:true}" - 실수(real number) 입력
			허용(3.14, -2.99)</p>
		<div>
			<input class="Textinput" type="text" name="n1" id="n1"
				data-validation-rule="{number:true}" value="text"> 
			<button id="btn9-1" class="Button">.validate()</button>
			<button id="btn9-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{integer:true}" - 정수 입력 허용(+또는-가 붙어도 검증
			통과)</p>
		<div>
			<input class="Textinput" type="text" name="i1" id="i1"
				data-validation-rule="{integer:true}" value="text"> 
			<button id="btn10-1" class="Button">.validate()</button>
			<button id="btn10-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{alphabet:true}" - 영문자 알파벳 입력 허용</p>
		<div>
			<input class="Textinput" type="text" name="a1" id="a1"
				data-validation-rule="{alphabet:true}" value="텍스트"> 
			<button id="btn11-1" class="Button">.validate()</button>
			<button id="btn11-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{numalpha:true}" - 숫자와 영문자 알파벳 입력 허용</p>
		<div>
			<input class="Textinput" type="text" name="na1" id="na1"
				data-validation-rule="{numalpha:true}" value="텍스트"> 
			<button id="btn12-1" class="Button">.validate()</button>
			<button id="btn12-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{nospace:true}" - 빈칸(스페이스) 입력을 허용하지 않음</p>
		<div>
			<input class="Textinput" type="text" name="ns1" id="ns1"
				data-validation-rule="{nospace:true}" value="tex t"> 
			<button id="btn13-1" class="Button">.validate()</button>
			<button id="btn13-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{hangul:true}" - 한글 입력만 허용. 스페이스는 한글로
			인정하지 않음.</p>
		<div>
			<input class="Textinput" type="text" name="h1" id="h1"
				data-validation-rule="{hangul:true}" value="한글"> 
			<button id="btn14-1" class="Button">.validate()</button>
			<button id="btn14-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{numhan:true}" - 숫자와 한글 입력만 허용</p>
		<div>
			<input class="Textinput" type="text" name="nh1" id="nh1"
				data-validation-rule="{numhan:true}" value="한글123"> 
			<button id="btn15-1" class="Button">.validate()</button>
			<button id="btn15-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{email:true}" - 이메일 형식만 허용</p>
		<div>
			<input class="Textinput" type="text" name="em1" id="em1"
				data-validation-rule="{email:true}" value="hello@world.com"> 
			<button id="btn16-1" class="Button">.validate()</button>
			<button id="btn16-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{url:true}" - http, https등으로 시작하는 url형식만
			허용</p>
		<div>
			<input class="Textinput" type="text" name="url1" id="url1"
				data-validation-rule="{url:true}" value="http://ui.alopex.io">
			<button id="btn17-1" class="Button">.validate()</button>
			<button id="btn17-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{date:true}" - 날짜 형식만 허용(YYYY-MM-DD 또는
			YYYY/MM/DD)</p>
		<div>
			<input class="Textinput" type="text" name="da1" id="da1"
				data-validation-rule="{date:true}" value="2014-01-01"> 
			<button id="btn17-3" class="Button">.validate()</button>
			<button id="btn17-4" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{mindate:날짜,maxdate:날짜,daterange:[날짜,날짜]}"
			- 날짜의 최소/최대값 또는 범위를 지정</p>
		<div>
			<input class="Textinput" type="text" name="dr1" id="dr1"
				data-validation-rule="{mindate:'2014-01-01',maxdate:'2014-01-31',daterange:['2014-01-01','2014-01-31']}" value="2014-01-15"> 
			<button id="btn18-1" class="Button">.validate()</button> 
			<button id="btn18-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>
	
	<div class="sector">
		<p>data-validation-rule="{mindate:ID셀렉터,maxdate:ID셀렉터}" - 지정된 ID셀렉터의 input이 가지는 날짜 만큼을 최대/최소값으로 지정.
		아래의 예제는 서로 날짜를 추월하지 못하도록 설정한 예.</p>
		<div>
			from<input class="Textinput" type="text" name="dr2from" id="dr2from"
				data-validation-rule="{mindate:'2014-01-01',maxdate:'#dr2to'}"
				value="2014-01-19">
			to<input class="Textinput" type="text" name="dr2to" id="dr2to"
				data-validation-rule="{mindate:'#dr2from',maxdate:'2014-12-31'}"
				value="2014-01-13">
			<button id="btn19-1" class="Button">$(from).validate()</button>
			<button id="btn19-2" class="Button">$(from).getErrorMessage()</button>
			<button id="btn19-3" class="Button">$(to).validate()</button>
			<button id="btn19-4" class="Button">$(to).getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{oneof:[...]}" - 어레이에 지정한 값만 입력하도록 허용</p>
		<div>
			<input class="Textinput" type="text" name="oo1" id="oo1"
				data-validation-rule="{oneof:['A','B','C']}" value="D"> 
			<button id="btn20-1" class="Button">.validate()</button>
			<button id="btn20-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{equalTo:값}" - 제시된 값과 동일해야 함. 아래 예시는
			'test'만 허용.</p>
		<div>
			<input class="Textinput" type="text" name="eq1" id="eq1"
				data-validation-rule="{equalTo:'test'}" value="test1"> 
			<button id="btn21-1" class="Button">.validate()</button>
			<button id="btn21-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>
</div>
```
<div class="sector">
		<p>data-validation-rule="{required:true}" - 필수입력항목</p>
		<div>
			<input class="Textinput" type="text" name="required1"
				id="required1" data-validation-rule="{required:true}"> 
			<button id="btn1-1" class="Button">.validate()</button>
			<button id="btn1-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{minlength:숫자, maxlength:숫자}" - 문자열 갯수를
			검증.</p>
		<div>
			<input class="Textinput" type="text" name="len1" id="len1"
				data-validation-rule="{minlength:6,maxlength:8}" value="test">
			<button id="btn2-1" class="Button">.validate()</button>
			<button id="btn2-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{rangelength:[숫자,숫자]}" - 문자열 갯수 범위를 검증.</p>
		<div>
			<input class="Textinput" type="text" name="len2" id="len2"
				data-validation-rule="{rangelength:[6,8]}" value="test"> 
			<button id="btn3-1" class="Button">.validate()</button>
			<button id="btn3-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{minblength:숫자, maxblength:숫자}" - 문자열의
			바이트길이를 검증</p>
		<p>한글은 UTF-8인코딩에서 3바이트를 차지. 아래의 예제는 6바이트에서 8바이트까지만 허용하므로 한글 3글자는
			9바이트를 차지하여 검증 실패.</p>
		<div>
			<input class="Textinput" type="text" name="len3" id="len3"
				data-validation-rule="{minblength:6,maxblength:8}" value="문자열">
			<button id="btn4-1" class="Button">.validate()</button>
			<button id="btn4-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{rangeblength:[숫자,숫자]}" - 문자열의 바이트길이 범위를
			검증.</p>
		<div>
			<input class="Textinput" type="text" name="len4" id="len4"
				data-validation-rule="{rangeblength:[6,8]}" value="문자열"> 
			<button id="btn5-1" class="Button">.validate()</button>
			<button id="btn5-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{min:숫자,max:숫자,range:[숫자,숫자]}" - 숫자의 최소값
			또는 최대값을 검증</p>
		<p>아래 예제는 50에서 100의 숫자를 허용</p>
		<div>
			<input class="Textinput" type="text" name="mm1" id="mm1"
				data-validation-rule="{min:50,max:100,range:[50,100]}" value="501">
			<button id="btn6-1" class="Button">.validate()</button>
			<button id="btn6-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{decimal:[자릿수길이숫자,소숫점길이숫자]}" - 정수입력을 허용</p>
		<div>
			<input class="Textinput" type="text" name="dec1" id="dec1"
				data-validation-rule="{decimal:[6,3]}" value="123.456"> 
			<button id="btn7-1" class="Button">.validate()</button>
			<button id="btn7-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{digits:true}" - 숫자만 입력 허용</p>
		<div>
			<input class="Textinput" type="text" name="d1" id="d1"
				data-validation-rule="{digits:true}" value="text"> 
			<button id="btn8-1" class="Button">.validate()</button>
			<button id="btn8-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{number:true}" - 실수(real number) 입력
			허용(3.14, -2.99)</p>
		<div>
			<input class="Textinput" type="text" name="n1" id="n1"
				data-validation-rule="{number:true}" value="text"> 
			<button id="btn9-1" class="Button">.validate()</button>
			<button id="btn9-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{integer:true}" - 정수 입력 허용(+또는-가 붙어도 검증
			통과)</p>
		<div>
			<input class="Textinput" type="text" name="i1" id="i1"
				data-validation-rule="{integer:true}" value="text"> 
			<button id="btn10-1" class="Button">.validate()</button>
			<button id="btn10-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{alphabet:true}" - 영문자 알파벳 입력 허용</p>
		<div>
			<input class="Textinput" type="text" name="a1" id="a1"
				data-validation-rule="{alphabet:true}" value="텍스트"> 
			<button id="btn11-1" class="Button">.validate()</button>
			<button id="btn11-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{numalpha:true}" - 숫자와 영문자 알파벳 입력 허용</p>
		<div>
			<input class="Textinput" type="text" name="na1" id="na1"
				data-validation-rule="{numalpha:true}" value="텍스트"> 
			<button id="btn12-1" class="Button">.validate()</button>
			<button id="btn12-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{nospace:true}" - 빈칸(스페이스) 입력을 허용하지 않음</p>
		<div>
			<input class="Textinput" type="text" name="ns1" id="ns1"
				data-validation-rule="{nospace:true}" value="tex t"> 
			<button id="btn13-1" class="Button">.validate()</button>
			<button id="btn13-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{hangul:true}" - 한글 입력만 허용. 스페이스는 한글로
			인정하지 않음.</p>
		<div>
			<input class="Textinput" type="text" name="h1" id="h1"
				data-validation-rule="{hangul:true}" value="한글"> 
			<button id="btn14-1" class="Button">.validate()</button>
			<button id="btn14-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{numhan:true}" - 숫자와 한글 입력만 허용</p>
		<div>
			<input class="Textinput" type="text" name="nh1" id="nh1"
				data-validation-rule="{numhan:true}" value="한글123"> 
			<button id="btn15-1" class="Button">.validate()</button>
			<button id="btn15-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{email:true}" - 이메일 형식만 허용</p>
		<div>
			<input class="Textinput" type="text" name="em1" id="em1"
				data-validation-rule="{email:true}" value="hello@world.com"> 
			<button id="btn16-1" class="Button">.validate()</button>
			<button id="btn16-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{url:true}" - http, https등으로 시작하는 url형식만
			허용</p>
		<div>
			<input class="Textinput" type="text" name="url1" id="url1"
				data-validation-rule="{url:true}" value="http://ui.alopex.io">
			<button id="btn17-1" class="Button">.validate()</button>
			<button id="btn17-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{date:true}" - 날짜 형식만 허용(YYYY-MM-DD 또는
			YYYY/MM/DD)</p>
		<div>
			<input class="Textinput" type="text" name="da1" id="da1"
				data-validation-rule="{date:true}" value="2014-01-01"> 
			<button id="btn17-3" class="Button">.validate()</button>
			<button id="btn17-4" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{mindate:날짜,maxdate:날짜,daterange:[날짜,날짜]}"
			- 날짜의 최소/최대값 또는 범위를 지정</p>
		<div>
			<input class="Textinput" type="text" name="dr1" id="dr1"
				data-validation-rule="{mindate:'2014-01-01',maxdate:'2014-01-31',daterange:['2014-01-01','2014-01-31']}" value="2014-01-15"> 
			<button id="btn18-1" class="Button">.validate()</button> 
			<button id="btn18-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>
	
	<div class="sector">
		<p>data-validation-rule="{mindate:ID셀렉터,maxdate:ID셀렉터}" - 지정된 ID셀렉터의 input이 가지는 날짜 만큼을 최대/최소값으로 지정.
		아래의 예제는 서로 날짜를 추월하지 못하도록 설정한 예.</p>
		<div>
			from<input class="Textinput" type="text" name="dr2from" id="dr2from"
				data-validation-rule="{mindate:'2014-01-01',maxdate:'#dr2to'}"
				value="2014-01-19">
			to<input class="Textinput" type="text" name="dr2to" id="dr2to"
				data-validation-rule="{mindate:'#dr2from',maxdate:'2014-12-31'}"
				value="2014-01-13">
			<button id="btn19-1" class="Button">$(from).validate()</button>
			<button id="btn19-2" class="Button">$(from).getErrorMessage()</button>
			<button id="btn19-3" class="Button">$(to).validate()</button>
			<button id="btn19-4" class="Button">$(to).getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{oneof:[...]}" - 어레이에 지정한 값만 입력하도록 허용</p>
		<div>
			<input class="Textinput" type="text" name="oo1" id="oo1"
				data-validation-rule="{oneof:['A','B','C']}" value="D"> 
			<button id="btn20-1" class="Button">.validate()</button>
			<button id="btn20-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>

	<div class="sector">
		<p>data-validation-rule="{equalTo:값}" - 제시된 값과 동일해야 함. 아래 예시는
			'test'만 허용.</p>
		<div>
			<input class="Textinput" type="text" name="eq1" id="eq1"
				data-validation-rule="{equalTo:'test'}" value="test1"> 
			<button id="btn21-1" class="Button">.validate()</button>
			<button id="btn21-2" class="Button">.getErrorMessage()</button>
		</div>
	</div>
```
```
$('#btn1-1').click(function() {alert($('#required1').validate());});
$('#btn1-2').click(function() {alert($('#required1').getErrorMessage());});
$('#btn2-1').click(function() {alert($('#len1').validate());});
$('#btn2-2').click(function() {alert($('#len1').getErrorMessage());});
$('#btn3-1').click(function() {alert($('#len2').validate());});
$('#btn3-2').click(function() {alert($('#len2').getErrorMessage());});
$('#btn4-1').click(function() {alert($('#len3').validate());});
$('#btn4-2').click(function() {alert($('#len3').getErrorMessage());});
$('#btn5-1').click(function() {alert($('#len4').validate());});
$('#btn5-2').click(function() {alert($('#len4').getErrorMessage());});
$('#btn6-1').click(function() {alert($('#mm1').validate());});
$('#btn6-2').click(function() {alert($('#mm1').getErrorMessage());});
$('#btn7-1').click(function() {alert($('#dec1').validate());});
$('#btn7-2').click(function() {alert($('#dec1').getErrorMessage());});
$('#btn8-1').click(function() {alert($('#d1').validate());});
$('#btn8-2').click(function() {alert($('#d1').getErrorMessage());});
$('#btn9-1').click(function() {alert($('#n1').validate());});
$('#btn9-2').click(function() {alert($('#n1').getErrorMessage());});
$('#btn10-1').click(function() {alert($('#i1').validate());});
$('#btn10-2').click(function() {alert($('#i1').getErrorMessage());});
$('#btn11-1').click(function() {alert($('#a1').validate());});
$('#btn11-2').click(function() {alert($('#a1').getErrorMessage());});
$('#btn12-1').click(function() {alert($('#na1').validate());});
$('#btn12-2').click(function() {alert($('#na1').getErrorMessage());});
$('#btn13-1').click(function() {alert($('#ns1').validate());});
$('#btn13-2').click(function() {alert($('#ns1').getErrorMessage());});
$('#btn14-1').click(function() {alert($('#h1').validate());});
$('#btn14-2').click(function() {alert($('#h1').getErrorMessage());});
$('#btn15-1').click(function() {alert($('#nh1').validate());});
$('#btn15-2').click(function() {alert($('#nh1').getErrorMessage());});
$('#btn16-1').click(function() {alert($('#em1').validate());});
$('#btn16-2').click(function() {alert($('#em1').getErrorMessage());});
$('#btn17-1').click(function() {alert($('#url1').validate());});
$('#btn17-2').click(function() {alert($('#url1').getErrorMessage());});
$('#btn17-3').click(function() {alert($('#da1').validate());});
$('#btn17-4').click(function() {alert($('#da1').getErrorMessage());});
$('#btn18-1').click(function() {alert($('#dr1').validate());});
$('#btn18-2').click(function() {alert($('#dr1').getErrorMessage());});
$('#btn19-1').click(function() {alert($('#dr2from').validate());});
$('#btn19-2').click(function() {alert($('#dr2from').getErrorMessage());});
$('#btn19-3').click(function() {alert($('#dr2to').validate());});
$('#btn19-4').click(function() {alert($('#dr2to').getErrorMessage());});
$('#btn20-1').click(function() {alert($('#oo1').validate());});
$('#btn20-2').click(function() {alert($('#oo1').getErrorMessage());});
$('#btn21-1').click(function() {alert($('#eq1').validate());});
$('#btn21-2').click(function() {alert($('#eq1').getErrorMessage());});
```
</div>
<script>
      $('#btn1-1').click(function() {alert($('#required1').validate());});
      $('#btn1-2').click(function() {alert($('#required1').getErrorMessage());});
      $('#btn2-1').click(function() {alert($('#len1').validate());});
      $('#btn2-2').click(function() {alert($('#len1').getErrorMessage());});
      $('#btn3-1').click(function() {alert($('#len2').validate());});
      $('#btn3-2').click(function() {alert($('#len2').getErrorMessage());});
      $('#btn4-1').click(function() {alert($('#len3').validate());});
      $('#btn4-2').click(function() {alert($('#len3').getErrorMessage());});
      $('#btn5-1').click(function() {alert($('#len4').validate());});
      $('#btn5-2').click(function() {alert($('#len4').getErrorMessage());});
      $('#btn6-1').click(function() {alert($('#mm1').validate());});
      $('#btn6-2').click(function() {alert($('#mm1').getErrorMessage());});
      $('#btn7-1').click(function() {alert($('#dec1').validate());});
      $('#btn7-2').click(function() {alert($('#dec1').getErrorMessage());});
      $('#btn8-1').click(function() {alert($('#d1').validate());});
      $('#btn8-2').click(function() {alert($('#d1').getErrorMessage());});
      $('#btn9-1').click(function() {alert($('#n1').validate());});
      $('#btn9-2').click(function() {alert($('#n1').getErrorMessage());});
      $('#btn10-1').click(function() {alert($('#i1').validate());});
      $('#btn10-2').click(function() {alert($('#i1').getErrorMessage());});
      $('#btn11-1').click(function() {alert($('#a1').validate());});
      $('#btn11-2').click(function() {alert($('#a1').getErrorMessage());});
      $('#btn12-1').click(function() {alert($('#na1').validate());});
      $('#btn12-2').click(function() {alert($('#na1').getErrorMessage());});
      $('#btn13-1').click(function() {alert($('#ns1').validate());});
      $('#btn13-2').click(function() {alert($('#ns1').getErrorMessage());});
      $('#btn14-1').click(function() {alert($('#h1').validate());});
      $('#btn14-2').click(function() {alert($('#h1').getErrorMessage());});
      $('#btn15-1').click(function() {alert($('#nh1').validate());});
      $('#btn15-2').click(function() {alert($('#nh1').getErrorMessage());});
      $('#btn16-1').click(function() {alert($('#em1').validate());});
      $('#btn16-2').click(function() {alert($('#em1').getErrorMessage());});
      $('#btn17-1').click(function() {alert($('#url1').validate());});
      $('#btn17-2').click(function() {alert($('#url1').getErrorMessage());});
      $('#btn17-3').click(function() {alert($('#da1').validate());});
      $('#btn17-4').click(function() {alert($('#da1').getErrorMessage());});
      $('#btn18-1').click(function() {alert($('#dr1').validate());});
      $('#btn18-2').click(function() {alert($('#dr1').getErrorMessage());});
      $('#btn19-1').click(function() {alert($('#dr2from').validate());});
      $('#btn19-2').click(function() {alert($('#dr2from').getErrorMessage());});
      $('#btn19-3').click(function() {alert($('#dr2to').validate());});
      $('#btn19-4').click(function() {alert($('#dr2to').getErrorMessage());});
      $('#btn20-1').click(function() {alert($('#oo1').validate());});
      $('#btn20-2').click(function() {alert($('#oo1').getErrorMessage());});
      $('#btn21-1').click(function() {alert($('#eq1').validate());});
      $('#btn21-2').click(function() {alert($('#eq1').getErrorMessage());});
</script>


### Custom Submit Handler (anchor & focus)

Submit handler를 별도로 개발하여 화면 영역에 link를 포함하는 에러메세지를 만들고, a태그 클릭에 의해 포커스가 이동하는 예제 입니다.   
input/select/textarea는 이때 반드시 id attribute를 가지고 있어야 합니다.



<style>
.error {
    color:red;
}
.errorpanel {
    background-color : #fbe3e4;
    border:1px solid #fbc2c4;
    max-width:600px;
    padding-top:1em;
    padding-bottom:1em;
    padding-left:2em;
    padding-right:2em;
}
</style>

<div class="eg">
<div class="egview">
<div id="errorpanel" class="errorpanel" style="display:none;"></div>
<form id="form9">
    <div>
        <span>User ID</span>
        <input class="Textinput" type="text" name="userid" id="userid" 
            data-validation-rule="{ required:true , minlength : 4, maxlength : 8, nospace : true }"
            data-alias="사용자 아이디">
        <span class="error" data-for="userid"></span>
    </div>
    <div>
        <span>관심분야 사용여부</span>
        <input class="Checkbox" type="checkbox" id="sub" name="sub" data-alias="관심분야 사용여부">
    </div>
    <div>
        <span>관심분야 2개이상 선택.</span>
        <input class="Checkbox" type="checkbox" name="topic" id="topicA" value="A" 
            data-validation-rule="{required : '#sub', minlength:2}"
            data-validation-message="{minlength:'{attr:data-alias}를 사용할 경우 {0}개 이상 관심분야를 선택해 주십시오.'}"
            data-alias="관심분야">
        <input class="Checkbox" type="checkbox" name="topic" id="topicB" value="B">
        <input class="Checkbox" type="checkbox" name="topic" id="topicC" value="C">
        <input class="Checkbox" type="checkbox" name="topic" id="topicD" value="D">
        <span class="error" data-for="topicA"></span>
    </div>
    <div>
        <input id="form9_submit" type="submit" class="Button" data-alias="제출">
    </div>
</form>
</div>
```
<form id="form9">
    <div>
        <span>User ID</span>
        <input class="Textinput" type="text" name="userid" id="userid" 
            data-validation-rule="{ required:true , minlength : 4, maxlength : 8, nospace : true }"
            data-alias="사용자 아이디">
        <span class="error" data-for="userid"></span>
    </div>
    <div>
        <span>관심분야 사용여부</span>
        <input class="Checkbox" type="checkbox" id="sub" name="sub" data-alias="관심분야 사용여부">
    </div>
    <div>
        <span>관심분야 2개이상 선택.</span>
        <input class="Checkbox" type="checkbox" name="topic" id="topicA" value="A" 
            data-validation-rule="{required : '#sub', minlength:2}"
            data-validation-message="{minlength:'{attr:data-alias}를 사용할 경우 {0}개 이상 관심분야를 선택해 주십시오.'}"
            data-alias="관심분야">
        <input class="Checkbox" type="checkbox" name="topic" id="topicB" value="B">
        <input class="Checkbox" type="checkbox" name="topic" id="topicC" value="C">
        <input class="Checkbox" type="checkbox" name="topic" id="topicD" value="D">
        <span class="error" data-for="topicA"></span>
    </div>
    <div>
        <input id="form9_submit" type="submit" class="Button" data-alias="제출">
    </div>
</form>
```
```
$(document).ready(function(){
    $('#form9').validator({option : {
        onsubmit : true,
        submitHandler : function(event) {
            var result = $(this).validate();
            if(result) {
                //검증에 성공했을 경우 submit 진행
                $('#errorpanel').hide();
                return;
            }
            //검증 실패시 에러메세지를 가져와서 출력할 수 있는 형태로 만든다.
            var emsg = $(this).validator().getErrorMessage();
            var tags = '';
            tags += '<h3>검증 과정에서 에러가 발생하였습니다.</h3>';
            tags += '<p>다음 내용을 확인해 주십시오.</p>';
            tags += '<ul>';
            for(var prop in emsg) {
                var elem = $(this).find('[name="'+prop+'"]');
                var id = elem.attr('id');
                var str = '<li>';
                str += '<a href="#'+id+'">';
                str += elem.attr('data-alias');
                str += ' : '
                str += emsg[prop].join(' ');
                str += '</a>'
                str += '</li>';
                tags += str;
            }
            tags += '</ul>';
            $('#errorpanel').show().html(tags);
            $('#errorpanel a').click(function(){
                $($(this).attr('href')).focus();
                return false;
            });
            $('#errorpanel a:first').focus();
            event.preventDefault();
            return false;
        }
    }});
});
```
```
<style>
.error {
    color:red;
}
.errorpanel {
    background-color : #fbe3e4;
    border:1px solid #fbc2c4;
    max-width:600px;
    padding-top:1em;
    padding-bottom:1em;
    padding-left:2em;
    padding-right:2em;
}
</style>
```
</div>
<script>
    $(document).ready(function(){
        $('#form9').validator({option : {
            onsubmit : true,
            submitHandler : function(event) {
                var result = $(this).validate();
                if(result) {
                    //검증에 성공했을 경우 submit 진행
                    $('#errorpanel').hide();
                    return;
                }
                //검증 실패시 에러메세지를 가져와서 출력할 수 있는 형태로 만든다.
                var emsg = $(this).validator().getErrorMessage();
                var tags = '';
                tags += '<h3>검증 과정에서 에러가 발생하였습니다.</h3>';
                tags += '<p>다음 내용을 확인해 주십시오.</p>';
                tags += '<ul>';
                for(var prop in emsg) {
                    var elem = $(this).find('[name="'+prop+'"]');
                    var id = elem.attr('id');
                    var str = '<li>';
                    str += '<a href="#'+id+'">';
                    str += elem.attr('data-alias');
                    str += ' : '
                    str += emsg[prop].join(' ');
                    str += '</a>'
                    str += '</li>';
                    tags += str;
                }
                tags += '</ul>';
                $('#errorpanel').show().html(tags);
                $('#errorpanel a').click(function(){
                    $($(this).attr('href')).focus();
                    return false;
                });
                $('#errorpanel a:first').focus();
                event.preventDefault();
                return false;
            }
        }});
    });
</script>




