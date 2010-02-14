/*
---
 
name: Mif.Menu.Draw
description: menu html scructure
license: MIT-Style License (http://mifjs.net/license.txt)
copyright: Anton Samoylov (http://mifjs.net)
authors: Anton Samoylov (http://mifjs.net)
requires: 
  - Mif.Menu
provides: Mif.Menu.Draw
 
...
*/

Mif.Menu.implement({
	
	draw: function(){
		var html = [];
		html.push(this.drawBackground());
		html.push('<div class="mif-menu-scroll mif-menu-scroll-top"></div>');
		html.push('<div class="mif-menu-wrapper">');
			for(var i = 0, l = this.items.length; i < l; i++){
				var item = this.items[i];
				this.getHTML(item, html);
			}
		html.push('</div>');
		html.push('<div class="mif-menu-scroll mif-menu-scroll-bottom"></div>');
		this.element.innerHTML = html.join('');
		this.$draw = true;
		this.wrapper = this.element.getElement('.mif-menu-wrapper');
		this.initScroll();
		this.fireEvent('draw');
	},
	
	drawItem: function(item){
		var el = new Element('div').set('html', this.getHTML(item).join('')).getFirst();
		item.element = el;
		return el;
	},
	
	getHTML: function(item, html){
		html = html || [];
		var icon = item.get('icon');
		var iconCls = '';
		if(icon){
			if(icon.indexOf('/') == -1 && icon.substring(0, 1) == '.'){
				iconCls = icon.substring(1);
			}
		};
		if(item.get('sep')){
			html.push('<div class="mif-menu-sep" uid="' + item.UID + '"></div>');
			return html;
		};
		if(item.get('desc')){
			html.push('<div class="mif-menu-desc" uid="' + item.UID + '">' + item.get('desc') + '</div>');
			return html;
		};
		html.push('<div class="mif-menu-item ' + item.get('cls') + (item.get('disabled') ? ' disabled' : '') + '" uid="' + item.UID + '" id="mif-menu-item-' + item.UID + '"' + (item.get('hidden') ? ' style="display:none"' : '') + '>'+
			(item.get('checked') != undefined ? 
			'<span class="mif-menu-check' + (item.get('group') ? ' mif-menu-check-group' : '') + (item.get('checked') ? ' mif-menu-checked"' : '"') + '></span>' : 
			'') +
			(icon ? 
				(iconCls ? '<span class="mif-menu-icon ' + iconCls + '"></span>' : 
					'<img class="mif-menu-icon" src="' + icon + '"></img>'
				) 
			: '') +
			'<span class="mif-menu-name">' + item.get('name') + '</span>'+
			( (item.submenu && item.submenu.items.length) || (!item.get('loaded') && item.get('hasSubmenu')) ? '<span class="mif-menu-submenu"></span>' : '')+
		'</div>');
		return html;
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
	
	isUpdatable: function(item){
		return !!item.getElement();
	},
	
	updateInject: function(item, element){
		if(!this.$draw) return;
		element = element || item.getElement() || this.drawItem(item);
		var index = this.items.indexOf(item);
		var previous = index > 0 ? this.items[index - 1].getElement() : null;
		if(previous){
			element.inject(previous, 'after');
		}else{
			element.inject(this.wrapper, 'top');
		}
		return this;
	},
	
	updateWidth: function(){
		this.element.setStyle('width', 'auto').dispose().inject(document.body);
		var width = Math.max(this.element.offsetWidth, parseInt(this.options.minWidth));
		this.element.setStyle('width', width);
		return this;
	}
	
});

Mif.Menu.Item.implement({

	getElement: function(type){
		var item = this.element || document.id('mif-menu-item-'+this.UID);
		if(!type || !item) return item;
		return item.getElement('.mif-menu-' + type);
	}
	
});