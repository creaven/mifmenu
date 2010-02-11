/*
Mif.Menu.Draw.js
*/

Mif.Menu.implement({
	
	draw: function(){
		var html = [];
		html.push(this.drawBackground());
		html.push('<div class="mif-menu-scroll mif-menu-scroll-top"></div>');
		html.push('<div class="mif-menu-wrapper">');
			for(var i = 0, l = this.items.length; i < l; i++){
				var item = this.items[i];
				var icon = item.icon;
				var iconCls = '';
				if(icon){
					if(icon.indexOf('/') == -1 && icon.substring(0, 1) == '.'){
						iconCls = icon.substring(1);
					}
				}
				html.push('<div class="mif-menu-item ' + (item.disabled ? 'disabled' : '') + '" uid="' + item.UID + '" id="mif-menu-item-' + item.UID + '">'+
					(icon ? 
						(iconCls ? '<span class="mif-menu-icon ' + iconCls + '"></span>' : 
							'<img class="mif-menu-icon" src="' + icon + '"></img>'
						) 
					: '') +
					'<span class="mif-menu-name">' + item.name + '</span>'+
					(item.submenu ? '<span class="mif-menu-submenu"></span>' : '')+
				'</div>');
			}
		html.push('</div>');
		html.push('<div class="mif-menu-scroll mif-menu-scroll-bottom"></div>');
		this.element.innerHTML = html.join('');
		this.$draw = true;
		this.initScroll();
		this.fireEvent('draw');
	},
	
	drawBackground: function(){
		return '<div class="mif-menu-bg">\
					<div class="top">\
						<div class="tl"></div>\
						<div class="t"></div>\
						<div class="tr"></div>\
					</div>\
					<div class="center">\
						<div class="l"></div>\
						<div class="c"></div>\
						<div class="r"></div>\
					</div>\
					<div class="bottom">\
						<div class="bl"></div>\
						<div class="b"></div>\
						<div class="br"></div>\
					</div>\
				</div>';
	},
	
	updateWidth: function(){
		this.element.setStyle('width', 'auto');
		var width = Math.max(this.element.offsetWidth, parseInt(this.options.minWidth));
		this.element.setStyle('width', width).dispose().inject(document.body);
	},
	
	updateHeight: function(){
		if(Browser.Engine.trident4){
			this.element.setStyle('height', 0);
			this.element.setStyle('height', this.element.getElement('.mif-menu-wrapper').offsetHeight).dispose().inject(document.body);
		}
	}
	
});

Mif.Menu.Item.implement({

	getElement: function(type){
		var item = document.id('mif-menu-item-'+this.UID);
		if(!type) return item;
		return item.getElement('mif-menu-' + type);
	}
	
});