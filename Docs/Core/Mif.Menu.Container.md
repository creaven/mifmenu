Mif.Menu.Container
==================
shadow imitation using box:{background-color: #777; blur: 3px; opacity: opacity}. Idea - Ext.Shadow http://extjs.com

### Implements:
	Options

Mif.Menu.Container Method: constructor {#Mif.Menu.Container:constructor}
------------------------------------------------------------------------
	
### Syntax:

	var container = new Mif.Menu.Container(options);

### Arguments:

1. options  - (*object*) container options

### Options:

* morph     - (*object*) Fx.Morph options, used for morph container.
* offsets   - (*object*: defaults to {t: -5, r: 5, b: 5, l: -5})  shadow offsets from 'top', 'right', 'bottom' and 'left' sides.
* opacity   - (*number*: defaults to 1) shadow opacity.
* id        - (*string*) container id.
* className - (*className*) container css class name.

Mif.Menu.Container Method: setStyle {#Mif.Menu.Container:setStyle}
------------------------------------------------------------------
Sets a CSS property to the container element

### Syntax:

	container.setStyle(style, value);
	
### Arguments:

1. style - (*string*) css style apply to container
2. value - (*string*) css style value

### Example:

	container.setStyle('background-color', 'blue');
	

Mif.Menu.Container Method: setStyles {#Mif.Menu.Container:setStyles}
--------------------------------------------------------------------
Applies a collection of styles to the container.

### Syntax:

	container.setStyles(styles);
	
### Arguments:

1. styles - (*object*) An object of property/value pairs for all the styles to apply.

### Example:

	container.setStyles({
		'background-color': 'blue',
		'color': 'red'
	});

	
Mif.Menu.Container Method: setContent {#Mif.Menu.Container:setContent}
----------------------------------------------------------------------
set content to this container

### Syntax:

	container.setContent(content);
	
### Arguments:

1. content - (*mixed*) element(s) or html sets inside this container.

### Example:

	container.setContent(myEl);

	
Mif.Menu.Container Method: inject {#Mif.Menu.Container:inject}
--------------------------------------------------------------
inject container

### Syntax:

	container.inject(element, how);
	
### Arguments:

1. element - (*element*) element around which inject container.
2. how - (*string*: defaults to 'bottom') The place to inject container. Can be 'top', 'bottom', 'after', or 'before'.

### Example:

	container.setContent(myEl, 'after');//inject container after myEl

	
Mif.Menu.Container Method: setPosition {#Mif.Menu.Container:setPosition}
------------------------------------------------------------------------
set container position

### Syntax:

	container.setPosition(position);
	
### Arguments:

1. position - (*object*) container position

### Example:

	container.setPosition({x:20, y:30});
