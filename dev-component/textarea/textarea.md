

# TextArea

## Basic

TextArea 컴포넌트 입니다. `class="Textarea"` 를 사용 합니다.
<div class="eg">
<div class="egview">
<textarea class="Textarea" rows="6" cols="40"></textarea>
</div>
```
<textarea class="Textarea" rows="6" cols="40"></textarea>
```
</div>


## Attributes


### class


### data-disabled

- “true”
	-  마크업으로 버튼을 비활성화 시킬때 다음과 같이 선언하여 사용합니다.

<div class="eg">
<div class="egview">
<textarea class="Textarea" rows="6" cols="40" data-disabled="true"></textarea>
</div>
```
<textarea class="Textarea" rows="6" cols="40" data-disabled="true"></textarea>
```
</div>


## Functions


### .setEnabled (isEnabled)

TextArea의 활성화/비활성화를 동적으로 조정할 때 사용하는 API입니다.

- parameter
	- isEnabled {Boolean} Required  
		- 설정된 isEnabled값에 의해서 버튼이 활성화/비활성화 됩니다
	
<div class="eg">
<div class="egview">
<textarea id="textareaId" class="Textarea " rows="6" cols="40"></textarea>
<button id="btn_setEnabled" class="Button Toggle">Disable</button>
</div>
```
<textarea id="textareaId" class="Textarea" rows="6" cols="40"></textarea>
<button id="btn_setEnable" class="Button Toggle">Disable</button>
```
```
  $(document).ready(function() {
    $('#btn_setEnabledFalse').click(disableAction);
  });

  function disableAction() {
    if ($('#btn_setEnabled').text() == 'Enable') {
      $('#textareaId').setEnabled(true);
      $('#btn_setEnabled').text('Disable');
    } else {
      $('#textareaId').setEnabled(false);
      $('#btn_setEnabled').text('Enable');
    }
  }
```
</div>	
<script type="text/javascript">
  $(document).ready(function() {
    $('#btn_setEnabled').click(disableAction);
  });

  function disableAction() {
    if ($('#btn_setEnabled').text() == 'Enable') {
      $('#textareaId').setEnabled(true);
      $('#btn_setEnabled').text('Disable');
    } else {
      $('#textareaId').setEnabled(false);
      $('#btn_setEnabled').text('Enable');
    }
  }
</script>



