
# Panel

## Basic

Panel은 Layout을 구성하기 위해 사용되는 UI 엘리먼트 입니다. Wrapper 엘리먼트로 사용되며 스크롤 및 자동 사이즈 조절 기능이 있습니다. 
Panel의 기본 스타일은 없습니다. 높이 및 가로너비 크기 등은 개발자가 세팅하거나 data-fill 속성을 사용하여 자동 조절되게 합니다.

<div class="eg">
<div class="egview">
	<div class="Panel">
		<div class="Panel-header">Alopex UI (class="Panel-header")</div>
		<div class="Panel-content">
	Alopex UI는 새로운 아키텍처 기반의 애플리케이션 재구축을 가정하지 않아도 됩니다. 기존의 JSP, ASP등의 애플리케이션 구조를 훼손하지 않으면서, 부분적인 적용이 가능합니다.
	자바스크립트 코드 양이 많아질 수 있는 유효성 검증, 데이터 연동 등에서 코드 대신 마크업만으로 적용 가능하기 때문에 불필요한 자바스크립트 코드를 최소화하여 개발 생산성을 향상시킵니다.
	PC웹과 모바일웹에서 모두 적용 가능한  OSMU(One Source Multi Use)를 지향합니다.
		</div>
	</div>
</div>

```
<div class="Panel">
	<div class="Panel-header">Alopex UI (class="Panel-header")</div>
	<div class="Panel-content">
Alopex UI는 새로운 아키텍처 기반의 애플리케이션 재구축을 가정하지 않아도 됩니다. 기존의 JSP, ASP등의 애플리케이션 구조를 훼손하지 않으면서, 부분적인 적용이 가능합니다.
자바스크립트 코드 양이 많아질 수 있는 유효성 검증, 데이터 연동 등에서 코드 대신 마크업만으로 적용 가능하기 때문에 불필요한 자바스크립트 코드를 최소화하여 개발 생산성을 향상시킵니다.
PC웹과 모바일웹에서 모두 적용 가능한  OSMU(One Source Multi Use)를 지향합니다.
	</div>
</div>
```
</div>

<div class="eg">
<div class="egview">
	<div class="Panel">
		<div class="Panel-content">
	Alopex UI는 새로운 아키텍처 기반의 애플리케이션 재구축을 가정하지 않아도 됩니다. 기존의 JSP, ASP등의 애플리케이션 구조를 훼손하지 않으면서, 부분적인 적용이 가능합니다.
	자바스크립트 코드 양이 많아질 수 있는 유효성 검증, 데이터 연동 등에서 코드 대신 마크업만으로 적용 가능하기 때문에 불필요한 자바스크립트 코드를 최소화하여 개발 생산성을 향상시킵니다.
	PC웹과 모바일웹에서 모두 적용 가능한  OSMU(One Source Multi Use)를 지향합니다.
		</div>
		<div class="Panel-footer">Alopex UI (class="Panel-footer")</div>
	</div>
</div>

```
<div class="Panel">
	<div class="Panel-content">
Alopex UI는 새로운 아키텍처 기반의 애플리케이션 재구축을 가정하지 않아도 됩니다. 기존의 JSP, ASP등의 애플리케이션 구조를 훼손하지 않으면서, 부분적인 적용이 가능합니다.
자바스크립트 코드 양이 많아질 수 있는 유효성 검증, 데이터 연동 등에서 코드 대신 마크업만으로 적용 가능하기 때문에 불필요한 자바스크립트 코드를 최소화하여 개발 생산성을 향상시킵니다.
PC웹과 모바일웹에서 모두 적용 가능한  OSMU(One Source Multi Use)를 지향합니다.
	</div>
	<div class="Panel-footer">Alopex UI (class="Panel-footer")</div>
</div>
```
</div>

 
## Attributes
 


### class 


- "Panel"  
	- Alopex UI Panel 컴포넌트를 사용한다고 명시하는 속성입니다.
	
### data-fill
- "none" : default
	- 자동 여백 채우기 기능을 사용하지 않습니다.
- "vertical"
	- 부모의 빈 여백의 높이를 꽉 채워줍니다.
- "horizontal"
	- 가로 너비 길이 계산.

Panel 의 크기를 자동으로 조정하는 attribute입니다. 부모 엘리먼트를 기준으로 여백의 공간이 있을 경우 자동으로 채워줍니다. 
구현 방식은 Panel의 부모 엘리먼트 크기에서 Panel의 형제 엘리먼트들의 너비의 합을 빼서 크기를 조절합니다.
부모의 높이 또는 너비 값이 정의되어 있어야 합니다. 부모의 높이 또는 너비 값이 자식 요소에 따라 가변적으로 변하는 경우에는 사용할 수 없습니다.
vertical로 설정할 경우 모든 형제 컴포넌트가 수직적으로 배치되어 있어야 하고,<br>
horizontal로 설정할 경우 모든 형제 컴포넌트가 수평적으로 배치되어 있어야 합니다.

#### data-fill = 'vertical'

<div class="eg">
<div class="egview">
	<div style="height:250px; background:#cccccc; padding:10px">
		<div style="height:30px;">Title height:30px</div>
		<div class="Panel" data-fill="vertical">
		회색 부분 부모 높이 250px 에서 Title 높이 30px 을 뺀 나머지 220px 만큼의 vertical 영역을 자동으로 채워줍니다.</div>
	</div>
</div>

```
<div style="height:250px; background:#cccccc; padding:10px">
	<div style="height:30px;">Title height:30px</div>
	<div class="Panel" data-fill="vertical">
	회색 부분 부모 높이 250px 에서 Title 높이 30px 을 뺀 나머지 220px 만큼의 vertical 영역을 자동으로 채워줍니다.</div>
</div>
```
</div>

#### data-fill = 'horizontal'

<div class="eg">
<div class="egview">
	<!-- float:left 를 통한 수평적 배치 -->
	<div style="height:100px; width:600px; background:#cccccc; padding:10px">
		<div style="height:100px; width:200px; float:left; background:#eeeeee; margin-right:10px;">Title width:200px</div>
		<div class="Panel" data-fill="horizontal" style="height:100px; float:left;">
		회색 부분 부모 너비 600px 에서 Title 너비 200px 을 뺀 나머지 400px 만큼의 horizontal 영역을 자동으로 채워줍니다.</div>
	</div>
</div>

```
<!-- float:left 를 통한 수평적 배치 -->
<div style="height:100px; width:600px; background:#cccccc; padding:10px">
	<div style="height:100px; width:200px; float:left; background:#eeeeee; margin-right:10px;">Title width:200px</div>
	<div class="Panel" data-fill="horizontal" style="height:100px; float:left;">
	회색 부분 부모 너비 600px 에서 Title 너비 200px 을 뺀 나머지 400px 만큼의 horizontal 영역을 자동으로 채워줍니다.</div>
</div>
```
</div>


### data-scroll
부분 스크롤 기능을 지원하기 위한 attribute로 제공됩니다.
웹의 경우 overflow:scroll 속성을 부여할 경우 쉽게 부분 스크롤을 구현할 수 있지만, 
모바일의 경우 일부 버전에서 overflow:scroll 속성이 지원이 안되거나 성능이 떨어집니다. 
이에 웹과 모바일 공용으로 사용할 수 있는 기능으로 제공합니다.<br>
스크롤 기능을 사용할 경우, 자식 엘리먼트가 panel 엘리먼트의 크기보다 작아야 스크롤이 생깁니다. 
panel의 크기가 지정이 되어 있지 않을 경우, panel의 크기가 auto로 설정되어 오작동 할 수 있습니다.
아래 예제에서 패널의 높이 및 가로 너비 사이즈를 지정해 주는 이유는 이에 있습니다.

- "false" : default
	- 패널 내부 부분 스크롤 기능을 비활성화합니다. data-scroll 속성 미 입력 시 선택됩니다.
- "true"
	- 패널 내부의 부분 스크롤을 활성화합니다.




<div class="eg">
<div class="egview">
	<div class="Panel" data-scroll="true" style="height:100px;">
		<div style="height:200px;">
			Alopex UI는 새로운 아키텍처 기반의 애플리케이션 재구축을 가정하지 않아도 됩니다. 기존의 JSP, ASP등의 애플리케이션 구조를 훼손하지 않으면서, 부분적인 적용이 가능합니다. 자바스크립트 코드 양이 많아질 수 있는 유효성 검증, 데이터 연동 등에서 코드 대신 마크업만으로 적용 가능하기 때문에 불필요한 자바스크립트 코드를 최소화하여 개발 생산성을 향상시킵니다. PC웹과 모바일웹에서 모두 적용 가능한  OSMU(One Source Multi Use)를 지향합니다.
		</div>
	</div>
</div>

```
<div class="Panel" data-scroll="true" style="height:100px;">
	<div style="height:200px;">
		Alopex UI는 새로운 아키텍처 기반의 애플리케이션 재구축을 가정하지 않아도 됩니다. 기존의 JSP, ASP등의 애플리케이션 구조를 훼손하지 않으면서, 부분적인 적용이 가능합니다. 자바스크립트 코드 양이 많아질 수 있는 유효성 검증, 데이터 연동 등에서 코드 대신 마크업만으로 적용 가능하기 때문에 불필요한 자바스크립트 코드를 최소화하여 개발 생산성을 향상시킵니다. PC웹과 모바일웹에서 모두 적용 가능한  OSMU(One Source Multi Use)를 지향합니다.
	</div>
</div>
```
</div>



## Functions

### refresh()

data-fill 속성 사용시, UI 컴포넌트의 높이 값과 너비 값을 재조정합니다.
부모 엘리먼트 또는 형제 엘리먼트의 크기가 동적으로 변경되었을 시 사용합니다. 여백을 다시 구한 후, 그에 맞게 높이 값 또는 너비 값을 세팅합니다.
data-scroll 속성 사용시, 스크롤 내부 엘리먼트의 크기가 동적으로 바뀌었으면 스크롤 영역을 다시 계산하는데 사용됩니다.

- parameter
	- None
	
- return 
	- None

- sample code

``` 
$('#panel').refresh();
```
<br>
<div class="eg">
<div class="egview">
	<button class="Button" id="changeParentWidth">Change Parent Width</button>
	<button class="Button" id="doRefresh">Refresh</button>
	<!-- float:left 를 통한 수평적 배치 -->
	<div id="horizontal_div" style="height:100px; width:600px; background:#cccccc; padding:10px">
		<div style="height:100px; width:200px; float:left; background:#eeeeee; margin-right:10px;">Title width:200px</div>
		<div id="horizontal_panel" class="Panel" data-fill="horizontal" style="height:100px; float:left;">
		[Change Parent Width] 버튼을 통해 부모 너비를 동적 조정하고, [Refresh] 버튼을 통해 Panel의 data-fill="horizontal" 기능을 재실행 해줍니다.</div>
	</div>
</div>

<script>
var cnt = 0;
$("#changeParentWidth").click(function(){
	if(cnt++ % 2 === 0){
		$("#horizontal_div").css("width", 800);
	}else{
		$("#horizontal_div").css("width", 600);
	}
});

$("#doRefresh").click(function(){
	$("#horizontal_panel").refresh();
});
</script>

```
<button class="Button" id="changeParentWidth">Change Parent Width</button>
<button class="Button" id="doRefresh">Refresh</button>
<!-- float:left 를 통한 수평적 배치 -->
<div id="horizontal_div" style="height:100px; width:600px; background:#cccccc; padding:10px">
	<div style="height:100px; width:200px; float:left; background:#eeeeee; margin-right:10px;">Title width:200px</div>
	<div id="horizontal_panel" class="Panel" data-fill="horizontal" style="height:100px; float:left;">
	[Change Parent Width] 버튼을 통해 부모 너비를 동적 조정하고, [Refresh] 버튼을 통해 Panel의 data-fill="horizontal" 기능을 재실행 해줍니다.</div>
</div>
</div>

<script>
var cnt = 0;
$("#changeParentWidth").click(function(){
	if(cnt++ % 2 === 0){
		$("#horizontal_div").css("width", 800);
	}else{
		$("#horizontal_div").css("width", 600);
	}
});

$("#doRefresh").click(function(){
	$("#horizontal_panel").refresh();
});
</script>
```
</div>
