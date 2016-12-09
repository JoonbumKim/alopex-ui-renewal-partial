
# DateInput

## Basic

input element를 이용해서 달력 컴포넌트를 사용할 때 dateinput 컴포넌트를 사용합니다.<br>
input을 click 하면 달력 컴포넌트가 활성화 됩니다.<br><br>
`class="Dateinput"`<br>

<div class="eg">
<div class="egview">
<div class="Dateinput">
    <input id="dateinput01">
</div></div>
```
<div class="Dateinput">
    <input id="dateinput01">
</div>
```
</div>


<br>
내부에 위치한 Div 테그에 다음과 같이 mark-up을 추가 할 경우에는,<br>
Calendar icon image를 click 할 때 달력 컴포넌트가 활성화 됩니다.<br><br>
`class="Calendar"`<br>

<div class="eg">
<div class="egview">
<div class="Dateinput">
    <input id="dateinput02">
    <div class="Calendar" id="dateinput03"></div>
</div></div>
```
<div class="Dateinput">
    <input id="dateinput02">
    <div class="Calendar" id="dateinput03"></div>
</div>
```
</div>




## Attributes



### data-format

- 'dateformat'
	- 설정한 포맷 형태로 텍스트가 입력됩니다.

<div class="eg">
<div class="egview">
<div class="Dateinput" data-format="MM/dd/yyyy">
    <input id="dateinput04">
</div></div>

```
<div class="Dateinput" data-format="MM/dd/yyyy">
    <input id="dateinput04">
</div>
```
</div>

### data-resetbutton

- "true" 
	- input element에 삭제 버튼을 생성합니다.
	
<div class="eg">
<div class="egview">
<div class="Dateinput" data-resetbutton="true">
    <input id="dateinput05">
    <div class="Clear" id="dateinputDiv05">x</div>
</div></div>

```
<div class="Dateinput" data-resetbutton="true">
    <input id="dateinput05">
    <div class="Clear" id="dateinputDiv05">x</div>
</div>
```
</div>




### data-pickertype

- "daily" 
	- '일'단위로 선택할 수 있는 달력 입니다.
- "monthly" 
	- '월'단위로 선택할 수 있는 달력 입니다.	

<div class="eg">
<div class="egview">
	<div class="Dateinput" data-pickertype="daily">
	   daily: <input id="dateinput06">
	</div>
	<div class="Dateinput" data-pickertype="monthly">
	    monthly: <input id="dateinput07">
	</div>
</div>
```
	<div class="Dateinput" data-pickertype="daily">
	   daily: <input id="dateinput06">
	</div>
	<div class="Dateinput" data-pickertype="monthly">
	    monthly: <input id="dateinput07">
	</div>
```
</div>

### data-pickerposition 

- "left", "right", "top", "bottom", "top | left", "top | right"
	- DatePicker 의 position을 설정할 때 사용합니다.  
	- v2.3.6.14 이후 호환
	
<div class="eg">
<div class="egview">
	<div class="Dateinput" id="dateinputDiv08">
	   bottom | left (default) : <input id="dateinput08">
	</div>
	<div class="Dateinput" data-pickerposition="right">
	   bottom | right : <input id="dateinput09">
	</div>
	<br/><br/>
	<div class="Dateinput" data-pickerposition="top | left">
	    top | left : <input id="dateinput10">
	</div>
	<div class="Dateinput" data-pickerposition="top | right">
	    top | right : <input id="dateinput11">
	</div>
</div>
```
	<div class="Dateinput" id="dateinputDiv08">
	   bottom | left (default) : <input id="dateinput08">
	</div>
	<div class="Dateinput" data-pickerposition="right">
	   bottom | right : <input id="dateinput09">
	</div>
	<br/><br/>
	<div class="Dateinput" data-pickerposition="top | left">
	    top | left : <input id="dateinput10">
	</div>
	<div class="Dateinput" data-pickerposition="top | right">
	    top | right : <input id="dateinput11">
	</div>
```
</div>

### data-selectyear

- "true" 
	- 년도 선택을 위해 셀렉트 박스를 사용합니다.

### data-selectmonth

- "true" 
	- 달 선택을 위해 셀렉트 박스를 사용합니다.

<div class="eg">
<div class="egview">
<h5>Select Element for Year / Month</h5>
<div class="Dateinput" data-selectyear="true" data-selectmonth="true">
    <input id="dateinput12">
</div></div>
```
<div class="Dateinput" data-selectyear="true" data-selectmonth="true">
    <input id="dateinput12">
</div>
```
</div>

### data-disabled

- "true"  
	- dateinput 컴포넌트를 비활성화합니다.
	
<div class="eg">
<div class="egview">
<div class="Dateinput" data-disabled="true">
    <input id="dateinput13">
</div></div>
	
```
<div class="Dateinput" data-disabled="true">
    <input id="dateinput13">
</div>
	
```
</div>

### data-placeholder
IE 에서는 10 버젼 이후부터 사용 가능합니다.

- "true"  
	- dateinput 컴포넌트의 날짜 형식을 placeholder로 보여줍니다.
	
<div class="eg">
<div class="egview">
<div class="Dateinput" data-placeholder="true" data-format="MM/dd/yyyy">
    <input id="dateinput14">
</div></div>
```
<div class="Dateinput" data-placeholder="true" data-format="MM/dd/yyyy">
    <input id="dateinput14">
</div>
```
</div>

### data-inputwidth 

- "auto"  
	- data-format 의 길이에 맞게 input의 너비가 설정됩니다. 
- {number}  
	- input의 너비를 지정할 때 사용합니다. 
	
<div class="eg">
<div class="egview">
<div class="Dateinput" data-inputwidth="200">
    <input id="dateinput15">
</div></div>
	
```
<div class="Dateinput" data-inputwidth="200">
    <input id="dateinput15">
</div>
	
```
</div>



### data-default-date

- 'data-default-date'
	- input가 null일때 focusout시점에 default값의 사용 여부를 설정 할 수 있습니다.

<div class="eg">
<div class="egview">
<div class="Dateinput" data-default-date="false">
    <input id="dateinput16">
</div></div>

```
<div class="Dateinput" data-default-date="false">
    <input id="dateinput16">
</div>
```
</div>


## Functions


### .setEnabled

dateinput 컴포넌트를 활성화/비활성화할 수 있는 함수입니다.

- parameter
	- "true" Required.
		- dateinput 컴포넌트를 활성화 합니다.
		
<div class="eg">
<div class="egview">
<div id="date1" class="Dateinput">
    <input id="dateinput17">
</div> <button id="btn_setEnabledFalse" class="Button" >setEnabled(false)</button>
<button id="btn_setEnabledTrue" class="Button" >setEnabled(true)</button>
</div>
```
<div id="date1" class="Dateinput">
    <input id="dateinput17">
</div>
<button id="btn_setEnabledFalse" class="Button" >setEnabled(false)</button>
<button id="btn_setEnabledTrue" class="Button" >setEnabled(true)</button>
```
```
$("#btn_setEnabledFalse").on("click", function (){
	$('#date1').setEnabled(false);
});
$("#btn_setEnabledTrue").on("click", function (){
	$('#date1').setEnabled(true);
});
```
</div>

<script>
$("#btn_setEnabledFalse").on("click", function (){
	$('#date1').setEnabled(false);
});
$("#btn_setEnabledTrue").on("click", function (){
	$('#date1').setEnabled(true);
});
</script>	

### .update(JSON option)

dateinput 컴포넌트에서 보여지는 datepicker 컴포넌트의 옵션을 동적으로 설정합니다.

- parameter
	- option {JSON} Required.
		- 자세한 datepicker 옵션 사용법은 [showDatePicker](component.html?target=datepicker#Functions_showDatePickercallbackopt) 옵션을 참고하세요. 

<div class="eg">
<div class="egview">
<div id="date3" class="Dateinput">
    <input id="dateinput18">
</div> <button id="btn_update1" class="Button" >월별 선택</button>
<button id="btn_update2" class="Button" >일별 선택+연도 셀렉트</button>
<button id="btn_update3" class="Button" >Position 설정</button>
</div>
```
<div id="date3" class="Dateinput">
    <input id="dateinput18">
</div>
<button id="btn_update1" class="Button">월별 선택</button>
<button id="btn_update2" class="Button">일별 선택+연도 셀렉트</button>
<button id="btn_update3" class="Button" >Position 설정</button>
```
```
$("#btn_update1").on("click", function (){
	$('#date3').update({pickertype: 'monthly', selectyear: false, selectmonth: false}); // 월별 선택 달력
});
$("#btn_update2").on("click", function (){
	$('#date3').update({pickertype: 'daily', selectyear: true, selectmonth: true}); // 일별 선택 + 연도,월 셀렉트 달력
});
$("#btn_update3").on("click", function (){
	$('#date3').update({position: 'top | right'}); // position 위치 설정 
});
```
</div>	

<script>
$("#btn_update1").on("click", function (){
	$('#date3').update({pickertype: 'monthly', selectyear: false, selectmonth: false}); // 월별 선택 달력
});
$("#btn_update2").on("click", function (){
	$('#date3').update({pickertype: 'daily', selectyear: true, selectmonth: true}); // 일별 선택 + 연도,월 셀렉트 달력
});
$("#btn_update3").on("click", function (){
	$('#date3').update({position: 'top | right'}); // position 위치 설정 
});
</script>

### .clear()

dateinput 컴포넌트의 텍스트를 삭제하는 함수입니다.
함수 사용 후 change 이벤트가 발생합니다.

<div class="eg">
<div class="egview">
<div id="date2" class="Dateinput">
    <input id="dateinput19">
</div> <button id="btn_clear" class="Button" >clear()</button>
</div>
```
<div id="date2" class="Dateinput">
    <input id="dateinput19">
</div>
<button id="btn_clear" class="Button">clear()</button>
```
```
$("#btn_clear").on("click", function (){
	$('#date2').clear();
});
```
</div>	

<script>
$("#btn_clear").on("click", function (){
	$('#date2').clear();
});
</script>


### Daterange

2개의 dateinput 컴포넌트를 이용하여 from ~ to 기간 설정 구현에 특화된 확장 컴포넌트 입니다.  
자세한 사용법은 [Daterange](component.html?target=daterange) 가이드를 참고하세요. 

<div class="eg">
<div class="egview">   
<div class="Daterange">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div></div>

```
<div class="Daterange">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div>
```
</div>


## WeekDay Example

### Weekday Basic 
data-format에 요일(EEE 혹은 EEEE)을 포함하여 사용하면 됩니다. 
data-format에 대한 자세한 내용은 [DateFormat](component.html?target=datepicker#Basic_DateFormat)을 참고하세요.

<div class="eg">
<div class="egview">   
	<div class="Dateinput" data-format="yyyy/MM/dd EEE요일" data-inputwidth="auto" data-resetbutton="true">
	    <input>
	    <div class="Clear">x</div>
	    <div class="Calendar"></div>
	</div>
</div>

```
<div class="Daterange">
    <div class="Dateinput" data-format="yyyy/MM/dd EEE요일" data-inputwidth="auto" data-resetbutton="true">
	    <input>
	    <div class="Clear">x</div>
	    <div class="Calendar"></div>
	</div>
</div>
```
</div>

<div class="eg">
<div class="egview">   
	<div class="Dateinput" id="date_en" data-format="EEEE MM/dd/yyyy" data-inputwidth="auto">
	    <input>
	    <div class="Calendar"></div>
	</div>
</div>

```
	<div class="Dateinput" id="date_en" data-format="EEEE MM/dd/yyyy" data-inputwidth="auto">
	    <input>
	    <div class="Calendar"></div>
	</div>
```
```
$("#date_en").update({locale:'en'});
```
</div>	

<script>
$(document).on('mdload', function(){
	$("#date_en").update({locale:'en'});
});
</script>
 

