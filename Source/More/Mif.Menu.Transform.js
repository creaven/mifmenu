/*
Mif.Menu.Transform
*/

Mif.Menu.Item.implement({

	inject: function(current, where){
		where = where || 'after';
		this.menu.items.erase(this);
		current.menu.items.inject(this, current, where);
		this.menu = current.menu;
		current.menu.updateInject(this);
		return this;
	},
	
	copy: function(item, where){
		if (this.get('copyDenied')) return;		
		var itemCopy = new Mif.Menu.Item({
			menu: item.menu
		}, $unlink(this.property));
		return itemCopy.inject(item, where);
	},
	
	remove: function(){
		this.menu.fireEvent('beforeRemove', [this]);
		this.menu.items.erase(this);
		var element = this.getElement();
		if(element) element.dispose();
		this.menu.fireEvent('remove', [this]);
	}
	
});


Mif.Menu.implement({
	
	move: function(from, to, where){
		where = where || 'after';
		if(from.inject(to, where)){
			this.fireEvent('move', [from, to, where]);
		}
		return this;
	},
	
	copy: function(from, to, where){
		var copy = from.copy(to, where);
		if(copy){
			this.fireEvent('copy', [from, to, where, copy]);
		}
		return this;
	},
	
	remove: function(item){
		item.remove();
		return this;
	},

	add: function(item, current, where){
		where = where || 'after';
		if(!(item instanceof Mif.Menu.Item)){
			item = new Mif.Menu.Item({menu: this}, item);
		}
		if($type(current) == 'number') current = this.items[current];
		item.inject(current, where);
		this.fireEvent('add', [item, current, where]);
		return this;
	},
	
	connect: function(item){
		this.disconnect(item);
		this.parentItem = item;
		item.submenu = this;
		var el = item.getElement();
		if(el){
			new Element('span', {'class': 'mif-menu-submenu'}).inject(el);
		}
		this.fireEvent('connect', [item]);
		return this;
	},
	
	disconnect: function(){
		var parentItem = this.parentItem;
		if(!parentItem) return this;
		parentItem.submenu.hide();
		parentItem.submenu = null;
		var submenuEl = parentItem.getElement('submenu');
		if(submenuEl) submenuEl.dispose();
		this.fireEvent('disconnect', [parentItem]);
		return this;
	}
	
});
