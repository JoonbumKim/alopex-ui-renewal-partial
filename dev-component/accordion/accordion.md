# Accordion

## Basic

Accordion은 리스트를 접기/펼치기 형태로 보여주는 컴포넌트 입니다.

<div class="eg">
<div class="egview">
<div>
	<ul id="accordion1" class="Accordion">
	    <li>
	    	<a>Another List Content</a>
        	<ul>
            	<li><a>Child #1</a></li>
            	<li><a>Child #2</a></li>
				<li>
					<a>Nested Accordion Example</a>
					<ul>
	        	    	<li><a>G Child #1</a></li>
	        	    	<li><a>G Child #2</a></li>
						<li><a>G Child #3</a></li>            
					</ul>
				</li>            
			</ul>
		</li>
		<li>
	    	<a>Div Content</a>
        	<div>
        		<p>Any Content in Dev can be inserted into accordion like this example.</p>
        		<p>Default Style in this area has nothing</p>
        	</div>
		</li>
	</ul>
</div></div>
```
<div>
	<ul class="Accordion">
	    <li>
	    	<a>Another List Content</a>
        	<ul>
            	<li><a>Child #1</a></li>
            	<li><a>Child #2</a></li>
				<li>
					<a>Nested Accordion Example</a>
					<ul>
	        	    	<li><a>G Child #1</a></li>
	        	    	<li><a>G Child #2</a></li>
						<li><a>G Child #3</a></li>            
					</ul>
				</li>            
			</ul>
		</li>
		<li>
	    	<a>Div Content</a>
        	<div>
        		<p>Any Content in Dev can be inserted into accordion like this example.</p>
        		<p>Default Style in this area has nothing</p>
        	</div>
		</li>
	</ul>
</div>
```
</div>
> 마크업상 &lt;a&gt; 태그로 Accordion 제목을 보여주기 때문에 &lt;a&gt;에 적당한 제목을 입력하여 주시기 바랍니다.

## Functions

### .expand

- type
	- .expand(integer)


- parameter
	- index: 버튼 인덱스 (노드 depth와 상관 없이 자식이 있는 li 태그에 순차적으로 index 정해짐)

### .collapse

Accordion 특정 버튼 하위의 내용을 감추는 함수입니다.

- parameter
	- index: 버튼 인덱스 (노드 depth와 상관 없이 자식이 있는 li 태그에 순차적으로 index 정해짐)

### .expandAll

Accodion의 모든 내용을 보여주는 함수입니다.

### .collapseAll

Accodion의 모든 내용을 감추는 함수입니다.

<div class="eg">
<div class="egview">
<label>index: <input id="idx" class="Textinput" value="0"></label>
<button id="btn_expand" class="Button">Expand</button>
<button id="btn_collapse" class="Button">Collapse</button>
<button id="btn_expandAll" class="Button">ExpandAll</button>
<button id="btn_collapseAll" class="Button">CollapseAll</button>
<p>(뎁스2에 해당하는 index를 열면 뎁스1이 열림)</p>
<p>(뎁스2에 해당하는 index를 닫으면 하위 뎁스(뎁스 3, 뎁스4, ...) 리스트가 모두 닫힘)</p>
<div>
	<ul id="accordion2" class="Accordion">
	    <li>
	    	<a>뎁스 1 (index 0)</a>
        	<ul>
            	<li><a>뎁스 2 </a></li>
            	<li><a>뎁스 2 </a></li>
							<li>
								<a>뎁스 2 (index 1)</a>
								<ul>
	        	    	<li><a>뎁스 3</a></li>
	        	    	<li><a>뎁스 3 (index 2)</a>
										<ul>
											<li><a>뎁스4</a></li>
											<li><a>뎁스4</a></li>
											<li><a>뎁스4</a></li>
										</ul>
									</li>
						<li><a>뎁스 3</a></li>            
					</ul>
				</li>            
			</ul>
		</li>
		<li>
	    	<a>뎁스  1 (index 3)</a>
        	<div>
        		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam velit numquam ad cum quaerat iure nihil ab dicta, in ipsum.</p>
        		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, modi!</p>
        	</div>
		</li>
	</ul>
</div></div>

```
<label>index: <input id="idx" class="Textinput" value="0"></label>
<button id="btn_expand" class="Button">Expand</button>
<button id="btn_collapse" class="Button">Collapse</button>
<button id="btn_expandAll" class="Button">ExpandAll</button>
<button id="btn_collapseAll" class="Button">CollapseAll</button>
<p>(뎁스1이 접혀있으면 뎁스2에 해당하는 index를 열거나 닫아도 보이지 않음)</p>
<div>
	<ul id="accordion2" class="Accordion">
	    <li>
	    	<a>뎁스 1  (index 0)</a>
        	<ul>
            	<li><a>뎁스 2 </a></li>
            	<li><a>뎁스 2 </a></li>
				<li>
					<a>뎁스 2 (index 1)</a>
					<ul>
	        	    	<li><a>뎁스 3</a></li>
	        	    	<li><a>뎁스 3</a></li>
						<li><a>뎁스 3</a></li>            
					</ul>
				</li>            
			</ul>
		</li>
		<li>
	    	<a>뎁스1 (index 2)</a>
        	<div>
        		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam velit numquam ad cum quaerat iure nihil ab dicta, in ipsum.</p>
        		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, modi!</p>
        	</div>
		</li>
	</ul>
</div>
```
```
$('#btn_expand').on('click', function(){
    var index = parseInt($('#idx').val());
	$('#accordion2').expand(index);
});

$('#btn_collapse').on('click', function(){
    var index = parseInt($('#idx').val());
	$('#accordion2').collapse(index);
});

$('#btn_expandAll').on('click', function(){
	$('#accordion2').expandAll();
});

$('#btn_collapseAll').on('click', function(){
	$('#accordion2').collapseAll();
});
```
</div>

<script>
$('#btn_expand').on('click', function(){
    var index = parseInt($('#idx').val());
	$('#accordion2').expand(index);
});

$('#btn_collapse').on('click', function(){
    var index = parseInt($('#idx').val());
	$('#accordion2').collapse(index);
});

$('#btn_expandAll').on('click', function(){
	$('#accordion2').expandAll();
});

$('#btn_collapseAll').on('click', function(){
	$('#accordion2').collapseAll();
});
</script>

### .expandByMenuId

Accordion 의 특정 메뉴를 열어주는 함수 입니다.  
li 요소의 자식 요소로 펼칠 수 있는 ul 요소가 있는 경우에 동작합니다.  

- parameter
	- {String} Required  
		- data-menuid 의 값과 일치하는 메뉴(li)를 열어줍니다.

### .collapseByMenuId

Accordion 의 특정 메뉴를 닫아주는 함수 입니다.  
li 요소의 자식 요소로 닫을 수 있는 ul 요소가 있는 경우에 동작합니다.  

- parameter
	- {String} Required  
		- data-menuid 의 값과 일치하는 메뉴(li)를 닫아줍니다.

<div class="eg">
<div class="egview">
	<label for="menuId">MenuId</label>
	<select class="Select" id="menuId">
		<option value="Menu01">Menu01</option>
		<option value="Menu01A">Menu01A</option>
		<option value="Menu02">Menu02</option>
		<option value="Menu03">Menu03</option>
	</select>
	<button class="Button" id="expandByMenuId">expandByMenuId</button>
	<button class="Button" id="collapseByMenuId">collapseByMenuId</button>
	<p></p>
	<ul id="menuIdSample" class="Accordion">
		<li data-menuid="Menu01">
			<a>Menu01</a>
			<ul>
				<li data-menuid="Menu01A">
					<a>Menu01A</a>
					<ul>
						<li data-menuid="Menu01Aa"><a>Menu01Aa</a></li>
						<li data-menuid="Menu01Ab"><a>Menu01Ab</a></li>
					</ul>
				</li>
				<li data-menuid="Menu01B"><a>Menu01B</a></li>
				<li data-menuid="Menu01C"><a>Menu01C</a></li>
			</ul>
		</li>
		<li data-menuid="Menu02">
			<a>Menu02</a>
			<ul>
				<li data-menuid="Menu02A"><a>Menu02A</a></li>
				<li data-menuid="Menu02B"><a>Menu02B</a></li>
				<li data-menuid="Menu02C"><a>Menu02C</a></li>
			</ul>
		</li>
		<li data-menuid="Menu03">
			<a>Menu03</a>
			<ul>
				<li data-menuid="Menu03A"><a>Menu03A</a></li>
				<li data-menuid="Menu03B"><a>Menu03B</a></li>
				<li data-menuid="Menu03C"><a>Menu03C</a></li>
			</ul>
		</li>
	</ul>
</div>
```
<label for="menuId">MenuId</label>
<select class="Select" id="menuId">
	<option value="Menu01">Menu01</option>
	<option value="Menu01A">Menu01A</option>
	<option value="Menu02">Menu02</option>
	<option value="Menu03">Menu03</option>
</select>
<button class="Button" id="expandByMenuId">expandByMenuId</button>
<button class="Button" id="collapseByMenuId">collapseByMenuId</button>
<p></p>
<ul id="menuIdSample" class="Accordion">
	<li data-menuid="Menu01">
		<a>Menu01</a>
		<ul>
			<li data-menuid="Menu01A">
				<a>Menu01A</a>
				<ul>
					<li data-menuid="Menu01Aa"><a>Menu01Aa</a></li>
					<li data-menuid="Menu01Ab"><a>Menu01Ab</a></li>
				</ul>
			</li>
			<li data-menuid="Menu01B"><a>Menu01B</a></li>
			<li data-menuid="Menu01C"><a>Menu01C</a></li>
		</ul>
	</li>
	<li data-menuid="Menu02">
		<a>Menu02</a>
		<ul>
			<li data-menuid="Menu02A"><a>Menu02A</a></li>
			<li data-menuid="Menu02B"><a>Menu02B</a></li>
			<li data-menuid="Menu02C"><a>Menu02C</a></li>
		</ul>
	</li>
	<li data-menuid="Menu03">
		<a>Menu03</a>
		<ul>
			<li data-menuid="Menu03A"><a>Menu03A</a></li>
			<li data-menuid="Menu03B"><a>Menu03B</a></li>
			<li data-menuid="Menu03C"><a>Menu03C</a></li>
		</ul>
	</li>
</ul>
```
```

$(expandByMenuId).on('click', function(){
	var val = $(menuId).getValues();
	$(menuIdSample).expandByMenuId(val[0]);
});
$(collapseByMenuId).on('click', function(){
	var val = $(menuId).getValues();
	$(menuIdSample).collapseByMenuId(val[0]);
});

```
</div>
<script>
$(document).on('mdload', function(){
	$(expandByMenuId).on('click', function(){
			var val = $(menuId).getValues();
			$(menuIdSample).expandByMenuId(val[0]);
	});
	$(collapseByMenuId).on('click', function(){
			var val = $(menuId).getValues();
			$(menuIdSample).collapseByMenuId(val[0]);
	});
});
</script>
