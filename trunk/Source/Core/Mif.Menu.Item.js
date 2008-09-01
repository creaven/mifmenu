Mif.Menu.Item=new Class({

	Implements: [Events, Options],

	initialize: function(options, structure){
		this.setOptions(options);
		if(typeof options == 'string'){
			this.type='separator';
		}
		this.type=this.type||this.options.type||'default';
		this.name=this.options.name;
		this.group=this.options.group;
		this.checked=this.options.checked;
		this.disabled=this.options.disabled;
		$extend(this, structure);
		this.draw();
		if(['description', 'separator'].contains(this.type)) return;
		if(this.disabled) this.disable();
		
		if(this.options.list) this.initChildList();
		this.initClick();
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
				this.domWrapper=new Element('div', {'class': 'mif-menu-item-wrapper'});
				this.domIcon=new Element('span',{'class':'mif-menu-icon '+$pick(this.options.icon,''), html: Mif.Utils.zeroSpace});
				this.domName=new Element('span',{'class':'mif-menu-name', html: this.options.name});
				this.container=new Element('li',{'class': 'mif-menu-item'})
				.adopt(
					this.domWrapper.adopt(this.domIcon, this.domName)
				);
				this.container.store('item', this);
		}
		
	},
	
	initClick: function(){
		this.container.addEvent('click',this.onAction.bind(this));
		this.container.addEvent('click',function(){
			if(this.disabled) return;
			if(this.menu.closing>0) return;
			this.menu.hide();
		}.bind(this));
	},
	
	onAction: function(){
		if(!this.disabled) this.fireEvent('action', [this]);
	},
	
	disable: function(){
		this.container.addClass('mif-menu-disabled');
		this.disabled=true;
	},
	
	enable: function(){
		if(!this.disabled) return this;
		this.container.removeClass('mif-menu-disabled');
		this.disabled=false;
	},
	
	initChildList: function(){
		this.container.addClass('mif-childList');
		var options=$merge(this.options.list, {styles: {'z-index': this.list.options.styles['z-index']+1}});
		this.childList=new this.menu.List(options, {parentItem: this, menu: this.menu});
		var timer;
		var show=function(item){
			timer=function(){
				item.childList.show();
				this.list.openChildList=item.childList;
				timer=null;
			}.delay(300, this);
		}.bind(this);
		this.addEvent('select', show);
		var hide=function(item){
			if(timer){
				$clear(timer); 
				return;
			}
			item.childList.hide();
			this.list.openChildList=null;
		}
		this.addEvent('unSelect',hide.bind(this));
	},
	
	select: function(){
		this.container.addClass('mif-menu-selected');
		this.fireEvent('select',[this]);
	},
	
	unselect: function(){
		this.container.removeClass('mif-menu-selected');
		this.fireEvent('unSelect',[this]);
	},
	
	initCheckbox: function(){
		this.domIcon.addClass('mif-menu-'+(this.checked ? 'checked' : 'unchecked'));
		this.addEvent('action',function(){
			this.checked=!this.checked;
			var states=this.checked ? ['checked', 'unchecked'] : ['unchecked', 'checked'];
			this.domIcon.removeClass('mif-menu-'+states[1]).addClass('mif-menu-'+states[0]);
			this.list.fireEvent('check',[this, this.checked]);
		}.bind(this));
	},
	
	initRadio: function(){
		this.group=this.options.group;
		if(!this.list.groups[this.group]) this.list.groups[this.group]=[];
		var group=this.list.groups[this.group];
		group.push(this);
		if(this.checked){
			this.domIcon.addClass('mif-menu-radio-checked').removeClass('mif-menu-radio-unchecked');
		}else{
			this.domIcon.addClass('mif-menu-radio-unchecked').removeClass('mif-menu-radio-checked');
		}
		this.addEvent('action',function(){
			if(this.checked) return;
			group.each(function(item){
				if(item==this){
					item.checked=true;
					item.domIcon.addClass('mif-menu-radio-checked').removeClass('mif-menu-radio-unchecked');
					item.list.fireEvent('radioCheck', [this, true]);
					return;
				}
				if(item.checked){
					item.checked=false;
					item.domIcon.addClass('mif-menu-radio-unchecked').removeClass('mif-menu-radio-checked');
					item.list.fireEvent('radioUnCheck', [this, false]);
				}
			}, this);
		}.bind(this));
	}
	
});