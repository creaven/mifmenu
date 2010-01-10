document.addEvent('domready', function(){
	var testMenu = new Mif.Menu().load([
		onClick: function(item){
			console.log('clicked', item);
		},
	    {
	        name: 'open',
	        action: function(){
	            alert('open');
	        }
	    },
	    {
	        name: 'close',
	        id: 'close_id',
	        icon: '/path/to/icon',
	        submenu: [
	            {
	                name: 'moo',
	                action: function(){
	                    alert('moooooooooo')
	                }
	            }
	        ]
	    },
	    {
	        name: 'exit',
			disabled: true,
	        icon: '.someCls'
	    }
	]);
});