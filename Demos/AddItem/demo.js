document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu({
		target: 'menu-target',
		contextmenu: true
	}).load([
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
			id: 'exit'
		}
	]);

	testMenu.add({
		name: 'added after open'
	}, 0);
	
	var newItem = new Mif.Menu.Item({menu: testMenu}, {
		name: 'new item, before exit'
	});
	testMenu.add(newItem, Mif.id('exit'), 'before');
	
});