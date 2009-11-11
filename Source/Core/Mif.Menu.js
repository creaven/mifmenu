/*
Mif.Menu
*/

if(!window.Mif) var Mif={};

Mif.Menu=new Class({

	Implements: [Events, Options],
	
	options: {
		skin: 'default'
	},

	initialize: function(options, skin){
		this.setOptions(options);
		this.target=this.options.target ? $(this.options.target) : document;
		this.showed=[];
		this.visible=[];
		this.hidden=true;
		if(!skin){
			switch(this.options.skin){
				case 'ART':
				case 'art': skin={
					container: ART.Container, 
					options: {
						className: 'mif-menu-art', 
						offsets:{x:-2, y:-3},
						theme: new ART.Theme({
							normal: {
								
								radius: 4,
								reflection: 0,

								overlayColor: '#fff',
								overlayOpacity: 0.9,
								borderOpacity: 0.2,
								shadow:8
								
							}
						})
					}
				}; break;
				case 'default': 
				default: skin={container: Mif.Menu.Container, options: {className: 'mif-menu-default', offsets:{x:-2, y:0}}};
			};
		};
		if(window.ART && Browser.Engine.trident && skin.container==ART.Container){
			skin.options.morph={duration:0};//because vml opacity with filter opacity=bug
		};
		this.List=Mif.Menu.List(skin);
		
		if(this.options.offsets){
			$extend(this.options.list, this.options.offsets);
		}
		this.list=new this.List(this.options.list, {menu: this});
		
		
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
		
		this.initEvents();
		if (MooTools.version>='1.2.2' && this.options.initialize) this.options.initialize.call(this);
	},
	
	close: function(event){
		if(this.$attaching) return;
		if(this.list.visible) this.hide();
	},
	
	initEvents: function(){
		if(this.options.contextmenu){
			this.target.addEvent('contextmenu', function(event){
				this.show(event);
				return false;
			}.bind(this));
		};
	},
	
	show: function(obj){
		this.closing=false;
		this.list.show(obj);
		return this.fireEvent('show');
	},
	
	escape: function(event){
		if(event.key!='esc') return;
		var list=this.showed.getLast();
		if(list) list.hide();
	},
	
	hide: function(){
		this.closing=true;
		this.list.hide();
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

Mif.Menu.version='1.1';
