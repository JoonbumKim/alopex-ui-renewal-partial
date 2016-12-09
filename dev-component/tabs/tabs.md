
# Tabs

## Basic

Tabs는 탭 기능을 제공해주는 컴포넌트입니다.  

> **v2.3.14 이전** :	탭 너비 디폴트는 "최소 너비 100px" 또는 "탭 제목의 길이" 중 하나의 값을 갖습니다.    
> **v2.3.15 이후** : 탭 너비 디폴트는 "전체 탭 컴퍼넌트 너비 / 탭 수"로 균등 분할 됩니다.  

### 기본 탭

상위 div 에 `class="Tabs"`를 기술합니다.  Tab element는 크게 Tab 버튼 영역과 컨텐트 영역으로 나뉘어집니다.  
하위 ul리스트를 만들고 li 요소에 `data-content="#tabId"`를 기술합니다.  
그 하위 div에 컨텐츠를 만들고  `id= #tabId`를 지정하면  해당 id를 가진 탭의 컨텐츠가 됩니다.  
탭 삭제 기능을 사용하기 위해서는 `<button class="RemoveButton"></button>` 를 넣어줍니다.  

<div class="eg">
<div class="egview"> 
<div class="Tabs" id="basicTabs">
	<ul>
		<li data-content="#tab1">tab1</li>
		<li data-content="#tab2">tab2</li>
		<li data-content="#tab3">tab3</li>
		<li data-content="#tab4">tab4<button class="RemoveButton"></button></li>
	</ul>
	<div id="tab1">
		<strong>tab1</strong>
		<p>
		tab1 Contents
		</p>
	</div>
	<div id="tab2">
		<strong>tab2</strong>
		<p>
		tab2 Contents
		</p>
	</div>
	<div id="tab3">
		<strong>tab3</strong>
		<p>
		tab3 Contents
		</p>
	</div>
	<div id="tab4">
		<strong>tab4</strong>
		<p>
		tab4 Contents
		</p>
	</div>
</div>
</div>

```
<div class="Tabs" id="basicTabs">
	<ul>
		<li data-content="#tab1">tab1</li>
		<li data-content="#tab2">tab2</li>
		<li data-content="#tab3">tab3</li>
		<li data-content="#tab4">tab4<button class="RemoveButton"></button></li>
	</ul>
	<div id="tab1">
		<strong>tab1</strong>
		<p>
		tab1 Contents
		</p>
	</div>
	<div id="tab2">
		<strong>tab2</strong>
		<p>
		tab2 Contents
		</p>
	</div>
	<div id="tab3">
		<strong>tab3</strong>
		<p>
		tab3 Contents
		</p>
	</div>
	<div id="tab4">
		<strong>tab4</strong>
		<p>
		tab4 Contents
		</p>
	</div>
</div>
```
</div>

### 이미지 탭

Tab영역에 이미지를  넣을 수 있습니다.

<div class="eg">
<div class="egview"> 
<div class="Tabs" >
	<ul>
		<li data-content="#tab1"><img src="tabs/images/button.jpg">Button</li>
		<li data-content="#tab2"><img src="tabs/images/Song-icon.png">Select</li>
		<li data-content="#tab3"><img src="tabs/images/checkbox.jpg">Checkbox</li>
	</ul>
	<div id="tab1">
		<strong>tab1</strong>
		<p>Button Content</p>
	</div>
	<div id="tab2">
		<strong>tab2</strong>
		<p>Select Content</p>
	</div>
	<div id="tab3">
		<strong>tab3</strong>
		<p>Checkbox Content</p>
	</div>
</div></div>

```
<div class="Tabs">
	<ul>
		<li data-content="#tab1"><img src="tabs/images/button.jpg">Button</li>
		<li data-content="#tab2"><img src="tabs/images/Song-icon.png">Select</li>
		<li data-content="#tab3"><img src="tabs/images/checkbox.jpg">Checkbox</li>
	</ul>
	<div id="tab1">
		<strong>tab1</strong>
		<p>Button Content</p>
	</div>
	<div id="tab2">
		<strong>tab2</strong>
		<p>Select Content</p>
	</div>
	<div id="tab3">
		<strong>tab3</strong>
		<p>Checkbox Content</p>
	</div>
</div>
```
</div>





### Fixed 탭  

> **v2.3.15 이후** 호환  

Tab영역에 대한 너비를 고정할 수 있습니다.  
너비는 data-tab-width="120px"와 같은 속성을 이용 합니다.  
탭 개수가 증가하여 부모의 너비를 초과하면 스크롤이 생성 되게 됩니다.  


<div class="eg">
<div class="egview">

<div class="Tabs Fixed" data-tab-width="120px" data-remove-button="true">
	<div class="Scroller">
		<ul>
			<li data-content="#tab1_Fixed">tab1</li>
			<li data-content="#tab2_Fixed">tab2</li>
			<li data-content="#tab3_Fixed">tab3</li>
			<li data-content="#tab4_Fixed">tab4</li>
			<li data-content="#tab5_Fixed">tab5</li>
			<li data-content="#tab6_Fixed">tab6</li>
			<li data-content="#tab7_Fixed">tab7</li>
			<li data-content="#tab8_Fixed">tab8</li>
			<li data-content="#tab9_Fixed">tab9</li>
		</ul>
	</div>
	<div id="tab1_Fixed">
		<strong>tab1</strong>
	</div>
	<div id="tab2_Fixed">
		<strong>tab2</strong>
	</div>
	<div id="tab3_Fixed">
		<strong>tab3</strong>
	</div>
	<div id="tab4_Fixed">
		<strong>tab4</strong>
	</div>
	<div id="tab5_Fixed">
		<strong>tab5</strong>
	</div>
	<div id="tab6_Fixed">
		<strong>tab6</strong>
	</div>
	<div id="tab7_Fixed">
		<strong>tab7</strong>
	</div>
	<div id="tab8_Fixed">
		<strong>tab8</strong>
	</div>
	<div id="tab9_Fixed">
		<strong>tab9</strong>
	</div>
</div>

</div>

```
<div class="Tabs Fixed" data-tab-width="120px" data-remove-button="true">
	<div class="Scroller">
		<ul>
			<li data-content="#tab1_Fixed">tab1</li>
			<li data-content="#tab2_Fixed">tab2</li>
			<li data-content="#tab3_Fixed">tab3</li>
			<li data-content="#tab4_Fixed">tab4</li>
			<li data-content="#tab5_Fixed">tab5</li>
			<li data-content="#tab6_Fixed">tab6</li>
			<li data-content="#tab7_Fixed">tab7</li>
			<li data-content="#tab8_Fixed">tab8</li>
			<li data-content="#tab9_Fixed">tab9</li>
		</ul>
	</div>
	<div id="tab1_Fixed">
		<strong>tab1</strong>
	</div>
	<div id="tab2_Fixed">
		<strong>tab2</strong>
	</div>
	<div id="tab3_Fixed">
		<strong>tab3</strong>
	</div>
	<div id="tab4_Fixed">
		<strong>tab4</strong>
	</div>
	<div id="tab5_Fixed">
		<strong>tab5</strong>
	</div>
	<div id="tab6_Fixed">
		<strong>tab6</strong>
	</div>
	<div id="tab7_Fixed">
		<strong>tab7</strong>
	</div>
	<div id="tab8_Fixed">
		<strong>tab8</strong>
	</div>
	<div id="tab9_Fixed">
		<strong>tab9</strong>
	</div>
</div>
```
</div>



### 2 Depth 탭 - Left  

> **v2.3.5.3 이후**  

Tabs 컴퍼넌트 탭 버튼을 2 Depth로 사용하기 위해, data-depth2-position="left"와 같은 속성을 이용 합니다.(현재 "left" 속성만 사용 가능)  
"left"로 설정하게되면, 2 Depth의 버튼이 Tabs 컴퍼넌트의 좌측에 위치하게 됩니다.  
탭 버튼과 컨텐츠의 동적 구성은
[.addTab(title, contentKey) API](#Functions_addTabtitlecontentKey_2Depth탭Left)를 참고하시기 바랍니다.  

<div class="eg">
<div class="egview">

<button id="tabDepth2AddButton" class="Button Margin-bottom-15">2depth left 탭 추가</button>

<div id="tabDepth2" class="Tabs Fixed" data-depth2-position="left">
		<div class="Scroller">
			<ul>
			</ul>
		</div>
</div>



</div>

```
<button id="tabDepth2AddButton" class="Button Margin-bottom-15">2depth left 탭 추가</button>
<div id="tabDepth2" class="Tabs Fixed" data-depth2-position="left">
		<div class="Scroller">
			<ul>
			</ul>
		</div>
</div>
```
</div>

```
<script>
var numDepth2 = 0;
$("#tabDepth2AddButton").click(function(){
	$('#tabDepth2').addTab(
				"Depth1_" + numDepth2, // arg0 
				"#contentDepth1_" + numDepth2, // arg1 
				[
					{"title":"Depth2_1", "url":"tabs/sub1.html"},
					{"title":"Depth2_2", "url":"tabs/sub2.html"},
					{"title":"Depth2_3", "url":"tabs/sub3.html"}
				] // arg2
			);
	numDepth2++;
});
</script>
```

<script>
var numDepth2 = 0;
$("#tabDepth2AddButton").click(function(){
	$('#tabDepth2').addTab(
			"Depth1_" + numDepth2, 
			"#contentDepth1_" + numDepth2, 
			[
				{"title":"Depth2_1", "url":"tabs/sub1.html"},
				{"title":"Depth2_2", "url":"tabs/sub2.html"},
				{"title":"Depth2_3", "url":"tabs/sub3.html"}
			]);
	numDepth2++;
});
</script>




 
### Keyboard Supporting


키보드를 통해서 tabs를 제어할 수 있습니다. Key 정보는 아래와 같습니다.


|  Keyboard | 설명 | 비고 |
| -------- | --- | --- |
| Tab, Shift+Tab | Tab 내의 다음, 이전 Focus 가능한 Element로 이동 | |
| ↑(Up), ↓(Down), ←(Left), →(Right) | Tab 포커스 이동 (탭버튼에 포커스가 있는 경우)| |



## Events



### beforetabchange

> **v2.3.6.3 이후**

선택된 탭이 바뀌기 전 발생하는 이벤트입니다.  
사용자 클릭 또는 .setTabIndex() API 등 호출 시 발생합니다.  
'beforetabchange' 이벤트와 .cancelThisTabChange() API를 응용하여 탭 변경을 제한할 수도 있습니다.

- parameter
	- e {object}
		- jQuery Event Object  
	- index {integer}
		- Depth 1 탭 인덱스
	- index2 {integer}
		- Depth 2 탭 인덱스 

<div class="eg">
<div class="egview"> 

<h5>tab3 클릭 (tab3에 대한 제어 테스트)</h5>
<div class="Tabs" id="tabs_beforetabchange">
	<ul>
		<li data-content="#tab1_beforetabchange">tab1</li>
		<li data-content="#tab2_beforetabchange">tab2</li>
		<li data-content="#tab3_beforetabchange">tab3</li>
	</ul>
	<div id="tab1_beforetabchange">
		<h5>tab1 컨텐츠</h5>
	</div>
	<div id="tab2_beforetabchange">
		<h5>tab2 컨텐츠</h5>
	</div>
	<div id="tab3_beforetabchange">
		<h5>tab3 컨텐츠</h5>
	</div>
</div>
</div>

```
<h5>tab3 클릭 (tab3에 대한 제어 테스트)</h5>
<div class="Tabs" id="tabs_beforetabchange">
	<ul>
		<li data-content="#tab1_beforetabchange">tab1</li>
		<li data-content="#tab2_beforetabchange">tab2</li>
		<li data-content="#tab3_beforetabchange">tab3</li>
	</ul>
	<div id="tab1_beforetabchange">
		<h5>tab1 컨텐츠</h5>
	</div>
	<div id="tab2_beforetabchange">
		<h5>tab2 컨텐츠</h5>
	</div>
	<div id="tab3_beforetabchange">
		<h5>tab3 컨텐츠</h5>
	</div>
</div>
```
```
// 사용자 권한 코드에 따른 tabchange 제어
var userAuth = 1;
$('#tabs_beforetabchange').on('beforetabchange', function(e, index, index2){
    // e : event object
    // index : 선택한 탭버튼 인덱스
    var $this = $(this); // == $('#tabs1_beforetabchange')
    if(index === 2 && userAuth === 1){ // 권한과 선택한 탭에 대한 제어 조건 판별
    		alert("[" + $this.getTitleByIndex(index) + "] 접근 권한이 없습니다.");
    		$(this).cancelThisTabChange();
    		return;
    }
 });
```
</div>

<script>
// 사용자 권한 코드에 따른 tabchange 제어
var userAuth = 1;
$('#tabs_beforetabchange').on('beforetabchange', function(e, index, index2){
    // e : event object
    // index : 선택한 탭버튼 인덱스
    var $this = $(this); // == $('#tabs1_beforetabchange')
    if(index === 2 && userAuth === 1){ // 권한과 선택한 탭에 대한 제어 조건 판별
    		alert("[" + $this.getTitleByIndex(index) + "] 접근 권한이 없습니다.");
    		$(this).cancelThisTabChange();
    		return;
    }
 });
</script>




### tabchange

선택된 탭이 바뀔 경우 발생하는 이벤트입니다.

- parameter
	- e {object}
		- jQuery Event Object  
	- index {integer}
		- Depth 1 탭 인덱스
	- index2 {integer}
		- Depth 2 탭 인덱스   
	
<div class="eg">
<div class="egview"> 
<div class="Tabs" id="tabs1">
	<ul>
		<li data-content="#tab1">tab1</li>
		<li data-content="#tab2">tab2</li>
		<li data-content="#tab3">tab3</li>
	</ul>
	<div id="tab1">
		<span>tab1 contents</span>
	</div>
	<div id="tab2">
		<span>tab2 contents</span>
	</div>
	<div id="tab3">
		<span>tab3 contents</span>
	</div>
</div>
<br>
<span id="span1"></span></div>
```
<div class="Tabs" id="tabs1">
	<ul>
		<li data-content="#tab1">tab1</li>
		<li data-content="#tab2">tab2</li>
		<li data-content="#tab3">tab3</li>
	</ul>
	<div id="tab1">
		<span>tab1 contents</span>
	</div>
	<div id="tab2">
		<span>tab2 contents</span>
	</div>
	<div id="tab3">
		<span>tab3 contents</span>
	</div>
</div>
<br>
<span id="span1"></span></div>
```
```
$('#tabs1').on('tabchange', function(e, index, index2){
    // e : event object
    // index : 탭버튼 인덱스
    index = index+1;
    $('#span1').text("tab"+index+" is selected");
 });
```
</div>

<script>
$('#tabs1').on('tabchange', function(e, index, index2){
    // e : event object
    // index : 탭버튼 인덱스
    index = index+1;
    $('#span1').text("tab"+index+" is selected");
 });
</script>

텝이 변경된 후, 그리드의 viewUpdate를 수행할 수도 있습니다.  
```
    	$('#depth2tabchange').on("tabchange", function(e, index, index2){
    		if(index2 !== undefined){ // Tabs컴퍼넌트의 2 depth 기능 사용 시에만 index2 를 리턴한다.
    			var $this = $(this); // == $('#depth2tabchange')
        		var content = $this.getTabContentByIndex(index, index2); // 컨텐츠DIV 가져오기.
        		var $grids = $(content).find(".alopexgrid:visible");
        		if($grids.length !== -1){
        			// 컨텐츠DIV 내 visible인 최소한의 그리드만 viewUpdate 수행.
        			$grids.alopexGrid("viewUpdate");
        		}
    		}
    	});
```

### removetab
탭 삭제 시 탭 버튼 및 탭 컨텐츠 삭제 이전에 trigger 되는 이벤트    
.removeTab() API 호출 시, button.RemoveButton 클릭 시, data-remove-button="true" 일 때 'X' 버튼 클릭 시 발생  

- parameter
	- e {object}
		- jQuery Event Object  
	- index {integer}
		- Depth 1 탭 인덱스
	- index2 {integer}
		- Depth 2 탭 인덱스    
```
// Alopex UI Tabs 특정 탭 및 탭 컨텐츠 삭제 시 이벤트 핸들러
$('#tab').on('removetab', function(e, index, index2){
    var tabContent = $(this).getTabContentByIndex(index); // $(this) = $('#tab')	
    if(tabContent){
    // 탭 삭제 전, 탭 컨텐츠 내 memory clear
       $(tabContent).find('.alopexgrid').removeAlopexGrid(); // 그리드 요소 및 관련 메모리 완전 삭제 API
    }
});
```


## Attributes


### data-remove-button  
  
  탭 삭제 버튼을 추가 합니다.

<div class="eg">
<div class="egview">

<div class="Tabs" data-remove-button="true">
	<ul>
		<li data-content="#tab1remove">button</li>
		<li data-content="#tab2remove">select</li>
		<li data-content="#tab3remove">checkbox</li>
		<li data-content="#tab4remove">textinput</li>
		<li data-content="#tab5remove">textarea</li>
	</ul>
	<div id="tab1remove" >
		<strong>tab1</strong>
		<p>button</p>
	</div>
	<div id="tab2remove" >
		<strong>tab2</strong>
		<p>select</p>
	</div>
	<div id="tab3remove" >
		<strong>tab3</strong>
		<p>checkbox</p>
	</div>
	<div id="tab4remove" >
		<strong>tab4</strong>
	  	<p>textinput</p>
	</div>
	<div id="tab5remove" >
		<strong>tab5</strong>
		<p>textinput</p>
	</div>
</div>

</div>

```
<div class="Tabs" data-remove-button="true">
	<ul>
		<li data-content="#tab1remove">button</li>
		<li data-content="#tab2remove">select</li>
		<li data-content="#tab3remove">checkbox</li>
		<li data-content="#tab4remove">textinput</li>
		<li data-content="#tab5remove">textarea</li>
	</ul>
	<div id="tab1remove" >
		<strong>tab1</strong>
		<p>button</p>
	</div>
	<div id="tab2remove" >
		<strong>tab2</strong>
		<p>select</p>
	</div>
	<div id="tab3remove" >
		<strong>tab3</strong>
		<p>checkbox</p>
	</div>
	<div id="tab4remove" >
		<strong>tab4</strong>
	  	<p>textinput</p>
	</div>
	<div id="tab5remove" >
		<strong>tab5</strong>
		<p>textinput</p>
	</div>
</div>
```
</div>


### data-tabs-trigger

- "click" : default
	- window click 이벤트 발생 시 탭이 변경됩니다.
- "hovering"
	- 탭버튼위에 마우스를 올렸을 시 탭이 변경됩니다.
- {events}
	- 그 외 브라우져 타 이벤트 사용가능

<div class="eg">
<div class="egview">
<div class="Tabs" data-tabs-trigger="hover">
	<ul>
		<li data-content="#tab1">button</li>
		<li data-content="#tab2">select</li>
		<li data-content="#tab3">checkbox</li>
		<li data-content="#tab4">textinput</li>
		<li data-content="#tab5">textarea</li>
	</ul>
	<div id="tab1" >
		<strong>tab1</strong>
		<p>button</p>
	</div>
	<div id="tab2" >
		<strong>tab2</strong>
		<p>select</p>
	</div>
	<div id="tab3" >
		<strong>tab3</strong>
		<p>checkbox</p>
	</div>
	<div id="tab4" >
		<strong>tab4</strong>
	  	<p>textinput</p>
	</div>
	<div id="tab5" >
		<strong>tab5</strong>
		<p>textinput</p>
	</div>
</div></div>

```
<div class="Tabs" data-tabs-trigger="hover">
	<ul>
		<li data-content="#tab1">button</li>
		<li data-content="#tab2">select</li>
		<li data-content="#tab3">checkbox</li>
		<li data-content="#tab4">textinput</li>
		<li data-content="#tab5">textarea</li>
	</ul>
		<div id="tab1" >
		<strong>tab1</strong>
		<p>button</p>
	</div>
	<div id="tab2" >
		<strong>tab2</strong>
		<p>select</p>
	</div>
	<div id="tab3" >
		<strong>tab3</strong>
		<p>checkbox</p>
	</div>
	<div id="tab4" >
		<strong>tab4</strong>
	  	<p>textinput</p>
	</div>
	<div id="tab5" >
		<strong>tab5</strong>
		<p>textinput</p>
	</div>
</div>
```
</div>

### data-content

- "#id"
	- 선택한 탭의 콘텐트 영역 ID를 입력 합니다.
- "targetPath"
	- 선택한 탭의 콘텐트가 있는 페이지 경로를 설정합니다.
	
<div class="eg">
<div class="egview">
<div class="Tabs">
	<ul>
		<li data-content="tabs/content.html">content.html</li>
		<li data-content="#tab2">#tab2</li>
	</ul>
	<div id="tab2" >
		tab2
	</div>
</div></div>
```
<div class="Tabs">
	<ul>
		<li data-content="tabs/content.html">content.html</li>
		<li data-content="#tab2">#tab2</li>
	</ul>
	<div id="tab2" >
		tab2
	</div>
</div>
</div>
```
```
<!-- content.html -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Tabs Sample</title>
	<style>
	#tab_targetPath {
	    background-color: #506482;
	    width: 200px;
	    height: 200px;
	    padding: 20px;	    
	}
	#tab_targetPath p {
		color: white;
	}
	#other {
		font-size: 42px;
	}
	</style>
</head>
<body>
	<div id="tab_targetPath">		
		<p>content.html</p>
		<p id="other">Other HTML</p>
	</div>
</body>
</html>
```
</div>
	
	

### data-content-iframe


- "true"
	- 선택한 탭의 콘텐트가 있는 페이지를 iframe 에 로드합니다. (외부 html 사용가능)
	
<span class="Font-bold Text-underline">* 주의</span>  
iframe 특성 상, 새로운 window/document 생성 및 라이브러리 로딩(js, css 등)이 발생합니다.  
부모 window에서 이미 로딩/사용중인 라이브러리가 iframe 내에서 상당 부분 재로딩 된다면  
성능 저하의 원인(화면 로딩 지연)이 되므로, 설계 시 iframe 방식에 대해 고려하여 적용 바랍니다.  

<div class="eg">
<div class="egview">
<div class="Tabs">
	<ul>
		<li data-content="tabs/content.html" data-content-iframe="true" data-content-iframe-id="iframe">content.html(iframe)</li>
		<li data-content="#tab2">#tab2</li>
	</ul>
	<div id="tab2" >
		tab2
	</div>
</div></div>
```
<div class="Tabs">
	<ul>
		<li data-content="tabs/content.html" data-content-iframe="true" data-content-iframe-id="iframe">content.html(iframe)</li>
		<li data-content="#tab2">#tab2</li>
	</ul>
	<div id="tab2" >
		tab2
	</div>
</div>
</div>
```
```
/* content.html */
 위 content 소스와 동일
```
</div>



### data-refresh-button


- "true"
	- iframe 탭 새로고침 버튼이 생성되고, click 시 컨텐츠가 새로고침 됩니다.  

<div class="eg">
<div class="egview">
<div class="Tabs" data-refresh-button="true">
	<ul>
		<li data-content="tabs/content.html" data-content-iframe="true" data-content-iframe-id="refreshbutton01">iframe 탭 (refresh 가능)</li>
		<li data-content="#tab_refreshbutton02">일반 탭 (refresh 불가능)</li>
	</ul>
	<div id="tab_refreshbutton02" >
		tab2
	</div>
</div></div>
```
<div class="Tabs" data-refresh-button="true">
	<ul>
		<li data-content="tabs/content.html" data-content-iframe="true" data-content-iframe-id="refreshbutton01">iframe 탭 (refresh 가능)</li>
		<li data-content="#tab_refreshbutton02">일반 탭 (refresh 불가능)</li>
	</ul>
	<div id="tab_refreshbutton02" >
		tab2
	</div>
</div>
```
```
/* content.html */
 위 content 소스와 동일
```
</div>


### data-display-flex
> **v2.3.14 이전** 호환

- "true"
	- Tabs영역 전체 넓이 기준으로  탭 버튼의 가로길이를  자동 균등 분배합니다.

<div class="eg">
<div class="egview">
<div class="Margin-bottom-10">
	<button id="addFlexTab" class="Button">Add Tab</button>
</div>
<!-- <div class="Tabs" data-contentsdisplay="flex" id="flexTabs"> -->
<div class="Tabs" data-display-flex="true" id="flexTabs">
	<ul>
		<li data-content="#tab1">Cappuccino</li>
		<li data-content="#tab2">Tea</li>
		<li data-content="#tab3">Ice Americano</li>
		<li data-content="#tab4">Water</li>
	</ul>
	<div id="tab1" >
		카푸치노
	</div>
	<div id="tab2" >
		차
	</div>
	<div id="tab3" >
		아이스 아메리카노
	</div>
	<div id="tab4" >
	  	생수
	</div>
	<div id="flexTabCont" >
	  	flex Tab Content
	</div>
</div></div>

```
<div class="Margin-bottom-10">
	<button id="addFlexTab" class="Button">Add Tab</button>
</div>
<div class="Tabs" data-display-flex="true" id="flexTabs">
	<ul>
		<li data-content="#tab1">Cappuccino</li>
		<li data-content="#tab2">Tea</li>
		<li data-content="#tab3">Ice Americano</li>
		<li data-content="#tab4">Water</li>
	</ul>
	<div id="tab1" >
		카푸치노
	</div>
	<div id="tab2" >
		차
	</div>
	<div id="tab3" >
		아이스 아메리카노
	</div>
	<div id="tab4" >
	  	생수
	</div>
	<div id="flexTabCont" >
	  	flex Tab Content
	</div>
</div>

```
```
var num = 0;
$('#addFlexTab').click(function() {
	var contentId = "flexTabCont"+num;
	var content = '<div id="'+contentId+'" >flex Tab Content'+num+'</div>';
	$('#flexTabs').append(content);
	var title = "flexTabCont"+num;
	contentId = "#"+contentId; 
	$('#flexTabs').addTab(title,contentId);
	num++;
});
```
</div>

<script>
var num = 0;
$('#addFlexTab').click(function() {
	var contentId = "flexTabCont"+num;
	var content = '<div id="'+contentId+'" >flex Tab Content'+num+'</div>';
	$('#flexTabs').append(content);
	var title = "flexTabCont"+num;
	contentId = "#"+contentId; 
	$('#flexTabs').addTab(title,contentId);
	num++;
});
</script>




### data-draggable

- "true" (default : "false")
	- 탭을 Drag & Drop 할 수 있습니다.(IE 10 이상)

<div class="eg">
<div class="egview"> 
<div class="Tabs" data-draggable="true" >
    <ul>
        <li data-content="#tab1_draggable">tab1_draggable</li>
        <li data-content="#tab2_draggable">tab2_draggable</li>
        <li data-content="#tab3_draggable">tab3_draggable</li>
        <li data-content="#tab4_draggable">tab4_draggable<button class="RemoveButton"></button></li>
    </ul>
    <div id="tab1_draggable">
        <h1>1</h1>
    </div>
    <div id="tab2_draggable">
        <h1>2</h1>
    </div>
    <div id="tab3_draggable">
        <h1>3</h1>
    </div>
    <div id="tab4_draggable">
        <h1>4</h1>
    </div>
</div>
</div>

```
<div class="Tabs" data-draggable="true" >
    <ul>
        <li data-content="#tab1_draggable">tab1_draggable</li>
        <li data-content="#tab2_draggable">tab2_draggable</li>
        <li data-content="#tab3_draggable">tab3_draggable</li>
        <li data-content="#tab4_draggable">tab4_draggable<button class="RemoveButton"></button></li>
    </ul>
    <div id="tab1_draggable">
        <h1>1</h1>
    </div>
    <div id="tab2_draggable">
        <h1>2</h1>
    </div>
    <div id="tab3_draggable">
        <h1>3</h1>
    </div>
    <div id="tab4_draggable">
        <h1>4</h1>
    </div>
</div>
```
</div>


## Functions

### .addTab(title, contentKey)

컨텐츠를 이용해  탭을 추가합니다.  

#### 기본 탭 (1 depth)

- parameter
	- title {string} Required
		- 추가할 Tab의 타이틀
	- contentKey {string} Required
		- 추가할 Tab 콘텐트 영역에 대한 key.
			- #id
				- 선택한 탭의 콘텐트 영역 ID를 #과 함께 입력 합니다. (ex: "#tab1")
			- targetPath
				- 선택한 탭의 콘텐트가 있는 페이지 경로를 설정합니다. (ex: "tabs/tabcontent.html")

<div class="eg">
	<div class="egview"> 
		<div class="Tabs Edit" id="tabs2" data-remove-button="true">
			<ul>
				<li data-content="#tab1">tab1</li>
				<li data-content="#tab2">tab2</li>
				<li data-content="#tab3">tab3</li>
			</ul>
			<p class="Tabs-btn__edit"><button id="addDefaultButton">탭추가하기</button></p>
			<div id="tab1">
				<strong>tab1</strong>
				<p>tab1 Content</p>
			</div>
			<div id="tab2">
				<strong>tab2</strong>
				<p>tab2 Content</p>
			</div>
			<div id="tab3">
				<strong>tab3</strong>
				<p>tab3 Content</p>
			</div>
			<div id="defaultTab">This is default tab's content</div>
		</div>
	</div>
```
<div class="Tabs Edit" id="tabs2" data-remove-button="true">
	<ul>
		<li data-content="#tab1">tab1</li>
		<li data-content="#tab2">tab2</li>
		<li data-content="#tab3">tab3</li>
	</ul>
	<p class="Tabs-btn__edit"><button id="addDefaultButton">탭추가하기</button></p>
	<div id="tab1">
		<strong>tab1</strong>
		<p>tab1 Content</p>
	</div>
	<div id="tab2">
		<strong>tab2</strong>
		<p>tab2 Content</p>
	</div>
	<div id="tab3">
		<strong>tab3</strong>
		<p>tab3 Content</p>
	</div>
	<div id="defaultTab">This is default tab's content</div>
</div>
```
```
var num = 0;
$('#addDefaultButton').click(function() {
	var contentId = "addTab"+num;
    var content = '<div id="'+contentId+'" ><strong>addTab'+num+'</strong><p>addTab'+num+' Content</p></div>';
    $('#tabs2').append(content);
    var title = "addTab"+num;
    contentId = "#"+contentId; 
    $('#tabs2').addTab(title,contentId);
    num++;
});
```
```
/* 컨텐츠 부분 보더 주기 */
<style>
	#tabs2 div {  
		border:1px solid #ccc; 
	}
</style>
```
</div>

<script>
var num = 0;
$('#addDefaultButton').click(function() {
	var contentId = "addTab"+num;
    var content = '<div id="'+contentId+'" ><strong>addTab'+num+'</strong><p>addTab'+num+' Content</p></div>';
    $('#tabs2').append(content);
    var title = "addTab"+num;
    contentId = "#"+contentId; 
    $('#tabs2').addTab(title,contentId);
    num++;
});
</script>  
 

#### 2 Depth 탭 - Left

- parameter
	- title {string} Required
		- 추가할 Tab의 타이틀
	- contentKey {string} Required
		- 추가할 Tab 콘텐트 영역에 대한 key.
			- #id
				- 선택한 탭의 콘텐트 영역 ID를 #과 함께 입력 합니다. (ex: "#tab1")
				- **(v2.3.6.15 이후)** 이미 있는 콘텐트 영역 ID를 입력할 경우, 해당 콘텐트에 "2 Depth 탭"이 추가됩니다. (이 경우에 title 이 있으면 덮어씌워집니다.)
			- targetPath
				- 선택한 탭의 콘텐트가 있는 페이지 경로를 설정합니다. (ex: "tabs/tabcontent.html")
	- depth2info {array} Required
		- 2 depth 탭의 title과 탭 컨텐츠로 가져올 url을 배열의 형태로 입력합니다.
			- [ title {string}, url {string} ] 
			- ex) [ {"title":"2Depth탭1", "url":"tabs/sub1.html"}, {"title":"2Depth탭2", "url":"tabs/sub2.html"} ]

<div class="eg">
<div class="egview">

2Depth 탭 추가 : <button id="addTab_depth2" class="Button Margin-bottom-15">addTab</button> <br>
2Depth 탭 삭제 : <button id="removeTab_depth2" class="Button Margin-bottom-15">removeTab(0,0)</button><br>
2Depth 탭 선택 : <button id="setTabIndex_depth2" class="Button Margin-bottom-15">setTabIndex([0,0])</button><br>
<div id="tabDepth2_2" class="Tabs Fixed" data-depth2-position="left" data-remove-button="true">
		<div class="Scroller">
			<ul>
			</ul>
		</div>
</div>
</div>

```
2Depth 탭 추가 : <button id="addTab_depth2" class="Button Margin-bottom-15">addTab</button> <br>
2Depth 탭 삭제 : <button id="removeTab_depth2" class="Button Margin-bottom-15">removeTab(0,0)</button><br>
2Depth 탭 선택 : <button id="setTabIndex_depth2" class="Button Margin-bottom-15">setTabIndex([0,0])</button><br>
<div id="tabDepth2_2" class="Tabs Fixed" data-depth2-position="left" data-remove-button="true">
		<div class="Scroller">
			<ul>
			</ul>
		</div>
</div>
```
```
<script>
var title = "Depth0";
var contentId = "#depth0";
// 새로운 1Depth탭 추가 
$("#tabDepth2_2").addTab(title, contentId, [{"title":"sub1", "url":"tabs/sub1.html"}, {"title":"sub2", "url":"tabs/sub2.html"}]);		
$("#addTab_depth2").on("click", function(e){
	// 2Depth 탭 추가 
	// 이미 있는 콘텐트 영역 ID를 입력할 경우, 해당 콘텐트에 "2Depth 탭"이 추가됩니다.	
	title = "newTitle";
	$("#tabDepth2_2").addTab( title, contentId, [{"title":"sub3", "url":"tabs/sub3.html"}]);
});
$("#removeTab_depth2").on("click", function(e){
	$("#tabDepth2_2").removeTab(0, 0);
});
$("#setTabIndex_depth2").on("click", function(e){
	$("#tabDepth2_2").setTabIndex([0, 0]);
});
</script>
```
</div>

<script>
$(document).on("mdload", function(){
	var title = "Depth0";
	var contentId = "#depth0";
	// 새로운 1Depth탭 추가 
	$("#tabDepth2_2").addTab(title, contentId, [{"title":"sub1", "url":"tabs/sub1.html"}, {"title":"sub2", "url":"tabs/sub2.html"}]);		
	$("#addTab_depth2").on("click", function(e){
		// 2Depth 탭 추가 
		// 이미 있는 콘텐트 영역 ID를 입력할 경우, 해당 콘텐트에 "2Depth 탭"이 추가됩니다.	
		title = "newTitle";
		$("#tabDepth2_2").addTab( title, contentId, [{"title":"sub3", "url":"tabs/sub3.html"}]);
	});
	$("#removeTab_depth2").on("click", function(e){
		$("#tabDepth2_2").removeTab(0, 0);
	});
	$("#setTabIndex_depth2").on("click", function(e){
		$("#tabDepth2_2").setTabIndex([0, 0]);
	});
});
</script>

### .addTab(html)

html 태그를 이용하여 탭을 추가합니다.

- parameter
	- html {string} Optional
		- 추가할 Tab의 html 코드 

	
<div class="eg">
	<div class="egview">
		<div class="Tabs Edit" id="tabs3">
			<ul>
				<li data-content="#tab1">tab1</li>
				<li data-content="#tab2">tab2</li>
				<li data-content="#tab3">tab3</li>
			</ul>
			<p class="Tabs-btn__edit"><button id="addUserButton">탭추가하기</button></p>
			<div id="tab1">
				<strong>tab1</strong>
				<p>tab1 Content</p>
			</div>
			<div id="tab2">
				<strong>tab2</strong>
				<p>tab2 Content</p>
			</div>
			<div id="tab3">
				<strong>tab3</strong>
				<p>tab3 Content</p>
			</div>
		</div>
	</div>
```
<div class="Tabs Edit" id="tabs3">
		<ul>
			<li data-content="#tab1">tab1</li>
			<li data-content="#tab2">tab2</li>
			<li data-content="#tab3">tab3</li>
		</ul>
		<p class="Tabs-btn__edit"><button id="addUserButton">탭추가하기</button></p>
		<div id="tab1">
			<strong>tab1</strong>
			<p>tab1 Content</p>
		</div>
		<div id="tab2">
			<strong>tab2</strong>
			<p>tab2 Content</p>
		</div>
		<div id="tab3">
			<strong>tab3</strong>
			<p>tab3 Content</p>
		</div>
	</div>
```
```
var num = 0;
$('#addUserButton').click(function() {
	var contentId = "addTab"+num;
    var content = '<div id="'+contentId+'" ><strong>addTab'+num+'</strong><p>addTab'+num+' Content</p></div>';
    $('#tabs3').append(content);
    var title = "addTab"+num;
    $('#tabs3').addTab('<li data-content="#'+contentId+'">'+title+'<button class="RemoveButton"></button></li>');
    num++;
});
```
```
/* 컨텐츠 부분 border 적용 */
<style>
	#tabs3 div {  
		border:1px solid #ccc; 
	}
</style>
```
</div>

<script>
var num = 0;
$('#addUserButton').click(function() {
	var contentId = "addTab"+num;
    var content = '<div id="'+contentId+'" ><strong>addTab'+num+'</strong><p>addTab'+num+' Content</p></div>';
    $('#tabs3').append(content);
    var title = "addTab"+num;
    $('#tabs3').addTab('<li data-content="#'+contentId+'">'+title+'<button class="RemoveButton"></button></li>');
    num++;
});
</script>


### .removeTab(index, index2)

해당 인덱스의 탭을 제거합니다.  
.getCurrentTabIndex() API를 통해 현재 선택된 탭의 index를 가져와서 해당 탭을 삭제할 때 사용할 수도 있습니다.

- parameter
	- index {integer} Required.
		- Depth 1 탭 인덱스 {integer}
	- index2 {integer} Optional.
		- Depth 2 탭 인덱스 {integer}

<div class="eg">
	<div class="egview"> 
		<div class="Margin-bottom-10">
			remove할 탭의 index를 입력하고 버튼을 클릭하세요 : <input class="Textinput" id="input_index" value="3"/>
			<button id="btn_removeTab" class="Button">removeTab(index)</button>
		</div>
		<div class="Tabs" id="tabs_removeTab">
			<ul>
				<li data-content="#tab0">tab0</li>
				<li data-content="#tab1">tab1</li>
				<li data-content="#tab2">tab2</li>
				<li data-content="#tab3">tab3</li>
				<li data-content="#tab4">tab4</li>
				<li data-content="#tab5">tab5</li>
				<li data-content="#tab6">tab6</li>
				<li data-content="#tab7">tab7</li>
			</ul>
			<div id="tab0">
				<h1>0</h1>
			</div>
			<div id="tab1">
				<h1>1</h1>
			</div>
			<div id="tab2">
				<h1>2</h1>
			</div>
			<div id="tab3">
				<h1>3</h1>
			</div>
			<div id="tab4">
				<h1>4</h1>
			</div>
			<div id="tab5">
				<h1>5</h1>
			</div>
			<div id="tab6">
				<h1>6</h1>
			</div>
			<div id="tab7">
				<h1>7</h1>
			</div>
		</div>
	</div>
```
		<div class="Margin-bottom-10">
			remove할 탭의 index를 입력하고 버튼을 클릭하세요 : <input class="Textinput" id="input_index" value="3"/>
			<button id="btn_removeTab" class="Button">removeTab(index)</button>
		</div>
		<div class="Tabs" id="tabs_removeTab">
			<ul>
				<li data-content="#tab0">tab0</li>
				<li data-content="#tab1">tab1</li>
				<li data-content="#tab2">tab2</li>
				<li data-content="#tab3">tab3</li>
				<li data-content="#tab4">tab4</li>
				<li data-content="#tab5">tab5</li>
				<li data-content="#tab6">tab6</li>
				<li data-content="#tab7">tab7</li>
			</ul>
			<div id="tab0">
				<h1>0</h1>
			</div>
			<div id="tab1">
				<h1>1</h1>
			</div>
			<div id="tab2">
				<h1>2</h1>
			</div>
			<div id="tab3">
				<h1>3</h1>
			</div>
			<div id="tab4">
				<h1>4</h1>
			</div>
			<div id="tab5">
				<h1>5</h1>
			</div>
			<div id="tab6">
				<h1>6</h1>
			</div>
			<div id="tab7">
				<h1>7</h1>
			</div>
		</div>
```
```
$('#btn_removeTab').click(function() {
	var index = $('#input_index').val();
	index = parseInt(index);
	$('#tabs_removeTab').removeTab(index);
});
```
</div>
<script>
$('#btn_removeTab').click(function() {
	var index = $('#input_index').val();
	index = parseInt(index);
	$('#tabs_removeTab').removeTab(index);
});
</script>

### .setTabIndex(index, setFocus)

해당 인덱스의 탭을 선택합니다.

- parameter
	- index {integer|array} Required.
		- {integer} 
			- 선택될 탭의 인덱스
		- {array} **v2.3.6.15 이후**
			- 2 Depth 탭에서 선택될 탭의 인덱스 
			- [depth1, depth2]
	- setFocus {boolean} Optional
		- 해당 탭 버튼 포커스 여부
		

<div class="eg">
	<div class="egview"> 
		<div class="Margin-bottom-10">
			<div id="spinner1" class="Spinner" data-min="0" data-max="2"> 
			    <input value="0">
			    <a class="Up"></a>
			    <a class="Down"></a>
			</div>
			<button id="btn_setTabIndex" class="Button">setTabIndex()</button>
		</div>
		<div class="Tabs" id="tabs4">
			<ul>
				<li data-content="#tab1">tab1</li>
				<li data-content="#tab2">tab2</li>
				<li data-content="#tab3">tab3</li>
			</ul>
			<div id="tab1">
				<strong>tab1</strong>
				<p>tab1 - (index : 0)</p>
			</div>
			<div id="tab2">
				<strong>tab2</strong>
				<p>tab2 - (index : 1)</p>
			</div>
			<div id="tab3">
				<strong>tab3</strong>
				<p>tab3 - (index : 2)</p>
			</div>
		</div>
	</div>
```
<div class="Margin-bottom-10">
	<div id="spinner1" class="Spinner" data-min="0" data-max="2"> // 0~2 까지의 Spinner 설정 (Spinner 컴포넌트 참고)
	    <input value="0">
	    <a class="Up"></a>
	    <a class="Down"></a>
	</div>
	<button id="btn_setTabIndex" class="Button">setTabIndex()</button>
</div>
<div class="Tabs" id="tabs4">
	<ul>
		<li data-content="#tab1">tab1</li>
		<li data-content="#tab2">tab2</li>
		<li data-content="#tab3">tab3</li>
	</ul>
	<div id="tab1">
		<strong>tab1</strong>
		<p>tab1 - (index : 0)</p>
	</div>
	<div id="tab2">
		<strong>tab2</strong>
		<p>tab2 - (index : 1)</p>
	</div>
	<div id="tab3">
		<strong>tab3</strong>
		<p>tab3 - (index : 2)</p>
	</div>
</div>
```
```
$('#btn_setTabIndex').click(function() {
	var index = $('#spinner1 input').val();
	index = parseInt(index);
	$('#tabs4').setTabIndex(index);
});
```
</div>
<script>
$('#btn_setTabIndex').click(function() {
	var index = $('#spinner1 input').val();
	index = parseInt(index);
	$('#tabs4').setTabIndex(index);
});
</script>



### .reload(index)

해당 인덱스의 탭 컨텐츠가 iframe 일 경우, ifrmae 을 새로고침 합니다.

- parameter
	- index {integer} Required.
		- 새로고침할 탭의 인덱스.

<div class="eg">
	<div class="egview">
		<div class="Margin-bottom-10">
            	<button class="Button" id="reload0">reload(0)</button>	
			<button class="Button" id="reload1">reload(1)</button>
			<button class="Button" id="setTabIndex1_reload1">setTabIndex(1) + reload(1)</button>
        	</div>
		<div class="Tabs" id="tab_reload">
		    <ul>
		        <li data-content="tabs/content.html" data-content-iframe="true" data-content-iframe-id="iframe0">iframe0</li>
		        <li data-content="tabs/content.html" data-content-iframe="true" data-content-iframe-id="iframe1">iframe1</li>
		    </ul>
		</div>	
	</div>
```
<div class="Margin-bottom-10">
	<button class="Button" id="reload0">reload(0)</button>	
	<button class="Button" id="reload1">reload(1)</button>
	<button class="Button" id="setTabIndex1_reload1">setTabIndex(1) + reload(1)</button>
</div>
<div class="Tabs" id="tab_reload">
	<ul>
		<li data-content="tabs/content.html" data-content-iframe="true" data-content-iframe-id="iframe0">iframe0</li>
		<li data-content="tabs/content.html" data-content-iframe="true" data-content-iframe-id="iframe1">iframe1</li>
	</ul>
</div>

```
```
// index 0 인 탭 새로고침
$('#reload0').click(function() {
	$("#tab_reload").reload(0);
});

// index 1 인 탭 새로고침. 탭은 변경되지 않으나 탭 내 컨텐츠는 새로고침 됨.
$('#reload1').click(function() {
	$("#tab_reload").reload(1);
});

// index 1 인 탭으로 탭 변경 하면서 새로고침
$('#setTabIndex1_reload1').click(function() {
	$("#tab_reload").setTabIndex(1);
	$("#tab_reload").reload(1);
});
```
</div>
<script>
// index 0 인 탭 새로고침
$('#reload0').click(function() {
	$("#tab_reload").reload(0);
});

// index 1 인 탭 새로고침. 탭은 변경되지 않으나 탭 내 컨텐츠는 새로고침 됨.
$('#reload1').click(function() {
	$("#tab_reload").reload(1);
});

// index 1 인 탭으로 탭 변경 하면서 새로고침
$('#setTabIndex1_reload1').click(function() {
	$("#tab_reload").setTabIndex(1);
	$("#tab_reload").reload(1);
});
</script>



### .setTabWidth(width)

> **v2.3.15 이후** 호환  

Fixed 탭의 탭 버튼 고정 너비를 동적 설정합니다.  
탭의 수가 증가할 때 가로 스크롤이 생성되기 위해서는 div.Tabs 엘리먼트의 너비가 설정되어 있어야 합니다.  

- parameter
	- width {integer} Required.
		- Fixed 탭의 탭 버튼 너비.

<div class="eg">
	<div class="egview"> 
	
<button id="addTab" class="Button">Add Tab</button>
<button id="setTabWidth80" class="Button">setTabWidth(80)</button>
<button id="setTabWidth120" class="Button">setTabWidth(120)</button>
<button id="setTabWidth150" class="Button">setTabWidth(150)</button>

	<div class="Tabs Fixed Margin-top-10" id="setTabWidthTab" style="width:800px;" data-remove-button="true">
		<div class="Scroller">
			<ul>
				<li data-content="#tab1">Cappuccino</li>
				<li data-content="#tab2">Tea</li>
				<li data-content="#tab3">Ice Americano</li>
				<li data-content="#tab4">Water</li>
			</ul>
		</div>
		<div id="tab1">카푸치노</div>
		<div id="tab2">차</div>
		<div id="tab3">아이스 아메리카노</div>
		<div id="tab4">생수</div>
	</div>
		
	</div>
```
<button id="addTab" class="Button">Add Tab</button>
<button id="setTabWidth80" class="Button">setTabWidth(80)</button>
<button id="setTabWidth120" class="Button">setTabWidth(120)</button>
<button id="setTabWidth150" class="Button">setTabWidth(150)</button>

	<div class="Tabs Fixed Margin-top-10" id="setTabWidthTab" style="width:800px;" data-remove-button="true">
		<div class="Scroller">
			<ul>
				<li data-content="#tab1">Cappuccino</li>
				<li data-content="#tab2">Tea</li>
				<li data-content="#tab3">Ice Americano</li>
				<li data-content="#tab4">Water</li>
			</ul>
		</div>
		<div id="tab1">카푸치노</div>
		<div id="tab2">차</div>
		<div id="tab3">아이스 아메리카노</div>
		<div id="tab4">생수</div>
	</div>
</div>
```
```
var num = 0;
$('#addTab').click(function() {
    var contentId = "addTabCont"+num;
    var content = '<div id="'+contentId+'" >addedTab'+num+'</div>';
    $('#setTabWidthTab').append(content);
    var title = "addTabCont"+num;
    contentId = "#"+contentId; 
    $('#setTabWidthTab').addTab(title,contentId);
    num++;
});
$('#setTabWidth80').click(function(){
	$('#setTabWidthTab').setTabWidth(80);
});
$('#setTabWidth120').click(function(){
	$('#setTabWidthTab').setTabWidth(120);
});
$('#setTabWidth150').click(function(){
	$('#setTabWidthTab').setTabWidth(150);
});
```
</div>
<script>
var num = 0;
$('#addTab').click(function() {
    var contentId = "addTabCont"+num;
    var content = '<div id="'+contentId+'" >addedTab'+num+'</div>';
    $('#setTabWidthTab').append(content);
    var title = "addTabCont"+num;
    contentId = "#"+contentId; 
    $('#setTabWidthTab').addTab(title,contentId);
    num++;
});
$('#setTabWidth80').click(function(){
	$('#setTabWidthTab').setTabWidth(80);
});
$('#setTabWidth120').click(function(){
	$('#setTabWidthTab').setTabWidth(120);
});
$('#setTabWidth150').click(function(){
	$('#setTabWidthTab').setTabWidth(150);
});
</script>







### .setDraggable(boolean)

탭을 Drag & Drop 할 수 있도록 설정합니다.(IE 10 이상)  

- parameter
	- true {boolean}
		- 탭을 Drag & Drop 할 수 있습니다.
	- false {boolean} Default.
		- 탭 Drag & Drop 설정을 해제 합니다.

<div class="eg">
<div class="egview">	
	
	<div class="Margin-bottom-10">
		<button class="Button" id="draggable_true">setDraggable(true)</button>
		<button class="Button" id="draggable_false">setDraggable(false)</button>
	</div>

	<div class="Tabs" id="tab_draggable">
	    <ul>
	        <li data-content="#tab1_draggable">tab1_draggable</li>
	        <li data-content="#tab2_draggable">tab2_draggable</li>
	        <li data-content="#tab3_draggable">tab3_draggable</li>
	        <li data-content="#tab4_draggable">tab4_draggable<button class="RemoveButton"></button></li>
	    </ul>
	    <div id="tab1_draggable">
	        <h1>1</h1>
	    </div>
	    <div id="tab2_draggable">
	        <h1>2</h1>
	    </div>
	    <div id="tab3_draggable">
	        <h1>3</h1>
	    </div>
	    <div id="tab4_draggable">
	        <h1>4</h1>
	    </div>
	</div>
	
	
</div>
```
<div class="Margin-bottom-10">
	<button class="Button" id="draggable_true">setDraggable(true)</button>
	<button class="Button" id="draggable_false">setDraggable(false)</button>
</div>

<div class="Tabs" id="tab_draggable">
    <ul>
        <li data-content="#tab1_draggable">tab1_draggable</li>
        <li data-content="#tab2_draggable">tab2_draggable</li>
        <li data-content="#tab3_draggable">tab3_draggable</li>
        <li data-content="#tab4_draggable">tab4_draggable<button class="RemoveButton"></button></li>
    </ul>
    <div id="tab1_draggable">
        <h1>1</h1>
    </div>
    <div id="tab2_draggable">
        <h1>2</h1>
    </div>
    <div id="tab3_draggable">
        <h1>3</h1>
    </div>
    <div id="tab4_draggable">
        <h1>4</h1>
    </div>
</div>
```
```
$('#draggable_true').click(function() {
	$('#tab_draggable').setDraggable(true);
});
$('#draggable_false').click(function() {
	$('#tab_draggable').setDraggable(false);
});

```
</div>

<script>
$('#draggable_true').click(function() {
	$('#tab_draggable').setDraggable(true);
});
$('#draggable_false').click(function() {
	$('#tab_draggable').setDraggable(false);
});
</script>


### .setBeforeunload(index, handler)

해당 인덱스가 선택되어 있는 상태에서 다른 탭으로 이동되기 이전에 호출되는 함수를 등록합니다.
해당 함수에서 "return false;"로 리턴하면 다른 탭으로의 이동을 막을 수 있습니다.

- parameter
	- index {integer} Required. 콜백함수가 호출될 시점의 선택된 인덱스
	- handler {function} Required. 탭 페이지 이동 전에 호출되는 함수
- return
	- false 
		- 함수의 리턴값을 false로 지정하면, 탭 페이지 이동을 중지합니다.
	
<div class="eg">
	<div class="egview"> 
		<div class="Margin-bottom-10">
			<label>
			    <input id="radio21" class="Radio" type="radio" name="radio2" value="alertBeforeMove">
			    tab2로부터 벗어날때 alert
			</label>
			<br>
			<label>
			    <input id="radio22" class="Radio" type="radio" name="radio2" value="preventBeforeMove">
			    tab2로부터 이동 중지 (return false)
			</label>
		</div>
		<div class="Tabs" id="tabs5">
			<ul>
				<li data-content="#tab1">tab1</li>
				<li data-content="#tab2">tab2</li>
				<li data-content="#tab3">tab3</li>
			</ul>
			<div id="tab1">
				<strong>tab1</strong>
				<p>tab1 Content</p>
			</div>
			<div id="tab2">
				<strong>tab2</strong>
				<p>tab2 Content</p>
			</div>
			<div id="tab3">
				<strong>tab3</strong>
				<p>tab3 Content</p>
			</div>
			<div id="userTab">This is user defined tab's content</div>
		</div>
	</div>
```
		<div class="Margin-bottom-10">
			<label>
			    <input id="radio21" class="Radio" type="radio" name="radio2" value="alertBeforeMove">
			    tab2로부터 벗어날때 alert
			</label>
			<br>
			<label>
			    <input id="radio22" class="Radio" type="radio" name="radio2" value="preventBeforeMove">
			    tab2로부터 이동 중지 (return false)
			</label>
		</div>
		<div class="Tabs" id="tabs5">
			<ul>
				<li data-content="#tab1">tab1</li>
				<li data-content="#tab2">tab2</li>
				<li data-content="#tab3">tab3</li>
			</ul>
			<div id="tab1">
				<strong>tab1</strong>
				<p>tab1 Content</p>
			</div>
			<div id="tab2">
				<strong>tab2</strong>
				<p>tab2 Content</p>
			</div>
			<div id="tab3">
				<strong>tab3</strong>
				<p>tab3 Content</p>
			</div>
			<div id="userTab">This is user defined tab's content</div>
		</div>
```
```
$("input[name='radio2']").on('change', function(e){
	var value = $(e.currentTarget).getValue(); // 라디오 선택 시 해당 value 가져오기
	if(value === "alertBeforeMove"){
		// 대상이 되는 tab2 의 index인 1을 파라미터로 전달
		$('#tabs5').setBeforeunload(1, function(){
			alert("left from tab2");
		});
	}else if(value === "preventBeforeMove"){
		// 대상이 되는 tab2 의 index인 1을 파라미터로 전달 및 이동 중지를 위해 return false;
		$('#tabs5').setBeforeunload(1, function(){
			alert("prevented from leaving tab2");
			return false;
		});
	}
});
```
</div>
<script>
$("input[name='radio2']").on('change', function(e){
	var value = $(e.currentTarget).getValue(); // 라디오 선택 시 해당 value 가져오기
	if(value === "alertBeforeMove"){
		// 대상이 되는 tab2 의 index인 1을 파라미터로 전달
		$('#tabs5').setBeforeunload(1, function(){
			alert("left from tab2");
		});
	}else if(value === "preventBeforeMove"){
		// 대상이 되는 tab2 의 index인 1을 파라미터로 전달 및 이동 중지를 위해 return false;
		$('#tabs5').setBeforeunload(1, function(){
			alert("prevented from leaving tab2");
			return false;
		});
	}
});
</script>

### .setTabByContent(content)

data-content의 값을 가진 탭을 선택합니다.

- parameter
	- content {String} Required.
		- 선택될 탭의 data-content값.

<div class="eg">
	<div class="egview"> 		
		<div class="Margin-bottom-10">
			예) #tab3 <input id="textId" class="Textinput"> 
		    <button id="btn_setTabByContent" class="Button">setTabByContent()</button>
		</div>
		<div class="Tabs" id="tabs6">
		    <ul>
		        <li data-content="#tab1">tab1</li>
		        <li data-content="#tab2">tab2</li>
		        <li data-content="#tab3">tab3</li>
		    </ul>
		    <div id="tab1">
		        <strong>tab1</strong>
		        <p>tab1 content</p>
		    </div>
		    <div id="tab2">
		        <strong>tab2</strong>
		        <p>tab2 content</p>
		    </div>
		    <div id="tab3">
		        <strong>tab3</strong>
		        <p>tab3 content</p>
		    </div>
		</div>
	</div>
```
<div class="Margin-bottom-10">
	예) #tab3 <input id="textId" class="Textinput"> 
    <button id="btn_setTabByContent" class="Button">setTabByContent()</button>
</div>
<div class="Tabs" id="tabs6">
    <ul>
        <li data-content="#tab1">tab1</li>
        <li data-content="#tab2">tab2</li>
        <li data-content="#tab3">tab3</li>
    </ul>
    <div id="tab1">
        <strong>tab1</strong>
        <p>tab1 content</p>
    </div>
    <div id="tab2">
        <strong>tab2</strong>
        <p>tab2 content</p>
    </div>
    <div id="tab3">
        <strong>tab3</strong>
        <p>tab3 content</p>
    </div>
</div>
```
```
$('#btn_setTabByContent').click(function() {
	var content = $('#textId').val();
	$('#tabs6').setTabByContent(content);
});
```
</div>
<script>
$('#btn_setTabByContent').click(function() {
	var content = $('#textId').val();
	$('#tabs6').setTabByContent(content);
});
</script>

### .setEnabled(flag, index)

tabs 버튼을 활성화 / 비활성화하는 기능입니다.

- parameter
	- flag {boolean} Required. true면 활성화, false면 비활성화 시킵니다.
	- index {integer} Optional. index가 지정된 경우에는 지정된 탭만 활성화/비활성화합니다. index가 지정되지 않은 경우는 전체 탭을 활성화/비활성화 시킵니다.

<div class="eg">
	<div class="egview"> 		
		<div class="Margin-bottom-10">
		    <strong>flag:</strong>
		    <label>
		        <input id="radioId2" class="Radio" type="radio" name="radio_enb" value="true" checked="checked">true
		    </label>
		    <label>
		        <input class="Radio" type="radio" name="radio_enb" value="false">false
		    </label>
		     ,    <strong>index:</strong> <input id="textId2" class="Textinput" data-keyfilter="0-2"> 
		    <button id="btn_setEnabled" class="Button">setEnabled(flag, index)</button>
		</div>
		<div class="Tabs" id="tabs7">
		    <ul>
		        <li data-content="#tab1">tab1</li>
		        <li data-content="#tab2">tab2</li>
		        <li data-content="#tab3">tab3</li>
		    </ul>
		    <div id="tab1">
		        <strong>tab1</strong>
		        <p>tab1 content</p>
		    </div>
		    <div id="tab2">
		        <strong>tab2</strong>
		        <p>tab2 content</p>
		    </div>
		    <div id="tab3">
		        <strong>tab3</strong>
		        <p>tab3 content</p>
		    </div>
		</div>
	</div>
```
<div class="Margin-bottom-10">
	<strong>flag:</strong>
	<label>
        <input id="radioId2" class="Radio" type="radio" name="radio_enb" value="true" checked="checked">true
    </label>
    <label>
        <input class="Radio" type="radio" name="radio_enb" value="false">false
    </label>
     ,    <strong>index:</strong> <input id="textId2" class="Textinput" data-keyfilter="0-2"> // data-keyfilter는 'Masked Input' 참고
    <button id="btn_setEnabled" class="Button">setEnabled(flag, index)</button>
</div>
<div class="Tabs" id="tabs7">
    <ul>
        <li data-content="#tab1">tab1</li>
        <li data-content="#tab2">tab2</li>
        <li data-content="#tab3">tab3</li>
    </ul>
    <div id="tab1">
        <strong>tab1</strong>
        <p>tab1 content</p>
    </div>
    <div id="tab2">
        <strong>tab2</strong>
        <p>tab2 content</p>
    </div>
    <div id="tab3">
        <strong>tab3</strong>
        <p>tab3 content</p>
    </div>
</div>
```
```
$('#btn_setEnabled').click(function() {
	var flag = $('#radioId2').getValue();
	flag = JSON.parse(flag);
    var index = parseInt($('#textId2').val());
	$('#tabs7').setEnabled(flag, index);
});
```
</div>
<script>
$('#btn_setEnabled').click(function() {
	var flag = $('#radioId2').getValue();
	flag = JSON.parse(flag);
    var index = parseInt($('#textId2').val());
	$('#tabs7').setEnabled(flag, index);
});
</script>

### .setEnabledByContent(flag, content)

tabs 버튼을 활성화 / 비활성화하는 기능입니다.

- parameter
	- flag {boolean} 이 값이 true면 활성화, false면 비활성화 시킵니다.
	- content {String} 선택될 탭의 data-content값.
	
<div class="eg">
	<div class="egview">        
		<div class="Margin-bottom-10">
		    <strong>flag:</strong>
		    <label>
		        <input id="radioId3" class="Radio" type="radio" name="radio_enb_cont" value="true" checked="checked">true
		    </label>
		    <label>
		        <input class="Radio" type="radio" name="radio_enb_cont" value="false">false
		    </label>
		     ,    <strong>content:</strong> 
		     <button class="Dropdownbutton" id="dropdownbutton1">tab선택</button>
				<ul class="Dropdown">
				    <li><a>#tab1</a></li>
				    <li><a>#tab2</a></li>
				    <li><a>#tab3</a></li>
				</ul>
		    <button id="btn_setEnabledByContent" class="Button">setEnabledByContent(flag, content)</button>
		</div>
		<div class="Tabs" id="tabs8">
		    <ul>
		        <li data-content="#tab1">tab1</li>
		        <li data-content="#tab2">tab2</li>
		        <li data-content="#tab3">tab3</li>
		    </ul>
		    <div id="tab1">
		        <strong>tab1</strong>
		        <p>tab1 content</p>
		    </div>
		    <div id="tab2">
		        <strong>tab2</strong>
		        <p>tab2 content</p>
		    </div>
		    <div id="tab3">
		        <strong>tab3</strong>
		        <p>tab3 content</p>
		    </div>
		</div>
	</div>
```
<div class="Margin-bottom-10">
    <strong>flag:</strong>
    <label>
        <input id="radioId3" class="Radio" type="radio" name="radio_enb_cont" value="true" checked="checked">true
    </label>
    <label>
        <input class="Radio" type="radio" name="radio_enb_cont" value="false">false
    </label>
    ,    <strong>content:</strong> 
     <button class="Dropdownbutton" id="dropdownbutton1">tab선택</button>
		<ul class="Dropdown">
		    <li><a>#tab1</a></li>
		    <li><a>#tab2</a></li>
		    <li><a>#tab3</a></li>
		</ul>
    <button id="btn_setEnabledByContent" class="Button">setEnabledByContent(flag, content)</button>
</div>
<div class="Tabs" id="tabs8">
    <ul>
        <li data-content="#tab1">tab1</li>
        <li data-content="#tab2">tab2</li>
        <li data-content="#tab3">tab3</li>
    </ul>
    <div id="tab1">
        <strong>tab1</strong>
        <p>tab1 content</p>
    </div>
    <div id="tab2">
        <strong>tab2</strong>
        <p>tab2 content</p>
    </div>
    <div id="tab3">
        <strong>tab3</strong>
        <p>tab3 content</p>
    </div>
</div>
```
```
$('#btn_setEnabledByContent').click(function() {
    var flag = $('#radioId3').getValue();
    flag = JSON.parse(flag);
    var content = $('#dropdownbutton1').getText();
    $('#tabs8').setEnabledByContent(flag, content);
});
```
</div>
<script>
$('#btn_setEnabledByContent').click(function() {
    var flag = $('#radioId3').getValue();
    flag = JSON.parse(flag);
    var content = $('#dropdownbutton1').getText();
    $('#tabs8').setEnabledByContent(flag, content);
});
</script>

### .getCurrentTabIndex()

현재 선택된 탭의 인덱스 값을 가져옵니다.

- return
	- index {integer} 탭 인덱스
	
	
### .getTabContentByIndex(index1, index2)

> **v2.3.5.2 이후**

인덱스에 해당하는 탭의 컨텐츠 element를 가져옵니다.
리턴된 div element를 통해 컨텐츠 내부 자식 요소에 접근할 때 사용됩니다.

- parameter
	- index1 {integer} Required.
		- Depth 1 탭 인덱스    
	- index2 {integer} Optional.
		- Depth 2 탭 인덱스 **(v2.3.6.15 이후)**
- return
	- DIV element {element node} 탭 컨텐츠의 최상위 부모 엘리먼트를 리턴.

	
```
$('#tabs_id').getTabContentByIndex(index);
```
	
### .getCurrentTabContent()

현재 선택된 탭의 data-content 값을 가져옵니다.

- return
	- content {String} data-content 값
	
```
$('#tabs_id').getCurrentTabContent();
```
	
### .getLength()

현재 탭의 length 값을 가져옵니다.

- return
	- count {integer} 탭의 length 값
	
### .getTitleByIndex(index1, index2)

> **v2.3.6.3 이후**

탭 인덱스 정보를 통해 탭 제목을 가져옵니다.  

- parameter
	- index1 {integer} Required.
		- Depth 1 탭 인덱스    
	- index2 {integer} Optional.
		- Depth 2 탭 인덱스 **(v2.3.6.15 이후)**
- return
	- title {string} 탭 제목 (li 테그의 text node)  
	
[Sample](#Events_beforetabchange)
	
### .cancelThisTabChange()

> **v2.3.6.3 이후**

'beforetabchange' 이벤트와 .cancelThisTabChange() API를 응용하여 탭 변경을 제한할 때 사용합니다.  

[Sample](#Events_beforetabchange)
	
### .isEnabled(index1, index2)

인덱스 탭의 활성화 여부를 확인하는 기능입니다.

- parameter
	- index1 {integer} Required.
		- Depth 1 탭 인덱스    
	- index2 {integer} Optional.
		- Depth 2 탭 인덱스 **(v2.3.6.15 이후)**
- return
	- flag {boolean} 탭의 활성화 여부를 리턴. true 일 때는 활성화 상태, false 일 때는 비활성화 상태.

<div class="eg">
	<div class="egview">   	
		<div class="Margin-bottom-10">
		    <span id="span2"></span>
		    <button id="btn_getCurrentTabIndex" class="Button">getCurrentTabIndex()</button>
		    <button id="btn_getCurrentTabContent" class="Button">getCurrentTabContent()</button>
		    <button id="btn_getLength" class="Button">getLength()</button>
		    <button id="btn_isEnabled0" class="Button">isEnabled(0)</button>
		    <button id="btn_isEnabled2" class="Button">isEnabled(2)</button>
		</div>
		<div class="Tabs" id="tabs9">
		    <ul>
		        <li data-content="#tab1">tab1</li>
		        <li data-content="#tab2">tab2</li>
		        <li data-content="#tab3">tab3</li>
		    </ul>
		    <div id="tab1">
		        <strong>tab1</strong>
		        <p>tab1 content</p>
		    </div>
		    <div id="tab2">
		        <strong>tab2</strong>
		        <p>tab2 content</p>
		    </div>
		    <div id="tab3">
		        <strong>tab3</strong>
		        <p>tab3 content</p>
		    </div>
		</div>
	</div>
```
<div class="Margin-bottom-10">
    <span id="span2"></span>
    <button id="btn_getCurrentTabIndex" class="Button">getCurrentTabIndex()</button>
    <button id="btn_getCurrentTabContent" class="Button">getCurrentTabContent()</button>
    <button id="btn_getLength" class="Button">getLength()</button>
    <button id="btn_isEnabled0" class="Button">isEnabled(0)</button>
    <button id="btn_isEnabled2" class="Button">isEnabled(2)</button>
</div>
<div class="Tabs" id="tabs9">
    <ul>
        <li data-content="#tab1">tab1</li>
        <li data-content="#tab2">tab2</li>
        <li data-content="#tab3">tab3</li>
    </ul>
    <div id="tab1">
        <strong>tab1</strong>
        <p>tab1 content</p>
    </div>
    <div id="tab2">
        <strong>tab2</strong>
        <p>tab2 content</p>
    </div>
    <div id="tab3">
        <strong>tab3</strong>
        <p>tab3 content</p>
    </div>
</div>
```
```
$('#tabs9').on('tabchange', function(e, index){
    $('#tabs9').setEnabled(false, 2);
 });

$('#btn_getCurrentTabIndex').click(function() {
    var val = $('#tabs9').getCurrentTabIndex();
    $('#span2').text(val);
});
$('#btn_getCurrentTabContent').click(function() {
    var val = $('#tabs9').getCurrentTabContent();
    $('#span2').text(val);
});
$('#btn_getLength').click(function() {
    var val = $('#tabs9').getLength();
    $('#span2').text(val);
});
$('#btn_isEnabled0').click(function() {
    var val = $('#tabs9').isEnabled(0);
    $('#span2').text(val);
});
$('#btn_isEnabled2').click(function() {
    var val = $('#tabs9').isEnabled(2);
    $('#span2').text(val);
});
```
</div>
<script>
$('#tabs9').on('tabchange', function(e, index){
    $('#tabs9').setEnabled(false, 2);
 });

$('#btn_getCurrentTabIndex').click(function() {
    var val = $('#tabs9').getCurrentTabIndex();
    $('#span2').text(val);
});
$('#btn_getCurrentTabContent').click(function() {
    var val = $('#tabs9').getCurrentTabContent();
    $('#span2').text(val);
});
$('#btn_getLength').click(function() {
    var val = $('#tabs9').getLength();
    $('#span2').text(val);
});
$('#btn_isEnabled0').click(function() {
    var val = $('#tabs9').isEnabled(0);
    $('#span2').text(val);
});
$('#btn_isEnabled2').click(function() {
    var val = $('#tabs9').isEnabled(2);
    $('#span2').text(val);
});
</script>

