document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu({
		target: 'menu-target',
		contextmenu: true
	}).load({url: 'LoadRequest/menu.json'});
	
	
});