/*
Mif.Menu.Container
*/


Mif.Menu.Container=new Class({

	Implements: Options,
	
	options:{
		morph: {link: 'cancel'},
		offsets:{//max 6
			t: -5,
			r: 5,
			b: 5,
			l: -5
		},
		opacity: 1,
		styles:{
			position: 'relative'
		}
	},

	initialize: function(options){
		this.setOptions(options);
		this.offsets=this.options.offsets;
		this.container = new Element('div').setStyles(options.styles);
		if (options.id) this.container.set('id', options.id);
		if (options.className) $splat(options.className).each(function(cn){
			this.container.addClass(cn);
		}, this);
		this.morpher = new Fx.Morph(this.container, this.options.morph);
		
		
		this.shadow=new Element('div', {'class': 'mif-shadow'});
		if(Browser.Engine.trident){
			this.shadow.addClass('mif-shadow-ie');
			this.shadow.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity="+this.options.opacity*100+") progid:DXImageTransform.Microsoft.Blur(pixelradius=3)";
		}else{
			var sides=['tl','tr','br','bl','l','r','t','b','c'];
			var sideEls={};
			sides.each(function(side){
				el=new Element('div', {'class': 'mif-shadow-'+side}).setStyle('opacity', this.options.opacity);
				sideEls[side]=el;
				this.shadow.adopt(el);
			}, this);
			this.sideEls=sideEls;
		};
		this.center=new Element('div').setStyle('overflow', 'hidden');
		this.wrapper=new Element('div',{'class': 'mif-menu-wrapper', 'styles':{position: 'absolute', zIndex: 10}}).adopt(this.center);
		this.wrapper.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=100)";
		this.container.adopt(this.shadow, this.wrapper);
	},
	
	setStyle: function(style, value){
		this.container.setStyle(style, value);
		return this;
	},
	
	setStyles: function(styles){
		this.container.setStyles(styles);
		return this;
	},
	
	setContent: function(content){
		this.center.setContent(content);
		return this;
	},
	
	inject: function(element, how){
		this.container.inject(element, how);
		return this.draw();
	},
	
	draw: function(){
		this.shadow.setStyles({
			width:0,
			heigth:0
		});
		this.container.style.width='100%';
		var width=this.center.offsetWidth;
		var height=this.center.offsetHeight;
		var left=this.offsets.l;
		var top=this.offsets.t;
		var right=this.offsets.r;
		var bottom=this.offsets.b;
		this.shadow.setStyles({
			left: Math.max(-left, 0),
			top: Math.max(-top, 0)
		});
		var wrapperLeft=Math.max(left, 0);
		var wrapperTop=Math.max(top, 0);
		var wrapperRight=Math.max(right, 0);
		var wrapperBottom=Math.max(bottom, 0);
		this.offsetLeft=wrapperLeft;
		this.offsetTop=wrapperTop;
		this.wrapper.setStyles({
			left: wrapperLeft,
			top: wrapperTop
		});
		this.container.setStyles({
			width: width+wrapperLeft+wrapperRight,
			height: height+wrapperTop+wrapperBottom
		});
		var shadowWidth=width+left+right;
		var shadowHeight=height+top+bottom;
		if(Browser.Engine.trident){
			this.shadow.setStyles({
				width: Math.max(0, shadowWidth-6),
				height: Math.max(0, shadowHeight-6)
			});
		}else{
			this.sideEls.l.setStyle('height', shadowHeight-12);
			this.sideEls.r.setStyle('height', shadowHeight-12);
			this.sideEls.t.setStyle('width', shadowWidth-12);
			this.sideEls.b.setStyle('width', shadowWidth-12);
			this.sideEls.c.setStyles({
				width: shadowWidth-12,
				height: shadowHeight-12
			});
			this.shadow.setStyles({
				width: shadowWidth,
				height: shadowHeight
			});
		}
		return this;
	},
	
	setPosition: function(position){
		this.container.position({
			x: position.x-this.offsetLeft,
			y: position.y-this.offsetTop
		});
		return this;
	}

});
