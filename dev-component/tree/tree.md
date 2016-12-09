# Tree

## Basic

### 기본 트리

기본Tree 컴포넌트 입니다. ul > li > a 로 마크업 구조를 만들고 이를 감싸는 최상위 ul에   `class="Tree"` 를 명시합니다.

<div class="eg">
<div class="egview"> 
<ul class="Tree" data-checkbox="visible">
    <li>
        <span class="Arrow"></span> 
        <a> Tree Memu 1</a>
        <ul>
            <li><span class="Arrow"></span> 
                <a>Tree Memu 1-1</a>
                <ul>
                    <li>
                    	<span class="Arrow"></span> 
                        <a>Tree Memu 1-1-1</a>
                    </li>
                    <li>
                    	<span class="Arrow"></span> 
                        <a>Tree Memu 1-1-2</a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
</ul>
</div>
```
<ul class="Tree">
    <li>
        <span class="Arrow"></span> 
        <a> Tree Memu 1</a>
        <ul>
            <li><span class="Arrow"></span> 
                <a>Tree Memu 1-1</a>
                <ul>
                    <li>
                    	<span class="Arrow"></span> 
                        <a>Tree Memu 1-1-1</a>
                    </li>
                    <li>
                    	<span class="Arrow"></span> 
                        <a>Tree Memu 1-1-2</a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
</ul>
```
</div>

### 이미지 아이콘 트리

이미지 아이콘이 추가된 컴포넌트 입니다. 텍스트 앞에 &lt;img&gt; 태그로 이미지아이콘을 넣어줍니다.
<div class="eg">
<div class="egview">
<ul class="Tree" data-checkbox="visible">
    <li>
        <span class="Arrow"></span> 
        <a>
            <img src="tree/icon/windows/folder.png">icons
        </a>
        <ul>
            <li><span class="Arrow"></span> 
                <a>
                    <img src="tree/icon/windows/folder.png">Image
                </a>
                <ul>
                    <li><span class="Arrow"></span> 
                        <a>
                            <img src="tree/icon/windows/jpeg.png">jpg
                        </a>
                    </li>
                    <li><span class="Arrow"></span> 
                        <a>
                            <img src="tree/icon/windows/bmp.png">bmp
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
</ul>
</div>
```
<ul class="Tree">
    <li>
        <span class="Arrow"></span> 
        <a>
            <img src="tree/icon/windows/folder.png">Icons
        </a>
        <ul>
            <li><span class="Arrow"></span> 
                <a>
                    <img src="tree/icon/windows/folder.png">Image
                </a>
                <ul>
                    <li><span class="Arrow"></span> 
                        <a>
                            <img src="tree/icon/windows/jpeg.png">jpg
                        </a>
                    </li>
                    <li><span class="Arrow"></span> 
                        <a>
                            <img src="tree/icon/windows/bmp.png">bmp
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
</ul>
```
</div>
### Keyboard Support

Keyboard를 통해서 Tree의 동작을 제어할 수 있습니다. Key 정보는 아래와 같습니다.

 
|  Keyboard | 설명 | 비고 |
| -------- | --- | --- |
| Tab, Shift+Tab | Page 내의 다음, 이전 Element로 이동 | |
| ↑(Up), ↓(Down) | Tree 아이템 이동 |  |
| ←(Left), →(Right) | Tree 아이템 열기/닫기 |  |
| Home | Tree 최상위 노드로 이동 |  |
| End | 트리 마지막 노드(opened)로 이동 |  |


## Attributes


### data-checkbox

- "hidden"
	-  data-checkbox 속성을 지정하지 않을 시 hidden 상태로 인식됩니다.
- “visible”
	- checkbox 사용을 활성화합니다.
	
### data-source-type

- "flat" (default : "unflatten")
	- 계층 구조가 아닌 flat한 데이터 구조로 트리 컴포넌트를 구성하고자 할 때 사용합니다.  
	
<div class="eg">
<div class="egview">
<ul class="Tree" data-source-type="flat" id="flatTree"></ul>
```
<ul class="Tree" data-source-type="flat" id="flatTree"></ul>
```
```
var flatArr = [
	{"id": "1", "parentId": "","text": "Chocolate Beverage"}, 
	{"id": "2","parentId": "1","text": "Hot Chocolate"}, 
	{"id": "3","parentId": "1","text": "Peppermint Hot Chocolate"}, 
	{"id": "4","parentId": "1","text": "Salted Caramel Hot Chocolate"}, 
	{"id": "5","parentId": "1", "text": "White Hot Chocolate"}, 
	{"id": "6","parentId": "", "text": "Espresso Beverage"}, 
	{"id": "7","parentId": "6","text": "Caffe Americano"}, 
	{"id": "8","parentId": "6","text": "Caffe Latte"}
];
$("#flatTree").setDataSource(flatArr);
```
</div>
</div>
<script>
$(document).on("mdload", function(){
	var flatArr = [
		{"id": "1", "parentId": "","text": "Chocolate Beverage"}, 
		{"id": "2","parentId": "1","text": "Hot Chocolate"}, 
		{"id": "3","parentId": "1","text": "Peppermint Hot Chocolate"}, 
		{"id": "4","parentId": "1","text": "Salted Caramel Hot Chocolate"}, 
		{"id": "5","parentId": "1", "text": "White Hot Chocolate"}, 
		{"id": "6","parentId": "", "text": "Espresso Beverage"}, 
		{"id": "7","parentId": "6","text": "Caffe Americano"}, 
		{"id": "8","parentId": "6","text": "Caffe Latte"}
	];
	$("#flatTree").setDataSource(flatArr);
});
</script> 

### data-draggable 

- "true" (default : "false")
	- 트리 노드를  Drag & Drop 할 수 있습니다. (IE 10 이상)
	
<div class="eg">
<div class="egview"> 
	<ul class="Tree" data-draggable="true" id="dragTree">
	    <li>
	        <span class="Arrow"></span> 
	        <a> Tree Memu 1</a>
	        <ul>
	            <li><span class="Arrow"></span> 
	                <a>Tree Memu 1-1</a>
	                <ul>
	                    <li>
	                        <span class="Arrow"></span> 
	                        <a id="a">Tree Memu 1-1-1</a>
	                    </li>
	                    <li>
	                        <span class="Arrow"></span> 
	                        <a>Tree Memu 1-1-2</a>
	                    </li>
	                </ul>
	            </li>
	            <li><span class="Arrow"></span> 
	                <a>Tree Memu 2-1</a>
	                <ul>
	                    <li>
	                        <span class="Arrow"></span> 
	                        <a id="a">Tree Memu 2-1-1</a>
	                        <ul>
			                    <li>
			                        <span class="Arrow"></span> 
			                        <a id="a">Tree Memu 2-1-1-a</a>
			                    </li>
			                    <li>
			                        <span class="Arrow"></span> 
			                        <a>Tree Memu 2-1-1-b</a>
			                    </li>
			                </ul>
	                    </li>
	                    <li>
	                        <span class="Arrow"></span> 
	                        <a>Tree Memu 2-1-2</a>
	                    </li>
	                </ul>
	            </li>
	        </ul>
	    </li>
	</ul>
</div>
```
<div class="eg">
<div class="egview"> 
	<ul class="Tree" data-draggable="true" id="dragTree">
	    <li>
	        <span class="Arrow"></span> 
	        <a> Tree Memu 1</a>
	        <ul>
	            <li><span class="Arrow"></span> 
	                <a>Tree Memu 1-1</a>
	                <ul>
	                    <li>
	                        <span class="Arrow"></span> 
	                        <a id="a">Tree Memu 1-1-1</a>
	                    </li>
	                    <li>
	                        <span class="Arrow"></span> 
	                        <a>Tree Memu 1-1-2</a>
	                    </li>
	                </ul>
	            </li>
	            <li><span class="Arrow"></span> 
	                <a>Tree Memu 2-1</a>
	                <ul>
	                    <li>
	                        <span class="Arrow"></span> 
	                        <a id="a">Tree Memu 2-1-1</a>
	                        <ul>
			                    <li>
			                        <span class="Arrow"></span> 
			                        <a id="a">Tree Memu 2-1-1-a</a>
			                    </li>
			                    <li>
			                        <span class="Arrow"></span> 
			                        <a>Tree Memu 2-1-1-b</a>
			                    </li>
			                </ul>
	                    </li>
	                    <li>
	                        <span class="Arrow"></span> 
	                        <a>Tree Memu 2-1-2</a>
	                    </li>
	                </ul>
	            </li>
	        </ul>
	    </li>
	</ul>
</div>
```
</div>	
<script>
$(document).on("mdload", function(){
	$("#dragTree").expandAll();
});
</script>

## Functions


### .getNode(text, type)

트리 컴퍼넌트의 nodeObject를 가져오는 함수입니다.  
nodeObject 내부 정보는 노드를 생성할 때 저장한 정보 입니다.  
저장하지 않은 정보는 undefined 로 가져옵니다.     

- parameter
	- text {string} Required.
		- 노드 식별 정보
	- type {string} Required.
		- 첫 번째 parameter인 text 가 어떤 정보인지 표시. "id" or "text"
		
				
- return 
	- nodeObject
		- 선택된 트리 노드 정보
		- id
			- 선택된 노드의 id
		- parentId
			- 선택된 노드의 부모 노드 id
		- text
			- 선택된 노드의 text
		- node
			- 선택된 노드의 li element 객체
		- iconUrl
			- 선택된 노드의 아이콘 url
		- linkUrl
			- 선택된 노드의 링크 url
		- depth
			- 선택된 노드의 depth
		- data
			- 선택된 노드에 저장된 데이터(노드 생성 시 설정한 데이터)
			

### .getObject(text, type)

트리 컴퍼넌트의 각 node에 해당하는 li element를 가져오는 함수입니다.

- parameter
	- text {string} Required.
		- 노드를 가져올 데이터
	- type {string} Required.
		- text 가 어떤 정보인지 표시. "id" or "text"
	
- return 
	- node Element 
		- 노드 DOM 객체


### .getSelectedNode()

트리 내 현재 선택된 nodeObject를 리턴합니다.

- return 
	- nodeObject
		- 선택된 트리 노드 정보
		- id
			- 선택된 노드의 id
		- parentId
			- 선택된 노드의 부모 노드 id
		- text
			- 선택된 노드의 text
		- node
			- 선택된 노드의 li element 객체
		- iconUrl
			- 선택된 노드의 아이콘 url
		- linkUrl
			- 선택된 노드의 링크 url
		- depth
			- 선택된 노드의 depth
		- data
			- 선택된 노드에 저장된 데이터(노드 생성 시 설정한 데이터)
``` 
var node = $('#tree').getSelectedNode();
$('#tree').createNode(node, {
	text: 'node1',
	iconUrl: 'img/icon1.png'
});
```

### .setSelected(nodeObj)

주어진 트리 노드를 선택합니다.

- parameter
	- nodeObj
		- 선택될 트리 노드.

```
var node = $('#tree').getNode($('#text').val());
$('#tree').setSelected(node);
```


### .expand(nodeObj)

선택된 트리 노드가 자식 노드를 가지고 있을 경우 expand 합니다.

- parameter
	- nodeObj
		- expand될 트리 노드.

``` 
var node = $('#tree').getSelectedNode();
$('#tree').expand(node);
```

### .expandAll()

트리의 모든 노드를 expand합니다.


### .collapse(nodeObj)

선택된 트리 노드가 자식을 가지고 있을 경우 collapse 합니다.

- parameter
	- nodeObj
		- collapse될 트리 노드.
	
``` 
var node = $('#tree').getSelectedNode();
$('#tree').collapse(node);
```


### .collapseAll()

트리의 모든 노드를 collapse합니다.

### .toggleExpand()

선택된 노드가 자식을 가지고 있는 경우  collapse/expand를 toggle합니다.


### .createNode(parent, data)

트리 내 새로운 노드를 생성합니다.

- parameter
	- parent {nodeObject} Required
		- 새로운 노드의 상위 노드를 지정합니다. .getSelectedNode() 의 result와 동일한 타입.
	- data {object} Required.
		- 트리의 노드 데이터. JSON 타입
	
``` 
var node = $('#tree').getSelectedNode();
$('#tree').createNode(node, {
	text: 'node1',
	iconUrl: 'img/icon1.png'
});
```

<br />

<div class="eg">
	<div class="egview">
		<div class="Display-inblock Width-40 Valign-top">
			<ul id="tree2" class="Tree">
				<li id="Node1">
					<span class="Arrow"></span><a>Sports </a>
					<ul>
						<li id="Node1-1">
							<span class="Arrow"></span><a>Tennis</a>
						</li>
						<li id="Node1-2">
							<span class="Arrow"></span><a>Soccer</a>
						</li>
						<li id="Node1-3">
							<span class="Arrow"></span><a>Basketball</a>
						</li>
						<li>
							<span class="Arrow"></span><a>Baseball</a>
						</li>
						<li id="Node1-4">
							<span class="Arrow"></span><a>TableTennis</a>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<div class="Display-inblock Width-40">
			<button id="create_1" class="Button Margin-bottom-5">최상위 노드에 추가</button>
			<button id="create_2" class="Button Margin-bottom-5">선택된 노드에 추가</button>
			<button id="create_3" class="Button Margin-bottom-5">ID를 이용하여 노드에 추가</button>
			<button id="create_4" class="Button">TEXT를 이용하여 노드에 추가</button>
		</div>
	</div>
```
<div class="Display-inblock Width-40 Valign-top">
	<ul id="tree2" class="Tree">
		<li id="Node1">
			<span class="Arrow"></span><a>Sports </a>
			<ul>
				<li id="Node1-1">
					<span class="Arrow"></span><a>Tennis</a>
				</li>
				<li id="Node1-2">
					<span class="Arrow"></span><a>Soccer</a>
				</li>
				<li id="Node1-3">
					<span class="Arrow"></span><a>Basketball</a>
				</li>
				<li>
					<span class="Arrow"></span><a>Baseball</a>
				</li>
				<li id="Node1-4">
					<span class="Arrow"></span><a>TableTennis</a>
				</li>
			</ul>
		</li>
	</ul>
</div>
<div class="Display-inblock Width-40">
	<button id="create_1" class="Button Margin-bottom-5">최상위 노드에 추가</button>
	<button id="create_2" class="Button Margin-bottom-5">선택된 노드에 추가</button>
	<button id="create_3" class="Button Margin-bottom-5">ID를 이용하여 노드에 추가</button>
	<button id="create_4" class="Button">TEXT를 이용하여 노드에 추가</button>
</div>
```
```
var testData = {
	id : "HR1000",
	linkUrl : "http://www.hr.com",
	text : 'HR',
	iconUrl : 'tree/icon/windows/folder.png',
	items : [ {
		id : 'HR1001',
		text : '인력팀',
		iconUrl : 'tree/icon/windows/txt.png'
	}, {
		id : 'HR1002',
		text : '회계팀',
		iconUrl : 'tree/icon/windows/txt.png'
	} ]
};

$("#create_1").click(function() {
	$("#tree2").createNode("", testData);
});
$("#create_2").click(function() {
	var el = $("#tree2").getSelectedNode();
	$("#tree2").createNode(el, testData);
});
$("#create_3").click(function() {
	var el = $("#tree2").getNode("Node1-3", "id");
	$("#tree2").createNode(el, testData);
	$("#tree2").setSelected(el);
});
$("#create_4").click(function() {
	var el = $("#tree2").getNode("Tennis", "text");
	$("#tree2").createNode(el, testData);
	$("#tree2").setSelected(el);
});
```

</div>

<script>
var testData = {
	id : "HR1000",
	linkUrl : "http://www.hr.com",
	text : 'HR',
	iconUrl : 'tree/icon/windows/folder.png',
	items : [ {
		id : 'HR1001',
		text : '인력팀',
		iconUrl : 'tree/icon/windows/txt.png'
	}, {
		id : 'HR1002',
		text : '회계팀',
		iconUrl : 'tree/icon/windows/txt.png'
	} ]
};

$("#create_1").click(function() {
	$("#tree2").createNode("", testData);
});
$("#create_2").click(function() {
	var el = $("#tree2").getSelectedNode();
	$("#tree2").createNode(el, testData);
});
$("#create_3").click(function() {
	var el = $("#tree2").getNode("Node1-3", "id");
	$("#tree2").createNode(el, testData);
	$("#tree2").setSelected(el);
});
$("#create_4").click(function() {
	var el = $("#tree2").getNode("Tennis", "text");
	$("#tree2").createNode(el, testData);
	$("#tree2").setSelected(el);
});
</script>



### .editNode(node, data)

주어진 트리 노드의 정보를 수정합니다.

- parameter
	- node {nodeObject} Required
		- 수정될 노드 객체
	- data {object} Required.
		- 수정 데이터	

```
$('#tree').editNode(node, {
  /* data */
  id: "",
  text: editText,  // 변경할 텍스트
  iconUrl: ""
});
```

### .deleteNode(node)

주어진 트리 노드를 삭제합니다.

- parameter
	- nodeObj
		- 삭제될 트리 노드


<div class="eg">
<div class="egview">
	<div class="Display-inblock Width-50 Valign-top">
	<button id="btn_expandall" class="Button">expandAll()</button>
	<button id="btn_collapseall" class="Button">collapseAll()</button>
		<ul id="tree0" class="Tree Margin-top-10">
			<li>
				<span class="Arrow"></span><a>Premiere League</a>
				<ul>
					<li>
						<span class="Arrow"></span><a>Manchester United</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Manchester City</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Arsenal</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Liverpool</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Chelsea</a>
					</li>
				</ul>
			</li>
			<li>
				<span class="Arrow"></span><a>Serie A</a>
				<ul>
					<li>
						<span class="Arrow"></span><a>Juventus</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Lazio</a>
					</li>
					<li>
						<span class="Arrow"></span><a>AC Milan</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Inter Milan</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Napoli</a>
					</li>
				</ul>
			</li>
			<li>
				<span class="Arrow"></span><a>Primera Liga</a>
				<ul>
					<li>
						<span class="Arrow"></span><a>Barcelona</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Real Madrid</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Atletico Madrid</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Bilbao</a>
					</li>
					<li>
						<span class="Arrow"></span><a>Valencia</a>
					</li>
				</ul>
			</li>
		</ul>
	</div>
	<div class="Display-inblock Width-40">
		<label for="btn_text">Node Text for Selection</label>
		<input id="btn_text" type="text" class="Textinput" value="Serie A">
		<button id="btn_select" class="Button Margin-top-5 Margin-bottom-5" >.getNode() + setSelected(nodeObj)</button>
		<p>아래 기능은 먼저 노드를 선택해야 합니다.</p>
		<div class="Margin-bottom-5">
			<button id="btn_expand" class="Button">Expand Node</button>
			<button id="btn_collapse" class="Button">Collapse Node</button>
			<button id="btn_toggle" class="Button">Toggle Node</button>
		</div>
		<div class="Margin-bottom-5">
			<button id="btn_create" class="Button">createNode()</button>
			<button id="btn_edit" class="Button">Edit Node</button>
			<button id="btn_delete" class="Button">Delete Node</button>
		</div>
	</div>
</div>
```
<div class="Display-inblock Width-50 Valign-top">
	<button id="btn_expandall" class="Button">expandAll()</button>
	<button id="btn_collapseall" class="Button">collapseAll()</button>
	<ul id="tree0" class="Tree Margin-top-10">
		<li>
			<span class="Arrow"></span> <a>Premiere League</a>
			<ul>
				<li>
					<span class="Arrow"></span> <a>Manchester United</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Manchester City</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Arsenal</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Liverpool</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Chelsea</a>
				</li>
			</ul>
		</li>
		<li>
			<span class="Arrow"></span><a>Serie A</a>
			<ul>
				<li>
					<span class="Arrow"></span> <a>Juventus</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Lazio</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>AC Milan</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Inter Milan</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Napoli</a>
				</li>
			</ul>
		</li>
		<li>
			<span class="Arrow"></span> <a>Primera Liga</a>
			<ul>
				<li>
					<span class="Arrow"></span> <a>Barcelona</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Real Madrid</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Atletico Madrid</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Bilbao</a>
				</li>
				<li>
					<span class="Arrow"></span> <a>Valencia</a>
				</li>
			</ul>
		</li>
	</ul>
</div>
<div class="Display-inblock Width-40">
	<label for="btn_text">Node Text for Selection</label>
	<input id="btn_text" type="text" class="Textinput" value="Serie A">
	<button id="btn_select" class="Button Margin-top-5 Margin-bottom-5" >.getNode() + setSelected(nodeObj)</button>
	<p>아래 기능은 먼저 노드를 선택해야 합니다.</p>
	<div class="Margin-bottom-5">
		<button id="btn_expand" class="Button">Expand Node</button>
		<button id="btn_collapse" class="Button">Collapse Node</button>
		<button id="btn_toggle" class="Button">Toggle Node</button>
	</div>
	<div class="Margin-bottom-5">
		<button id="btn_create" class="Button">createNode()</button>
		<button id="btn_edit" class="Button">Edit Node</button>
		<button id="btn_delete" class="Button">Delete Node</button>
	</div>
</div>
```
```
  $('#btn_expandall').on('click', function() {
     $('#tree0').expandAll();
  });
  
  $('#btn_collapseall').on('click', function() {
     $('#tree0').collapseAll();
  });
  
  $('#btn_select').on('click', function() {
    var node = $('#tree0').getNode($('#btn_text').val());
    //console.log(node);
    $('#tree0').setSelected(node);
  });
  
  $('#btn_expand').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    if($.alopex.util.isValid(node)) {
      $('#tree0').expand(node);
    }
  });
   
  $('#btn_collapse').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    if($.alopex.util.isValid(node)) {
      $('#tree0').collapse(node);
    }
  });
  
  $('#btn_toggle').on('click', function(e){
    var node = $('#tree0').getSelectedNode();
    if($.alopex.util.isValid(node)) {
      $('#tree0').toggleExpand(node);
    }
  });
  
  $('#btn_create').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    var _text=prompt("Enter node text");
    if(_text != null && _text != '' && _text != undefined) {
      var data = {
          id: "",
          text: _text,
          depth : "1",
          data : "",
          iconUrl: ""
      };
      $('#tree0').createNode(node, data);
    }
  });
  
  $('#btn_edit').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    var editText=prompt("Enter node text", node.text);
    if(editText != null && editText != '' && editText != undefined) {
      var data = {
          id: "",
          text: editText,
          depth : "1",
          data : "",
          iconUrl: ""
      }
      $('#tree0').editNode(node, data);
    }
  });
  
  $('#btn_delete').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    $('#tree0').deleteNode(node);
  });
```
</div>
<script>

  $('#btn_expandall').on('click', function() {
     $('#tree0').expandAll();
  });
  
  $('#btn_collapseall').on('click', function() {
     $('#tree0').collapseAll();
  });
  
  $('#btn_select').on('click', function() {
    var node = $('#tree0').getNode($('#btn_text').val());
    //console.log(node);
    $('#tree0').setSelected(node);
  });
  
  $('#btn_expand').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    if($.alopex.util.isValid(node)) {
      $('#tree0').expand(node);
    }
  });
   
  $('#btn_collapse').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    if($.alopex.util.isValid(node)) {
      $('#tree0').collapse(node);
    }
  });
  
  $('#btn_toggle').on('click', function(e){
    var node = $('#tree0').getSelectedNode();
    if($.alopex.util.isValid(node)) {
      $('#tree0').toggleExpand(node);
    }
  });
  
  $('#btn_create').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    var _text=prompt("Enter node text");
    if(_text != null && _text != '' && _text != undefined) {
      var data = {
          id: "",
          text: _text,
          depth : "1",
          data : "",
          iconUrl: ""
      };
      $('#tree0').createNode(node, data);
    }
  });
  
  $('#btn_edit').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    var editText=prompt("Enter node text", node.text);
    if(editText != null && editText != '' && editText != undefined) {
      var data = {
          id: "",
          text: editText,
          depth : "1",
          data : "",
          iconUrl: ""
      }
      $('#tree0').editNode(node, data);
    }
  });
  
  $('#btn_delete').on('click', function() {
    var node = $('#tree0').getSelectedNode();
    $('#tree0').deleteNode(node);
  });
  
</script>

### .showCheckbox()

트리의 체크박스를 활성화 합니다.

>하단 예제 참고

### .hideCheckbox()

트리의 체크박스를 비활성화 합니다.

>하단 예제 참고

### .toggleCheckbox()

트리의 체크박스 show/hide 상태를 토글 합니다.

>하단 예제 참고

### .getCheckedNodes(options)

트리 내 체크된 노드를 리턴합니다.

- parameters
	- options
		- indeterminate {boolean}
			- 체크된 노드의 부모 노드 정보를 가져올 것인지 여부
			- `$('#treeId').getCheckedNodes({indeterminate:true});`

- return 
	- nodeObject
		- 선택된 트리 노드 정보
		- id
			- 선택된 노드의 id
		- parentId
			- 선택된 노드의 부모 노드 id
		- text
			- 선택된 노드의 text
		- node
			- 선택된 노드의 li element 객체
		- iconUrl
			- 선택된 노드의 아이콘 url
		- linkUrl
			- 선택된 노드의 링크 url
		- depth
			- 선택된 노드의 depth
		- data
			- 선택된 노드에 저장된 데이터(노드 생성 시 설정한 데이터)  
			
>하단 예제 참고

<div class="eg">
<div class="egview">
	<div class="Display-inblock Width-40 Valign-top">
		<ul id="tree1" class="Tree" data-checkbox="visible">
			<li>
				<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
					<img src="tree/icon/windows/folder.png">
					Icons
				</a>
				<ul>
					<li>
						<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
							<img src="tree/icon/windows/folder.png">
							Image
						</a>
						<ul>
							<li>
								<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
									<img src="tree/icon/windows/jpeg.png">
									jpeg
								</a>
							</li>
							<li>
								<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
									<img src="tree/icon/windows/bmp.png">
									bmp
								</a>
							</li>
						</ul>
					</li>
					<li>
						<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
							<img src="tree/icon/windows/folder.png">
							Text
						</a>
						<ul>
							<li>
								<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
									<img src="tree/icon/windows/pdf.png">
									pdf
								</a>
							</li>
							<li>
								<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
									<img src="tree/icon/windows/txt.png">
									txt
								</a>
							</li>
							<li>
								<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
									<img src="tree/icon/windows/word59.png">
									word
								</a>
							</li>
						</ul>
					</li>
					<li>
						<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
							<img src="tree/icon/windows/folder.png">
							etc
						</a>
						<ul>
							<li>
								<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
									<img src="tree/icon/windows/config.png">
									config
								</a>
							</li>
							<li>
								<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
									<img src="tree/icon/windows/file.png">
									unknown
								</a>
							</li>
							<li>
								<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
									<img src="tree/icon/windows/zip.png">
									Archieve
								</a>
							</li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>
	</div>
	<div class="Display-inblock Width-40">
		<button id="btn_showCheckbox" class="Button Margin-bottom-5">showCheckbox()</button>
		<button id="btn_hideCheckbox" class="Button Margin-bottom-5">hideCheckbox()</button>
		<button id="btn_toggleCheckbox" class="Button Margin-bottom-5">toggleCheckbox()</button>
		<button id="btn_getCheckedNodes" class="Button Margin-bottom-5">getCheckedNodes()</button>
		<button id="btn_deleteNode" class="Button Margin-bottom-5">deleteNode()</button>
	</div>
</div>
```
<div class="Display-inblock Width-40 Valign-top">
	<ul id="tree1" class="Tree" data-checkbox="visible">
		<li>
			<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
				<img src="tree/icon/windows/folder.png">
				Icons
			</a>
			<ul>
				<li>
					<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
						<img src="tree/icon/windows/folder.png">
						Image
					</a>
					<ul>
						<li>
							<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
								<img src="tree/icon/windows/jpeg.png">
								jpeg
							</a>
						</li>
						<li>
							<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
								<img src="tree/icon/windows/bmp.png">
								bmp
							</a>
						</li>
					</ul>
				</li>
				<li>
					<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
						<img src="tree/icon/windows/folder.png">
						Text
					</a>
					<ul>
						<li>
							<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
								<img src="tree/icon/windows/pdf.png">
								pdf
							</a>
						</li>
						<li>
							<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
								<img src="tree/icon/windows/txt.png">
								txt
							</a>
						</li>
						<li>
							<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
								<img src="tree/icon/windows/word59.png">
								word
							</a>
						</li>
					</ul>
				</li>
				<li>
					<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
						<img src="tree/icon/windows/folder.png">
						etc
					</a>
					<ul>
						<li>
							<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
								<img src="tree/icon/windows/config.png">
								config
							</a>
						</li>
						<li>
							<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
								<img src="tree/icon/windows/file.png">
								unknown
							</a>
						</li>
						<li>
							<span class="Arrow"></span> <input class="Checkbox" type="checkbox"><a>
								<img src="tree/icon/windows/zip.png">
								Archieve
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>
<div class="Display-inblock Width-40">
	<button id="btn_showCheckbox" class="Button Margin-bottom-5">showCheckbox()</button>
	<button id="btn_hideCheckbox" class="Button Margin-bottom-5">hideCheckbox()</button>
	<button id="btn_toggleCheckbox" class="Button Margin-bottom-5">toggleCheckbox()</button>
	<button id="btn_getCheckedNodes" class="Button Margin-bottom-5">getCheckedNodes()</button>
	<button id="btn_deleteNode" class="Button Margin-bottom-5">deleteNode()</button>
</div>
```
```
 $('#btn_showCheckbox').on('click', function(e){
     $('#tree1').showCheckbox();
  });
 $('#btn_hideCheckbox').on('click', function(e){
     $('#tree1').hideCheckbox();
  });
 $('#btn_toggleCheckbox').on('click', function(e){
     $('#tree1').toggleCheckbox();
  });
  $('#btn_getCheckedNodes').on('click', function(e){
     alert(JSON.stringify($('#tree1').getCheckedNodes()));
  });
  $('#btn_deleteNode').on('click', function(e){
    var selectedNodes = $('#tree1').getCheckedNodes();
    for(var i=0; i<selectedNodes.length; i++) {
      $('#tree1').deleteNode(selectedNodes[i]);
    }
  });
```
</div>
<script>
 $('#btn_showCheckbox').on('click', function(e){
     $('#tree1').showCheckbox();
  });
 $('#btn_hideCheckbox').on('click', function(e){
     $('#tree1').hideCheckbox();
  });
 $('#btn_toggleCheckbox').on('click', function(e){
     $('#tree1').toggleCheckbox();
  });
  $('#btn_getCheckedNodes').on('click', function(e){
      alert(JSON.stringify($('#tree1').getCheckedNodes()));
  });
  $('#btn_deleteNode').on('click', function(e){
    var selectedNodes = $('#tree1').getCheckedNodes();
    for(var i=0; i<selectedNodes.length; i++) {
      $('#tree1').deleteNode(selectedNodes[i]);
    }
  });
</script>



### .setDataSource(data)

트리 컴포넌트 데이터를 동적으로 입력하는 함수입니다. setDataSource 함수를 통해 입력된 데이터는 해당 노드(li)의 properties로 저장 됩니다. 

- parameter
	- data {Array} Required.
		- 트리 데이터
```
var data = [{
        text: 'node1',
        iconUrl: 'img/icon1.png',
        items: [{
            text: 'node1',
            iconUrl: 'img/icon1.png'
        }]
    }, {
        text: 'node1',
        iconUrl: 'img/icon1.png'
    }];

$('#tree3').setDataSource(data);
```
<p>
<div class="eg">
<div class="egview">
<div class="Display-inblock Width-40 Valign-top">
	<button id="bind" class="Button">setDataSource(data)</button>
	<ul id="tree3" class="Tree half"></ul>
</div>
<div class="Display-inblock Width-50">
	<label>
		ID for Selection 
		<input id="text" type="text" class="Textinput" placeholder="ex) 1-1">
	</label>
	<button id="select" class="Button">Select Node</button><br/><br/>
	<label>
		선택된 노드의 데이터
		<textarea id="nodeData" class="Display-block Width-90" ></textarea>
	</label>
</div></div>
```
<div class="Display-inblock Width-40 Valign-top">
	<button id="bind" class="Button">setDataSource(data)</button>
	<ul id="tree3" class="Tree"></ul>
</div>
<div class="Display-inblock Width-50">
	<label>
		ID for Selection 
		<input id="text" type="text" class="Textinput" placeholder="ex) 1-1">
	</label>
	<button id="select" class="Button">Select Node</button>
	<label>
		선택된 노드의 데이터
		<textarea id="nodeData" class="Display-block Width-90"></textarea>
	</label>
</div>
```
```
var data = [ {
				id : '1',
				text : 'folder',
				iconUrl : 'tree/icon/windows/folder.png',
				items : [ {
					id : '1-1',
					text : 'subfolder',
					iconUrl : 'tree/icon/windows/folder.png',
					items : [ {
						id : '1-1-1',
						text : 'bmp',
						iconUrl : 'tree/icon/windows/bmp.png'
					}, {
						id : '1-1-2',
						text : 'txt',
						iconUrl : 'tree/icon/windows/txt.png'
					}, {
						id : '1-1-3',
						text : 'Word File',
						iconUrl : 'tree/icon/windows/word59.png'
					}, {
						id : '1-1-4',
						text : 'Archieve',
						iconUrl : 'tree/icon/windows/zip.png'
					} ]
				} ]
			}, {
				id : '2',
				text : 'Unknown',
				iconUrl : 'tree/icon/windows/file.png'
			} ];

			
$('#bind').on('click', function() {
	$('#tree3').setDataSource(data)
});

$('#select').bind('click', function(e) {
	var node = $('#tree3').getNode($('#text').val(), 'id');
	$('#tree3').setSelected(node);
});
$("#tree3").on("select", function(e, node){
	var nodeData = node.data;
	$("#nodeData").val(JSON.stringify(nodeData));
});
```
</div>
<script>
var data = [ {
				id : '1',
				text : 'folder',
				iconUrl : 'tree/icon/windows/folder.png',
				items : [ {
					id : '1-1',
					text : 'subfolder',
					iconUrl : 'tree/icon/windows/folder.png',
					items : [ {
						id : '1-1-1',
						text : 'bmp',
						iconUrl : 'tree/icon/windows/bmp.png'
					}, {
						id : '1-1-2',
						text : 'txt',
						iconUrl : 'tree/icon/windows/txt.png'
					}, {
						id : '1-1-3',
						text : 'Word File',
						iconUrl : 'tree/icon/windows/word59.png'
					}, {
						id : '1-1-4',
						text : 'Archieve',
						iconUrl : 'tree/icon/windows/zip.png'
					} ]
				} ]
			}, {
				id : '2',
				text : 'Unknown',
				iconUrl : 'tree/icon/windows/file.png'
			} ];

			
$('#bind').on('click', function() {
	$('#tree3').setDataSource(data)
});

$('#select').bind('click', function(e) {
	var node = $('#tree3').getNode($('#text').val(), 'id');
	$('#tree3').setSelected(node);
});

$("#tree3").on("select", function(e, node){
	var nodeData = node.data;
	$("#nodeData").val(JSON.stringify(nodeData));
});
</script>


## event

트리 컴포넌트는 jquery `on` 이벤트를 이용해 커스텀 이벤트를 제공합니다. <br>
아이템이 더블클릭, 클릭 또는 확장, 축소가 될 경우의 이벤트를 제공합니다.

- parameter
	- text {string} Required.
		- doubleselect
			- 노드를 더블클릭 했을때 
		- select
			- 노드를 클릭 했을때
		- expand
			- 노드가 확장 될 때
		- collapse
			- 노드가 축소 될 때
		- dragdrop
			- 노드가 드래그 드랍에 의해 이동 될 때 
		- lazyLoad
			- lazyLoad 노드가 선택될 때  

<div class="eg">
<div class="egview">
	<span id="span1"></span>
	<ul id="tree4" class="Tree" data-draggable="true">
		<li>
			<span class="Arrow"></span>
			<a><img src="tree/icon/windows/folder.png">Icons</a>
			<ul>
				<li>
					<span class="Arrow"></span> 
					<a><img src="tree/icon/windows/folder.png">Icons</a>
					<ul>
						<li>
							<span class="Arrow"></span> 
							<a><img src="tree/icon/windows/jpeg.png">jpeg</a>
						</li>
						<li>
							<span class="Arrow"></span> 
							<a><img src="tree/icon/windows/bmp.png">bmp</a>
						</li>
					</ul>
				</li>
				<li>
					<span class="Arrow"></span> 
					<a><img src="tree/icon/windows/folder.png">Text</a>
					<ul>
						<li>
							<span class="Arrow"></span> 
							<a><img src="tree/icon/windows/pdf.png">pdf</a>
						</li>
						<li>
							<span class="Arrow"></span> 
							<a><img src="tree/icon/windows/txt.png">txt</a>
						</li>
						<li>
							<span class="Arrow"></span> 
							<a><img src="tree/icon/windows/word59.png">word</a>
						</li>
					</ul>
				</li>
				<li>
					<span class="Arrow"></span> 
					<a><img src="tree/icon/windows/folder.png">etc</a>
					<ul>
						<li>
							<span class="Arrow"></span> 
							<a><img src="tree/icon/windows/config.png">config</a>
						</li>
						<li>
							<span class="Arrow"></span> 
							<a><img src="tree/icon/windows/file.png">unknown</a>
						</li>
						<li>
							<span class="Arrow"></span> 
							<a><img src="tree/icon/windows/zip.png">Archieve</a>
						</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>
```
<span id="span1"></span>
<ul id="tree4" class="Tree" data-draggable="true">
	<li>
		<span class="Arrow"></span>
		<a><img src="tree/icon/windows/folder.png">Icons</a>
		<ul>
			<li>
				<span class="Arrow"></span> 
				<a><img src="tree/icon/windows/folder.png">Icons</a>
				<ul>
					<li>
						<span class="Arrow"></span> 
						<a><img src="tree/icon/windows/jpeg.png">jpeg</a>
					</li>
					<li>
						<span class="Arrow"></span> 
						<a><img src="tree/icon/windows/bmp.png">bmp</a>
					</li>
				</ul>
			</li>
			<li>
				<span class="Arrow"></span> 
				<a><img src="tree/icon/windows/folder.png">Text</a>
				<ul>
					<li>
						<span class="Arrow"></span> 
						<a><img src="tree/icon/windows/pdf.png">pdf</a>
					</li>
					<li>
						<span class="Arrow"></span> 
						<a><img src="tree/icon/windows/txt.png">txt</a>
					</li>
					<li>
						<span class="Arrow"></span> 
						<a><img src="tree/icon/windows/word59.png">word</a>
					</li>
				</ul>
			</li>
			<li>
				<span class="Arrow"></span> 
				<a><img src="tree/icon/windows/folder.png">etc</a>
				<ul>
					<li>
						<span class="Arrow"></span> 
						<a><img src="tree/icon/windows/config.png">config</a>
					</li>
					<li>
						<span class="Arrow"></span> 
						<a><img src="tree/icon/windows/file.png">unknown</a>
					</li>
					<li>
						<span class="Arrow"></span> 
						<a><img src="tree/icon/windows/zip.png">Archieve</a>
					</li>
				</ul>
			</li>
		</ul>
	</li>
</ul>
```
```
$('#tree4').on('doubleselect', function(e, node) {
    $('#span1').text('Double Select : ' + node.path);
  });
  
  $('#tree4').on('select', function(e, node) {
    $('#span1').text('Select : ' + node.path);
  });
  
  $('#tree4').on('expand', function(e, node) {
    $('#span1').text('Expand : ' + node.path);
  });
  
  $('#tree4').on('collapse', function(e, node) {
    $('#span1').text('Collapse : ' + node.path);
  });
  
  $('#tree4').on('dragdrop', function(e, data) {
  	  var dragTarget = data.dragTarget;
      var dropTarget = data.dropTarget;
     $('#span1').text('Drag : ' + $(dragTarget).children("a").text() + ", Drop : "+$(dropTarget).children("a").text() );
  });
```
</div>
<script>
  $('#tree4').on('doubleselect', function(e, node) {
    $('#span1').text('Double Select : ' + node.path);
  });
  
  $('#tree4').on('select', function(e, node) {
    $('#span1').text('Select : ' + node.path);
  });
  
  $('#tree4').on('expand', function(e, node) {
    $('#span1').text('Expand : ' + node.path);
  });
  
  $('#tree4').on('collapse', function(e, node) {
    $('#span1').text('Collapse : ' + node.path);
  });
  
  $('#tree4').on('dragdrop', function(e, data) {
  	  var dragTarget = data.dragTarget;
      var dropTarget = data.dropTarget;
     $('#span1').text('Drag : ' + $(dragTarget).children("a").text() + ", Drop : "+$(dropTarget).children("a").text() );
  });

</script>



## Setup

setup 자바스크립트에서 Tree의 기본 속성을 공통으로 설정합니다.

- Tree의 기본 Data구조의  id, text등의 기본 key값의 설정을 변경 할 수 있습니다. <br>
	- idKey {string}<br>
		- 'id'가 default이며 설정하여 변경할 수 있습니다.<br>
	- parentIdKey {string}<br>
		- 'parentId'가 default이며 설정하여 변경할 수 있습니다.<br>
	- textKey {string}<br>
		- 'text'가 default이며 설정하여 변경할 수 있습니다.<br>
	- iconUrlKey {string}<br>
		- 'iconUrl'가 default이며 설정하여 변경할 수 있습니다.<br>
	- linkUrlKey {string}<br>
		- 'linkUrl'가 default이며 설정하여 변경할 수 있습니다.<br>
	- depthKey {string}<br>
		- 'depth'가 default이며 설정하여 변경할 수 있습니다.<br>
	- subItems {string}<br>
		- 'items'가 default이며 설정하여 변경할 수 있습니다.<br>
	- lazyKey {string}<br>
		- 'isLazy'가 default이며 설정하여 변경할 수 있습니다.<br>

```
// tree 컴포넌트 셋업
$a.setup('tree', {
	    idKey : 'code',
	    textKey :'title',
	});
```

## Extra Sample 

### LazyLoad
- lazyLoad 노드를 클릭할 경우, lazyLoad 이벤트를 발생시켜 트리 노드를 추가하는 샘플 입니다. 
- 노드 데이터가 isLazy : true 일 경우 lazyLoad 노드로 인식합니다.
- isLazy 가 아닌 다른 키명을 사용할 경우에는 컴포넌트 셋업에서 lazyKey를 변경하여 사용합니다. 

<div class="eg">
<div class="egview">
	<ul id="lazyTree" class="Tree" ></ul>
</div>
```
<ul id="lazyTree" class="Tree" ></ul>
```
```
function setLazyLoadTreeData(treeId, data, nodeObject){
	var $tree = $("#" + treeId);
	$.each(data, function(i, v){
		$tree.createNode(nodeObject, v);
	});
	$tree.expand(nodeObject);
};
function getLazyLoadTreeData(treeId, nodeObject){
	var nodeId = nodeObject ? nodeObject.node.id : "";
	var serviceId = 'U_VALUE' + nodeId + '.json'; 

	$a.request(serviceId, {		
		url : function(id, param) {
	        return '/2.3/dev-component/tree/data/' + id; // $a.request 서비스 ID가 적용될 것이다
	    },
	    method: 'get',
	    timeout: 30000,
	    success: function(res){
	    		console.log("request success :: " + res);
	    		setLazyLoadTreeData(treeId, res.data, nodeObject);
	    },
	    fail: function(res){
	    		console.log("request fail :: " + res);
	    },
	    error: function(res){
	    		console.log("request error :: " + res);
	    }
	});
}
getLazyLoadTreeData("lazyTree");

$("#lazyTree").on("lazyLoad", function(e, nodeObject){
	getLazyLoadTreeData(this.id, nodeObject);
});
```
</div>

<script>
$(document).on("mdload",  function(){
	function setLazyLoadTreeData(treeId, data, nodeObject){
		var $tree = $("#" + treeId);
		$.each(data, function(i, v){
			$tree.createNode(nodeObject, v);
		});
		$tree.expand(nodeObject);
	};
	function getLazyLoadTreeData(treeId, nodeObject){
		var nodeId = nodeObject ? nodeObject.node.id : "";
		var serviceId = 'U_VALUE' + nodeId + '.json'; 
		$a.request(serviceId, {		
			url : function(id, param) {
		       return '/2.3/dev-component/tree/data/' + id; // $a.request 서비스 ID가 적용될 것이다
		    },
		    method: 'get',
		    timeout: 30000,
		    success: function(res){
		    		console.log("request success :: " + res);
		    		setLazyLoadTreeData(treeId, res.data, nodeObject);
		    },
		    fail: function(res){
		    		console.log("request fail :: " + res);
		    },
		    error: function(res){
		    		console.log("request error :: " + res);
		    }
		});
	}
	getLazyLoadTreeData("lazyTree");
	$("#lazyTree").on("lazyLoad", function(e, nodeObject){
		getLazyLoadTreeData(this.id, nodeObject);
   });
});
</script>


### LazyLoad (v2.3.6.8 이하) 
- v2.3.6.9 버전부터 lazyload 기능이 추가되었으니 v2.3.6.8 이하의 버전에서는 이 샘플을 사용하시기 바랍니다. 
- 트리 노드 선택 시에 데이터를 추가로 가져오는 형태의 샘플 입니다. 

<div class="eg">
```
    var data = [{
    	id : 'NODE01',
        text: 'NODE01',
        items: [{
        	id : 'NODE01-01',
            text: 'NODE01-01',
        }],
    }, {
    	id : 'NODE02',
        text: 'NODE02(lazyLoad)',
        isLazy : true
    }, {
    	id : 'NODE03',
        text: 'NODE03(lazyLoad)',
        isLazy : true
    }];
    
  	$("#lazyTree_old").setDataSource(data);
  	
   function lazyLoadHandler(e, node){
		var newItems = [ {
    		id : node.data.id+'-LAZY01',
    		text : node.data.id + '-LAZY01'
		}, {
		    id : node.data.id+'-LAZY02',
    		text : node.data.id + '-LAZY02'
		} ];
		    		
 		if(  node.data.isLazy ){
       		// 선택된 노드의 하위 노드를 모두 삭제
       		$(node.node).find("ul").remove();
       		// 하위 노드 추가 
       		for( item in newItems ){
       	    	$(this).createNode(node, newItems[item]);
       		}
		}
 		$(this).expand(node);
	}
	
   $("#lazyTree_old").on("select", lazyLoadHandler);
```
</div>

<script>
$(document).on("mdload",  function(){
    var data = [{
    	id : 'NODE01',
        text: 'NODE01',
        items: [{
        	id : 'NODE01-01',
            text: 'NODE01-01',
        }],
    }, {
    	id : 'NODE02',
        text: 'NODE02(lazyLoad)',
        isLazy : true
    }, {
    	id : 'NODE03',
        text: 'NODE03(lazyLoad)',
        isLazy : true
    }];
    
  	$("#lazyTree_old").setDataSource(data);
  	
   function lazyLoadHandler(e, node){
		var newItems = [ {
    		id : node.data.id+'-LAZY01',
    		text : node.data.id + '-LAZY01'
		}, {
		    id : node.data.id+'-LAZY02',
    		text : node.data.id + '-LAZY02'
		} ];
		    		
 		if(  node.data.isLazy ){
       		// 선택된 노드의 하위 노드를 모두 삭제
       		$(node.node).find("ul").remove();
       		// 하위 노드 추가 
       		for( item in newItems ){
       	    	$(this).createNode(node, newItems[item]);
       		}
		}
 		$(this).expand(node);
	}
	
   $("#lazyTree_old").on("select", lazyLoadHandler);
  
});
</script>

