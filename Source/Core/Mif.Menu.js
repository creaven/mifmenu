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
		minWidth: 200,
		submenuShowDelay: 300,
		submenuOffsets: {
			x: 0,
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
			var parent=this.parentItem.getElement();
			position=parent.getPosition();
			
			var size = window.getSize(), scroll = window.getScroll();
			var menu = {x: this.element.offsetWidth, y: this.element.offsetHeight};
			var item = {x: parent.offsetWidth, y: 0};
			var props = {x: 'left', y: 'top'};
			var coords={};
			
			for (var z in props){
				var pos=position[z]+item[z]+this.options.submenuOffsets[z];
				if ((pos + menu[z] - scroll[z]) > size[z]) pos = position[z]-menu[z]-this.options.submenuOffsets[z];
				coords[z]=Math.max(0, pos);
			}
			
		}else{
			if(coords.event){
				coords = coords.page;
			}
			var size = window.getSize(), scroll = window.getScroll();
			var menu = {x: this.element.offsetWidth, y: this.element.offsetHeight};
			var props = {x: 'left', y: 'top'};
			for (var z in props){
				var pos = coords[z] + this.options.offsets[z];
				if ((pos + menu[z] - scroll[z]) > size[z]) pos = coords[z] - this.options.offsets[z] - menu[z];
				coords[z]=Math.max(0, pos);
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
	}
	
});
