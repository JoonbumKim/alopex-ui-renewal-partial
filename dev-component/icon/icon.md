

<script type="text/javascript">
var icons = ['Glass', 'Music', 'Search', 'Envelope', 'Heart', 'Star', 'Star-empty', 'User', 'Film', 'Th-large', 'Th', 'Th-list', 'Ok', 'Remove', 'Zoom-in', 'Zoom-out', 'Off', 'Signal', 'Cog', 'Trash', 'Home',
           	'File', 'Time', 'Road', 'Download-alt', 'Download', 'Upload', 'Inbox', 'Play-circle', 'Repeat', 'Refresh', 'List-alt', 'Lock', 'Flag', 'Headphones', 'Volume-off', 'Volume-down', 'Volume-up', 'Qrcode', 'Barcode', 'Tag',
          	'Tags', 'Book', 'Bookmark', 'Print', 'Camera', 'Font', 'Bold', 'Italic', 'Text-height', 'Text-width', 'Align-left', 'Align-center', 'Align-right', 'Align-justify', 'List', 'Indent-left', 'Indent-right', 'Facetime-video', 'Picture', 'Pencil',
          	'Map-marker', 'Adjust', 'Tint', 'Edit', 'Share', 'Check', 'Move', 'Step-backward', 'Fast-backward', 'Backward', 'Play', 'Pause', 'Stop', 'Forward', 'Fast-forward', 'Step-forward', 'Eject', 'Chevron-left', 'Chevron-right', 'Plus-sign',
          	'Minus-sign', 'Remove-sign', 'Ok-sign', 'Question-sign', 'Info-sign', 'Screenshot', 'Remove-circle', 'Ok-circle', 'Ban-circle', 'Arrow-left', 'Arrow-right', 'Arrow-up', 'Arrow-down', 'Share-alt', 'Resize-full', 'Resize-small', 'Plus', 'Minus', 'Asterisk', 'Exclamation-sign',
          	'Gift', 'Leaf', 'Fire', 'Eye-open', 'Eye-close', 'Warning-sign', 'Plane', 'Calendar', 'Random',
          	'Comment', 'Magnet', 'Chevron-up', 'Chevron-down', 'Retweet', 'Shopping-cart', 'Folder-close',
          	'Folder-open', 'Resize-vertical', 'Resize-horizontal', 'Hdd', 'Bullhorn', 'Bell', 'Certificate', 'Thumbs-up', 'Thumbs-down', 'Hand-right', 'Hand-left', 'Hand-up', 'Hand-down', 'Circle-arrow-right', 'Circle-arrow-left', 'Circle-arrow-up', 'Circle-arrow-down', 'Globe', 'Wrench', 'Tasks', 'Filter', 'Briefcase', 'Fullscreen',
          	]
  $(document).ready(function() {
    var str = "";
    for(var i=0; i<icons.length; i++) {
      if(i%2 == 0){str += '<tr>';}
      str += '<td><span class="Icon ' + icons[i] + '"></span></td><td>' + icons[i] + '</td>';
      if(i%2 ==1){str += '</tr>';}
    }
    $('#iconList > tbody').html(str);
    $('#iconList').table();
  });
</script>




# Icon

## Basic

Icon 컴포넌트를 통해 Alopex UI에서 제공하는 아이콘을 활용할 수 있습니다.
span 태그로 구성되어 `class="Icon Icon-classname"` 속성을 통하여 원하는 아이콘을 설정할 수 있습니다.

<div class="eg">
<div class="egview">
<span class="Icon Plus-sign"></span>
</div>
```
<span class="Icon Plus-sign"></span>
```
</div>


### Supported icons

Alopex UI에서 지원하는 아이콘들입니다.

<style>
	.Table td{padding:10px;}
</style>
<table id="iconList" class="Table">
	<colgroup>
		<col style="width:40px;"/>
		<col />
		<col style="width:40px;"/>
		<col />
	</colgroup>
	<tbody>
	</tbody>
</table>


### Icon Buttons

Icon 컴포넌트가 버튼 내에 포함된 예제입니다. 이경우 data-position을 사용하여 아이콘의 위치를 지정할 수 있습니다.

<div class="eg">
<div class="egview">
	<button class="Button"><span class="Icon Plus-sign" data-position="left"></span>Add</button>
</div>

```
<button class="Button"><span class="Icon Plus-sign" data-position="left"></span>Add</button>
```
</div>

### Custom icons

새로운 아이콘을 정의하고자 할 경우, Icon 클래스 뒤에 새로운 을 입력하고 그에 해당하는 스타일을 정의하면 새로운 아이콘을 사용할 수 있습니다.

<style>
.Icon.Bluetooth {    
    background: url(icon/bluetooth.png) no-repeat;
    background-size: contain;
  }
</style>
<div class="eg">
<div class="egview">
<span class="Icon Bluetooth"></span>
</div>

```
<style>
.Icon.Bluetooth {    
    background: url(./bluetooth.png) no-repeat;
    background-size: contain;
  }
</style>
```
```
<span class="Icon Bluetooth"></span>
```
</div>
 
## Attributes
 
 
### class


- "Icon"  
	- Icon 컴포넌트를 사용한다고 명시하는 속성입니다.


- "Icon Icon-classname"  
  - 지원하는 icon이미지 (혹은 직접 만든 icon명) 의 class명.
```  
<span class="Icon Plus-sign" data-position="top"></span>	
```

### data-position

Button 컴포넌트 내에 icon 지정시 icon위치

- top
  - icon을 위쪽에 위치.
- bottom
  - icon을 아래쪽에 위치.
- left
  - icon을 왼쪽에 위치.
- right
  - icon을 오른쪽에 위치.      

<div class="eg">
<div class="egview">
	<button class="Button">text only</button>
	<button class="Button"><span class="Icon Plus-sign" data-position="top"></span>top</button>
	<button class="Button"><span class="Icon Plus-sign" data-position="bottom"></span>bottom</button>
	<button class="Button"><span class="Icon Plus-sign" data-position="left"></span>left</button>
	<button class="Button"><span class="Icon Plus-sign" data-position="right"></span>right</button>
</div>

```
<button class="Button">text only</button>
<button class="Button"><span class="Icon Plus-sign" data-position="top"></span>top</button>
<button class="Button"><span class="Icon Plus-sign" data-position="bottom"></span>bottom</button>
<button class="Button"><span class="Icon Plus-sign" data-position="left"></span>left</button>
<button class="Button"><span class="Icon Plus-sign" data-position="right"></span>right</button>
```
</div>

## Functions


### .setEnabled (isEnabled)

아이콘 컴포넌트의 활성화/비활성화를 동적으로 조정할 때 사용하는 함수입니다.

- parameter
	- isEnabled {Boolean} Required  
		- 설정된 값에 의해서 버튼이 활성화/비활성화 됩니다.

<div class="eg">
<div class="egview">
	<span id="icon0" class="Icon Plus-sign"></span>
	<button id="btn_setEabled" class="Button">Disable</button> 
</div>
```
<span id="icon0" class="Icon Plus-sign"></span>
<button id="btn_setEabled" class="Button">Disable</button> 
```
```
$(document).ready(function() {
      $('#btn_setEabled').click(disableAction);
    });

function disableAction() {
  if ($('#btn_setEabled').text() == 'Enable') {
    $('#icon0').setEnabled(true);
    $('#btn_setEabled').text('Disable');
  } else {
    $('#icon0').setEnabled(false);
    $('#btn_setEabled').text('Enable');
  }
}
```
</div>
<script>
 $(document).ready(function() {
      $('#btn_setEabled').click(disableAction);
    });

function disableAction() {
  if ($('#btn_setEabled').text() == 'Enable') {
    $('#icon0').setEnabled(true);
    $('#btn_setEabled').text('Disable');
  } else {
    $('#icon0').setEnabled(false);
    $('#btn_setEabled').text('Enable');
  }
}
</script>


## Extra Example

### GroupButton

<div class="eg">
<div class="egview">
  <div class="Groupbutton">
    <a class="Button">btn1<span class="Icon User" data-position="top"></span></a>
    <a class="Button">btn2<span class="Icon Star" data-position="top"></span></a>
    <a class="Button">btn3<span class="Icon Music" data-position="top"></span></a>
    <a class="Button">btn4<span class="Icon Envelope" data-position="top"></span></a>
  </div>
</div>
```
<div class="Groupbutton">
  <a class="Button">btn1<span class="Icon User" data-position="top"></span></a>
  <a class="Button">btn2<span class="Icon Star" data-position="top"></span></a>
  <a class="Button">btn3<span class="Icon Music" data-position="top"></span></a>
  <a class="Button">btn4<span class="Icon Envelope" data-position="top"></span></a>
</div>
```
</div>
  
### Tabs

<div class="eg">
<div class="egview">
  <div class="Tabs">
    <ul>
      <li data-content="#tab1"><span class="Icon Plus-sign" data-position="right"></span>tab1</li>
      <li data-content="#tab2"><span class="Icon Minus-sign" data-position="right"></span>tab2</li>
      <li data-content="#tab3"><span class="Icon Remove-sign" data-position="right"></span>tab3</li>
    </ul>
    <div id="tab1">
      <strong>tab1</strong>
    </div>
    <div id="tab2">
      <strong>tab2</strong>
    </div>
    <div id="tab3">
      <strong>tab3</strong>
    </div>
  </div>
</div>
```
<div class="Tabs">
  <ul>
    <li data-content="#tab1"><span class="Icon Plus-sign" data-position="right"></span>tab1</li>
    <li data-content="#tab2"><span class="Icon Minus-sign" data-position="right"></span>tab2</li>
    <li data-content="#tab3"><span class="Icon Remove-sign" data-position="right"></span>tab3</li>
  </ul>
  <div id="tab1">
    <strong>tab1</strong>
  </div>
  <div id="tab2">
    <strong>tab2</strong>
  </div>
  <div id="tab3">
    <strong>tab3</strong>
  </div>
</div>
```
</div>

### Paging

<div class="eg">
<div class="egview">
<div class="Paging" data-totalpage="19" data-button-behavior="disable">
    <a class="Link First"><span class="Icon Step-backward" ></span></a>
    <a class="Link Prev"><span class="Icon Chevron-left" ></span></a>
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a>
    <a class="Link Next"><span class="Icon Chevron-right" ></span></a>
    <a class="Link Last"><span class="Icon Step-forward" ></span></a>
</div></div>

```
<div class="Paging" data-totalpage="19" data-button-behavior="disable">
    <a class="Link First"><span class="Icon Step-backward" ></span></a>
    <a class="Link Prev"><span class="Icon Chevron-left" ></span></a>
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a>
    <a class="Link Next"><span class="Icon Chevron-right" ></span></a>
    <a class="Link Last"><span class="Icon Step-forward" ></span></a>
</div>
```
</div>