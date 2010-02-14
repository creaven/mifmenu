/*
---
 
name: Mif.Menu
description: Mif.Menu base class
license: MIT-Style License (http://mifjs.net/license.txt)
copyright: Anton Samoylov (http://mifjs.net)
authors: Anton Samoylov (http://mifjs.net)
requires: 
  - Mif.Core
provides: Mif.Menu
 
...
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
			top: 10,
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
		this.group = {};
		this.UID = ++Mif.UID;
		Mif.uids[this.UID] = this;
		this.element.setAttribute('uid', this.UID);
		if(this.options.id){
			Mif.ids[this.options.id] = this;
		}
		this.events();
		if(Mif.Menu.KeyNav) new Mif.Menu.KeyNav(this);
	},
	
	show: function(coords){
		if(coords && coords.event) coords.preventDefault();
		this.hidden = false;
		if(!this.items.length) return this;
		if(!this.$draw) this.draw();
		this.element.setStyle('margin-left', 0);
		this.updateWidth();
		this.position(coords);
		this.addHideOnExtraClick();
		this.time = $time();
		this.focus();
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
	
	focus: function(){
		if(Mif.Focus && Mif.Focus == this) return this;
		if(Mif.Focus) Mif.Focus.blur();
		Mif.Focus = this;
		return this.fireEvent('focus');
	},
	
	blur: function(){
		Mif.Focus = null;
		return this.fireEvent('blur');
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
				if(this.element.offsetHeight - delta > this.wrapper.getStyle('min-height').toInt()*3){
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
	
	hideOnExtraClick: function(event){
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
			show: this.show.bind(this),
			hideOnExtraClick: this.hideOnExtraClick.bind(this)
		};
		this.element.addEvents({
			mouseover: this.bound.hover,
			mouseout: this.bound.hover,
			click: this.bound.close
		});
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
		if(item.submenu || item.get('hasSubmenu')){
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
		var el = this.hovered.getElement();
		if(el) el.removeClass('hover');
		this.fireEvent('hover', ['out', this.hovered]);
		this.hideSubmenu();
		this.hovered = null;
	},
	
	showSubmenu: function(item, delay){
		var self = this;
		item.timer = function(){
			if(!item.submenu){
				item.addEvent('load', function(){
					if(item == item.menu.hovered && !item.menu.hidden) self.showSubmenu(item, 0);
					item.removeEvent('load', arguments.callee);
				});
				item.load();
				return;
			}
			var submenu = item.submenu;
			var menu = item.menu;
			menu.blur();
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
		item.menu.focus();
	},
	
	close: function(event){
		var item;
		if(event.event){
			var target = document.id(event.target);
			var itemEl = target.getAncestor('.mif-menu-item');
			if(itemEl) item = Mif.uids[itemEl.getAttribute('uid')];
		}else{
			item = event;
		};
		if(item){
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
	
	attach: function(target){
		this.target = document.id(target);
		this.target.addEvent('contextmenu', this.bound.show);
		return this;
	},
	
	detach: function(){
		if(this.target) this.target.removeEvent('contextmenu', this.bound.show);
		return this;
	}
	
});
