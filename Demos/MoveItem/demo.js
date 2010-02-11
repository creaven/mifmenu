document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu({
		options: {
			onClick: function(item){
				console.log('clicked', item);
			}
		}
	}).load([
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
						id: 'menu2'
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
	
	$('toggle').addEvent('click', function(event){
		testMenu.hidden ? testMenu.show(event) : testMenu.hide();
	});

	testMenu.move(testMenu.items[0], Mif.id('item3'), 'before');
	Mif.id('menu2').move(Mif.id('sub3'), Mif.id('item3'), 'after');
	
});