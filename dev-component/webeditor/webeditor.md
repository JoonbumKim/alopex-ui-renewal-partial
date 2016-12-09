# WebEditor

## Basic
웹 에디터(WebEditor) 컴포넌트는 쉽게 적용 할 수 있는 웹문서를 편집할 수 있는 컴포넌트입니다.
<iframe id="basicIframe" src="webeditor/webeditor-basic.html" width="98%" height="500px" style="border: 2px; margin: 5px;" ></iframe>
 

### 디렉토리 구조

webeditor 라이브러리 전체 구성은 아래와 같습니다.
 
```
* 라이브러리 내 webeditor 폴더 위치

AlopexUI_library
    ┣━ script
     	┗━━ src
	      	┗━ webeditor (folder)

* webeditor 폴더 구조

webeditor (folder)
	┣━ alopex-webeditor-setup.js 
	┣━ alopex-webeditor.css
	┣━ alopex-webeditor.js
	┗━ lang (folder)	             
```
### 적용

webeditor 라이브러리 적용 방법입니다.  
아래와 같이 필수/선택적으로 적용하도록 합니다.  

#### 웹에디터 구현 시
```
<link rel="stylesheet" type="text/css" href="{path}/script/lib/alopex/src/webeditor/alopex-webeditor.css" />
<!--공통 (필수)-->
<script src="{path}/script/lib/alopex/src/webeditor/alopex-webeditor.js"></script><!--공통 (필수)-->
<script src="{path}/script/lib/alopex/src/webeditor/alopex-webeditor-setup.js"></script> <!--공통 (필수)-->
<script src="{path}/script/lib/alopex/src/webeditor/lang/alopex-ko-KR.js"></script><!--언어변경 (선택)-->
```

## Attributes 

### class {string}

- "WebEditor"
	- 해당 엘리먼트가 WebEditor 컴포넌트라는 것을 지정합니다. 
 
 
		
##  Functions
웹 에디터(WebEditor) API를 이용하여 설정을 변경함은 물론, 데이터 추출, 데이터 삽입등  API를 호출할 수 있습니다. 

### .webeditor(option) 
- parameter
	- {Json Object}
		- 에디터의 설정을 변경 할 수 있습니다.

```
$a.page(function() {
   this.init = function(id, param) {
       $('#WebeditorOpt').webeditor({
            height: 200,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor,
            toolbar: [
                        //[groupName, [list of button]]
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']]
                      ],
            fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'],
            popover: {
                image: [
                        ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                        ['float', ['floatLeft', 'floatRight', 'floatNone']],
                        ['custom', ['imageAttributes']]
                        ],
            },
            callbacks: {
                onImageUpload: function(files) {
                $(this).webeditor('insertImage', 'http://grid.alopex.io/styles/img/logo_small.png');
                },
                onEnter: function() {
                      console.log('Enter/Return key pressed---');
                    }
            }
        });
};

```

- height {int}
	- 에디터의 높이를 설정. height가 설절되지 않으면 내용에 따라 높이값이 조정

- minHeight {int}
	- 최소 높이값

- maxHeight {int}
	- 최대 높이값

- toolbar {object} 
	- 에디터에 사용되는 툴바 
<iframe id="customIframe" src="webeditor/webeditor-custom.html" width="98%" height="650px" style="border: 2px; margin: 5px;"></iframe>
	
- fontNames {object} 
	- 에디터에 사용될 수 있는 font Names 정보

<iframe id="customIframe" src="webeditor/webeditor-font.html" width="98%" height="520px" style="border: 2px; margin: 5px;"></iframe>

- lang  {string} 
	- fontNames 예제 참조  Default는  'en-US' 이며 다른 언어로 변경시 해당 언어 js 파일 추가 참조가 필요
	- 한국어 : ko-KR, 일본어 : ja-JP, 중국어 : zh-CN js파일 제공
	
- popover {object} 
	- 이미지, 링크등을 클릭했을때 노출 되는 메뉴
		
- callbacks {object} 
	- Function 참조


<iframe id="apiIframe" src="webeditor/webeditor-api.html" width="98%" height="2000px" style="border: 2px; margin: 5px;" ></iframe>




### insertNode
- parameter
	- 'insertNode',{Object}
		- 에디터에 tag node를 생성 할 수 있습니다.

```
var node = document.createElement('div');
// @param {Node} node
$('#Webeditor5').webeditor('insertNode', node);
```

### insertLink
- parameter
	- 'createLink', {String} text , {String} url , {Boolean} newWindow
		- 에디터에 link를 추가 할 수 있습니다.

```
$('#Webeditor5').webeditor('createLink', {
  text: '클릭해주세요.',
  url: 'http://ui.alopex.io',
  newWindow: true
});

$('#Webeditor5').webeditor('unlink');
```
### insertImage
- parameter
	- 'insertImage', {String} url, {String|Function} filename - optional
		- 에디터에 이미지를 추가 할 수 있습니다.

```
$('#Webeditor5').webeditor('insertImage', url, function ($image) {
  $image.css('width', $image.width() / 3);
  $image.attr('data-filename', 'retriever');
});

```

### Callbacks
에디터에 지원되는 callback 및 jQuery 사용자 callback 를 정의 합니다.

- onInit
```
// onInit callback
$('#Webeditor').webeditor({
  callbacks: {
    onInit: function() {
      console.log('webeditor is launched');
    }
  }
});

// webeditor.init
$('#Webeditor').on('webeditor.init', function() {
  console.log('webeditor is launched');
});

```
- onEnter
```
// onEnter callback
$('#Webeditor').webeditor({
  callbacks: {
    onEnter: function() {
      console.log('Enter/Return key pressed');
    }
  }
});

// webeditor.enter
$('#Webeditor').on('webeditor.enter', function() {
  console.log('Enter/Return key pressed');
});

```
- onPaste
		
```
// onPaste callback
$('#Webeditor').webeditor({
  callbacks: {
    onPaste: function(e) {
      console.log('Called event paste');
    }
  }
});

// webeditor.paste
$('#Webeditor').on('webeditor.paste', function(e) {
  console.log('Called event paste');
});

```

- onImageUpload
	- webEditor 컨포넌트는 기본적으로 base64 dataURL로 인코딩한 이미지 정보는 IMG tag에 넣어 본문 내용에 담고 있습니다. 만약 이미지를 서버로 upload시키고 해당 이미지 url만 본문에 삽입하고자 할때는 onImageUpload Callback를 활용하여 적용 할 수 있습니다.
	
```
// onImageUpload callback
    var postEditor = $("#Webeditor").webeditor({
        callbacks: {
            onImageUpload: function(files) {
                sendFile(files[0]);
            }
        }
    });
    function sendFile(file) {
    var formData = new FormData();
    formData.append("photo", file);
    var fileData = URL.createObjectURL(file);
    postEditor.webeditor('insertImage', fileData,function ($image) {
        $.ajax({
            url: "/photo/upload",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType:"json",
            type: 'POST',
            success: function(data){
                $image.attr('src', data.url);
            }
        });
    });
    }

```

## Setup
setup 자바스크립트에서 웹 에디터(WebEditor)의 기본 속성을 공통으로 설정합니다.

```
$a.setup('webeditor', {
		    height: 200,                 // set editor height
	        minHeight: null,             // set minimum height of editor
	        maxHeight: null
	    });	   
	   	
```

	
	
				