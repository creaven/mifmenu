document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu().attach('menu-target').load([
		{
			name: 'item1'
		},
		{
			name: 'item2',
			disabled: true
		},
		{
			name: 'item3',
			id: 'item3'
		},
		{
			name: 'submenu',
			submenu: [
				{
					options: {
						id: 'menu2',
						onCopy: function(from, to, where, copy){
							copy.set('name', 'copy of ' + copy.get('name'))
						}
					}
				},
				{
					name: 'subitem1'
				},
				{
					name: 'subitem2'
				},
				{
					name: 'subitem3',
					id: 'sub3'
				},
				{
					name: 'subitem4'
				}
			]
		}
	]);

	Mif.id('menu2').copy(Mif.id('sub3'), Mif.id('item3'), 'after');
	
});