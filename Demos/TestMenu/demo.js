document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu().attach('menu-target').load([
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
				},
				{
					name: 'underscore',
					action: function(){
						alert('underscore.js')
					},
					submenu: [
						{
							name: 'Mif',
							id: 'Mif',
							action: function(){
								alert('Mif.js')
							}
						}
					]
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
			name: 'new tab',
			disabled: true
		},
		{
			name: 'paste'
		},
		{
			name: 'copy',
			submenu: [
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
				},
				{
					name: 'underscore',
					action: function(){
						alert('underscore.js')
					}
				},
				{
					name: 'node',
					action: function(){
						alert('node.js')
					}
				}
			]
		},
		{
			name: 'remove',
			disabled: true
		},
		{
			name: 'exit'
		}
	
	]);
	
	
});