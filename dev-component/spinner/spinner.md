
# Spinner

## Basic

Spinner는 버튼으로 숫자를 증감 시킬 수 있는 컴포넌트입니다.
<div class="eg">
<div class="egview">
	<div class="Spinner">
	    <input value="0">
	    <a class="Up"></a>
	    <a class="Down"></a>
	</div>
</div>

```
<div class="Spinner">
    <input value="0">
    <a class="Up"></a>
    <a class="Down"></a>
</div>
```
</div>


<div class="eg">
<div class="egview">
	<div class="Spinner" data-min="1" data-max="200" data-step="2">
   		<input value="0">
    	<a class="Up"></a>
    	<a class="Down"></a>
	</div>
</div>

```
<div class="Spinner" data-min="1" data-max="200" data-step="2">
    <input value="0">
    <a class="Up"></a>
    <a class="Down"></a>
</div>
```
</div>


   		
### Keyboard Support

키보드를 통해서 Spinner를 제어할 수 있습니다. Key 정보는 아래와 같습니다.

 
|  Keyboard | 설명 | 비고 |
| -------- | --- | --- |
| ↑(Up) | step 만큼 숫자 증가 |  value가 있을 경우에 |
| ↓(Down)  |  step 만큼 숫자 감소 | value가 있을 경우에  |


## Time Spinnner

시간을 입력할 수 있는 Spinner 입니다. 

Spinner 하위의 엘리먼트의 역할을 속성으로 명시해주어야 정상적으로 작동합니다. 

### data-hour

- 시간을 나타내는 input 태그에 명시  

### data-minute

- 분을 나타내는 input 태그에 명시 

### data-ampm (Optional)

- 시간대(AM,PM)을 나타내는 input 태그에 명시 
 
### data-seperator 

- 시간과 분 사이의 구분자를 넣어줄 span 태그에 명시

### data-locale (Optional)

시간대를 표현하는 텍스트의 언어를 설정합니다.

- "en"   
	- "am" | "pm"
- "ko"
	- "오전" | "오후"

### data-hours (Optional)

시간 표기 방식을 설정합니다. 

- "12H" 
	- default
- "24H" 
 

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;">data-locale="en" data-hours="12H"</span><br/><br/>
	<div class="Spinner Time" data-locale="en" id="time1" data-bind="time: date">
    	<input data-hour>
    	<span data-seperator>:</span>
    	<input data-minute>
    	<input data-ampm>
    	<a class="Up"></a>
	   	<a class="Down"></a>
	</div><br/>
	<div class="Button" id="setDataBtn">setData({data:new Date()})</div>
	<div class="Button" id="getDataBtn">getData()</div>
	
	<br/><br/><br/>
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;">data-locale="ko" data-hours="24H"</span><br/><br/>
	<div class="Spinner Time" data-locale="ko" data-hours="24H" id="time2" data-bind="time: date">
    	<input data-ampm>
    	<input data-hour>
    	<span data-seperator>:</span>
    	<input data-minute>
    	<a class="Up"></a>
	   	<a class="Down"></a>
	</div><br/>
	<div class="Button" id="setDataBtn2">setData({data:"10:20 PM"})</div>
	<div class="Button" id="getDataBtn2">getData()</div>
</div>
```
	<div class="Spinner Time" data-locale="en" id="time1" data-bind="time: date">
    	<input data-hour>
    	<span data-seperator>:</span>
    	<input data-minute>
    	<input data-ampm>
    	<a class="Up"></a>
	   	<a class="Down"></a>
	</div>
	<div class="Button" id="setDataBtn">setData({data:new Date()})</div>
	<div class="Button" id="getDataBtn">getData</div>
	
	<div class="Spinner Time" data-locale="ko" data-hours="24H" id="time2" data-bind="time: date">
    	<input data-ampm>
    	<input data-hour>
    	<span data-seperator>:</span>
    	<input data-minute>
    	<a class="Up"></a>
	   	<a class="Down"></a>
	</div>
	<div class="Button" id="setDataBtn2">setData({data:"10:20 PM"})</div>
	<div class="Button" id="getDataBtn2">getData()</div>
```
```
	$(setDataBtn).on('click', function(){
		$(time1).setData({date : new Date});
	});
	$(getDataBtn).on('click', function(){
		alert("getData : " + JSON.stringify($(time1).getData()));
	});
	
	$(setDataBtn2).on('click', function(){
		$(time2).setData({date : "10:20 PM"});
	});
	$(getDataBtn2).on('click', function(){
		alert("getData : " + JSON.stringify($(time2).getData()));
	});
```
</div>	

<script>
$(document).on('mdload', function(){
	$(setDataBtn).on('click', function(){
		$(time1).setData({date : new Date});
	});
	$(getDataBtn).on('click', function(){
		alert("getData : " + JSON.stringify($(time1).getData()));
	});
	$(setDataBtn2).on('click', function(){
		$(time2).setData({date : "10:20 PM"});
	});
	$(getDataBtn2).on('click', function(){
		alert("getData : " + JSON.stringify($(time2).getData()));
	});
});
</script>


 
## Attributes

### class

- "Spinner"  
	- Alopex UI spinner 컴포넌트를 사용한다고 명시하는 속성입니다.

### data-min

-  value의 최소값을 지정합니다.


### data-max

-  value의 최대값을 지정합니다.


### data-step

-  value가 증가/감소하는 양을 지정합니다. (default: 1)




## Functions


### setEnabled (isEnabled)

Spinner의 활성화/비활성화를 동적으로 조정할 때 사용하는 API입니다.

- parameter
	- isEnabled {Boolean} Required  
		- 설정된 Boolean 값에 의해서 spinner가 활성화/비활성화 됩니다.


	
