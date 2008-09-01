if(!window.Mif) var Mif={};
if(!Mif.Utils) Mif.Utils={};

Mif.Utils.zeroSpace=Browser.Engine.trident ? '&shy;' : (Browser.Engine.webkit ? '&#8203' : '');

Element.implement({

	getAncestorOrSelf: function(match){
		var parent=this;
		while(parent){
			if(parent.match(match)) return parent;
			parent=parent.getParent();
		}
		return false;
	}
	
});
