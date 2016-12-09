

# DropdownButton

## Basic

DropdownButton 컴포넌트는 버튼에 `class="Dropdownbutton"` 을 입력하여  
DropDown 컴포넌트와 동일한 동작을 수행하는 컴포넌트입니다.

<div class="eg">
<div class="egview">
	<button class="Dropdownbutton">select</button>
	<ul>
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
</div>

```
<button class="Dropdownbutton">select</button>
<ul>
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
</div>

## Attributes
 

### data-open-trigger

- {event name}
	- 	Dropdown를 여는 이벤트를 지정합니다.
	-	default 설정 : data-open-trigger='click' / data-close-trigger='click' 또는 해당 엘리먼트 밖에서 임의의 클릭 발생 시 닫힘
```
<ul data-open-trigger="dblclick" >
</ul>
```
<p> 
<div class="eg">
<div class="egview">
	<button class="Dropdownbutton">'double-click' open / 'click' close</button>
	<ul data-open-trigger="dblclick">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
</div>

```
<button class="Dropdownbutton">'double-click' open / 'click' close</button>
<ul data-open-trigger="dblclick">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
</div>
### data-close-trigger

- {event name}
	- 	Dropdown를 닫는 이벤트를 지정합니다.
	-	default 설정 : data-open-trigger='click' / data-close-trigger='click' 또는 해당 엘리먼트 밖에서 임의의 클릭 발생 시 닫힘
```
<ul data-close-trigger="dblclick">
</ul>
```
<p>
<div class="eg">
<div class="egview">
	<button class="Dropdownbutton">'click' open / 'double-click' close</button>
	<ul data-close-trigger="dblclick">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
	<button class="Dropdownbutton">'mouseover' open / 'mouseleave' close</button>
	<ul data-open-trigger="mouseover" data-close-trigger="mouseleave">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
</div>

```
	<button class="Dropdownbutton">'click' open / 'double-click' close</button>
	<ul data-close-trigger="dblclick">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
	<button class="Dropdownbutton">'mouseover' open / 'mouseleave' close</button>
	<ul data-open-trigger="mouseover" data-close-trigger="mouseleave">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
```
</div>

### data-position

- top | bottom | left | right
	- tooltip의 위치를 지정하는 속성입니다. base 엘리먼트를 기준으로 정해지는 위치입니다. 
	- 이 속성이 지정되지 않는 경우에는 bottom > top > left > right 순으로 화면을 벗어나지 않는 위치가 지정됩니다.


<div class="eg">
<div class="egview">
<button class="Dropdownbutton">right</button>
<ul data-position="right">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
<button class="Dropdownbutton">top</button>
<ul data-position="top">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
<button class="Dropdownbutton Float-right">left</button>
<ul data-position="left">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
</div>

```
<button class="Dropdownbutton">right</button>
<ul data-position="right">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
<button class="Dropdownbutton">top</button>
<ul data-position="top">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
<button class="Dropdownbutton">left</button>
<ul data-position="left">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
</div>

## Functions

### .addHandler(callback)

드랍다운버튼 메뉴의 옵션이 선택될 경우 호출되는 콜백함수를 등록합니다.

- parameter
	- callbackHandler {function} Required  
		
```
$('#dropdownbutton').addHandler(function(e){
	var menu = e.data.element; // 드랍다운 메뉴 위젯 엘리먼트를 위와 같이 지정할 수 있습니다. 
	var li = e.currentTarget; // 드랍다운 메뉴 옵션(li 태그)
);
```

### .setText(text)

드랍다운버튼의 텍스트를 동적으로 설정합니다.

- parameter
	- text {string} Required
	
<div class="eg">
<div class="egview">
	<button id="ddb1" class="Dropdownbutton">select</button>
	<ul>
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
	<input id="text1" class="Textinput" value="선택하세요">
	<button id="btn_setText" class="Button">setText()</button>
</div>
```
	<button id="ddb1" class="Dropdownbutton">select</button>
	<ul>
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
	<input id="text1" class="Textinput" value="선택하세요">
	<button id="btn_setText" class="Button">setText()</button>
```
```
$('#btn_setText').click(function(){
	var text = $('#text1').val();
	if(!text==""){
		$('#ddb1').setText(text);
	}
});
```
</div>
<script>
$('#btn_setText').click(function(){
	var text = $('#text1').val();
	if(!text==""){
		$('#ddb1').setText(text);
	}
});
</script>

### .getText()

드랍다운버튼의 선택된 텍스트를 동적으로 가져옵니다.

- return
	- text {string}

<div class="eg">
<div class="egview">
	<button id="ddb2" class="Dropdownbutton">GET THIS</button>
	<ul>
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
	<span id="span1"></span>
	<button id="btn_getText" class="Button">getText()</button>
</div>
```
<button id="ddb2" class="Dropdownbutton">GET THIS</button>
<ul>
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
<span id="span1"></span>
<button id="btn_getText" class="Button">getText()</button>	
```
```
$('#btn_getText').click(function(){
	var text = $('#ddb2').getText();
	$('#span1').text(text);
});
```
</div>
<script>
$('#btn_getText').click(function(){
	var text = $('#ddb2').getText();
	$('#span1').text(text);
});
</script>

### .setDataSource(data)

드랍다운버튼 메뉴의 데이터를 지정합니다.

- parameter
	- data {array} Required  
		


<div class="eg">
<div class="egview">
<button id="dropdownbutton1" class="Dropdownbutton">DropDownButton</button>
<ul></ul>

<button id="btn_setDataSource" class="Button">setDataSource(data)</button>
</div>
```
<button id="dropdownbutton1" class="Dropdownbutton">DropDownButton</button>
<ul></ul>

<button id="btn_setDataSource" class="Button">setDataSource(data)</button>
```
```
var data = [
	{id:"opt1", text: "Alopex UI", link: "http://ui.alopex.io/"}, 
	{id:"opt2", text: "Alopex Grid", link: "http://grid.alopex.io/"}
];
$('#btn_setDataSource').click(function(){
	$('#dropdownbutton1').setDataSource(data);
});
```
</div>

<script>
var data = [
	{id:"opt1", text: "Alopex UI", link: "http://ui.alopex.io/"}, 
	{id:"opt2", text: "Alopex Grid", link: "http://grid.alopex.io/"}
];
$('#btn_setDataSource').click(function(){
	$('#dropdownbutton1').setDataSource(data);
});

</script>



### .getDataSource()

드랍다운버튼 메뉴에서 .setDataSource(data) API를 통해 데이터를 지정한 경우에 대하여, 해당 데이터를 가져옵니다.
 

<div class="eg">
<div class="egview">

	<button id="dropdownbutton2" class="Dropdownbutton">DropDownButton</button>
	<ul></ul>

	<button id="btn_setDataSource2" class="Button">setDataSource(data)</button>
	<button id="btn_getDataSource2" class="Button">getDataSource()</button>
</div>
```
	<button id="dropdownbutton2" class="Dropdownbutton">DropDownButton</button>
	<ul></ul>

	<button id="btn_setDataSource2" class="Button">setDataSource(data)</button>
	<button id="btn_getDataSource2" class="Button">getDataSource()</button>
```
```
/***
 * id : li태그의 아이디 지정
 * text : a태그의 text로 지정.
 * link : a태그의 href로 지정.
 */
var data_getDataSource2 = [
	{id:"opt1", text: "Alopex UI", link: "http://ui.alopex.io/"},
	{id:"opt2", text: "Alopex Grid", link: "http://grid.alopex.io/"},
	{id:"opt3", text: "Alopex IDE", link: "http://ide.alopex.io/"}
];
$('#btn_setDataSource2').click(function() {
    $('#dropdownbutton2').setDataSource(data_getDataSource2);
});
$('#btn_getDataSource2').click(function() {
	var data = $('#dropdownbutton2').getDataSource();
	alert(JSON.stringify(data));
});

```
</div>
<script>
var data_getDataSource2 = [
	{id:"opt1", text: "Alopex UI", link: "http://ui.alopex.io/"},
	{id:"opt2", text: "Alopex Grid", link: "http://grid.alopex.io/"},
	{id:"opt3", text: "Alopex IDE", link: "http://ide.alopex.io/"}
];
$('#btn_setDataSource2').click(function() {
    $('#dropdownbutton2').setDataSource(data_getDataSource2);
});
$('#btn_getDataSource2').click(function() {
	var data = $('#dropdownbutton2').getDataSource();
	alert(JSON.stringify(data));
});

</script>



### .select(target)

드랍다운버튼 메뉴를 동적 선택 합니다.  
.select(0) 과 같이 integer 타입을 사용한 경우, 0번째 요소가 동적 선택 됩니다.  
.select({id: "opt1"}) 과 같이 object 타입으로 id 정보를 넘길 경우, 해당 id를 갖는 요소가 동적 선택 됩니다.  
 
- parameter
	- target {integer|object} Required


<div class="eg">
<div class="egview">
	<button id="dropdownbutton_select" class="Dropdownbutton">DropDownButton</button>
	<ul></ul>
	<button id="btn_select_setDataSource" class="Button">setDataSource(data_select)</button>
	<button id="btn_select_integer" class="Button">.select( 3 )</button>
	<button id="btn_select_id" class="Button">.select( { id : "opt25" } )</button>
</div>
```
	<button id="dropdownbutton_select" class="Dropdownbutton">DropDownButton</button>
	<ul></ul>
	<button id="btn_select_setDataSource" class="Button">setDataSource(data_select)</button>
	<button id="btn_select_integer" class="Button">.select( 3 )</button>
	<button id="btn_select_id" class="Button">.select( { id : "opt25" } )</button>
```
```
/***
 * id : li태그의 아이디 지정
 * text : a태그의 text로 지정.
 * link : a태그의 href로 지정.
 */
var data_select = [
	{id:"opt21", text: "선택 1"},
	{id:"opt22", text: "선택 2"},
	{id:"opt23", text: "선택 3"},
	{id:"opt24", text: "선택 4"},
	{id:"opt25", text: "선택 5"},
	{id:"opt26", text: "선택 6"}
];
$('#btn_select_setDataSource').click(function() {
    $('#dropdownbutton_select').setDataSource(data_select);
});

$('#btn_select_integer').click(function() {
    $('#dropdownbutton_select').select(3);
});
$('#btn_select_id').click(function() {
	$('#dropdownbutton_select').select({id: "opt25"});
});

```
</div>
<script>
/***
 * id : li태그의 아이디 지정
 * text : a태그의 text로 지정.
 * link : a태그의 href로 지정.
 */
var data_select = [
	{id:"opt21", text: "선택 1"},
	{id:"opt22", text: "선택 2"},
	{id:"opt23", text: "선택 3"},
	{id:"opt24", text: "선택 4"},
	{id:"opt25", text: "선택 5"},
	{id:"opt26", text: "선택 6"}
];
$('#btn_select_setDataSource').click(function() {
    $('#dropdownbutton_select').setDataSource(data_select);
});

$('#btn_select_integer').click(function() {
    $('#dropdownbutton_select').select(3);
});
$('#btn_select_id').click(function() {
	$('#dropdownbutton_select').select({id: "opt25"});
});
</script>