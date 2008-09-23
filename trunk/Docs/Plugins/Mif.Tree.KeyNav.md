Mif.Menu.KeyNav {#Mif.Menu.KeyNav}
==================================

Implement key navigation. Walk with ['up','down','left','right'] keys.

### Example:

	var menuWithKeyNav = new Mif.Menu({
							initialize: function(){
								new Mif.Menu.KeyNav(this);
							},
							//...other options
						});