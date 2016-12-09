# Button

## Basic

Button 컴포넌트 입니다.
사용 가능한 HTML element 목록: &lt;button&gt; &lt;a&gt; &lt;input&gt;

<div class="eg">
<div class="egview">
	<button class="Button">Button Tag로 된 Button</button>
    <a class="Button">a Tag로 된 Button</a>
    <input class="Button" value="input Tag로 된 Button">
</div>

```
	<button class="Button">Button Tag로 된 Button</button>
    <a class="Button">a Tag로 된 Button</a>
    <input class="Button" value="input Tag로 된 Button">
```
</div>


## Attributes
 
### toggle

`class="Button Toggle"` 속성을 추가하면 버튼을 체크박스처럼 사용할 수 있습니다.
<div class="eg">
<div class="egview">
	<button class="Button Toggle" id="buttonTest01">Button</button>
</div>
```
<button class="Button Toggle" id="buttonTest01">Button</button>
```
</div>

### data-on / data-off

Toggle과 함께  `data-on="on시 텍스트"`, `data-off="off시 텍스트"` 속성을 추가하면  'on/off'시 버튼의 텍스트 를 지정할 수 있습니다.<br>
(&lt;button&gt; 태그 사이에 적은  버튼명은 무시됩니다.)

<div class="eg">
<div class="egview">
	<button class="Button Toggle" data-on="ON" data-off="OFF" id="buttonTest02">Button</button>
</div>
```
<button class="Button Toggle" data-on="ON" data-off="OFF" id="buttonTest02">Button</button>
```
</div>

### data-disabled

- “true”
	-  마크업으로 버튼을 비활성화
<div class="eg">
<div class="egview">
	<button class="Button" data-disabled="true" id="buttonTest03">Button</button>
</div>
```
<button class="Button" data-disabled="true" id="buttonTest03">Button</button>
```
</div>



### type 

- "button"
	- IE8에서는 필수적으로 명시되어야 하는 속성입니다.그 외 브라우저에서는 필요치 않습니다.
<div class="eg">
<div class="egview">
	<button class="Button" type="button" id="buttonTest04">IE8 Button</button>
</div>	
```
<button class="Button" type="button" id="buttonTest04">IE8 Button</button>
```
</div>


## Functions


### .setEnabled (isEnabled)

버튼의 활성화/비활성화를 동적으로 조정할 때 사용하는 함수입니다.

- parameter
	- isEnabled {Boolean} Required  
		- 설정된 값에 의해서 버튼이 활성화/비활성화 됩니다.
<div class="eg">
<div class="egview">
	<button id="button1" class="Button">Button</button>
	<button id="btn_setEnabled" class="Button Toggle" data-on="setEnabled(true)" data-off="setEnabled(false)">setEnabled</button>	
</div>
```
<button id="button1" class="Button">Button</button>
<button id="btn_setEnabled" class="Button Toggle" data-on="setEnabled(true)" data-off="setEnabled(false)">setEnabled</button>
```
```
$("#btn_setEnabled").on("click", function (){
	if ($("#button1").hasClass("Disabled")) {
	   $("#button1").setEnabled(true);
	} else {
	   $("#button1").setEnabled(false);
	}
});
	
```
</div>
<script>
$("#btn_setEnabled").on("click", function (){
	if ($("#button1").hasClass("Disabled")) {
	   $("#button1").setEnabled(true);
	} else {
	   $("#button1").setEnabled(false);
	}
});
</script>

### .setChecked (isChecked)

토글 버튼을 사용할 시 체크 상태를 동적으로 변경하는 함수입니다.

- parameter
	- isChecked {Boolean} Required  
		- 설정된 값에 의해서 버튼이 체크/체크해제됩니다.
<div class="eg">
<div class="egview">
	<button id="button2" class="Button Toggle" data-on="CHECKED" data-off="UNCHECKED">Button</button>
	<button id="btn_setChecked" class="Button Toggle" data-on="setChecked(false)" data-off="setChecked(true)">setChecked</button>
</div>
```
<button id="button2" class="Button Toggle" data-on="CHECKED" data-off="UNCHECKED">Button</button>
<button id="btn_setChecked" class="Button Toggle" data-on="setChecked(false)" data-off="setChecked(true)">setChecked</button>
```
```
$("#btn_setChecked").on("click", function (){
	if ($("#button2").hasClass("Checked")) {
	   $("#button2").setChecked(false);
	} else {
	   $("#button2").setChecked(true);
	}
});


$("#button2").on("click", function (){
   $("#btn_setChecked").toggleChecked();
});
```
</div>

<script>
$("#btn_setChecked").on("click", function (){
	if ($("#button2").hasClass("Checked")) {
	   $("#button2").setChecked(false);
	} else {
	   $("#button2").setChecked(true);
	}
});


$("#button2").on("click", function (){
   $("#btn_setChecked").toggleChecked();
});
</script>

### .toggleChecked ()

토글 버튼 사용 시 체크 상태를 동적으로 변경하는 함수입니다.

<div class="eg">
<div class="egview">
	<button id="button3" class="Button Toggle" data-on="CHECKED" data-off="UNCHECKED">Button</button>
	<button id="btn_toggleChecked" class="Button">toggleChecked()</button>
</div>
```
<button id="button3" class="Button Toggle" data-on="CHECKED" data-off="UNCHECKED">Button</button>
<button id="btn_toggleChecked" class="Button">toggleChecked()</button>
```
```
$("#btn_toggleChecked").on("click", function (){
	$("#button3").toggleChecked();
});
```
</div>

<script>
$("#btn_toggleChecked").on("click", function (){
	$("#button3").toggleChecked();
});
</script>

### .isChecked ()

토글 버튼 사용 시 체크 상태를 확인하는 함수입니다.

<div class="eg">
<div class="egview">
	<button id="button4" class="Button Toggle" data-on="CHECKED" data-off="UNCHECKED">Button</button>
	<span id="span1"></span><button id="btn_isChecked" class="Button">isChecked()</button>
</div>
```
<button id="button4" class="Button Toggle" data-on="CHECKED" data-off="UNCHECKED">Button</button>
<span id="span1"></span><button id="btn_isChecked" class="Button">isChecked()</button>
```
```
$("#btn_isChecked").on("click", function (){
	var isCHK = $("#button4").isChecked();
	isCHK = isCHK? "체크됨":"체크안됨";
	$('#span1').text(isCHK);
});
```
</div>

<script>
$("#btn_isChecked").on("click", function (){
	var isCHK = $("#button4").isChecked();
	isCHK = isCHK? "체크됨":"체크안됨";
	$('#span1').text(isCHK);
});
</script>


