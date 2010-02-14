Class Mif.Menu.Item {#Mif.Menu.Item}
====================================
Mif.Menu item class

### Implements:
	Events

Menu Method: initalize {#Mif.Menu.Item:initialize}
--------------------------------------------------

Mif.Menu.Item constructors. Create new item instance.
	
### Syntax:

	var menuItem = new Mif.Menu.Item(structure, property);

### Arguments:

1. structure - (*object*) {menu: menu, parentItem: parentItem, submenu: submenu}
2. property  - (*object or string*) item property. If property == '-', property convert to {sep: true}. If property is some string different from '-', property convert to {desc: property}

### Property:

* name      - (*string*)
* icon      - (*string*) icon url or class (class starts with ".") For example '/images/item.gif' or '.item_icon'
* disabled  - (*boolean*: defaults to false) if true item will be disabled.
* hidden    - (*boolean*: defaults to null) if true item will be hidden
* checked   - (*boolean*: defaults to false) check state.
* group     - (*boolean*: default to null) checked items group name.
* cls       - (*string*) item extra class
* action - (*function or string*) The function to execute when user click item. String will be converted to function using eval.

### Example:

##### javascript
	new Mif.Menu.Item({
		menu: menu,
		parentItem: parentItem
	},
	{
		name: 'mif',
		checked: false
	});
	
create item with checkbox


Mif.Menu.Item Method: set {#Mif.Menu.Item:set}
----------------------------------------------
set item property

### Arguments:

1. name - (*string or object*) if one argument - string, else object
2. value  - (*mixed*) property value
	
### Example:

	menuItem.set('name', 'new name').set({
		icon: '.new-icon',
		hidden: false
	});


Mif.Menu.Menu Method: get {#Mif.Menu.Item:get}
----------------------------------------------
returns item property

### Arguments:

1. prop - (*string*) property name
	
### Example:

	menuItem.get('icon');
	
	
Mif.Menu.Menu Method: action {#Mif.Menu.Item:action}
----------------------------------------------------
execute property action function and check function if it's checkbox like item.

### Example:

	menuItem.action();