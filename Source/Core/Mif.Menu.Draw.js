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
					if(icon.indexOf('/') == -1 && icon[0] == '.'){
						iconCls = icon.substring(1);
						icon = Mif.TransparentImage;
					}
				}
				html.push('<div class="mif-menu-item ' + (item.disabled ? 'disabled' : '') + '" uid="' + item.UID + '" id="mif-menu-item-' + item.UID + '">'+
					(icon ? '<img class="mif-menu-icon ' + iconCls + '" src="' + icon + '"></img>' : '') +
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
		if(!Browser.Engine.trident4){
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
		}else{
			if(!document.namespaces.v){
				document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
				document.createStyleSheet().cssText = "v\\:*{behavior:url(#default#VML);display:inline-block}";
			}
			var vml = '<v:rect style="width:4000px; height:4000px; position:absolute; visibility:hidden; left:-1px; top:-1px;" coordsize="21600,21600" fillcolor="none" stroked="f"><v:fill src="" type="tile"  position="0.00025, 0.00025" style="left:-1px; top:-1px"></v:fill></v:rect>';
			var html = '<div class="top">'+
				'<div class="tl">' + vml + '</div>'+
				'<div class="t">' + vml + '</div>'+
				'<div class="tr">' + vml + '</div>'+
			'</div>'+
			'<div class="center">'+
				'<div class="l">' + vml + '</div>'+
				'<div class="c">' + vml + '</div>'+
				'<div class="r">' + vml + '</div>'+
			'</div>'+
			'<div class="bottom">'+
				'<div class="bl">' + vml + '</div>'+
				'<div class="b">' + vml + '</div>'+
				'<div class="br">' + vml + '</div>'+
			'</div>';
			for(var i = 0; i < 1; i++){
				var div = new Element('div', {'class': 'mif-menu-bg'}).inject(document.body);
				div.set('html', html);
				div.getElements('div div').each(function(div){
					var src=div.getStyle('backgroundImage').replace(/url\(['"]?(.*?)['"]?\)/, function(full, match){
						return match;
					});
					div.style.background='none';
					var rect=div.getElementsByTagName('rect')[0];
					var fill=div.getElementsByTagName('fill')[0];
					rect.fillcolor="none";
					rect.style.visibility="visible";
					fill.src=src;
				});
				html = div.outerHTML;
				div.dispose();
			}
			return html;
		}
	},
	
	updateWidth: function(){
		this.element.setStyle('width', Browser.Engine.trident4 ? 0 : 'auto');
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