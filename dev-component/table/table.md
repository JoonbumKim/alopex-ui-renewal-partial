

# Table

## Basic

Table 컴포넌트 입니다. `class="Table"` 속성을 추가하여 사용할 수 있습니다.

table cell의 너비를 조정하기 위해서는 colgroup의 col태그를 사용하여 일괄 적용합니다. 
너비 스타일이 설정되지 않는 경우, 각 테이블 셀의 데이터의 길이에 따라 너비가 자동 설정됩니다.
추가적으로 스타일을 변경하고 싶은 경우에는, [퍼블리싱 가이드](../document/document.html?target=publish#basic)를 참고하여 스타일을 변경할 수 있습니다.

<div class="eg">
<div class="egview">
	<table class="Table">
			<colgroup>
				<col />
				<col />
				<col />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th>1st Header </th>
					<th>2nd Header </th>
					<th>3rd Header </th>
					<th>4th Header </th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td> Row 1, Col 1</td>
					<td> Row 1, Col 2</td>
					<td> Row 1, Col 3 </td>
					<td> Row 1, Col 4 </td>
				</tr>
				<tr>
					<td> Row 2, Col 1</td>
					<td> Row 2, Col 2</td>
					<td> Row 2, Col 3 </td>
					<td> Row 2, Col 4 </td>
				</tr>
			</tbody>
	</table>
</div>
```
	<table class="Table">
			<colgroup>
				<col />
				<col />
				<col />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th>1st Header </th>
					<th>2nd Header </th>
					<th>3rd Header </th>
					<th>4th Header </th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td> Row 1, Col 1</td>
					<td> Row 1, Col 2</td>
					<td> Row 1, Col 3 </td>
					<td> Row 1, Col 4 </td>
				</tr>
				<tr>
					<td> Row 2, Col 1</td>
					<td> Row 2, Col 2</td>
					<td> Row 2, Col 3 </td>
					<td> Row 2, Col 4 </td>
				</tr>
			</tbody>
	</table>
```
</div>  		

 
## Attributes
 


### class

- "Table-wrapper" (Optional)
	- Alopex UI table 컴포넌트 사용 시 wrapper를 지정합니다.
- "Table-scroller" (Optional)
	- Alopex UI table 컴포넌트 사용 시 scroller를 지정합니다.

	

### data-resizable {boolean}

컬럼 헤더에서 사용하며 컬럼을 리사이징 할 수 있습니다. 

- “false” : default
	- 리사이즈 기능을 사용하지 않습니다.

```
<table class="Table">
	<thead>
		<tr>
			<th data-resizable="true">Resizable Column</th>
			<th>Basic Column</th>
		</tr>
	</thead>
	...
</table>
```
<p>
<div class="eg">
<div class="egview">
		<table class="Table">
				<thead>
					<tr>
						<th data-resizable="true">Head1</th>
						<th>Head2</th>
						<th data-resizable="true">Head3</th>
						<th>Head4</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Row1,Cell1</td>
						<td>Row1,Cell2</td>
						<td>Row1,Cell3</td>
						<td>Row1,Cell4</td>
					</tr>
					<tr>
						<td>Row2,Cell1</td>
						<td>Row2,Cell2</td>
						<td>Row2,Cell3</td>
						<td>Row2,Cell4</td>
					</tr>
					<tr>
						<td>Row3,Cell1</td>
						<td>Row3,Cell2</td>
						<td>Row3,Cell3</td>
						<td>Row3,Cell4</td>
					</tr>
					<tr>
						<td>Row4,Cell1</td>
						<td>Row4,Cell2</td>
						<td>Row4,Cell3</td>
						<td>Row4,Cell4</td>
					</tr>
					<tr>
						<td>Row5,Cell1</td>
						<td>Row5,Cell2</td>
						<td>Row5,Cell3</td>
						<td>Row5,Cell4</td>
					</tr>
				</tbody>
		</table>
</div>
```	
		<table class="Table">
				<thead>
					<tr>
						<th data-resizable="true">Head1</th>
						<th>Head2</th>
						<th data-resizable="true">Head3</th>
						<th>Head4</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Row1,Cell1</td>
						<td>Row1,Cell2</td>
						<td>Row1,Cell3</td>
						<td>Row1,Cell4</td>
					</tr>
					<tr>
						<td>Row2,Cell1</td>
						<td>Row2,Cell2</td>
						<td>Row2,Cell3</td>
						<td>Row2,Cell4</td>
					</tr>
					<tr>
						<td>Row3,Cell1</td>
						<td>Row3,Cell2</td>
						<td>Row3,Cell3</td>
						<td>Row3,Cell4</td>
					</tr>
					<tr>
						<td>Row4,Cell1</td>
						<td>Row4,Cell2</td>
						<td>Row4,Cell3</td>
						<td>Row4,Cell4</td>
					</tr>
					<tr>
						<td>Row5,Cell1</td>
						<td>Row5,Cell2</td>
						<td>Row5,Cell3</td>
						<td>Row5,Cell4</td>
					</tr>
				</tbody>
		</table>
```
</div>	

### data-sortable

컬럼 헤더에 선언되며, 컬럼 데이터를 정렬 가능하게 변경합니다. 
data-column="true"로 설정된 컬럼의 헤더를 클릭 시 데이터의 타입에 따라 정렬됩니다.


- "string" : default
	- 데이터 타입을 문자 순서대로 정렬합니다.
- "date"
	- 날짜 타입으로 정렬합니다. 날짜 데이터 포맷은 MM/DD/YYYY으로 입력해야 합니다.
- "number"
	- 컬럼의 데이터 타입을 숫자 정렬합니다.(음수 및 소수 지원)


```
<table class="Table">
	<thead>
		<tr>
			<th data-sortable="string">String</th>
			<th data-sortable="date">Date</th>
		</tr>
	</thead>
	...
</table>
```
<p>
<div class="eg">
<div class="egview">
		<table class="Table" id="table1">
				<colgroup>
					<col style="width:80px;" />
					<col />
					<col />
					<col />
					<col />
					<col style="width:100px;" />
				</colgroup>
				<thead>
					<tr>
						<th id="id" data-sortable="number">No.</th>
						<th data-sortable="string">First Name</th>
						<th data-sortable="string">Last Name</th>
						<th data-sortable="date">Birthdate</th>
						<th id="weight" data-sort-function="compare_weight">Height / Weight</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>June</td>
						<td>Park</td>
						<td>11/22/1976</td>
						<td>180 / 78</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>2</td>
						<td>Ji-hyun</td>
						<td>Lim</td>
						<td>06/17/1982</td>
						<td>170 / 00</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>3</td>
						<td>Jun Seok</td>
						<td>Lee</td>
						<td>02/09/1983</td>
						<td>183 / 80</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>4</td>
						<td>Si-myung</td>
						<td>Yang</td>
						<td>12/05/1982</td>
						<td>183 / 85</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>5</td>
						<td>Sang-Hoon</td>
						<td>Han</td>
						<td>02/09/1984</td>
						<td>174 / 55</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>6</td>
						<td>Sang-jun</td>
						<td>Yoon</td>
						<td>06/17/1984</td>
						<td>188 / 90</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>7</td>
						<td>Min-young</td>
						<td>Song</td>
						<td>03/05/1986</td>
						<td>176 / 60</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					
					<tr>
						<td>8</td>
						<td>Bong-chan</td>
						<td>Kim</td>
						<td>03/05/1986</td>
						<td>178 / 60</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>9</td>
						<td>Seo-young</td>
						<td>Ahn</td>
						<td>03/05/1983</td>
						<td>178 / 60</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>10</td>
						<td>Yae-ji</td>
						<td>Lee</td>
						<td>03/05/1990</td>
						<td>163 / 00</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
				</tbody>
		</table>
</div>
```	
		<table class="Table"  id="table1">
				<colgroup>
					<col style="width:80px;">
					<col />
					<col />
					<col />
					<col />
					<col style="width:100px;">
				</colgroup>
				<thead>
					<tr>
						<th id="id" data-sortable="number">No.</th>
						<th data-sortable="string">First Name</th>
						<th data-sortable="string">Last Name</th>
						<th data-sortable="date">Birthdate</th>
						<th id="weight" data-sort-function="compare_weight">Height / Weight</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>June</td>
						<td>Park</td>
						<td>11/22/1976</td>
						<td>180 / 78</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>2</td>
						<td>Ji-hyun</td>
						<td>Lim</td>
						<td>06/17/1982</td>
						<td>170 / 00</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>3</td>
						<td>Jun Seok</td>
						<td>Lee</td>
						<td>02/09/1983</td>
						<td>183 / 80</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>4</td>
						<td>Si-myung</td>
						<td>Yang</td>
						<td>12/05/1982</td>
						<td>183 / 85</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>5</td>
						<td>Sang-Hoon</td>
						<td>Han</td>
						<td>02/09/1984</td>
						<td>174 / 55</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>6</td>
						<td>Sang-jun</td>
						<td>Yoon</td>
						<td>06/17/1984</td>
						<td>188 / 90</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>7</td>
						<td>Min-young</td>
						<td>Song</td>
						<td>03/05/1986</td>
						<td>176 / 60</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					
					<tr>
						<td>8</td>
						<td>Bong-chan</td>
						<td>Kim</td>
						<td>03/05/1986</td>
						<td>178 / 60</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>9</td>
						<td>Seo-young</td>
						<td>Ahn</td>
						<td>03/05/1983</td>
						<td>178 / 60</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
					<tr>
						<td>10</td>
						<td>Yae-ji</td>
						<td>Lee</td>
						<td>03/05/1990</td>
						<td>163 / 00</td>
						<td><input type="button" class="Button" value="more"></td>
					</tr>
				</tbody>
		</table>
```
```	
		//오름차순 정렬은 'asc'를 내림 차순 정렬은 'desc'
	    var header = $('#id')[0];
        $('#table1').tableSort(header, 'desc');

		function compare_height(a, b) {
		  var a = parseInt(a[0].split('/')[0]);
		  var b = parseInt(b[0].split('/')[0]);
		  return (a-b);
		}
		/**
		 * @param a Array of array which contains cell content and table row. a[0] indicates string-typed cell content.
		 */
		function compare_weight(a, b) {
		  //console.log(a);
		  var a = parseInt(a[0].split('/')[1]);
		  var b = parseInt(b[0].split('/')[1]);
		  return (a-b);
		}


```
```
<style>
	@media screen and (max-width:500px) {
		col {display:none;}
		col:first-child {display:block;}
	}
</style>

```

</div>	





### data-sort-function {functionName}

셀 내 데이터를 이용하여 사용자 정의 소팅 함수를 구현할 때 사용됩니다.

- functionName
	- 사용자 함수명

```
<table class="Table">
	<thead>
		<tr>
			<th data-sort-function="compare">String</th>
		</tr>
	</thead>
	...
</table>

function compare(a, b) {
	return (a-b);
}
```

### data-editable {boolean}

컬럼 헤더에 선언되며, 선언 될 경우 컬럼의 셀은 편집 가능해집니다. 

- "false" : default
	- inline 편집 불가능합니다.

```
<table class="Table">
	<thead>
		<tr>
			<th data-editable="true">Resizable Column</th>
			<th>Basic Column</th>
		</tr>
	</thead>
	...
</table>
```
<p>
<div class="eg">
<div class="egview">
	<button id="editBtn1" class="Button Margin-bottom-10">New Contact</button>
	<table id="contact" class="Table">
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Organization</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td data-editable="true">David</td>
						<td data-editable="true">Howard</td>
						<td data-editable="true">SK C&C</td>
						<td data-editable="true">dhoward@sk.com</td>
					</tr>
					<tr>
						<td data-editable="true">Jerry</td>
						<td data-editable="true">Guynes</td>
						<td data-editable="true">SK C&C</td>
						<td data-editable="true">guynes@sk.com</td>
					</tr>
				</tbody>
	</table>
	<button id="editBtn2" class="Button">Save Changes</button>
	<button id="editBtn3" class="Button">Discard Changes</button>
</div>
```	
	<button id="editBtn1" class="Button Margin-bottom-10">New Contact</button>
	<table id="contact" class="Table">
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Organization</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td data-editable="true">David</td>
						<td data-editable="true">Howard</td>
						<td data-editable="true">SK C&C</td>
						<td data-editable="true">dhoward@sk.com</td>
					</tr>
					<tr>
						<td data-editable="true">Jerry</td>
						<td data-editable="true">Guynes</td>
						<td data-editable="true">SK C&C</td>
						<td data-editable="true">guynes@sk.com</td>
					</tr>
				</tbody>
	</table>
	<button id="editBtn2" class="Button">Save Changes</button>
	<button id="editBtn3" class="Button">Discard Changes</button>
```
```	

		$(document).ready(function () {
		  $('#contact').find('.af-table-editor').each(function() {
		    this.value = this.innerHTML;
		  })
		  
		  $('#editBtn1').click(function() {
		    addContact();
		  }); 
		  $('#editBtn2').click(function() {
		    save();
		  }); 
		  $('#editBtn3').click(function() {
		    discard();
		  }); 
		});
		
		function addContact() {
		  $('#contact > tbody')
		  	.append('<tr><td data-editable="true"></td><td data-editable="true"></td><td data-editable="true"></td><td data-editable="true"></td></tr>');
		  $('#contact').refresh();
		}
		
		function save() {
		  $('#contact').find('[class*=af-edited]').each(function() {
		    this.value = this.innerHTML;
		    $(this).removeClass('af-edited');
		  });
		}
		
		function discard() {
		  $('#contact').find('[class*=af-edited]').each(function() {
		    this.innerHTML = (this.value == undefined)?"": this.value;
		    $(this).removeClass('af-edited');
		  });
		}

```

</div>	

	
### data-scroller-use

Table 컴포넌트는 기본적으로 Wrapper 및 Scroller 엘리먼트로 감싸지게 됩니다.

- "false"
	- Wrapper 와 Scroller 엘리먼트를 생성하지 않고자 할 때 사용합니다. 

<div class="eg">
<div class="egview">
	<table class="Table" data-scroller-use="false">
		<thead>
			<tr>
				<th>First Name</th>
				<th>Last Name</th>
				<th>Organization</th>
				<th>Email</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>David</td>
				<td>Howard</td>
				<td>SK C&C</td>
				<td>dhoward@sk.com</td>
			</tr>
			<tr>
				<td>Jerry</td>
				<td>Guynes</td>
				<td>SK C&C</td>
				<td>guynes@sk.com</td>
			</tr>
		</tbody>
	</table>		
</div>
</div>

	
	
## Functions


### .hideColumn(index)

- index 
	- index를 이용해 해당 컬럼을 숨깁니다.


### .showColumn(index)

- index
	- 숨겨져있던 컬럼을 보여줍니다.

### .refresh()

동적으로 추가된 element를 보여지게 합니다.

### .sortTable(header, orderBy)

header를 기준으로 오름차순  'asc', 내림차순 'desc' 정렬 할 수 있습니다.

### .clear()

Table 내의 모든 데이터를 지웁니다. 테이블 태그 내에 헤더가 아닌 TR태그를 DOM에서 삭제합니다.
<div class="eg">
<div class="egview">
	<h3>Table with THEAD head</h3>
	<button id="btn1" class="Button Margin-bottom-10">Clear</button>
	<table id="el" class="Table">
				<thead>
					<tr>
						<th data-resizable="true">Head1</th>
						<th>Head2</th>
						<th data-resizable="true">Head3</th>
						<th>Head4</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Row 1, Cell1</td>
						<td>Row 1, Cell2</td>
						<td>Row 1, Cell3</td>
						<td>Row 1, Cell4</td>
					</tr>
					<tr>
						<td>Row 2, Cell1</td>
						<td>Row 2, Cell2</td>
						<td>Row 2, Cell3</td>
						<td>Row 2, Cell4</td>
					</tr>
					<tr>
						<td>Row 3, Cell1</td>
						<td>Row 3, Cell2</td>
						<td>Row 3, Cell3</td>
						<td>Row 3, Cell4</td>
					</tr>
					<tr>
						<td>Row 4, Cell1</td>
						<td>Row 4, Cell2</td>
						<td>Row 4, Cell3</td>
						<td>Row 4, Cell4</td>
					</tr>
					<tr>
						<td>Row 5, Cell1</td>
						<td>Row 5, Cell2</td>
						<td>Row 5, Cell3</td>
						<td>Row 5, Cell4</td>
					</tr>
				</tbody>
	</table>
	
	<br><br>
	<h3>Table with TH head</h3>
	<button id="btn2" class="Button Margin-bottom-10">Clear</button>
	<table id="el2" class="Table">
				<tr>
					<th data-resizable="true">Head1</th>
					<th>Head2</th>
					<th data-resizable="true">Head3</th>
					<th>Head4</th>
				</tr>
				<tr>
					<td>Row 1, Cell1</td>
					<td>Row 1, Cell2</td>
					<td>Row 1, Cell3</td>
					<td>Row 1, Cell4</td>
				</tr>
				<tr>
					<td>Row 2, Cell1</td>
					<td>Row 2, Cell2</td>
					<td>Row 2, Cell3</td>
					<td>Row 2, Cell4</td>
				</tr>
				<tr>
					<td>Row 3, Cell1</td>
					<td>Row 3, Cell2</td>
					<td>Row 3, Cell3</td>
					<td>Row 3, Cell4</td>
				</tr>
				<tr>
					<td>Row 4, Cell1</td>
					<td>Row 4, Cell2</td>
					<td>Row 4, Cell3</td>
					<td>Row 4, Cell4</td>
				</tr>
				<tr>
					<td>Row 5, Cell1</td>
					<td>Row 5, Cell2</td>
					<td>Row 5, Cell3</td>
					<td>Row 5, Cell4</td>
				</tr>
	</table>
</div>
```	
	<h3>Table with THEAD head</h3>
	<button id="btn1" class="Button Margin-bottom-10">Clear</button>
	<table id="el" class="Table">
				<thead>
					<tr>
						<th data-resizable="true">Head1</th>
						<th>Head2</th>
						<th data-resizable="true">Head3</th>
						<th>Head4</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Row 1, Cell1</td>
						<td>Row 1, Cell2</td>
						<td>Row 1, Cell3</td>
						<td>Row 1, Cell4</td>
					</tr>
					<tr>
						<td>Row 2, Cell1</td>
						<td>Row 2, Cell2</td>
						<td>Row 2, Cell3</td>
						<td>Row 2, Cell4</td>
					</tr>
					<tr>
						<td>Row 3, Cell1</td>
						<td>Row 3, Cell2</td>
						<td>Row 3, Cell3</td>
						<td>Row 3, Cell4</td>
					</tr>
					<tr>
						<td>Row 4, Cell1</td>
						<td>Row 4, Cell2</td>
						<td>Row 4, Cell3</td>
						<td>Row 4, Cell4</td>
					</tr>
					<tr>
						<td>Row 5, Cell1</td>
						<td>Row 5, Cell2</td>
						<td>Row 5, Cell3</td>
						<td>Row 5, Cell4</td>
					</tr>
				</tbody>
	</table>
	
	<br><br>
	<h3>Table with TH head</h3>
	<button id="btn2" class="Button Margin-bottom-10">Clear</button>
	<table id="el2" class="Table">
				<tr>
					<th data-resizable="true">Head1</th>
					<th>Head2</th>
					<th data-resizable="true">Head3</th>
					<th>Head4</th>
				</tr>
				<tr>
					<td>Row 1, Cell1</td>
					<td>Row 1, Cell2</td>
					<td>Row 1, Cell3</td>
					<td>Row 1, Cell4</td>
				</tr>
				<tr>
					<td>Row 2, Cell1</td>
					<td>Row 2, Cell2</td>
					<td>Row 2, Cell3</td>
					<td>Row 2, Cell4</td>
				</tr>
				<tr>
					<td>Row 3, Cell1</td>
					<td>Row 3, Cell2</td>
					<td>Row 3, Cell3</td>
					<td>Row 3, Cell4</td>
				</tr>
				<tr>
					<td>Row 4, Cell1</td>
					<td>Row 4, Cell2</td>
					<td>Row 4, Cell3</td>
					<td>Row 4, Cell4</td>
				</tr>
				<tr>
					<td>Row 5, Cell1</td>
					<td>Row 5, Cell2</td>
					<td>Row 5, Cell3</td>
					<td>Row 5, Cell4</td>
				</tr>
	</table>
```
```	

		$(document).ready(function(){
	      $('#btn1').click(function() {
	        $('#el').clear();
	      });
	      $('#btn2').click(function() {
	        $('#el2').clear();
	      });
    });

```

</div>	

## Extra Example

### Scrolling

data-scroll 속성의 값을 "all"로 설정하면, 테이블 전체가 스크롤된다.
스크롤 기능을 사용할 경우, 테이블의 wrapper 크기(스크롤 되는 테이블의 크기) 조정은 data-height와 data-width를 통해 조절합니다.
CSS3 flexbox를 사용하는 경우에는 별도의 크기를 조절하지 않아도, 지정한 영역을 다 채우도록 구현되어 있습니다. (box-flex 속성 사용)

<div class="eg">
<div class="egview">
		<table data-highlight="true"  class="Table" data-height="200px" data-scroll="all">
				<thead>
					<tr>
						<th data-resizable="true" data-sortable="string">1st Header</th>
						<th data-resizable="true">2nd Header</th>
						<th data-resizable="true">3rd Header</th>
						<th data-resizable="true">4th Header</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
				</tbody>
		</table>
</div>
```	
		<table data-highlight="true"  class="Table" data-height="200px" data-scroll="all">
				<thead>
					<tr>
						<th data-resizable="true" data-sortable="string">1st Header</th>
						<th data-resizable="true">2nd Header</th>
						<th data-resizable="true">3rd Header</th>
						<th data-resizable="true">4th Header</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
				</tbody>
		</table>
```
</div>	

### Header Fix with vertical scrolling

이 예제는 우선 data-scroll 속성값을 body로 지정하여, 헤더부분은 고정하고 바디영역만 스크롤됩니다. 
		또한 data-width 속성값을 "80%"를 사용하여 table wrapper 크기를 조정하였습니다.
		
<div class="eg">
<div class="egview">
		<table data-highlight="true" class="Table" data-height="200px" data-width="80%" data-scroll="body">
				<colgroup>
					<col style="width:150px;" />
					<col style="width:150px;" />
					<col style="width:150px;"/>
					<col />
				</colgroup>	
				<thead>
					<tr>
						<th data-resizable="true" data-sortable="string">1st Header</th>
						<th data-resizable="true">2nd Header</th>
						<th data-resizable="true">3rd Header</th>
						<th data-resizable="true">4th Header</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
				</tbody>
		</table>
</div>
```	
		<table data-highlight="true" class="Table" data-height="200px" data-width="80%" data-scroll="body">
				<colgroup>
					<col style="width:150px;" />
					<col style="width:150px;" />
					<col style="width:150px;"/>
					<col />
				</colgroup>	
				<thead>
					<tr>
						<th data-resizable="true" data-sortable="string">1st Header</th>
						<th data-resizable="true">2nd Header</th>
						<th data-resizable="true">3rd Header</th>
						<th data-resizable="true">4th Header</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
					</tr>
				</tbody>
		</table>
```
</div>

### Header Fix with horizontal and vertical scrolling

이번 예제는 위의 예제에서 테이블 가로 너비 크기를 wrapper 가로 너비 크기보다 크게 설정(width:820px 로 설정)할 경우, 헤더가 고정된 상태에서 가로 세로 스크롤이 되는 것을 보여주는 예제입니다.

<div class="eg">
<div class="egview" id='testEg'>
		<table class="Table" data-height="250px" data-scroll="body" style="width:820px;">
				<colgroup>
					<col style="width:100px;" />
					<col style="width:100px;" />
					<col style="width:100px;"/>
					<col />
					<col />
					<col />
					<col style="width:100px;" />
					<col style="width:100px;" />
				</colgroup>
				<thead>
					<tr>
						<th data-resizable="true" data-sortable="string">1st Header</th>
						<th data-resizable="true">2nd Header</th>
						<th data-resizable="true">3rd Header</th>
						<th data-resizable="true">4th Header</th>
						<th data-resizable="true">5th Header</th>
						<th data-resizable="true">6th Header</th>
						<th data-resizable="true">7th Header</th>
						<th data-resizable="true">8th Header</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
						<td> Row 1, Col 5</td>
						<td> Row 1, Col 6</td>
						<td> Row 1, Col 7</td>
						<td> Row 1, Col 8</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
						<td> Row 2, Col 5</td>
						<td> Row 2, Col 6</td>
						<td> Row 2, Col 7</td>
						<td> Row 2, Col 8</td>
					</tr>
					<tr>
						<td> Row 3, Col 1</td>
						<td> Row 3, Col 2</td>
						<td> Row 3, Col 3</td>
						<td> Row 3, Col 4</td>
						<td> Row 3, Col 5</td>
						<td> Row 3, Col 6</td>
						<td> Row 3, Col 7</td>
						<td> Row 3, Col 8 long sentence test</td>
					</tr>
					<tr>
						<td> Row 4, Col 1</td>
						<td> Row 4, Col 2</td>
						<td> Row 4, Col 3</td>
						<td> Row 4, Col 4</td>
						<td> Row 4, Col 5</td>
						<td> Row 4, Col 6</td>
						<td> Row 4, Col 7</td>
						<td> Row 4, Col 8</td>
					</tr>
					<tr>
						<td> Row 5, Col 1</td>
						<td> Row 5, Col 2</td>
						<td> Row 5, Col 3</td>
						<td> Row 5, Col 4</td>
						<td> Row 5, Col 5</td>
						<td> Row 5, Col 6</td>
						<td> Row 5, Col 7</td>
						<td> Row 5, Col 8</td>
					</tr>
					<tr>
						<td> Row 6, Col 1</td>
						<td> Row 6, Col 2</td>
						<td> Row 6, Col 3</td>
						<td> Row 6, Col 4</td>
						<td> Row 6, Col 5</td>
						<td> Row 6, Col 6</td>
						<td> Row 6, Col 7</td>
						<td> Row 6, Col 8</td>
					</tr>
					<tr>
						<td> Row 7, Col 1</td>
						<td> Row 7, Col 2</td>
						<td> Row 7, Col 3</td>
						<td> Row 7, Col 4</td>
						<td> Row 7, Col 5</td>
						<td> Row 7, Col 6</td>
						<td> Row 7, Col 7</td>
						<td> Row 7, Col 8</td>
					</tr>
					<tr>
						<td> Row 8, Col 1</td>
						<td> Row 8, Col 2</td>
						<td> Row 8, Col 3</td>
						<td> Row 8, Col 4</td>
						<td> Row 8, Col 5</td>
						<td> Row 8, Col 6</td>
						<td> Row 8, Col 7</td>
						<td> Row 8, Col 8</td>
					</tr>
					<tr>
						<td> Row 9, Col 1</td>
						<td> Row 9, Col 2</td>
						<td> Row 9, Col 3</td>
						<td> Row 9, Col 4</td>
						<td> Row 9, Col 5</td>
						<td> Row 9, Col 6</td>
						<td> Row 9, Col 7</td>
						<td> Row 9, Col 8</td>
					</tr>
					<tr>
						<td> Row 10, Col 1</td>
						<td> Row 10, Col 2</td>
						<td> Row 10, Col 3</td>
						<td> Row 10, Col 4</td>
						<td> Row 10, Col 5</td>
						<td> Row 10, Col 6</td>
						<td> Row 10, Col 7</td>
						<td> Row 10, Col 8</td>
					</tr>
					<tr>
						<td> Row 11, Col 1</td>
						<td> Row 11, Col 2</td>
						<td> Row 11, Col 3</td>
						<td> Row 11, Col 4</td>
						<td> Row 11, Col 5</td>
						<td> Row 11, Col 6</td>
						<td> Row 11, Col 7</td>
						<td> Row 11, Col 8</td>
					</tr>
				</tbody>
		</table>
</div>
```	
		<table class="Table" data-height="250px" data-scroll="body" style="width:820px;">
				<colgroup>
					<col style="width:100px;" />
					<col style="width:100px;" />
					<col style="width:100px;"/>
					<col />
					<col />
					<col />
					<col style="width:100px;" />
					<col style="width:100px;" />
				</colgroup>
				<thead>
					<tr>
						<th data-resizable="true" data-sortable="string">1st Header </th>
						<th data-resizable="true">2nd Header </th>
						<th data-resizable="true">3rd Header </th>
						<th data-resizable="true">4th Header </th>
						<th data-resizable="true">5th Header </th>
						<th data-resizable="true">6th Header </th>
						<th data-resizable="true">7th Header </th>
						<th data-resizable="true">8th Header </th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td> Row 1, Col 1</td>
						<td> Row 1, Col 2</td>
						<td> Row 1, Col 3</td>
						<td> Row 1, Col 4</td>
						<td> Row 1, Col 5</td>
						<td> Row 1, Col 6</td>
						<td> Row 1, Col 7</td>
						<td> Row 1, Col 8</td>
					</tr>
					<tr>
						<td> Row 2, Col 1</td>
						<td> Row 2, Col 2</td>
						<td> Row 2, Col 3</td>
						<td> Row 2, Col 4</td>
						<td> Row 2, Col 5</td>
						<td> Row 2, Col 6</td>
						<td> Row 2, Col 7</td>
						<td> Row 2, Col 8</td>
					</tr>
					<tr>
						<td> Row 3, Col 1</td>
						<td> Row 3, Col 2</td>
						<td> Row 3, Col 3</td>
						<td> Row 3, Col 4</td>
						<td> Row 3, Col 5</td>
						<td> Row 3, Col 6</td>
						<td> Row 3, Col 7</td>
						<td> Row 3, Col 8 long sentence test</td>
					</tr>
					<tr>
						<td> Row 4, Col 1</td>
						<td> Row 4, Col 2</td>
						<td> Row 4, Col 3</td>
						<td> Row 4, Col 4</td>
						<td> Row 4, Col 5</td>
						<td> Row 4, Col 6</td>
						<td> Row 4, Col 7</td>
						<td> Row 4, Col 8</td>
					</tr>
					<tr>
						<td> Row 5, Col 1</td>
						<td> Row 5, Col 2</td>
						<td> Row 5, Col 3</td>
						<td> Row 5, Col 4</td>
						<td> Row 5, Col 5</td>
						<td> Row 5, Col 6</td>
						<td> Row 5, Col 7</td>
						<td> Row 5, Col 8</td>
					</tr>
					<tr>
						<td> Row 6, Col 1</td>
						<td> Row 6, Col 2</td>
						<td> Row 6, Col 3</td>
						<td> Row 6, Col 4</td>
						<td> Row 6, Col 5</td>
						<td> Row 6, Col 6</td>
						<td> Row 6, Col 7</td>
						<td> Row 6, Col 8</td>
					</tr>
					<tr>
						<td> Row 7, Col 1</td>
						<td> Row 7, Col 2</td>
						<td> Row 7, Col 3</td>
						<td> Row 7, Col 4</td>
						<td> Row 7, Col 5</td>
						<td> Row 7, Col 6</td>
						<td> Row 7, Col 7</td>
						<td> Row 7, Col 8</td>
					</tr>
					<tr>
						<td> Row 8, Col 1</td>
						<td> Row 8, Col 2</td>
						<td> Row 8, Col 3</td>
						<td> Row 8, Col 4</td>
						<td> Row 8, Col 5</td>
						<td> Row 8, Col 6</td>
						<td> Row 8, Col 7</td>
						<td> Row 8, Col 8</td>
					</tr>
					<tr>
						<td> Row 9, Col 1</td>
						<td> Row 9, Col 2</td>
						<td> Row 9, Col 3</td>
						<td> Row 9, Col 4</td>
						<td> Row 9, Col 5</td>
						<td> Row 9, Col 6</td>
						<td> Row 9, Col 7</td>
						<td> Row 9, Col 8</td>
					</tr>
					<tr>
						<td> Row 10, Col 1</td>
						<td> Row 10, Col 2</td>
						<td> Row 10, Col 3</td>
						<td> Row 10, Col 4</td>
						<td> Row 10, Col 5</td>
						<td> Row 10, Col 6</td>
						<td> Row 10, Col 7</td>
						<td> Row 10, Col 8</td>
					</tr>
					<tr>
						<td> Row 11, Col 1</td>
						<td> Row 11, Col 2</td>
						<td> Row 11, Col 3</td>
						<td> Row 11, Col 4</td>
						<td> Row 11, Col 5</td>
						<td> Row 11, Col 6</td>
						<td> Row 11, Col 7</td>
						<td> Row 11, Col 8</td>
					</tr>
				</tbody>
		</table>
```
</div>


### Information icon & Required field

이번 예제는 th테그 안에 information icon 또는  Required field을 표시하는것을 보여주는 예제 입니다. 


<div class="eg">
<div class="egview">
     <table class="Table Form-type">
            <colgroup>
                <col style="width:100px"/>
                <col />
                <col style="width:100px"/>
                <col />
                <col style="width:80px"/>
            </colgroup>
            <tbody>
                <tr>
                   <th><span class="Color-danger Padding-right-5">*</span>항목</th>
                    <td><select class="Select"><option>옵션을 선택해주세요</option></select></td>
                    <th><span class="Icon Exclamation-sign"></span><div class="Tooltip">한개이상 선택하세요.</div><span class="Margin-left-5 Display-inblock">체크박스</span></th>
                    <td><label class="ImageCheckbox">
                            <input class="Checkbox" type="checkbox" name="chk1" value = "check1" checked="checked">
                            Checked
                        </label>
                        <label class="ImageCheckbox">
                            <input class="Checkbox" type="checkbox" name="chk2" value = "check2">
                            Unchecked
                        </label>
                    </td>
                    <th rowspan="3"><button class="Button Warning">검색</button><button class="Button Default Margin-top-5">삭제</button></th>
                </tr>
                <tr>
                    <th>항목</th>
                    <td><select class="Select Margin-right-5"><option>All</option></select><input class="Textinput"></td>
                    <th>검색</th>
                    <td><label class="ImageRadio">
                            <input class="Radio" name="radio2" value="value1">radio1
                        </label>
                        <label class="ImageRadio">
                            <input class="Radio" name="radio2" value="value1">radio1
                        </label>
                    </td>
                </tr>
                <tr>
                    <th>검색조건</th>
                    <td><div class="Daterange">
                            <div class="Startdate Dateinput">
                                <input>
                            </div>
                            ~
                            <div class="Enddate Dateinput">
                                <input>
                            </div>
                        </div>
                    </td>
                    <th>검색조건</th>
                    <td>
                        <input class="Textinput Margin-right-5" placeholder="검색어를 입력하세요"><button class="Button Onlyicon"><span class="Icon Search" data-position="top"></span></button>
                    </td>
                </tr>
            </tbody>
     </table>
</div>
``` 

<table class="Table Form-type">
    <colgroup>
        <col style="width:100px"/>
        <col />
        <col style="width:100px"/>
        <col />
        <col style="width:80px"/>
    </colgroup>
    <tbody>
        <tr>
           <th><span class="Color-danger Padding-right-5">*</span>항목</th>
            <td><select class="Select"><option>옵션을 선택해주세요</option></select></td>
            <th><span class="Icon Exclamation-sign"></span><div class="Tooltip">한개이상 선택하세요.</div><span class="Margin-left-5 Display-inblock">체크박스</span></th>
            <td><label class="ImageCheckbox">
                    <input class="Checkbox" type="checkbox" name="chk1" value = "check1" checked="checked">
                    Checked
                </label>
                <label class="ImageCheckbox">
                    <input class="Checkbox" type="checkbox" name="chk2" value = "check2">
                    Unchecked
                </label>
            </td>
            <th rowspan="3"><button class="Button Warning">검색</button><button class="Button Default Margin-top-5">삭제</button></th>
        </tr>
        <tr>
            <th>항목</th>
            <td><select class="Select Margin-right-5"><option>All</option></select><input class="Textinput"></td>
            <th>검색</th>
            <td><label class="ImageRadio">
                    <input class="Radio" name="radio2" value="value1">radio1
                </label>
                <label class="ImageRadio">
                    <input class="Radio" name="radio2" value="value1">radio1
                </label>
            </td>
        </tr>
        <tr>
            <th>검색조건</th>
            <td><div class="Daterange">
                    <div class="Startdate Dateinput">
                        <input>
                    </div>
                    ~
                    <div class="Enddate Dateinput">
                        <input>
                    </div>
                </div>
            </td>
            <th>검색조건</th>
            <td>
                <input class="Textinput Margin-right-5" placeholder="검색어를 입력하세요"><button class="Button Onlyicon"><span class="Icon Search" data-position="top"></span></button>
            </td>
        </tr>
    </tbody>
</table>
```
</div>





<style>
/* The color of the highlight can be modified by the below CSS statements. */
	.af-table-row { }
	.af-table-cell { }
	.af-table-column { }
</style>
<script>
$a.page(function() {
// 초기화 함수
	this.init = function(id, param) {
		//tableSort
		//테스트 하기 위해 3초뒤에 orderBy적용 되도록 수정 2016.01.25 ys.park
		setTimeout(function() { 
			var header = $('#id')[0];
        	$('#table1').tableSort(header, 'desc');
       }, 3000); 
		//resize
		$('table').on('resize', function(e){
		    $(e.currentTarget).refresh();
		});	
		//editor
		$('#contact').find('.af-table-editor').each(function() {
		    this.value = this.innerHTML;
		});
		$('#editBtn1').click(function() {
		    addContact();
		});  
		$('#editBtn2').click(function() {
		    save();
		}); 
		$('#editBtn3').click(function() {
		    discard();
		});  
		//clear()
		$('#btn1').click(function() {
		    $('#el').clear();
		});
		$('#btn2').click(function() {
		    $('#el2').clear();
		});   
	}
});

//
		function compare_height(a, b) {
		    var a = parseInt(a[0].split('/')[0]);
		    var b = parseInt(b[0].split('/')[0]);
		    return (a-b);
		};
//
		function compare_weight(a, b) {
		    //console.log(a);
		    var a = parseInt(a[0].split('/')[1]);
		    var b = parseInt(b[0].split('/')[1]);
		    return (a-b);
		};
		function addContact() {
		    $('#contact > tbody')
		    .append('<tr><td data-editable="true"></td><td data-editable="true"></td><td data-editable="true"></td><td data-editable="true"></td></tr>');
		    $('#contact').refresh();
		};
//
		function save() {
		    $('#contact').find('[class*=af-edited]').each(function() {
			this.value = this.innerHTML;
			$(this).removeClass('af-edited');
		    });
		};
//
		function discard() {
		    $('#contact').find('[class*=af-edited]').each(function() {
			this.innerHTML = (this.value == undefined)?"": this.value;
			$(this).removeClass('af-edited');
		    });
		};
//
	</script>
