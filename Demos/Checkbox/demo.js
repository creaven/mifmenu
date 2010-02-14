document.addEvent('domready', function(){
	
	function jsfcheck(item, state){
		alert('checked ' + item.get('name'));
	}
	
	var testMenu = new Mif.Menu().attach('menu-target').load([
		{
			name: 'open',
			checked: true,
			check: function(item, state){
				alert(item.get('name'), state);
			},
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
						onCheck: function(item, state){
							document.id('log').adopt(
								new Element('li').set('html', item.get('name') + (state ? ' checked' : ' unchecked'))
							);
						}
					}
				},
				{
					name: 'Prototype',
					checked: false,
					group: 'jsf',
					check: jsfcheck
				},
				{
					name: 'dojo',
					checked: true,
					group: 'jsf',
					check: jsfcheck
				},
				{
					name: 'MooTools',
					checked: false,
					group: 'jsf',
					check: jsfcheck
				},
				{
					name: 'underscore',
					checked: false,
					group: 'jsf',
					check: jsfcheck
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