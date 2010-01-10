/*
Mif.Menu
*/


Mif.Menu=new Class({
	
	version: '1.2',

	Implements: [Events, Options],
	
	options: {
		
	},

	initialize: function(options){
		this.setOptions(options);
		this.element = new Element('div', {'class': 'mif-menu'});
		
		/*
		this.target=this.options.target ? $(this.options.target) : document;
		this.showed=[];
		this.visible=[];
		this.hidden=true;
		
		if(this.options.offsets){
			$extend(this.options.list, this.options.offsets);
		}		
		
		this.bound={
			escape: this.escape.bind(this),
			close: this.close.bind(this)
		};		
		this.addEvent('hide', function(){
			this.closing=false;
			this.hidden=true;
			document.removeEvent('keyup', this.bound.escape);
			document.removeEvent('mousedown', this.bound.close);
		}, true);
		this.addEvent('show', function(){
			this.hidden=false;
			document.addEvent('keyup', this.bound.escape);
			document.addEvent('mousedown', this.bound.close);
		}, true);
		*/
		this.events();
		if (MooTools.version>='1.2.2' && this.options.initialize) this.options.initialize.call(this);
	},
	
	show: function(obj){
		this.closing=false;
		this.list.show(obj);
		return this.fireEvent('show');
	},
	
	hide: function(){
		this.closing=true;
		this.list.hide();
	},
	
	events: function(){
		if(this.options.contextmenu){
			this.target.addEvent('contextmenu', function(event){
				this.show(event);
				return false;
			}.bind(this));
		};
	},
	
	close: function(event){
		if(this.$attaching) return;
		if(this.list.visible) this.hide();
	},
	
	escape: function(event){
		if(event.key!='esc') return;
		var list=this.showed.getLast();
		if(list) list.hide();
	},
	
	isVisible: function(){
		return !this.hidden;
	},
	
	attachTo: function(el){
		el=$(el);
		el.addEvents({
		
			'mousedown': function(event){
				if(event.rightClick) return;
				if(!this.isVisible()){
					this.$attaching=true;
					var coords=el.getCoordinates();
					this.show({x: coords.left, y: coords.bottom});
					this.el=el;
				}else{
					this.hide();
				}
			}.bind(this),
			
			'mouseup': function(event){
				this.$attaching=false;
			}.bind(this)
			
		});
		return this;
	}
	
});
