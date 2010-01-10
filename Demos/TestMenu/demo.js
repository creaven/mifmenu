document.addEvent('domready', function(){
	var testMenu = new Mif.Menu().load([
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
	        icon: '.someCls'
	    }
	]);
});