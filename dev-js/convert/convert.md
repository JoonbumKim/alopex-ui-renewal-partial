

# Convert

## Basic
화면 시작과 동시에 Alopex UI는 HTML을 읽어들여 DOM을 Alopex UI 객체로 변환합니다.
동적으로 삽입된 HTML코드 또한 이러한 작업을 수행해야 하기 때문에 convert함수를 통해 작업을 수행합니다.

## Functions

###.convert(element)
전달받은 element를 Alopex UI객체로 변환합니다.

<style>
    /* 컨버트 되지 않은 레이블과 input 색삭 표시 */
	input:not([data-converted=true]) {background-color:yellow;}
	input:not([data-converted=true])+label {color:red;}
</style>
<div class="eg">
<div class="egview">
	<input id="already" type="checkbox" class="Checkbox"> ◀ (이미)마크업된 Alopex Checkbox
	<p >아래 Add버튼을 눌러 추가.  추가된 체크박스중 <span style="color:red">covert되지 않은 체크박스</span>는  체크기능이 되지 않음 </p>
	<button id="btn_add" class="Button">Add checkbox</button>
	<button id="btn_convert" class="Button">convert checkbox</button>
	<div id="targetConvert"></div>
	<div id="target"></div>
</div>
```
<style>
    /* 컨버트 되지 않은 레이블과 input 색삭 표시 */
	input:not([data-converted=true]) {background-color:yellow;}
	input:not([data-converted=true])+label {color:red;}
</style>
```
```
<input type="checkbox" class="Checkbox"> ◀ (이미)마크업된 Alopex Checkbox
<p> 추가된 체크박스중 covert되지 않은 체크박스는 input element로만 생성 </p>
<button id="btn_add" class="Button">Add checkbox</button>
<button id="btn_convert" class="Button">convert checkbox</button>
<div id="targetConvert"></div>
<div id="target"></div>
```
```
$('#btn_add').click(function() {
	$('#targetConvert').append('<input class="Checkbox"><label>Checkbox with convert </label>');
	$('#target').append('<input type="checkbox" class="Checkbox"><label>Checkbox without convert </label>');
	$a.convert($('#targetConvert'));
});

$('#btn_convert').click(function() {
	if ($('#target').children().length > 0) {
		$a.convert($('#target'));	
		alert("converted");
	};
});
```
</div>
<script>
$('#btn_add').click(function() {
	$('#targetConvert').append('<input class="Checkbox"><label>Checkbox with convert </label>');
	$('#target').append('<input  type="checkbox" class="Checkbox"><label>Checkbox without convert </label>');
	$a.convert($('#targetConvert'));
});

$('#btn_convert').click(function() {
	if ($('#target').children().length > 0) {
		$a.convert($('#target'));	
		alert("converted");
	};
});
</script>



