window.addEvent('domready', function(){
	new Mif.Menu({
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
});