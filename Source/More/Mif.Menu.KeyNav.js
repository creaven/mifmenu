/*
Mif.Menu.KeyNav
*/

Mif.Menu.KeyNav = new Class({
	
	initialize: function(menu){
		this.menu = menu;
		this.bound = {
			attach: this.attach.bind(this),
			detach: this.detach.bind(this),
			keyaction: this.keyaction.bind(this)
		};
		this.keyevent = (Browser.Engine.presto || Browser.Engine.gecko) ? 'keypress' : 'keydown';
		menu.addEvent('show', this.bound.attach);
		menu.addEvent('hide', this.bound.detach);
		menu.addEvent('showSubmenu', this.bound.detach);
		menu.addEvent('hideSubmenu', this.bound.attach);
	},
	
	attach: function(){
		document.addEvent(this.keyevent, this.bound.keyaction);
	},
	
	detach: function(){
		document.removeEvent(this.keyevent, this.bound.keyaction);
	},
	
	keyaction: function(event){
		if(!['down','left','right','up','enter', 'esc'].contains(event.key)) return;
			if(event.key == 'esc'){
				this.menu.hide();
				return;
			};
			var current = this.menu.hovered;
			switch (event.key){
				case 'down': this.goForward(current); break;  
				case 'up': this.goBack(current); break;   
				case 'left': this.goLeft(current); break;
				case 'right': this.goRight(current); break;
				case 'enter': this.action(current);
			}
			return false;
	},

	goForward: function(current){
		var menu = this.menu;
		var items = this.menu.items;
		while(1){
			var index = items.indexOf(current);
			if(index == items.length - 1) return;
			current = items[index + 1];
			if(!current) return;
			if(!current.get('disabled') && !current.get('hidden') && !current.get('sep') && !current.get('desc')) break;
		};
		menu.select(current);
	},
	
	goBack: function(current){
		var menu = this.menu;
		var items = this.menu.items;
		while(1){
			var index = items.indexOf(current);
			if(index == 0) return;
			if(index == -1) index = items.length;
			current = items[index - 1];
			if(!current) return;
			if(!current.get('disabled') && !current.get('hidden') && !current.get('sep') && !current.get('desc')) break;
		};
		menu.select(current);
	},
	
	goLeft: function(current){
		if(this.menu.parentItem){
			this.menu.parentItem.menu.hideSubmenu();
		};
	},
	
	goRight: function(current){
		var submenu = current.submenu;
		if(!submenu) return;
		var menu = this.menu;
		menu.showSubmenu(current, 0);
		submenu.select(submenu.items[0]);
	},
	
	action: function(current){
		this.menu.action(current);
	}
	
});
