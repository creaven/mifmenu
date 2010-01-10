/*
Mif.Menu.Draw.js
*/

Mif.Menu.implement({
	
	draw: function(){
		this.el
		var html = [];
		for(var i = 0, l = this.items.length; i < l; i++){
			var item = this.items[i];
			var icon = item.icon;
			var iconCls = null;
			if(icon){
				if(icon.indexOf('/') == -1 && icon[0] == '.'){
					iconCls = icon.substring(1)
				}
			}
			html.push('<div class="mif-menu-item ' + item.disabled ? 'disabled' : '' + '">'+
				iconCls ? '<div class="mif-menu-icon ' + iconCls + '"></div>' : '<img class="mif-menu-icon" src="' + icon + '"></img>'+
				'<div class="menu-menu-name">' + icon.name + '</div>'+
			'</div>');
		}
		this.element.innerHTML = html.join('');
	}
	
});

Mif.Menu.Item.implement({

	getElement: function(type){
		var item=document.id('mif-tree-item-'+this.UID);
		if(!type) return item;
		return item.getElement('mif-menu-' + type);
	}
	
});