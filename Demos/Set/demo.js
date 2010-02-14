document.addEvent('domready', function(){
	
	var testMenu = new Mif.Menu().attach('menu-target').load([
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
	
	(function(){
		Mif.id('open').set({
			name: 'new open name disabled',
			disabled: true,
			cls: 'moo'
		});
		Mif.id('close').set('name', 'new close name').set('icon', '.form');
		Mif.id('new').set('disabled', false).set('icon', 'TestMenu/application-blue.png');
		Mif.id('copy').set('hidden', true);
	}).delay(3000);
	
	
});