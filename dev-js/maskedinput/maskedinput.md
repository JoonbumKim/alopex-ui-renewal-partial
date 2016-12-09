

# MaskedInput


## Basic
 
Alopex UI 에서는 MaskedInput API 관련하여 <span class="Font-bold Text-underline">2가지 구분된 기능</span>을 제공합니다.  

#### 1. MaskedInput Fomatting

##### $a.maskedinput() API 동적 적용
  
> 텍스트 값을 입력 시 특정 format (날짜, 통화, 휴대폰번호, 주민번호 등)의 형태로 쉽게 입력될 수 있도록 해주는 기능을 제공합니다.

<div class="eg">
<div class="egview">
	<label>휴대폰 번호를 입력하세요 : 
	<input class="Textinput" id="mobilephone1"></label> 
</div>

```
	<label>휴대폰 번호를 입력하세요 : 
	<input class="Textinput" id="mobilephone1"></label> 
```
``` 
$a.maskedinput( $("#mobilephone1")[0], "000-0000-0000");
```
<script>
$a.maskedinput( $("#mobilephone1")[0], "000-0000-0000");
</script>
</div>

#### 2. MaskedInput Key Filter

##### data-keyfilter-rule 및 data-keyfilter 속성 적용
  
> 텍스트 값을 입력할 때, 입력된 한 개의 문자를 지정된 형식인 경우에만 입력 허용되도록 해줍니다.    

<div class="eg">
<div class="egview"> 
	<div class="Margin-bottom-10">
		<label>digits + 한글 :
		<input class="Textinput" data-keyfilter-rule="digits|korean" id="keyfilter1">(korean 타입에는 singlespace 포함됨)</label>
	</div>
	<div class="Margin-bottom-10">
		<label>digits + lowercase :
		<input class="Textinput" data-keyfilter-rule="digits|lowercase" id="keyfilter2"></label>
	</div>
	<div>
		<label>english + singlespace :
		<input class="Textinput" data-keyfilter-rule="english|singlespace" id="keyfilter3"></label>
	</div>
</div>

```
	<div class="Margin-bottom-10">
		<label>digits + 한글 :
		<input class="Textinput" data-keyfilter-rule="digits|korean" id="keyfilter1">(korean 타입에는 singlespace 포함됨)</label>
	</div>
	<div class="Margin-bottom-10">
		<label>digits + lowercase :
		<input class="Textinput" data-keyfilter-rule="digits|lowercase" id="keyfilter2"></label>
	</div>
	<div>
		<label>english + singlespace :
		<input class="Textinput" data-keyfilter-rule="english|singlespace" id="keyfilter3"></label>
	</div>
```
</div>





## MaskedInput Fomatting



### $a.maskedinput(element, format, option)

텍스트 값을 입력 시 특정 format (날짜, 통화, 휴대폰번호, 주민번호 등)의 형태로 쉽게 입력될 수 있도록 해주는 기능을 제공합니다.

- parameter
	- element {DOM Element Object}
		- 텍스트 값을 입력할 input 요소
	- format {string}
		- input 요소에 입력되어야할 value의 형태
	- option {object}
		- reverse {boolean} default: false
			- format의 마지막 문자부터 앞으로 masking 수행
			- true일 경우는, 00/00/0000, aa-aaaa 등 <span class="Font-bold Text-underline">하나의 패턴문자만 사용해야 함</span>
		- lengthCheck {boolean} default: false
			- true일 경우는, format 패턴문자의 수와 동적 설정한 값의 문자열 길이가 일치하는 경우에만 formatting 수행(주민번호 등에 사용)
			- false일 경우는, 동적 설정한 값의 길이와 상관 없이 formatting 수행. 단, 동적 설정 값의 문자열 길이가 넘어가는 부분은 잘림(금액 등에 사용)

format은 아래의 패턴문자로 구성해야 합니다.
  
 - "0": digits (0-9)
 - "a": lowercase (a-z)
 - "A": uppercase (A-Z)
 - "b": digits + lowercase (0-9a-z)
 - "B": digits + uppercase (0-9A-Z)
 - "E": english (a-zA-Z)
 - "*": digits + english (0-9a-zA-Z)



<div class="eg">
<div class="egview">

<label>주민 번호(000000-0000000) : <input id="jumin" class="Textinput"></label>
<br><br>

<label>휴대 전화(000-0000-0000) : <input id="mobilephone" class="Textinput"></label>
<br><br>

<label>한국 통화(000,000,000,000원) : <input id="won_money" class="Textinput"></label>
<br><br>

<label>미국 통화(000,000,000.00) : <input id="dollar_money" class="Textinput"></label>
<br><br>

<label>제품 코드(A000-00A) : <input id="productCode" class="Textinput"></label>
<br><br>

<label>날짜 표시(0000/00/00) : <input id="date" class="Textinput"></label>
<br><br>

<label>날짜 시간(0000-00-00 00:00) : <input id="date_time" class="Textinput"></label>
<br><br>

<label>포맷 혼합형 테스트(0aAbBE*) : <input id="complex1" class="Textinput"></label>
<br><br>

</div>

```
<label>주민 번호(000000-0000000) : <input id="jumin" class="Textinput"></label>
<br><br>

<label>휴대 전화(000-0000-0000) : <input id="mobilephone" class="Textinput"></label>
<br><br>

<label>한국 통화(000,000,000,000원) : <input id="won_money" class="Textinput"></label>
<br><br>

<label>미국 통화(000,000,000.00) : <input id="dollar_money" class="Textinput"></label>
<br><br>

<label>제품 코드(A000-00A) : <input id="productCode" class="Textinput"></label>
<br><br>

<label>날짜 표시(0000/00/00) : <input id="date" class="Textinput"></label>
<br><br>

<label>날짜 시간(0000-00-00 00:00) : <input id="date_time" class="Textinput"></label>
<br><br>

<label>포맷 혼합형 테스트(0aAbBE*) : <input id="complex1" class="Textinput"></label>
<br><br>
```
``` 
$a.maskedinput($("#jumin")[0], "000000-0000000");
$a.maskedinput($("#mobilephone")[0], "000-0000-0000");
// 통화에 대해서는 reverse true 옵션을 적용해줍니다.
$a.maskedinput($("#won_money")[0], "000,000,000,000원", { reverse: true });
$a.maskedinput($("#dollar_money")[0], "000,000,000.00", { reverse: true });
$a.maskedinput($("#productCode")[0], "A000-00A");
$a.maskedinput($("#date")[0], "0000/00/00");
$a.maskedinput($("#date_time")[0], "0000-00-00 00:00");
$a.maskedinput($("#complex1")[0], "0aAbBE*");
```
<script>
	$a.maskedinput($("#jumin")[0], "000000-0000000");
	$a.maskedinput($("#mobilephone")[0], "000-0000-0000");
	// 통화에 대해서는 reverse true 옵션을 적용해줍니다.
	$a.maskedinput($("#won_money")[0], "000,000,000,000원", { reverse: true });
	$a.maskedinput($("#dollar_money")[0], "000,000,000.00", { reverse: true });
	$a.maskedinput($("#productCode")[0], "A000-00A");
	$a.maskedinput($("#date")[0], "0000/00/00");
	$a.maskedinput($("#date_time")[0], "0000-00-00 00:00");
	$a.maskedinput($("#complex1")[0], "0aAbBE*");
</script>
</div>


input 엘리먼트에 Databinding 기능을 연계한 예제 입니다.  
 > $a.maskedinput() API가 적용된 input에 setData() API로 데이터를 설정할 경우, formatting이 적용됩니다.  
 > $a.maskedinput() API가 적용된 input에 getData() API로 데이터를 가져올 경우, formatting이 해제된 상태로 가져옵니다.
 
<div class="eg">
<div class="egview">

<label>
"setData" 버튼을 클릭하세요. 또는 우측값을 복사하여 아래의 input에 붙여 넣어 보세요.
<input id="userinput" class="Textinput" value="8408219933555"></label>
<br><br>

<button class="Button" id="set">setData</button>
<button class="Button" id="get">getData</button>

<br><br>
<label>주민 번호 : <input id="jumin_databinding" class="Textinput" data-bind="value: data"></label>
<br><br>
</div>

```
<label>
"setData" 버튼을 클릭하세요. 또는 우측값을 복사하여 아래의 input에 붙여 넣어 보세요.
<input id="userinput" class="Textinput" value="8408219933555"></label>
<br><br>

<button class="Button" id="set">setData</button>
<button class="Button" id="get">getData</button>

<br><br>
<label>주민 번호 : <input id="jumin_databinding" class="Textinput" data-bind="value: data"></label>
<br><br>

```
``` 
	$a.maskedinput($("#jumin_databinding")[0], "000000-0000000");
	
	$("#set").click(function(){
		var userinput = $("#userinput").val();
		$("#jumin_databinding").setData({data: userinput});
	});
	
	$("#get").click(function(){
		var userinput = $("#userinput").val();
		alert( JSON.stringify( $("#jumin_databinding").getData() ) );
	});
```
<script>
	$a.maskedinput($("#jumin_databinding")[0], "000000-0000000");
	$("#set").click(function(){
		var userinput = $("#userinput").val();
		$("#jumin_databinding").setData({data: userinput});
	});
	$("#get").click(function(){
		var userinput = $("#userinput").val();
		alert( JSON.stringify( $("#jumin_databinding").getData() ) );
	});
</script>
</div>



이미 값을 가지는 input 엘리먼트에 대해서, $a.maskedinput() API를 사용하여 formatting을 적용할 수도 있습니다.
 
<div class="eg">
<div class="egview">

<label><input id="userinput2" class="Textinput" value="123400000"></label>
<button class="Button" id="formatting">formatting 적용</button>

</div>

```
<label><input id="userinput2" class="Textinput" value="123400000"></label>
<button class="Button" id="formatting">formatting 적용</button>

```
``` 
$("#formatting").click(function(){
	// 이미 값이 입력된 경우, 최초 formatting 수행
	$a.maskedinput($("#userinput2")[0], "000,000,000,000,000,000원", { reverse: true });
});
```
<script>
	$("#formatting").click(function(){
		// 이미 값이 입력된 경우, 최초 formatting 수행
		$a.maskedinput($("#userinput2")[0], "000,000,000,000,000,000원", { reverse: true });
	});
</script>
</div>

## MaskedInput Key Filter

### data-keyfilter-rule

텍스트 값을 입력할 때, 입력된 <span class="Font-bold Text-underline">한 개의 키입력</span>을 지정된 형식인 경우에만 입력 허용되도록 해줍니다.  
때문에, 전체 문자열에 대해서 keyfilter-rule을 적용하지 않습니다.  
예를들어, decimal의 경우 한개의 키입력이 십진수인지 소수점인지 검증 하지만, 전체 문자열에 소수점이 여러개 있는지 검증하지 않습니다. 
   
빌트인으로 제공되는 타입은 아래와 같습니다. pipe (|) 키를 이용하여 여러 빌트인 타입을 지정할 수 있습니다.  
(예시: data-keyfilter-rule="digits|lowercase")  

- digits: 숫자만 입력 허용

<div class="eg">
<div class="egview">
	<label>digits
	<input class="Textinput" data-keyfilter-rule="digits" id="keyfilter_digits"></label>
</div>

```
<label>digits
<input class="Textinput" data-keyfilter-rule="digits" id="keyfilter_digits"></label>
```
</div>

- decimal: 십진수 입력 허용(<span class="Font-bold Text-underline">한 개의 키입력</span>를 판단하기 때문에 . 등이 복수개 입력되는 등 전체 문자열을 검증하지 않음)

<div class="eg">
<div class="egview">
	<label>decimal
	<input class="Textinput" data-keyfilter-rule="decimal" id="keyfilter_decimal"></label>
</div>

```
<label>decimal
<input class="Textinput" data-keyfilter-rule="decimal" id="keyfilter_decimal"></label>
```
</div>

- lowercase: 소문자만 입력 허용

<div class="eg">
<div class="egview">
	<label>lowercase
	<input class="Textinput" data-keyfilter-rule="lowercase" id="keyfilter_lowercase"></label>
</div>

```
<label>lowercase
<input class="Textinput" data-keyfilter-rule="lowercase" id="keyfilter_lowercase"></label>
```
</div>

- uppercase: 대문자만 입력 허용

<div class="eg">
<div class="egview">
	<label>uppercase
	<input class="Textinput" data-keyfilter-rule="uppercase" id="keyfilter_uppercase"></label>
</div>

```
<label>uppercase
<input class="Textinput" data-keyfilter-rule="uppercase" id="keyfilter_uppercase"></label>
```
</div>

- english: 영어만 입력 허용

<div class="eg">
<div class="egview">
	<label>english
	<input class="Textinput" data-keyfilter-rule="english" id="keyfilter_english"></label>
</div>

```
<label>english
<input class="Textinput" data-keyfilter-rule="english" id="keyfilter_english"></label>
```
</div>

- korean: 한글만 입력 허용

<div class="eg">
<div class="egview">
	<label>korean
	<input class="Textinput" data-keyfilter-rule="korean" id="keyfilter_korean"></label>
	korean 타입에는 singlespace 포함됨.
</div>

```
<label>korean
<input class="Textinput" data-keyfilter-rule="korean" id="keyfilter_korean"></label>
```
</div>

- singlespace: 빈칸 입력 허용

<div class="eg">
<div class="egview">
	<label>singlespace
	<input class="Textinput" data-keyfilter-rule="singlespace" id="keyfilter_singlespace"></label>
</div>
```
<label>singlespace
<input class="Textinput" data-keyfilter-rule="singlespace" id="keyfilter_singlespace"></label>
```



</div>

	
### data-keyfilter

빌트인으로 제공되는 타입 이외에, regular expression 방식대로 Custom Rule을 지정할 수 있습니다.    
해당 Custom Rule은 keyup 이벤트 시점에 유효성 확인이 되기 때문에 글자가 타입이 된 이후 지워지게 보여집니다.  
 
- a-zA-Z : 영어만 입력 허용
- 0-9 : 숫자만 입력 허용
- 특정 문자만 입력 허용 (예시: data-keyfilter="!@#")

<div class="eg">
<div class="egview">
a-zA-Z : <input class="Textinput" data-keyfilter="a-zA-Z" id="keyfilter_custom1"> <br><br>
0-9 : <input class="Textinput" data-keyfilter="0-9" id="keyfilter_custom2"> <br><br>
<!-- '!','@','#' 만 입력가능 -->
!@# : <input class="Textinput" data-keyfilter="!@#" id="keyfilter_custom3"> 
</div>

```
a-zA-Z : <input class="Textinput" data-keyfilter="a-zA-Z" id="keyfilter_custom1">
0-9 : <input class="Textinput" data-keyfilter="0-9" id="keyfilter_custom2">
<!-- '!','@','#' 만 입력가능 -->
!@# : <input class="Textinput" data-keyfilter="!@#" id="keyfilter_custom3">
```
</div>


data-keyfilter-rule 속성과 data-keyfilter 속성을 함께 사용할 수 있습니다.

<div class="eg">
<div class="egview">
<!-- 소문자와 '!','@','#' 만 입력가능 -->
<input class="Textinput" data-keyfilter-rule="lowercase" data-keyfilter="!@#" id="keyfilter_custom4"> 
</div>

```
<!-- 소문자와 '!','@','#' 만 입력가능 -->
<input class="Textinput" data-keyfilter-rule="lowercase" data-keyfilter="!@#" id="keyfilter_custom4">
```
</div>


### $a.keyfilter.addKeyUpRegexpRule(name, regexp)

$a.keyfilter.addKeyUpRegexpRule API를 통하여 새로운 룰을 지정할 수 있습니다.  
API를 이용하여 keyup 이벤트 시점에 적절한 룰을 설정할 수 있습니다.  
입력된 전체 값에 대한 유효성 검증은 Javascript APIs의 Validator 기능 중 [Validation Methods](/2.3/dev-js/javascript.html?target=validator#Basic_ValidationMethods)를 참고 하시면 구현 가능합니다.

- parameter
	- name
		- 새로운 룰의 이름
	- regexp | string
		- regexp : keyup 시점에 적용되는 정규표현식. 설정한 RegExp type의 객체를 이용해 입력 값을 체크 합니다.
		- string : keyup 시점에 적용되는 정규표현식. new RegExp('[' + string + ']', 'g')를 통해 RegExp 객체를 내부적으로 생성한 후, 생성한 RegExp type의 객체를 이용해 입력 값을 체크 합니다.

<div class="eg">
<div class="egview">
	<div>
		<h5>string type parameter 예시</h5>
		<label>Email 입력 :
			<input class="Textinput" data-keyfilter-rule="email" id="email">
		</label>
		<p>@ 입력 가능하지만, 복수개 입력할 수 있음. data-keyfilter-rule 속성은 하나의 키입력만 검증하기 때문.</p>
		<p>new RegExp('[' + string + ']', 'g') 정규식으로 검증</p>
		</div>
		<br />
		<div>
		<h5>regexp type parameter 예시</h5>
		<label>사용자 decimal 정규식 :
			<input class="Textinput" data-keyfilter-rule="userDecimal2" id="user2">
			<p>사용자가 키 입력 시마다 정규식과 match 수행</p>
			<p>가능 예시 : -0.1 / -1 / 12345 / 12345.12 / .12 / 0.12 / 123456789012</p>
			<p>불가 예시 : 0.123(소수점 뒤 3자리 불가) / 1234567890123(총13자리 불가)</p>
			<p>소수점 앞 10자리까지 가능, -(음수) 가능, 소수점 뒷 2자리까지 가능, 총 소수점 앞+뒤 총 12자리 가능</p>
		</label>
	</div>
</div>

```
	<div>
		<h5>string type parameter 예시</h5>
		<label>Email 입력 :
			<input class="Textinput" data-keyfilter-rule="email" id="email">
		</label>
		<p>@ 입력 가능하지만, 복수개 입력할 수 있음. data-keyfilter-rule 속성은 하나의 키입력만 검증하기 때문.</p>
		<p>new RegExp('[' + string + ']', 'g') 정규식으로 검증</p>
		</div>
		<br />
		<div>
		<h5>regexp type parameter 예시</h5>
		<label>사용자 decimal 정규식 :
			<input class="Textinput" data-keyfilter-rule="userDecimal2" id="user2">
			<p>사용자가 키 입력 시마다 정규식과 match 수행</p>
			<p>가능 예시 : -0.1 / -1 / 12345 / 12345.12 / .12 / 0.12 / 123456789012</p>
			<p>불가 예시 : 0.123(소수점 뒤 3자리 불가) / 1234567890123(총13자리 불가)</p>
			<p>소수점 앞 10자리까지 가능, -(음수) 가능, 소수점 뒷 2자리까지 가능, 총 소수점 앞+뒤 총 12자리 가능</p>
		</label>
	</div>
```
``` 
// string type parameter 예시
// new RegExp('[' + 'a-zA-Z0-9@._-' + ']', 'g') 객체를 이용해 체크
$a.keyfilter.addKeyUpRegexpRule("email", "a-zA-Z0-9@._-");

// regexp type parameter 예시 
// /^-?\d+\.?(\d{1,2})?$/ 자체를 이용해 체크
$a.keyfilter.addKeyUpRegexpRule('userDecimal2', /^-?\d{0,10}\.?\d{0,2}$/); 
```
<script>
// string type parameter 예시
// new RegExp('[' + 'a-zA-Z0-9@._-' + ']', 'g') 객체를 이용해 체크
$a.keyfilter.addKeyUpRegexpRule("email", "a-zA-Z0-9@._-");

// regexp type parameter 예시 
// /^-?\d+\.?(\d{1,2})?$/ 자체를 이용해 체크
$a.keyfilter.addKeyUpRegexpRule('userDecimal2', /^-?\d{0,10}\.?\d{0,2}$/); 
</script>
</div>
