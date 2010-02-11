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

if(Browser.Engine.trident4){
	window.addEvent('domready', function(){
		document.id(document.body).addClass('ie6');
	});
}
