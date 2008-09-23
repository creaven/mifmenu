Function Mif.Menu.List {#Mif.Menu.List::function}
=================================================
return menu list class.

### Syntax:

	var List=Mif.Menu.List(skin);
	
### Arguments:

1. skin - (*object*) optional, menu skin. Object with 2 properties: container and options. Container may be Mif.Menu.Container or ART.Container.

### Returns:

	return menu list class.

Class List {#List}
==================
create menu list

### Implements:
	Events, Options

List Method: constructor {#List:constructor}
--------------------------------------------
menu list constructor

### Syntax:

	var myMenu = new List(options, structure);

### Arguments:

1. options  - (*object*) List options
2. structure     - (*object*) {menu: menu}

### Options:

* items - (*object*: defaults to 'default') items which contains this list
* offsets - (*object*) {x: offsetX, y:offsetY} list offsets.

### Events:

* check - (*function*)  The function to execute when checkbox state changed. First argument - item, second - state.
* radioCheck - (*function*)  The function to execute when radio state changed. First argument - item, second - state.

### Example:

	var myList=new List({
		onCheck: function(item, state){
			alert(item.name+(state ? ' checked' : 'unchecked'));
		},
		items: [
			{
				name: 'folder',
				type: 'checkbox'
			},
			{
				name: 'item'
			},
			'-',
			{
				name: 'moro is god?',
				disabled: true
			}
		]
	});
		

List Method: append {#List:append}
----------------------------------
add item to list

### Syntax:

	myList.append(index, item);

### Arguments:

1. index  - (*number*) index of item after which add this item
2. item   - (*Mif.Menu.Item*) this item

List Method: select {#List:select}
----------------------------------
select this item

### Syntax:

	myList.select(item);

### Arguments:

1. item   - (*Mif.Menu.Item*) item for selection

List Method: unselect {#List:unselect}
--------------------------------------
unselect selected item

### Syntax:

	myList.unselect();

