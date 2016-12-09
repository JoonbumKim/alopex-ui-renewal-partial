

# CheckBox

## Basic

### 기본 체크박스
체크박스는 사용자가 선택 사항에서 여러 개의 아이템을 선택할 수 있게 합니다. 
체크박스의 상태는 체크된 상태와 체크 해제된 상태, indeterminate 상태(tree 구조에서 사용)가 존재합니다.


체크박스 사용 시 레이블(label) 엘리먼트 클릭 시 해당 체크박스 인풋이 체크되도록 하기 위해, 일반적으로 id 속성과 for 속성을 활용하지만, 

다음과 같이 마크업을 구성하면 해 속성을 사용하지 않아도 됩니다.

<div class="eg">
<div class="egview">
<label id="checkTest01">
	<input class="Checkbox" type="checkbox" name="chk0" value = "check1" checked="checked">
	Check1
</label>
<label id="checkTest02">
	<input class="Checkbox" type="checkbox" name="chk0" value = "check2">
	Check2
</label>
<label>
	<input class="Checkbox" type="checkbox" name="chk0" value = "check3">
	Check3
</label>
</div>

```
<label id="checkTest01">
	<input class="Checkbox" type="checkbox" name="chk0" value = "check1" checked="checked">
	Check1
</label>
<label id="checkTest02">
	<input class="Checkbox" type="checkbox" name="chk0" value = "check2">
	Check2
</label>
<label>
	<input class="Checkbox" type="checkbox" name="chk0" value = "check3">
	Check3
</label>

```
</div>

### 이미지 체크박스

체크박스에 이미지 파일을 이용하여 스타일을 하고자 하는 경우, 아래와 같이 label에 스타일을 적용할 수 있습니다.

<div class="eg">
<div class="egview">
<label class="ImageCheckbox" id="checkTest03">
	<input class="Checkbox" type="checkbox" name="chk1" value = "check1" checked="checked">
	Check1
</label>
<label class="ImageCheckbox" id="checkTest04">
	<input class="Checkbox" type="checkbox" name="chk1" value = "check2">
	Check2
</label>
<label class="ImageCheckbox">
	<input class="Checkbox" type="checkbox" name="chk1" value = "check3">
	Check3
</label>
</div>

```
<label class="ImageCheckbox" id="checkTest03">
	<input class="Checkbox" type="checkbox" name="chk1" value = "check1" checked="checked">
	Check1
</label>
<label class="ImageCheckbox" id="checkTest04">
	<input class="Checkbox" type="checkbox" name="chk1" value = "check2">
	Check2
</label>
<label class="ImageCheckbox">
	<input class="Checkbox" type="checkbox" name="chk1" value = "check3">
	Check3
</label>
```

<br>
위 markup에 대한 스타일은 아래와 같이 정의합니다.  
아래 스타일은 크로스 브라우징 처리는 되지 않습니다.(IE8에서는 이미지체크박스가 적용되지 않습니다)

```
.ImageCheckbox {
  position: relative;
}
.ImageCheckbox:after {
  content: '';
  position: absolute;
  left: 4px;
  left: 0px \0/IE8;
  top: 48%;
  width: 13px;
  height: 13px;
  margin-top: -5px;
  background: url("./images/component_default.png") no-repeat 0px -72px;
}
.ImageCheckbox.Checked:after {
  background: url("./images/component_default.png") no-repeat -48px -72px;
}
.ImageCheckbox > .Checkbox {
  _noFocusLine: expression(this.hideFocus = true);
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: alpha(opacity=0);
  -khtml-opacity: 0;
  -moz-opacity: 0;
  opacity: 0;
}
.ImageCheckbox > .Checkbox.Disabled:after {
  background: url("./images/component_default.png") no-repeat -96px -72px;
}
```
</div>
 
## Attributes
 

### data-disabled
- "true"
	-  마크업으로 체크박스 버튼을 비활성화
	
<div class="eg">
<div class="egview">
<label id="checkTest05">
	<input class="Checkbox" type="checkbox" data-disabled="true" name="chk2" value="check1">
	Disabled Checkbox
</label>

<label class="ImageCheckbox" id="checkTest06">
    <input class="Checkbox" type="checkbox" data-disabled="true" name="chk1" value = "check1">
    Disabled Image Checkbox
</label>
</div>
```
<label id="checkTest05">
	<input class="Checkbox" type="checkbox" data-disabled="true" name="chk2" value="check1">
	Disabled Checkbox
</label>

<label class="ImageCheckbox" id="checkTest06">
    <input class="Checkbox" type="checkbox" data-disabled="true" name="chk1" value = "check1">
    Disabled Image Checkbox
</label>
```
</div>

### type
- "checkbox"
	- IE8에서는 필수적으로 명시되어야 하는 속성입니다.그 외 브라우저에서는 필요치 않습니다.

<div class="eg">
<div class="egview">
<label>
	<input class="Checkbox" type="checkbox" name="chk3" value="check1" checked="checked" id="checkTest07">
	IE8 checkbox 
</label>
</div>	
```
<label>
	<input class="Checkbox" type="checkbox" name="chk3" value="check1" checked="checked" id="checkTest07">
	IE8 checkbox 
</label>
```
</div>

## Functions


### .setChecked (isChecked)

체크박스버튼의 체크/비체크를 동적으로 조정할 때 사용하는 함수입니다.

- parameter
	- isChecked {Boolean} Required  
		- 설정된 값에 의해서 체크박스가 체크/체크해제 됩니다.
		
<div class="eg">
<div class="egview">
<label>
	<input id="checkbox1" class="Checkbox" type="checkbox" name="chk4" value="check1">
	CHECKBOX 
</label>		
<button id="btn_setCheckedTrue" class="Button">setChecked(true)</button>
<button id="btn_setCheckedFalse" class="Button">setChecked(false)</button>
</div>
```
<label>
	<input id="checkbox1" class="Checkbox" type="checkbox" name="chk4" value="check1">
	CHECKBOX 
</label>		
<button id="btn_setCheckedTrue" class="Button">setChecked(true)</button>
<button id="btn_setCheckedFalse" class="Button">setChecked(false)</button>
```
```
$("#btn_setCheckedTrue").on("click", function (){
	   $("#checkbox1").setChecked(true);
});
$("#btn_setCheckedFalse").on("click", function (){
	   $("#checkbox1").setChecked(false);
});
```
</div>

<script>
$("#btn_setCheckedTrue").on("click", function (){
   $("#checkbox1").setChecked(true);
});
$("#btn_setCheckedFalse").on("click", function (){
   $("#checkbox1").setChecked(false);
});
</script>

### .setCheckAll(isCheckAll)

체크박스 마크업 속성 중 name이 동일한 모든 체크박스의 전체 체크/전체 체크해제 상태를 제어할 때 사용하는 함수입니다.

- parameter
	- isCheckAll {Boolean} Optional
		- 설정된 Boolean 값에 의해 체크박스 버튼이 전체 체크/전체 체크해제됩니다.
		
<div class="eg">
<div class="egview">
<label>
	<input class="Checkbox" type="checkbox" name="chk5" value="check1" id="checkTest08">
	CHECKBOX1 
</label>
<label>
	<input class="Checkbox" type="checkbox" name="chk5" value="check2" id="checkTest09">
	CHECKBOX2 
</label>
<label>
	<input class="Checkbox" type="checkbox" name="chk5" value="check3" id="checkTest10">
	CHECKBOX3 
</label><br>		
<button id="btn_setCheckedAllTrue" class="Button">setCheckedAll(true)</button>
<button id="btn_setCheckedAllFalse" class="Button">setCheckedAll(false)</button>
</div>
```
<label>
	<input class="Checkbox" type="checkbox" name="chk5" value="check1" id="checkTest08">
	CHECKBOX1 
</label>
<label>
	<input class="Checkbox" type="checkbox" name="chk5" value="check2" id="checkTest09">
	CHECKBOX2 
</label>
<label>
	<input class="Checkbox" type="checkbox" name="chk5" value="check3" id="checkTest10">
	CHECKBOX3 
</label><br>		
<button id="btn_setCheckedAllTrue" class="Button">setCheckedAll(true)</button>
<button id="btn_setCheckedAllFalse" class="Button">setCheckedAll(false)</button>
```
```
$("#btn_setCheckedAllTrue").on("click", function (){	
	$("[name='chk5']").setCheckAll(true);
});
$("#btn_setCheckedAllFalse").on("click", function (){	
	$("[name='chk5']").setCheckAll(false);
});
```
</div>	

<script>
$("#btn_setCheckedAllTrue").on("click", function (){	
	$("[name='chk5']").setCheckAll(true);
});
$("#btn_setCheckedAllFalse").on("click", function (){	
	$("[name='chk5']").setCheckAll(false);
});
</script>

### .setEnabled(isEnabled)

체크박스의 활성화/비활성화를 동적으로 조정할 때 사용하는 함수입니다.

- parameter
	- isEnabled {Boolean} Required 
		- 설정된 Boolean값에 의해서 체크박스버튼이 활성화/비활성화 됩니다.

<div class="eg">
<div class="egview">
<label>
<input id="checkbox2" class="Checkbox" type="checkbox" name="chk6" value="check1">
CHECKBOX 
</label>		
<button id="btn_setEnabled" class="Button Toggle" data-on="setEnabled(true)" data-off="setEnabled(false)">setEnabled</button>
</div>
```
<label>
	<input id="checkbox2" class="Checkbox" type="checkbox" name="chk6" value="check1">
	CHECKBOX 
</label>		
<button id="btn_setEnabled" class="Button Toggle" data-on="setEnabled(true)" data-off="setEnabled(false)">setEnabled</button>
```
```
$("#btn_setEnabled").on("click", function (){
	if ($("#checkbox2").hasClass("Disabled")) {
	   $("#checkbox2").setEnabled(true);
	} else {
	   $("#checkbox2").setEnabled(false);
	}
});
```
</div>

<script>
$("#btn_setEnabled").on("click", function (){
	if ($("#checkbox2").hasClass("Disabled")) {
	   $("#checkbox2").setEnabled(true);
	} else {
	   $("#checkbox2").setEnabled(false);
	}
});
</script>		

### .setValues(values)

value값들을 통해 체크박스를 선택하는 함수입니다.

- parameter
	- values {array} Required 
		- values 내의 값과 같은 value를 가지고 있는 체크박스를 선택합니다.
		
<div class="eg">
<div class="egview">
<label>
	<input id="chk_setValues" class="Checkbox" type="checkbox" name="chk7" value="check1">
	CHECKBOX1 
</label>
<label>
	<input id="chk_setValues2" class="Checkbox" type="checkbox" name="chk7" value="check2">
	CHECKBOX2 
</label>
<label>
	<input id="chk_setValues3" class="Checkbox" type="checkbox" name="chk7" value="check3">
	CHECKBOX3 
</label><br>		
<button id="btn_setValues" class="Button">setValues(['check1', 'check2'])</button>
</div>
```
<label>
	<input id="chk_setValues" class="Checkbox" type="checkbox" name="chk7" value="check1">
	CHECKBOX1 
</label>
<label>
	<input id="chk_setValues2" class="Checkbox" type="checkbox" name="chk7" value="check2">
	CHECKBOX2 
</label>
<label>
	<input id="chk_setValues3" class="Checkbox" type="checkbox" name="chk7" value="check3">
	CHECKBOX3 
</label><br>		
<button id="btn_setValues" class="Button">setValues(['check1', 'check2'])</button>
```
```
$("#btn_setValues").on("click", function (){	
	$('#chk_setValues').setValues(['check1', 'check2']);
});	
```
</div>

<script>
$("#btn_setValues").on("click", function (){	
	$('#chk_setValues').setValues(['check1', 'check2']);
});	
</script>

### .toggle()

같은 `name`으로 묶인 체크박스 컴포넌트를 `toggle`할때 사용하는 함수입니다.<br>
체크박스 중  한  id에 적용합니다. 

<div class="eg">
<div class="egview">
<label>
	<input class="Checkbox" id="chkId1" type="checkbox" name="checkGroup" value="check1" checked="checked">
	CHECKBOX1 
</label>
<label>
	<input class="Checkbox" id="chkId2" type="checkbox" name="checkGroup" value="check2">
	CHECKBOX2 
</label>
<label>
	<input class="Checkbox" id="chkId3" type="checkbox" name="checkGroup" value="check3">
	CHECKBOX3 
</label>
<label>
	<input class="Checkbox" id="chkId4" type="checkbox" name="checkGroup" value="check4">
	CHECKBOX4 
</label>
<br>		
<button id="btn_toggle" class="Button">toggle()</button>
</div>
```
<label>
	<input class="Checkbox" id="chkId1" type="checkbox" name="checkGroup" value="check1" checked="checked">
	CHECKBOX1 
</label>
<label>
	<input class="Checkbox" id="chkId2" type="checkbox" name="checkGroup" value="check2">
	CHECKBOX2 
</label>
<label>
	<input class="Checkbox" id="chkId3" type="checkbox" name="checkGroup" value="check3">
	CHECKBOX3 
</label>
<label>
	<input class="Checkbox" id="chkId4" type="checkbox" name="checkGroup" value="check4">
	CHECKBOX4 
</label>
<br>		
<button id="btn_toggle" class="Button">toggle()</button>
```
```
$("#btn_toggle").on("click", function (){	
	$("#chkId1").toggle(); //#chkId2, #chkId3, #chkId4 에 해도 무관
});

```
</div>

<script>
$("#btn_toggle").on("click", function (){	
	$("#chkId1").toggle(); //#chkId2, #chkId3, #chkId4 에 해도 무관
});
</script>

### .getValues()

선택된 모든 체크박스의 value를 가져오는 함수입니다.
체크박스 중  한  id에 적용합니다. 

- return 
	- Values {array}
		- 선택된 아이템 Value 배열을 반환합니다.


### .getTexts()

선택된 체크박스의 텍스트를 가져오는 함수입니다.
체크박스 중  한  id에 적용합니다. 

- return 
	- Text {array}
		- 선택한 아이템의 Text 베열을 반환합니다.

<div class="eg">
<div class="egview">
<label>
<input class="Checkbox" id="chkId5" type="checkbox" name="chkGroup" value="apple" checked="checked">
Apple
</label>
<label>
<input class="Checkbox" id="chkId6" type="checkbox" name="chkGroup" value="banana">
Banana
</label>
<label>
<input class="Checkbox" id="chkId7" type="checkbox" name="chkGroup" value="cherry">
Cherry 
</label>
<label>
<input class="Checkbox" id="chkId8" type="checkbox" name="chkGroup" value="grape">
Grape
</label>
<br>		
<button id="btn_getValues" class="Button">getValues()</button>
<button id="btn_getTexts" class="Button">getTexts()</button>
<span id="span1"></span>
</div>
```
<label>
	<input class="Checkbox" id="chkId5" type="checkbox" name="chkGroup" value="apple" checked="checked">
	Apple 
</label>
<label>
	<input class="Checkbox" id="chkId6" type="checkbox" name="chkGroup" value="banana">
	Banana 
</label>
<label>
	<input class="Checkbox" id="chkId7" type="checkbox" name="chkGroup" value="cherry">
	Cherry 
</label>
<label>
	<input class="Checkbox" id="chkId8" type="checkbox" name="chkGroup" value="grape">
	Grape
</label>
<br>		
<button id="btn_getValues" class="Button">getValues()</button>
<button id="btn_getTexts" class="Button">getTexts()</button>
<span id="span1"></span>
```

```
$("#btn_getValues").on("click", function (){	
	var val = $('#chkId5').getValues();
		$('#span1').text(val);
});

$("#btn_getTexts").on("click", function (){	
	var val = $('#chkId5').getTexts();
		$('#span1').text(val);
});

```
</div>

<script>
$("#btn_getValues").on("click", function (){	
	var val = $('#chkId5').getValues();
		$('#span1').text(val);
});

$("#btn_getTexts").on("click", function (){	
	var val = $('#chkId5').getTexts();
		$('#span1').text(val);
});
</script>
