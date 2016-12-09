

# NavigationMenu

## Basic

NavigationMenu 컴포넌트입니다. 
마우스 포인터가 해당 메뉴에 올라가 있을 경우, 서브 메뉴 아이템이 보이는 형태입니다.  
&lt;ul&gt; 태그 에  `class="Navmenu"` 을 사용합니다.  
하위 &lt;li&gt;로 메뉴의 뎁스가 결정됩니다.  
&lt;li&gt; 바로 하위에 &lt;a&gt; 태그로 'link' 와 '메뉴명'을 설정합니다.

<div class="eg">
<div class="egview" style="height:120px;">
<ul class="Navmenu"><!-- Requirement : 일렬로 정렬. -->
	<li><a href="#0">Parent #1</a>
		<ul>
			<li><a href="#0">Child #1</a>
				<ul>
					<li><a href="#0">GrandChild #1</a></li>
				</ul>
			</li>
			<li><a href="#0">Child #2</a>
				<ul >
					<li><a href="#0">GrandChild #1</a></li>
				</ul>
			</li>
		</ul>
	</li>
	<li>
		<a href="#0">Parent #2</a>
		<ul >
			<li>
				<a href="#0">Child #1</a>
				<ul>
					<li>
						<a href="#0">GrandChild #1</a>
						<ul>
							<li>
								<a href="#0">Great Grand #1</a>
							</li>
							<li>
								<a href="#0">Great Grand #2</a>
							</li>
						</ul>
					</li>
					<li>
						<a href="#0">GrandChild #4</a>
					</li>
				</ul>
			</li>
			<li>
				<a href="#0">Child #2</a>
			</li>
		</ul>
	</li>
	<li>
		<a href="#0">Parent #3</a>
	</li>
</ul>
</div>
```
<ul class="Navmenu"><!-- Requirement : 일렬로 정렬. -->
	<li><a href="#0">Parent #1</a>
		<ul>
			<li><a href="#0">Child #1</a>
				<ul>
					<li>
						<a href="#0">GrandChild #1</a>
					</li>
				</ul>
			</li>
			<li><a href="#0">Child #2</a>
				<ul >
					<li>
						<a href="#0">GrandChild #1</a>
					</li>
				</ul>
			</li>
		</ul>
	</li>
	<li>
		<a href="#0">Parent #2</a>
		<ul >
			<li>
				<a href="#0">Child #1</a>
				<ul>
					<li>
						<a href="#0">GrandChild #1</a>
						<ul>
							<li>
								<a href="#0">Great Grand #1</a>
							</li>
							<li>
								<a href="#0">Great Grand #2</a>
							</li>
						</ul>
					</li>
					<li>
						<a href="#0">GrandChild #2</a>
					</li>
				</ul>
			</li>
			<li>
				<a href="#0">Child #2</a>
			</li>
		</ul>
	</li>
	<li>
		<a href="#0">Parent #3</a>
	</li>
</ul>
```
</div>

 
## Attributes
 


### class


- "Navmenu"  
	- Alopex UI NavigationMenu 컴포넌트를 사용한다고 명시하는 속성입니다.
	

## Functions


### .setDataSource (data)

NavigationMenu의 데이터를 동적으로 생성하는 함수입니다.

- parameter
	- data {array} Required  
		- JSON Object의 배열.
		- JSON object의 속성은 아래와 같이 구성됩니다.
			- text : 메뉴 버튼의 텍스트를 지정합니다.
			- linkUrl : 메뉴 버튼 클릭 시 이동 페이지 및 행동을 정의합니다. (a 태그의 href 속성에 매핑)
			- items : 하위 메뉴 버튼을 가리킵니다.




<div class="eg">
<div class="egview" style="height:120px;">
<ul id="navmenu1" class="Navmenu"></ul>
</div>
```
<ul id="navmenu1" class="Navmenu"></ul>
```
``` 
var data = [{
	text: 'Parent Menu 1',
	linkUrl: '#parent-menu-1',
	items: [{
		text: 'Child Menu 1',
		linkUrl: '#child-menu-1',
	}, {
		text: 'Child Menu 2',
		linkUrl: '#child-menu-2',
	}]
}, {
	text: 'Parent Menu 2',
	linkUrl: '#parent-menu-2',
	items: [{
		text: 'Child Menu 4',
		linkUrl: '#child-menu-4',
	}]
}, {
	text: 'Parent Menu 3',
	linkUrl: '#parent-menu-3'
}];

$('#navmenu1').setDataSource(data);
```
</div>	
<script>
$(document).on("mdload", function(){
	var data = [{
	text: 'Parent Menu 1',
	linkUrl: '#parent-menu-1',
	items: [{
		text: 'Child Menu 1',
		linkUrl: '#child-menu-1',
	}, {
		text: 'Child Menu 2',
		linkUrl: '#child-menu-2',
	}]
}, {
	text: 'Parent Menu 2',
	linkUrl: '#parent-menu-2',
	items: [{
		text: 'Child Menu 4',
		linkUrl: '#child-menu-4',
	}]
}, {
	text: 'Parent Menu 3',
	linkUrl: '#parent-menu-3'
}];

$('#navmenu1').setDataSource(data);
});

</script>

