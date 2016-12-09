

# DatePicker

## Basic

날짜를 선택하고 그에 해당하는 데이터를 얻을 수 있는 달력 컴포넌트입니다.
선택 가능 범위는 1900-01-01부터 2100-12-31이며 연도, 월을 각각 조절할 수 있으며 4가지 Locale(한국어, 영어, 일본어, 중국어)을 지원합니다.

파라미터는 선택한 날짜 데이터를 리턴 받는 콜백 함수와 DatePicker 구성에 필요한 
옵션입니다. 콜백 함수는 필수이며 옵션은 선택입니다.

<div class="eg">
<div class="egview">   
<input id="result1" type="text" class="Textinput">
<input type="button" id="btn_basic" class="Button" value="Show DatePicker">
</div>

```
<input id="result1" type="text" class="Textinput">
<input type="button" id="btn_basic" class="Button" value="Show DatePicker">
```
```
$('#btn_basic').on('click', function (){
	$('#btn_basic').showDatePicker(function(date, dateStr){
		//set selected date to text input
		$("#result1").val(dateStr);
	});
});
```
<script>
$('#btn_basic').on('click', function (){
	$('#btn_basic').showDatePicker(function(date, dateStr){
		//set selected date to text input
		$("#result1").val(dateStr);
	});
});
</script>
</div>

### DateFormat

|  Type | Format | 설명  | 결과  |
| -------- | --- | --- | --- |
| 연도 | yy | 연도 뒤의 2자리  | 12 |
|    | yyyy | 연도 전체 4자리  | 2012 |
| 월  | M | 월 1자리  | 8 |
|   | MM | 월 2자리  | 08 |
|   | MMM | 월 약식 문자열  | Aug 또는 8 |
|   | MMMM | 월 전체 문자열  | August 또는 8 |
| 일  | d | 일 1자리  | 3 |
|   | dd | 일 2자리  | 03 |
| 요일  | EEE | 요일 약식 문자열  | Tue 또는 화  |
|    | EEEE | 요일 전체 문자열  | Tuesday 또는 화  |


### Keyboard Support

Keyboard를 통해서 DatePicker를 사용할 수 있습니다. Key 정보는 아래와 같습니다.
정의되지 않은 Key를 누를 경우 DatePicker가 닫히게 됩니다

 
|  Keyboard | 설명 | 비고 |
| -------- | --- | --- |
| Tab, Shift+Tab | DatePicker 내의 다음, 이전 Element로 이동 | DatePicker Container에서 Shift+Tab 수행 시 close됨 |
| ↑(Up) | 이전 주로 이동 |  이동될 주가 이전 월일 경우 이전 월로 이동됨. |
| ↓(Down)  |  다음 주로 이동 | 이동될 주가 다음 월일 경우 다음 월로 이동됨. |
|  →(Right) | 다음 일로 이동  | 이동될 일이 다음 월일 경우 다음 월로 이동됨.  |
| ←(Left)  |이전 일로 이동|  이동될 일이 이전 월일 경우 이전 월로 이동됨. |
| PageDown  | 다음 월로 이동  |   |
| PageUp  |  이전 월로 이동 |   |
| Shift + PageUp  | 이전 연도로 이동  |   |
| Shift + PageDown  | 다음 연도로 이동  |   |
| Home  | 현재 월의 첫번째 일로 이동  |   |
| End  | 현재 월의 마지막 일로 이동  |   |
| Ctrl + Home  | 초기 날짜로 이동  | 초기 지정한 날짜가 있을 경우 지정된 날짜로 이동.<br>그 외는 오늘 날짜로 이동됨.  |
| Esc  | DatePicker를 Close.  |   |
| Enter, Space  | Focus된 control button 또는  날짜를 선택  | 날짜 선택 시 초기 지정한 callback 함수가 호출됨. 그외의 control button은 해당 기능이 수행 됨.  |


### Related components

DatePicker를 활용할 수 있는 관련 컴포넌트들은 다음과 같습니다.

`class="Dateinput"`을 선언하면 아래와 같은 컴포넌트를 사용할 수 있습니다.

<div class="eg">
<div class="egview"> 
	<div class="Dateinput" data-format="MM/dd/yyyy">
	    <input>
	</div>
</div>

```
<div class="Dateinput" data-format="MM/dd/yyyy">
    <input>
</div>
```
</div>

`class="Daterange"`을 선언하면 아래와 같은 시작일과 종료일을 선택할 수 있는 input을 사용할 수 있습니다.


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
	</div>
</div>
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


## Functions


### .showDatePicker(function callback, JSON option)

DatePicker가 선택한 element 아래에 보여지게 되며 option 값에 따라 다른 형태의 달력으로 동작합니다.

option 항목들은 [$a.setup](../dev-js/javascript.html?target=setup#Functions_asetupcomponentNameoptions) 함수를 사용하여 공통 설정이 가능합니다.

- parameter
	- callback {function} Required.
		- 선택한 날짜 데이터를 return 받는 함수입니다.
	- option {JSON} Optional.
		- DatePicker의 초기 선택 날짜, Locale, Format을 설정합니다. 아래 date, locale, format의 key에 value를 설정합니다.
			- selectyear {Boolean}
				- 년도 선택을 위해 select box를 사용합니다.
			- selectmonth {boolean}
				- 달 선택을 위해 select box를 사용합니다.

<div class="eg">
<div class="egview">   
<input id="result2" type="text" class="Textinput">
<input type="button" id="btn_yearmonth" class="Button" value="년 월 셀렉트">
</div>

```
<input id="result2" type="text" class="Textinput">
<input type="button" id="btn_yearmonth" class="Button" value="년 월 셀렉트">
```
```
$('#btn_yearmonth').on('click', function (){
	$('#btn_yearmonth').showDatePicker(function(date, dateStr){
		$("#result2").val(dateStr);
	}, {selectyear: true, selectmonth: true});
});
```
<script>
$('#btn_yearmonth').on('click', function (){
	$('#btn_yearmonth').showDatePicker(function(date, dateStr){
		$("#result2").val(dateStr);
	}, {selectyear: true, selectmonth: true});
});
</script>
</div>


- parameter
	- option {JSON} Optional.
		- pickertype {String} optional
			- Date Picker의 타입을 지정합니다.
				- daily {string} default
					- 날짜만 선택할 수 있는 달력입니다.
				- monthly {string} 
					- 월만 선택할 수 있는 달력입니다.
						

						
<div class="eg">
<div class="egview"> 
<legend>monthly</legend>
<button id="button1" class="Button">show date picker</button>
<input id="input1" type="text"  class="Textinput"/>
</div>
```
<legend>monthly</legend>
<button id="button1" class="Button">show date picker</button>
<input id="input1" type="text"  class="Textinput"/>
```
```
$('#button1').click(function(){
	$('#button1').showDatePicker(function(date, dateStr){
	    $("#input1").val(dateStr);
	  }, {pickertype:'monthly'});
});
```
						
<script>
$('#button1').click(function(){
	$('#button1').showDatePicker(function(date, dateStr){
	    $("#input1").val(dateStr);
	  }, {pickertype:'monthly'});
});
</script>
</div>


				
						
- parameter
	- option {JSON} Optional.
		- DatePicker의 초기 선택 날짜, Locale, Format을 설정.
			- inline {Boolean} optional
				- datepicker를 팝업 형식이 아닌 인라인으로 사용합니다.
				
<div class="eg">
<div class="egview"> 				
<div id="datepickerArea" class="Display-inblock"></div>
<div class="Display-inblock Valign-top Padding-left-10">
	<label>Result :: <input id="result_inlineDP" type="text" class="Textinput"></label>
</div>
</div>
<script>
var option = {
			    inline : true
			 };
			  
$('#datepickerArea').showDatePicker(onInlineDatePicked, option);

function onInlineDatePicked(date, dateStr){
	$('#result_inlineDP').val(dateStr);
}

</script>
```
<div id="datepickerArea" class="Display-inblock"></div>
<div class="Display-inblock Valign-top Padding-left-10">
	<label>Result :: <input id="result_inlineDP" type="text" class="Textinput"></label>
</div>
```
```
var inlineOption = {
			    inline : true
			 };
			  
$('#datepickerArea').showDatePicker(onInlineDatePicked, inlineOption);

function onInlineDatePicked(date, dateStr){
	$('#result_inlineDP').val(dateStr);
}
```
</div>


- parameter
	- option {JSON} Optional.
		- DatePicker의 초기 선택 날짜, Locale, Format을 설정.
			- locale {String} optional
				- 언어 선택 
				- 'ko', 'en', 'ja', 'zh' 


<div class="eg">
<div class="egview">				
<select id="locale" class="Select">
	<option value="ko">한국어</option>
	<option value="en">English</option>
	<option value="ja">日本語</option>
	<option value="zh">中國語</option>
</select>
<button id="btn_locale" class="Button">Show DatePicker</button>
<label>Result <input id="result_locale" type="text" class="Textinput"></label>
</div>
```
<select id="locale" class="Select">
	<option value="ko">한국어</option>
	<option value="en">English</option>
	<option value="ja">日本語</option>
	<option value="zh">中國語</option>
</select>
<button id="btn_locale" class="Button">Show DatePicker</button>
<label>Result <input id="result_locale" type="text" class="Textinput"></label>
```

<script>
	$('#btn_locale').on('click', function (){
		var localeValue = $('#locale > option:selected').val();
		var option = {
			locale : localeValue
		};
		$('#btn_locale').showDatePicker(onLocaleDatePicked, option);
	});
	function onLocaleDatePicked(date, dateStr){
		$('#result_locale').val(dateStr);
	}
</script>

```
$('#btn_locale').bind('click', function (){
	var localeValue = $('#locale > option:selected').val();
	var option = {
		locale : localeValue
	};
	$('#btn_locale').showDatePicker(onLocaleDatePicked, option);
});
function onLocaleDatePicked(date, dateStr){
	$('#result_locale').val(dateStr);
}
```
</div>

- parameter 
	- option {JSON} Optional.
		- DatePicker의 초기 선택 날짜, Locale, Format을 설정.		
			- format {String} optional
				- yyyy 년도
				- MM 월
				- dd 일
				- EEE 요일

<div class="eg">
<div class="egview">				
	<label>format <input id="inputFormat" placeholder="yyyyMMdd" type="text" class="Textinput"></label>
	<button id="btn_format" class="Button">Show DatePicker</button>
	<label>result <input id="result_format" type="text" class="Textinput"></label>
</div>
<script>
$('#btn_format').on('click', function (){
	var formatValue = $("#inputFormat").val();
	var option = {
		format : formatValue		// default : yyyyMMdd
	};
	$('#btn_format').showDatePicker(onFormatDatePicked, option);
	
	function onFormatDatePicked(date, dateStr){
		$("#result_format").val(dateStr);
	}
});
</script>

```
<label>format <input id="inputFormat" placeholder="yyyyMMdd" type="text" class="Textinput"></label>
<button id="btn_format" class="Button">Show DatePicker</button>
<label>result <input id="result_format" type="text" class="Textinput"></label>
```
```
$('#btn_format').on('click', function (){
	var formatValue = $("#inputFormat").val();
	var option = {
		format : formatValue		// default : yyyyMMdd
	};
	$('#btn_format').showDatePicker(onFormatDatePicked, option);

	function onFormatDatePicked(date, dateStr){
		$("#result_format").val(dateStr);
	}
});

```
</div>

- parameter 
	- option {JSON} Optional.
		- DatePicker의 초기 선택 날짜, Locale, Format을 설정.					
			- date {JSON or Date} Optional.
				- DatePicker의  초기 선택 날짜를 지정합니다.
					- year {string | number} Required
						- 연도
					- month {string | number} Required
						- 월
					- day {string | number} Required
						- 일
<div class="eg">
<div class="egview">
	Initial Date 
	<label><input id="year" type="text" class="Textinput" style="width:50px;">년 </label>
	<label><input id="month" type="text" class="Textinput" style="width:50px;"> 월</label>
	<label><input id="day" type="text" class="Textinput" style="width:50px;"> 일</label>
	<button id="button" class="Button">Show DatePicker</button>
	<label>Result <input id="result" type="text" class="Textinput"></label>
</div>

<script>
  $('#button').bind('click', function (){
		var _year = $("#year").val();
		var _month = $("#month").val();
		var _day = $("#day").val();
		var option = {
			date : {			// (default : today)
				year : _year,
				month : _month,
				day : _day
			}
		};
		$('#button').showDatePicker(onInitialDatePicked, option);
	});


function onInitialDatePicked(date, dateStr){
	$("#result").val(dateStr);
}
</script>

```
Initial Date 
<label><input id="year" type="text" class="Textinput" style="width:50px;">년 </label>
<label><input id="month" type="text" class="Textinput" style="width:50px;"> 월</label>
<label><input id="day" type="text" class="Textinput" style="width:50px;"> 일</label>
<button id="button" class="Button">Show DatePicker</button>
<label>Result <input id="result" type="text" class="Textinput"></label>
```
```
  $('#button').bind('click', function (){
		var _year = $("#year").val();
		var _month = $("#month").val();
		var _day = $("#day").val();
		var option = {
			date : {			// (default : today)
				year : _year,
				month : _month,
				day : _day
			}
		};
		$('#button').showDatePicker(onInitialDatePicked, option);
	});


function onInitialDatePicked(date, dateStr){
	$("#result").val(dateStr);
}
```
</div>

 - parameter 
	- option {JSON} Optional.
		- DatePicker의 초기 선택 날짜, Locale, Format을 설정.							
			- certainDates
				- 특정 날짜를 지정하여 이름 및 스타일을 다르게 지정할 수 있습니다.

				
<div class="eg">
<div class="egview">
<button id="btn_certainDate" class="Button">Show DatePicker</button>
<label>Result <input id="result_certainDate" type="text" class="Textinput"></label>
</div>

<script>
var today = new Date();
var certainYear = today.getFullYear();
var certainMonth = today.getMonth();
var certainDate = today.getDate();
  

$('#btn_certainDate').on('click', function (){
  var option = {
      certainDates : [
        {
          name : 'closedDay',
          styleClass : 'nonBusiness',  // 휴일 (빨간표시)
          title : '정기휴일', //마우스 hover 시 title 툴팁 
          dates : [new Date(2016, 7, 25), // 2015년 11월 25일 
                   new Date(certainYear, certainMonth, certainDate+2), // 내일모래 
	               new Date(certainYear, certainMonth, certainDate-4),  // 4일 전 
	               new Date(certainYear, certainMonth+1, certainDate+2), // 다음달 2일 후 
	               new Date(certainYear, certainMonth+1, certainDate-4), // 다음달 4일 전
	               new Date(certainYear, certainMonth-1, certainDate+2)],// 이전달 2일 후
          isClickToClose : false
        },
        {
          name : 'specialDay',  
          styleClass : 'special', // 특별한날 ( 체크표시)
          title : '특별 휴일', //마우스 hover 시 title 툴팁 
          dates : [new Date('2016/9/3'), // 2015년 9월3일
          		   new Date(certainYear, certainMonth, certainDate+1), // 내일
	               new Date(certainYear, certainMonth, certainDate-7), // 일주일 전
	               new Date(certainYear, certainMonth+1, certainDate+3), // 다음달 3일 후 
	               new Date(certainYear, certainMonth+1, certainDate-1), // 다음달 1일 전
	               new Date(certainYear, certainMonth-1, certainDate+4)], // 이전달 4일전 
          isClickToClose : true
        }
      ]
  	};
	$('#btn_certainDate').showDatePicker(onCertainDatePicked, option);
});


function onCertainDatePicked(date, dateStr, name){		  
  if(name == 'closedDay'){
    alert('It is not available on ' + dateStr + '\nselect another date.');
  }else if(name == 'specialDay'){
    alert('It is a special Day on ' + dateStr);
    $('#result_certainDate').val(dateStr);
  }else{
    $('#result_certainDate').val(dateStr);
  }	
}
</script>

```
<button id="btn_certainDate" class="Button">Show DatePicker</button>
<label>Result <input id="result_certainDate" type="text" class="Textinput"></label>
```
```
var today = new Date();
var certainYear = today.getFullYear();
var certainMonth = today.getMonth();
var certainDate = today.getDate();
  

$('#btn_certainDate').on('click', function (){
   var option = {
      certainDates : [
        {
          name : 'closedDay',
          styleClass : 'nonBusiness',  // 휴일 (빨간표시)
          title : '정기휴일', //마우스 hover 시 title 툴팁 
          dates : [new Date(2016, 7, 25), // 2016년 7월 25일 
                   new Date(certainYear, certainMonth, certainDate+2), // 내일모래 
	               new Date(certainYear, certainMonth, certainDate-4),  // 4일 전 
	               new Date(certainYear, certainMonth+1, certainDate+2), // 다음달 2일 후 
	               new Date(certainYear, certainMonth+1, certainDate-4), // 다음달 4일 전
	               new Date(certainYear, certainMonth-1, certainDate+2)],// 이전달 2일 후
          isClickToClose : false
        },
        {
          name : 'specialDay',  
          styleClass : 'special', // 특별한날 ( 체크표시)
          title : '특별 휴일', //마우스 hover 시 title 툴팁 
          dates : [new Date('2016/9/3'), // 2016년 9월3일
          		   new Date(certainYear, certainMonth, certainDate+1), // 내일
	               new Date(certainYear, certainMonth, certainDate-7), // 일주일 전
	               new Date(certainYear, certainMonth+1, certainDate+3), // 다음달 3일 후 
	               new Date(certainYear, certainMonth+1, certainDate-1), // 다음달 1일 전
	               new Date(certainYear, certainMonth-1, certainDate+4)], // 이전달 4일전 
          isClickToClose : true
        }
      ]
  	};
	$('#btn_certainDate').showDatePicker(onCertainDatePicked, option);
});


function onCertainDatePicked(date, dateStr, name){		  
  if(name == 'closedDay'){
    alert('It is not available on ' + dateStr + '\nselect another date.');
  }else if(name == 'specialDay'){
    alert('It is a special Day on ' + dateStr);
    $('#result_certainDate').val(dateStr);
  }else{
    $('#result_certainDate').val(dateStr);
  }	
}
```
```
<style>
.nonBusiness{
	background: #DC143C !important;
	color: #fff !important;
}
.special{
	background: #ff630e !important;
	color: #fff !important;		
}
</style>
```
</div>	

			
- parameter 
	- option {JSON} Optional.
		- DatePicker의 초기 선택 날짜, Locale, Format을 설정.		
			- mindate {Date}
				- 날짜 최소값
			- maxdate {Date}
				- 날짜 최대값
				
<div class="eg">
<div class="egview"> 
	<div class="Margin-bottom-10">
		MinDate ::
		<label><input id="min_year" type="text" name="minDate" class="Textinput" style="width:50px;"> 년 </label>
		<label><input id="min_month" type="text" name="minDate" class="Textinput" style="width:50px;"> 월 </label>
		<label><input id="min_day" type="text" name="minDate" class="Textinput" style="width:50px;"> 일</label>
	</div>
	<div class="Margin-bottom-10">
		MaxDate ::
		<label><input id="max_year" type="text" name="maxDate" class="Textinput" style="width:50px;"> 년 </label>
		<label><input id="max_month" type="text" name="maxDate" class="Textinput" style="width:50px;"> 월 </label>
		<label><input id="max_day" type="text" name="maxDate" class="Textinput" style="width:50px;"> 일 </label>
	</div>
	<div class="Margin-bottom-10">
		<button id="btn_dateRange" class="Button">Show DatePicker</button>
		<label>Result :: <input id="result3" type="text" class="Textinput"></label>
	</div>
</div>

```
<div class="Margin-bottom-10">
	MinDate ::
	<label><input id="min_year" type="text" name="minDate" class="Textinput" style="width:50px;"> 년 </label>
	<label><input id="min_month" type="text" name="minDate" class="Textinput" style="width:50px;"> 월 </label>
	<label><input id="min_day" type="text" name="minDate" class="Textinput" style="width:50px;"> 일</label>
</div>
<div class="Margin-bottom-10">
	MaxDate ::
	<label><input id="max_year" type="text" name="maxDate" class="Textinput" style="width:50px;"> 년 </label>
	<label><input id="max_month" type="text" name="maxDate" class="Textinput" style="width:50px;"> 월 </label>
	<label><input id="max_day" type="text" name="maxDate" class="Textinput" style="width:50px;"> 일 </label>
</div>
<div class="Margin-bottom-10">
	<button id="btn_dateRange" class="Button">Show DatePicker</button>
	<label>Result :: <input id="result3" type="text" class="Textinput"></label>
</div>
```
```
$('#btn_dateRange').click(function (){
  var minDateStr = $("#min_year").val() + '/' + $("#min_month").val() + '/' + $("#min_day").val();
  var maxDateStr = $("#max_year").val() + '/' + $("#max_month").val() + '/' + $("#max_day").val();
	  
  var option = {
      minDate : new Date(minDateStr),
      maxDate : new Date(maxDateStr)
  };
  
  $('#btn_dateRange').showDatePicker(onMaxMinDatePicked, option);
});

function onMaxMinDatePicked(date, dateStr){
	$('#result3').val(dateStr);
 }
```
<script>
 $('#btn_dateRange').click(function (){
    var minDateStr = $("#min_year").val() + '/' + $("#min_month").val() + '/' + $("#min_day").val();
    var maxDateStr = $("#max_year").val() + '/' + $("#max_month").val() + '/' + $("#max_day").val();
	  
	  var option = {
	      minDate : new Date(minDateStr),
	      maxDate : new Date(maxDateStr)
	  };
	  
	  $('#btn_dateRange').showDatePicker(onMaxMinDatePicked, option);
	});

 function onMaxMinDatePicked(date, dateStr){
	$('#result3').val(dateStr);
 }
</script>
</div>

- parameter 
	- option {JSON} Optional.
		- DatePicker의 초기 선택 날짜, Locale, Format을 설정.
			- showothermonth {Boolean}
				- 현재 달력 빈칸에 이전/이후 달 날짜를 보이게 합니다.
			- showbottom {Boolean}
				- 달력 하단에 오늘 날짜를 선택할 수 있는 버튼 영역을 보여게 합니다.
	
<div class="eg">
<div class="egview"> 
	<div class="Display-inblock Margin-right-10 Valign-top">
		<span>showothermonth: true</span>
		<div id="datepickerArea2"></div>
		<div class="Margin-top-10">
			<label>Result :: <input id="result_inlineDP2" type="text" class="Textinput"></label>
		</div>
	</div>
	<div class="Display-inblock">
	    <span>showothermonth: false, showbottom: true</span>
		<div id="datepickerArea3"></div>
		<div class="Margin-top-10">
			<label>Result :: <input id="result_inlineDP3" type="text" class="Textinput"></label>
		</div>
	</div>
</div>
```
<div class="Display-inblock Margin-right-10 Valign-top">
	<span>showothermonth: true</span>
	<div id="datepickerArea2"></div>
	<div class="Margin-top-10">
		<label>Result :: <input id="result_inlineDP2" type="text" class="Textinput"></label>
	</div>
</div>
<div class="Display-inblock">
    <span>showothermonth: false, showbottom: true</span>
	<div id="datepickerArea3"></div>
	<div class="Margin-top-10">
		<label>Result :: <input id="result_inlineDP3" type="text" class="Textinput"></label>
	</div>
</div>

```
```
$('#datepickerArea2').showDatePicker(function(date, dateStr){
//set selected date to text input
$("#result_inlineDP2").val(dateStr);
}, { inline: true,
  format : 'yyyy-MM-dd',
  showothermonth : true
});

$('#datepickerArea3').showDatePicker(function(date, dateStr){
//set selected date to text input
$("#result_inlineDP3").val(dateStr);
}, { inline: true,
  format : 'yyyy-MM-dd',
  showothermonth : false,
  showbottom : true
});
```
						
<script>
$('#datepickerArea2').showDatePicker(function(date, dateStr){
//set selected date to text input
$("#result_inlineDP2").val(dateStr);
}, { inline: true,
  format : 'yyyy-MM-dd',
  showothermonth : true
});

$('#datepickerArea3').showDatePicker(function(date, dateStr){
//set selected date to text input
$("#result_inlineDP3").val(dateStr);
}, { inline: true,
  format : 'yyyy-MM-dd',
  showothermonth : false,
  showbottom : true
});
</script>
</div>


- parameter 
	- option {JSON} Optional.
		- DatePicker의 position 을 설정.
			- position {String}
				- "left", "right", "top", "bottom", "top | left", "top | right"
				- 기본 position 은 "bottom|left" 입니다. 
				- v2.3.6.14 이후 호환

<div class="eg">
<div class="egview"> 
	<input type="text" id="result_position" class="Textinput">
	<input type="button" id="btn_position" class="Button" value="bottom | left (default)">
	<input type="button" id="btn_position_right" class="Button" value="bottom | right">
	<input type="button" id="btn_position_top_left" class="Button" value="top | left">
	<input type="button" id="btn_position_top_right" class="Button" value="top | right">
</div>
```
	<input type="text" id="result_position" class="Textinput">
	<input type="button" id="btn_position" class="Button" value="bottom | left (default)">
	<input type="button" id="btn_position_right" class="Button" value="bottom | right">
	<input type="button" id="btn_position_top_left" class="Button" value="top | left">
	<input type="button" id="btn_position_top_right" class="Button" value="top | right">
```
```
	$('#btn_position').on('click', function (){
	    $('#btn_position').showDatePicker(function(date, dateStr){
	        $("#result_position").val(dateStr);
	    });
	});
	$('#btn_position_right').on('click', function (){
	    $('#btn_position_right').showDatePicker(function(date, dateStr){
	        $("#result_position").val(dateStr);
	    }, {position : "right"});
	});
	$('#btn_position_top_left').on('click', function (){
	    $('#btn_position_top_left').showDatePicker(function(date, dateStr){
	        $("#result_position").val(dateStr);
	    }, {position : "top"});
	});
	$('#btn_position_top_right').on('click', function (){
	    $('#btn_position_top_right').showDatePicker(function(date, dateStr){
	        $("#result_position").val(dateStr);
	    }, {position : "top|right"});
	});
```
</div>		

<script>
	$('#btn_position').on('click', function (){
	    $('#btn_position').showDatePicker(function(date, dateStr){
	        $("#result_position").val(dateStr);
	    });
	});
	$('#btn_position_right').on('click', function (){
	    $('#btn_position_right').showDatePicker(function(date, dateStr){
	        $("#result_position").val(dateStr);
	    }, {position : "right"});
	});
	$('#btn_position_top_left').on('click', function (){
	    $('#btn_position_top_left').showDatePicker(function(date, dateStr){
	        $("#result_position").val(dateStr);
	    }, {position : "top"});
	});
	$('#btn_position_top_right').on('click', function (){
	    $('#btn_position_top_right').showDatePicker(function(date, dateStr){
	        $("#result_position").val(dateStr);
	    }, {position : "top|right"});
	});
</script>		
				

### .closeDatePicker()

DatePicker 컴포넌트를 동적으로 닫는 함수입니다.

<div class="eg">
<div class="egview">   
	<div>
		<input id="result_show" type="text" class="Textinput">
		<input type="button" id="showdp" class="Button" value="Show DatePicker">
		<input type="button" id="closedp" class="Button" value="Close DatePicker">
	</div>
</div>

```
<div>
	<input id="result_show" type="text" class="Textinput">
	<input type="button" id="showdp" class="Button" value="Show DatePicker">
	<input type="button" id="closedp" class="Button" value="Close DatePicker">
</div>
```
```
$('#showdp').on('click', function (){
	$('#showdp').showDatePicker(function(date, dateStr){
		//set selected date to text input
		$("#result_show").val(dateStr);
	});
});

$('#closedp').on('click', function (){
	$("#result_show").closeDatePicker();
});
```
<script>
$('#showdp').on('click', function (){
	$('#showdp').showDatePicker(function(date, dateStr){
		//set selected date to text input
		$("#result_show").val(dateStr);
	});
});

$('#closedp').on('click', function (){
	$("#result_show").closeDatePicker();
});
</script>
</div>
<style>
	.nonBusiness{
		background: #DC143C !important;
		color: #fff !important;
	}
	.special{
			background: #ff630e !important;
			color: #fff !important;	
	}
</style>