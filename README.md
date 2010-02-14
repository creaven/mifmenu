Mif.Menu
========
mac style context menu for web applications

![Screenshot](http://github.com/creaven/mifmenu/raw/master/screenshot.png)

Supported browsers: ie7+, opera 10.10+, firefox 3.5+, safari4+, chrome4+

Description
===========

Mif.Menu - javascript menu plugin for web applications.

Usage:

	var appMenu = new Mif.Menu().attach(document.body).load([
		{
			name: 'open',
			action: function(){
				alert('open');
			}
		},
		{
			name: 'close',
			id: 'close_id',
			icon: '/path/to/icon',
			submenu: [
				{
					name: 'moo',
					action: function(){
						alert('moooooooooo')
					}
				}
			]
		},
		{
			name: 'exit',
			icon: '.someCls'
		}
	]);

	Mif.id('close_id').set('name', 'closing');