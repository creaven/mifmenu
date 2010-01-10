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
		if(typeof options == 'string'){
			options={type: 'separator'};
		}
		this.property = {};
		$extend(this.property, this.defaults);
		$extend(this.property, property);
		$extend(this, this.property);
		$extend(this, structure);		
		this.initCheckbox();
		this.initRadio();
		this.UID=++Mif.UID;
		Mif.uids[this.UID]=this;
		var id=this.get('id');
		if(id!=null) Mif.ids[id]=this;
		this.menu.fireEvent('itemCreate', [this]);
	},
	
	setState: function(state){
		if(this.disabled!=state){
			this.container[(state ? 'add' : 'remove') + 'Class']('mif-menu-disabled');
			this.disabled=state;
		}
		return this;
	},
	
	disable: function(){
		return this.setState(true);
	},
	
	enable: function(){
		return this.setState(false);
	},
	
	set: function(obj){
		if(arguments.length == 2){
			var object = {};
			object[arguments[0]] = arguments[1];
			obj = object;
		}
		this.menu.fireEvent('beforeSet', [this, obj]);
		var property=obj.property||obj||{};
		for(var p in property){
			var nv=property[p];
			var cv=this[p];
			this.updateProperty(p, cv, nv);
			this[p]=this.property[p]=nv;
		}
		this.menu.fireEvent('set', [this, obj]);
		return this;
	},
	
	updateProperty: function(p, cv, nv){
		if(nv==cv) return this;
		if(p=='id'){
			delete Mif.ids[cv];
			if(nv) Mif.ids[nv]=this;
			return this;
		}
		if(!Mif.Tree.Draw.isUpdatable(this)) return this;
		switch(p){
			case 'name':
				this.getElement('name').set('html', nv);
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
	/*
	initChildList: function(){
		this.container.addClass('mif-childList');
		var options=$merge(this.options.list, {styles: {'z-index': this.list.options.styles['z-index']+1}});
		this.childList=new this.menu.List(options, {parentItem: this, menu: this.menu});
	},
	*/
	select: function(){
		var cls=this.disabled ? 'mif-menu-selected-disabled' : 'mif-menu-selected';
		this.container.addClass(cls);
		return this.fireEvent('select');
	},
	
	unselect: function(){
		var cls=this.disabled ? 'mif-menu-selected-disabled' : 'mif-menu-selected';
		this.container.removeClass(cls);
		return this.fireEvent('unSelect');
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
		this.dom.icon.addClass('mif-menu-'+(this.checked ? 'checked' : 'unchecked'));
		this.addEvent('action',this.check.bind(this));
	},
	
	initRadio: function(){
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
