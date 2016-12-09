
<script>
$(document).ready(function(){
	$('[class="Paging"]').bind('pagechange', function(e, page) {
	    var target = e.currentTarget;
	    //console.log(target.id + " == " + page);
	});
});
</script>


# Paging

## Basic
Paging 컴포넌트는 페이지 처리 기능을 제공하는 컴포넌트입니다.
<div class="eg">
<div class="egview">
<div class="Paging">
    <a class="Link">1</a>
    <a class="Link">2</a>
    <a class="Link">3</a> 
</div></div>

```
<div class="Paging">
    <a class="Link">1</a>
    <a class="Link">2</a>
    <a class="Link">3</a> 
</div>
```
</div>

### 선택 인덱스 설정

<div class="eg">
<div class="egview">
<div class="Paging">
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a> 
</div></div>
    
```
<div class="Paging">
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a> 
</div>
```
</div>
### 모바일 스타일
<div class="eg">
<div class="egview">
<div class="Paging Mobile">
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a>
</div></div>

```
<div class="Paging mobile">
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a>
</div>
```
</div>
### 마지막 페이지 지정.
<div class="eg">
<div class="egview">
<div id="p6" class="Paging" data-totalpage="19">
    <a class="Link Prev">이전</a>
    <a class="Link">1</a>
    <a class="Link ">2</a>
    <a class="Link Selected">3</a>
    <a class="Link Next">다음</a> 
</div></div>

```
<div id="p6" class="Paging" data-totalpage="19">
    <a class="Link Prev">이전</a>
    <a class="Link">1</a>
    <a class="Link ">2</a>
    <a class="Link Selected">3</a>
    <a class="Link Next">다음</a> 
</div>
```
</div>
### 이전 그룹 버튼, 이전 페이지 버튼
<div class="eg">
<div class="egview">
<div id="p6" class="Paging" data-totalpage="19">
    <a class="Link Prev-group"><span class="Icon Backward"></span></a>
    <a class="Link Prev"><span class="Icon Chevron-left"></span></a>
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a>
    <a class="Link Next"><span class="Icon Chevron-right"></span></a>
    <a class="Link Next-group"><span class="Icon Forward"></span></a>
</div></div>

```
<div id="p6" class="Paging" data-totalpage="19">
    <a class="Link Prev-group"><span class="Icon Backward"></span></a>
    <a class="Link Prev"><span class="Icon Chevron-left"></span></a>
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a>
    <a class="Link Next"><span class="Icon Chevron-right"></span></a>
    <a class="Link Next-group"><span class="Icon Forward"></span></a>
</div>
```
</div>
### 첫 페이지 버튼, 마지막 페이지 버튼
<div class="eg">
<div class="egview">
<div id="p6" class="Paging" data-totalpage="19" data-button-behavior="disable">
    <a class="Link First"><span class="Icon Step-backward"></span></a>
    <a class="Link Prev"><span class="Icon Chevron-left"></span></a>
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a>
    <a class="Link Next"><span class="Icon Chevron-right"></span></a>
    <a class="Link Last"><span class="Icon Step-forward"></span></a>
</div></div>

```
<div id="p6" class="Paging" data-totalpage="19" data-button-behavior="disable">
    <a class="Link First"><span class="Icon Step-backward"></span></a>
    <a class="Link Prev"><span class="Icon Chevron-left"></span></a>
    <a class="Link">1</a>
    <a class="Link Selected">2</a>
    <a class="Link">3</a>
    <a class="Link Next"><span class="Icon Chevron-right"></span></a>
    <a class="Link Last"><span class="Icon Step-forward"></span></a>
</div>
```
</div>

## Attributes



### class {string}

- "Paging"  
	- Alopex UI Paging 컴포넌트를 사용한다고 명시하는 속성입니다.
	

### data-totalpage {number}

최대 페이지 갯수를 설정합니다.

### data-maxpage {number}

한 화면에 보여질 페이지 갯수를 설정합니다.


## Functions

### .setSelectedPage (number)

페이지를 동적으로 선택합니다.

- parameter
	- number {number} Required
		- 선택하고자 하는 페이지

### .setTotalPage (number)

전체 페이지 수를 동적으로 설정합니다.

- parameter
	- number {number} Required
		- 설정하고자하는 전체 페이지 수


### .setMaxPage (number)

화면에 보여지는 페이지 수를 동적으로 설정합니다.

- parameter
	- number {number} Required
		- 설정하고자하는 화면 페이지 수


### .getSelectedPage ()

선택된 페이지를 가져옵니다.

- return 
	- page {number}
		선택된 페이지를 가져옵니다.

