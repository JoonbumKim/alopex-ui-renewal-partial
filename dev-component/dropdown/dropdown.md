

# Dropdown

## Basic

Dropdown 컴포넌트는 base element와 함께 동작합니다.
base element는 Dropdown 컴포넌트 이전의 element를 지칭하며
layout 구성상, Dropdown 컴포넌트 이전에 base element가 위치하지 못할 경우, data-base 속성을 이용하여 base를 지정할 수 있습니다.

<div class="eg">
<div class="egview">
<button class="Button">button</button>
<ul class="Dropdown">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
</div>

```
<button class="Button">button</button>
<ul class="Dropdown">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
</div>

### Textinput

Textinput 컴포넌트와 연동한 예제입니다.

<div class="eg">
<div class="egview">
<input class="Textinput">
<ul class="Dropdown">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
</div>
```
<input class="Textinput">
<ul class="Dropdown">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
</div>


### Grouping Menu

각 메뉴를 나타내는 &lt;li&gt; 태그에 "Header" 클래스를 추가함으로써 메뉴별로 그룹핑 할 수 있습니다.
&lt;hr&gt; 태그와 함께 사용하여 divider로 사용할 수 있습니다.

<div class="eg">
<div class="egview">
<button class="Button">button</button>
<ul class="Dropdown">
    <li class="Header"><a>Group 1</a> </li>
    <li><a>option 1</a></li>
    <li><a>option 2</a></li>
    <li class="Divider">
        <hr>
    </li>
    <li class="Header"><a>Group 2</a></li>
    <li><a>option 3</a></li>
    <li><a>option 4</a></li>
</ul>
</div>
```
<button class="Button">button</button>
<ul class="Dropdown">
    <li class="Header"><a>Group 1</a></li>
    <li><a>option 1</a></li>
    <li><a>option 2</a></li>
    <li class="Divider">
        <hr>
    </li>
    <li class="Header"><a>Group 2</a></li>
    <li><a>option 3</a></li>
    <li><a>option 4</a></li>
</ul>
```
</div>

### Multi Depth

다중 depth를 가지고 있는 메뉴의 경우 &lt;li&gt; 태그의 하위 element로 &lt;ul&gt; 태그를 지정합니다.<br>
하위 element에 해당하는 메뉴는 hover 상태에 열립니다.

<div class="eg">
<div class="egview">
<button class="Button">button</button>
<ul class="Dropdown">
	<li>
		<a>option 1</a>
		<ul>
			<li><a>option 1-1</a></li>
			<li><a>option 1-2</a></li>
		</ul>
	</li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
</div>

```
<button class="Button">button</button>
<ul class="Dropdown">
	<li>
		<a>option 1</a>
		<ul>
			<li><a>option 1-1</a></li>
			<li><a>option 1-2</a></li>
		</ul>
	</li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
</div>


### Keyboard Support

키보드를 통해서 Dropdown 메뉴를 선택 및 이동할 수 있습니다.
Key 정보는 아래와 같습니다.


|  Keyboard | 설명 | 비고 |
| -------- | --- | --- |
| Enter, ↓(Down) | Dropdown 위젯을 엽니다. | base 엘리먼트에 포커스가 가 있는 경우 |
| Enter | Dropdown 내 해당 메뉴를 선택합니다. | base 엘리먼트에 포커스가 가 있고 특정 메뉴가 선택되어 있는 경우 |
| Esc | Dropdown 위젯을 닫습니다. | Dropdown 위젯이 열린 경우|
| ↑(Up), ↓(Down), ←(Left), →(Right) | 메뉴 아이템 간 이동 | Dropdown 위젯이 열린 경우 |



## Attributes


### data-open-trigger

- event name
	- 	Dropdown 메뉴를 여는 이벤트를 지정합니다.
	-	default 설정 : data-open-trigger='click' / data-close-trigger='click' 또는 해당 엘리먼트 밖에서 임의의 클릭 발생 시 닫힘

<div class="eg">
	<div class="egview">
		<button class="Button" >'mouseover' open / 'click' close</button>
		<ul class="Dropdown" data-open-trigger="mouseover">
			<li><a>option 1</a></li>
			<li><a>option 2</a></li>
			<li><a>option 3</a></li>
			<li><a>option 4</a></li>
		</ul>
	</div>

```
<!-- Default로 click 이벤트에 등록된 dropdown open 핸들러를 다른 이벤트로 변경할 수 있습니다.
 마우스오버 이벤트 발생시에 Dropdown 컴포넌트가 나타나도록 설정한 예제입니다. -->
	<button class="Button" >'mouseover' open / 'click' close</button>
	<ul class="Dropdown" data-open-trigger="mouseover">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
```
</div>

### data-close-trigger

- event name
	- 	Dropdown 메뉴를 닫는 이벤트를 지정합니다.
	-	default 설정 : data-open-trigger='click' / data-close-trigger='click' 또는 해당 엘리먼트 밖에서 임의의 클릭 발생 시 닫힘

<div class="eg">
<div class="egview">
<button class="Button" >'mouseover' open / 'mouseleave' close</button>
<ul class="Dropdown" data-open-trigger="mouseover" data-close-trigger="mouseleave">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
</div>

```
<button class="Button" >'mouseover' open / 'mouseleave' close</button>
<ul class="Dropdown" data-open-trigger="mouseover" data-close-trigger="mouseleave">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
</div>

### data-base

- selector
	- Dropdown의 base 엘리먼트를 참조할 수 있는 selector를 지정합니다.

<div class="eg">
<div class="egview">
	<div class="Groupbutton">
		<a class="Button">확인</a>
		<a id="menu-trigger" class="Button">선택</a>
	</div>
	<ul class="Dropdown" data-base="#menu-trigger">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
</div>
```
<div class="Groupbutton">
	<a class="Button">확인</a>
	<a id="menu-trigger" class="Button">선택</a>
</div>
<ul class="Dropdown" data-base="#menu-trigger">
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
	- 이 속성이 지정되지 않는 경우에는 bottom > top > left > right 순으로 화면을 벗어나지 않는 위치가 지정됩니다. (default 값은 bottom 입니다.)

<div class="eg">
<div class="egview">
	<button class="Button">right</button>
	<ul class="Dropdown" data-position="right">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
	</ul>
	<button class="Button">top</button>
	<ul class="Dropdown" data-position="top">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
	</ul>
	<button class="Button Float-right">left</button>
	<ul class="Dropdown" data-position="left">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
	</ul>
</div>
```
<button class="Button">right</button>
<ul class="Dropdown" data-position="right">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
</ul>
<button class="Button">top</button>
<ul class="Dropdown" data-position="top">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
</ul>
<button class="Button">left</button>
<ul class="Dropdown" data-position="left">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
</ul>
```
</div>



## Functions


### .close()

드랍다운 메뉴를 닫는 API입니다.


### .toggle()

드랍다운 메뉴를 toggle하는 API입니다.

### .open()

정적 element를 base로 하여 드랍다운 메뉴를 여는 API입니다.  
data-base 속성에 설정된 대상 element가 정적 element에 해당합니다.  
data-base 속성을 사용하지 않은 경우는 base element는 Dropdown 컴포넌트 이전의 element를 지칭합니다. 

<div class="eg">
<div class="egview">
	<input id="dropdownInput" class="Textinput">
	<button id="btn_openDropDown" class="Button">open()</button>
	<button id="btn_closeDropDown" class="Button">close()</button>
	<button id="btn_toggleDropDown" class="Button">toggle()</button>
	<ul id="dropdown1" class="Dropdown" data-base="#dropdownInput">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
</div>

```
<input id="dropdownInput" class="Textinput">
<button id="btn_openDropDown" class="Button">open()</button>
<button id="btn_closeDropDown" class="Button">close()</button>
<button id="btn_toggleDropDown" class="Button">toggle()</button>
<ul id="dropdown1" class="Dropdown" data-base="#dropdownInput">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
```
<script>
$('#btn_openDropDown').click(function() {
    $('#dropdown1').open();
});

$('#btn_closeDropDown').click(function() {
    $('#dropdown1').close();
});

$('#btn_toggleDropDown').click(function() {
    $('#dropdown1').toggle();
});
</script>
```
</div>

<script>
$('#btn_openDropDown').click(function() {
    $('#dropdown1').open();
});

$('#btn_closeDropDown').click(function() {
    $('#dropdown1').close();
});

$('#btn_toggleDropDown').click(function() {
    $('#dropdown1').toggle();
});
</script>


### .open(selector)

지정한 요소를 Base로 동적 설정 하여 드랍다운 메뉴를 여는 API입니다.  

- parameter
	- selector {string} Optional	

<div class="eg">
<div class="egview">
	기존의 Base : <input id="baseBefore" class="Textinput"/>
	<ul id="dropdownDynamic" class="Dropdown">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
	<button id="btn_addDynamicInput" class="Button Margin-left-10">input 동적생성 및 Base 변경 후 open</button>
	<div id="div01" class="Margin-top-10"></div>
</div>

```
	기존의 Base : <input id="baseBefore" class="Textinput"/>
	<ul id="dropdownDynamic" class="Dropdown">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
	<button id="btn_addDynamicInput" class="Button Margin-left-10">input 동적생성 및 Base 변경 후 open</button>
	<div id="div01" class="Margin-top-10"></div>
```
```
<script>
$('#btn_addDynamicInput').click(function() {
	var html = '변경된 Base : <input id="baseAfter" class="Textinput"/> <span id="span01" class="Margin-left-10"></span>';
	$("#div01").html(html);
	$("#dropdownDynamic").open("#baseAfter"); // 지정한 요소를 base로 동적 설정
	$("#span01").text('Dropdown이 변경된 Base에서 동작합니다. 기존의 Base는 더이상 동작하지 않습니다.');
});
</script>
```
</div>

<script>
$('#btn_addDynamicInput').click(function() {
	var html = '변경된 Base : <input id="baseAfter" class="Textinput"/> <span id="span01" class="Margin-left-10"></span>';
	$("#div01").html(html);
	$("#dropdownDynamic").open("#baseAfter"); // 지정한 요소를 base로 동적 설정
	$("#span01").text('Dropdown이 변경된 Base에서 동작합니다. 기존의 Base는 더이상 동작하지 않습니다.');
});
</script>



### .addHandler(callback)

드랍다운 메뉴의 옵션이 선택될 경우 호출되는 콜백함수를 등록합니다.

- parameter
	- callbackHandler {function} Required  

> Button 위젯과 Dropdown 위젯을 활용하여 HTML select 엘리먼트을 구현한 예제입니다. 또한 이 예제와 동일한 형태가 'dropdownbutton' 이름으로 제공됩니다.

<div class="eg">
<div class="egview">
	<button class="Button" id="dropdownBtn">Dropdown</button>
	<ul id="dropdown2" class="Dropdown">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
	<button class="Dropdownbutton">Dropdownbutton</button>
	<ul class="Dropdown">
		<li><a>option 1</a></li>
		<li><a>option 2</a></li>
		<li><a>option 3</a></li>
		<li><a>option 4</a></li>
	</ul>
</div>		
```
<button class="Button" id="dropdownBtn">Dropdown</button>
<ul id="dropdown2" class="Dropdown">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
<button class="Dropdownbutton">Dropdownbutton</button>
<ul class="Dropdown">
	<li><a>option 1</a></li>
	<li><a>option 2</a></li>
	<li><a>option 3</a></li>
	<li><a>option 4</a></li>
</ul>
```
```
 $('#dropdown2').addHandler(function(e){
    var menu = e.data.element; // 드랍다운 메뉴 위젯 엘리먼트를 위와 같이 지정할 수 있습니다.
    var li = e.currentTarget; // 드랍다운 메뉴 옵션(li 태그)
    var text = $(li).text();
    if(menu.base.update != "false") {
      $(menu.base).text(text);
    }
  });
```
</div>
<script>
$('#dropdownBtn').click(function() {
	$('#dropdown2').addHandler(function(e){
	    var menu = e.data.element;
	    var li = e.currentTarget;
	    var text = $(li).text();
	    if(menu.base.update != "false") {
	      $(menu.base).text(text);
	    }
	  });
});



</script>


### .setDataSource(data)

드랍다운 메뉴의 데이터를 지정합니다.

- parameter
	- data {array} Required  

<div class="eg">
<div class="egview">
	<button id="btn_makeDropdown" class="Button">DropDown</button>
	<ul id="dropdownInput2" class="Dropdown"></ul>
	<button id="btn_setDataSource" class="Button">setDataSource(data)</button>
</div>
```
<button id="btn_makeDropdown" class="Button">DropDown</button>
<ul id="dropdownInput2" class="Dropdown"></ul>
<button id="btn_setDataSource" class="Button">setDataSource(data)</button>

```
```
/***
 * id : li태그의 아이디 지정
 * text : a태그의 text로 지정.
 * link : a태그의 href로 지정.
 */
var data = [
	{id:"opt1", text: "Alopex UI", link: "http://ui.alopex.io/"},
	{id:"opt2", text: "Alopex Grid", link: "http://grid.alopex.io/"},
	{id:"opt3", text: "Alopex IDE", link: "http://ide.alopex.io/"}
];
$('#btn_setDataSource').click(function() {
    $('#dropdownInput2').setDataSource(data);
});

```
</div>
<script>
var data = [
	{id:"opt1", text: "Alopex UI", link: "http://ui.alopex.io/"},
	{id:"opt2", text: "Alopex Grid", link: "http://grid.alopex.io/"},
	{id:"opt3", text: "Alopex IDE", link: "http://ide.alopex.io/"}
];
$('#btn_setDataSource').click(function() {
    $('#dropdownInput2').setDataSource(data);
});

</script>



### .getDataSource()

드랍다운 메뉴에서 .setDataSource(data) API를 통해 데이터를 지정한 경우에 대하여, 해당 데이터를 가져옵니다.
 

<div class="eg">
<div class="egview">

	<button id="btn_getDataSource_base2" class="Button">DropDown</button>
	<ul id="dropdown_getDataSource2" class="Dropdown"></ul>
	<button id="btn_setDataSource2" class="Button">setDataSource(data)</button>
	<button id="btn_getDataSource2" class="Button">getDataSource()</button>
</div>
```
	<button id="btn_getDataSource_base2" class="Button">DropDown</button>
	<ul id="dropdown_getDataSource2" class="Dropdown"></ul>
	
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
    $('#dropdown_getDataSource2').setDataSource(data_getDataSource2);
});
$('#btn_getDataSource2').click(function() {
	var data = $('#dropdown_getDataSource2').getDataSource();
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
    $('#dropdown_getDataSource2').setDataSource(data_getDataSource2);
});
$('#btn_getDataSource2').click(function() {
	var data = $('#dropdown_getDataSource2').getDataSource();
	alert(JSON.stringify(data));
});

</script>


### .select(target)

드랍다운 메뉴를 동적 선택 합니다.  
.select(0) 과 같이 integer 타입을 사용한 경우, 0번째 요소가 동적 선택 됩니다.  
.select({id: "opt1"}) 과 같이 object 타입으로 id 정보를 넘길 경우, 해당 id를 갖는 요소가 동적 선택 됩니다.  
.addHandler() 를 통해 선택한 요소에 대한 텍스트 값을 바꿀 수 있습니다.
 
- parameter
	- target {integer|object} Required


<div class="eg">
<div class="egview">
	<button class="Button">Dropdown</button>
	<ul id="dropdown_select" class="Dropdown"></ul>
	<button id="btn_select_setDataSource" class="Button">setDataSource(data_select)</button>
	<button id="btn_select_integer" class="Button">.select( 3 )</button>
	<button id="btn_select_id" class="Button">.select( { id : "opt25" } )</button>
</div>
```
	<button class="Button">Dropdown</button>
	<ul id="dropdown_select" class="Dropdown"></ul>
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
    $('#dropdown_select').setDataSource(data_select);
    
     $('#dropdown_select').addHandler(function(e){
    	var menu = e.data.element; // 드랍다운 메뉴 위젯 엘리먼트를 위와 같이 지정할 수 있습니다.
    	var li = e.currentTarget; // 드랍다운 메뉴 옵션(li 태그)
    	var text = $(li).text();
    	if(menu.base.update != "false") {
      		$(menu.base).text(text);
    	}
  });
});

$('#btn_select_integer').click(function() {
    $('#dropdown_select').select(3);
});
$('#btn_select_id').click(function() {
	$('#dropdown_select').select({id: "opt25"});
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
    $('#dropdown_select').setDataSource(data_select);
    
     $('#dropdown_select').addHandler(function(e){
    	var menu = e.data.element; // 드랍다운 메뉴 위젯 엘리먼트를 위와 같이 지정할 수 있습니다.
    	var li = e.currentTarget; // 드랍다운 메뉴 옵션(li 태그)
    	var text = $(li).text();
    	if(menu.base.update != "false") {
      		$(menu.base).text(text);
    	}
  });
});

$('#btn_select_integer').click(function() {
    $('#dropdown_select').select(3);
});
$('#btn_select_id').click(function() {
	$('#dropdown_select').select({id: "opt25"});
});
</script>



