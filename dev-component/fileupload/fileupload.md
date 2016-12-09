<script>
$(document).on('mdload', function(){

    $a.request.setup({
  		    url : function(id, param) {
  		        return id ; // $a.request 서비스 ID가 적용될 것이다
  		    },
  		    method: 'post',
  		    timeout: 30000,
     });
     
	var uploadObj1 = $("#fileuploader").setOptions({
	    url : '/upload',
		fileName : 'uploadFiles',
		maxFileSize : 1000000,
		onError : function(files,status,errMsg,pd)
        {
           var errorInfo = files+" / "+status+" / "+errMsg;
           alert(errorInfo);
        } 
		
	});

    $("#uploadBtn1").on('click', function(){
       // alert($("#fileuploader").getFileCount()+" files upload")
		$("#fileuploader").startUpload(); //실제 전송 수행 시
	});
	
	var uploadObj2 = $("#fileuploaderA").setOptions({
	    url : '/upload',
		fileName : 'uploadFiles',
		maxFileSize : 1000000,
		onError : function(files,status,errMsg,pd)
        {
           var errorInfo = files+" / "+status+" / "+errMsg;
           alert(errorInfo);
        }
    });
	
	$("#startUploadA").on('click', function(){
	    // alert($("#fileuploaderA").getFileCount()+" files upload")
		$("#fileuploaderA").startUpload();// 실제 전송 수행 시
	
	});

	$("#stopUploadA").on('click', function(){
		$("#fileuploaderA").stopUpload();
	});
	$("#cancelAllA").on('click', function(){
		$("#fileuploaderA").cancelAll();
	});
	
	var uploadObj3 = $("#fileuploaderB").setOptions({
	    url : '서버URL',
		fileName : 'uploadFiles',
		showFileCounter : true,
		onSelect : function(files)
        {
          var fileInfo = files[0].name+" ("+files[0].size+"Byte)";
           alert(fileInfo);
          // return false; / 리턴 값이 false 일 경우, 선택 취소
        },
        onSubmit : function(files)
        {
          alert(files);
          
         // return false; // 리턴 값이 false 일 경우, 전송 중단
        },
        onError : function(files,status,errMsg,pd)
        {
           var errorInfo = files+" / "+status+" / "+errMsg;
           alert(errorInfo);
        },
        onCancel : function(files,pd)
        {
           var cancelInfo = "Cancel File : "+files;
           alert(cancelInfo);
        }
    });
	
	$("#startUploadB").on('click', function(){
		$("#fileuploaderB").startUpload();
	});

	$("#stopUploadB").on('click', function(){
		$("#fileuploaderB").stopUpload();
	});
	$("#cancelAllB").on('click', function(){
		$("#fileuploaderB").cancelAll();
	});

    
	var uploadObj4 = $("#fileuploaderC").setOptions({
    	    url : '/upload',
		    fileName : 'uploadFiles',
		    maxFileSize : 1000000,
    		onLoad  : function(obj){
    		 $a.request('/uploaded', { //업로드 된 파일목록을 얻기 위한 서비스 호출
    	   		success : function(res) {
    	   		 for(var i=0;i<res.length;i++){ 
    	   		 //서버로부터 받아 온 목록 정보를 표시. createProgress(파일명,파일경로,용량)
    	       			obj.createProgress(res[i]["name"],res[i]["path"],res[i]["size"]);
    	         }
    	   		}
    	     });
     		},
      		deleteCallback: function (filename, pd) {
    		    $a.request('/delete', { //업로드 된 파일을 삭제 하기 위한 서비스 호출
    		    		data : {"fileName":filename},//삭제할 파일명을 서버로 전달하기 위한 데이터 설정
    	    	   		success : function(res) {
    	    	   		 pd.statusbar.hide(); //서버에서 삭제 후 파일 목록 창에서 항목을 제거합니다.
    	    	   		  alert(res.fileName +"이 삭제되었습니다.");
    	    	   		}
    	    	});
     		},
    		downloadCallback:function(filename,pd){
    			$a.request('/download', { //업로드된 파일을 다운로드 하기 위한 서비스 호출
		    		data : {"fileName":filename},//다운로드할 파일명을 서버로 전달하기 위한 데이터 설정
	    	   		success : function(res) {
	    	   		    //서버로부터 실제 다운로드 경로를 받아 다운로드 수행.
	    	   			
                        window.open(res.path);
	    	   		}
	    	    });
    		},
    		onError : function(files,status,errMsg,pd){
                var errorInfo = files+" / "+status+" / "+errMsg;
                alert(errorInfo);
            }
    	});	
    	$("#startUploadC").on('click', function(){
    		$("#fileuploaderC").startUpload();// 실제 전송 수행 시
    	});
	
});
</script>

# FileUpload

## Basic
파일업로드(FileUpload) 컴포넌트는 로컬에 있는 파일을 서버로 업로드 할 수 있는 컴포넌트입니다. IE10 이상에서 정상적으로 사용할 수 있습니다. 
 
주요 기능은 다음과 같습니다. 

- Single File Upload
- Multiple file Upload (Drag & Drop)
- Sequential file upload
- File Restrictions
- Localization (Multi-language)
- Sending Form Data
- Adding HTML elements to progressbar
- Custom UI
- Upload Events
- Delete / Download Uploaded files
- Image Preview
- Show previous uploads


<div class="eg">
<div class="egview">

  <div class="Margin-bottom-10">
    <div id="fileuploader" class="Fileupload" data-selectType="basic" ></div>
  </div>
  <br>
  <div class="Float-left Margin-top-5">
   <button id="uploadBtn1" class="Button">업로드</button>
  </div>
  <br><br>
  
</div>
```
  <div class="Margin-bottom-10">
    <div id="fileuploader" class="Fileupload" data-selectType="basic" ></div>
  </div>
  <div class="Float-left Margin-top-5">
   <button id="uploadBtn1" class="Button">업로드</button>
  </div>
```
```
var uploadObj1 = $("#fileuploader").setOptions({
	    url : '/upload',
		fileName : 'uploadFiles',
		maxFileSize : 1000000,
		onError : function(files,status,errMsg,pd)
        {
           var errorInfo = files+" / "+status+" / "+errMsg;
           alert(errorInfo);
        } 
});
 $("#uploadBtn1").on('click', function(){
		$("#fileuploader").startUpload(); 
});
```
</div>

파일업로드 컴포넌트는 [jQuery Upload File Plugin](http://hayageek.com/docs/jquery-upload-file.php)을 wrapping한 구조로 되어 있습니다. 그렇기 때문에 기존 컴포넌트와는 별개로 아래 3가지 파일 링크가 필요합니다.
또한, 별도의 서버사이드 파일은 Alopex UI 에서 제공하고 있지 않으므로, 개발환경에 맞게 준비하셔야합니다. 

	- alopex-ext.js
		jquery.uploadfile.js가 merge된 파일
	- alopex-ext-setup.js
		FileUpload에 대한 widget 확장 셋업
	- alopex-ext.css
		FileUpload에 대한 스타일링


이 문서는 [jQuery Upload File Plugin](http://hayageek.com/docs/jquery-upload-file.php)의 일부 기능을 설명하고 있습니다. 기타 기능은 [jQuery Upload File Plugin](http://hayageek.com/docs/jquery-upload-file.php)에서 확인 바랍니다.

## Attributes
### class {string}
- "Fileupload"
  	- 해당 엘리먼트가 Fileupload 컴포넌트라는 것을 지정합니다. 

### data-select-type {string} (Optional)
- "basic" | "advance"
  	- "basic" (default) : 싱글 파일 업로드를 위한 기본 모드로 사용합니다. 
  	- "advance" : 멀티 파일 셀렉트/업로드를 위한 고급 모드로 사용합니다. 이미지 preview 및 파일 진행 상태/컨트롤을 제공합니다. 
  	
<div class="eg">
<div class="egview">

<div id="fileuploaderA" class="Fileupload" data-selectType="advance" ></div>
<div>
 
 <div class="Float-right Margin-top-5">
   <button id="startUploadA" class="Button Confirm"> startUpload </button>
   <button id="stopUploadA" class="Button Danger"> stopUpload </button>
   <button id="cancelAllA" class="Button Warning"> cancelAll </button>
 </div>
</div><br>
</div>
```
<div id="fileuploaderA" class="Fileupload" data-selectType="advance" ></div>
<div>
 
 <div class="Float-right Margin-top-5">
   <button id="startUploadA" class="Button Confirm"> startUpload </button>
   <button id="stopUploadA" class="Button Danger"> stopUpload </button>
   <button id="cancelAllA" class="Button Warning"> cancelAll </button>
 </div>
</div>
```
```
var uploadObj2 = $("#fileuploaderA").setOptions({
	    url : '/upload',
		fileName : 'uploadFiles',
		maxFileSize : 1000000,
		onError : function(files,status,errMsg,pd)
        {
           var errorInfo = files+" / "+status+" / "+errMsg;
           alert(errorInfo);
        }
});
$("#startUploadA").on('click', function(){
		 $("#fileuploaderA").startUpload();
});

$("#stopUploadA").on('click', function(){
		$("#fileuploaderA").stopUpload();
});

$("#cancelAllA").on('click', function(){
		$("#fileuploaderA").cancelAll();
});



```
</div>

## Functions
### .setOptions(JSON option)
.setOptions 함수를 통해서 옵션을 동적으로 설정할 수 있습니다.<br> 
옵션 설정의 보다 자세한 내용과 사용법은 [jQuery Upload File Plugin](http://hayageek.com/docs/jquery-upload-file.php) 에서 확인하실 수 있습니다.

- parameter
	- url {string}
		- 파일 업로드를 수행 할 서버 URL을 지정할 때 사용합니다.업로드를 수행하기 위해서는 필수 항목입니다.
	- method {string} Optional
		- ajax 통신의 메소드를 지정하고자 할 때 사용합니다.
		- 'POST'(default) | 'GET'  
	- enctype {string} Optional
		- form 의 인코딩 방식을 지정합니다. 파일업로드는 하기 위해서는 기본적으로 multipart/form-data 로 사용합니다.
		- default : "multipart/form-data"
	- formData {boolean | object} Optional
		- 파일과 함께 전송되어야 할 form data 를 지정합니다.
		- false (default) | formData : { key1: 'value1', key2: 'value2' }
	- dynamicFormData {boolean | function} Optional
		- 파일과 함께 전송되어야 할 form data 를 동적으로 지정합니다.
	- sequential {boolean} Optional
		- 순차적인 파일 업로드 여부를 지정합니다. 
		- true (default) | false	
    - sequentialCount {number} Optional
		- sequential값이 true 로 설정하면 , sequentialCount 값에 따라 순차적으로 업로드할 파일 갯수를 지정합니다.
		- default : 1	
    - maxFileSize {number} Optional
		- 최대 허용 파일 용량을 Byte 단위로 설정합니다.
	- maxFileCount {number} Optional
		- 최대 허용 파일 갯수를  설정합니다.
		- data-select-type의 속성 값이 "advance"인 경우에 사용 가능합니다. 
	- returnType {null | string} Optional
		- 서버에서 반환되는 데이터 형식을 지정할 때 사용합니다.
		- null (default) | "xml" | "json" | "script" 	
	- allowedTypes {string} Optional
		- 허용할 파일 확장자를 지정합니다. 여러 확장자를 지정할 경우, 콤마로 구분합니다. ex)  "jpg,png,gif"
	- acceptFiles {string} Optional
		- 파일 브라우저에서 허용할 MINE 타입을 지정합니다. ex) "*" (default) 또는 "image/"
		- 타입 종류는 [Accept File Types](http://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv)를 참고하세요.
    - fileName {string} Optional
		- input 요소의 이름을 지정합니다.
		- default : "uploadFiles"
    - dragDrop {boolean} Optional
		- Drag & Drop 기능 사용 여부를 지정합니다.
		- data-select-type의 속성 값이 "advance"인 경우에 사용 가능합니다. 
        - false (default) | true
    - autoSubmit {boolean} Optional
		- 파일 선택 시 자동으로 업로드 전송 여부를 지정합니다.
        - false (default) | true
    - showCancel {boolean} Optional
		- 파일 상태 영역에서 '취소' 버튼의 사용 여부를 지정합니다.
        - true (default) | false
    - showAbort {boolean} Optional
		- 파일 상태 영역에서 전송 '중단' 버튼의 사용 여부를 지정합니다.
        - true (default) | false
    - showDone {boolean} Optional
		- 파일 상태 영역에서 전송 '완료' 버튼의 사용 여부를 지정합니다.
        - true (default) | false
    - showDelete {boolean} Optional
		- 파일 상태 영역에서 업로드 파일 '삭제' 버튼의 사용 여부를 지정합니다.
		- data-select-type의 속성 값이 "advance"인 경우에 사용 가능합니다. 
        - true (default) | false
    - showDownload {boolean} Optional
		- 파일 상태 영역에서 업로드 파일 '다운로드' 버튼의 사용 여부를 지정합니다.
		- data-select-type의 속성 값이 "advance"인 경우에 사용 가능합니다. 
        - true (default) | false
    - showStatusAfterSuccess {boolean} Optional
		- 파일 상태 영역에서 전송 완료된 파일 내역 표시 여부를 지정합니다. true 일 경우, showDone 과 showDelete 값에 의해 해당 기능 버튼이 보여집니다.
        - true (default) | false
    - showFileCounter {boolean} Optional
		- 파일명에 idnex 숫자 표시 여부를 지정합니다.
        - false (default) | true
    - showFileSize {boolean} Optional
		- 파일명에 파일 사이즈 표시 여부를 지정합니다.
        - true (default) | false
    - showPreview {boolean} Optional
		- 파일 상태 영역에서 이미지 프리뷰의 사용 여부를 지정합니다.
        - true (default) | false
    - onLoad {function(obj)} Optional
		- 파일 업로드 컴포넌트가 로드 된 시점에서 처리할 이벤트 함수를 넣어줍니다.
    - onSelect {function(files)} Optional
		- 파일 선택 시점에서 처리할 이벤트 함수를 넣어줍니다.
    - onSubmit {function(files)} Optional
		- 파일 업로드 수행 시점에서 처리할 이벤트 함수를 넣어줍니다.
    - onSuccess {function(files,data,xhr,pd)} Optional
		- 업로드가 성공 된 시점에서 처리할 이벤트 함수를 넣어줍니다.
	- afterUploadAll {function(obj)} Optional
		- 모든 파일의 업로드가 성공 된 시점에서 처리할 이벤트 함수를 넣어줍니다
	- onError {function(files,status,errMsg,pd)} Optional
		- 파일 선택 및 업로드가 실패 된 시점에서 처리할 이벤트 함수를 넣어줍니다.
	- onCancel {function(files,pd)} Optional
		- 사용자가 파일을 삭제(취소)한 시점에서 처리할 이벤트 함수를 넣어줍니다.
	- deleteCallback {function(filename,pd)} Optional
		- 사용자가 업로드한 파일의 '삭제' 버튼을 클릭한 시점에서 처리할 이벤트 함수를 넣어줍니다.
	- downloadCallback {function(filename,pd)} Optional
		- 사용자가 업로드한 파일의 '다운로드' 버튼을 클릭한 시점에서 처리할 이벤트 함수를 넣어줍니다.

<div class="eg">
<div class="egview">

<div id="fileuploaderB" class="Fileupload" data-selectType="advance" ></div>
<div>
 
 <div class="Float-right Margin-top-5">
   <button id="startUploadB" class="Button Confirm"> startUpload </button>
   <button id="stopUploadB" class="Button Danger"> stopUpload </button>
   <button id="cancelAllB" class="Button Warning"> cancelAll </button>
 </div>
</div><br>
</div>
```
<div id="fileuploaderB" class="Fileupload" data-selectType="advance" ></div>
<div>
 
 <div class="Float-right Margin-top-5">
   <button id="startUploadB" class="Button Confirm"> startUpload </button>
   <button id="stopUploadB" class="Button Danger"> stopUpload </button>
   <button id="cancelAllB" class="Button Warning"> cancelAll </button>
 </div>
</div>
```
```
var uploadObj3 = $("#fileuploaderB").setOptions({
	    url : '서버URL',
		fileName : 'uploadFiles',
		showFileCounter : true,
		onSelect : function(files)
        {
          var fileInfo = files[0].name+" ("+files[0].size+"Byte)";
           alert(fileInfo);
          // return false; / 리턴 값이 false 일 경우, 선택 취소
        },
        onSubmit : function(files)
        {
          alert(files);
         // return false; // 리턴 값이 false 일 경우, 전송 중단
        },
        onError : function(files,status,errMsg,pd)
        {
           var errorInfo = files+" / "+status+" / "+errMsg;
           alert(errorInfo);
        },
        onCancel : function(files,pd)
        {
           var cancelInfo = "Cancel File : "+files;
           alert(cancelInfo);
        }
});
	
$("#startUploadB").on('click', function(){
		$("#fileuploaderB").startUpload();
});

$("#stopUploadB").on('click', function(){
		$("#fileuploaderB").stopUpload();
});

$("#cancelAllB").on('click', function(){
		$("#fileuploaderB").cancelAll();
});


```
</div>

		
### .startUpload()
파일 업로드를 시작합니다.

### .stopUpload()
파일 업로드를 중단합니다.

### .cancelAll()
업로드할 파일 목록을 전부 취소(삭제)합니다.

### .getFileCount()
업로드 할 파일의 목록의 수를 반환합니다. 

### .removeElement()
업로드 컴포넌트를 삭제합니다.

### .getResponses()
서버로부터 받은 응답데이터를 반환합니다.

## Setup
setup 자바스크립트에서 파일업로드의 기본 속성을 공통으로 설정합니다. 

```
$a.setup('fileupload', {
	url : 'http://localhost/upload',
});
```
## Extra Example
### Delete / Download Uploaded files
이미 서버에 업로드된 파일을 표시하고, 서버로부터 파일의 삭제/다운로드를  수행하는 예제입니다. <br>
(단, Alopex UI 홈페이지에서 파일 추가를 하여 업로드한 경우에는, 보안 이슈 상 실제 업로드는 하지 않기에 다운로드가 수행되지는 않습니다.)<br>
서버사이드 파일은 각 서버 환경에 맞추어 준비하세요.

<div class="eg">
<div class="egview">

<div id="fileuploaderC" class="Fileupload" data-selectType="advance" ></div>
<div>
 
 <div class="Float-right Margin-top-5">
   <button id="startUploadC" class="Button Confirm"> startUpload </button>
   <button id="stopUploadC" class="Button Danger"> stopUpload </button>
   <button id="cancelAllC" class="Button Warning"> cancelAll </button>
 </div>
</div><br>
</div>
```
<div id="fileuploaderC" class="Fileupload" data-selectType="advance" ></div>
<div>
 
 <div class="Float-right Margin-top-5">
   <button id="startUploadC" class="Button Confirm"> startUpload </button>
   <button id="stopUploadC" class="Button Danger"> stopUpload </button>
   <button id="cancelAllC" class="Button Warning"> cancelAll </button>
 </div>
</div>
```
```
var uploadObj4 = $("#fileuploaderC").setOptions({
    	    url : '/upload',
		    fileName : 'uploadFiles',
		    maxFileSize : 1000000,
    		onLoad  : function(obj){
    		 $a.request('/uploaded', { //업로드 된 파일목록을 얻기 위한 서비스 호출
    	   		success : function(res) {
    	   		 for(var i=0;i<res.length;i++){ 
    	   		 //서버로부터 받아 온 목록 정보를 표시. createProgress(파일명,파일경로,용량)
    	       			obj.createProgress(res[i]["name"],res[i]["path"],res[i]["size"]);
    	         }
    	   		}
    	     });
     		},
      		deleteCallback: function (filename, pd) {
    		    $a.request('/delete', { //업로드 된 파일을 삭제 하기 위한 서비스 호출
    		    		data : {"fileName":filename},//삭제할 파일명을 서버로 전달하기 위한 데이터 설정
    	    	   		success : function(res) {
    	    	   		 pd.statusbar.hide(); // 서버에서 파일 삭제 후 목록 화면에서 해당 파일 항목을 제거합니다.
    	    	   		  alert(res.fileName +"이 삭제되었습니다.");
    	    	   		}
    	    	});
     		},
    		downloadCallback:function(filename,pd){
    			$a.request('/download', { //업로드된 파일을 다운로드 하기 위한 서비스 호출
		    		data : {"fileName":filename},//다운로드할 파일명을 서버로 전달하기 위한 데이터 설정
	    	   		success : function(res) {
	    	   		    //서버로부터 실제 다운로드 경로를 받아 다운로드 수행.
	    	   			//location.href = res.path 또는 업무에 맞추어 server/client 로직을 구현.  
                        window.open(res.path);
	    	   		}
	    	    });
    		},
    		onError : function(files,status,errMsg,pd){
                var errorInfo = files+" / "+status+" / "+errMsg;
                alert(errorInfo);
            }
 });	
	
$("#startUploadC").on('click', function(){
		$("#fileuploaderC").startUpload();
});

$("#stopUploadC").on('click', function(){
		$("#fileuploaderC").stopUpload();
});

$("#cancelAllC").on('click', function(){
		$("#fileuploaderC").cancelAll();
});


```
</div>