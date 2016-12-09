

# DateRange

## Basic

input element를 이용하여 시작날짜과 종료날짜를 선택할 수 있는 DateRange 컴포넌트입니다.  
시작날짜 `class="Startdate Dateinput"` , 종료날짜 `class="Startdate Dateinput"` 를 사용합니다.

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


Startdate NoLimit를 설정하면, 시작날짜는 min date 설정이 적용되지 않습니다.  
하지만, 종료날짜에는 여전히 max date가 설정된 상태가 됩니다.  

<div class="eg">
<div class="egview">   
<div class="Daterange">
    From
    <div class="Startdate NoLimit Dateinput">
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
    <div class="Startdate NoLimit Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div>
```
</div>


Enddate NoLimit를 설정하면, 종료날짜는 max date 설정이 적용되지 않습니다.  
하지만, 시작날짜에는 여전히 min date가 설정된 상태가 됩니다.  

<div class="eg">
<div class="egview">   
<div class="Daterange">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate NoLimit Dateinput">
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
    <div class="Enddate NoLimit Dateinput">
        <input>
    </div>
</div>
```
</div>

Startdate/Enddate input에 모두 NoLimit를 설정하면,  
시작날짜/종료날짜 모두 min/max date 설정이 적용되지 않습니다.    

<div class="eg">
<div class="egview">   
<div class="Daterange">
    From
    <div class="Startdate NoLimit Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate NoLimit Dateinput">
        <input>
    </div>
</div></div>

```
<div class="Daterange">
    From
    <div class="Startdate NoLimit Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate NoLimit Dateinput">
        <input>
    </div>
</div>
```
</div>

## Attributes


### data-pickertype

- "daily" 
	- 일 달력 (default)
	
- "weekly" 
	- 주 달력


<div class="eg">
<div class="egview">  
<div class="Daterange" data-pickertype="weekly">
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
<div class="Daterange"  data-pickertype="weekly">
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

- "monthly" 
	- 월 달력
	
<div class="eg">
<div class="egview">  
<div class="Daterange" data-pickertype="monthly">
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
<div class="Daterange"  data-pickertype="monthly">
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

### data-selectyear 

- "true" 
	- 년도 선택을 위해 셀렉트 박스를 사용합니다.


### data-selectmonth

- "true" 
	- 달 선택을 위해 셀렉트 박스를 사용합니다.

<div class="eg">
<div class="egview"> 
<div class="Daterange" data-selectyear="true" data-selectmonth="true">
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
<div class="Daterange" data-selectyear="true" data-selectmonth="true">
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



### data-enabled

- "true"  
	- DateRange 컴포넌트를 활성화 합니다.
	
<div class="eg">
<div class="egview"> 
<div class="Daterange" data-enabled="false">
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
<div class="Daterange" data-enabled="false">
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

### data-placeholder

- "true"  

<div class="eg">
<div class="egview"> 
<div class="Daterange" data-placeholder="true" data-format="MM/dd/yyyy">
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
<div class="Daterange" data-placeholder="true" data-format="MM/dd/yyyy">
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

## Functions


### .setEnabled(boolean)

DateRange 컴포넌트를 활성화/비활성화할 수 있는 함수입니다.

- parameter
	- "true" Required.
		- daterange 컴포넌트를 활성화합니다.
		
<div class="eg">
<div class="egview"> 
<div class="Daterange" id="daterange1">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div><button id="btn_setEnabledFalse" class="Margin-left-10 Button">setEnabled(false)</button>
<button id="btn_setEnabledTrue" class="Button">setEnabled(true)</button>
</div>
```
<div class="Daterange" id="daterange1">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div>
<button id="btn_setEnabledFalse" class="Margin-left-10 Button">setEnabled(false)</button>
<button id="btn_setEnabledTrue" class="Button">setEnabled(true)</button>

```
```
$('#btn_setEnabledFalse').on('click', function(){
	$('#daterange1').setEnabled(false);
});

$('#btn_setEnabledTrue').on('click', function(){
	$('#daterange1').setEnabled(true);
});
```
</div>
<script>
$('#btn_setEnabledFalse').on('click', function(){
	$('#daterange1').setEnabled(false);
});

$('#btn_setEnabledTrue').on('click', function(){
	$('#daterange1').setEnabled(true);
});
</script>

	

### .update(JSON option)

DateRange 컴포넌트에서 보여지는 DatePicker 컴포넌트의 옵션을 동적으로 설정합니다.<br>
셀렉터로 해당  DateRange 요소의  하위 DateInput을 지정 해줍니다. `$("#daterangeId .Dateinput")`

- parameter
	- option {JSON} Required.
		- 자세한 DatePicker 옵션 사용법은 [showDatePicker](component.html?target=datepicker#Functions_showDatePickercallbackopt) 옵션을 참고하세요. 

<div class="eg">
<div class="egview">
<div id="daterange2" class="Daterange">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div>
<button id="btn_update1" class="Margin-left-10 Button">월별 선택</button>
<button id="btn_update2" class="Button">일별 선택+연도 셀렉트</button>
</div>
```
<div id="daterange2" class="Daterange">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div>
<button id="btn_update1" class="Margin-left-10 Button">월별 선택</button>
<button id="btn_update2" class="Button">일별 선택+연도 셀렉트</button>
```
```
$("#btn_update1").on("click", function (){
	$('#daterange2 .Dateinput').update({pickertype: 'monthly', selectyear: false, selectmonth: false}); // 월별 선택 달력
});
$("#btn_update2").on("click", function (){
	$('#daterange2 .Dateinput').update({pickertype: 'daily', selectyear: true, selectmonth: true}); // 일별 선택 + 연도,월 셀렉트 달력
});
```
</div>
<script>
$("#btn_update1").on("click", function (){
	$('#daterange2 .Dateinput').update({pickertype: 'monthly', selectyear: false, selectmonth: false}); // 월별 선택 달력
});
$("#btn_update2").on("click", function (){
	$('#daterange2 .Dateinput').update({pickertype: 'daily', selectyear: true, selectmonth: true}); // 일별 선택 + 연도,월 셀렉트 달력
});
</script>

### .clear()

DateRange 컴포넌트의 텍스트를 삭제하는 함수입니다.
함수 사용 후 change 이벤트가 발생합니다.

<div class="eg">
<div class="egview"> 
<div class="Daterange" id="daterange3">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div><button id="btn_clear" class="Margin-left-10 Button">clear()</button>
</div>
```
<div class="Daterange" id="daterange3">
    From
    <div class="Startdate Dateinput">
        <input>
    </div>
    ~ To
    <div class="Enddate Dateinput">
        <input>
    </div>
</div>
<button id="btn_clear" class="Margin-left-10 Button">clear()</button>
```
```
$('#btn_clear').on('click', function(){
	$('#daterange3').clear();
});
```
</div>
<script>
$('#btn_clear').on('click', function(){
	$('#daterange3').clear();
});
</script>
	