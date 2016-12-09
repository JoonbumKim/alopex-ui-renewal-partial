# Progress
## Functions
### .overlay(option)

선택된 영역과 같은 크기의 오버레이를 영역 바로 위에 생성합니다. 함수 호출 시 셀렉터로 선택된 대상이 document인 경우 전체화면에 오버레이를 띄우게 됩니다.

- Parameter
	- option {object}
		- bgColor {string}
			- 오버레이의 색상을 지정합니다. css의 background-color 속성값
		- duration {integer}
			- 오버레이/default progress가 완전히 표시되기까지 걸리는 시간
		- durationOff {integer}
			- 오버레이/default progress가 완전히 사라지기까지 걸리는 시간
		- opacity {float}
			- 오버레이의 투명도. 0에서 1 사이의 값을 가집니다. 0은 완전 투명이며, 1은 완전 불투명 입니다.
		- progress {boolean}
			- 화면에 progress를 띄울 것인가 여부를 지정합니다. `true`로 설정된 경우, `.progress` 함수와 동일합니다.
		- createProgress
			- 커스텀 프로그레스바를 정의합니다.

			- [createProgress 예제](#examples)

		- resizeProgress
			- 선택된 영역(오버레이 영역)의 크기가 변경되는 경우의 처리해주어야 될 부분(프로그레스바 위치 등)을 정의됩니다.
		- removeProgress
			- 오버레이를 제거할 때에, 기존에 생성된 progress를 제거하는 기능을 따로 구현해야 할 경우 사용합니다.
					참고해 주십시오.
		- appendIn
			- 오버레이를 표시하고자 하는 대상 태그 안쪽에 생성하는가 여부를 명시합니다.
				- `false`일 경우 오버레이는 대상 element의 바로 다음에 생성됩니다.
				- `true`이고 오버레이를 생성하는 대상 element의 css position 값이 relative일 경우, 오버레이의 height와 width는 pixel값이 아닌 100% 값으로 지정이 되게 됩니다. 
				- 만일 오버레이를 표시하는
					대상의 contents가 동적으로 변화하여 크기변화가 발생하는 경우 target
					element의 position 값을 relative로 하고 appendIn option을 true로
					둔다면 contents 크기 변화에 대해 resize API 호출 없이 자연스럽게 
					오버레이 크기를 변화시키는 것이 가능합니다.
		- complete
			- 오버레이가 완전히 표시되거나, 또는 완전히 사라졌을 때 호출할 함수를 명시합니다.
- return
	- 오버레이 인스턴스
		- `duration` 속성이 지정되어 있지 않을 경우, 오버레이를 제거하기 위해 사용됩니다.

```
var overlay = $('#content').overlay();
overlay.remove();
``` 

<style>
	#overlayArea {
		width : 100%;
		height : 70px;
		background : skyblue;
		border :1px solid;
	}
</style>


<div class="eg Margin-top-10">
<div class="egview" style="height:100px;">
	<div class="Pos-abs Width-90" style="height:70px;">
		<button id="overlayStart" data-type="button" type="button">Overlay Start</button>
		<button id="overlayEnd" data-type="button" type="button">Overlay End</button>
		<div id="overlayArea"></div>
	</div>
</div>
```
<div class="Pos-abs Width-90" style="height:70px;">
	<button id="overlayStart" data-type="button" type="button">Overlay Start</button>
	<button id="overlayEnd" data-type="button" type="button">Overlay End</button>
	<div id="overlayArea"></div>
</div>
```
```
<script>
$(document).ready(function(){
	var overlay;
	$('#overlayStart').click(function() {
		overlay = $('#overlayArea').overlay();
	});
	$('#overlayEnd').click(function() {
		if (overlay != null && overlay != 'undefined') {
			overlay.remove();
		} 
	});
});
</script>

```
```
<style>
	#overlayArea {
		width : 100%;
		height : 70px;
		background : skyblue;
		border :1px solid;
	}
</style>
```

</div>
<script>
$(document).on('mdload', function(){
	var overlay;
	$('#overlayStart').click(function() {
		overlay = $('#overlayArea').overlay();
	});
	$('#overlayEnd').click(function() {
		if (overlay != null && overlay != 'undefined') {
			overlay.remove();
		} 
	});
});
</script>

프로그레스는 오버레이 위에 프로그레스바가 추가된 형태로 `.overlay` 함수에 `progress` 속성이 추가된 것과 동일합니다.



<style>
	#progressArea {
		width : 100%;
		height : 70px;
		background : skyblue;
		border :1px solid;
	}
</style>

### .progress(option)

오버레이를 생성하고, 프로그레스바를 보여주는 함수입니다.

- Parameter
	- option {object}
		- `.overlay` 함수의 `option`과 동일하나, `progress` 옵션이 `true`로 설정됩니다.
- return 
	- 프로그레스 인스턴스

```
var progress = $('#content').progress();
progress.remove();
``` 

<div class="eg Margin-top-10">
<div class="egview" style="height:100px;">
	<div class="Pos-abs Width-90" style="height:70px;">
		<button id="progressStart" data-type="button" type="button">Progress Start</button>
		<button id="progressEnd" data-type="button" type="button">Progress End</button>
		<div id="progressArea"></div>
	</div>
</div>
```
<div class="Pos-abs Width-90" style="height:70px;">
	<button id="progressStart" data-type="button" type="button">Progress Start</button>
	<button id="progressEnd" data-type="button" type="button">Progress End</button>
	<div id="progressArea"></div>
</div>
```
```
<script>
$(document).ready(function(){
	var prog;
	$('#progressStart').click(function() {
		prog = $('#progressArea').progress();
	});
	$('#progressEnd').click(function() {
		if (prog != null && prog != 'undefined') {
			prog.remove();
		} 
	}); 
});
</script>

```
```
<style>
	#progressArea {
		width : 100%;
		height : 70px;
		background : skyblue;
		border :1px solid;
	}
</style>
```

</div>
<script>
$(document).on('mdload', function(){
	var prog;
	$('#progressStart').click(function() {
		prog = $('#progressArea').progress();
	});
	$('#progressEnd').click(function() {
		if (prog != null && prog != 'undefined') {
			prog.remove();
		} 
	}); 
});
</script>

<style>
	.demoarea {
		position : relative;
		width : 94%;
		height : 150px;
		margin-top: 10px;
		background : #edf2f6;
		border : 1px solid #e2e4e7;
		border-radius: 4px;
	}
</style>


## Examples

### Custom Progress Indicator

사이트에 특화된 이미지 기반의 progress indicator를 사용하기 위해, custom progress indicator를 개발하는 예제 입니다.


<div class="eg">
<div class="egview">
	<button class="Button" id="button_show">show progress</button>
	<button class="Button" id="button_hide">hide progress</button>
	<div class="demoarea"></div>
</div>
```	
	<button class="Button" id="button_show">show progress</button>
	<button class="Button" id="button_hide">hide progress</button>
	<div class="demoarea"></div>
```
```	
	$(document).ready(function(){
		var createCircleProgress = function() {
			this.progress = document.createElement('div');
			this.progress.style.position = 'absolute';
			this.progress.style.width = '64px';
			this.progress.style.height = '64px';
			this.progress.style.zIndex = 99991;
			
			var size = this.generateSize();
			var dur = this.option.durationOff ? this.option.durationOff : 
				this.duration;
			
			this.progress.style.left = size.left + $(this.overlay).innerWidth()/2 - 32 + 'px';
			this.progress.style.top = size.top + $(this.overlay).innerHeight()/2 - 32 + 'px';
			this.progress.style.backgroundImage = 'url(/2.3/dev-js/overlay/progress.png)';
			$(this.progress).fadeIn(dur).insertAfter(this.overlay);
			this.progressTick = 0;
			var _this = this;
			this.ptimer = setInterval(function() {
				var pos = '0px ' + (7 - _this.progressTick%8)*64 + 'px';
				if(_this.progressTick%8 == 7) {
					_this.progressTick = -1;
				}
				_this.progress.style.backgroundPosition = pos;
				_this.progressTick++;
			}, 100);
		};
		var resizeCircleProgress = function() {
			var size = this.generateSize();
			this.progress.style.left = size.left + $(this.overlay).innerWidth()/2 - 32 + 'px';
			this.progress.style.top = size.top + $(this.overlay).innerHeight()/2 - 32 + 'px';
		};
		var removeCircleProgress = function() {
			var that = this;
			var dur = this.option.durationOff ? this.option.durationOff : 
				this.duration;
			$(this.progress).fadeOut(dur, function() {
				if(that.ptimer) {
				  clearInterval(that.ptimer);
				  that.ptimer = null;
				}
				$(that.progress).remove();
				that.progress = null;
			});
		};
		
		var progress = null
		$('#button_show').click(function() {
			progress = $('.demoarea').progress({
				duration : 300,
				durationOff : 500,
				appendIn : true,
				createProgress : createCircleProgress,
				resizeProgress : resizeCircleProgress,
				removeProgress : removeCircleProgress
			});
		});
		//사이트 전체의 overlay/progress API에 custom progress indicator를
		//적용하고자 하면 다음의 명령을 사용합니다.
		//AlopexOverlay.defaultOption.createProgress = createCircleProgress;
		//AlopexOverlay.defaultOption.resizeProgress = resizeCircleProgress;
		//AlopexOverlay.defaultOption.removeProgress = removeCircleProgress;
		
		$('#button_hide').click(function() {
			if(progress) {
			  progress.remove();
			}
		});
	});

```
```
<style>
	.demoarea {
		position : relative;
		width : 94%;
		height : 150px;
		margin-top: 10px;
		background : #edf2f6;
		border : 1px solid #e2e4e7;
		border-radius: 4px;
	}
</style>
```
</div>	


<script>
	$(document).ready(function(){
		var createCircleProgress = function() {
			this.progress = document.createElement('div');
			this.progress.style.position = 'absolute';
			this.progress.style.width = '64px';
			this.progress.style.height = '64px';
			this.progress.style.zIndex = 99991;
			var size = this.generateSize();
			var dur = this.option.durationOff ? this.option.durationOff : 
				this.duration;
			this.progress.style.left = size.left + $(this.overlay).innerWidth()/2 - 32 + 'px';
			this.progress.style.top = size.top + $(this.overlay).innerHeight()/2 - 32 + 'px';
			this.progress.style.backgroundImage = 'url(/2.3/dev-js/overlay/progress.png)';
			$(this.progress).fadeIn(dur).insertAfter(this.overlay);
			this.progressTick = 0;
			var _this = this;
			this.ptimer = setInterval(function() {
				var pos = '0px ' + (7 - _this.progressTick%8)*64 + 'px';
				if(_this.progressTick%8 == 7) {
					_this.progressTick = -1;
				}
				_this.progress.style.backgroundPosition = pos;
				_this.progressTick++;
			}, 100);
		};
		var resizeCircleProgress = function() {
			var size = this.generateSize();
			this.progress.style.left = size.left + $(this.overlay).innerWidth()/2 - 32 + 'px';
			this.progress.style.top = size.top + $(this.overlay).innerHeight()/2 - 32 + 'px';
		};
		var removeCircleProgress = function() {
			var that = this;
			var dur = this.option.durationOff ? this.option.durationOff : 
				this.duration;
			$(this.progress).fadeOut(dur, function() {
				if(that.ptimer) {
				  clearInterval(that.ptimer);
				  that.ptimer = null;
				}
				$(that.progress).remove();
				that.progress = null;
			});
		};
					var progress = null
		$('#button_show').click(function() {
			progress = $('.demoarea').progress({
				duration : 300,
				durationOff : 500,
				appendIn : true,
				createProgress : createCircleProgress,
				resizeProgress : resizeCircleProgress,
				removeProgress : removeCircleProgress
			});
		});
		//사이트 전체의 overlay/progress API에 custom progress indicator를
		//적용하고자 하면 다음의 명령을 사용합니다.
		//AlopexOverlay.defaultOption.createProgress = createCircleProgress;
		//AlopexOverlay.defaultOption.resizeProgress = resizeCircleProgress;
		//AlopexOverlay.defaultOption.removeProgress = removeCircleProgress;
		$('#button_hide').click(function() {
			if(progress) {
			  progress.remove();
			}
		});
	});
</script>

<style>
	.refresharea .contentbox {
		border:1px solid black;
		border-radius : 5px;
		padding:1em;
		background-color:#F1EDC2;
		overflow:hidden;
		/* position relative이고 overlay의 appendIn 옵션이 true인 경우
		   overlay의 height와 width값은 100%가 되어, 동적 컨텐츠 변경시
		   자연스럽게 overlay의 크기도 변화가 됩니다. */
		position:relative;
	}
	.refresharea .content {
		overflow:hidden;
	}
</style>

### Refresh Overlay
컨텐츠가 변경 시 컨텐츠의 높이에 따라 overlay를 띄우는 예제 입니다.

<div class="eg">
<div class="egview" style="height:500px;">
	<div class="refresharea">
		<button id="refreshButton" class="Button">refresh contents</button>
		<div class="contentbox">
			<div class="content">
				<h5>Sample Contents Area</h5>
			</div>
		</div>
	</div>
</div>
```
<div class="refresharea">
	<button id="refreshButton" class="Button">refresh contents</button>
	<div class="contentbox">
		<div class="content">
			<h5>Sample Contents Area</h5>
		</div>
	</div>
</div>
```
```
$(document).ready(function(){
	var ingredients = ['Brown rice', 'Cornmeal', 'Bread sticks',
		'Applesauce', 'Tomato', 'Peanut butter', 'Evaporated milk',
		'Olive oil', 'Carrot', 'Yogurt', 'Eggs', 'Minced garlic',
		'Ketchup', 'Mustard', 'Green pepper', 'Chicken breast',
		'Red snapper', 'Salmon', 'Cod'];
	//컨텐츠 생성 이전의 원래 크기
	var fromHeight = $('.refresharea .contentbox').outerHeight();
	if(navigator && /MSIE (\d+\.\d+);/.test(navigator.userAgent)){
	  if(new Number(RegExp.$1) <= 7)
	  	fromHeight = $('.refresharea .contentbox').height();
	}
	//컨텐츠 생성 이전의 padding 크기
	var paddingHeight = fromHeight - $('.refresharea .content').outerHeight();
	$('.refresharea .contentbox').animate({'height' : fromHeight});
	
	var refreshContents = function() {
		//fromHeight = $('.refresharea .contentbox').outerHeight();
		var progress = null;
		progress = $('.refresharea .contentbox').progress({
			duration : 200,
			durationOff : 200,
			opacity : 1,
			//overlay를 생성하는 element의 position값이 relative인 경우,
			//appendIn옵션을 true로 하게 되면 overlay의 크기가 자연스럽게 변경됩니다.
			appendIn : true,
			complete : function() {
				var content = '<h5>List of Stock Ingredients</h5>';
				content += '<div><ul class="List">';
				for(var i=0; i< ingredients.length; i++) {
					if( Math.random() > 0.7 ) {
						content += '<li>' + ingredients[i] + '</li>';
					}
				}
				content += '</ul></div>';
				$('.refresharea .content').html(content);
				//Alopex UI Component변환
				$.alopex.convert($('.refresharea .content'));
				
				//컨텐츠 생성 후 실제 높이
				var toHeight = paddingHeight + $('.refresharea .content').outerHeight();
				$('.refresharea .contentbox').animate({'height': toHeight}, 
					{
						step : function() {
							//resize API를 호출하여 overlay와 progress indicator의 위치를 조절합니다.
							progress.resize();
						},
						complete : function() {
							progress.remove();
						}
					}
				);
			}
		});
	};
	$('#refreshButton').click(refreshContents);
});
```
```
<style>
	.refresharea .contentbox {
		border:1px solid black;
		border-radius : 5px;
		padding:1em;
		background-color:#F1EDC2;
		overflow:hidden;
		/* position relative이고 overlay의 appendIn 옵션이 true인 경우
		   overlay의 height와 width값은 100%가 되어, 동적 컨텐츠 변경시
		   자연스럽게 overlay의 크기도 변화가 됩니다. */
		position:relative;
	}
	.refresharea .content {
		overflow:hidden;
	}
</style>
```
</div>

<script type="text/javascript">
	$(document).ready(function(){
		var ingredients = ['Brown rice', 'Cornmeal', 'Bread sticks',
			'Applesauce', 'Tomato', 'Peanut butter', 'Evaporated milk',
			'Olive oil', 'Carrot', 'Yogurt', 'Eggs', 'Minced garlic',
			'Ketchup', 'Mustard', 'Green pepper', 'Chicken breast',
			'Red snapper', 'Salmon', 'Cod'];
		//컨텐츠 생성 이전의 원래 크기
		var fromHeight = $('.refresharea .contentbox').outerHeight();
		if(navigator && /MSIE (\d+\.\d+);/.test(navigator.userAgent)){
		  if(new Number(RegExp.$1) <= 7)
		  	fromHeight = $('.refresharea .contentbox').height();
		}
		//컨텐츠 생성 이전의 padding 크기
		var paddingHeight = fromHeight - $('.refresharea .content').outerHeight();
		$('.refresharea .contentbox').animate({'height' : fromHeight});
		
		var refreshContents = function() {
			//fromHeight = $('.refresharea .contentbox').outerHeight();
			var progress = null;
			
			progress = $('.refresharea .contentbox').progress({
				duration : 200,
				durationOff : 200,
				opacity : 1,
				//overlay를 생성하는 element의 position값이 relative인 경우,
				//appendIn옵션을 true로 하게 되면 overlay의 크기가 자연스럽게 변경됩니다.
				appendIn : true,
				complete : function() {
					var content = '<h5>List of Stock Ingredients</h5>';
					content += '<div><ul class="List">';
					for(var i=0; i< ingredients.length; i++) {
						if( Math.random() > 0.7 ) {
							content += '<li>' + ingredients[i] + '</li>';
						}
					}
					content += '</ul></div>';
					$('.refresharea .content').html(content);
					//Alopex UI Component변환
					$.alopex.convert($('.refresharea .content'));
					
					//컨텐츠 생성 후 실제 높이
					var toHeight = paddingHeight + $('.refresharea .content').outerHeight();
					$('.refresharea .contentbox').animate({'height': toHeight}, 
						{
							step : function() {
								//resize API를 호출하여 overlay와 progress indicator의 위치를 조절합니다.
								progress.resize();
							},
							complete : function() {
								progress.remove();
							}
						}
					);
				}
			});
		};
		
		$('#refreshButton').click(refreshContents);
	});
</script>