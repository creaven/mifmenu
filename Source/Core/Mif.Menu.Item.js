/*
---
 
name: Mif.Menu.Item
description: menu item class
license: MIT-Style License (http://mifjs.net/license.txt)
copyright: Anton Samoylov (http://mifjs.net)
authors: Anton Samoylov (http://mifjs.net)
requires: 
  - Mif.Menu
provides: Mif.Menu.Item
 
...
*/

Mif.Menu.Item=new Class({

	Implements: [Events],
	
	defaults: {
		name: ''
	},

	initialize: function(structure, property){
		if(typeof property == 'string') {
			if(property == '-'){
				property = {sep: true};
			}else{
				property = {desc: property};
			}
		};
		this.property = {};
		$extend(this.property, this.defaults);
		$extend(this.property, property);
		$extend(this, structure);
		var group = this.property.group;
		if(group){
			this.menu.group[group] = this.menu.group[group] || [];
			this.menu.group[group].push(this);
		};
		this.UID = ++Mif.UID;
		Mif.uids[this.UID] = this;
		var id = this.get('id');
		if(id != null) Mif.ids[id] = this;
		this.menu.fireEvent('itemCreate', [this]);
	},
	
	get: function(prop){
		return this.property[prop];
	},
	
	set: function(obj){
		if(arguments.length == 2){
			var object = {};
			object[arguments[0]] = arguments[1];
			obj = object;
		};
		this.menu.fireEvent('beforeSet', [this, obj]);
		var property = obj || {};
		for(var p in property){
			var nv = property[p];
			var cv = this[p];
			this.updateProperty(p, cv, nv);
			this.property[p] = nv;
		};
		this.menu.fireEvent('set', [this, obj]);
		return this;
	},
	
	updateProperty: function(p, cv, nv){
		if(nv == cv) return this;
		if(p == 'id'){
			delete Mif.ids[cv];
			if(nv) Mif.ids[nv] = this;
			return this;
		}
		if(!this.menu.isUpdatable(this)) return this;
		switch(p){
			case 'name':
				this.getElement('name').set('html', nv);
				this.menu.updateWidth();
				return this;
			case 'cls':
				this.getElement().removeClass(cv).addClass(nv);
				return this;
			case 'icon':
				var iconEl = this.getElement('icon');
				if(iconEl) iconEl.dispose();
				if(!nv) return this;
				if(nv.indexOf('/') == -1 && nv.substring(0, 1) == '.'){
					iconEl = new Element('span').addClass(nv.substring(1));
				}else{
					iconEl = new Element('img').setProperty('src', nv);
				};
				iconEl.addClass('mif-menu-icon').inject(this.getElement('name'), 'before');
				return this;
			case 'disabled':
				this.getElement()[(nv ? 'add' : 'remove') + 'Class']('disabled');
				if(nv && this.menu.hovered == this) this.menu.unselect();
				return this;
			case 'hidden':
				var height = this.getElement().offsetHeight;
				var offsetHeight = this.menu.wrapper.offsetHeight;
				var scrollHeight = this.menu.wrapper.scrollHeight;
				this.getElement().setStyle('display', nv ? 'none' : 'block');
				if(scrollHeight - height < offsetHeight){
					this.menu.setHeight(scrollHeight - height);
				}else{
					this.menu.setHeight(this.menu.wrapper.offsetHeight);
				}
				return this;
		}
	},
	
	action: function(){
		if(this.get('disabled')) return this;
		var action = this.property.action;
		if(action){
			if(typeof action == 'string'){
				action = eval('(' + action + ')');
				this.property.action = action;
			} ;
			action.call(this.menu, this);
		};
		this.menu.fireEvent('action', [this]);
		if(this.get('checked') != undefined && (this.get('group') ? !this.property.checked : true)) this.check();
		return this;
	},
	
	check: function(state){
		if(this.property.checked == state) return this;
		var group = this.get('group');
		if(!this.property.checked && group){
			this.menu.group[group].each(function(item){
				item.check(false);
			});
		};
		this.property.checked = !this.property.checked;
		var el = this.getElement('check');
		if(el) el[(this.property.checked ? 'add' : 'remove') + 'Class']('mif-menu-checked');
		if(!(group && !this.property.checked)){
			var check = this.property.check;
			if(check){
				if(typeof check == 'string'){
					check = eval('(' + check + ')');
					this.property.check = check;
				};
				check.call(this.menu, this, this.property.checked);
			};
		};
		this.menu.fireEvent('check', [this, this.property.checked]);
	}
		
});
