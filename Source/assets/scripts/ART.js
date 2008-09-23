/* ART Element */

var ART = {};

Element.implement({
	
	setContent: function(content){
		return (typeof content == 'string') ? this.set('html', content) : this.adopt(content);
	},
	
	forceFocus: function(){
		this.blur();
		this.focus();
	},
	
	forceBlur: function(){
		this.focus();
		this.blur();
	}
	
});

ART.Element = new Class({
	
	Implements: [Events, Options],
	
	options: {
		/* onInject: $empty,
		onDispose: $empty,
		onGrab: $empty,*/
		subject: null,
		grabber: null
	},
	
	initialize: function(options){
		this.setOptions(options);
		this.subject = $(this.options.subject);
		this.grabber = (this.options.grabber) ? $(this.options.grabber) : this.subject;
	},
	
	inject: function(element, how){
		this.subject.inject(element, how);
		this.fireEvent('onInject', [element, this.subject]);
		return this;
	},
	
	grab: function(element, how){
		this.grabber.grab(element, how);
		this.fireEvent('onGrab', [element, this.grabber]);
		return this;
	},
	
	replaces: function(element){
		this.subject.replaces(element);
		return this;
	},
	
	adopt: function(){
		Array.flatten(arguments).each(function(element){
			this.grab(element);
		}, this);
		return this;
	},
	
	dispose: function(){
		this.fireEvent('onDispose', this.subject);
		this.subject.dispose();
		return this;
	},
	
	setStyle: function(style, value){
		this.subject.setStyle(style, value);
		return this;
	},
	
	setStyles: function(properties){
		this.subject.setStyles(properties);
		return this;
	},
	
	resize: function(size){
		this.subject.height = size.height;
		this.subject.width = size.width;
		return this;
	}

});

/* ART Ink */

ART.Ink = new Class({
	
	Extends: ART.Element,

	initialize: function(props){
		props = props || {};
		props.id = props.id || 'ART_Box_' + Native.UID++;
		var element = new Element('canvas', props);
		if (window.G_vmlCanvasManager) element = G_vmlCanvasManager.initElement(element);
		this.paint = element;
		this.canvas = this.paint.getContext('2d');
		this.parent({subject: this.paint});
		this.save();
	},
	
	save: function(){
		this.canvas.save();
		return this;
	},
	
	restore: function(){
		this.canvas.restore();
		return this;
	},

	begin: function(p){
		this.canvas.beginPath();
		this.canvas.moveTo(p.x, p.y);
		return this;
	},

	close: function(){
		this.canvas.closePath();
		return this;
	},

	translate: function(p){
		this.canvas.translate(p.x, p.y);
		return this;
	},

	line: function(p){
		this.canvas.lineTo(p.x, p.y);
		return this;
	},

	curve: function(p, c){
		this.canvas.quadraticCurveTo(c.x, c.y, p.x, p.y);
		return this;
	},

	box: function(options){
		options = $extend({radius: 5, height: 200, width: 200}, options);
		
		var radius = options.radius, height = options.height, width = options.width, fill = options.fill;

		var tl = options['top-left-radius'];
		var tr = options['top-right-radius'];
		var bl = options['bottom-left-radius'];
		var br = options['bottom-right-radius'];

		tl = $pick(tl, radius);
		tr = $pick(tr, radius);
		bl = $pick(bl, radius);
		br = $pick(br, radius);

		this.begin({x: 0, y: height - tl});
		this.line({x: 0, y: tl}).curve({x: tl, y: 0}, {x: 0, y: 0});
		this.line({x: width - tr, y: 0}).curve({x: width, y: tr}, {x: width, y: 0});
		this.line({x: width, y: height - br}).curve({x: width - br, y: height}, {x: width, y: height});
		this.line({x: bl, y: height}).curve({x: 0, y: height - bl}, {x: 0, y: height});

		this.close();
		
		return this.fill(fill, height);
	},
	
	arc: function(center, radius, start, end, fill){
		this.canvas.arc(center.x, center.y, radius, Math.radians(start), Math.radians(end), false);
		return this.fill(fill, radius * 2);
	},
	
	block: function(options){
		this.fill(options.fill, options.height);
		this.canvas.fillRect(0, 0, options.width, options.height);
		return this;
	},
	
	draw: function(instructions){
		for (var method in instructions) this[method].run(instructions[method], this);
		return this;
	},

	fill: function(color, height){
		if (typeof color != 'string'){
			var gradient = this.canvas.createLinearGradient(0, 0, 0, height);
			var len = color.length;
			color.each(function(color, i){
				gradient.addColorStop(i / (len - 1), color);
			});
			color = gradient;
		}
		this.canvas.fillStyle = color;
		this.canvas.fill();
		return this;
	}

});

Math.radians = function(degrees){
	return degrees * (Math.PI / 180);
};

/* ART Paint */

ART.Paint = new Class({
	
	Extends: ART.Ink,
	
	options: {
		id: false
	},
	
	initialize: function(options){
		this.setOptions(options);
		this.parent({id: this.options.id});
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
	
	draw: function(style){
		
		if ($type(style) != 'art:style') style = ART.Style(style);
		
		this.resize({height: style.outerHeight, width: style.outerWidth});
		
		var tl = style.topLeftRadius, tr = style.topRightRadius, bl = style.bottomLeftRadius, br = style.bottomRightRadius;
		
		var shadow = style.shadow, border = style.border, radius = style.radius, height = style.height, width = style.width;
		
		var s2 = shadow * 1.5;
		
		var trs = tr + s2, tls = tl + s2, brs = br + s2, bls = bl + s2;
		
		//shadow
		
		if (style.drawShadow) (shadow).times(function(i){
			var alpha = Fx.Transitions.Quad.easeIn(i / shadow) / shadow * style.shadowOpacity;
			this.box({
				'width': style.outerWidth - i * 2,
				'height': style.outerHeight - i * 2,
				'top-left-radius': tls - i,
				'top-right-radius': trs - i,
				'bottom-left-radius': bls - i,
				'bottom-right-radius': brs - i,
				'fill': this.colorize(style.shadowColor, alpha)
			});
			this.translate({x: 1, y: 1});
		}, this);
		else this.translate({x: shadow, y: shadow});
		
		this.translate({x: (style.shadowOffsetX > 0) ? 0 : style.shadowOffsetX, y: (style.shadowOffsetY > 0) ? 0 : style.shadowOffsetY});
		
		//border
		
		if (style.border) this.box({
			'width': style.innerWidth ,
			'height': style.innerHeight,
			'top-left-radius': tl + border,
			'top-right-radius': tr + border,
			'bottom-left-radius': bl + border,
			'bottom-right-radius': br + border,
			'fill': this.colorize(style.borderColor, style.borderOpacity)
		}).translate({x: border, y: border});
		
		//main overlay
		
		if (style.overlay){
			
			if (!style.title && style.reflection){
				this.box({
					'width': width,
					'height': height,
					'top-left-radius': tl,
					'top-right-radius': tr,
					'bottom-left-radius': bl,
					'bottom-right-radius': br,
					'fill': this.colorize(style.reflectionColors[0], style.overlayOpacity)
				}).translate({x: 0, y: style.reflection});
			}
			
			var mh = (!style.title) ? style.reflection : 0;

			this.translate({x: 0, y: style.title}).box({
				'width': width,
				'height': height - mh,
				'bottom-left-radius': style.status ? 0 : bl,
				'bottom-right-radius': style.status ? 0 : br,
				'top-left-radius': style.title ? 0 : tl,
				'top-right-radius': style.title ? 0 : tr,
				'fill': this.colorize(style.overlayColor, style.overlayOpacity)
			}).translate({x: 0, y: -style.title});

		}
		
		if (style.title){
			
			if (style.reflection) this.box({
				'width': width,
				'height': style.title,
				'top-left-radius': tl,
				'top-right-radius': tr,
				'bottom-left-radius': 0,
				'bottom-right-radius': 0,
				'fill': this.colorize(style.reflectionColors[0], style.titleOpacity)
			}).translate({x: 0, y: style.reflection});
					
			this.box({
				'width': width,
				'height': style.title - style.reflection,
				'top-left-radius': tl,
				'top-right-radius': tr,
				'bottom-left-radius': 0,
				'bottom-right-radius': 0,
				'fill': this.colorize(style.titleColor, style.titleOpacity)
			}).translate({x: 0, y: -style.reflection});
			
			if (style.line) this.translate({x: 0, y: style.title - style.line}).box({
				'width': width,
				'height': style.line,
				'radius': 0,
				'fill': this.colorize(style.lineColors[0], style.titleOpacity)
			}).translate({x: 0, y: - style.title + style.line});
			
		}
		
		if (style.status){
		
			this.translate({x: 0, y: height + style.title}).box({
				'width': width,
				'height': style.status,
				'bottom-left-radius': bl,
				'bottom-right-radius': br,
				'top-left-radius': 0,
				'top-right-radius': 0,
				'fill': this.colorize(style.statusColor, style.statusOpacity)
			});
			
			if (style.line){
				
				this.box({
					'width': width, 'height': style.line, 'radius': 0, 'fill': this.colorize(style.lineColors[1], style.statusOpacity)
				});
				
				if (style.reflection) this.translate({x: 0, y: style.line}).box({
					'width': width, 'height': style.reflection, 'radius': 0, 'fill': this.colorize(style.reflectionColors[1], style.statusOpacity)
				});
				
			}
		}
		
		return this;
	}
	
});


/* ART Theme */

ART.Style = function(properties){
	
	var style = $merge(ART.Styles, {$family: {name: 'art:style'}}, properties);
	
	if (!style.shadow){
		style.shadowOffsetY = 0;
		style.shadowOffsetX = 0;
	}

	style.innerHeight = style.height + style.status + style.title + (style.border * 2);
	style.innerWidth = style.width + (style.border * 2);

	style.outerHeight = (style.shadow * 2) - Math.abs(style.shadowOffsetY) + style.innerHeight;
	style.outerWidth = (style.shadow * 2) - Math.abs(style.shadowOffsetX) + style.innerWidth;

	var tl = style.topLeftRadius, tr = style.topRightRadius, bl = style.bottomLeftRadius, br = style.bottomRightRadius;

	style.topLeftRadius = $pick(tl, style.radius);
	style.topRightRadius = $pick(tr, style.radius);
	style.bottomLeftRadius = $pick(bl, style.radius);
	style.bottomRightRadius = $pick(br, style.radius);

	return style;
	
};

ART.Styles = {
	
	radius: 0,

	title: 0,
	titleColor: '#CCC',
	titleOpacity: 1,

	status: 0,
	statusColor: '#CCC',
	statusOpacity: 1,

	overlay: true,
	overlayColor: '#FFF',
	overlayOpacity: 1,

	shadow: 10,
	shadowOffsetX: 0,
	shadowOffsetY: -2,
	shadowColor: '#000',
	shadowOpacity: 0.5,
	drawShadow: true,

	border: 1,
	borderColor: '#000',
	borderOpacity: 0.4,

	reflection: 1,
	reflectionColors: ['#FFF', '#FFF'],

	line: 1,
	lineColors: ['#AAA', '#AAA']
	
};

ART.Theme = function(properties){
	
	properties = $unlink(properties);
	
	this.normal = properties.normal;
	
	delete properties.normal;
	
	for (var p in properties) this[p] = $merge(this.normal, properties[p]);
	
};

ART.Themes = new Hash;

/* ART Container */

ART.Container = new Class({
	
	Extends: ART.Element,
	
	options: {
		id: null,
		className: null,
		
		title: null,
		content: null,
		status: null,
		
		styles: {
			height: 'auto',
			width: 'auto',
			position: 'relative',
			overflow: 'hidden'
		},
		
		theme: null,
		morph: {link: 'cancel'}
	},
	
	initialize: function(options, component){
		this.component = (component) ? ' art-' + component : '';
		this.setOptions(options);
		options = this.options;
		this.theme=options.theme.normal;//hack
		var absZero = {position: 'absolute', top: 0, left: 0};
		
		this.container = new Element('div', {'class': 'art-container' + this.component}).setStyles({
			position: options.styles.position, top: 0, left: 0
		});
		
		if (!this.component) this.component = 'art-container';
		
		if (options.id) this.container.set('id', options.id);
		if (options.className) $splat(options.className).each(function(cn){
			this.container.addClass(cn);
		}, this);
		
		this.paint = new ART.Paint().setStyles(absZero).inject(this.container);
		
		this.wrapper = new Element('div').setStyles(absZero).inject(this.container);

		this.top = {offsetHeight: 0};
		this.bottom = {offsetHeight: 0};
		this.center = new Element('div').inject(this.wrapper);
		
		this.center.setStyles({width: options.styles.width, height: options.styles.height, overflow: options.styles.overflow});
		
		if (options.title) this.setTitle(options.title);
		if (options.content) this.setContent(options.content);
		if (options.status) this.setStatus(options.status);
		
		this.morpher = new Fx.Morph(this.container, this.options.morph);
		
		this.parent({
			subject: this.container,
			onInject: this.onInject
		});
		
	},
	
	wraps: function(element){
		element = $(element);
		if (!element) return this;
		this.container.replaces(element);
		this.setContent(element);
		this.draw();
		return this;
	},
	
	replaces: function(element){
		this.parent(element);
		return this.draw();
	},
	
	setTitle: function(content){
		if ($type(this.top) != 'element') this.top = new Element('div').inject(this.wrapper, 'top');
		this.process('title', content, this.top);
		return this;
	},
	
	setContent: function(content){
		this.process('content', content, this.center);
		this.grabber = this.content;
		return this;
	},
	
	setStatus: function(content){
		if ($type(this.bottom) != 'element') this.bottom = new Element('div').inject(this.wrapper, 'bottom');
		this.process('status', content, this.bottom);
		return this;
	},
	
	onInject: function(){
		this.draw();
	},

	process: function(name, part, container){
		var where = this[name];
		if (where) where.dispose();
		if (!part) return;
		where = new Element('div', {'class': this.component + '-' + name}).inject(container);
		where.setContent(part);
		this[name] = where;
	},
	
	draw: function(theme){
		
		theme = $unlink(theme || {});
		
		this.container.setStyles({width: '100%'});
		
		var height = theme.height, width = theme.width;
		
		if ($chk(height)) this.center.setStyles({height: height});
		if ($chk(width)) this.center.setStyles({width: width});
		theme = $merge(this.theme, theme, {
			title: this.top.offsetHeight,
			status: this.bottom.offsetHeight,
			height: this.center.offsetHeight,
			width: this.center.offsetWidth
		});
		
		theme = ART.Style(theme);
		
		this.container.setStyles({height: theme.outerHeight, width: theme.outerWidth});
		var shadow = theme.shadow, border = theme.border;
		
		this.offsets = {
			x: shadow + ((theme.shadowOffsetX > 0) ? 0 : theme.shadowOffsetX),
			y: shadow + ((theme.shadowOffsetY > 0) ? 0 : theme.shadowOffsetY)
		};
		
		this.wrapper.setStyles({left: this.offsets.x + border, top: this.offsets.y + border});
		
		this.paint.draw(theme);
		return this;
	},
	
	setPosition: function(position){
		this.container.position({x: position.x - this.offsets.x, y: position.y - this.offsets.y});
		return this;
	}
	
});