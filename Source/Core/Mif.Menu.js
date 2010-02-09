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
		/*
		this.target=this.options.target ? $(this.options.target) : document;
		this.showed=[];
		this.visible=[];
		this.hidden=true;
		
		if(this.options.offsets){
			$extend(this.options.list, this.options.offsets);
		}			
		this.addEvent('hide', function(){
			this.closing=false;
			this.hidden=true;
			document.removeEvent('keyup', this.bound.escape);
			document.removeEvent('mousedown', this.bound.close);
		}, true);
		this.addEvent('show', function(){
			this.hidden=false;
			document.addEvent('keyup', this.bound.escape);
			document.addEvent('mousedown', this.bound.close);
		}, true);
		*/
		this.events();
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
		this.element.dispose();
		this.hideSubmenu();
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
			escape: this.escape.bind(this),
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
		if(!itemEl)	return this.onMouseout();
		var item = Mif.uids[itemEl.getAttribute('uid')];
		if(this.hovered == item) return;
		this.onMouseout();
		this.hovered = item;
		this.hovered.getElement().addClass('hover');
		this.fireEvent('hover', ['over', this.hovered]);
		if(!item.disabled && item.submenu){
			this.showSubmenu(item);
		}
	},
	
	onMouseout: function(){
		if(!this.hovered) return;
		var item = this.hovered;
		$clear(item.timer);
		this.hovered.getElement().removeClass('hover');
		this.fireEvent('hover', ['out', this.hovered]);
		this.hideSubmenu();
		this.hovered = null;
	},
	
	showSubmenu: function(item){
		item.timer = function(){
			item.submenu.show();
			item.menu.openSubmenu = item.submenu;
			item.timer=null;
		}.delay(this.options.submenuShowDelay);
	},
	
	hideSubmenu: function(){
		if(!this.openSubmenu) return;
		this.openSubmenu.onMouseout();
		var item = this.openSubmenu.parentItem;
		$clear(item.timer);
		item.submenu.hide();
		this.openSubmenu = false;
	},
	
	close: function(event){
		if(this.$attaching) return;
		if(this.list.visible) this.hide();
	},
	
	escape: function(event){
		if(event.key!='esc') return;
		var list=this.showed.getLast();
		if(list) list.hide();
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
