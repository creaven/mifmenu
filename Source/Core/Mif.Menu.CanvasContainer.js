/*
Mif.Menu.CanvasContainer

Based on mootools-art http://code.google.come/p/mootools-art and Canvas Underlayer http://fantactuka.net/canvasul/
*/


Mif.Menu.CanvasContainer=new Class({

	Implements: Options,
	
	options:{
		morph: {link: 'cancel'},
		opacity: 1,
		styles:{
			position: 'relative'
		},
		
		x: 0,
		y: 0,
		glow: 0,
		shadow: 5,
		border: 0,
		width: 100,
		height: 100,
		corners: [4, 4, 4, 4],
		borderStartColor: '#a7a7a7',
		borderStartOpacity: 0.5,
		borderStopColor: '#a7a7a7',
		borderStopOpacity: 0.5,
		bodyStartColor: '#edebeb',
		bodyStartOpacity: 1,
		bodyStopColor: '#aea6a4',
		bodyStopOpacity: 1,
		glowColor: '#000',
		glowOpacity: 1,
		shadowColor: '#000',
		shadowOpacity: 0.3,
		gradientMode: 'vertical'
	},

	initialize: function(options){
		this.setOptions(options);
		
		this.container = new Element('div').setStyles(options.styles);
		if (options.id) this.container.set('id', options.id);
		if (options.className) $splat(options.className).each(function(cn){
			this.container.addClass(cn);
		}, this);
		this.morpher = new Fx.Morph(this.container, this.options.morph);
		
		
		this.canvas = new Canvas({
			'class': 'mif-menu-canvas',
			styles: {
				position: 'absolute',
				'z-index': 0
			}
		});
		
		this.container.adopt(this.canvas);
		
		this.center=new Element('div').setStyle('overflow', 'hidden');
		this.wrapper=new Element('div',{'class': 'mif-menu-wrapper', 'styles':{position: 'absolute', zIndex: 10}}).adopt(this.center);
		//this.wrapper.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=100)";
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
		
		this.container.style.width='100%';
		var width=this.center.offsetWidth;
		var height=this.center.offsetHeight;
		
		this.offsets={
			x: this.options.glow+this.options.border,
			y: this.options.glow+this.options.border
		}
				
		var size={
			width: width+this.options.glow + Math.max(this.options.glow, this.options.shadow)+this.options.border,
			height: height+this.options.glow + Math.max(this.options.glow, this.options.shadow)+this.options.border
		}
		
		this.canvas.width=size.width;
		this.canvas.height=size.height;
		
		this.container.setStyles({
			width: size.width,
			height: size.height
		});
		
		this.wrapper.setStyles({
			left: this.offsets.x,
			top: this.offsets.y
		});

		/* Glow drawing. */
		if(this.options.glow > 0) {
			for(var i = 0; i < this.options.glow; i ++) {
				
				opacity = Fx.Transitions.Quad.easeIn(i / this.options.glow) / this.options.glow * this.options.glowOpacity;
				
				this.drawRectangle({
					x: i,
					y: i,
					width: size.width -i*2,
					height: size.height -i*2,
					gradientStartColor: this.options.glowColor,
					gradientStartOpacity: opacity,
					gradientStopColor: this.options.glowColor,
					gradientStopOpacity: opacity
				});
			}
		}
		
		/* Shadow drawing. */
		if(this.options.shadow > 0) {
			for(var i = 0; i < this.options.shadow; i ++) {
				opacity = this.options.shadowOpacity * (1 - i / this.options.shadow);
				this.drawRectangle({
					x: this.options.glow + i,
					y: this.options.glow + i,
					width: width,
					height: height,
					gradientStartColor: this.options.shadowColor,
					gradientStartOpacity: opacity,
					gradientStopColor: this.options.shadowColor,
					gradientStopOpacity: opacity
				});
			}
		}		
		
		/* Border drawing. */
		if(this.options.border > 0) {
			this.drawRectangle({
				x: this.options.glow,
				y: this.options.glow,
				width: width+2*this.options.border,
				height: height+2*this.options.border,
				gradientStartColor: this.options.borderStartColor,
				gradientStartOpacity: this.options.borderStartOpacity,
				gradientStopColor: this.options.borderStopColor,
				gradientStopOpacity: this.options.borderStopOpacity
			});
		}
		
		/* Body drawing. */
		this.drawRectangle({
			x: this.options.glow + this.options.border,
			y: this.options.glow + this.options.border,
			width: width,
			height: height,
			gradientStartColor: this.options.bodyStartColor,
			gradientStartOpacity: this.options.bodyStartOpacity,
			gradientStopColor: this.options.bodyStopColor,
			gradientStopOpacity: this.options.bodyStopOpacity
		});

		return this;
	},
	
	drawRectangle: function(options) {
		var o = $merge(this.options, options);
		var c = this.canvas.getContext('2d');
		
		c.translate(o.x, o.y);
		
		
		c.beginPath();
		
		
		c.moveTo(o.corners[0], 0);
		
		c.lineTo(o.width - o.corners[1], 0);
		
		c.quadraticCurveTo(o.width, 0, o.width, o.corners[1]);
		
		c.lineTo( o.width, o.height - o.corners[2]);
		
		c.quadraticCurveTo( o.width, o.height, o.width - o.corners[2], o.height);
		
		c.lineTo( o.corners[3], o.height);
		
		c.quadraticCurveTo(0, o.height, 0, o.height - o.corners[3]);
		
		c.lineTo(0, o.corners[0]);
		
		c.quadraticCurveTo(0, 0, o.corners[0], 0);
		
		c.closePath();
		
		if(o.gradientMode == 'vertical') { 
			this.fillStyle = c.createLinearGradient(0, 0, 0, o.height); 
		} else { 
			this.fillStyle = c.createLinearGradient(0, 0, o.width, 0); 
		}
		this.fillStyle.addColorStop(0, this.colorize(o.gradientStartColor, o.gradientStartOpacity));
		this.fillStyle.addColorStop(1, this.colorize(o.gradientStopColor, o.gradientStopOpacity));
		c.fillStyle = this.fillStyle;
		c.fill();
		
		c.translate(-o.x, -o.y);
		
		
	},
	
	colorize: function(color, alpha){
		
		var rgba = function(rgb, a){
			rgb = rgb.hexToRgb(true);
			return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + (a).round(5) + ')';
		};
		
		switch ($type(color)){
			case 'string': return rgba(color, alpha);
			case 'array': return color.map(function(c){
				return rgba(c, alpha);
			});
		}
		
		return '#000';
	},
	
	setPosition: function(position){
		this.container.position({
			x: position.x - this.offsets.x,
			y: position.y - this.offsets.y
		});
		return this;
	}

});
