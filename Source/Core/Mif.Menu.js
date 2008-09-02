if(!window.Mif) var Mif={};

Mif.Menu=new Class({

	Implements: [Events, Options],
	
	options: {
		type: 'default'
		//target
	},

	initialize: function(options, type){
		this.setOptions(options);
		this.target=this.options.target ? $(this.options.target) : document;
		this.showed=[];
		this.visible=[];
		this.hidden=true;
		if(!type){
			switch(this.options.type){
				case 'ART':
				case 'art': type={
					container: ART.Container, 
					options: {
						className: 'mif-menu', 
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
				default: type={container: Mif.Container, options: {className: 'mif-menu', offsets:{x:-2, y:0}}};
			};
		};
		if(Browser.Engine.trident && type.container==ART.Container){
			type.options.morph={duration:0};//because vml opacity with filter opacity bug
		};
		this.List=Mif.Menu.List(type);
		this.list=new this.List(this.options.list, {menu: this});
		
		
		this.bound={
			escape: this.escape.bind(this)
		};		
		this.addEvent('hide', function(){
			this.closing=false;
			this.hidden=true;
			document.removeEvent('keyup', this.bound.escape);
		}, true);
		this.addEvent('show', function(){
			this.hidden=false;
			document.addEvent('keyup', this.bound.escape);
		}, true);
		
		this.initEvents();
	},
	
	initEvents: function(){
		var list=this.list;
		document.addEvent('click',function(event){
			if(event.rightClick) return;
			if(list.visible) this.hide();
		}.bind(this));
		if(this.options.contextmenu){
			this.target.addEvent('contextmenu', function(event){
				if(!this.hidden){
					this.showed.each(function(list, i){
						if(i!=0) event=null;
						list.position(event);
					});
				}else{
					list.show(event);
					this.fireEvent('show');
				}
				return false;
			}.bind(this));
		};
	},
	
	escape: function(event){
		if(!event.key=='esc') return;
		this.hideList();
	},
	
	hideList: function(){
		var list=this.showed.getLast();
		if(list) list.hide();
	},
	
	hide: function(){
		this.closing=true;
		this.list.hide();
	}
	
});

Mif.Menu.version='1.0dev';