var Mif = {};

Mif.ids={};
Mif.id=function(id){
	return Mif.ids[id];
}
Mif.uids={};
Mif.UID=0;

Element.implement({

	getAncestor: function(match, top){//includes self
		var parent=this;
		while(parent){
			if(parent.match(match)) return parent;
			parent=parent.getParent();
			if(parent==top) return false;
		}
		return false;
	}
	
});

Array.implement({
	
	inject: function(added, current, where){//inject added after or before current;
		var pos = this.indexOf(current) + (where == 'before' ? 0 : 1);
		for(var i = this.length-1; i >= pos; i--){
			this[i + 1] = this[i];
		};
		this[pos] = added;
		return this;
	}
	
});
