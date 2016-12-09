# List


## Basic
List 컴포넌트는 목록을 보여주기 위해 사용하는 컴포넌트입니다. `class` 값은 `List`입니다.

### 기본 리스트

기본 List 컴포넌트입니다.

<div class="eg">
<div class="egview"> 
<ul class="List">
	<li>item 1</li>
	<li>item 2</li>
	<li>item 3</li>
</ul>
</div>

```
<ul class="List">
	<li>item 1</li>
	<li>item 2</li>
	<li>item 3</li>
</ul>
```
</div>

### Link

List row에 특정 링크를 사용하고 싶다면 &lt;a&gt; 태그를 추가합니다.
&lt;a&gt; 태그가 추가된 List row는 사용자의 반응(마우스를 올려놓을 경우, 클릭할 경우) 스타일이 변경됩니다.

<div class="eg">
<div class="egview"> 
<ul class="List">
	<li class="Link"><a href="#0">item 1</a></li>
	<li class="Link"><a href="#0">item 2</a></li>
	<li class="Link"><a href="#0">item 3</a></li>
</ul>
</div>

```
<ul class="List">
	<li class="Link"><a href="#0">item 1</a></li>
	<li class="Link"><a href="#0">item 2</a></li>
	<li class="Link"><a href="#0">item 3</a></li>
</ul>
```
</div>

### Divider

Alopex UI list 컴포넌트 내에 리스트들간 구분을 해주는 divider를 사용하는 것을 명시합니다.

<div class="eg">
<div class="egview"> 
<ul class="List">
	<li class="Divider">A</li>
	<li class="Link"><a>Android</a></li>
	<li class="Link"><a>Apple</a></li>
	<li class="Divider">B</li>
	<li class="Link"><a>BMW</a></li>
	<li class="Link"><a>Blockbuster</a></li>
</ul>
</div>
```
<ul class="List">
	<li class="Divider">A</li>
	<li class="Link"><a>Android</a></li>
	<li class="Link"><a>Apple</a></li>
	<li class="Divider">B</li>
	<li class="Link"><a>BMW</a></li>
	<li class="Link"><a>Blockbuster</a></li>
</ul>
```
</div>


### Thumbnail Image

일반적 리스트에서 Thumbnail 이미지를 추가합니다. 
img 태그를 li 태그 내부에 넣어서 사용하면 됩니다. 이때 첫번째 img 태그를 thumbnail 이미지로 간주하게 됩니다.

<div class="eg">
<div class="egview">
<ul class="List">
	<li class="Link"><a><img class="Thumbnail" src="list/image/icon1.png"><span>Crown</span></a></li>
	<li class="Link"><a><img class="Thumbnail" src="list/image/icon2.png"><span>Camera</span></a></li>
	<li class="Link"><a><img class="Thumbnail" src="list/image/icon3.png"><span>MP3 Player</span></a></li>
	<li class="Link"><a><img class="Thumbnail" src="list/image/icon4.png"><span>Mac Mini</span></a></li>
</ul>
</div>
```
<ul class="List">
	<li class="Link"><a><img class="Thumbnail" src="list/image/icon1.png"><span>Crown</span></a></li>
	<li class="Link"><a><img class="Thumbnail" src="list/image/icon2.png"><span>Camera</span></a></li>
	<li class="Link"><a><img class="Thumbnail" src="list/image/icon3.png"><span>MP3 Player</span></a></li>
	<li class="Link"><a><img class="Thumbnail" src="list/image/icon4.png"><span>Mac Mini</span></a></li>
</ul>
```
</div>

Thumbnail 과 함께  Small를 사용하면  작은 이미지를 적용할 수 있습니다. 
Default size: (50px X 50px), Small size: (16px X 16px)

<div class="eg">
<div class="egview">
<ul class="List">
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/de.png"><span>Germany</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/fi.png"><span>Finland</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/gb.png"><span>Great Britain</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/gf.png"><span>France</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/de.png"><span>Germany</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/fi.png"><span>Finland</span></a>
	</li>
</ul>
</div>
```
<ul class="List">
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/de.png"><span>Germany</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/fi.png"><span>Finland</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/gb.png"><span>Great Britain</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/gf.png"><span>France</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/de.png"><span>Germany</span></a>
	</li>
	<li class="Link">
		<a><img class="Thumbnail Small" src="list/image/fi.png"><span>Finland</span></a>
	</li>
</ul>
```
</div>

## Functions


### .refresh()

리스트 내에 동적으로 element가 추가될 경우 사용하는 함수입니다.
<style>
/* #list1 li,#list1 li a  {color: red} */
</style>
<div class="eg">
<div class="egview"> 
<ul class="List" id="list1">
	<li>item 1</li>
	<li>item 2</li>
	<li>item 3</li>
</ul>
<button id="btn_append" class="Button">추가</button>
<button id="btn_refresh" class="Button">refresh()</button>
</div>
```
<ul class="List">
	<li>item 1</li>
	<li>item 2</li>
	<li>item 3</li>
</ul>
<button id="btn_append" class="Button">추가</button>
<button id="btn_refresh" class="Button">refresh()</button>
```
```
$("#btn_append").on("click", function (){
	$('#list1').append('<li><a><img class="Thumbnail Small" src="list/image/de.png">Germany</a></li>');
});
// append 등 UI 변경 발생 시, 변경이 반영 되지 않을 경우에 사용
$("#btn_refresh").on("click", function (){
	$('#list1').refresh();
});
```
</div>

<script>
$("#btn_append").on("click", function (){
	$('#list1').append('<li><a><img class="Thumbnail Small" src="list/image/de.png">Germany</a></li>');
});
$("#btn_refresh").on("click", function (){
	$('#list1').refresh();
});
</script>

