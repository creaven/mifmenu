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
			name: 'remove',
			disabled: true
		},
		{
			name: 'exit',
			id: 'exit'
		}
	]);
	
	$('toggle').addEvent('click', function(event){
		testMenu.hidden ? testMenu.show(event) : testMenu.hide();
	});
	
	testMenu.add({
		name: 'added after open'
	}, 0);
	
	var newItem = new Mif.Menu.Item({menu: testMenu}, {
		name: 'new item, before exit'
	});
	testMenu.add(newItem, Mif.id('exit'), 'before');
	
});