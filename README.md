version 1.0 - suxx, soon i'm rewrite this plugin. Release date - 1 february.

Description
===========

Mif.Menu - javascript menu plugin for web applications.

Usage:

	var appMenu = new Mif.Menu().load([
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

	Mif.id('close_id').set({name: 'closing'});