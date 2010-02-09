/*
Mif.Tree.Load
*/
Mif.Menu.Load={
		
	menu: function(items, parent, menu){
		for( var i = items.length; i--; ){
			var item = items[i];
			if(item.options){
				menu.setOptions(item.options);
				continue;
			}
			var submenu = item.submenu;
			var Submenu = submenu && submenu.length ? new Mif.Menu() : null;
			var item = new Mif.Menu.Item({
				menu: menu,
				parentItem: parent
			}, item);
			menu.items.unshift(item);
			if(Submenu){
				arguments.callee(submenu, item, Submenu);
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
			menu.draw();
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
