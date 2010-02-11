document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu({
		options: {
			onClick: function(item){
				console.log('clicked', item);
			}
		}
	}).load([
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
					name: 'dojo2',
					action: function(){
						alert('dojo.js')
					}
				},
				{
					name: 'MooTools2',
					action: function(){
						alert('mootools-core.js')
					}
				},
				{
					name: 'dojo3',
					action: function(){
						alert('dojo.js')
					}
				},
				{
					name: 'MooTools3',
					action: function(){
						alert('mootools-core.js')
					}
				},
				{
					name: 'dojo4',
					action: function(){
						alert('dojo.js')
					}
				},
				{
					name: 'MooTools4',
					action: function(){
						alert('mootools-core.js')
					}
				},
				{
					name: 'dojo5',
					action: function(){
						alert('dojo.js')
					}
				},
				{
					name: 'MooTools5',
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
		{
			name: 'new tab',
			disabled: true
		},
		{
			name: 'new tab'
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
	
	$('toggle').addEvent('click', function(event){
		testMenu.hidden ? testMenu.show(event) : testMenu.hide();
	});
	
	
});