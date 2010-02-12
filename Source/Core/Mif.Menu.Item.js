/*
Mif.Menu.Item
*/

Mif.Menu.Item=new Class({

	Implements: [Events],
	
	defaults: {
		type: 'default',
		checked: false,
		disabled: false,
		name: ''
	},

	initialize: function(structure, property){
		if(typeof property == 'string') property = {type: 'separator'};
		this.property = {};
		$extend(this.property, this.defaults);
		$extend(this.property, property);
		$extend(this, this.property);
		$extend(this, structure);		
		this.initCheckbox();
		this.initRadio();
		this.UID = ++Mif.UID;
		Mif.uids[this.UID] = this;
		var id = this.get('id');
		if(id != null) Mif.ids[id] = this;
		this.menu.fireEvent('itemCreate', [this]);
	},
	
	get: function(prop){
		return this[prop];
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
			this[p] = this.property[p]=nv;
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
				var iconCls;
				if(cv.indexOf('/') == -1 && cv[0] == '.'){
					iconCls = cv.substring(1);
					iconEl.removeClass(iconCls);
				}else{
					iconEl.setAttribute('src', Mif.TransparenImage);
				};
				if(nv.indexOf('/') == -1 && nv[0] == '.'){
					iconCls = nv.substring(1);
					iconEl.addClass(iconCls);
				}else{
					iconEl.setAttribute('src', nv);
				};
				return this;
			case 'disabled':
				this.getElement()[(nv ? 'add' : 'remove') + 'Class']('disabled');
				return this;
		}
	},
	
	action: function(){
		if(this.get('disabled')) return;
		var action = this.property.action;
		if(action) action();
		this.menu.fireEvent('action', [this]);
	},
	
	check: function(state){
		if(this.type=='checkbox'){
			if($defined(state)){
				if(this.checked==state) return this;
				this.checked=state;
			}else{
				this.checked=!this.checked;
			}
			if(this.checked){
				this.dom.icon.removeClass('mif-menu-unchecked').addClass('mif-menu-checked');
			}else{
				this.dom.icon.removeClass('mif-menu-checked').addClass('mif-menu-unchecked');
			}
			this.list.fireEvent('check', [this, this.checked]);
		}
		if(this.type=='radio'){
			var checked=$defined(state) ? state : true;
			if(this.checked==checked) return this;
			this.checked=checked;
			this.list.groups[this.group].each(function(item){
				if(item==this && this.checked){
					item.checked=true;
					item.dom.icon.addClass('mif-menu-radio-checked').removeClass('mif-menu-radio-unchecked');
					item.list.fireEvent('radioCheck', [this, true]);
					return;
				}else{
					item.checked=false;
					item.dom.icon.addClass('mif-menu-radio-unchecked').removeClass('mif-menu-radio-checked');
					item.list.fireEvent('radioCheck', [this, false]);
				}
			}, this);
		}
		return this;
	},
	
	initCheckbox: function(){
		return;
		this.dom.icon.addClass('mif-menu-'+(this.checked ? 'checked' : 'unchecked'));
		this.addEvent('action',this.check.bind(this));
	},
	
	initRadio: function(){
		return;
		this.list.groups[this.group]=(this.list.groups[this.group]||[]).include(this);
		this.dom.icon.addClass('mif-menu-radio-' + (this.checked ? 'checked' : 'unchecked'));
		this.addEvent('action',this.check.bind(this));
	},
	
	addLoader: function(){
		console.log('add loader', this);
	},
	
	removeLoader: function(){
		console.log('remove loader', this);
	}
	
});
