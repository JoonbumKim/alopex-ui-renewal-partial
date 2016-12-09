
# Splitter

## Basic
스플리터(Splitter)는 가로 또는 세로 방향으로 크기 조정 가능한 분할 윈도우를 구성 할 수 있는 컴포넌트입니다.

<div class="Splitter" data-position="40%" data-orientation="horizontal" style="height:600px;">
	<div id="frame1" class="top_panel">
	상단 콘텐츠
	</div>	
	<div id="frame2" class="bottom_panel">
		하단 콘텐츠
	</div>
</div>

	
```
<div class="Splitter" data-position="40%" data-orientation="horizontal" style="height:600px;">
	<div id="frame1" class="top_panel">
	상단 콘텐츠
	</div>	
	<div id="frame2" class="bottom_panel">
		하단 콘텐츠
	</div>
</div>

```

스플리터 컴포넌트는 [jQery Splitter Plugin](https://github.com/jcubic/jquery.splitter)을 wrapping한 구조로 되어 있습니다. 그렇기 때문에 기존 컴포넌트와는 별개로 아래 3가지 파일 링크가 필요합니다.

	- alopex-ext.js
		jquery-ui.js, jquery-spliter.js 가 merge된 파일
	- alopex-ext-setup.js
		Splitter에 대한 widget 확장 셋업
	- alopex-ext.css
		Splitter에 대한 스타일링

이 문서는 [jQery Splitter Plugin](https://github.com/jcubic/jquery.splitter)의 일부 기능을 설명하고 있습니다. 기타 기능은 [jQery Splitter Plugin](https://github.com/jcubic/jquery.splitter)에서 확인 바랍니다.

## Attribute

### class {string}

- "Splitter"  
	- 해당 엘리먼트가 Splitter 컴포넌트이라는 것을 지정합니다.
	
	
### data-position {string}

- %단위로 분할 비율을 설정합니다. %가 없을 경우 px로 인식.
	
### data-orientation {string}

- "horizontal"  
	- 가로 방향으로 크기 조정 가능한 분할 윈도우 구성합니다.
	
- "vertical"  
	- 세로 방향으로 크기 조정 가능한 분할 윈도우 구성합니다.
	
## Child Frame Attribute

### class {string}

- "top_panel"  
	- 부모 윈도우가 horizontal 분할 일 경우에 상단 패널로 지정.
	
- "bottom_panel"  
	- 부모 윈도우가 horizontal 분할 일 경우에 하단 패널로 지정.
	
- "left_panel"  
	- 부모 윈도우가 vertical 분할 일 경우에 좌측 패널로 지정.
	
- "right_panel"  
	- 부모 윈도우가 vertical 분할 일 경우에 우측 패널로 지정.
	
## Functions

### .split(JSON option)
동적으로 split 을 하고자 할 경우 사용합니다.

- "parameter"
	- option {JSON} Optional.
		- Splitter 의 방향, 여백, 비울을 설정합니다.
		  - orientation
		    - horizontal
		     - 가로 방향으로 크기 조정 가능한 분할 윈도우 구성합니다.
		    - vertical
		     - 세로 방향으로 크기 조정 가능한 분할 윈도우 구성합니다.
		   - limit
		    - 여백 pixel 값
		   - position
		    - split 비율. %가 없을 경우 px 로 인식
		
```
$('#foo').split({
    orientation: 'horizontal',
    limit: 10,
    position: '50%'
});

```

## Setup
setup 자바스크립트에서 스플리터의 기본 속성을 공통으로 설정합니다. 

```
$a.setup('splitter', {
	position: '50%',
	limit: 10,
	orientation: 'horizontal'
});
```

- position {string}
	- "50%"
		- split 비율. %가 없을 경우 px 로 인식
- limit {int}
	- 10
		- 여백 pixel 값
- orientation {string}
	- "horizontal"
		- 가로 방향으로 크기 조정 가능한 분할 윈도우 구성
	- "vertical"
	    - 세로 방향으로 크기 조정 가능한 분할 윈도우 구성
