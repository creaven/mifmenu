var Mif={};

/*
shadow imitation using box:{
	background-color: #777;
	box blur: 3px;
	opacity: 0.5
}

idea - Ext.Shadow http://extjs.com
*/
Mif.Shadow=new Class({

	Implements: Options,
	
	options: {
		offsets:{//max 6
			t: -4,
			r: 4,
			b: 4,
			l: -4
		},
		styles:{
			position: 'relative'
		}
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.offsets=this.options.offsets;
		this.element=element;
		
		this.container=new Element('div').setStyles({
			position: this.options.styles.position,
			left: 20,
			top:30,
			overflow: 'hidden'
		});
		
		this.shadow=new Element('div', {'class': 'mif-shadow'});
		if(Browser.Engine.trident){
			this.shadow.addClass('mif-shadow-ie');
			this.shadow.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius=3)";
		}else{
			var sides=['tl','tr','br','bl','l','r','t','b','c'];
			var sideEls={};
			sides.each(function(side){
				el=new Element('div', {'class': 'mif-shadow-'+side})
				sideEls[side]=el;
				this.shadow.adopt(el);
			}, this);
			this.sideEls=sideEls;
		};
		
		this.wrapper=new Element('div',{'styles':{position: 'absolute'}}).adopt(element);
		
		this.container.adopt(this.shadow, this.wrapper);
	},
	
	draw: function(){
		[this.container, this.wrapper, this.shadow].each(function(el){
			el.style.width='auto';
		});
		this.container.inject(document.body);
		var width=this.element.offsetWidth;
		var height=this.element.offsetHeight;
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
			top: wrapperTop,
			width: width,
			height: height
		});
		this.container.setStyles({
			width: width+wrapperLeft+wrapperRight,
			height: height+wrapperTop+wrapperBottom
		});
		var shadowWidth=width+left+right;
		var shadowHeight=height+top+bottom;
		if(Browser.Engine.trident){
			this.shadow.setStyles({
				width: shadowWidth-6,
				height: shadowHeight-6
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