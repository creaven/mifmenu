/*
Mif.Menu.Menu
*/

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
	},
	
	setContent: function(content){
		return (typeof content == 'string') ? this.set('html', content) : this.adopt(content);
	}
	
});

Array.implement({
	
	inject: function(added, current, where){//inject added after or before current;
		var pos=this.indexOf(current)+(where=='before' ? 0 : 1);
		for(var i=this.length-1;i>=pos;i--){
			this[i+1]=this[i];
		}
		this[pos]=added;
		return this;
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
