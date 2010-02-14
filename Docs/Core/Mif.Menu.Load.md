Mif.Menu.Load {#Mif.Menu.Load}
==============================
Mif.Menu.Load object contains functions used for load items.


(private) Function: Mif.Menu.Load.menu {#Mif.Menu.Load:Mif.Menu.Load.menu}
--------------------------------------------------------------------------
	
Load children from json object. JSON object structure:

	[	
		{
			options:{
				//submenu options
			}
		},
		{
			"name": 'item1',
			"icon": 'mooooo.gif',
			"submenu": [
				(items)
			]
		},
		...
		{
			"name": 'itemN',
			"icon": 'mif.gif'
		}
	]
	
### Syntax:

	Mif.Menu.Load.menu(json, parent, menu);

### Arguments:

1. json  - (*object*) json items object.
2. parent - (*Mif.Menu.Item*) parent submenu item.
3. menu - (*Mif.Menu or object*) menu class or json.

### Example:

	json = [	
		{
			"name": 'item1',
			"icon": 'mooooo.gif',
			"submenu": [
				(items)
			]
		},
		...
		{
			"name": 'itemN',
			"icon": 'mif.gif'
		}
	]
	Mif.Menu.Load.menu(json, someItem, json);



	
Mif.Menu {#Mif.Menu::Load}
==========================

### Events:
* load         - Function to execute when menu loaded.
* loadItem     - Function to execute when menu item submenu loaded.
	
Mif.Menu Method: load {#Mif.Menu:load}}
---------------------------------------

load menu from json and load json if it's neccesary.

### Syntax:

	myMenu.load(options);
	
### Arguments:

1. options - (*object or string*) Request.JSON options or json or url.

### Returns:

* (*Mif.Menu*) MyMenu

### Example:
	
	myMenu.load('menu.json');

### Note:
Default options can be setted in loadOptions function in Mif.Menu options.

Mif.Menu.Item {#Mif.Menu.Item::Load}
====================================
	
Mif.Menu.Item Method: load {#Mif.Menu.Item:load}
------------------------------------------------

load menu from json and load json if it's neccesary.

### Syntax:

	someItem.load(options);
	
### Arguments:

1. options - (*object or string*) Request.JSON options or json or url.

### Returns:

* (*Mif.Menu.Item*) this item

### Events:

* load  - Function to execute when item loaded.

### Example:
	
	someItem.load();

### Note:
Default options can be setted in loadOptions function in Mif.Menu options.
