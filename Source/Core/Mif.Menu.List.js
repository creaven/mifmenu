Mif.Menu.List=function(type){
	var types=arguments.callee.types;
	var lists=arguments.callee.lists;
	if(!types) {
		types=[]; 
		lists=[];
	};
	var index=types.indexOf(type);
	if(index!=-1) return lists[index];
	
	var List=new Class({

		Implements: [Events, Options],
		
		Extends: type.container,
		
		options: $merge({
			styles: {
				'z-index': 1,
				position: 'absolute'
			}
		}, type.options),

		initialize: function(options, structure){
			this.setOptions(options);
			this.parent($merge(this.options, {styles: {position: 'absolute'}}), 'mifmenu');
			this.list=new Element('ul', {'class': 'mif-menu-list'});
					
			this.openChildList=null;
			
			$extend(this, structure);
			$extend(this.options.offsets, this.menu.options.offsets);
			this.items=[];
			this.groups={};
			this.selected=null;
			
			this.initMenu();
			this.drawMenu();
			

			this.initEvents();
			this.container.setStyle('opacity',0);
			
		},
		
		initMenu: function(){
			this.options.items.each(function(options){
				var item=new Mif.Menu.Item(options, {menu: this.menu, list: this});
				this.items.push(item);
			}, this);
		},
		
		drawMenu: function(){
			this.items.each(function(item){
				this.list.adopt(item.container);
			}, this);
			this.setContent(this.list).draw();
		},
		
		//private
		setWidth: function(){
			if(!Browser.Engine.trident) return;
			this.container.setStyle('width', 0);
			var width=this.list.offsetWidth;
			this.container.setStyle('width', width);
			this.list.setStyle('width',width);
			this.draw();
		},
		
		append: function(index, item){
			item.container.injectAfter(this.items[index].container);
		},
		
		initEvents: function(){
			this.container.addEvents({
				'click': $lambda(false),
				'mousedown': $lambda(false),
				'selectstart': $lambda(false),
				'mouseover': this.initSelect.bindWithEvent(this),
				'mouseout': this.initSelect.bindWithEvent(this)
			});
		},
		
		hide: function(parents){
			if(this.hiding) return;
			this.hiding=true;
			this.unselect();
			this.menu.showed.erase(this);
			this.morpher.start({opacity: 0}).chain(function(){
				this.container.dispose();
				this.menu.visible.erase(this);
				this.hiding=false;
				if(!this.menu.visible.length) this.menu.fireEvent('hide');
			}.bind(this));
			this.hideChildren();
			if(!parents) return;
			this.hideParents();
		},
		
		hideParents: function(){
			if(this.parentItem) this.parentItem.list.hide(true);
		},
		
		hideChildren: function(){
			var open=this.openChildList;
			if(!open) return;
			open.hide();
			this.openChildList=null;
		},
		
		show: function(event){
			if(this.menu.showed.contains(this) && !this.hiding) return;
			this.menu.showed.push(this);
			this.menu.visible.push(this);
			this.inject(document.body).draw();
			this.setWidth();
			this.hiding=false;
			this.visible=true;
			this.position(event);
			this.morpher.start({opacity:1});
			this.showParents();
		},
		
		showParents: function(){
			if(!this.parentItem) return;
			this.parentItem.list.show();
		},
		
		initSelect: function(event){
			var target=event.target;
			if(!target||this.menu.closing>0) return this;
			if(target && Browser.Engine.trident){
				if(target.scopeName=='v') return this;
			}
			target=$(target);
			var item=target.getAncestorOrSelf('.mif-menu-item');
			if(!item){
				if(this.openChildList) return this;
				return this.unselect();
			}
			this.select(item.retrieve('item'));
		},
		
		select: function(item){
			if(!item || item==this.selected || item.disabled || this.menu.closing) return;
			this.unselect();
			item.select();
			this.show();
			this.selectParents(item);
			this.selected=item;
			return this;
		},
		
		selectParents: function(item){
			var parent=item.list.parentItem;
			if(!parent) return;
			parent.list.select(parent);
		},
		
		unselect: function(){
			if(!this.selected) return;
			this.selected.unselect();
			this.unselectChildren();
			this.selected=null;
		},
		
		unselectChildren: function(){
			var child=this.selected.childList;
			if(!child) return;
			child.unselect();
			child.hide();
		},
		
		position: function(event, coords){
			if(coords){
				this.setPosition(coords);
				return;
			}
			if(!this.parentItem){
				if(!event) return;
				var size = window.getSize(), scroll = window.getScroll();
				var menu = {x: this.container.offsetWidth, y: this.container.offsetHeight};
				var props = {x: 'left', y: 'top'};
				var coords={};
				for (var z in props){
					var pos = event.page[z] + this.options.offsets[z];
					if ((pos + menu[z] - scroll[z]) > size[z]) pos = event.page[z] - this.options.offsets[z] - menu[z];
					coords[z]=pos;
				}
				this.setPosition(coords);
			}else{
				var parent=this.parentItem.container;
				var position=parent.getPosition();
				
				var size = window.getSize(), scroll = window.getScroll();
				var menu = {x: this.wrapper.offsetWidth, y: this.container.offsetHeight};
				var item = {x: parent.offsetWidth, y: 0};
				var props = {x: 'left', y: 'top'};
				var coords={};
				
				for (var z in props){
					var pos=position[z]+item[z]+this.options.offsets[z];
					if ((pos + menu[z] - scroll[z]) > size[z]) pos = position[z]-menu[z]-this.options.offsets[z];
					coords[z]=pos;
				}
				this.setPosition(coords);
			}
		}

	});
	
	types.push(type);
	lists.push(List);

	return  List;
}