/*
---
 
name: Mif.Core
description: define Mif object, utility
license: MIT-Style License (http://mifjs.net/license.txt)
copyright: Anton Samoylov (http://mifjs.net)
authors: Anton Samoylov (http://mifjs.net)
requires: 
  - core:1.2.4:*
provides: Mif.Core
 
...
*/

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

if(Browser.Engine.presto){

	Element.Events.extend({

		contextmenu: {
			base: 'click',
			condition: function(event){ return event.shift;}
		}
		
	});
	
}
