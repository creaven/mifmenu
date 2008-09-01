if(!window.Mif) var Mif={};

Mif.Menu=new Class({

	Implements: [Events, Options],
	
	options: {
		//type: null
		//target
	},

	initialize: function(options, container){
		this.setOptions(options);
		this.target=this.options.target ? $(this.options.target) : document;
		this.showed=[];
		this.visible=[];
		this.hidden=true;
		container=container||{};
		container={
			container: container.container||ART.Container,
			options: container.options||{
				offsets:{x:-2,y:-3},
				className: 'mif-menu'
			}
		};
		if(Browser.Engine.trident){
			//container.options.morph={duration:0};
		}
		this.List=new Mif.Menu.List(container);
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
			if(list.visible) list.hide(true);
		});
		if(this.options.type=='contextmenu'){
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