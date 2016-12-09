

# Dialog

## Basic

Dialog 컴포넌트 사용방법에는 마크업에 속성을 적용한 다이얼로그 사용법과 open 함수를 이용한 다이얼로그 사용법이 있습니다.

### HTML 마크업을 이용한 Dialog

HTML 마크업 속성을 이용한 다이얼로그 사용 예제입니다.<br>
위치값(left, top)을 명시하지 않은 Dialog의 기본 위치는 화면 중앙이며, 컨텐츠 영역은 필수로 명시해야합니다. <br>
컨텐츠 영역은 Theme 사용시에는 class 를 <b>Dialog-contents</b> 로 하며 ,Theme를 사용하지 않을 시에는<b> contents </b>로 명시합니다.<br>
또한, Dialog을 open시에 기본 width와 height는 필수로 입력 해야 합니다.(resize시 기준점)
<div class="eg">
<div class="egview"> 
<button id="buttonId" class="Button">open</button> 
<div id="dialogId" class="Dialog" data-dialog-type="blank" data-resizable="true">
	<div class="Dialog-contents">컨텐츠 영역 입니다.</div>
</div></div>

```
<button id="buttonId" class="Button">open</button> 
<div id="dialogId" class="Dialog" data-dialog-type="blank" data-resizable="true">
	<div class="Dialog-contents">컨텐츠 영역 입니다.</div>
</div>
```
```
$('#buttonId').click(function() {
    $('#dialogId').open({
	  title:"Basic",
	  width: 270,
	  height: 270
	});
});
```
</div>

<script>
$('#buttonId').click(function() {
    $('#dialogId').open({
		title:"Basic",
		width: 270,
		height: 270
	});
});
</script>

### 함수를 이용한 Dialog

다이얼로그 open시 설정한 옵션에 의해서 동작하는 다이얼로그 입니다.
<div class="eg">
<div class="egview"> 
<div>
	<button id="buttonId2" class="Button">open</button> 
	<div id="dialogId2" class="Dialog">
		<div class="Dialog-contents">컨텐츠 영역 입니다.</div>
	</div>
</div></div>

```
<div>
	<button id="buttonId2" class="Button">open</button> 
	<div id="dialogId2" class="Dialog">
		<div class="Dialog-contents">컨텐츠 영역 입니다.</div>
	</div>
</div>

$('#buttonId2').bind('click', function() {
    $('#dialogId2').open({
      title:"Basic",
      left:50,
      top:50,
      width: 270,
	  height: 270,
      type:"close",
      resizable:true,
      movable:true,
      modal:false,
      animation:"fade",
      animationtime:200,
      alias: "flag1",
      xButtonClickCallback : function(el){ // 우측 상단 X 버튼으로 닫을 경우 동작하는 콜백
                  if(el.alias === "flag1"){
                      if(confirm("저장되지 않은 데이터가 있습니다. 창을 닫으시겠습니까?")){
                          return true; // true를 return 시, 내부적으로 close 동작이 자동 수행됩니다.
                      }else{
                          return false; // false를 return 시, 내부적으로 close하는 동작을 제어 합니다.
                      }
                  }
        }
    });
  });
```
</div>
<script>
$('#buttonId2').bind('click', function() {
    $('#dialogId2').open({
      title:"Basic",
      left:50,
      top:50,
      width: 270,
	  height: 270,
      type:"close",
      resizable:true,
      movable:true,
      modal:false,
      animation:"fade",
      animationtime:200,
      alias: "flag1",
      xButtonClickCallback : function(el){ // 우측 상단 X 버튼으로 닫을 경우 동작하는 콜백
                  if(el.alias === "flag1"){
                      if(confirm("저장되지 않은 데이터가 있습니다. 창을 닫으시겠습니까?")){
                          return true; // true를 return 시, 내부적으로 close 동작이 자동 수행됩니다.
                      }else{
                          return false; // false를 return 시, 내부적으로 close하는 동작을 제어 합니다.
                      }
                  }
        }
    });
  });
</script> 
		
### Keyboard Support

키보드를 통해서 Dialog를 제어 할 수 있습니다. Key 정보는 아래와 같습니다.
<table class="Table">
    <colgroup>
        <col />
        <col />
        <col />
    </colgroup>
    <thead>
        <tr>
            <th>Keyboard</th>
            <th>설명</th>
            <th>비고</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Tab, Shift+Tab</td>
            <td>Page 내의 다음, 이전 Element로 이동</td>
            <td></td>
        </tr>
        <tr>
            <td>ESC</td>
            <td>다이얼로그 종료</td>
            <td>Callback함수 동작없이 just close</td>
        </tr>
        <tr>
            <td>Enter, Space</td>
            <td>포커스된 버튼 누르기</td>
            <td></td>
        </tr>
    </tbody>
</table>
## Attributes
 

### data-dialog-type

- null : default
	- 커스터마이징된 헤더와 컨텐츠, 푸터를 사용할 때는 data-dialog-type 속성에 아무 값도 선언하지 않으면 됩니다.
- "blank"
	- 헤더만 포함된 기본 테마 다이얼로그 컴포넌트를 사용한다고 명시하는 속성입니다. 
- "close"
	- Close 버튼이 포함된 기본테마 다이얼로그 컴포넌트를 사용한다고 명시하는 속성입니다. 
- "confirm"
	- Confirm 버튼이 포함 기본테마 다이얼로그 컴포넌트를 사용한다고 명시하는 속성입니다.
- "okcancel"
	- OK, CANCEL버튼 포함 기본테마 다이얼로그 컴포넌트를 사용한다고 명시하는 속성입니다.

<div class="eg">
<div class="egview"> 
	<button id="buttonA" class="Button">Blank</button> 
	<button id="buttonB" class="Button">Close</button> 
	<button id="buttonC" class="Button">Confirm</button> 
	<button id="buttonD" class="Button">OkCancel</button> 
	<div id="dialogA" class="Dialog" data-dialog-type="blank"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
	<div id="dialogB" class="Dialog" data-dialog-type="close"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
	<div id="dialogC" class="Dialog" data-dialog-type="confirm"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
	<div id="dialogD" class="Dialog" data-dialog-type="okcancel"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
</div>
```
<button id="buttonA" class="Button">Blank</button> 
<button id="buttonB" class="Button">Close</button> 
<button id="buttonC" class="Button">Confirm</button> 
<button id="buttonD" class="Button">OkCancel</button> 
<div id="dialogA" class="Dialog" data-dialog-type="blank">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
<div id="dialogB" class="Dialog" data-dialog-type="close">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
<div id="dialogC" class="Dialog" data-dialog-type="confirm">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
<div id="dialogD" class="Dialog" data-dialog-type="okcancel">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
```
```
$('#buttonA').click(function() {
  $('#dialogA').open({
    title:'Blank',
    width: 270,
	height: 270
  });
});

$('#buttonB').click(function() {
  $('#dialogB').open({
    title:'Close',
    width: 270,
	height: 270
  });
  $('#dialogB').closed(function() {
    alert("CLOSE pressed!");
  });
});

$('#buttonC').click(function() {
  $('#dialogC').open({
    title:'Confirm',
    width: 270,
	height: 270
  });
  $('#dialogC').confirm(function() {
    alert("CONFIRM pressed!");
  });
});

$('#buttonD').click(function() {
  $('#dialogD').open({
    title:'OkCancel',
    width: 270,
	height: 270
  });
  $('#dialogD').ok(function() {
    alert("OK pressed!");
  });
  $('#dialogD').cancel(function() {
    alert("CANCEL pressed!");
  });
});
```
</div>

<script>
$('#buttonA').click(function() {
  $('#dialogA').open({
    title:'Blank',
    width: 270,
	height: 270
  });
});

$('#buttonB').click(function() {
  $('#dialogB').open({
    title:'Close',
    width: 270,
	height: 270
  });
  $('#dialogB').closed(function() {
    alert("CLOSE pressed!");
  });
});

$('#buttonC').click(function() {
  $('#dialogC').open({
    title:'Confirm',
    width: 270,
	height: 270
  });
  $('#dialogC').confirm(function() {
    alert("CONFIRM pressed!");
  });
});

$('#buttonD').click(function() {
  $('#dialogD').open({
    title:'OkCancel',
    width: 270,
	height: 270
  });
  $('#dialogD').ok(function() {
    alert("OK pressed!");
  });
  $('#dialogD').cancel(function() {
    alert("CANCEL pressed!");
  });
});
</script>

### data-animation

다이얼로그 컴포넌트의 open/close 시 애니메이션 효과를 나타내는 속성입니다.

- "show"
	- 다이얼로그 애니메이션 기본 속성으로 show/hide 애니메이션 효과로 open/close 됩니다.
- “fade” 
	- fadeIn/fadeOut 애니메이션 효과로 open/close 됩니다.
- “slide” 
	- slideDown/slideUp 애니메이션 효과로 open/close 됩니다.

<div class="eg">
<div class="egview"> 
<button id="button1" class="Button">Show</button> 
<button id="button2" class="Button">Fade</button> 
<button id="button3" class="Button">Slide</button> 
<div id="dialog1" class="Dialog" data-dialog-type="blank" data-animation="show"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
<div id="dialog2" class="Dialog" data-dialog-type="blank" data-animation="fade"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
<div id="dialog3" class="Dialog" data-dialog-type="blank" data-animation="slide"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
</div>
```
<button id="button1" class="Button">Show</button> 
<button id="button2" class="Button">Fade</button> 
<button id="button3" class="Button">Slide</button> 
<div id="dialog1" class="Dialog" data-dialog-type="blank" data-animation="show">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
<div id="dialog2" class="Dialog" data-dialog-type="blank" data-animation="fade">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
<div id="dialog3" class="Dialog" data-dialog-type="blank" data-animation="slide">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
```
```
$('#button1').click(function() {
  $('#dialog1').open({
    title:'Show',
    width: 270,
	height: 270
  });
});
$('#button2').click( function() {
  $('#dialog2').open({
    title:'Fade',
    width: 270,
	height: 270
  });
});
$('#button3').click( function() {
  $('#dialog3').open({
  	title:'Slide',
    width: 270,
	height: 270  
  });
});
```
</div>

<script>
$('#button1').click(function() {
  $('#dialog1').open({
    title:'Show',
    width: 270,
	height: 270
  });
});
$('#button2').click( function() {
  $('#dialog2').open({
    title:'Fade',
    width: 270,
	height: 270
  });
});
$('#button3').click( function() {
  $('#dialog3').open({
  	title:'Slide',
    width: 270,
	height: 270  
  });
});
</script>

### data-animationtime

ms 단위로 다이얼로그 애니메이션이 실행되는 시간을 명시하는 속성입니다.
>data-animation 속성이 없을때는 해당 속성이 적용되지 않습니다.

- "500" : default 
	- 기본값은 500ms 입니다.

<div class="eg">
<div class="egview">
<button id="button4" class="Button">Animation Time 500(default)</button>  
<button id="button5" class="Button">Animation Time 1000</button> 
<button id="button6" class="Button">Animation Time 3000</button> 
<div id="dialog4" class="Dialog" data-dialog-type="blank" data-animation="fade"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
<div id="dialog5" class="Dialog" data-dialog-type="blank" data-animation="fade" data-animationtime="1000"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
<div id="dialog6" class="Dialog" data-dialog-type="blank" data-animation="fade" data-animationtime="3000"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
</div>
```
<button id="button4" class="Button">Animation Time 500(default)</button>  
<button id="button5" class="Button">Animation Time 1000</button> 
<button id="button6" class="Button">Animation Time 3000</button> 
<div id="dialog4" class="Dialog" data-dialog-type="blank" data-animation="fade">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
<div id="dialog5" class="Dialog" data-dialog-type="blank" data-animation="fade" data-animationtime="1000">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
<div id="dialog6" class="Dialog" data-dialog-type="blank" data-animation="fade" data-animationtime="3000">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
```
```
$('#button4').click( function() {
	 $('#dialog4').open({
	    title:'Time Default',
	    width: 270,
		height: 270
	 });
    });
$('#button5').click( function() {
	 $('#dialog5').open({
	    title:'Time1000',
	    width: 270,
		height: 270
	 });
    });
$('#button6').click( function() {
  $('#dialog6').open({
    title:'Time3000',
	width: 270,
	height: 270 
  });
});
```
</div>
<script>
$('#button4').click( function() {
	 $('#dialog4').open({
	    title:'Time Default',
	    width: 270,
		height: 270
	 });
    });
$('#button5').click( function() {
	 $('#dialog5').open({
	    title:'Time1000',
	    width: 270,
		height: 270
	 });
    });
$('#button6').click( function() {
  $('#dialog6').open({
    title:'Time3000',
	width: 270,
	height: 270
  });
});	
</script>

### data-resizable

다이얼로그의 크기 조절 기능을 설정하는 속성입니다.

- "false" : default
	- Default값은 false로 data-resizable을 설정하지 않으면 크기조절 기능을 사용할 수 없습니다.<br>
	- 설정한 width, height 미만으로 resize 할 수 없습니다.
	- resize 후의 이벤트는 dialogResizeEnd를 사용해야 합니다.
<div class="eg">
<div class="egview"> 
	<button id="buttonResize" class="Button">open</button> 
	<span id='resizeAfter'></span>
	<div id="resizeDialog" class="Dialog"  data-dialog-type="blank" data-resizable="true"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
</div>
```
<button id="buttonResize" class="Button">open</button> 
<div id="resizeDialog" class="Dialog"  data-dialog-type="blank" data-resizable="true">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
```
```
$('#buttonResize').click(function() {
  $('#resizeDialog').open({
    title:"Resizable",
	width: 270,
	height: 270
  });
});

$('#resizeDialog').bind('dialogResizeEnd', function(e){
	$('#resizeAfter').html('변경 후 넓이: ' + $(this).width() +' / 변경 후 높이: ' + $(this).height());
});

```
</div>

<script>
$('#buttonResize').click(function() {
  $('#resizeDialog').open({
    title:"Resizable",
	width: 270,
	movable:true,
	height: 270
  });
});


$('#resizeDialog').bind('dialogResizeEnd', function(e){
	$('#resizeAfter').html('변경 후 넓이: ' + $(this).width() +' / 변경 후 높이: ' + $(this).height());
});
</script>

### data-dialog-movable

다이얼로그 이동을 설정하는 속성입니다.

- "false" : default
	- Default값은 false로 data-dialog-movable을 설정하지 않으면 다이얼로그 이동기능을 사용할 수 없습니다.

<div class="eg">
<div class="egview"> 
	<button id="btn_MoveDialog" class="Button">open</button> 
	<div id="moveDialog" class="Dialog"  data-dialog-type="blank" data-dialog-movable="true"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
</div>
```
<button id="btn_MoveDialog" class="Button">open</button> 
<div id="moveDialog" class="Dialog"  data-dialog-type="blank" data-dialog-movable="true">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
```
```
 $('#btn_MoveDialog').click(function() {
      $('#moveDialog').open({
        title:"Movable",
		width: 270,
		height: 270
      });
    });
```
</div>

<script>
 $('#btn_MoveDialog').click(function() {
      $('#moveDialog').open({
        title:"Movable",
		width: 270,
		height: 270
      });
    });
</script>




### data-toggle

> **v2.3.1.16 이후** 호환  

다이얼로그를 접고, 펴는 토글 버튼을 생성하는 속성입니다.

- "false" : default
	- [Alopex UI 신규 테마](http://ui.alopex.io/2.3/theme/theme.html?target=theme#basic)에서만 동작합니다.
	- Default값은 false로 data-toggle을 설정하지 않으면 접고, 펴는 토글 버튼이 생성되지 않습니다.  
	- 접은 상태에서 data-dialog-movable=true 기능을 활용하여, 원하는 위치에 다이얼로그를 이동시켜 놓을 수 있습니다.
	- 아래와 같이 **다이얼로그의 헤더 부분이 존재하는 타입일 경우에만 사용 가능**합니다.  
	
		* ```data-dialog-type="blank"``` : 헤더만 포함된 기본 테마 다이얼로그 컴포넌트를 사용한다고 명시하는 속성 
		* data-dialog-type="close" : Close 버튼이 포함된 기본테마 다이얼로그 컴포넌트를 사용한다고 명시하는 속성 
		* data-dialog-type="confirm" : Confirm 버튼이 포함 기본테마 다이얼로그 컴포넌트를 사용한다고 명시하는 속성
		* data-dialog-type="okcancel" : OK, CANCEL버튼 포함 기본테마 다이얼로그 컴포넌트를 사용한다고 명시하는 속성
	- Toggle이 완료되는 시점의 이벤트는 dialogToggleEnd를 사용하시면 됩니다.
<div class="eg">
<div class="egview"> 
	<button id="buttonToggle" class="Button">open</button> 
	<div id="divToggle" class="Dialog"  data-dialog-type="blank" data-toggle="true"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
</div>
```
	<button id="buttonToggle" class="Button">open</button> 
	<div id="divToggle" class="Dialog"  data-dialog-type="blank" data-toggle="true">
		<div class="Dialog-contents">컨텐츠 영역입니다.</div>
	</div>
```
```
$('#buttonToggle').click(function() {
  $('#divToggle').open({
    movable: true,
    title:"Toggle Test",
	width: 270,
	height: 270,
	toggle: true
	//type: 'blank' /*data-dialog-type="blank" 와 같이 마크업 상에 속성 설정을 하지 않은 경우, open() API 의 파라미터로 타입 지정*/
  });
});

$('#divToggle').bind('dialogToggleEnd', function(e){
	alert('Toggle End');
});
```
</div>

<script>
$('#buttonToggle').click(function() {
  $('#divToggle').open({
      movable: true,
    title:"Toggle Test",
	width: 270,
	height: 270,
	toggle: true
	//type: 'blank' /*data-dialog-type="blank" 와 같이 마크업 상에 속성 설정을 하지 않은 경우, open() API 의 파라미터로 타입 지정*/
  });
});

$('#divToggle').bind('dialogToggleEnd', function(e){
	alert('Toggle End');
});
</script>




### data-dialog-modal

다이얼로그 modal 기능을 사용할 때 설정하는 속성입니다.

- "false" : default
	- Default 값은 false로 data-dialog-modal을 설정하지 않으면 Modal기능을 사용할 수 없습니다.

<div class="eg">
<div class="egview"> 
	<button id="btn_modal" class="Button">open</button> 
	<div id="modalDialog" class="Dialog"  data-dialog-type="blank" data-dialog-modal="true"><div class="Dialog-contents">컨텐츠 영역입니다.</div></div>
</div>
```
<button id="btn_modal" class="Button">open</button> 
<div id="modalDialog" class="Dialog"  data-dialog-type="blank" data-dialog-modal="true">
	<div class="Dialog-contents">컨텐츠 영역입니다.</div>
</div>
```
```
$('#btn_modal').click(function() {
  $('#modalDialog').open({
    title:"Modal",
    width:270,
    height:270
  });
});;
```
</div>

<script>
$('#btn_modal').click(function() {
  $('#modalDialog').open({
    title:"Modal",
    width:270,
    height:270
  });
});;
</script>


### data-dialog-scroll

다이얼로그 컨텐츠에서 스크롤이 가능하도록 설정하는 속성입니다.

- "true"
	- 컨텐츠의 스크롤을 가능하게 합니다.
<div class="eg">
<div class="egview"> 
	<button id="btn_ScrollDialog" class="Button">open</button> 
	<div id="scrollDialog" class="Dialog"  data-dialog-type="blank"  data-dialog-movable="true">
		<div class="Dialog-contents" data-dialog-scroll="true">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, architecto quidem, id nam totam amet ut accusamus odio! Quidem repellat porro explicabo! Explicabo sunt, rerum ab id impedit voluptate dolor repellat blanditiis, libero neque saepe eos voluptatem distinctio, sed ad quas cumque dolores vero corporis fuga totam! Magni iure, velit possimus veniam enim earum eaque ipsam labore atque ut magnam. Voluptatum dolores doloribus consequuntur, autem, laboriosam illo sed assumenda laborum? Quia non sit, officiis minus numquam ut placeat voluptas quod voluptatem vitae molestiae dicta repellendus labore illum dolore, aperiam id facilis facere ipsum iusto error dolorem? Porro maxime recusandae, non.
		</div>	
	</div>
</div>
```
<button id="btn_ScrollDialog" class="Button">open</button> 
	<div id="scrollDialog" class="Dialog"  data-dialog-type="blank"  data-dialog-movable="true">
		<div class="Dialog-contents" data-dialog-scroll="true">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, architecto quidem, id nam totam amet ut accusamus odio! Quidem repellat porro explicabo! Explicabo sunt, rerum ab id impedit voluptate dolor repellat blanditiis, libero neque saepe eos voluptatem distinctio, sed ad quas cumque dolores vero corporis fuga totam! Magni iure, velit possimus veniam enim earum eaque ipsam labore atque ut magnam. Voluptatum dolores doloribus consequuntur, autem, laboriosam illo sed assumenda laborum? Quia non sit, officiis minus numquam ut placeat voluptas quod voluptatem vitae molestiae dicta repellendus labore illum dolore, aperiam id facilis facere ipsum iusto error dolorem? Porro maxime recusandae, non.
		</div>	
	</div>
```
```
 $('#btn_ScrollDialog').click(function() {
      $('#scrollDialog').open({
        title:"Scroll",
    	width:270,
    	height:270
      });
    });
```
</div>

<script>
 $('#btn_ScrollDialog').click(function() {
      $('#scrollDialog').open({
        title:"Scroll",
    	width:270,
    	height:270
      });
    });
</script>


## Functions


### .open(option)

다이얼로그를 열 때 사용하는 함수입니다.

option 항목들은 [$a.setup](../dev-js/javascript.html?target=setup#Functions_asetupcomponentNameoptions) 함수를 사용하여 공통 설정이 가능합니다.

- parameter
	- jsonObject {json} optional
		- 다이얼로그 title, position, 기능 등을 설정하는 option 값.
			- title - 다이얼로그의 제목 문자열. false 설정 시 상단 타이틀 바 사용 않할 수 있음
			- width - 다이얼로그의 넓이값
			- height - 다이얼로그의 높이값
			- left, top - 다이얼로그 위치값
			- type - 다이얼로그 타입설정. "null" 값 설정 시 다이얼로그 헤더 없음(동일한 마크업 속성: data-dialog-type)
			- resizable - 다이얼로그 크기조절 가능유무 설정(동일한 마크업 속성: data-resizable)
			- scroll - data-dialog-scroll 영역의 스크롤 가능유무 설정
			- movable - 다이얼로그 위치조정 가능유무 설정(동일한 마크업 속성: data-dialog-movable)
			- animation - 다이얼로그 종료시 적용되는 애니메이션 설정(동일한 마크업 속성: data-animation)
			- animationtime - 애니메이션 동작 시간 설정(동일한 마크업 속성: data-animationtime)
			- modal - 다이얼로그 open 시 배경에 modal 유무 설정(동일한 마크업 속성: data-dialog-modal)
			- modalScroll - 모바일 사용시, 다이얼로그 modal 상태에서 스크롤 가능유무 설정
			- modalscrollhidden - 다이얼로그 modal 상태에서 세로 스크롤바 유무 설정
			- modalclose - 모바일 사용시, 백그라운드 터치시 다이얼로그 닫기 설정/비설정
			- toggle - 다이얼로그 접고, 펴기 토글 버튼 생성
			- alias - 사용자가 필요 시 설정하는 다이얼로그의 별칭. alias를 유니크한 값으로 부여하면 식별자로 사용 가능
			- xButtonClickCallback - 다이얼로그 우측 상단 기본 닫기 X 버튼 클릭 시 호출되는 콜백


<div class="eg">
<div class="egview"> 
	<button id="btn_open" class="Button">open</button> 
	<div id="dialogOpen" class="Dialog">
		<pre class="Dialog-contents">
			title:"Dialog",
			left: 100,
			top:100,
			width:270,
    		height:270,
			type: "blank",
			resizable:true,
			movable:true,
			animation: "fade",
			animationtime: 300	
		</pre>
	</div>
</div>
```
<button id="btn_open" class="Button">open</button> 
<div id="dialogOpen" class="Dialog">
	<pre class="Dialog-contents">
		title:"Dialog",
		left: 100,
		top:100,
		width:270,
    	height:270,
		type: "blank",
		resizable:true,
		movable:true,
		animation: "fade",
		animationtime: 300
	</pre>
</div>
```
```
$('#btn_open').bind('click', function() {
    $('#dialogOpen').open({
		title:"Dialog",
		left: 100,
		top:100,
    	width:270,
    	height:270,
		type: "blank",
		resizable:true,
		movable:true,
		animation: "fade",
		animationtime: 300
    });
  });
```
</div>

<script>
$('#btn_open').bind('click', function() {
    $('#dialogOpen').open({
		title:"Dialog",
		left: 100,
		top:100,
		width:270,
    	height:270,
		type: "blank",
		resizable:true,
		movable:true,
		animation: "fade",
		animationtime: 300
    });
  });
</script>

### .closed (callback)

다이얼로그에서 Close 버튼을 눌렀을때 발생하는 액션을 정의하는 함수입니다. 단, 해당 함수는 data-dialog-type = "close" 일때만 사용할 수 있습니다.

- parameter
	- callback {function} Optional
		- Close 버튼을 눌렀을때 일어나는 callback 함수 선언.
		
>위 `data-dialog-type` 예제 참고

### .ok (callback)

다이얼로그에서 OK버튼을 눌렀을때 발생하는 액션을 정의하는 함수입니다. 단, 해당 함수는 data-dialog-type = "okcancel" 일때만 사용할 수 있습니다.

- parameter
	- callback {function} Required
		- OK 버튼을 눌렀을때 일어나는 callback 함수 선언.

>위 `data-dialog-type` 예제 참고

### .cancel (callback)
	
다이얼로그에서 Cancel버튼을 눌렀을때 발생하는 액션을 정의하는 함수입니다.단, 해당 함수는 data-dialog-type = "okcancel" 일때만 사용할 수 있습니다.

- parameter
	- callback {function} Required
		- Cancel 버튼을 눌렀을때 일어나는 callback 함수 선언.

>위 `data-dialog-type` 예제 참고

### .confirm (callback)

다이얼로그에서 Confirm버튼을 눌렀을때 발생하는 액션을 정의하는 함수입니다. 단, 해당 함수는 data-dialog-type = "confirm" 일때만 사용할 수 있습니다.

- parameter
	- callback {function} Required
		- Confirm 버튼을 눌렀을때 일어나는 callback 함수 선언.
		
>위 `data-dialog-type` 예제 참고

### .close (callback)

열린 다이얼로그를 닫을 때 사용하는 함수입니다.

- parameter
	- callback {function} Optional
		- 다이얼로그를 닫을 때 실행할 callback 함수 선언.
		


## Extra Example

### Combined Dialog

다이얼로그 속성값 변화에 따른 다이얼로그의 형태를 직접확인해 볼 수 있는 예제입니다.

<style>
.labelStyle {
	margin:10px;
	width:100px;
	display: inline-block;
	font-weight: bold;
}
</style>
<div class="eg">
<div class="egview"> 
	<label class="Display-inblock Width-30 Font-bold Margin-bottom-10">Type:
		<select id="type" class="Select">
			<option value="blank">Blank</option>
			<option value="close">Close</option>
			<option value="confirm">Confirm</option>
			<option value="okcancel">OkCancel</option>
		</select>
	</label>
	<label class="Display-inblock Width-30 Font-bold Margin-bottom-10">Resizable:
		<select id="resizable" class="Select">
			<option value="true">Yes</option>
			<option value="false">No</option>
		</select>
	</label>
	<label class="Display-inblock Width-30 Font-bold Margin-bottom-10">Movable:
		<select id="movable" class="Select">
			<option value="true">Yes</option>
			<option value="false">No</option>
		</select>
	</label>
	<label class="Display-inblock Width-30 Font-bold Margin-bottom-10">Modal:
		<select id="modal" class="Select">
			<option value="true">Yes</option>
			<option value="false">No</option>
		</select>
	</label>
	<label class="Display-inblock Width-30 Font-bold">Animation:
		<select id="animation" class="Select">
			<option value="show">Show</option>
			<option value="fade">Fade</option>
			<option value="slide">Slide</option>
		</select>
	</label>
	<label class="Display-inblock Width-30 Font-bold">Animation Time:
		<select id="animationTime" class="Select">
			<option value="500">500ms</option>
			<option value="1000">1000ms</option>
			<option value="3000">3000ms</option>
		</select>
	</label>
	<button id="btn_combined" class="Button">Combined Dialog Open</button>
</div>
```
<label class="Display-inblock Width-30 Font-bold Margin-bottom-10">Type:
	<select id="type" class="Select">
		<option value="blank">Blank</option>
		<option value="close">Close</option>
		<option value="confirm">Confirm</option>
		<option value="okcancel">OkCancel</option>
	</select>
</label>
<label class="Display-inblock Width-30 Font-bold Margin-bottom-10">Resizable:
	<select id="resizable" class="Select">
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select>
</label>
<label class="Display-inblock Width-30 Font-bold Margin-bottom-10">Movable:
	<select id="movable" class="Select">
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select>
</label>
<label class="Display-inblock Width-30 Font-bold Margin-bottom-10">Modal:
	<select id="modal" class="Select">
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select>
</label>
<label class="Display-inblock Width-30 Font-bold">Animation:
	<select id="animation" class="Select">
		<option value="show">Show</option>
		<option value="fade">Fade</option>
		<option value="slide">Slide</option>
	</select>
</label>
<label class="Display-inblock Width-30 Font-bold">Animation Time:
	<select id="animationTime" class="Select">
		<option value="500">500ms</option>
		<option value="1000">1000ms</option>
		<option value="3000">3000ms</option>
	</select>
</label>
<button id="btn_combined" class="Button">Combined Dialog Open</button>
```
```
var dialogElement;
var dialogContentsElement;
  $('#btn_combined').click(getAttribute);

  function getAttribute() { // 각 Select의 현재 선택값을 가져온다.
    var type = $('#type').getValues(); //'getValues()': Alopex UI funtion. Select 컴포넌트 참고
    var animation = $('#animation').getValues();
    var animationTime = $('#animationTime').getValues();
    var resizable = $('#resizable').getValues();
    var movable = $('#movable').getValues();
    var modal = $('#modal').getValues();

    dialogElement = document.createElement('div'); // Dialog를 생성 준비 
    $(dialogElement).appendTo(document.body);

	dialogContentsElement = document.createElement('div'); 
	$(dialogContentsElement).attr('class', 'Dialog-contents');
	$(dialogContentsElement).appendTo(dialogElement);

    $(dialogElement).attr({ //Dialog 속성 세팅
      'id': 'combinedDialog',
      "class": "Dialog",
      "data-dialog-type": type,
      "data-animation": animation,
      "data-animationtime": animationTime,
      "data-resizable": resizable,
      "data-dialog-movable": movable,
      "data-dialog-modal": modal
    });

    $(dialogElement).convert(); // Dialog 생성
    $(dialogElement).open({ // Dialog 열기
      title:'Combined',
      width:270,
      height:270
    });
    $(dialogElement).ok(callbackHandler); // ok()
    $(dialogElement).cancel(callbackHandler); // cancel()
    $(dialogElement).confirm(callbackHandler); // confirm()
  }

  function callbackHandler() {
	  $('#combinedDialog').close(); // Dialog를 닫기.
	  $('#combinedDialog').remove(); // Dialog 삭제.
  }
```
</div>

<script>
  var dialogElement;
  var dialogContentsElement;
  $('#btn_combined').click(getAttribute);

  function getAttribute() { // 각 Select의 현재 선택값을 가져온다.
    var type = $('#type').getValues(); //'getValues()': Alopex UI funtion. Select 컴포넌트 참고
    var animation = $('#animation').getValues();
    var animationTime = $('#animationTime').getValues();
    var resizable = $('#resizable').getValues();
    var movable = $('#movable').getValues();
    var modal = $('#modal').getValues();

    dialogElement = document.createElement('div'); // Dialog를 생성 준비 
    $(dialogElement).appendTo(document.body);
    
    dialogContentsElement = document.createElement('div'); 
	$(dialogContentsElement).attr('class', 'Dialog-contents');
	$(dialogContentsElement).appendTo(dialogElement);
	
    $(dialogElement).attr({ //Dialog 속성 세팅
      'id': 'combinedDialog',
      "class": "Dialog",
      "data-dialog-type": type,
      "data-animation": animation,
      "data-animationtime": animationTime,
      "data-resizable": resizable,
      "data-dialog-movable": movable,
      "data-dialog-modal": modal
    });

    $(dialogElement).convert(); // Dialog 생성
    $(dialogElement).open({ // Dialog 열기
      title:'Combined',
      width:270,
      height:270
    });
    $(dialogElement).ok(callbackHandler); // ok()
    $(dialogElement).cancel(callbackHandler); // cancel()
    $(dialogElement).confirm(callbackHandler); // confirm()
  }

  function callbackHandler() {
	  $('#combinedDialog').close(); // Dialog를 닫기.
	  $('#combinedDialog').remove(); // Dialog 삭제.
  }
</script>

### Ajax Dialog

Ajax 통신을 이용하여 다이얼로그 내에 새로운 페이지를 띄우는 예제입니다.

<div class="eg">
<div class="egview"> 
	<button id="btn_ajaxDialog" class="Button">open</button> 
	<div id="AjaxDialog" class="Dialog" data-dialog-movable="true"  data-resizable="true" data-dialog-type="blank">
		<div id="ajaxContents" class="Dialog-contents"></div>
	</div>
</div>
```
<button id="btn_ajaxDialog" class="Button">open</button> 
<div id="AjaxDialog" class="Dialog" data-dialog-movable="true"  data-resizable="true" data-dialog-type="blank">
	<div id="ajaxContents" class="Dialog-contents"></div>
</div>
```
```
$('#btn_ajaxDialog').click(function() {
  //dialog should be open after inner content is loaded
  $('#ajaxContents').load('dialog/dialog-examples-ajaxtest.html', function(){
    $('#AjaxDialog').open({
        title:'Ajax Dialog',
      	width:270,
      	height:270
      });
  });
});
```
</div>

<script>
$('#btn_ajaxDialog').click(function() {
  //dialog should be open after inner content is loaded
  $('#ajaxContents').load('dialog/dialog-examples-ajaxtest.html', function(){
    $('#AjaxDialog').open({
        title:'Ajax Dialog',
      	width:270,
      	height:270
      });
  });
});
</script>


### Form Dialog

Dialog안에 form을 만들어서 table에 저장하는 예제입니다.


<div class="eg">
<div class="egview"> 
<table class="Table" id="usertable">
	<colgroup>
		<col />
		<col />
		<col />
	</colgroup>
	<thead>
		<tr>
			<th>Name</th>
			<th>Email</th>
			<th>password</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>John Smith</td>
			<td>johnsmith@gmail.com</td>
			<td>johnsmith1</td>
		</tr>
	</tbody>
</table>

<button id="button" class="Button">Create User</button>
	<div id="dialogArea" class="Dialog" data-dialog-movable="true" data-dialog-modal="true">
		<form id="dialogForm">
			<div class="Dialog-contents">
				<div class="Margin-bottom-10">
					<label>Name:
					<input id="name" class="Textinput" type="text" name="name" data-validate-rule="{ required:true , minlength : 5, maxlength : 12 }"/></label><br>
					<span data-for="name" class="error"></span>		
				</div>
				<div class="Margin-bottom-10">
					<label>Email:
					<input id="email" class="Textinput" type="text" name="email" data-validate-rule="{ required:true , email:true }"/></label><br>
					<span data-for="email" class="error"></span>
				</div>
				<div>
					<label>Password:
					<input id="password" class="Textinput" type="password" name="password" data-validate-rule="{ required:true , minlength : 5, maxlength : 17 }"/></label><br>
					<span data-for="password" class="error"></span>
				</div>
			</div>
		</form>
	</div>
</div>
```
<table class="Table" id="usertable">
	<colgroup>
		<col />
		<col />
		<col />
	</colgroup>
	<thead>
		<tr>
			<th>Name</th>
			<th>Email</th>
			<th>password</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>John Smith</td>
			<td>johnsmith@gmail.com</td>
			<td>johnsmith1</td>
		</tr>
	</tbody>
</table>
<button id="button" class="Button">Create User</button>
	<div id="dialogArea" class="Dialog" data-dialog-movable="true" data-dialog-modal="true">
		<form id="dialogForm">
			<div class="Dialog-contents">
				<div class="Margin-bottom-10">
					<label>Name:
					<input id="name" class="Textinput" type="text" name="name" data-validate-rule="{ required:true , minlength : 5, maxlength : 12 }"/></label><br>
					<span data-for="name" class="error"></span>		
				</div>
				<div class="Margin-bottom-10">
					<label>Email:
					<input id="email" class="Textinput" type="text" name="email" data-validate-rule="{ required:true , email:true }"/></label><br>
					<span data-for="email" class="error"></span>
				</div>
				<div>
					<label>Password:
					<input id="password" class="Textinput" type="password" name="password" data-validate-rule="{ required:true , minlength : 5, maxlength : 17 }"/></label><br>
					<span data-for="password" class="error"></span>
				</div>
			</div>
		</form>
	</div>
```
```
var dataGate = {};
	dataGate.pool = {};
	//데이터를 생성하여 리턴해주는 핸들러 등록. handler는 data와 callback의
	//두개 파라메터를 받는 함수이며, handler는 두개의 파라메터를 이용하여
	//데이터 생성이 완료되면 callback 함수를 이용하여 완성된 데이터를
	//돌려주도록 구현한다. 
	dataGate.requestHandler = function(name, handler) {
		this.pool[name] = handler;
	};
	//데이터 요청 API. 데이터가 준비되면 callback을 통해 되돌려준다.
	dataGate.request = function(name, data, callback) {
		if(this.pool[name]) {
			return this.pool[name](data, callback);
		}
	};
	
	//Dialog 처리부
	//name, email, password에 대한 데이터를 callback으로 리턴해줌.
	var dialogRequestHandler = function(data, callback) {
		//$('#dialogArea input').val('');
		$.each(['name', 'email', 'password'], function(i,id) {
			$('#dialogArea #' + id).val(data && data[id] ? data[id] : '');
		});
		$('#dialogForm').validator();
		$('#dialogArea span[data-for]').text('');
		$('#dialogArea').open({
			title : data && data.row ? 'Edit Row' : 'New Row',
			height:450,
			type: 'okcancel'
		});
		$('#dialogArea').ok(function() {
			if(!$('#dialogForm').validate()) {
				alert('Error exist');
				return;
			}
			$.each(['name', 'email', 'password'], function(i,value) {
				data[value] = $('#dialogForm #' + value).val();
			});
			callback(data);
			$('#dialogArea').close();
		});
		$('#dialogArea').cancel(function(){
		  $('#dialogArea').close();
		})
	};
	
	var promptRequestHandler = function(data, callback) {
		var name = null;
		while(!name || name.length < 5 || name.length > 12) {
			name = prompt('Type your name', data && data.name ? data.name : '');
		}
		var email = null;
		while(!email) {
			email = prompt('Type your email', data && data.email ? data.email : '');
		}
		var password = null;
		while(!password) {
			password = prompt('Type your password', data && data.password ? data.password : '');
		}
		data.name = name;
		data.email = email;
		data.password = password;
		callback(data);
	};
	
	//테이블 데이터 관리부
	var tableRowManipulator = function(event) {
		var data = {};
		if(event && event.currentTarget.tagName == 'TABLE') {
			//td의 존재를 감지하여 edit 모드로 진입
			data.row = $(event.target).parent('tr:first'); //실제 화면상의 어떤 element 위에서 이벤트가 발생했는가?
			data.name = $(data.row).find('td')[0].innerText;
			data.email = $(data.row).find('td')[1].innerHTML;
			data.password = $(data.row).find('td:nth-child(3)').text();
		} else {
			//new row 모드
			data.row = null;
			data.name = '';
			data.email = '';
			data.password = '';
		}
		dataGate.request('userdata', data, function(data) {
			//수신된 데이터를 테이블에 넣는다.
			if(!data.row) {
				data.row = $('<tr></tr>');
				for(var i=0;i<3;i++) {
					data.row.append('<td></td>');
				}
				$('#usertable').append(data.row);
			}
			$(data.row).find('td')[0].innerHTML = data.name;
			$(data.row).find('td')[1].innerHTML = data.email;
			$(data.row).find('td:nth-child(3)').text(data.password);
		});
	};
	
	$(document).ready(function() {
		//userdata라는 request형태를 정의. 핸들러는 name, email, password라는
		//특정 데이터만 다루도록 한다. 필요에 따라 다른 방식으로 데이터를 가져오도록 구현한
		//핸들러를 동일한 이름으로 연결할 수도 있다. 
		dataGate.requestHandler('userdata', dialogRequestHandler);
		//dataGate.requestHandler('userdata', promptRequestHandler);
		$('#button,#usertable').click(tableRowManipulator);
	});
	</script>
```
</div>

<script>
	
	var dataGate = {};
	dataGate.pool = {};
	//데이터를 생성하여 리턴해주는 핸들러 등록. handler는 data와 callback의
	//두개 파라메터를 받는 함수이며, handler는 두개의 파라메터를 이용하여
	//데이터 생성이 완료되면 callback 함수를 이용하여 완성된 데이터를
	//돌려주도록 구현한다. 
	dataGate.requestHandler = function(name, handler) {
		this.pool[name] = handler;
	};
	//데이터 요청 API. 데이터가 준비되면 callback을 통해 되돌려준다.
	dataGate.request = function(name, data, callback) {
		if(this.pool[name]) {
			return this.pool[name](data, callback);
		}
	};
	
	//Dialog 처리부
	//name, email, password에 대한 데이터를 callback으로 리턴해줌.
	var dialogRequestHandler = function(data, callback) {
		//$('#dialogArea input').val('');
		$.each(['name', 'email', 'password'], function(i,id) {
			$('#dialogArea #' + id).val(data && data[id] ? data[id] : '');
		});
		$('#dialogForm').validator();
		$('#dialogArea span[data-for]').text('');
		$('#dialogArea').open({
			title : data && data.row ? 'Edit Row' : 'New Row',
			height:450,
			type: 'okcancel'
		});
		$('#dialogArea').ok(function() {
			if(!$('#dialogForm').validate()) {
				alert('Error exist');
				return;
			}
			$.each(['name', 'email', 'password'], function(i,value) {
				data[value] = $('#dialogForm #' + value).val();
			});
			callback(data);
			$('#dialogArea').close();
		});
		$('#dialogArea').cancel(function(){
		  $('#dialogArea').close();
		})
	};
	
	var promptRequestHandler = function(data, callback) {
		var name = null;
		while(!name || name.length < 5 || name.length > 12) {
			name = prompt('Type your name', data && data.name ? data.name : '');
		}
		var email = null;
		while(!email) {
			email = prompt('Type your email', data && data.email ? data.email : '');
		}
		var password = null;
		while(!password) {
			password = prompt('Type your password', data && data.password ? data.password : '');
		}
		data.name = name;
		data.email = email;
		data.password = password;
		callback(data);
	};
	
	//테이블 데이터 관리부
	var tableRowManipulator = function(event) {
		var data = {};
		if(event && event.currentTarget.tagName == 'TABLE') {
			//td의 존재를 감지하여 edit 모드로 진입
			data.row = $(event.target).parent('tr:first'); //실제 화면상의 어떤 element 위에서 이벤트가 발생했는가?
			data.name = $(data.row).find('td')[0].innerText;
			data.email = $(data.row).find('td')[1].innerHTML;
			data.password = $(data.row).find('td:nth-child(3)').text();
		} else {
			//new row 모드
			data.row = null;
			data.name = '';
			data.email = '';
			data.password = '';
		}
		dataGate.request('userdata', data, function(data) {
			//수신된 데이터를 테이블에 넣는다.
			if(!data.row) {
				data.row = $('<tr></tr>');
				for(var i=0;i<3;i++) {
					data.row.append('<td></td>');
				}
				$('#usertable').append(data.row);
			}
			$(data.row).find('td')[0].innerHTML = data.name;
			$(data.row).find('td')[1].innerHTML = data.email;
			$(data.row).find('td:nth-child(3)').text(data.password);
		});
	};
	
	$(document).ready(function() {
		//userdata라는 request형태를 정의. 핸들러는 name, email, password라는
		//특정 데이터만 다루도록 한다. 필요에 따라 다른 방식으로 데이터를 가져오도록 구현한
		//핸들러를 동일한 이름으로 연결할 수도 있다. 
		dataGate.requestHandler('userdata', dialogRequestHandler);
		//dataGate.requestHandler('userdata', promptRequestHandler);
		$('#button,#usertable').click(tableRowManipulator);
	});
	</script>
