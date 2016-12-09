# Event

## Basic

DOM 이벤트에서 제공하지 않는 이벤트를 추상화하여 제공합니다.

모바일 기기에서 click 이벤트는 손을 떼고 약 350ms 후에 이벤트가 발생됩니다. 반면 데스크탑 웹은 마우스를 클릭한 이후 바로 발생합니다.

이러한 차이점을 없애고 동일한 사용자 경험을 위해 `click` 이벤트를 추상화하여 `tap` 이벤트를 제공합니다. 이 이벤트는 마우스 기반과 터치 기반 기기에서 동일하게 딜레이없이 마우스 또는 손을 떼는시점에 발생합니다.

		
## Event 종류

### pressed

마우스클릭과 터치에 관계없이 최초 누르는 시점에 발생하는 이벤트 입니다. 포인터가 눌린 최초 1회에 발생합니다.

### move

pressed 이벤트 발생 후, 포인터가 이동할 때 발생하는	 이벤트 입니다.
최초 누른 지점에서 10px이상 벗어난 지점에서 좌표값이 바뀌는 매 회 발생합니다.

### unpressed

pressed 이벤트 발생 후 포인터가 화면에서 떨어졌을 때 발생하는 이벤트 입니다. 포인터가 떨어지는 1회에 발생합니다.

### tap

화면의 특정지점을 누르고 뗀 동작이 있을 때 발생하는 이벤트 입니다. 기존 클릭이벤트와 유사하게 사용되며, 포인터를 떼는 즉시 발생합니다.

### onetimetap

tap 이벤트 발생 후 250ms동안 아무런 포인터 누름이 발생하지 않았을 때 DOM element가 1회만 눌렸음을 알려주는 이벤트입니다.

### doubletap

tap 이벤트가 동일한 엘리먼트에 대해서 500ms동안 2회 일어나고 250ms동안 아무런 포인터 누름이 발생하지 않았을 때 엘리먼트가 2회 눌렸음을 알려주는 이벤트입니다.

### tripletap

tap 이벤트가 동일한 엘리먼트에 대해서 750ms동안 3회 일어나고 250ms동안 아무런 포인터 누름이 발생하지 않았을 때 DOM element가 3회 눌렸음을 알려주는 이벤트입니다.

### longtap

화면의 DOM element를 누르고 750ms가 지났을 때 발생하는 이벤트입니다.

### swipe

화면에서 포인터를 눌러서 특정 방향/거리/속도기준에 의거하여 이동하게 되었을 때 발생하는 이벤트 입니다. 기본 조건은 최초 눌린 지점에서 100px이상 떨어진 지점에서 포인터를 떼거나, 또는 포인터를 떼는 시점에서의 속도가 100px/sec 이상일 때에 발생하도록 되어 있습니다.

### swipemove

Deprecated. [move](Event종류_move) 이벤트를 사용합니다.


### swipecancel

포인터가 떨어졌을 때 swipe발생 조건에 해당되지 못하면 발생하는 이벤트 입니다
 
### hoverstart

마우스 기반 화면에서 발생하며, 마우스 커서가 화면상 엘리먼트에 진입할 때에 발생하는 이벤트입니다.

### hovering

마우스 기반 화면에서 발생하며, 마우스 커서가 엘리먼트 위에 위치할 때 발생하는 이벤트입니다.

### hoverend

마우스 기반 화면에서 발생하며, 마우스 커서가 엘리먼트에 진입했다 빠져나갈 때 발생하는 이벤트입니다



## Event Object

이벤트 시점에 실행되는 핸들러에서 사용하는 이벤트 오브젝트에 이벤트에 따라 다음과 같은 정보가 제공됩니다.

- pageX {Number}
	- document 좌측을 기준으로 현재 포인터가 위치한 곳의 x축 좌표
- pageY {Number}
	- document 상단을 기준으로 현재 포인터가 위치한 곳의 y축 좌표
- startX {Number}
	- document 좌측을 기준으로 최초에 포인터가 눌린 지점의 x축 좌표
- startY {Number}
	- document 상단을 기준으로 최초에 포인터가 눌린 지점의 y축 좌표
- distance {Number}
	- 최소 직선 이동거리
- distanceX {Number}
 	- 최소 x축 이동 변위
- distanceY {Number}
	- 최소 y축 이동 변위
- speed {Number}
	- 포인터 떼는 시점의 최소 속도
- speedX {Number}
	- 현재 포인터의 x축 기준 속도(pixel per second)
- speedY {Number}
	- 현재 포인터의 y축 기준 속도(pixel per second)
- direction {String}
	- swipe를 허용하는 방향. up, upright, right,downright, down, downleft, left, upleft의 값이 허용되며, 여러개의 값을 빈칸으로 구분하여 1개 이상 사용할 수 있습니다.
- alignment {String}
	- swipe를 허용하는 포인터의 정렬방향. vertical, diagonal, horizontal의 값이 허용되며, 여러개의 값을 빈칸으로 구분하여 1개 이상 사용할 수 있습니다. 



## Attribute

HTML onclick 속성과 같이 data-{이벤트명} 형태로 이벤트 핸들러를 등록할 수 있습니다.
		
### data-{이벤트명} {String}
			
이벤트 핸들링을 HTML Attribute를 통해 하고자 할 때 사용하는 속성입니다.
				

```				
<button id="button1" class="Button" 
   data-tap="$('#result').text(this.id + ' has ' + event.type + ' event.');">tap</button>

<button id="button2" class="Button"
   data-doubletap="$('#result').text('doubletap on '+this.id);"
   data-longtap="$('#result').text('longtapped on ' + aevent.pageX + ',' + aevent.pageY);">doubletap, longtap</button>
```

## Functions

### .{이벤트 이름}(handler)

{이벤트 이름}에 해당하는 이벤트 핸들러를 등록합니다.

- parameter
	- handler {function}
		- 해당 이벤트 발생 시 호출되는 핸들러 함수.
- return 
	- jQuery 오브젝트. 메소드 체이닝을 사용할 수 있도록 jQuery 오브젝트를 리턴합니다.