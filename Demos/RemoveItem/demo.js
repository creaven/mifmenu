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
	
	testMenu.items[1].remove();
	
});