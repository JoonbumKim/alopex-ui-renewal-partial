

# Radio

## Basic


### 기본 라디오버튼
전체 중 하나만 선택 가능한 Radio 컴포넌트입니다.`class="Radio"`

<div class="eg">
<div class="egview">
	<label>
        <input class="Radio" type="radio" name="radio2" value="value1">Radio1
    </label>
    <label>
        <input class="Radio" type="radio" name="radio2" value="value2">Radio2
    </label>
    <label>
        <input class="Radio" type="radio" name="radio2" value="value3">Radio3
    </label>
    <label>
        <input class="Radio" type="radio" name="radio2" value="value4">Radio4
    </label>
</div>
```
<label>
    <input class="Radio" type="radio" name="radio2" value="value1">Radio1
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value2">Radio2
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value3">Radio3
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value4">Radio4
</label>
```
</div>

### 이미지 라디오버튼
라디오 버튼에 이미지 파일을 이용하여 스타일을 하고자 하는 경우  아래와 같이 `class="ImageRadio"` 속성을 추가해 줍니다.
<div class="eg">
<div class="egview">
<label class="ImageRadio">
    <input class="Radio" name="radio2" value="value1">radio1
</label>
<label class="ImageRadio">
    <input class="Radio" name="radio2" value="value2">Radio2
</label>
<label class="ImageRadio">
    <input class="Radio" name="radio2" value="value3">Radio3
</label>
<label class="ImageRadio">
    <input class="Radio" name="radio2" value="value4">Radio4
</label>
</div>
```
<label class="ImageRadio">
    <input class="Radio" name="radio2" value="value1">radio1
</label>
<label class="ImageRadio">
    <input class="Radio" name="radio2" value="value2">Radio2
</label>
<label class="ImageRadio">
    <input class="Radio" name="radio2" value="value3">Radio3
</label>
<label class="ImageRadio">
    <input class="Radio" name="radio2" value="value4">Radio4
</label>

```
</div>
 
## Attributes
 

### data-disabled
- "true"
	- 마크업으로 라디오 버튼을 비활성화 시킬 때 다음과 같이 선언하여 사용합니다.
<div class="eg">
<div class="egview">
	<label>
    	<input class="Radio" type="radio" name="radio2" value="value1">Enabled Radio
	</label>
	<label>
    	<input class="Radio" type="radio" data-disabled="true" name="radio2" value="value1">Disabled Radio
	</label>
	
	<label class="ImageRadio Margin-left-20">
    		<input class="Radio" name="radio2" value="value1">Enabled Image Radio
	</label>
	<label class="ImageRadio">
    		<input class="Radio" data-disabled="true" name="radio2" value="value1">Disabled Image Radio
	</label>
</div>	
```
	<label>
    	<input class="Radio" type="radio" name="radio2" value="value1">Enabled Radio
	</label>
	<label>
    	<input class="Radio" type="radio" data-disabled="true" name="radio2" value="value1">Disabled Radio
	</label>
	
	<label class="ImageRadio Margin-left-20">
    	<input class="Radio" name="radio2" value="value1">Enabled Image Radio
	</label>
	<label class="ImageRadio">
    	<input class="Radio" data-disabled="true" name="radio2" value="value1">Disabled Image Radio
	</label>
```
</div>

### type
- "radio"
	- IE8에서는 필수적으로 명시되어야 하는 속성입니다.그 외 브라우저에서는 필요치 않습니다.
	
```
 <input class="Radio" type="radio" name="radio2" value="value1">
```
## Functions

### .setEnabled (isEnabled)

라디오 버튼의 활성화/비활성화를 제어할 때 사용하는 함수입니다

- parameter
	- isEnabled {Boolean} Required  
		- 설정된 Boolean 값에 의해서 라디오 버튼이 활성화/비활성화됩니다.
`id="radio_enb"`
<div class="eg">
<div class="egview">
<label>
    <input id="radio_enb" class="Radio" type="radio" name="radio_nm" value="value1" checked="checked">Radio1
</label>
<label>
    <input class="Radio" type="radio" name="radio_nm" value="value2">Radio2
</label>
<label>
    <input class="Radio" type="radio" name="radio_nm" value="value3">Radio3
</label>
<label>
    <input class="Radio" type="radio" name="radio_nm" value="value4">Radio4
</label><br>
<button id="btn_setEnabledTrue" class="Button">setEnabled(true)</button>
<button id="btn_setEnabledFalse" class="Button">setEnabled(false)</button>
<button id="btn_setEnabledAllTrue" class="Button">setEnabledAll(true)</button>
<button id="btn_setEnabledAllFalse" class="Button">setEnabledAll(false)</button>
</div>
```
<label>
    <input id="radio_enb" class="Radio" type="radio" name="radio_nm" value="value1" checked="checked">Radio1
</label>
<label>
    <input class="Radio" type="radio" name="radio_nm" value="value2">Radio2
</label>
<label>
    <input class="Radio" type="radio" name="radio_nm" value="value3">Radio3
</label>
<label>
    <input class="Radio" type="radio" name="radio_nm" value="value4">Radio4
</label><br>
<button id="btn_setEnabledTrue" class="Button">setEnabled(true)</button>
<button id="btn_setEnabledFalse" class="Button">setEnabled(false)</button>
<button id="btn_setEnabledAllTrue" class="Button">setEnabledAll(true)</button>
<button id="btn_setEnabledAllFalse" class="Button">setEnabledAll(false)</button>
```
```
$("#btn_setEnabledTrue").on("click", function (){
	$("#radio_enb").setEnabled(true);
});

$("#btn_setEnabledFalse").on("click", function (){
	$("#radio_enb").setEnabled(false);
});

$("#btn_setEnabledAllTrue").on("click", function (){
	$("[name='radio_nm']").setEnabled(true);
});

$("#btn_setEnabledAllFalse").on("click", function (){
	$("[name='radio_nm']").setEnabled(false);
});
```
</div>	

<script>
$("#btn_setEnabledTrue").on("click", function (){
	$("#radio_enb").setEnabled(true);
});

$("#btn_setEnabledFalse").on("click", function (){
	$("#radio_enb").setEnabled(false);
});

$("#btn_setEnabledAllTrue").on("click", function (){
	$("[name='radio_nm']").setEnabled(true);
});

$("#btn_setEnabledAllFalse").on("click", function (){
	$("[name='radio_nm']").setEnabled(false);
});
</script>	

### .setSelected()

라디오 버튼의 선택/미선택 상태를 제어할 때 사용하는 함수입니다.
<div class="eg">
<div class="egview">
<label>
    <input id="radio_1" class="Radio" type="radio" name="radio_ss" value="value1" checked="checked">Radio1
</label>
<label>
    <input id="radio_2" class="Radio" type="radio" name="radio_ss" value="value2">Radio2
</label>
<label>
    <input id="radio_3" class="Radio" type="radio" name="radio_ss" value="value3">Radio3
</label>
<button id="btn_setSelected" class="Button">setSelected()</button>
</div>
```
<label>
    <input id="radio_1" class="Radio" type="radio" name="radio_ss" value="value1" checked="checked">Radio1
</label>
<label>
    <input id="radio_2" class="Radio" type="radio" name="radio_ss" value="value2">Radio2
</label>
<label>
    <input id="radio_3" class="Radio" type="radio" name="radio_ss" value="value3">Radio3
</label>
<button id="btn_setSelected" class="Button">setSelected()</button>
```
```
$("#btn_setSelected").on("click", function (){
	$("#radio_1").setSelected();
});
```
</div>

<script>
$("#btn_setSelected").on("click", function (){
	$("#radio_1").setSelected();
});
</script>

### .getValue()

라디오 버튼의 Value를 가져올 때 사용하는 함수입니다.

- return 
	- value {string}
		- 선택된 라디오 버튼의 Value


### .getText()

라디오 버튼의 label 텍스트를 가져올 때 사용하는 함수입니다.

- return 
	- text {string}
		- 선택된 라디오 버튼의 label 텍스트

<div class="eg">
<div class="egview">
<label>
    <input id="radio1" class="Radio" type="radio" name="radio2" value="value1" checked="checked">Radio1
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value2">Radio2
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value3">Radio3
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value4">Radio4
</label>
<br>
<span id="span1"></span>		
<button id="btn_getValue" class="Button">getValue()</button>
<button id="btn_getText" class="Button">getText()</button>
</div>
```
<label>
    <input id="radio1" class="Radio" type="radio" name="radio2" value="value1" checked="checked">Radio1
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value2">Radio2
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value3">Radio3
</label>
<label>
    <input class="Radio" type="radio" name="radio2" value="value4">Radio4
</label>
<br>
<span id="span1"></span>		
<button id="btn_getValue" class="Button">getValue()</button>
<button id="btn_getText" class="Button">getText()</button>
```
```
$("#btn_getValue").on("click", function (){	
	var val = $("#radio1").getValue();
	$("#span1").text(val);
});

$("#btn_getText").on("click", function (){	
	var val = $("#radio1").getText();
	$("#span1").text(val);
});

```
</div>

<script>
$("#btn_getValue").on("click", function (){	
	var val = $("#radio1").getValue();
	$("#span1").text(val);
});

$("#btn_getText").on("click", function (){	
	var val = $("#radio1").getText();
	$("#span1").text(val);
});
</script>