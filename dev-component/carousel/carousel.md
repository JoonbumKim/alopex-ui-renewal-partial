# Carousel

## Basic

Carousel은 여러 페이지가 가로로 나열되어 좌우로 이동하며 페이지를 보여주는 컴포넌트입니다.
각 페이지는 class="Page" 속성값을 통해 지정합니다. 페이지는 Carousel 컴포넌트의 크기와 동일하게 적용됩니다.
>단, Carousel 컴포넌트는 모바일 기기에서 사용시 위아래 스크롤 기능이 제한됩니다.


Carousel의 크기는 CSS에서 너비와 높이를 지정함으로 조정할 수 있습니다. 이미지의 사이즈에 맞추어 아래와 같이 예제의 Carousel의 크기를 지정합니다.

<style>
.Carousel {width:910px;height:576px;}
</style>
```
<style>
.Carousel {width:910px;height:576px;}
</style>
```

### Basic Sample

Carousel의 기본 마크업입니다.
`Carousel' 클래스 및 Page 클래스의 크기를 조정하여 원하는 크기를 지정합니다.  

```
<div class="Carousel">
	<div class="Scroller">
		<div class="Page">
			<img src="carousel/img/1.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/2.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/3.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/4.jpg"/>
		</div>
	</div>
</div>

```


<div class="Carousel">
	<div class="Scroller">
		<div class="Page">
			<img src="carousel/img/1.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/2.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/3.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/4.jpg"/>
		</div>
	</div>
</div>



   
  

### Optional Buttons

Carousel 내부에 좌우 이동 버튼 및 페이지바를 추가할 수 있습니다.


```
<div id="carousel" class="Carousel">
	<div class="Scroller">
		<div class="Page">
			<!-- 1st page -->
		</div>
		<div class="Page">
			<!-- 2nd page -->
		</div>
	</div>
	<a class="Prev"></a>
	<a class="Next"></a>
</div>
```

<div id="carousel" class="Carousel">
	<div class="Scroller">
		<div class="Page">
			<img src="carousel/img/1.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/2.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/3.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/4.jpg"/>
		</div>
	</div>
	<a class="Prev"></a>
	<a class="Next"></a>
</div>




### Paging 표시

`Carousel` 내에 `Paging`를 추가하여 현재 보여지는 페이지의 정보를 표시합니다.
'Paging' 클래스를 활용하여 위치 및 모양을 변경할 수 있습니다.

```
<div id="carousel" class="Carousel">
	<div class="Scroller">
		<div class="Page">
			<!-- 1st page -->
		</div>
		<div class="Page">
			<!-- 2nd page -->
		</div>
	</div>
	<a class="Prev"></a>
	<a class="Next"></a>
	<div class="Paging Mobile">
	    <a class="Link">1</a>
	    <a class="Link Selected">2</a>
	    <a class="Link">3</a>
	    <a class="Link">3</a>
	</div>
</div>
``` 

<div id="carousel" class="Carousel">
	<div class="Scroller">
		<div class="Page">
			<img src="carousel/img/1.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/2.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/3.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/4.jpg"/>
		</div>
	</div>
	<a class="Prev"></a>
	<a class="Next"></a>
	<div class="Paging Mobile">
	    <a class="Link">1</a>
	    <a class="Link Selected">2</a>
	    <a class="Link">3</a>
	    <a class="Link">3</a>
	</div>
</div>




 
## Attributes
 

### data-role
- "page"
	-  Carousel 컴포넌트의 단위인 page를 지정합니다.
- "prev"
	-  이전 페이지로 이동하는 버튼을 지정합니다.
- "next"
	-  이전 페이지로 이동하는 버튼을 지정합니다.
- "pagination"
	-  Carousel 컴포넌트의 현재 페이지 정보를 나타내는 컴포넌트를 지정합니다.
	
```
<div class="Carousel">
	<div class="Page"></div>
	<div class="Page"></div>
	
	<a data-role="prev"></a>
	<a data-role="next"></a>
	<div data-role="pagination"></div>
</div>
```


### data-autoSlidemode
carousel autoSlide 기능을 설정하고자 할 때 사용합니다. 디폴트는 'false'입니다.

- "true"
    -  Carousel의  data-autoSlideDuration에 설정된 시간으로 자동 슬라이딩 합니다.

    
```
<div id="carousel" class="Carousel"  data-autoSlidemode="true" data-autoSlideDuration="5000">
    <div class="Scroller">
        <div class="Page">
            <img src="carousel/img/1.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/2.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/3.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/4.jpg"/>
        </div>
    </div>
    <a class="Prev"></a>
    <a class="Next"></a>
    <div class="Paging Mobile">
        <a class="Link">1</a>
        <a class="Link Selected">2</a>
        <a class="Link">3</a>
        <a class="Link">3</a>
    </div>
</div>
```
<div id="carousel" class="Carousel"  data-autoSlidemode="true" data-autoSlideDuration="5000">
    <div class="Scroller">
        <div class="Page">
            <img src="carousel/img/1.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/2.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/3.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/4.jpg"/>
        </div>
    </div>
    <a class="Prev"></a>
    <a class="Next"></a>
    <div class="Paging Mobile">
        <a class="Link">1</a>
        <a class="Link Selected">2</a>
        <a class="Link">3</a>
        <a class="Link">3</a>
    </div>
</div>

### data-autoSlideDuration
Carousel의 autoSlide기능 동작 시간을 ms(millisecond)단위로 설정 합니다.<br>

- {number}
	- data-autoSlideDuration은 data-autoSlidemode가 'true'일 경우에만 동작 합니다.
	- data-autoSlidemode가 'true' 일 경우 data-autoSlideDuration를 설정하지 않으면 4000이 디폴트로 적용 됩니다. 


### data-playControlButton

- "true"
	- Carousel slide 기능을 잠시 멈추거나 다시 play할 수 있는 버튼의 노출 설정을 설정합니다. 
	- playControlButton은 Paging영역에 생성되므로 Paging가 노출 되어 있어야 생성 됩니다.



    
```
<div id="carousel" class="Carousel"  data-playControlButton="true"  data-autoSlidemode="true" data-autoSlideDuration="3000">
    <div class="Scroller">
        <div class="Page">
            <img src="carousel/img/1.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/2.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/3.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/4.jpg"/>
        </div>
    </div>
    <a class="Prev"></a>
    <a class="Next"></a>
    <div class="Paging Mobile">
        <a class="Link">1</a>
        <a class="Link Selected">2</a>
        <a class="Link">3</a>
        <a class="Link">3</a>
    </div>
</div>
```
<div id="carousel" class="Carousel" data-playControlButton="true"  data-autoSlidemode="true" data-autoSlideDuration="3000">
    <div class="Scroller">
        <div class="Page">
            <img src="carousel/img/1.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/2.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/3.jpg"/>
        </div>
        <div class="Page">
            <img src="carousel/img/4.jpg"/>
        </div>
    </div>
    <a class="Prev"></a>
    <a class="Next"></a>
    <div class="Paging Mobile">
        <a class="Link">1</a>
        <a class="Link Selected">2</a>
        <a class="Link">3</a>
        <a class="Link">3</a>
    </div>
</div>

### data-swipemode
Carousel 컴포넌트의 기본 기능인 swipe 기능(화면을 미는 동작에 의해 슬라이딩되는 동작)을 설정하고자 할 때 사용합니다. 디폴트는 "true"입니다.

- "false"
    - Carousel 컴포넌트의 swipe 기능(화면을 미는 동작에 의해 슬라이딩되는 기능)을 사용하지 않습니다. 

<style>
#swipemode {width:455px;height:288px;}
</style>
    
<div class="eg">
<div class="egview">
	<div class="Carousel" data-swipemode="false" id="swipemode">
	    <div class="Scroller">
			<div class="Page">
				<img src="carousel/img/1.jpg"/>
			</div>
			<div class="Page">
				<img src="carousel/img/2.jpg"/>
			</div>
			<div class="Page">
				<img src="carousel/img/3.jpg"/>
			</div>
			<div class="Page">
				<img src="carousel/img/4.jpg"/>
			</div>
	    </div>
	   	<a class="Prev"></a>
	    <a class="Next"></a>
	    <div class="Paging Mobile">
	        <a class="Link Selected">1</a>
	        <a class="Link">2</a>
	        <a class="Link">3</a>
	        <a class="Link">3</a>
	    </div>
	</div>
</div>
```
<div class="Carousel" data-swipemode="false">
    <div class="Scroller">
		<div class="Page">
			<img src="carousel/img/1.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/2.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/3.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/4.jpg"/>
		</div>
    </div>
   	<a class="Prev"></a>
    <a class="Next"></a>
    <div class="Paging Mobile">
        <a class="Link Selected">1</a>
        <a class="Link">2</a>
        <a class="Link">3</a>
        <a class="Link">3</a>
    </div>
</div>
```
</div>
    

## Functions


### .prevSlide ()

이전 carousel 페이지를 동적으로 선택합니다.

### .nextSlide ()

다음 carousel 페이지를 동적으로 선택합니다.


### .setIndex (index)

index로 carousel 페이지를 동적으로 선택합니다.

- parameter
	- index {number} required
		- carousel 페이지를 동적으로 선택합니다.

### .stopAutoSlide ()

동작하고 있는 autoSlide기능을  중지 합니다.

### .startAutoSlide ()

autoSlide기능을  동작 합니다.

### .setAutoSlideDuration (duration)

autoSlide기능의 동작 시간을 설정 합니다. 

- parameter
    - duration {number} required
        - autoSlide 기능의 동작 시간을 ms(millisecond)단위로 설정 합니다.
        
### .setSwipe (isSwipe)

- parameter
    - isSwipe {boolean} required
        - Carousel 컴포넌트의 swipe 기능(화면을 미는 동작에 의해 슬라이딩되는 동작)의 사용 여부를 설정 합니다. 

<style>
#carousel_swipe {width:455px;height:288px;}
</style>
      
<div class="eg">
<div class="egview">
	<button class="Button" id="setSwipe_true">setSwipe(true)</button>
	<button class="Button" id="setSwipe_false">setSwipe(false)</button>
	<div class="Carousel"  id="carousel_swipe">
	    <div class="Scroller">
			<div class="Page">
				<img src="carousel/img/1.jpg"/>
			</div>
			<div class="Page">
				<img src="carousel/img/2.jpg"/>
			</div>
			<div class="Page">
				<img src="carousel/img/3.jpg"/>
			</div>
			<div class="Page">
				<img src="carousel/img/4.jpg"/>
			</div>
	    </div>
	   	<a class="Prev"></a>
	    <a class="Next"></a>
	    <div class="Paging Mobile">
	        <a class="Link Selected">1</a>
	        <a class="Link">2</a>
	        <a class="Link">3</a>
	        <a class="Link">3</a>
	    </div>
	</div>
<div>
```
<button class="Button" id="setSwipe_true">setSwipe(true)</button>
<button class="Button" id="setSwipe_false">setSwipe(false)</button>
<div class="Carousel"  id="carousel_swipe">
    <div class="Scroller">
		<div class="Page">
			<img src="carousel/img/1.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/2.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/3.jpg"/>
		</div>
		<div class="Page">
			<img src="carousel/img/4.jpg"/>
		</div>
    </div>
   	<a class="Prev"></a>
    <a class="Next"></a>
    <div class="Paging Mobile">
        <a class="Link Selected">1</a>
        <a class="Link">2</a>
        <a class="Link">3</a>
        <a class="Link">3</a>
    </div>
</div>
```
```
$("#setSwipe_true").on("click", function(){
	$("#carousel_swipe").setSwipe(true);
});
$("#setSwipe_false").on("click", function(){
	$("#carousel_swipe").setSwipe(false);
});
```
</div>
<script>
$(document).on("mdload", function(){
	$("#setSwipe_true").on("click", function(){
		$("#carousel_swipe").setSwipe(true);
	});
	$("#setSwipe_false").on("click", function(){
		$("#carousel_swipe").setSwipe(false);
	});
});
</script>

