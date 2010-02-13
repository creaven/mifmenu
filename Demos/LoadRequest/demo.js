document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu({
		onAction: function(item){
			console.log('clicked', item);
		}
	}).load({url: 'LoadRequest/menu.json'});
	
	$('toggle').addEvent('click', function(event){
		testMenu.hidden ? testMenu.show(event) : testMenu.hide();
	});
	
	
});