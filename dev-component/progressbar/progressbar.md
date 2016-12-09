
# ProgressBar


## Basic

프로그레스바는 작업의 진행 상태를 시각적으로 표현할 때 사용하는 컴포넌트입니다.

### 기본 Progressbar


<script>
$(document).on('mdload', function(){

});
</script>		

<div class="eg">
	<div class="egview">
		<div class="Progressbar"></div>
	</div>

```
	<div class="Progressbar"></div>
```

</div>

### 텍스트가 있는 ProgressBar
- 프로그래스바 내부에 텍스트가 있는 ProgressBar 입니다.
- 샘플 코드처럼  Progress-text 클래스를 추가하여 사용하셔야 합니다. 
- 진행률(%)이 텍스트로 보여집니다. 
- data-starttext, data-endtext 속성으로 시작 텍스트와 종료 텍스트를 지정할 수 있습니다.   
<div class="eg">
	<div class="egview">
		<div class="Progressbar Progress-text"></div>
	</div>

```
	<div class="Progressbar Progress-text"></div>
```
</div>


## Attributes

### data-default

- "10" | "20" | "30" | ...
	- 프로그래스바의 초기값을 설정합니다.


<div class="eg">
	<div class="egview">
		<div class="Progressbar" data-default="60"></div>
	</div>
	<br>
```
	<div class="Progressbar" data-default="60"></div>
```
</div>

### data-starttext, data-endtext

- {string}
	- 이 속성은 Progress-text 클래스와 함께 사용해야 합니다.
	- 프로그래스바 시작 텍스트와 종료 텍스트를 속성값으로 지정하실 수 있습니다.


<div class="eg">
	<div class="egview">
		<div class="Progressbar Progress-text" data-starttext="start" data-endtext="end"></div>
		<div class="Progressbar Progress-text Margin-top-10" data-starttext="start" data-endtext="end" data-default="100"></div>
	</div>
	<br>
```
	<div class="Progressbar Progress-text" data-starttext="start" data-endtext="end"></div>
	<div class="Progressbar Progress-text Margin-top-10" data-starttext="start" data-endtext="end" data-default="100"></div>
```
</div>


## Functions


### .setValue(value)

프로그래스바의 백분율 값을 세팅해주는 함수입니다.

- parameter
	- value {String|Number} Required
		- 설정된 값에 따라 프로그래스바 상태가 바뀝니다.

### .getValue()

진행된 프로그래스바의 백분율 값을 가져오는 함수입니다.

- return 
	- value {String}
		- 진행된 프로그래스바의 백분율 값
		


<script>
$(document).on('mdload', function(){
	$('#btn_setValue_30').click(function() {
       $('#progressbarId').setValue(30);
     });
     $('#btn_setValue_50').click(function() {
       $('#progressbarId').setValue(50);
     });
     $('#btn_setValue_100').click(function() {
       $('#progressbarId').setValue(100);
     });
	$('#btn_getValue').click(function() {
       alert($('#progressbarId').getValue());
     }); 
});
</script>		

<div class="eg">
	<div class="egview">
		<button id="btn_setValue_30" class="Button">Set Value 30%</button>
		<button id="btn_setValue_50" class="Button Margin-left-10">Set Value 50%</button>
		<button id="btn_setValue_100" class="Button Margin-left-10">Set Value 100%</button>
		<button id="btn_getValue" class="Button Float-right">Get Value</button>
		<div id="progressbarId" class="Progressbar Margin-top-10"></div>
	</div>

```
		<button id="btn_setValue_30" class="Button">Set Value 30%</button>
		<button id="btn_setValue_50" class="Button Margin-left-10">Set Value 50%</button>
		<button id="btn_setValue_100" class="Button Margin-left-10">Set Value 100%</button>
		<button id="btn_getValue" class="Button Float-right">Get Value</button>
		<div id="progressbarId" class="Progressbar Margin-top-10"></div>
```
```
	  <script>
		$('#btn_setValue_30').click(function() {
	       $('#progressbarId').setValue(30);
	     });
	     $('#btn_setValue_50').click(function() {
	       $('#progressbarId').setValue(50);
	     });
	     $('#btn_setValue_100').click(function() {
	       $('#progressbarId').setValue(100);
	     });
		$('#btn_getValue').click(function() {
	       alert($('#progressbarId').getValue());
	     }); 	  	
	  </script>
```
</div>



### .setOptions(options)

프로그래스바의 옵션기능을 사용할 때 세팅하는 값입니다.

- parameter
	- options
		- bgColor {string} Optional
			- 프로그래스바의 색을 지정합니다. ex)'blue'|'red'|'#000000'..
		- bgUrl {string} Optional
			- 프로그래스바에 이미지를 삽입할 때 사용합니다.
		- showText {boolean} Optional
			- 프로그래스바의 내부 텍스트를 표현할 때 사용합니다. ex)true|false 
			- showText값이 true일때 아래의 옵션을 사용합니다.
		- textColor {string} Optional
			- 프로그래스바 텍스트 색을 지정할 때 사용합니다.
		- textArray {array[]} Optional
			- 프로그레스 바 시작 텍스트와 종료 텍스트를 지정할 때 사용합니다. ex) ['start', 'end']





<script>
$(document).on('mdload', function(){
			$('#setBgColor').click(function() {
			
		    $('#progressbarId_setOptions').setOptions( {
				 bgColor : '#' + Math.floor(Math.random() * 1004).toString(16),
			});
			
		});

		$('#setTextColor').click(function() {
			
		   $('#progressbarId_setOptions').setOptions( {
				 textColor : '#' + Math.floor(Math.random() * 1004).toString(16),
			});
			
		});

		$('#setValue0').click(function() {
			
		   $('#progressbarId_setOptions').setValue(0);
			
		});
		
		$('#setValue70').click(function() {
			
		   $('#progressbarId_setOptions').setValue(70);
			
		});
		
		$('#setValue100').click(function() {
			
		   $('#progressbarId_setOptions').setValue(100);
			
		});
		
		$('#setText').click(function() {
			   $('#progressbarId_setOptions').setOptions({
				   showText : true,
				   textArray : ["start", "end"]
			   });
		});
});
</script>		

<div class="eg">
	<div class="egview">
	
	<button id="setBgColor" class="Button">set bgColor </button>
	<button id="setTextColor" class="Button">set textColor </button>
	<button id="setValue0" class="Button">set Value(0) </button>
	<button id="setValue70" class="Button">set Value(70) </button>
	<button id="setValue100" class="Button">set Value(100) </button>
	<button id="setText" class="Button">setOptions (textArray:["start","end"])</button>
	<div id="progressbarId_setOptions" class="Progressbar Progress-text Margin-top-10" data-default="30"></div>
	</div>
</div>

```
	<button id="setBgColor" class="Button">set bgColor </button>
	<button id="setTextColor" class="Button">set textColor </button>
	<button id="setValue0" class="Button">set Value(0) </button>
	<button id="setValue70" class="Button">set Value(70) </button>
	<button id="setValue100" class="Button">set Value(100) </button>
	<button id="setText" class="Button">setOptions (textArray:["start","end"])</button>
	<div id="progressbarId_setOptions" class="Progressbar Progress-text Margin-top-10" data-default="30"></div>

```
```
<script>
		$('#setBgColor').click(function() {
			$('#progressbarId_setOptions').setOptions( {
				 bgColor : '#' + Math.floor(Math.random() * 1004).toString(16),
			});	
		});

		$('#setTextColor').click(function() {	
		   $('#progressbarId_setOptions').setOptions( {
				 textColor : '#' + Math.floor(Math.random() * 1004).toString(16),
			});
		});

		$('#setValue0').click(function() {
		   $('#progressbarId_setOptions').setValue(0);
		});
		
		$('#setValue70').click(function() {
		   $('#progressbarId_setOptions').setValue(70);
		});
		
		$('#setValue100').click(function() {
		   $('#progressbarId_setOptions').setValue(100);
		});
		
		$('#setText').click(function() {
			   $('#progressbarId_setOptions').setOptions({
				   textArray : ["start", "end"]
				});
		});
</script>
```
</div>



## Extra Example

### Status

<script>
$(document).on('mdload', function(){
	 $('#btn0').click(function() {
	         window._progresstest = true;
	         setTimeout(updateProgressbar, 100);
	         $('#btn0').setEnabled(false);
	         $('#btn1').setEnabled(true);
	       });
	       
	       $('#btn1').click(function() {
	         window._progresstest = false;
	         $('#btn0').setEnabled(true);
	         $('#btn1').setEnabled(false);
	       });
	       
	       $('#btn2').click(function() {
	         window._progresstest = false;
	         $('#progId').setValue(0);
	         $('#textId').text($('#progId').getValue() + '%');
	         $('#btn0').setEnabled(true);
	         $('#btn1').setEnabled(false);
	       });
	       
	     function updateProgressbar() {
	     if (!window._progresstest) {
	         return;
	       }
	       var value = $('#progId').getValue();
	       if (value == 100) {
	         return;
	       }
	       $('#progId').setValue(value + 1);
	       $('#textId').text($('#progId').getValue() + '%');
	       if (value < 99) {
	         setTimeout(updateProgressbar, 100);
	       } else {
	         $('#btn1').setEnabled(false);
	       }
	     }   	
});
</script>		

<div class="eg">
	<div class="egview">
		 <button id="btn0" data-type="button">진행</button> 
		 <button id="btn1" data-type="button" data-disabled="true">멈춤</button> 
		 <button id="btn2" data-type="button">초기화</button> 
		 <div id="progId" class="Progressbar Margin-top-10"></div>
		 <span>Status : </span>
		 <span id="textId" style="color:red;">0%</span>
		 <span> completed..</span>
	</div>

```
		 <button id="btn0" data-type="button">진행</button> 
		 <button id="btn1" data-type="button" data-disabled="true">멈춤</button> 
		 <button id="btn2" data-type="button">초기화</button> 
		 <div id="progId" class="Progressbar Margin-top-10"></div>
		 <span>Status : </span>
		 <span id="textId" style="color:red;">0%</span>
		 <span> completed..</span>
```
```
	  <script>
	       $('#btn0').click(function() {
	         window._progresstest = true;
	         setTimeout(updateProgressbar, 100);
	         $('#btn0').setEnabled(false);
	         $('#btn1').setEnabled(true);
	       });
	       
	       $('#btn1').click(function() {
	         window._progresstest = false;
	         $('#btn0').setEnabled(true);
	         $('#btn1').setEnabled(false);
	       });
	       
	       $('#btn2').click(function() {
	         window._progresstest = false;
	         $('#progId').setValue(0);
	         $('#textId').text($('#progId').getValue() + '%');
	         $('#btn0').setEnabled(true);
	         $('#btn1').setEnabled(false);
	       });
	       
	     function updateProgressbar() {
	       if (!window._progresstest) {
	         return;
	       }
	       var value = $('#progId').getValue();
	       if (value == 100) {
	         return;
	       }
	       $('#progId').setValue(value + 1);
	       $('#textId').text($('#progId').getValue() + '%');
	       if (value < 99) {
	         setTimeout(updateProgressbar, 100);
	       } else {
	         $('#btn1').setEnabled(false);
	       }
	     }   	
	  </script>
```
</div>


