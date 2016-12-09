# Theme

## Theme

Alopex UI 에서 제공하는 7 가지 종류의 테마와 헬퍼 클래스, 레이아웃 그리드를 시각적으로 확인 할 수 있습니다.    

- defaut
- white
- white gradation
- dark
- dark gradation
- mustard
- sk

## Component

<div class="Divselect Float-right Margin-top-10" style="width: 150px;">
	<select id="themeSelect">
	    <option value="default">Defaut</option>
	    <option value="white">White</option>
	    <option value="white-gradation">White gradation</option>
	    <option value="dark">Dark</option>
	    <option value="dark-gradation">Dark gradation</option>
	    <option value="mustard">Mustard</option>
	    <option value="sk">SK</option>
	</select>
	<span ></span>
</div>

우측 셀렉트 박스에서 테마를 선택하고 아래 컴포넌트를 확인하세요.

<script>

	var refreshIframeHeight = function(elementId){
		setTimeout(function(){
			var iFrames = document.getElementsByTagName('iframe');
			for (var i = 0, j = iFrames.length; i < j; i++)
			{
				iFrames[i].style.height = ( iFrames[i].contentWindow.document.body.offsetHeight + 260 ) +  'px';
			}
		}, 500);
	}

	$('#themeSelect').change(function() {
		var $select = this;
		$($select).progress();
		var url = '../../dist/css/' + 'alopex-ui-' + $(this).val() + '.css'
		
		var iframeEl = $("#componentIframe")[0];
		var $iframeEl = $(iframeEl);

		$iframeEl.css('visibility', 'hidden');

		setTimeout(function(){
			$(iframeEl.contentWindow.document.head).find("[href*=alopex]").remove();
			if (document.createStyleSheet) {
		    	iframeEl.contentWindow.document.createStyleSheet(url);
			}
			else {
			    $(iframeEl.contentWindow.document.head).append('<link rel="stylesheet" type="text/css" href="' + url + '">');
			}
		
			$iframeEl.one("load", refreshIframeHeight);
			
			setTimeout(function(){
				$iframeEl.css('visibility', 'visible');

				$($select).progress().remove();
			}, 1200);
			
		}, 100);

	});
</script>

<iframe id="componentIframe" src="theme/component.html" width="100%" height="12000px" style="border: 2px; margin: 0px;" onload="refreshIframeHeight('componentIframe');"></iframe>


## Helpers
Alopex에서는 화면 개발 시 빈번이 사용되는 CSS를 클래스로 작성하여 제공하고 있습니다. 

### Position
- `.Pos-abs` {position: absolute;}
- `.Pos-rel` {position: relative;}
- `.Pos-fix` {position: fix;}

### Box Model

- `.Float-left` {float: left;}
- `.Float-right` {float: right;}
- `.Overflow-hid` {overflow: hidden;}
- `.Overflow-x` {overflow-x: auto;}
- `.Overflow-y` {overflow-y: auto;}
- `.Display-none` {display: none;}
- `.Display-inblock` {display: inline-block}
- `.Display-inline` {display: inline}
- `.Display-block` {display: block}
- `.Valign-top` {vertical-align: top}
- `.Valign-md` {vertical-align: middle}
- `.Valign-bot` {vertical-align: bottom}

### Font Style

- `.Text-underline` {text-decoration: underline}
- `.Text-through` {text-decoration: line-through}
- `.Text-none` {text-decoration: none}
- `.Text-left` {text-align: left}
- `.Text-right` {text-align: right}
- `.Text-center` {text-align: center}
- `.Font-normal` {font-weight: normal}
- `.Font-bold` {font-weight: bold}
- `.Font-italic` {font-style: italic}
- `.Font-big` {font-size: 20px}
- `.Font-small` {font-size: 11px}

### Width
5%~100%까지 5단위로 정의 되어있습니다.

- `.Width-5` {width: 5%} ~ `.Width-100` {width: 100%}

### Margin/Padding
left/right/top/bottom으로 분류되며 5px~100px까지 5단위로 정의되어 있습니다.

- `.Padding-left-5` {padding-left: 5px} ~ `.Padding-left-100` {padding-left: 100px}
- `.Margin-left-5` {margin-left: 5px} ~ `.Padding-left-100` {margin-left: 100px}

### Symbolic Class
Alopex에서는 일반적이고 공통적인 UX(User Experience)를 표현할 수 있는 클래스를 제공합니다. 

- Default (일반)
- Confirm (확인)
- Success (성공, 완료)
- Warning (경고)
- Danger (위험, 삭제)
				
위와 같은 Symbolic Class를 적용할 수 있는 Component는 다음과 같습니다.

<iframe id="symboblicClassIframe" src="theme/symbolic.html" width="100%" style="border: 2px; margin: 0px;" onload="refreshIframeHeight('symboblicClassIframe');"></iframe>

## Layout Grid


<iframe id="gridSystemIframe" src="theme/grid.html" width="100%"  style="border: 2px; margin: 0px; "></iframe>


## Download
테마, 헬퍼, 레이아웃 그리드는 하나의 css파일을 적용함으로써 사용이 가능합니다.
아래 버튼을 통해 alopex-theme를 다운 받아 원하는 테마의 CSS를 사용하세요.

<a class="Button" href="../dist/css/alopexui-theme.zip">Theme Download</a>
