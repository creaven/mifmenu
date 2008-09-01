Class Mif.Menu {#Mif.Menu}
==========================
Create javascript Menu control.

### Implements:
	Events, Options

Menu Method: constructor {#Mif.Menu:constructor}
------------------------------------------------
	
### Syntax:

	var myMenu = new Mif.Menu(options);

### Arguments:

1. options  - (*object*) Mif.Menu options.

### Options:

* isSubMenu  - (*boolean*) true if it's subMenu.

### Events:

* toggle(node, state) - Function to execute when expand or collapse node. On expand state=true, on collapse state=false

### Properties:

* activeSubMenu - current displayed sub menu.


### Example:

##### javascript
	var testMenu=new Mif.Menu({
		types:{
			nodeType:{
				openIcon: 'node-open-icon',//node-open-icon - css class for open icon.
				closeIcon: 'node-close-icon'
			}
		},
		dfltType: 'nodeType'
	});
	testMenu.load({
		[
			{
				property: {name: 'root'},
				children:[
					{
						property:{name:'node1'}
					},
					{
						property:{name:'node2'},
						children:[
							{property:{name:'node2.1'}}
						]
					}
				]
			}
		]
	});
	testMenu.addEvent('onToggle',function(node, state){
		alert('Node '+node.name+(state ? 'expanded' : 'collapsed'));
	});
	

##### resulting Menu:

    root
	 |_
	   |-node1
	   |-node2
	      |-node2.1




	
Mif.Menu Method: scrollTo {#Mif.Menu:scrollTo}
----------------------------------------------

Scrolls the node into view.

### Syntax: 
	
	myMenu.scrollTo(someNode);

### Arguments:

1. node - (*Mif.Menu.Node*) node which will scrolled into view.

### Note: 
	This function used in Mif.Menu.Drag and Mif.Menu.Transform.
