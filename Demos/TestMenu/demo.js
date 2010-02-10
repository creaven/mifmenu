document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu().load([
		{
			options: {
				onClick: function(item){
					console.log('clicked', item);
				}
			}
		},
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
					name: 'underscore',
					action: function(){
						alert('underscore.js')
					},
					submenu: [
						{
							name: 'Mif',
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
			icon: '.someCls'
		},
		{
			name: 'new tab',
			disabled: true,
			icon: '.someCls'
		},
		{
			name: 'new tab',
			icon: '.someCls'
		},
		{
			name: 'paste',
			icon: '.someCls'
		},
		{
			name: 'copy',
			icon: '.someCls',
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
			disabled: true,
			icon: '.someCls'
		},
		{
			name: 'exit',
			icon: '.someCls'
		}
	
	]);
	
	$('toggle').addEvent('click', function(event){
		testMenu.hidden ? testMenu.show(event) : testMenu.hide();
	});
	
});