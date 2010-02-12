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
			id: 'open',
			action: function(){
				alert('open');
			}
		},
		{
			name: 'close',
			id: 'close',
			icon: 'TestMenu/application-blue.png'
		},
		{
			name: 'new window',
			id: 'new',
			disabled: true,
			icon: '.form',
			action: function(item){
				alert(item.get('name'));
			}
		},
		'-',
		{
			name: 'new tab',
			disabled: true
		},
		{
			name: 'copy',
			id: 'copy'
		},
		{
			name: 'remove',
			disabled: true
		},
		{
			name: 'exit',
			disabled: true
		}
	]);
	
	$('toggle').addEvent('click', function(event){
		testMenu.hidden ? testMenu.show(event) : testMenu.hide();
	});
	
	(function(){
		Mif.id('open').set({name: 'new open name disabled'}).set('disabled', true);
		Mif.id('close').set('name', 'new close name').set('icon', '.form');
		Mif.id('new').set('disabled', false).set('icon', 'TestMenu/application-blue.png');
		Mif.id('copy').set('hidden', true);
	}).delay(3000);
	
	
});