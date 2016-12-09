

# TextInput


## Basic

TextInput 컴포넌트 입니다.

<div class="eg">
<div class="egview">
<input id="textId" class="Textinput">
</div>

```
<input id="textId" class="Textinput">
```
</div>

입력값을 제한하고 싶다면  [MaskedInput](../dev-js/javascript.html?target=maskedinput#basic)을 참고하세요.

<div class="eg">
<div class="egview">
<label><strong>숫자만 입력가능: </strong>
<input class="Textinput" data-keyfilter-rule="digits"></label>
</div>

```
<input class="Textinput" data-keyfilter-rule="digits"> // 숫자만 입력 가능
```
</div>

## Attributes
	

### data-disabled

- “true”
	-  마크업으로 버튼을 비활성화 시킵니다.
	
<div class="eg">
<div class="egview">
<input id="textId" class="Textinput" data-disabled="true">
</div>

```
<input id="textId" class="Textinput" data-disabled="true">
```
</div>


## Functions


### .setEnabled (isEnabled)

TextInput의 활성화/비활성화를 동적으로 조정할 때 사용하는 함수입니다.

- parameter
	- isEnabled {Boolean} Required  
		- 설정된 Boolean값에 의해서 TextInput이 활성화/비활성화 됩니다

<div class="eg">
<div class="egview">		
<input id="text0" class="Textinput">
<button id="btn0" class="Button">Disable</button> 
</div>
```
<input id="text0" class="Textinput">
<button id="btn0" class="Button">Disable</button> 
```
```
 $(document).ready(function() {
	    $('#btn0').click(disableAction);
	  });
	
  function disableAction() {
    if ($('#btn0').text() == 'Enable') {
      $('#text0').setEnabled(true);
      $('#btn0').text('Disable');
    } else {
      $('#text0').setEnabled(false);
      $('#btn0').text('Enable');
    }
  }
```
</div>

<script type="text/javascript">
	  $(document).ready(function() {
	    $('#btn0').click(disableAction);
	  });
	
  function disableAction() {
    if ($('#btn0').text() == 'Enable') {
      $('#text0').setEnabled(true);
      $('#btn0').text('Disable');
    } else {
      $('#text0').setEnabled(false);
      $('#btn0').text('Enable');
    }
  }
</script>



Target Text에 값을 입력후 Get Text 버튼을 누르면 사용자가 입력한 텍스트가 출력됩니다. Set Text에 텍스트를 입력하고 버튼을 누르면 Target에 사용자가 입력한 텍스트가 출력됩니다.

<div class="eg">
<div class="egview">
	<div class="Margin-bottom-5">	
		<label><strong>Target Text: </strong> 
		<input id="text1" class="Textinput"></label>
	</div>
	<div class="Margin-bottom-5">
		<label for="span1">가져온 텍스트: </label> 
		<span id="span1"></span> 
		<button id="btn1" class="Button">Get Text</button>
	</div>
	<div>
		<label>입력 텍스트: <input id="text2" class="Textinput"></label>
		<button id="btn2" class="Button">Set Text</button>
	</div>
</div>
```
<div class="Margin-bottom-5">	
	<label><strong>Target Text: </strong> 
	<input id="text1" class="Textinput"></label>
</div>
<div class="Margin-bottom-5">
	<label for="span1">가져온 텍스트: </label> 
	<span id="span1"></span> 
	<button id="btn1" class="Button">Get Text</button>
</div>
<div>
	<label>입력 텍스트: <input id="text2" class="Textinput"></label>
	<button id="btn2" class="Button">Set Text</button>
</div>
```
```
  $(document).ready(function() {
    $('#btn1').click(getText);
    $('#btn2').click(setText);
  });

  function getText() {
    $('#span1').text($('#text1').val());
  }
  function setText() {
    $('#text1').val($('#text2').val());
  }
```
<script type="text/javascript">
  $(document).ready(function() {
    $('#btn1').click(getText);
    $('#btn2').click(setText);
  });

  function getText() {
    $('#span1').text($('#text1').val());
  }
  function setText() {
    $('#text1').val($('#text2').val());
  }
</script>


