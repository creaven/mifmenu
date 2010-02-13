Class Mif.Menu.Item {#Mif.Menu.Item}
==========================
item for Mif.Menu.List.

### Implements:
	Events, Options

Menu Method: constructor {#Mif.Menu.Item:constructor}
-----------------------------------------------------

Mif.Menu.Item constructors. Create new item instance.
	
### Syntax:

	var menuItem = new Mif.Menu.Item(options, structure);

### Arguments:

1. options  - (*object*) Mif.Menu.Item options
2. structure - (*object*) {list: list}

### Options:

* checked   - (*boolean*: defaults to false) default check state for item with type checkbox or radio.
* disabled  - (*boolean*: defaults to false) if true item will be disabled.
* group     - (*boolean*: default to null) for items with type radio, this is group which contains this items.

### Events: 

* action - (*function or string*) The function to execute when user click item. String will be converted to function using eval.

### Example:

##### javascript
	new Mif.Menu.Item({
		type: 'checkbox',
		checked: true
	},{list: list});
	
create checkbox item


Menu Method: disable {#Mif.Menu.Item:disable}
---------------------------------------------
disable item
	
### Syntax:

	menuItem.disable();


Menu Method: enable {#Mif.Menu.Item:enable}
-------------------------------------------
enable item
	
### Syntax:

	menuItem.enable();