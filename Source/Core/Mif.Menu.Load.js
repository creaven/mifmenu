/*
---
 
name: Mif.Menu.Load
description: menu json loader
license: MIT-Style License (http://mifjs.net/license.txt)
copyright: Anton Samoylov (http://mifjs.net)
authors: Anton Samoylov (http://mifjs.net)
requires: 
  - Mif.Menu
provides: Mif.Menu.Load
 
...
*/

Mif.Menu.Load={
		
	menu: function(items, parent, menu){
		if(!(menu instanceof Mif.Menu)){
			var options = {};
			if(items.length && items[0].options){
				options = items[0].options;
				items.erase(items[0]);
			}
			for(var p in options){
				if(/^on([A-Z])/.test(p)){
					if(typeof options[p] == 'string') options[p] = eval('(' + options[p] + ')');
				}
			}
			menu = new Mif.Menu(options);
			parent.submenu = menu;
		}
		menu.parentItem = parent;
		for( var i = items.length; i--; ){
			var item = items[i];
			var submenu = item.submenu;
			var item = new Mif.Menu.Item({
				menu: menu
			}, item);
			menu.items.unshift(item);
			if(submenu && submenu.length){
				arguments.callee(submenu, item, submenu);
			}
		}
	}
	
};

Mif.Menu.implement({

	load: function(options){
		var menu = this;
		var type = $type(options);
		if(type == 'array'){
			options = {json: options}; 
		};
		if(type == 'string'){
			options = {url: options};
		};
		this.loadOptions = this.loadOptions || $lambda({});
		function success(json){
			Mif.Menu.Load.menu(json, null, menu);
			menu.fireEvent('load');
			return menu;
		}
		options = $extend($extend({
			isSuccess: $lambda(true),
			secure: true,
			onSuccess: success,
			method: 'get'
		}, this.loadOptions()), options);
		if(options.json) return success(options.json);
		new Request.JSON(options).send();
		return this;
	}
	
});

Mif.Menu.Item.implement({
	
	load: function(options){
		this.$loading = true;
		var type = $type(options);
		if(type == 'array'){
			options = {json: options}; 
		};
		if(type == 'string'){
			options = {url: options};
		};
		options = options || {};
		var self = this;
		var el = this.getElement();
		var loader, sub;
		if(el){
			loader = new Element('span', {'class': 'mif-menu-loader'}).inject(el);
			sub = el.getElement('.mif-menu-submenu').dispose();
		}
		function success(json){
			Mif.Menu.Load.menu(json, self, json);
			delete self.$loading;
			self.property.loaded = true;
			if(loader){
				loader.dispose();
				if(self.submenu.items.length) sub.inject(el);
			};
			self.fireEvent('load');
			self.menu.fireEvent('loadItem', self);
			return self;
		}
		options = $extend($extend($extend({
			isSuccess: $lambda(true),
			secure: true,
			onSuccess: success,
			method: 'get'
		}, this.menu.loadOptions(this)), this.property.loadOptions), options);
		if(options.json) return success(options.json);
		new Request.JSON(options).send();
		return this;
	}
	
});
