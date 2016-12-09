

# Select

## Basic

### 기본 셀렉트

Select 버튼은 목록에서 한가지 혹은 여러가지 아이템을 선택할 때 사용하는 컴포넌트입니다.<br>
&lt;select&gt; 태그에 <code>class="Select"</code> 를 사용합니다.
<div class="eg">
<div class="egview">
	<select id="selectId" class="Select">
		<option value="korea">Korea</option>
		<option value="usa">USA</option>
		<option value="japan">Japan</option>
		<option value="china">China</option>
	</select> 
</div>

```
<select id="selectId" class="Select" >
	<option value="korea">Korea</option>
	<option value="usa">USA</option>
	<option value="japan">Japan</option>
	<option value="china">China</option>
</select>
```
</div> 

### 이미지 셀렉트

HTML &lt;select&gt; 엘리먼트의 스타일에 한계가 있을 경우, select 컴포넌트를 활용하기 위해서 Divselect 클래스를 사용합니다. 
이 속성을 사용하면 스타일을 적용할 수 있는 &lt;div&gt; 엘리먼트가 추가 생성되어 &lt;select&gt; 엘리먼트를 감싸게 됩니다. 
이 &lt;div&gt; 엘리먼트를 활용하여 보다 쉽게 select element를 스타일링 할 수 있습니다.

- &lt;select&gt; 태그를 감싼 &lt;div&gt;태그에 <code>class="Divselect"</code> 를 사용합니다.
	- 이 경우 접근성 측면에서 키보드 focusin시 highlight되지 않아, 접근성에 위배될 수 있습니다.
- Divselect 엘리먼트에 Attribute 및 API 를 적용하여 사용합니다.
	- Divselect 클래스 사용 시 주의해야 할 부분은 동적으로 select 옵션메뉴가 변경되면 변경된 옵션의 텍스트 값의 변화를 반영하지 못하는 경우가 있습니다.
	- 이 경우 제공되는 refresh 함수를 호출하면 제대로 된 텍스트 값이 반영됩니다.

<div class="eg">
<div class="egview">
<div class="Divselect">
    <select>
        <option value="korea">Korea</option>
        <option value="usa">USA</option>
        <option value="japan">Japan</option>
        <option value="china">China</option>
    </select>
    <span></span> 
</div></div>
```
<div class="Divselect"> <!-- DIV로 select를 감쌉니다. -->
	<select>
		<option value="korea">Korea</option>
		<option value="usa">USA</option>
		<option value="japan">Japan</option>
		<option value="china">China</option>
	</select>
	<span></span> <!-- 빈 span테그를 넣어줍니다. -->
</div>
```
</div>
 
## Attributes

### data-select-size
- string
	-  셀렉트 컴포넌트에 보여질 option의 수를 설정하는 속성입니다.  
	-  이미지 셀렉트(Divselect)에서는 사용할 수 없습니다. 
	-  style속성의 height와 size속성을 동시 적용 시, style속성의 height가 적용됩니다.
<div class="eg">
<div class="egview">
	<select id="selectSelectSize" class="Select" data-select-size="2">
		<option value="korea">Korea</option>
		<option value="usa">USA</option>
		<option value="japan">Japan</option>
		<option value="china">China</option>
		<option value="russia">Russia</option>
		<option value="australia">Australia</option>
		<option value="mexico">Mexico</option>
		<option value="nigeria">Nigeria</option>
	</select> 
</div>

```
	<select id="selectSelectSize" class="Select" data-select-size="2">
		<option value="korea">Korea</option>
		<option value="usa">USA</option>
		<option value="japan">Japan</option>
		<option value="china">China</option>
		<option value="russia">Russia</option>
		<option value="australia">Australia</option>
		<option value="mexico">Mexico</option>
		<option value="nigeria">Nigeria</option>
	</select> 
```
</div> 


### data-disabled
- “true”
	-  마크업으로 체크박스 버튼을 비활성화 시킬 때 다음과 같이 선언하여 사용합니다.
<div class="eg">
<div class="egview">
<div>
	<select id="selectId" class="Select" data-disabled="true">
		<option value="korea">Korea</option>
		<option value="usa">USA</option>
		<option value="japan">Japan</option>
		<option value="china">China</option>
	</select> 
</div></div>

```
<select id="selectId" class="Select" data-disabled="true">
	<option value="korea">Korea</option>
	<option value="usa">USA</option>
	<option value="japan">Japan</option>
	<option value="china">China</option>
</select>
```
</div>
<p>

<div class="eg">
<div class="egview">
<div class="Divselect" data-disabled="true">
    <select>
        <option value="korea">Korea</option>
        <option value="usa">USA</option>
        <option value="japan">Japan</option>
        <option value="china">China</option>
    </select>
    <span></span>
</div></div>

```
<div class="Divselect" data-disabled="true">
	<select>
		<option value="korea">Korea</option>
		<option value="usa">USA</option>
		<option value="japan">Japan</option>
		<option value="china">China</option>
	</select>
	<span></span>
</div>
```
</div>

### data-placeholder
- string
	-  셀렉트 컴포넌트의 placeholder 값을 설정하는 속성입니다.

<div class="eg">
<div class="egview">
<select id="selectId" class="Select" data-placeholder="선택">
	<option value="korea">Korea</option>
	<option value="usa">USA</option>
	<option value="japan">Japan</option>
	<option value="china">China</option>
</select>
</div>

```
<select id="selectId" class="Select" data-placeholder="선택">
	<option value="korea">Korea</option>
	<option value="usa">USA</option>
	<option value="japan">Japan</option>
	<option value="china">China</option>
</select>
```
</div>

<div class="eg">
<div class="egview">
<div class="Divselect" data-placeholder="선택">
    <select >
        <option value="korea">Korea</option>
        <option value="usa">USA</option>
        <option value="japan">Japan</option>
        <option value="china">China</option>
    </select>
    <span></span>
</div></div>
```
<div class="Divselect" data-placeholder="선택">
    <select >
        <option value="korea">Korea</option>
        <option value="usa">USA</option>
        <option value="japan">Japan</option>
        <option value="china">China</option>
    </select>
    <span></span>
</div>
```
</div>

### data-bind-option
- string
    - select 내 option 목록 데이터를 동적으로 바인딩 시 기본적인 value , text 로 지정되는 키명을 커스텀하게 설정하는 속성입니다.<br>
      "value 키명 : text 키명" 으로 사용합니다.
      
``` 
 <select data-bind-option="valuekey:textkey" data-bind="options: optionList"></select>     
``` 
<p>
<div class="eg">
<div class="egview">
국적을 선택하세요 : <select id="world_people" data-bind-option="people:country" data-bind="options:data, selectedOptions: option_selected"></select>
</div>        		    
``` 
국적을 선택하세요 : <select id="world_people" data-bind-option="people:country" data-bind="options:data, selectedOptions: option_selected"></select>
``` 
```
var option_data =  [{people:"한국인", country:"KOREA" },
	        		{people:"일본인", country:"JAPAN" },
	        		{people:"미국인", country:"USA"},
	        		{people:"중국인", country:"CHINA"}];
	        
$('#world_people').setData({
			 data:option_data,
		     option_selected: '미국인' // 최초 선택값 설정
});
``` 

</div>

<script>
var option_data =  [{people:"한국인", country:"KOREA" },
	        		{people:"일본인", country:"JAPAN" },
	        		{people:"미국인", country:"USA"},
	        		{people:"중국인", country:"CHINA"}];
	        
$('#world_people').setData({
			 data:option_data,
		     option_selected: '미국인' // 최초 선택값 설정
});
</script>


### data-select-multiple

- “true”
	-  멀티셀렉트 형태를 나타냅니다. 'ctrl', 'shift' 키와 함께 클릭하면  여러 아이템을 선택할 수 있습니다.
	-  이미지 셀렉트(Divselect)에서는 사용할 수 없습니다. 


<div class="eg">
<div class="egview">
<select id="select_multiple" class="Select" data-select-multiple="true">
		<option value="value1">Korea</option>
		<option value="value2">USA</option>
		<option value="value3">Japan</option>
		<option value="value4">China</option>
		<option value="value5">Spain</option>
		<option value="value6">Italy</option>
		<option value="value7">Engliand</option>
		<option value="value8">Austrailia</option>
		<option value="value9">France</option>
		<option value="value10">Russia</option>
	</select> 
	<textarea id="textarea1" rows="4" cols="38"></textarea><br>
	<button id="btn_addMulti" class="Button">Add(Korea)</button>
	<button id="btn_removeMulti" class="Button">Remove</button>
	<button id="btn_getMultiVal" class="Button">Get MultiValue</button>
	<button id="btn_getMultiTxt" class="Button">Get MultiText</button><br>
</div>
```
<select id="select_multiple" class="Select" data-select-multiple="true">
		<option value="value1">Korea</option>
		<option value="value2">USA</option>
		<option value="value3">Japan</option>
		<option value="value4">China</option>
		<option value="value5">Spain</option>
		<option value="value6">Italy</option>
		<option value="value7">Engliand</option>
		<option value="value8">Austrailia</option>
		<option value="value9">France</option>
		<option value="value10">Russia</option>
	</select> 
	<textarea id="textarea1" rows="4" cols="38"></textarea><br>
	<button id="btn_addMulti" class="Button">Add(Korea)</button>
	<button id="btn_removeMulti" class="Button">Remove</button>
	<button id="btn_getMultiVal" class="Button">Get MultiValue</button>
	<button id="btn_getMultiTxt" class="Button">Get MultiText</button><br>

```
```
$('#btn_addMulti').click(addMultiItem);
$('#btn_removeMulti').click(removeMultiItem);
$('#btn_getMultiVal').click(getMultiValue);
$('#btn_getMultiTxt').click(getMultiText);

function addMultiItem() {
	$('#select_multiple').append($('<option>', {
	  value: 'korea',
	  text: 'Korea'
	}));
};

function removeMultiItem() {
	$('#select_multiple option:selected').remove();
};

function getMultiValue() {
	var str = "";
	$('#select_multiple option:selected').each(function() {
	  str += $(this).val() + ", ";
	});
	$('#textarea1').text(str);
};

function getMultiText() {
	var str = "";
	$('#select_multiple option:selected').each(function() {
	  str += $(this).text() + ", ";
	});
	$('#textarea1').text(str);
};
```
</div>

<script>
$('#btn_addMulti').click(addMultiItem);
$('#btn_removeMulti').click(removeMultiItem);
$('#btn_getMultiVal').click(getMultiValue);
$('#btn_getMultiTxt').click(getMultiText);

function addMultiItem() {
	$('#select_multiple').append($('<option>', {
	  value: 'korea',
	  text: 'Korea'
	}));
};

function removeMultiItem() {
	$('#select_multiple option:selected').remove();
};

function getMultiValue() {
	var str = "";
	$('#select_multiple option:selected').each(function() {
	  str += $(this).val() + ", ";
	});
	$('#textarea1').text(str);
};

function getMultiText() {
	var str = "";
	$('#select_multiple option:selected').each(function() {
	  str += $(this).text() + ", ";
	});
	$('#textarea1').text(str);
};
</script>


## Functions


### .setSelectSize()

버튼의 활성화/비활성화를 컨트롤 할 때 사용하는 API입니다.

- parameter
	- size {Integer} Required  
		- 설정된 size 값에 따라 셀렉트의 option이 보여집니다.
		- 이미지셀렉트(Divselect)에서는 사용할 수 없습니다.
<div class="eg">
<div class="egview">
<select id="select_setSelectSize" class="Select">
		<option value="value1">Korea</option>
		<option value="value2">USA</option>
		<option value="value3">Japan</option>
		<option value="value4">China</option>
		<option value="value5">Spain</option>
		<option value="value6">Italy</option>
		<option value="value7">Engliand</option>
		<option value="value8">Austrailia</option>
		<option value="value9">France</option>
		<option value="value10">Russia</option>
</select>

<Button id="select_setSelectSize1" class="Button">1개 보여주기</Button>
<Button id="select_setSelectSize4" class="Button">4개 보여주기</Button>
<Button id="select_setSelectSize8" class="Button">8개 보여주기</Button>
</div>

```
<select id="select_setSelectSize" class="Select">
		<option value="value1">Korea</option>
		<option value="value2">USA</option>
		<option value="value3">Japan</option>
		<option value="value4">China</option>
		<option value="value5">Spain</option>
		<option value="value6">Italy</option>
		<option value="value7">Engliand</option>
		<option value="value8">Austrailia</option>
		<option value="value9">France</option>
		<option value="value10">Russia</option>
</select>

<Button id="select_setSelectSize1" class="Button">1개 보여주기</Button>
<Button id="select_setSelectSize4" class="Button">4개 보여주기</Button>
<Button id="select_setSelectSize8" class="Button">8개 보여주기</Button>
```
```
$('#select_setSelectSize1').on('click', function(){
	$('#select_setSelectSize').setSelectSize(1);
});
$('#select_setSelectSize4').on('click', function(){
	$('#select_setSelectSize').setSelectSize(4);
});
$('#select_setSelectSize8').on('click', function(){
	$('#select_setSelectSize').setSelectSize(8);
});
```
</div>

<script>
$('#select_setSelectSize1').on('click', function(){
	$('#select_setSelectSize').setSelectSize(1);
});
$('#select_setSelectSize4').on('click', function(){
	$('#select_setSelectSize').setSelectSize(4);
});
$('#select_setSelectSize8').on('click', function(){
	$('#select_setSelectSize').setSelectSize(8);
});
</script>



### .setEnabled()

버튼의 활성화/비활성화를 컨트롤 할 때 사용하는 API입니다.

- parameter
	- isEnabled {Boolean} Required  
		- 설정된 Boolean 값에 의해서 셀렉트 버튼이 활성화/비활성화 됩니다.
<div class="eg">
<div class="egview">
<select id="select_isEnabled" class="Select">
	<option value="korea">Korea</option>
	<option value="usa">USA</option>
	<option value="japan">Japan</option>
	<option value="china">China</option>
</select>

<Button id="isEnabled_true" class="Button">.setEnabled (true)</Button>
<Button id="isEnabled_false" class="Button">.setEnabled (false)</Button>
</div>

```
<select id="select_isEnabled" class="Select">
	<option value="korea">Korea</option>
	<option value="usa">USA</option>
	<option value="japan">Japan</option>
	<option value="china">China</option>
</select>

<Button id="isEnabled_true" class="Button">.setEnabled (true)</Button>
<Button id="isEnabled_false" class="Button">.setEnabled (false)</Button>
```
```
$('#isEnabled_true').on('click', function(){
	$('#select_isEnabled').setEnabled (true);
});

$('#isEnabled_false').on('click', function(){
	$('#select_isEnabled').setEnabled (false);
});
```
</div>

<script>
$('#isEnabled_true').on('click', function(){
	$('#select_isEnabled').setEnabled (true);
});

$('#isEnabled_false').on('click', function(){
	$('#select_isEnabled').setEnabled (false);
});
</script>


<div class="eg">
<div class="egview">
<div id="divSelect_isEnabled" class="Divselect">
    <select>
        <option value="korea">Korea</option>
        <option value="usa">USA</option>
        <option value="japan">Japan</option>
        <option value="china">China</option>
    </select>
    <span></span>
</div>
<Button id="div_isEnabled_true" class="Button">.setEnabled (true)</Button>
<Button id="div_isEnabled_false" class="Button">.setEnabled (false)</Button>

</div>

```
<div id="divSelect_isEnabled" class="Divselect">
    <select>
        <option value="korea">Korea</option>
        <option value="usa">USA</option>
        <option value="japan">Japan</option>
        <option value="china">China</option>
    </select>
    <span></span>
</div>
<Button id="div_isEnabled_true" class="Button">.setEnabled (true)</Button>
<Button id="div_isEnabled_false" class="Button">.setEnabled (false)</Button>
```
```
$('#div_isEnabled_true').on('click', function(){
	$('#divSelect_isEnabled').setEnabled (true);
});

$('#div_isEnabled_false').on('click', function(){
	$('#divSelect_isEnabled').setEnabled (false);
});
```
</div>

<script>
$('#div_isEnabled_true').on('click', function(){
	$('#divSelect_isEnabled').setEnabled (true);
});

$('#div_isEnabled_false').on('click', function(){
	$('#divSelect_isEnabled').setEnabled (false);
});
</script>

### .setSelected()

셀렉트버튼을 동적으로 선택할 때 사용하는  API입니다.

- parameter
	- text {string} Required  
		- 텍스트로 셀렉트버튼이 선택됩니다.

<div class="eg">
<div class="egview">		
<select id="select_setSelected" class="Select">
	<option value="korea">Korea</option>
	<option value="usa">USA</option>
	<option value="japan">Japan</option>
	<option value="china">China</option>
</select>
<Button id="btn_setSelected1" class="Button">미국</Button>
<Button id="btn_setSelected2" class="Button">일본</Button>

</div>
```
<select id="select_setSelected" class="Select">
	<option value="korea">Korea</option>
	<option value="usa">USA</option>
	<option value="japan">Japan</option>
	<option value="china">China</option>
</select>
<Button id="btn_setSelected1" class="Button">미국</Button>
<Button id="btn_setSelected2" class="Button">일본</Button>
```

```
$('#btn_setSelected1').on('click', function(){
	$('#select_setSelected').setSelected("USA");
});

$('#btn_setSelected2').on('click', function(){
	$('#select_setSelected').setSelected("Japan");
});
```
</div>

<script>
$('#btn_setSelected1').on('click', function(){
	$('#select_setSelected').setSelected("USA");
});

$('#btn_setSelected2').on('click', function(){
	$('#select_setSelected').setSelected("Japan");
});
</script>

- parameter
	- value {string} Required  
		- value로 셀렉트버튼이 선택됩니다.

<div class="eg">
<div class="egview">	
<div id="divSelect_setSelected" class="Divselect">
    <select>
        <option value="kr">Korea</option>
        <option value="us">USA</option>
        <option value="jp">Japan</option>
        <option value="cn">China</option>
    </select>
    <span></span>
</div>
<Button id="div_val_setSelected1" class="Button">중국</Button>
<Button id="div_val_setSelected2" class="Button">미국</Button>
</div>

```
<div id="divSelect_setSelected" class="Divselect">
    <select>
        <option value="kr">Korea</option>
        <option value="us">USA</option>
        <option value="jp">Japan</option>
        <option value="cn">China</option>
    </select>
    <span></span>
</div>
<Button id="div_val_setSelected1" class="Button">중국</Button>
<Button id="div_val_setSelected2" class="Button">미국</Button>
```
```
$('#div_val_setSelected1').on('click', function(){
	$('#divSelect_setSelected').setSelected("cn");
});

$('#div_val_setSelected2').on('click', function(){
	$('#divSelect_setSelected').setSelected("us");
});
```

</div>

<script>
$('#div_val_setSelected1').on('click', function(){
	$('#divSelect_setSelected').setSelected("cn");
});

$('#div_val_setSelected2').on('click', function(){
	$('#divSelect_setSelected').setSelected("us");
});
</script>

### .getValues()

선택된 셀렉트 아이템의 value를 가져오는 API입니다.
	
- return 
	- values {array}
		- 선택한 아이템의 Value array를 return하여 줍니다.


### .getTexts()

선택된 셀렉트 아이템의 텍스트를 가져오는  API입니다.

- return 
	- text {array}
		- 선택한 아이템의 텍스트 array를 return하여 줍니다.

<div class="eg">
<div class="egview">
	<select id="select_getValTxt" class="Select">
		<option value="value1">Korea</option>
		<option value="value2">USA</option>
		<option value="value3">Japan</option>
		<option value="value4">China</option>
	</select>
	<span id="span1"></span>
	<button id="btn_getVal" class="Button">Value</button>
	<button id="btn_getTxt" class="Button">Text</button><br>
</div>

```
<select id="select_getValTxt" class="Select">
	<option value="value1">Korea</option>
	<option value="value2">USA</option>
	<option value="value3">Japan</option>
	<option value="value4">China</option>
</select>
<span id="span1"></span>
<button id="btn_getVal" class="Button">Value</button>
<button id="btn_getTxt" class="Button">Text</button>
```
```
$('#btn_getVal').click(getVal);
$('#btn_getTxt').click(getTxt);

function getTxt() {
	var txt = $('#select_getValTxt').getTexts();
	// array로 return되고, index 통해 특정 값을 얻습니다.
   	$('#span1').text(txt[0]);
 };
function getVal() {
	var val = $('#select_getValTxt').getValues();
	// array로 return되고, index 통해 특정 값을 얻습니다.
	$('#span1').text(val[0]);
 };
```
</div>

<script>
$('#btn_getVal').click(getVal);
$('#btn_getTxt').click(getTxt);

function getTxt() {
	var txt = $('#select_getValTxt').getTexts();
	// array로 return되고, index 통해 특정 값을 얻습니다.
   	$('#span1').text(txt[0]);
 };
function getVal() {
	var val = $('#select_getValTxt').getValues();
	// array로 return되고, index 통해 특정 값을 얻습니다.
	$('#span1').text(val[0]);
 };
</script>


### .selectionInitialization()

셀렉트 버튼 내의 옵션 중 첫번째 옵션을 선택하도록 초기화 합니다.  

<div class="eg">
<div class="egview">
	<select id="select_init" class="Select" data-placeholder="선택">
		<option value="value1">Korea</option>
		<option value="value2">USA</option>
		<option value="value3">Japan</option>
		<option value="value4">China</option>
	</select>
	<button id="btn_init" class="Button">옵션 초기화</button>
</div>

```
	<select id="select_init" class="Select" data-placeholder="선택">
		<option value="value1">Korea</option>
		<option value="value2">USA</option>
		<option value="value3">Japan</option>
		<option value="value4">China</option>
	</select>
	<button id="btn_init" class="Button">옵션 초기화</button>
```
```
$('#btn_init').click(function() {
   		$('#select_init').selectionInitialization();
	}
);
```
</div>

<script>
$('#btn_init').click(function() {
   		$('#select_init').selectionInitialization();
	}
);
</script>


### .clear()

셀렉트 버튼내의 옵션을 삭제하는 API입니다.<br>삭제될 때 placeholder 값은 그대로 유지됩니다.

<div class="eg">
<div class="egview">
	<select id="select_clear" class="Select" data-placeholder="선택">
		<option value="value1">Korea</option>
		<option value="value2">USA</option>
		<option value="value3">Japan</option>
		<option value="value4">China</option>
	</select>
	<button id="btn_clear" class="Button">Clear</button>
</div>

```
<select id="select_clear" class="Select" data-placeholder="선택">
	<option value="value1">Korea</option>
	<option value="value2">USA</option>
	<option value="value3">Japan</option>
	<option value="value4">China</option>
</select>
<button id="btn_clear" class="Button">Clear</button>
```
```
$('#btn_clear').click(clearSelect);
	
function clearSelect() {
   $('#select_clear').clear();
};
```
</div>

<script>
$('#btn_clear').click(clearSelect);
	
function clearSelect() {
   $('#select_clear').clear();
};
</script>


### .refresh()

셀렉트 버튼의 Divselect 클래스를 사용하는 경우에 동적으로 셀렉트 버튼의 옵션이 변경되면, 제대로 선택된 값을 표시해 주지 못 합니다.<br>
이 경우, refresh 함수를 통하여 제대로 된 테스트를 표시하도록 합니다.<br>
아래의 "remove & refresh" 버튼과 같이 제거 및 갱신을 한 번에 할 수도 있습니다.

<div class="eg">
<div class="egview">
<div id="select_divRefresh" class="Divselect Margin-bottom-10">
    <select>
        <option value="korea">Korea</option>
        <option value="usa">USA</option>
        <option value="japan">Japan</option>
        <option value="china">China</option>
    </select>
    <span></span>
</div>
<div><Button id="btn_add" class="Button">Add</Button>
<Button id="btn_remove" class="Button">Remove</Button>
<Button id="btn_refresh" class="Button">Refresh</Button>
<Button id="btn_remove_and_refresh" class="Button">remove & refresh</Button>
</div></div>
```
<div id="select_divRefresh" class="Divselect Margin-bottom-10">
    <select>
        <option value="korea">Korea</option>
        <option value="usa">USA</option>
        <option value="japan">Japan</option>
        <option value="china">China</option>
    </select>
    <span></span>
</div>
<Button id="btn_add" class="Button">Add</Button>
<Button id="btn_remove" class="Button">Remove</Button>
<Button id="btn_refresh" class="Button">Refresh</Button>
<Button id="btn_remove_and_refresh" class="Button">remove & refresh</Button>
```

```
$('#btn_add').on('click', function(){
	$('#select_divRefresh select').append($('<option>', {
	      value: 'spain',
	      text: 'Spain'
	    }));
});

$('#btn_remove').on('click', function(){
	$('#select_divRefresh').find('option:selected').remove();
});

$('#btn_refresh').click(function(e){
	$('#select_divRefresh').refresh();
});
$('#btn_remove_and_refresh').click(function(e){
    $('#select_divRefresh').find('option:selected').remove();
	$('#select_divRefresh').refresh();
});
```
</div>

<script>
$('#btn_add').on('click', function(){
	$('#select_divRefresh select').append($('<option>', {
	      value: 'spain',
	      text: 'Spain'
	    }));
});

$('#btn_remove').on('click', function(){
	$('#select_divRefresh').find('option:selected').remove();
});

$('#btn_refresh').click(function(e){
	$('#select_divRefresh').refresh();
});
$('#btn_remove_and_refresh').click(function(e){
    $('#select_divRefresh').find('option:selected').remove();
	$('#select_divRefresh').refresh();
});
</script>