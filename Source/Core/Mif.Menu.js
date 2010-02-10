/*
Mif.Menu
*/


Mif.Menu=new Class({
	
	version: '1.2',

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
		this.updateWidth();
		this.updateHeight();
		this.position(coords);
		this.addHideOnExtraClick();
		this.time = $time();
		return this.fireEvent('show');
	},
	
	hide: function(){
		if(this.hidden) return;
		this.hidden = true;
		this.unselect();
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
			var size = window.getSize(), scroll = window.getScroll();
			var menu = {x: this.element.offsetWidth, y: this.element.offsetHeight};
			var item = {x: parent.offsetWidth, y: 0};
			var props = {x: 'left', y: 'top'};
			var coords = {};
			for (var z in props){
				var pos = position[z] + item[z] + this.options.submenuOffsets[z];
				if ((pos + menu[z] - scroll[z]) > size[z]) pos = position[z] - menu[z] - this.options.submenuOffsets[z];
				coords[z] = Math.max(0, pos);
			}
		}else{
			if(coords.event) coords = coords.page;
			var y = coords.y;
			var size = window.getSize(), scroll = window.getScroll();
			var menu = {x: this.element.offsetWidth, y: this.element.offsetHeight};
			var props = {x: 'left', y: 'top'};
			
			var pos = coords.x + this.options.offsets.x;
			if ((pos + menu.x - scroll.x) > size.x) pos = coords.x - this.options.offsets.x - menu.x;
			coords.x = Math.max(0, pos);
			
			var pos = coords.y + this.options.offsets.y;
			var delta = (pos + menu.y - scroll.y) - (size.y - this.options.limits.bottom);
			if (delta > 0){
				if(this.element.scrollHeight - delta > this.items[0].getElement().offsetHeight*2){
					this.setHeight(this.element.scrollHeight - delta).scrollTo(this.items[0], true);
				}else{
					pos = coords.y - this.options.offsets.y - menu.y;
				}
			}
			coords.y = Math.max(this.options.limits.top, pos);
			var delta = coords.y + this.element.offsetHeight - y;
			if(coords.y < y && delta > 0){
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
		if(this.element.hasChild(target) || this.element == target) return;
		this.hide();
		document.removeEvent('mousedown', this.bound.hideOnExtraClick); 
	},
	
	events: function(){
		this.bound={
			close: this.close.bind(this),
			hover: this.hover.bind(this),
			hideOnExtraClick: this.hideOnExtraClick.bind(this),
			startScrollBottom: this.startScrollBottom.bind(this),
			startScrollTop: this.startScrollTop.bind(this),
			stopScrollBottom: this.stopScrollBottom.bind(this),
			stopScrollTop: this.stopScrollTop.bind(this)
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
		bottom.addEvents({
			mouseenter: this.bound.startScrollBottom,
			mouseleave: this.bound.stopScrollBottom
		});
		top.addEvents({
			mouseenter: this.bound.startScrollTop,
			mouseleave: this.bound.stopScrollTop
		});
		this.bound.mousewheel = this.mousewheel.bind(this);
		this.element.getElement('.mif-menu-wrapper').addEvent('mousewheel', this.bound.mousewheel);
	},
	
	mousewheel: function(event){
		var delta = event.wheel;
		this.doScroll(delta);
	},
	
	startScrollBottom: function(){
		this.startScroll('bottom');
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
			var delta = ($time() - startTime)/50*10
			if(side == 'bottom'){
				if(wrapper.scrollTop == wrapper.scrollHeight - wrapper.clientHeight) return;
				var limit = self.options.limits.top;
				var top = startTop - delta;
				if(top < limit){
					if(!scrollingTime) scrollingTime = $time();
					wrapper.scrollTop = startScrollTop + ($time() - scrollingTime)/50*10;
					if(wrapper.scrollTop >= wrapper.scrollHeight - wrapper.clientHeight){
						$clear(self.scrollTimer);
						self.srollTimer = null;
					}
				}else{
					var height = startHeight + delta;
					if(height > wrapper.scrollHeight){
						wrapper.setStyle('height', 'auto');
						$clear(self.scrollTimer);
						self.scrollTimer = null;
						self.element.setStyle('top', top + height - wrapper.scrollHeight);
					}else{
						wrapper.setStyle('height', height);
						self.element.setStyle('top', top);
					}
				}
			}else{
				if(wrapper.scrollTop == self.items[0].getElement().offsetTop) return;
				var limit = self.options.limits.bottom;
				var bottom = window.getSize().y - (startTop + wrapper.offsetHeight + delta - window.getScroll().y);
				if(bottom < limit){
					var height = window.getSize().y - window.getScroll().y - self.element.offsetTop - limit;
					if(height > wrapper.scrollHeight){
						wrapper.setStyle('height', 'auto');
						$clear(self.scrollTimer);
						self.scrollTimer = null;
					}else{
						wrapper.setStyle('height', height);
					}
					if(!scrollingTime) scrollingTime = $time();
					wrapper.scrollTop = startScrollTop - ($time() - scrollingTime)/50*10;
					if(wrapper.scrollTop == 0){
						$clear(self.scrollTimer);
						self.srollTimer = null;
					}
				}else{
					var height = startHeight + delta;
					wrapper.scrollTop = startScrollTop - delta;
					if(height > wrapper.scrollHeight){
						wrapper.setStyle('height', 'auto');
						$clear(self.scrollTimer);
						self.scrollTimer = null;
					}else{
						wrapper.setStyle('height', height);
					}
				}
			}
			self.top.setStyle('display', wrapper.scrollTop == self.items[0].getElement().offsetTop ? 'none' : 'block');
			self.bottom.setStyle('display', wrapper.scrollTop == wrapper.scrollHeight - wrapper.clientHeight ? 'none' : 'block');
		}).periodical(50);
	},
	
	doScroll: function(delta){
		delta = -10*delta;
		var side = delta < 0 ? 'top' : 'bottom';
		var wrapper = this.element.getElement('.mif-menu-wrapper');
		var startTop = this.element.offsetTop;
		if(side == 'bottom'){
			if(wrapper.scrollTop == wrapper.scrollHeight - wrapper.clientHeight) return;
			var limit = this.options.limits.top;
			var top = startTop - delta;
			if(top < limit){
				this.element.setStyle('top', limit);
				wrapper.setStyle('height', wrapper.offsetHeight + startTop - limit);
				wrapper.scrollTop = wrapper.scrollTop + delta;
			}else{
				var height = wrapper.offsetHeight + delta;
				if(height > wrapper.scrollHeight){
					wrapper.setStyle('height', 'auto');
					this.element.setStyle('top', startTop - delta + (height - wrapper.scrollHeight));
				}else{
					wrapper.setStyle('height', height);
					this.element.setStyle('top', startTop - delta);
				}
				
			}
		}else{
			if(wrapper.scrollTop == this.items[0].getElement().offsetTop) return;
			var bottom = window.getSize().y - (startTop + wrapper.offsetHeight - delta - window.getScroll().y);
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
		}
		this.top.setStyle('display', wrapper.scrollTop == this.items[0].getElement().offsetTop ? 'none' : 'block');
		this.bottom.setStyle('display', wrapper.scrollTop == wrapper.scrollHeight - wrapper.clientHeight ? 'none' : 'block');
	},
	
	stopScrollBottom: function(){
		$clear(this.scrollTimer);
		this.scrollTimer = null;
	},
	
	startScrollTop: function(){
		return this.startScroll('top');
	},
	
	stopScrollTop: function(){
		$clear(this.scrollTimer);
		this.scrollTimer = null;
	},
	
	scrollTo: function(item, noanim){
		var scrollTop = item.getElement().offsetTop;
		if(noanim){
			this.scroll.set(0, scrollTop);
			this.scroll.fireEvent('complete');
		}else{
			this.scroll.start(0, scrollTop);
		}
	}
	
});
