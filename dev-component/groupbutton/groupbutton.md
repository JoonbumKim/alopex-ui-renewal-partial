

# GroupButton

## Basic

GroupButton은 여러 개의 버튼이 하나의 컴포넌트로 묶여있는 컴포넌트입니다.

<div class="eg">
<div class="egview">
	<div class="Groupbutton">
	    <button class="Button">btn1</button> 
	    <button class="Button">btn2</button> 
	    <button class="Button">btn3</button> 
	    <button class="Button">btn4</button> 
	</div>
</div>

```
<div class="Groupbutton">
    <button class="Button">btn1</button> 
    <button class="Button">btn2</button> 
    <button class="Button">btn3</button> 
    <button class="Button">btn4</button> 
</div>
```
</div>

### Align

"Vertical" 클래스를 추가하면 그룹 버튼의 방향을 조정할 수 있습니다.

<div class="eg">
<div class="egview">
	<div class="Groupbutton Vertical">
	    <button class="Button">btn1</button> 
	    <button class="Button">btn2</button> 
	    <button class="Button">btn3</button> 
	    <button class="Button">btn4</button> 
	</div>
</div>

```
<div class="Groupbutton Vertical">
    <button class="Button">btn1</button> 
    <button class="Button">btn2</button> 
    <button class="Button">btn3</button> 
    <button class="Button">btn4</button> 
</div>
```
</div>
### Radio Buttons

그룹 버튼을 라디오 버튼처럼 활용할 수 있습니다.

<div class="eg">
<div class="egview">
	<div class="Groupbutton">
	    <label class="Button">
	        <input class="Radio" name="radio1" value="value1">Radio1
	    </label>
	    <label class="Button">
	        <input class="Radio" name="radio1" value="value2">Radio2
	    </label>
	    <label class="Button">
	        <input class="Radio" name="radio1" value="value3">Radio3
	    </label>
	    <label class="Button">
	        <input class="Radio" name="radio1" value="value4">Radio4
	    </label>
	</div>
</div>


```
<div class="Groupbutton">
    <label class="Button">
        <input class="Radio" name="radio1" value="value1">Radio1
    </label>
    <label class="Button">
        <input class="Radio" name="radio1" value="value2">Radio2
    </label>
    <label class="Button">
        <input class="Radio" name="radio1" value="value3">Radio3
    </label>
    <label class="Button">
        <input class="Radio" name="radio1" value="value4">Radio4
    </label>
</div>
```
</div>

### Checkbox Buttons

그룹 버튼을 체크박스처럼 활용할 수 있습니다.

<div class="eg">
<div class="egview">
<div class="Groupbutton">
    <label class="Button">
        <input class="Checkbox" name="radio1" value="value1">checkbox1</label>
    <label class="Button">
        <input class="Checkbox" name="radio1" value="value2">checkbox2</label>
    <label class="Button">
        <input class="Checkbox" name="radio1" value="value3">checkbox3</label>
    <label class="Button">
        <input class="Checkbox" name="radio1" value="value4">checkbox4</label>
</div></div>


```
<div class="Groupbutton">
    <label class="Button">
        <input class="Checkbox" name="radio1" value="value1">checkbox1</label>
    <label class="Button">
        <input class="Checkbox" name="radio1" value="value2">checkbox2</label>
    <label class="Button">
        <input class="Checkbox" name="radio1" value="value3">checkbox3</label>
    <label class="Button">
        <input class="Checkbox" name="radio1" value="value4">checkbox4</label>
</div>
```
</div>

## Attributes
 
 
### class

- "Groupbutton"  
	- GroupButton 컴포넌트를 사용한다고 명시하는 속성입니다.
	


## Functions


### .setOrient (string)

토글 버튼을 사용할 시 체크 상태를 동적으로 변경하는 함수입니다.

- parameter
	- "horizontal"  
		- 그룹 버튼이 가로 정렬 됩니다.
	- “vertical”
		- 그룹 버튼이 세로 정렬 됩니다.

### .setEnabled (isEnabled)

그룹 버튼의 활성화/비활성화를 동적으로 조정할 때 사용하는 함수입니다.

- parameter
	- isEnabled {Boolean} Required  
		- 설정된 값에 의해서 버튼이 활성화/비활성화 됩니다.
	
