var Container=new Class({

	initialize: function(options){
		this.container = new Element('div');
		console.log(options);
		this.container.setStyles(options.styles);
		this.morpher = new Fx.Morph(this.container, this.options.morph);
	},
	
	setStyle: function(style){
		this.container.setStyle(style);
		return this;
	},
	
	setStyles: function(styles){
		this.container.setStyles(styles);
		return this;
	},
	
	setContent: function(content){
		this.container.setContent(content);
		return this;
	},
	
	inject: function(element, how){
		this.container.inject(element, how);
	},
	
	draw: function(){
		return this;
	}
	
	

});