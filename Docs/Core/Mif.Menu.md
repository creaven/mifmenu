Class Mif.Menu {#Mif.Menu}
==========================
Create javascript Menu control.

### Implements:
	Events, Options

Mif.Menu Method: constructor {#Mif.Menu:constructor}
----------------------------------------------------
menu constructor
	
### Syntax:

	var myMenu = new Mif.Menu(options, skin);

### Arguments:

1. options  - (*object*) Mif.Menu options
2. skin     - (*object*) optional, menu skin. Object with 2 properties: container and options. Container may be Mif.Menu.Container or ART.Container. See also: Mif.Menu.Container.

### Options:

* skin - (*string*: defaults to 'default') menu skin, may be 'default' or 'art'. Default use container with drop shadow Mif.Menu.Container and art use ART.Container with canvas based grafic.
* list - (*object*) menu list options. See Mif.Menu.List for more info
* contextmenu -  (*boolean*: defaults to false) show menu on contextmenu event
* target - (*element*) contextmenu event area
* offsets - (*object*) {x: offsetX, y:offsetY} first menu list offsets.

### Events:

* show - (*function*)  The function to execute when menu shown.
* hide - (*function*)  The function to execute when menu hidden.

### Example:

##### html

	<div id="menu-target"></div>

##### javascript

	new Mif.Menu({
		contextmenu: true,
		target: $('menu-target'),
		list: {
			items: [
				{
					name: 'new',
					onAction: function(){
						alert('new');
					}
				},
				{
					name: 'open',
					onAction: function(){
						alert('open');
					}
				},
				'-',
				{
					name: 'moro is god?',
					disabled: true
				}
			]
		}
	});
	
Creates context menu with 3 items. Third item disabled and separated from first and second. Menu is displayed inside div#menu-target element


Mif.Menu Method: show {#Mif.Menu:show}
--------------------------------------
show menu at some point or mouse
	
### Syntax:

	myMenu.show(coords);

### Arguments:

1. coords  - (*object*) x/y coords or Event object.


Mif.Menu Method: hide {#Mif.Menu:hide}
--------------------------------------
hide menu
	
### Syntax:

	myMenu.hide();



Mif.Menu Method: isVisible {#Mif.Menu:isVisible}
------------------------------------------------
return true if menu visible
	
### Syntax:

	myMenu.isVisible();



Mif.Menu Method: attachTo {#Mif.Menu:attachTo}
----------------------------------------------
attach menu to this element
	
### Syntax:

	myMenu.attachTo(element);
	
### Arguments:

1. element - (*element*) dom element to which attach menu

