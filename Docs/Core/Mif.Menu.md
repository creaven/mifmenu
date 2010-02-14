Class Mif.Menu {#Mif.Menu}
==========================
Create javascript Menu control.

### Implements:
	Events, Options

Mif.Menu Method: initialize {#Mif.Menu:initialize}
----------------------------------------------------
menu constructor
	
### Syntax:

	var myMenu = new Mif.Menu(options);

### Arguments:

1. options  - (*object*) Mif.Menu options

### Options:

* offsets          - (*object*) {x: offsetX, y:offsetY} menu offsets.
* id               - (*string*) - menu id
* minWidth         - (*number*) min menu width
* submenuOffsets   - (*object*) submenu offsets
* submenuShowDelay - (*number*) submenu show delay
* limits           - (*object*) {top: top, bottom: bottom} menu will be showed inside [top, window.height - bottom]


### Events:

* show  - (*function*)  The function to execute when menu shown.
* hide  - (*function*)  The function to execute when menu hidden.
* focus - (*function*) The function to execute when menu get focus.
* blur  - (*function*) The function to execute when menu loses focus.

### Property:
* hidden - (*boolean*) true if menu hidden else false

### Example:

##### html

	<div id="menu-target"></div>

##### javascript

	new Mif.Menu().attach('menu-target').load([
		{
			name: 'open',
			action: function(){
				alert('open');
			}
		},
		{
			name: 'close',
			id: 'close_id',
			icon: 'TestMenu/application-blue.png',
			submenu: [
				{
					options: {
						onAction: function(item){
							console.log(item.get('name'));
						}
					}
				}
				'<b>javascript frameworks</b>',
				{
					name: 'Prototype',
					action: function(){
						alert('prototype.js')
					}
				},
				{
					name: 'dojo',
					action: function(){
						alert('dojo.js')
					}
				},
				{
					name: 'MooTools',
					action: function(){
						alert('mootools-core.js')
					}
				}
			]
		},
		{
			name: 'new window',
			disabled: true,
			icon: '.form'
		},
		'-',
		{
			name: 'new tab'
		},
		{
			name: 'paste'
		},
		{
			name: 'remove',
			disabled: true
		}
	]);
	
Creates context menu with submenu. Last item disabled. Last 3 items separated from first. Menu is displayed inside div#menu-target element


Mif.Menu Method: show {#Mif.Menu:show}
--------------------------------------
show menu at some point or mouse or item
	
### Syntax:

	myMenu.show(coords);

### Arguments:

1. coords  - (*object on null*) x/y coords or Event object. If null, showed as submenu.


Mif.Menu Method: hide {#Mif.Menu:hide}
--------------------------------------
hide menu
	
### Syntax:

	myMenu.hide();

	
Mif.Menu Method: close {#Mif.Menu:close}
--------------------------------------
hide menu and all parent menu.

### Syntax:

	myMenu.close();
	
	
Mif.Menu Method: focus {#Mif.Menu:focus}
--------------------------------------
focus menu

### Syntax:

	myMenu.focus();


Mif.Menu Method: blur {#Mif.Menu:blur}
--------------------------------------
blur menu

### Syntax:

	myMenu.blur();
		

Mif.Menu Method: attach {#Mif.Menu:attach}
----------------------------------------------
attach context menu to this element. Opera use shift+left instead contextmenu event.
	
### Syntax:

	myMenu.attach(element);
	
	
Mif.Menu Method: detach {#Mif.Menu:detach}
----------------------------------------------
detach context menu

### Syntax:

	myMenu.detach();


