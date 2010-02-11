/*
Mif.Tree.Load
*/
Mif.Menu.Load={
		
	menu: function(items, parent, menu){
		if(!(menu instanceof Mif.Menu)){
			var options = {};
			if(items[0].options){
				options = items[0].options;
				items.erase(items[0]);
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
		var menu=this;
		var type = $type(options);
		if(type == 'array'){
			options = {json: options}; 
		};
		if(type =='string'){
			options = {url: options};
		};
		this.loadOptions=this.loadOptions||$lambda({});
		function success(json){
			Mif.Menu.Load.menu(json, null, menu);
			menu.fireEvent('load');
			return menu;
		}
		options=$extend($extend({
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
		this.$loading=true;
		options=options||{};
		this.addLoader();
		var self=this;
		function success(json){
			Mif.Tree.Load.menu(json, self, self.menu);
			delete self.$loading;
			self.state.loaded=true;
			self.removeLoader();
			menu.update(self);
			self.fireEvent('load');
			self.menu.fireEvent('loadNode', self);
			return self;
		}
		options=$extend($extend($extend({
			isSuccess: $lambda(true),
			secure: true,
			onSuccess: success,
			method: 'get'
		}, this.tree.loadOptions(this)), this.loadOptions), options);
		if(options.json) return success(options.json);
		new Request.JSON(options).send();
		return this;
	}
	
});
