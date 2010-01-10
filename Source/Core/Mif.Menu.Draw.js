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
			if(icon){
				if(icon.indexOf('/') == -1 && icon[0] == '.'){
					var iconCls = icon.substring(1)
				}
			}
			html.push('<div class="mif-menu-item">'+
				iconCls ? '<div class="mif-menu-icon ' + iconCls'"></div>' : '<img class="mif-menu-icon" src="' + icon + '"></img>'+
				'<div class="menu-menu-name">' + icon.name + '</div>'+
			'</div>');
		}
		this.element.innerHTML = html.join('');
	}
	
});