window.addEvent('domready', function(){
	var myMenu=new Mif.Menu({
		contextmenu: true,
		target: $('menu-target'),
		list: {
			items: [
				{
					name: 'new',
					onAction: function(){
						alert('new');
					}
				},
				{
					name: 'open',
					onAction: function(){
						alert('open');
					}
				},
				'-',
				{
					name: 'moro god?',
					disabled: true
				}
			]
		}
	});
	
	var newItem=new Mif.Menu.Item({
		name: 'new item'
	}, {list: myMenu.list});
	
	
	myMenu.list.append(1, newItem);
	
	var newItem2=new Mif.Menu.Item({
		name: 'another new item',
		onAction: function(){alert("Hello :-)")}
	}, {list: myMenu.list});
	
	myMenu.list.append(2, newItem2);
	
	var newItem3=new Mif.Menu.Item({
		name: 'another new item3',
		onAction: function(){alert("Hello :-)")}
	}, {list: myMenu.list});
	
	myMenu.list.append(4, newItem3);
	
});