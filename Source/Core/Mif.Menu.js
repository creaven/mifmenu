/*
Mif.Menu
*/


Mif.Menu=new Class({
	
	version: '1.2dev',

	Implements: [Events, Options],
	
	options: {
		offsets: {
			x: 0,
			y: 0
		},
		limits: {
			left: 0,
			top: 0,
			right: 0,
			bottom: 20
		},
		minWidth: 200,
		submenuShowDelay: 300,
		submenuOffsets: {
			x: -2,
			y: -4
		}
	},

	initialize: function(options){
		this.setOptions(options);
		this.element = new Element('div', {'class': 'mif-menu'});
		this.items = [];
		this.hidden = true;
		this.UID=++Mif.UID;
		Mif.uids[this.UID]=this;
		this.element.setAttribute('uid', this.UID);
		if(this.options.id){
			Mif.ids[this.options.id]=this;
		}
		this.events();
		if(Mif.Menu.KeyNav) new Mif.Menu.KeyNav(this);
		if (MooTools.version>='1.2.2' && this.options.initialize) this.options.initialize.call(this);
	},
	
	show: function(coords){
		this.hidden = false;
		if(!this.$draw) this.draw();
		this.element.inject(document.body);
		this.updateHeight();
		this.updateWidth();
		this.updateWidth();
		this.position(coords);
		this.addHideOnExtraClick();
		this.time = $time();
		return this.fireEvent('show');
	},
	
	hide: function(){
		if(this.hidden) return;
		this.hidden = true;
		this.unselect();
		this.element.removeClass('left').removeClass('right');
		this.element.getElement('.mif-menu-wrapper').setStyle('height', 'auto');
		this.top.setStyle('display', 'none');
		this.bottom.setStyle('display', 'none');
		this.element.dispose();
		this.hideSubmenu();
		if(this.parentItem){
			var menu = this.parentItem.menu;
			menu.openSubmenu = false;
			menu.fireEvent('hideSubmenu', this);
		}
		return this.fireEvent('hide');
	},
	
	position: function(coords){
		if(!coords){
			var parent = this.parentItem.getElement();
			position = parent.getPosition();
			var y = position.y + this.options.submenuOffsets.y;
			var size = window.getSize(), scroll = window.getScroll();
			var menu = {x: this.element.offsetWidth, y: this.element.offsetHeight};
			var item = {x: parent.offsetWidth, y: 0};
			var props = {x: 'left', y: 'top'};
			var coords = {};
			//x
			var side = 'right';
			var pos = position.x + item.x + this.options.submenuOffsets.x;
			if ((pos + menu.x - scroll.x) > size.x){
				side = 'left';
				pos = position.x - menu.x - this.options.submenuOffsets.x;
			}
			coords.x = Math.max(0, pos);
			this.element.addClass(side);
			//y
			var pos = position.y + item.y + this.options.submenuOffsets.y;
			var delta = (pos + menu.y - scroll.y) - (size.y - this.options.limits.bottom);
			if (delta > 0){
				if(this.element.offsetHeight - delta > this.items[0].getElement().offsetHeight*2){
					this.setHeight(this.element.offsetHeight - delta);
				}else{
					pos = position.y - this.options.submenuOffsets.y - menu.y + parent.offsetHeight;
				}
			};
			coords.y = Math.max(this.options.limits.top, pos);
			var delta = coords.y + this.element.offsetHeight - y;
			if(coords.y < y && delta > 0){
				var wrapper = this.element.getElement('.mif-menu-wrapper');
				this.setHeight(y - coords.y + parent.offsetHeight);
			}
		}else{
			if(coords.event) coords = coords.page;
			var y = coords.y;
			var size = window.getSize(), scroll = window.getScroll();
			var menu = {x: this.element.offsetWidth, y: this.element.offsetHeight};
			var props = {x: 'left', y: 'top'};
			//x
			var pos = coords.x + this.options.offsets.x;
			if ((pos + menu.x - scroll.x) > size.x) pos = coords.x - this.options.offsets.x - menu.x;
			coords.x = Math.max(0, pos);
			//y
			var pos = coords.y + this.options.offsets.y;
			var delta = (pos + menu.y - scroll.y) - (size.y - this.options.limits.bottom);
			if (delta > 0){
				if(this.element.offsetHeight - delta > this.items[0].getElement().offsetHeight*2){
					this.setHeight(this.element.offsetHeight - delta);
				}else{
					pos = coords.y - this.options.offsets.y - menu.y;
				}
			}
			coords.y = Math.max(this.options.limits.top, pos);
			var delta = coords.y + this.element.offsetHeight - y;
			if(coords.y < y && delta > 0){
				var wrapper = this.element.getElement('.mif-menu-wrapper');
				this.setHeight(y - coords.y);
			}
		}
		this.element.setPosition(coords);
		return this;
	},
	
	addHideOnExtraClick: function(){
		document.addEvent('mousedown', this.bound.hideOnExtraClick);
	},
	
	hideOnExtraClick: function(event){//todo add submenu support
		var target = document.id(event.target);
		var wrapper = this.element.getElement('.mif-menu-wrapper');
		if(wrapper.hasChild(target) || wrapper == target) return;
		var menu = target.getAncestor('.mif-menu');
		if(menu && menu != this.element) return;
		this.hide();
		document.removeEvent('mousedown', this.bound.hideOnExtraClick); 
	},
	
	events: function(){
		this.bound={
			close: this.close.bind(this),
			hover: this.hover.bind(this),
			hideOnExtraClick: this.hideOnExtraClick.bind(this)
		};
		this.element.addEvent('mousemove', this.bound.hover).addEvent('mouseout', this.bound.hover).addEvent('mouseover', this.bound.hover).addEvent('mouseleave', this.bound.hover);
		if(this.options.contextmenu){
			this.target.addEvent('contextmenu', function(event){
				this.show(event);
				return false;
			}.bind(this));
		};
	},
	
	hover: function(event){
		var target = $(event.target);
		var itemEl = target.getAncestor('.mif-menu-item');
		if(!itemEl)	return this.unselect();
		var item = Mif.uids[itemEl.getAttribute('uid')];
		if(item.get('disabled')) return this.unselect();
		if(this.hovered == item) return;
		this.select(item);
		if(!item.disabled && item.submenu){
			this.showSubmenu(item);
		}
	},
	
	select: function(item){
		this.unselect();
		this.hovered = item;
		this.hovered.getElement().addClass('hover');
		this.makeVisible(item);
		this.fireEvent('hover', ['over', this.hovered]);
	},
	
	unselect: function(){
		if(!this.hovered) return;
		var item = this.hovered;
		$clear(item.timer);
		this.hovered.getElement().removeClass('hover');
		this.fireEvent('hover', ['out', this.hovered]);
		this.hideSubmenu();
		this.hovered = null;
	},
	
	showSubmenu: function(item, delay){
		item.timer = function(){
			var submenu = item.submenu;
			var menu = item.menu;
			submenu.show();
			menu.openSubmenu = submenu;
			item.timer=null;
			menu.fireEvent('showSubmenu', submenu);
		}.delay($pick(delay, this.options.submenuShowDelay));
	},
	
	hideSubmenu: function(){
		if(!this.openSubmenu) return;
		var item = this.openSubmenu.parentItem;
		$clear(item.timer);
		item.submenu.hide();
	},
	
	close: function(event){
		if(this.$attaching) return;
		if(this.list.visible) this.hide();
	},
	
	isVisible: function(){
		return !this.hidden;
	},
	
	setHeight: function(height){
		var wrapper = this.element.getElement('.mif-menu-wrapper');
		if(height > wrapper.scrollHeight) return this;
		wrapper.setStyle('height', height);
		this.top.setStyle('display', wrapper.scrollTop == this.items[0].getElement().offsetTop ? 'none' : 'block');
		this.bottom.setStyle('display', wrapper.scrollTop == wrapper.scrollHeight - wrapper.clientHeight ? 'none' : 'block');
		return this;
	},
	
	initScroll: function(){
		var self = this;
		var top = this.element.getElement('.mif-menu-scroll-top');
		var bottom = this.element.getElement('.mif-menu-scroll-bottom');
		this.top = top;
		this.bottom = bottom;
		this.scroll = new Fx.Scroll(this.element.getElement('.mif-menu-wrapper'), {
			link: 'cancel',
			onComplete: function(){
				top.setStyle('display', this.element.scrollTop == self.items[0].getElement().offsetTop ? 'none' : 'block');
				bottom.setStyle('display', this.element.scrollTop == this.element.scrollHeight - this.element.clientHeight ? 'none' : 'block');
			}
		});
		$extend(this.bound, {
			startScrollBottom: this.startScrollBottom.bind(this),
			startScrollTop: this.startScrollTop.bind(this),
			stopScroll: this.stopScroll.bind(this)
		});
		bottom.addEvents({
			mouseenter: this.bound.startScrollBottom,
			mouseleave: this.bound.stopScroll
		});
		top.addEvents({
			mouseenter: this.bound.startScrollTop,
			mouseleave: this.bound.stopScroll
		});
		this.bound.mousewheel = this.mousewheel.bind(this);
		this.element.addEvent('mousewheel', this.bound.mousewheel);
	},
	
	mousewheel: function(event){
		var delta = event.wheel;
		this.doScroll(delta);
	},
	
	startScroll: function(side){
		if(this.scrollTimer) return;
		var startTime = 0;
		var startTop = this.element.getPosition().y;
		var self = this;
		var wrapper = this.element.getElement('.mif-menu-wrapper');
		var startHeight = wrapper.offsetHeight;
		var startScrollTop = wrapper.scrollTop;
		var scrollingTime = 0;
		this.scrollTimer = (function(){
			if($time() - self.time < 2000) return;
			if(!startTime) startTime = $time();
			var delta = ($time() - startTime)/50*10;
			if(!delta) return;
			if(side == 'top') delta = -delta;
			if(!self.scrollMove(delta)){
				$clear(self.scrollTimer);
				self.srollTimer = null;
			}else{
				startTime = $time();
			}
		}).periodical(50);
	},
	
	startScrollBottom: function(){
		this.startScroll('bottom');
	},
	
	startScrollTop: function(){
		return this.startScroll('top');
	},
	
	stopScroll: function(){
		$clear(this.scrollTimer);
		this.scrollTimer = null;
	},
	
	doScroll: function(delta){
		this.scrollMove(-10*delta);
	},
	
	scrollMove: function(delta){
		var side = delta < 0 ? 'top' : 'bottom';
		var wrapper = this.element.getElement('.mif-menu-wrapper');
		var offsetTop = this.element.offsetTop;
		if(side == 'bottom'){
			if(wrapper.scrollTop == wrapper.scrollHeight - wrapper.clientHeight) return;
			var limit = this.options.limits.top;
			var top = offsetTop - delta;
			if(top < limit){
				this.element.setStyle('top', limit);
				wrapper.setStyle('height', Math.min(wrapper.scrollHeight, wrapper.offsetHeight + offsetTop - limit));
				wrapper.scrollTop = wrapper.scrollTop + delta;
			}else{
				var height = wrapper.offsetHeight + delta;
				if(height > wrapper.scrollHeight){
					wrapper.setStyle('height', 'auto');
					this.element.setStyle('top', offsetTop - delta + (height - wrapper.scrollHeight));
				}else{
					wrapper.setStyle('height', height);
					this.element.setStyle('top', offsetTop - delta);
				}
			}
		}else{
			if(wrapper.scrollTop == this.items[0].getElement().offsetTop) return;
			var bottom = window.getSize().y - (offsetTop + wrapper.offsetHeight - delta - window.getScroll().y);
			var limit = this.options.limits.bottom;
			if(bottom < limit){
				wrapper.scrollTop = wrapper.scrollTop + delta;
			}else{
				var height = wrapper.offsetHeight - delta;
				wrapper.scrollTop = wrapper.scrollTop + delta;
				if(height > wrapper.scrollHeight){
					wrapper.setStyle('height', 'auto');
				}else{
					wrapper.setStyle('height', height);
				}
			}
		};
		var result = true;
		if(wrapper.scrollTop == this.items[0].getElement().offsetTop){
			this.top.setStyle('display', 'none');
			if(side == 'top') result = false;
		}else{
			this.top.setStyle('display', 'block');
		};
		if(wrapper.scrollTop == wrapper.scrollHeight - wrapper.offsetHeight){
			this.bottom.setStyle('display', 'none');
			if(side == 'bottom') result = false;
		}else{
			this.bottom.setStyle('display', 'block');
		}
		return result;
	},
	
	makeVisible: function(item){
		var el = item.getElement();
		var offsetTop = el.offsetTop;
		var offsetBottom = offsetTop + el.offsetHeight;
		var top = this.top.offsetHeight;
		var bottom = this.bottom.offsetHeight;
		var wrapper = this.element.getElement('.mif-menu-wrapper');
		var wrapperTop = wrapper.scrollTop + top;
		var wrapperBottom = wrapperTop + wrapper.offsetHeight - bottom;
		if(offsetTop < wrapperTop){
			this.scrollMove(offsetTop - wrapperTop);
		}else if(offsetBottom > wrapperBottom){
			this.scrollMove(offsetBottom - wrapperBottom + top);
		}
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
