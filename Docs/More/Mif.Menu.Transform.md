Mif.Menu.Transform {#Mif.Menu.Transform}
========================================

implements move, copy, remove, connect, disconnect methods for manipulate with menu.


Class Mif.Menu {#Mif.Menu::Transform}
=====================================


Mif.Menu Method: move {#Mif.Menu:move}
--------------------------------------

Move this item after, before or inside another.

### Syntax:

	menu.move(thisItem, item, where);
	
### Arguments:

1. thisItem - (*Mif.Menu.Item*) this item.
2. item - (*Mif.Menu.Item*) item relative which inject this item.
3. where - (*string: defaults to after*) the place to inject this item.

### Events:

* move(source, destination, where) - Function to execute when item moved. where=before||after.

### Returns:

* (*Mif.Menu*) this menu.

### Examples:

##### example menu
	
	   |- item1 -|
	   |- item2 -|-|- item2.1 -|
	   |- item3 -| |- item2.2 -|
       |- item4 -| |- item2.3 -|
       |- item5 -|
	   
##### JavaScript

	menu.move(item2.2, item3, 'after')
	
##### Resulting menu

	|- item1  -|
	|- item2  -|-|- item2.1 -|
	|- item3  -| |- item2.3 -|
	|- item2.2-|
	|- item4  -|
	|- item5  -|


Mif.Menu Method: copy {#Mif.Menu:copy}
--------------------------------------

copy this item after, before or inside another.

### Syntax:

	menu.copy(thisItem, item, where);
	
### Arguments:

1. thisItem - (*Mif.Menu.Item*) item which will be copied.
2. item - (*Mif.Menu.Item*) item relative which inject this item.
3. where - (*string: defaults to after*) the place to inject this item.

### Events:

* copy(source, destination, where, copy) - Function to execute when item moved. where=before||after.

### Returns:

* (*Mif.Menu*) menu.

### Examples:

##### example menu
	
	   |- item1 -|
	   |- item2 -|-|- item2.1 -|
	   |- item3 -| |- item2.2 -|
       |- item4 -| |- item2.3 -|
       |- item5 -|
	   
##### JavaScript

	menu.copy(item2.2, item3, 'after')
	
##### Resulting menu

	|- item1  -|
	|- item2  -|-|- item2.1 -|
	|- item3  -| |- item2.2 -|
	|- item2.2-| |- item2.3 -|
	|- item4  -|
	|- item5  -|


Mif.Menu Method: remove {#Mif.Menu:remove}
------------------------------------------

remove this item.

### Syntax:

	menu.remove(thisItem);
	
### Events:

* remove(item) - Function to execute when item removed.
	

### Example:

##### example menu
	
	|- item1 -|
	|- item2 -|
	|- item3 -|
	|- item4 -|
	|- item5 -|
	   
##### JavaScript

	menu.remove(item3);

##### resulting menu
	
	|- item1 -|
	|- item2 -|
	|- item4 -|
	|- item5 -|


Mif.Menu Method: add {#Mif.Menu:add}
--------------------------------------

Add new item.

### Syntax:

	menu.add(item, current, where);
	
### Arguments:

1. item - (*Mif.Menu.Item or object or number*) Mif.Menu.Item or item properties, or item number.
2. current - (*Mif.Menu.Item*) item relative which add new item.
3. where - (*string: defaults to after*) the place to add this item.

### Events:

* add(newItem, current, where) - Function to execute when item added.

### Returns:

* (*Mif.Menu*) menu.

### Examples:

##### example menu
	
	|- item1 -|
	|- item2 -|
	|- item3 -|
	|- item4 -|
	|- item5 -| 
	   
##### JavaScript

	menu.add({
		name: 'moro'
	}, item1, 'before');
	
##### resulting menu
	
	|- moro  -|
	|- item1 -|
	|- item2 -|
	|- item3 -|
	|- item4 -|
	|- item5 -| 
	   
	
Mif.Menu Method: connect {#Mif.Menu:connect}
--------------------------------------------

used to connect submenu to some item.

### Syntax:

	submenu.connect(item);

### Arguments:

1. item - (*Mif.Menu.Item*) submenu parentItem.

### Events:

* connect(item) - Function to execute when connect menu.

### Returns:

* (*Mif.Menu*) submenu.

### Examples:

##### example menu

	|- item1 -|
	|- item2 -|
	|- item3 -|
	|- item4 -|
	|- item5 -| 
	
##### example submenu

	|- subitem1 -|
	|- subitem2 -|

##### JavaScript

	submenu.connect(item3);

##### resulting menu


	|- item1 -|
	|- item2 -|
	|- item3 -|-|- subitem1 -|
	|- item4 -| |- subitem2 -|
	|- item5 -| 


Mif.Menu Method: disconnect {#Mif.Menu:disconnect}
--------------------------------------------

used to remove submenu.

### Syntax:

	submenu.disconnect(item);

### Arguments:

1. item - (*Mif.Menu.Item*) submenu parentItem.

### Events:

* disconnect(item) - Function to execute when remove submenu.

### Returns:

* (*Mif.Menu*) submenu.

### Examples:

##### example menu

	|- item1 -|
	|- item2 -|
	|- item3 -|-|- subitem1 -|
	|- item4 -| |- subitem2 -|
	|- item5 -|

##### JavaScript

	submenu.disconnect();

##### resulting menu

	|- item1 -|
	|- item2 -|
	|- item3 -|
	|- item4 -|
	|- item5 -| 


	

Class Mif.Menu.Item {#Mif.Menu.Item::Transform}
===============================================


(private) Mif.Menu.Item Method: inject {#Mif.Menu.Item:inject}
--------------------------------------------------------------

inject this item after or before another. It's **private** method. You should use Mif.Menu:move instead.

### Syntax:

	thisItem.inject(item, where);
	
### Arguments:

1. item - (*Mif.Menu.Item*) item relative which inject this item.
2. where - (*string*) the place to inject this item.

### Returns:

* (*Mif.Menu.Item*) this item.
   
### Note:
It's private method. You should use Mif.Menu:move instead.



(private) Mif.Menu.Item Method: copy {#Mif.Menu.Item:copy}
----------------------------------------------------------

inject copy of this item after or before another. It's **private** method.

### Syntax:

	thisItem.copy(item, where);
	
### Arguments:

1. item - (*Mif.Menu.Item*) item relative which inject copy of this item.
2. where - (*string*) the place to inject this item.

### Returns:

* (*Mif.Menu.Item*) this item.


### Note:
It's private method. You should use Mif.Menu:copy instead.


Mif.Menu.Item Method: remove {#Mif.Menu.Item:remove}
----------------------------------------------------
remove this item.

### Syntax:

	thisItem.remove();
	
