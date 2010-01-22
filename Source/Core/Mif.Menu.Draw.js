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
			var iconCls = '';
			if(icon){
				if(icon.indexOf('/') == -1 && icon[0] == '.'){
					iconCls = icon.substring(1);
					icon = Mif.TransparentImage;
				}
			}else{
				icon = Mif.TransparentImage
			}
			html.push('<div class="mif-menu-item ' + (item.disabled ? 'disabled' : '') + '" uid="' + item.UID + '" id="mif-menu-item-' + item.UID + '">'+
				'<img class="mif-menu-icon ' + iconCls + '" src="' + icon + '"></img>'+
				'<span class="menu-menu-name">' + item.name + '</span>'+
			'</div>');
		}
		this.element.innerHTML = html.join('');
		this.$draw = true;
	}
	
});

Mif.Menu.Item.implement({

	getElement: function(type){
		var item=document.id('mif-menu-item-'+this.UID);
		if(!type) return item;
		return item.getElement('mif-menu-' + type);
	}
	
});