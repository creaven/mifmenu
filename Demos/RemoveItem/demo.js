document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu().attach('menu-target').load([
		{
			name: 'open',
			action: function(){
				alert('open');
			}
		},
		{
			name: 'remove',
			disabled: true
		},
		{
			name: 'exit',
			id: 'exit',
			submenu: [
				{
					name: 'sub1',
					id: 'sub1'
				}
			]
		}
	]);

	
	testMenu.items[1].remove();
	(function(){
		Mif.id('sub1').remove();
	}).delay(3000);
});