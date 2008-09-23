/*
Mif.Menu.Item
*/

Mif.Menu.Item=new Class({

	Implements: [Events, Options],
	
	options: {
		type: 'default',
		checked: false,
		disabled: false,
		name: ''
	},

	initialize: function(options, structure){
		if(typeof options == 'string'){
			options={type: 'separator'};
		}
		this.setOptions(options);
		
		$extend(this, this.options);
		
		this.list=structure.list;
		this.menu=this.list.menu;
		
		this.draw();
		
		if(['description', 'separator'].contains(this.type)) return;
		
		if(this.disabled) {
			this.disabled=false;
			this.disable();
		}
		
		if(this.options.list) this.initChildList();
		
		if(this.type=='checkbox'){
			this.initCheckbox();
		}
		if(this.type=='radio'){
			this.initRadio();
		}
	},
	
	draw: function(){
		switch(this.type){
			case 'description': 
				this.container=new Element('li', {'class':'mif-menu-description mif-menu-name', html: this.options.name});
				break;
			case 'separator':
				this.container = new Element('li', {'class': 'mif-menu-separator mif-menu-name'});
				break;
			case 'default':
			case 'radio':
			case 'checkbox':
				this.dom={
					wrapper: new Element('div', {'class': 'mif-menu-item-wrapper'}),
					icon: new Element('span',{'class':'mif-menu-icon '+$pick(this.options.icon,''), html: Mif.Utils.zeroSpace}),
					name: new Element('span',{'class':'mif-menu-name', html: this.options.name})
				};
				this.container=new Element('li',{'class': 'mif-menu-item'}).adopt(
					this.dom.wrapper.adopt(this.dom.icon, this.dom.name)
				);
				this.container.store('item', this);
		}
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
	
	initChildList: function(){
		this.container.addClass('mif-childList');
		var options=$merge(this.options.list, {styles: {'z-index': this.list.options.styles['z-index']+1}});
		this.childList=new this.menu.List(options, {parentItem: this, menu: this.menu});
	},
	
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
	}
	
});
