Mif.Menu.Utils
==============
utility functions required by Mif.Menu

Element Method: getAncestorOrSelf {#Element:getAncestorOrSelf}
--------------------------------------------------------------
return first matching parent or this element.

### Syntax:

	myElement.getAncestorOrSelf(match);

### Arguments:

1. match - (*string*) selector to match the element and his parents.

### Returns:

* (*element*) matching element or false.

### Examples:


##### html

	<body>
		<div id="x">
			<a href="http://mifjs.net">
				<span id="el">i'm span</span>
		</div>
	</body>
	
##### javascript
	$('el').getAncestorOrSelf('div'); //Returns div#x.
	
	
Array Method: inject {#Array:inject}
--------------------------------------------------------------
inject new item after or before current.

### Syntax:

	myArray.inject(new, current, where);

### Arguments:

1. new - item for injection
2. current - item around which inject new item
3. where - where inject item: 'before' or 'after'


### Returns:

* (*array*) this array.


Element.Events: contextmenu {#Element.Events:contextmenu}
---------------------------------------------------------
it's only for opera as it's don't support contextmenu event. Show menu on alt+left click