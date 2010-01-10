/*
Mif.Tree.Load
*/
Mif.Menu.Load={
		
	children: function(children, parent, tree){
		for( var i=children.length; i--; ){
			var child=children[i];
			var subChildren=child.children;
			var node=new Mif.Tree.Node({
				tree: tree,
				parentNode: parent||undefined
			}, child);
			if( tree.forest || parent != undefined){
				parent.children.unshift(node);
			}else{
				tree.root=node;
			}
			if(subChildren && subChildren.length){
				arguments.callee(subChildren, node, tree);
			}
		}
		if(parent) parent.state.loaded=true;
		tree.fireEvent('loadChildren', parent);
	}
	
};

Mif.Menu.implement({

	load: function(options){
		var menu=this;
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
