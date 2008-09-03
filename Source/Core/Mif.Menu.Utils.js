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

if(Browser.Engine.presto){

	Element.Events.extend({

		contextmenu: {
			base: 'click',
			condition: function(event){ return event.alt;}
		}
		
	});
	
}