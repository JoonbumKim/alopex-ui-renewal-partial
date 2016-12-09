

# ToolTip

## Basic

<a target="_blank" href="http://en.wikipedia.org/wiki/Tooltip" title="Wikipedia Tooltip">Tooltip</a>은 
element에 마우스가 이동했을 때 설명이나 간단한 도움말을 보여주는 컴포넌트입니다.

Alopex UI에서 제공하는 ToolTip 컴포넌트를 선언하는 방식에는 두가지가 있습니다.

### title 속성값 이용

이 방식은 title 속성값을 가진 모든 html 태그에 적용할 수 있습니다. 이 경우, ToolTip은 텍스트를 가지고 있는 형태를 가집니다.<br>
아래 예제처럼 title 속성을 가진 HTML 엘리먼트를 선택한 이후 tooltip 함수를 실행합니다.

```
$('[title]').tooltip();
```

아래 예제에서는 "WHO"와 "Alopex UI" 부분이 title 속성을 가진 태그의 내용입니다.

<div class="eg">
<div class="egview">
<abbr title="World Health Organization">WHO</abbr> was founded in 1948.
<a title="World No.1 HTML5 UI Framework">Alopex UI</a>
</div>
```
$(document).ready(function() {
  $('[title]').tooltip();
});
```
```
<abbr title="World Health Organization">WHO</abbr> was founded in 1948.
<a title="World No.1 HTML5 UI Framework">Alopex UI</a>
```
</div>

<script type="text/javascript">
	$(document).ready(function() {
	  $('[title]').tooltip();
	});
</script>

### HTML 마크업 이용

ToolTip의 마크업을 따로 구성할 수 있습니다.

<div class="eg">
<div class="egview">
<button class="Button">click</button>
<div class="Tooltip">button</div>
</div>

```
<button class="Button">click</button>
<div class="Tooltip">button</div>
```
</div>




>기본적으로 hover가 제대로 동작하지 않는 터치 기반 디바이스에서도 지원됩니다.
>모바일 기기의 경우, base element를 한번 클릭하면 툴팁이 화면에 열리고, 다른 영역을 클릭할 시 자동으로 닫힙니다.




## Attributes


### data-base


- css selector
	- ToolTip 컴포넌트의 베이스가 되는 HTML element를 지정하는 속성입니다.
	>여러 개의 element를 지정하는 selector의 사용은 오작동을 일으킬 수 있습니다. (Ex. "[data-type]")

아래 예제처럼 div 태그로 ToolTip의 마크업을 작성하고 data-type 속성을 지정합니다.

<div class="eg">
<div class="egview">
<input id="textinput" type="text" class="Textinput">
<input id="radio" type="radio" class="Radio">
<input id="checkbox" type="checkbox" class="Checkbox">

<div class="Tooltip" data-base="#textinput">textinput</div>
<div class="Tooltip" data-base="#radio">radio</div>
<div class="Tooltip" data-base="#checkbox">checkbox</div>
</div>

```
<input id="textinput" type="text" class="Textinput">
<input id="radio" type="radio" class="Radio">
<input id="checkbox" type="checkbox" class="Checkbox">

<div class="Tooltip" data-base="#textinput">textinput</div>
<div class="Tooltip" data-base="#radio">radio</div>
<div class="Tooltip" data-base="#checkbox">checkbox</div>
```
</div>
<br>
이 방식을 이용하여 다양한 html element에 ToolTip을 추가할 수 있습니다.
기본적으로 ToolTip div element 바로 이전 HTML element를 ToolTip base로 지정합니다.
>ToolTip 이전에 base를 지정하지 못할 경우, 위 예제와 같이 data-base 속성을 이용하여 ToolTip base를 지정할 수 있습니다.


### data-position

- top | bottom | left | right
	- tooltip의 위치를 지정하는 속성입니다. base 엘리먼트를 기준으로 정해지는 위치입니다.<br>
	>이 속성이 지정되지 않는 경우에는 bottom > top > left > right 순으로 화면을 벗어나지 않는 위치가 지정됩니다.

툴팁의 위치를 data-position 속성을 이용하여 지정할 수 있습니다.<br> 
data-position 속성을 지정하지 않을 경우, bottom > top > right > left 순으로 위치값이 지정됩니다.

<div class="eg">
<div class="egview">
<button class="Button">tooltip on top</button>
<div class="Tooltip" data-position="top">tooltiop on top</div>

<button class="Button">tooltip on bottom</button>
<div class="Tooltip" data-position="bottom">tooltiop on bottom</div>

<button class="Button">tooltip on left</button>
<div class="Tooltip" data-position="left">tooltiop on left</div>

<button class="Button">tooltip on right</button>
<div class="Tooltip" data-position="right">tooltiop on right</div>
</div>

```
<button class="Button">tooltip on top</button>
<div class="Tooltip" data-position="top">tooltiop on top</div>

<button class="Button">tooltip on bottom</button>
<div class="Tooltip" data-position="bottom">tooltiop on bottom</div>

<button class="Button">tooltip on left</button>
<div class="Tooltip" data-position="left">tooltiop on left</div>

<button class="Button">tooltip on right</button>
<div class="Tooltip" data-position="right">tooltiop on right</div>
```
</div>

### data-tooltip-trigger

- {event type}
	- ToolTip을 trigger하는 이벤트를 지정합니다.
<div class="eg">
<div class="egview">
	<div class="Margin-bottom-10">
		<button class="Button">click tooltip</button>
		<div class="Tooltip" data-tooltip-trigger="click">click</div>
	</div>
	<div>
		<button class="Button">double-click tooltip</button>
		<div class="Tooltip" data-tooltip-trigger="dblclick">double-click</div>
	</div>
</div>
```
<button class="Button">click tooltip</button>
<div class="Tooltip" data-tooltip-trigger="click">click</div>

<button class="Button">double-click tooltip</button>
<div class="Tooltip" data-tooltip-trigger="dblclick">double-click</div>
```
</div>

### data-animation

- slide | fade
	- ToolTip이 나타나고 사라질 때의 animation 효과를 지정합니다.


### data-animationtime

- {integer}
	- animation의 duration을 지정합니다. default 값은 300입니다.


<div class="eg">
<div class="egview">
<button class="Button">slide</button>
<div class="Tooltip" data-animation="slide">slide tooltip</div>

<button class="Button">fade</button>
<div class="Tooltip" data-animation="fade">fade tooltip!</div>
</div>

```
<button class="Button">slide</button>
<div class="Tooltip" data-animation="slide">slide tooltip</div>

<button class="Button">fade</button>
<div class="Tooltip" data-animation="fade">fade tooltip!</div>
```
</div>
	
### data-open-callback 
- {string}
	- ToolTip이 열릴 때 호출되는 콜백 함수명을 지정합니다.
	
### data-close-callback 
- {string}
	- ToolTip이 닫힐 때 호출되는 콜백 함수명을 지정합니다.

<div class="eg">
<div class="egview">
<button class="Button">콜백 함수</button>
<div class="Tooltip" data-open-callback="openCallback" data-close-callback="closeCallback">툴팁</div>
</div>
```
<button class="Button">콜백 함수</button>
<div class="Tooltip" data-open-callback="openCallback" data-close-callback="closeCallback">툴팁</div>

```
```
function openCallback() {
  alert('opened');
}
function closeCallback() {
  alert('closed');
}
```
</div>

<script>
function openCallback() {
  alert('opened');
}
function closeCallback() {
  alert('closed');
}
</script>

## Functions

### .open(callback)

ToolTip을 표시하는 함수입니다.

- parameter
	- callback {function} Optional
		- Tooltip이 생성된 이후 호출되는 콜백 함수

### .close(callback)

ToolTip을 닫는 함수입니다.

- parameter
	- callback {function} Optional
		- Tooltip이 닫힌 이후 호출되는 콜백 함수


	
### .toggle(callback)

ToolTip의 상태를 전환하는 함수입니다. ToolTip이 열린 상태면 close 함수를, 닫힌 상태에는 open 함수를 호출합니다.

- parameter
	- callback {function} Optional
		- 콜백 함수
	
<div class="eg">
<div class="egview">
	<button id="open" class="Button">open</button>
	<button id="close" class="Button">close</button>
	<button id="toggle" class="Button">toggle</button>
	<hr>
	<input type="text" class="Textinput">
	<div id="tooltip1" class="Tooltip">function tooltip</div>
</div>
```
<button id="open" class="Button">open</button>
<button id="close" class="Button">close</button>
<button id="toggle" class="Button">toggle</button>
<hr>
<input type="text" class="Textinput">
<div id="tooltip1" class="Tooltip">function tooltip</div>
</div>
```
```
$(document).ready(function() {
    $('#open').click(function() {
      $('#tooltip1').open();
    });
    $('#close').click(function() {
      $('#tooltip1').close();
    });
    $('#toggle').click(function() {
      $('#tooltip1').toggle();
    });
  });
```
</div>

<script type="text/javascript">
  $(document).ready(function() {
    $('#open').click(function() {
      $('#tooltip1').open();
    });
    $('#close').click(function() {
      $('#tooltip1').close();
    });
    $('#toggle').click(function() {
      $('#tooltip1').toggle();
    });
  });
</script>



## Extra Example

### Custom Styling

<style>
.List.customlist1, .List.customlist1 li{background:transparent;}
.List.customlist1, .List.customlist1 * {color:#bbb;border:0;}
.Tooltip.bg1 { background: #F5F3C9; padding:20px;color:#000;}
.Tooltip.bg1:before {border-bottom: 6px solid #F5F3C9;}
.info {margin-left:15px;}
.info td:first-child {font-weight:bold;}
</style>

<div class="eg">
<div class="egview">
<div class="Margin-bottom-10">
	
	<span>예제 1 : </span>
	<button class="Button">list in tooltip</button>
	<div class="Tooltip" style="width:200px;">
		<ul class="List customlist1">
			<li style="padding:0px;">
				<img src="tooltip/images/tooltipEx1_1.jpg">
				<div><strong>Thousand Years</strong></div>
				<div>List Description</div>
			</li>
			<li style="padding:0px;">
				<img src="tooltip/images/tooltipEx1_2.jpg">
				<div><strong>Spicytunas</strong></div>
				<div>spicytunas.com</div>
			</li>
		</ul> 
	</div>
	
	<span>예제 2 : </span>
	<button class="Button">table in tooltip</button>
	<div class="Tooltip bg1"  style="width:auto;">
		<div style="display:-webkit-box;">
			<img style="height:100px" src="tooltip/images/tooltipEx2.jpg">
			<table class="info">
				<colgroup>
					<col style="width:30%;"/>
					<col />
				</colgroup>
				<tr>
					<td>Address</td>
					<td>253 Withersppon Street Princeton, NH</td>
				</tr>
				<tr>
					<td>Family Role</td>
					<td>Adult</td>
				</tr>
				<tr>
					<td>Email</td>
					<td><a>house@exmaple.com</a></td>
				</tr>
				<tr>
					<td>Member Status</td>
					<td>Member</td>
				</tr>
				<tr>
					<td>Marital Status</td>
					<td>Single</td>
				</tr>
				<tr>
					<td>Age</td>
					<td>42</td>
				</tr>
			</table>
		</div>
	</div>
</div>
</div>
```
<style>
.List.customlist1, .List.customlist1 li{background:transparent;}
.List.customlist1, .List.customlist1 * {color:#bbb;border:0;}
.Tooltip.bg1 { background: #F5F3C9; padding:20px;color:#000;}
.Tooltip.bg1:before {border-bottom: 6px solid #F5F3C9;}
.info {margin-left:15px;}
.info td:first-child {font-weight:bold;}
</style>
```
```

<span>예제 1 : </span>
<button class="Button">list in tooltip</button>
<div class="Tooltip" style="width:200px;">
	<ul class="List customlist1">
		<li style="padding:0px;">
			<img src="tooltip/images/tooltipEx1_1.jpg">
			<div><strong>Thousand Years</strong></div>
			<div>List Description</div>
		</li>
		<li style="padding:0px;">
			<img src="tooltip/images/tooltipEx1_2.jpg">
			<div><strong>Spicytunas</strong></div>
			<div>spicytunas.com</div>
		</li>
	</ul> 
</div>

<span>예제 2 : </span>
<button class="Button">table in tooltip</button>
<div class="Tooltip bg1"  style="width:auto;">
	<div style="display:-webkit-box;">
		<img style="height:100px" src="tooltip/images/tooltipEx2.jpg">
		<table class="info">
			<colgroup>
				<col style="width:30%;"/>
				<col />
			</colgroup>
			<tr>
				<td>Address</td>
				<td>253 Withersppon Street Princeton, NH</td>
			</tr>
			<tr>
				<td>Family Role</td>
				<td>Adult</td>
			</tr>
			<tr>
				<td>Email</td>
				<td><a>house@exmaple.com</a></td>
			</tr>
			<tr>
				<td>Member Status</td>
				<td>Member</td>
			</tr>
			<tr>
				<td>Marital Status</td>
				<td>Single</td>
			</tr>
			<tr>
				<td>Age</td>
				<td>42</td>
			</tr>
		</table>
	</div>
</div>
```
```
$(document).ready(function() {
    $('#btn1').click(getText);
    $('#btn2').click(setText);
  });

  function getText() {
    $('#text0').text($('#btn0').text());
  };

  function setText() {
    $('#btn0').text($('#text1').val());
  };
```
</div>
<script type="text/javascript">
  $(document).ready(function() {
    $('#btn1').click(getText);
    $('#btn2').click(setText);
  });

  function getText() {
    $('#text0').text($('#btn0').text());
  };

  function setText() {
    $('#btn0').text($('#text1').val());
  };
</script>