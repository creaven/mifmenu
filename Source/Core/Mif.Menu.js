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
			top: 10,
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
		this.element = new Element('div', {'class': 'mif-menu'}).inject(document.body).setStyle('margin-left', -5000);
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
		if(!this.items.length) return this;
		if(!this.$draw) this.draw();
		this.element.setStyle('margin-left', 0);
		this.updateWidth();
		this.position(coords);
		this.addHideOnExtraClick();
		this.time = $time();
		return this.fireEvent('show');
	},
	
	hide: function(){
		if(this.hidden || !this.$draw) return;
		this.hidden = true;
		this.unselect();
		this.element.removeClass('left').removeClass('right');
		this.wrapper.setStyle('height', 'auto');
		this.top.setStyle('display', 'none');
		this.bottom.setStyle('display', 'none');
		this.element.setStyle('margin-left', -5000);
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
			if(!parent) return this.hide();
			position = parent.getPosition();
			var size = window.getSize(), scroll = window.getScroll();
			var menu = {x: this.element.offsetWidth, y: this.element.offsetHeight};
			var props = {x: 'left', y: 'top'};
			var coords = {};
			//x
			var side = 'right';
			var pos = position.x + parent.offsetWidth + this.options.submenuOffsets.x;
			if ((pos + menu.x - scroll.x) > size.x){
				side = 'left';
				pos = position.x - menu.x - this.options.submenuOffsets.x;
			}
			coords.x = Math.max(0, pos);
			this.element.addClass(side);
			//y
			var pos = position.y + this.options.submenuOffsets.y;
			var delta = (pos + menu.y - scroll.y) - (size.y - this.options.limits.bottom);
			if (delta > 0){
				pos -= delta;
			};
			coords.y = Math.max(this.options.limits.top, pos);
			var delta = size.y - this.options.limits.bottom - (coords.y - scroll.y);
			if(delta < this.wrapper.offsetHeight){
				this.setHeight(delta - (this.element.offsetHeight - this.wrapper.offsetHeight));
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
				if(this.element.offsetHeight - delta > this.items[0].getElement().offsetHeight*3){
					this.setHeight(this.element.offsetHeight - delta - (this.element.offsetHeight - this.wrapper.offsetHeight));
				}else{
					pos = coords.y - this.options.offsets.y - menu.y;
				}
			}
			coords.y = Math.max(this.options.limits.top, pos);
			var delta = coords.y + this.element.offsetHeight - y;
			if(coords.y < y && delta > 0){
				this.setHeight(y - coords.y - (this.element.offsetHeight - this.wrapper.offsetHeight));
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
		var wrapper = this.wrapper;
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
		['mouseover', 'mouseout'].each(function(event){
			this.element.addEvent(event, this.bound.hover)
		}, this);
		this.element.addEvent('click', this.bound.close);
	},
	
	hover: function(event){
		if(this.hidden) return;
		var target = $(event.target);
		var itemEl = target.getAncestor('.mif-menu-item');
		if(!itemEl) return this.unselect();
		var item = Mif.uids[itemEl.getAttribute('uid')];
		if(event.type == 'mouseout' && event.relatedTarget && !$(event.relatedTarget).getAncestor('.mif-menu-item') && (item.submenu ? this.openSubmenu != item.submenu : true)) return this.unselect();
		if(item.get('disabled')) return this.unselect();
		if(this.hovered == item) return;
		this.select(item);
		if(item.submenu) this.showSubmenu(item);
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
		var el = this.hovered.getElement();
		if(el) el.removeClass('hover');
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
		var target = document.id(event.target);
		var itemEl = target.getAncestor('.mif-menu-item');
		if(itemEl){
			var item = Mif.uids[itemEl.getAttribute('uid')];
			item.action();
			$clear(item.timer);
			item.timer = null;
		};
		this.hide();
		var parentItem = this.parentItem;
		while(parentItem){
			parentItem.menu.hide();
			parentItem = parentItem.menu.parentItem;
		}
		return this;
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
