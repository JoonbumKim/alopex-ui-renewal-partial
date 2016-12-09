# AutoComplete

## Basic
- AutoComplete 컴포넌트는 입력 값에 따른 자동 완성 기능을 제공합니다.
- AutoComplete 컴포넌트에서는 Textinput 컴포넌트와 Dropdown 컴포넌트를 자동 생성하여 사용합니다.
	- 자동 완성의 데이터를 가져오기 위한 두 가지 방식을 제공합니다.
	- data-url 혹은 data-source 값을 설정하셔야만 자동 완성 기능이 작동합니다.

### data-url 방식
- 특정 url에 Textinput의 값을 쿼리로 보내어 자동 완성 데이터를 가져오는 방식입니다.
- 실제 자동 완성 추출 데이터는 서버에서 직접 구현이 되어야 합니다. 아래의 url 은 예제를 위한 임의의 샘플입니다.
- data-url 속성 값을 정의하거나, .setOptions 의 url 옵션 값을 설정합니다.
<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "m"을 입력해보세요 </span><br/><br/>
	<div class="Autocomplete" data-url="/words" data-paramname="keyword" id="divTest01"></div>
</div>

```
<div class="Autocomplete" data-url="/words" data-paramname="keyword" id="divTest01"></div>
```
</div>

### data-source 방식
-  정해진 JSON 데이터 안에서 Textinput 값을 통해 자동 완성 데이터를 완성하는 방식입니다.
-  data-source 속성 값을 정의하거나, .setOptions 의 source 옵션 값을 설정합니다.
<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "i" 을 입력해보세요 </span><br/><br/>
	<div class="Autocomplete" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest02"></div>
</div>

```
<div class="Autocomplete" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest02"></div>
```
</div>


## Attributes


### data-url(Optional)
- {string}
	- Textinput 값이 바뀔 때 마다 특정 URL에서 해당 텍스트 값을 쿼리로 날려 데이터를 가져올 때 사용합니다.
	- data-method, data-datatype, data-paramname 속성은 data-url 이 설정되었을 때만 사용 가능합니다.

### data-method(Optional)
- "GET" | "POST"
  	- "GET" (default)
	- ajax 통신 메소드를 지정하고자 할 때 사용합니다.  

### data-datatype(Optional)
- "json" | "jsonp"
	- "json" (default)
	- 서버에서 반환되는 데이터 형식을 지정할 때 사용합니다.

### data-paramname(Optional)
- {string}
	- 통신 request query string의 key를 설정할 때 사용합니다. (통신 URL 예시 > http://mydomain.com/words?keyword=ma)

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "ma"을 입력해보세요 </span><br/><br/>
	<div class="Autocomplete" data-url="/words" data-minlength=2 data-paramname="keyword" data-datatype="json" id="divTest03"></div>
</div>

```
<div class="Autocomplete" data-url="/words" data-minlength=2 data-paramname="keyword" data-datatype="json" id="divTest03"></div>
```
</div>

### data-source(Optional)
- {object}
	- 자동 완성의 데이터를 직접 넣어 줄 때 사용합니다.

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "ida"을 입력해보세요 </span><br/><br/>
	<div class="Autocomplete" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest04"></div>
</div>

```
<div class="Autocomplete" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest04"></div>
```
</div>

### data-reset-button(Optional)
- "true"
	- input element에 삭제 버튼을 생성합니다.

<div class="eg">
<div class="egview">
	<div class="Autocomplete" data-reset-button="true" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest05"></div>
</div>

```
<div class="Autocomplete"  data-reset-button="true" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest05" ></div>
```
</div>


### data-minlength(Optional)
- {number}
	- default : 1
	- 텍스트의 길이가 minlength보다 같거나 클 때 자동완성 기능이 동작합니다.

	-  정해진 데이터 안에서 Textinput 값을 통해 자동 완성 데이터를 완성하는 방식

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "ida"을 입력해보세요 </span><br/><br/>
	<div class="Autocomplete" data-minlength="3" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest06"></div>
</div>

```
<div class="Autocomplete"  data-minlength="3" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest06"></div>
```
</div>

### data-noresultstr(Optional)
- {string}
	- 자동 완성 결과 없을 때 보여줄 텍스트를 지정하고자 할 때 사용합니다.

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "k"을 입력해보세요 </span><br/><br/>
	<div class="Autocomplete" data-noresultstr="매칭 결과 없음"' data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest07"></div>
</div>

```
<div class="Autocomplete" data-noresultstr="매칭 결과 없음" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest07"></div>
```
</div>

### data-maxresult(Optional)
- {number}
	- default : 100
	- 자동 완성 결과의 최대 갯수를 설정하고자 할 때 사용합니다.

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "i"을 입력해보세요 </span><br/><br/>
	<h5> maxresult : 2 </h5>
	<div class="Autocomplete" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' data-maxresult="2" id="divTest08"></div>
</div>

```
	<div class="Autocomplete" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' data-maxresult="2" id="divTest08"></div>
```
</div>

### data-fitwidth(Optional)
- {boolean}
- true (default)
 - Textinput과 Dropdown의 폭(width)을 일치시킵니다.
 - Textinput의 길이보다 내용이 길 경우 ellipsis(말줄임표, ...)로 처리되어 보여집니다.  
- false
 - Dropdown의 폭(width)이 리스트 길이에 따라 달라집니다.
 - Textinput 넓이보다 작아지지 않습니다.  

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "a"을 입력해보세요 </span><br/><br/>
	<h5> data-fitwidth=true </h5>
	<div class="Autocomplete" id="fitTrue" data-fitwidth="true" data-url="/words" data-paramname="keyword" ></div>
	<h5> data-fitwidth=false </h5>
  <div class="Autocomplete" id="fitFalse" data-fitwidth="false" data-url="/words" data-paramname="keyword" ></div>
</div>
```
<div class="Autocomplete" id="fitTrue" data-fitwidth="true" data-url="/words" data-paramname="keyword" ></div>
<div class="Autocomplete" id="fitFalse" data-fitwidth="false" data-url="/words" data-paramname="keyword" ></div>
```
</div>

### data-maxheight(Optional)
- {number}
- Dropdown의 최대 높이 값(px)을 지정할 때 사용합니다.


<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "m"을 입력해보세요 </span><br/><br/>
	<div class="Autocomplete" data-maxheight="100" data-url="/words" data-paramname="keyword" id="divTest09"></div>
</div>
```
<div class="Autocomplete" data-maxheight="100" data-url="/words" data-paramname="keyword" id="divTest09"></div>
```
</div>

### data-open-button(Optional)
- "true"
	- input element에 열림 버튼을 생성합니다.
	
	
<div class="eg">
<div class="egview">
	<div class="Autocomplete" data-open-button="true" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest10"></div>
</div>
```
<div class="Autocomplete" data-open-button="true" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest10"></div>
```
</div>

### data-filter (Optional)

자동 완성 필터링 옵션을 지정하고자 할 때 사용합니다. (data-url 방식에서는 적용되지 않습니다)<br/>
pipe(|) 키를 사용하여 여러 옵션을 지정할 수 있습니다. 


- "prefix"
	- 접두사 일치
- "suffix" 
	- 접미사 일치
- "caseSensitive"
	- 대소문자 구분 
- "ignoreWhitespace"
	- 공백 무시

<div class="eg">
<div class="egview">
	<div class="Autocomplete" data-filter="prefix | ignoreWhitespace" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest11"></div>
</div>
```
<div class="Autocomplete" data-filter="prefix | ignoreWhitespace" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest11"></div>
```
</div>

### data-dynamic-dropdown (Optional)

목록으로 보여지는 Dropdown을 동적으로 생성하고자 할 때 사용합니다.<br/>
상위 엘리먼트 영역에 의해 Dropdown 목록이 가려지는 경우에 사용합니다. 

- "true"
	- 목록이 열리는 시점에 document.body 영역에 Dropdown 객체가 생성되고, close 되는 시점에 삭제됩니다. 

<div class="eg">
<div class="egview">
	<div class="Autocomplete" data-dynamic-dropdown="true" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest12" ></div>
</div>
```
<div class="Autocomplete"  data-dynamic-dropdown="true"  data-filter="prefix | ignoreWhitespace" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest12" ></div>
```
</div>

### data-enter-selectfirst (Optional)

Textinput에서 엔터키 입력 시 첫번째 항목을 선택하도록 설정할 때 사용합니다.  

- "true"
	- Textinput 에서 엔터키 입력 시 첫번째 항목이 선택됩니다.  

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "i"을 입력 후 엔터키를 누르세요 </span><br/><br/>
	<div class="Autocomplete" data-enter-selectfirst="true" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest13"></div>
</div>
```
<div class="Autocomplete"  data-enter-selectfirst="true" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' id="divTest13"></div>
```
</div>


## Functions

### .setOptions(JSON option)
.setOptions 함수를 통해서 옵션을 동적으로 설정할 수 있습니다.

- parameter
	- url {string} Optional
		- 자동 완성 데이터를 가져올 URL을 지정할 때 사용합니다. (data-url 속성과 동일 기능)
		- source 옵션과 동시에 사용될 수 없습니다.
	- method {string} Optional
		- ajax 통신의 메소드를 지정하고자 할 때 사용합니다. (data-method 속성과 동일 기능)
		- url 속성 값이 지정되어 있을 때 유효하게 작동합니다.
		- 'GET'(default) | 'POST'  
	- datatype {string} Optional
		- 서버에서 반환되는 데이터 형식을 지정할 때 사용합니다. (data-datatype 속성과 동일 기능)
		- url 속성 값이 지정되어 있을 때 유효하게 작동합니다.
		- 'json'| 'jsonp'
	- paramname {string} Optional
		- 파라미터 이름을 설정해야 할 때 사용합니다. (data-paramname 속성과 동일 기능)
		- url 속성 값이 지정되어 있을 때 유효하게 작동합니다.

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "m"을 입력해보세요 </span><br/><br/>
	<div class="Autocomplete" id="setOptions_url"></div>
	<button class="Button" id="setOptions1"> setOptions </button>
</div>
```
<div class="Autocomplete" id="setOptions_url" ></div>
<button class="Button" id="setOptions1"> setOptions </button>
```
```
$("#setOptions1").on('click', function(){
	$("#setOptions_url").setOptions({
		url : "/2.3/dev-component/autocomplete/data.json",
		method : "get",
		datatype : "json",
		paramname : "q"
	});
});
```
</div>

<script>
$(document).on('mdload', function(){

	$("#setOptions1").on('click', function(){
		$("#setOptions_url").on('onSelected', function(e, el, data){
			console.log(el);
			console.log(data);
		});

		$("#setOptions_url").setOptions({
			url : "/2.3/dev-component/autocomplete/data.json",
			method : "get",
			datatype : "json",
			paramname : "q"
		});
	});
});
</script>

- parameter
	- source {JSON Object} Optional
		- 자동 완성의 데이터를 직접 넣어 줄 때 사용합니다. (data-source 속성과 동일 기능)
		- url 옵션과 동시에 사용될 수 없습니다.


<div class="eg">
<div class="egview">
	<div class="Autocomplete" id="setOptions_source"></div>
	<button class="Button" id="setOptions2"> setOptions </button>
</div>
```
<div class="Autocomplete" id="setOptions_source" ></div>
<button class="Button" id="setOptions2"> setOptions </button>
```
```
$("#setOptions2").on('click', function(){
	$("#setOptions_source").setOptions({
		source : [{"text":"Maine","capital":"Augusta"},
				  {"text":"Maryland","capital":"Annapolis"},
				  {"text":"Massachusetts","capital":"Boston"},
				  {"text":"Michigan","capital":"Lansing"},
				  {"text":"Minnesota","capital":"St Paul"},
				  {"text":"Mississippi","capital":"Jackson"},
				  {"text":"Missouri","capital":"Jefferson City"}]
	});
});
```
</div>

<script>
$(document).on('mdload', function(){
	$("#setOptions2").on('click', function(){
		$("#setOptions_source").setOptions({
			source : [{"text":"Maine","capital":"Augusta"},
					  {"text":"Maryland","capital":"Annapolis"},
					  {"text":"Massachusetts","capital":"Boston"},
					  {"text":"Michigan","capital":"Lansing"},
					  {"text":"Minnesota","capital":"St Paul"},
					  {"text":"Mississippi","capital":"Jackson"},
					  {"text":"Missouri","capital":"Jefferson City"}]
		});
	});
});
</script>

- parameter
	- minlength {number} Optional
		- 텍스트의 길이가 minlength보다 같거나 클 때 자동완성 기능이 동작합니다. (data-minlength 속성과 동일 기능)
<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "mis"을 입력해보세요 </span><br/><br/>
	<span class="Autocomplete" id="setOptions_minlen" ></span>
	<button class="Button" id="setOptions3"> setOptions </button>
</div>
```
<span class="Autocomplete" id="setOptions_minlen"></span>
<button class="Button" id="setOptions3"> setOptions </button>
```
```
$("#setOptions3").on('click', function(){
	$("#setOptions_minlen").setOptions({
		source : [{"text":"Maine","capital":"Augusta"},
			  {"text":"Maryland","capital":"Annapolis"},
			  {"text":"Massachusetts","capital":"Boston"},
			  {"text":"Michigan","capital":"Lansing"},
			  {"text":"Minnesota","capital":"St Paul"},
			  {"text":"Mississippi","capital":"Jackson"},
			  {"text":"Missouri","capital":"Jefferson City"}],
		minlength : 3
	});
});
```
</div>

<script>
$(document).on('mdload', function(){
	$("#setOptions3").on('click', function(){
		$("#setOptions_minlen").setOptions({
			source : [{"text":"Maine","capital":"Augusta"},
			  {"text":"Maryland","capital":"Annapolis"},
			  {"text":"Massachusetts","capital":"Boston"},
			  {"text":"Michigan","capital":"Lansing"},
			  {"text":"Minnesota","capital":"St Paul"},
			  {"text":"Mississippi","capital":"Jackson"},
			  {"text":"Missouri","capital":"Jefferson City"}],
			minlength : 3
		});
	});
});
</script>

- parameter
	- noresultstr {string}  Optional
		- default : "No Results"
		- 자동 완성할 데이터가 없을 때 보여지는 텍스트를 설정할 수 있습니다.

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> 텍스트를 입력해보세요 </span><br/><br/>
	<span class="Autocomplete" id="setOptions_noresultstr"></span>
	<button class="Button" id="setOptions4"> setOptions </button>
</div>
```
<span class="Autocomplete" id="setOptions_noresultstr"></span>
<button class="Button" id="setOptions4"> setOptions </button>
```
```
$("#setOptions4").on('click', function(){
	$("#setOptions_noresultstr").setOptions({
		source : [],
		noresultstr : '매칭 결과 없음'
	});
});
```
</div>

<script>
$(document).on('mdload', function(){
	$("#setOptions4").on('click', function(){
		$("#setOptions_noresultstr").setOptions({
			source : [],
			noresultstr : '매칭 결과 없음'
		});
	});
});
</script>

- parameter
	- maxresult {number}  Optional
		- default : 100
		- 자동 완성 결과의 최대 갯수를 설정할 수 있습니다.

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "m"을 입력해보세요 </span><br/><br/>
	<span class="Autocomplete" id="setOptions_maxresult"></span>
	<button class="Button" id="setOptions5"> setOptions </button>
</div>
```
<span class="Autocomplete" id="setOptions_maxresult"></span>
<button class="Button" id="setOptions5"> setOptions </button>
```
```
$("#setOptions5").on('click', function(){
	$("#setOptions_maxresult").setOptions({
		source : [{"text":"Maine","capital":"Augusta"},
		  {"text":"Maryland","capital":"Annapolis"},
		  {"text":"Massachusetts","capital":"Boston"},
		  {"text":"Michigan","capital":"Lansing"},
		  {"text":"Minnesota","capital":"St Paul"},
		  {"text":"Mississippi","capital":"Jackson"},
		  {"text":"Missouri","capital":"Jefferson City"}],
		maxresult : 3
	});
});
```
</div>

<script>
$(document).on('mdload', function(){
	$("#setOptions5").on('click', function(){
		$("#setOptions_maxresult").setOptions({
			source : [{"text":"Maine","capital":"Augusta"},
					  {"text":"Maryland","capital":"Annapolis"},
					  {"text":"Massachusetts","capital":"Boston"},
					  {"text":"Michigan","capital":"Lansing"},
					  {"text":"Minnesota","capital":"St Paul"},
					  {"text":"Mississippi","capital":"Jackson"},
					  {"text":"Missouri","capital":"Jefferson City"}],
			maxresult : 3
		});
	});
});
</script>

- parameter
	- select {function}  Optional
		- 자동 완성 목록을 선택했을 때 처리할 함수를 넣어줍니다.

<div class="eg">
<div class="egview">
	<span style="font-size: 16px;font-weight: bold;color: #fa5a4c;"> "m"를 입력한 후 목록 중 하나를 선택해보세요</span><br/><br/>
	<span class="Autocomplete" id="setOptions_select"></span>
	<button class="Button" id="setOptions6"> setOptions </button>
</div>
```
<span class="Autocomplete" id="setOptions_select"></span>
<button class="Button" id="setOptions6"> setOptions </button>
```
```
$("#setOptions6").on('click', function(){
	$("#setOptions_select").setOptions({
		source : [{"text":"Maine","capital":"Augusta"},
				  {"text":"Maryland","capital":"Annapolis"},
				  {"text":"Massachusetts","capital":"Boston"},
				  {"text":"Michigan","capital":"Lansing"},
				  {"text":"Minnesota","capital":"St Paul"},
				  {"text":"Mississippi","capital":"Jackson"},
				  {"text":"Missouri","capital":"Jefferson City"}],
		select : function(e){
			alert("selected : "+JSON.stringify($("#setOptions_select").getSelectedData()));
		}
	});
});
```
</div>

<script>
$(document).on('mdload', function(){
	$("#setOptions6").on('click', function(){
		$("#setOptions_select").setOptions({
			source : [{"text":"Maine","capital":"Augusta"},
					  {"text":"Maryland","capital":"Annapolis"},
					  {"text":"Massachusetts","capital":"Boston"},
					  {"text":"Michigan","capital":"Lansing"},
					  {"text":"Minnesota","capital":"St Paul"},
					  {"text":"Mississippi","capital":"Jackson"},
					  {"text":"Missouri","capital":"Jefferson City"}],
			select : function(e){
				alert("selected : "+JSON.stringify($("#setOptions_select").getSelectedData()));
			}
		});
	});
});
</script>

- parameter
	- selectedDataDefault {object}  Optional
		- getSelectedData API 호출 시, 선택된 항목이 없을 경우 리턴값을 설정할 때 사용합니다.  
		
<div class="eg">
<div class="egview">
	<span class="Autocomplete" id="setOptions_default" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' ></span>
	<button class="Button" id="selectedDataDefault"> getSelectedData </button>
</div>
```
<span class="Autocomplete" id="setOptions_default" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]' ></span>
<button class="Button" id="selectedDataDefault"> getSelectedData </button>
```
```
$("#getSelectedData").on('click', function(){
	$("#setOptions_default").setOptions({
		selectedDataDefault : { "text" : "" }
	});
	$("#getSelectedData").on("click", function(){
		var data = $("#setOptions_default").getSelectedData();
		alert("getSelectedData : "+JSON.stringify(data));
	});
});
```
</div>

<script>
$(document).on('mdload', function(){
	$("#setOptions_default").setOptions({
		selectedDataDefault : { "text" : "" }
	});
	$("#selectedDataDefault").on("click", function(){
		var data = $("#setOptions_default").getSelectedData();
		alert("getSelectedData : "+JSON.stringify(data));
	});
});
</script>
		
### .getSelectedData()

선택된 항목의 JSON 데이터를 가져오는 API 입니다.

- return
	- {JSON object}
		- 자동 완성 목록에서 선택된 항목의 JSON 데이터를 return하여 줍니다.

<div class="eg">
<div class="egview">
	<span class="Autocomplete" id="test_getSelectedData" data-source='[{"text":"Maine","capital":"Augusta"},{"text":"Maryland","capital":"Annapolis"},{"text":"Massachusetts","capital":"Boston"}]'></span>
	<button class="Button" id="getSelectedData"> getSelectedData </button>
</div>
```
<span class="Autocomplete" id="test_getSelectedData" data-source='[{"text":"Maine","capital":"Augusta"},{"text":"Maryland","capital":"Annapolis"},{"text":"Massachusetts","capital":"Boston"}]'></span>
<button class="Button" id="getSelectedData"> getSelectedData </button>
```
```
$("#getSelectedData").on('click', function(){
		var getSelectedData = $("#test_getSelectedData").getSelectedData();
		alert("getSelectedData : "+JSON.stringify(getSelectedData));
});
```
</div>

<script>
$(document).on('mdload', function(){
	$("#getSelectedData").on('click', function(){
		var getSelectedData = $("#test_getSelectedData").getSelectedData();
		alert("getSelectedData : "+JSON.stringify(getSelectedData));
	});
});
</script>

### .select(index)

Autocomplete 안의 목록(드롭다운 메뉴)을 동적 선택 합니다.  
 
- parameter
	- {Number} Required
		- 선택할 목록의 인덱스 값을 넣어줍니다. 


<div class="eg">
<div class="egview">
	<div class="Autocomplete" id="select"></div>
	<button class="Button" id="selectBtn">select(0)</button>
</div>
```
	<div class="Autocomplete" id="select"</div>
	<button class="Button" id="selectBtn">select(0)</button>
```
```
	$("#select").setOptions({
		source : [
		          { id : "code1",  text : "ABC", value : "code1"},  
		       	  { id : "code2", text : "BBC", value : "code2"},  
		       	  { id : "code3", text : "BBA", value : "code3"},  
		       	  { id : "code4", text : "CBC", value : "code4"}
   				]
	});
	$("#selectBtn").on("click", function(e){
		var index = 0;
		$("#select").select(index);
	});

```
</div>
<script>
$(document).on('mdload', function(){
	$("#select").setOptions({
		source : [
		          { id : "code1",  text : "ABC", value : "code1"},  
		       	  { id : "code2", text : "BBC", value : "code2"},  
		       	  { id : "code3", text : "BBA", value : "code3"},  
		       	  { id : "code4", text : "CBC", value : "code4"}
   				]
	});
	$("#selectBtn").on("click", function(e){
		var index = 0;
		$("#select").select(index);
	});
});
</script>

### .setEnabled(Boolean)

Autocomplete 컴포넌트를 활성화 / 비활성화할 수 있는 함수입니다.

- parameter
	- {Boolean}  Required
		- Autocomplete 컴포넌트를 활성화 / 비활성화 합니다.
		
<div class="eg">
<div class="egview">
	<div class="Autocomplete" id="setEnable"></div>
	<button class="Button" id="enabledBtn">setEnabled(true)</button>
	<button class="Button" id="disabledBtn">setEnabled(false)</button><br/>
</div>
```
	<div class="Autocomplete" id="setEnable"></div>
	<button class="Button" id="enabledBtn">setEnabled(true)</button>
	<button class="Button" id="disabledBtn">setEnabled(false)</button><br/>
```
```
	$("#setEnable").setOptions({
		source : [
		          { id : "code1",  text : "ABC", value : "code1"},  
		       	  { id : "code2", text : "BBC", value : "code2"},  
		       	  { id : "code3", text : "BBA", value : "code3"},  
		       	  { id : "code4", text : "CBC", value : "code4"}
   				]
	});
	$("#enabledBt").on("click", function(e){
		$("#setEnable").setEnabled(true);
	});
	$("#disabledBtn").on("click", function(e){
		$("#setEnable").setEnabled(false);
	});

```
</div>
<script>
$(document).on('mdload', function(){
	$("#setEnable").setOptions({
		source : [
		          { id : "code1",  text : "ABC", value : "code1"},  
		       	  { id : "code2", text : "BBC", value : "code2"},  
		       	  { id : "code3", text : "BBA", value : "code3"},  
		       	  { id : "code4", text : "CBC", value : "code4"}
   				]
	});
	$("#enabledBtn").on("click", function(e){
		$("#setEnable").setEnabled(true);
	});
	$("#disabledBtn").on("click", function(e){
		$("#setEnable").setEnabled(false);
	});
});
</script>

### .setCustomFilter(function)

자동 완성 필터링을 위한 커스텀 함수를 등록하는 함수입니다. (data-url 방식에서는 적용되지 않습니다)

- parameter
	- {function} Required
		- 필터링 처리 함수를 넣어줍니다. 

<div class="eg">
<div class="egview">
<div class="Autocomplete" id="custom" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]'></div>
</div>
```
<div class="Autocomplete" id="custom" data-source='[{"text":"Idaho"},{"text":"Illinois"},{"text":"Indiana"},{"text":"Iowa"}]'></div>
```
```
$("#custom").setCustomFilter(function(el, source, text){
	var el = el; // Autocomplete 엘리먼트 
	var source = source; // 필터링 대상 JSONArray
	var text = text; // 필터링 키워드 
	
	// 필터링 처리
	alert("커스텀 필터링 수행 ");
	
	return source;
});
```
</div>

<script>
$(document).on('mdload', function(){
$("#custom").setCustomFilter(function(el, source, text){
	var el = el; // Autocomplete 엘리먼트 
	var source = source; // 필터링 대상 JSONArray
	var text = text; // 필터링 키워드 
	
	// 필터링 처리
	alert("커스텀 필터링 수행 ");
	
	return source;
});
});
</script>


