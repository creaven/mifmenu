/*
---
 
name: Mif.Menu.Scroll
description: scroll menu
license: MIT-Style License (http://mifjs.net/license.txt)
copyright: Anton Samoylov (http://mifjs.net)
authors: Anton Samoylov (http://mifjs.net)
requires: 
  - Mif.Menu
provides: Mif.Menu.Scroll
 
...
*/

Mif.Menu.implement({
	
	initScroll: function(){
		var self = this;
		var top = this.element.getElement('.mif-menu-scroll-top');
		var bottom = this.element.getElement('.mif-menu-scroll-bottom');
		this.top = top;
		this.bottom = bottom;
		this.scroll = new Fx.Scroll(this.wrapper, {
			link: 'cancel',
			onComplete: function(){
				top.setStyle('display', this.element.scrollTop == self.items[0].getElement().offsetTop ? 'none' : 'block');
				bottom.setStyle('display', this.element.scrollTop == this.element.scrollHeight - this.element.clientHeight ? 'none' : 'block');
			}
		});
		$extend(this.bound, {
			startScrollBottom: this.startScrollBottom.bind(this),
			startScrollTop: this.startScrollTop.bind(this),
			stopScroll: this.stopScroll.bind(this)
		});
		bottom.addEvents({
			mouseenter: this.bound.startScrollBottom,
			mouseleave: this.bound.stopScroll
		});
		top.addEvents({
			mouseenter: this.bound.startScrollTop,
			mouseleave: this.bound.stopScroll
		});
		this.bound.mousewheel = this.mousewheel.bind(this);
		this.element.addEvent('mousewheel', this.bound.mousewheel);
	},
	
	mousewheel: function(event){
		var delta = event.wheel;
		this.doScroll(delta);
	},
	
	startScroll: function(side){
		if(this.scrollTimer) return;
		var startTime = 0;
		var startTop = this.element.getPosition().y;
		var self = this;
		var wrapper = this.wrapper;
		var startHeight = wrapper.offsetHeight;
		var startScrollTop = wrapper.scrollTop;
		var scrollingTime = 0;
		this.scrollTimer = (function(){
			if($time() - self.time < 1500) return;
			if(!startTime) startTime = $time();
			var delta = ($time() - startTime)/50*10;
			if(!delta) return;
			if(side == 'top') delta = -delta;
			if(!self.scrollMove(delta)){
				$clear(self.scrollTimer);
				self.srollTimer = null;
			}else{
				startTime = $time();
			}
		}).periodical(50);
	},
	
	startScrollBottom: function(){
		this.startScroll('bottom');
	},
	
	startScrollTop: function(){
		return this.startScroll('top');
	},
	
	stopScroll: function(){
		$clear(this.scrollTimer);
		this.scrollTimer = null;
	},
	
	doScroll: function(delta){
		this.scrollMove(-10*delta);
	},
	
	scrollMove: function(delta){
		var side = delta < 0 ? 'top' : 'bottom';
		var wrapper = this.wrapper;
		var offsetTop = this.element.offsetTop;
		if(side == 'bottom'){
			if(wrapper.scrollTop == wrapper.scrollHeight - wrapper.clientHeight) return;
			var limit = this.options.limits.top;
			var top = offsetTop - delta;
			if(top < limit){
				this.element.setStyle('top', limit);
				wrapper.setStyle('height', Math.min(wrapper.scrollHeight, wrapper.offsetHeight + offsetTop - limit));
				wrapper.scrollTop = wrapper.scrollTop + delta;
			}else{
				var height = wrapper.offsetHeight + delta;
				if(height > wrapper.scrollHeight){
					wrapper.setStyle('height', 'auto');
					this.element.setStyle('top', offsetTop - delta + (height - wrapper.scrollHeight));
				}else{
					wrapper.setStyle('height', height);
					this.element.setStyle('top', offsetTop - delta);
				}
			}
		}else{
			if(wrapper.scrollTop == 0) return;
			var bottom = window.getSize().y - (offsetTop + wrapper.offsetHeight - delta - window.getScroll().y) - (this.element.offsetHeight - this.wrapper.offsetHeight);
			var limit = this.options.limits.bottom;
			if(bottom < limit){
				wrapper.setStyle('height', Math.min(wrapper.scrollHeight, window.getSize().y - limit - (offsetTop - window.getScroll().y + (this.element.offsetHeight - this.wrapper.offsetHeight))));
				wrapper.scrollTop = wrapper.scrollTop + delta;
			}else{
				var height = wrapper.offsetHeight - delta;
				wrapper.scrollTop = wrapper.scrollTop + delta;
				if(height > wrapper.scrollHeight){
					wrapper.setStyle('height', 'auto');
				}else{
					wrapper.setStyle('height', height);
				}
			}
		};
		var result = true;
		if(wrapper.scrollTop == 0){
			this.top.setStyle('display', 'none');
			if(side == 'top') result = false;
		}else{
			this.top.setStyle('display', 'block');
		};
		if(wrapper.scrollTop == wrapper.scrollHeight - wrapper.offsetHeight){
			this.bottom.setStyle('display', 'none');
			if(side == 'bottom') result = false;
		}else{
			this.bottom.setStyle('display', 'block');
		}
		return result;
	},
	
	makeVisible: function(item){
		var el = item.getElement();
		var offsetTop = el.offsetTop;
		var offsetBottom = offsetTop + el.offsetHeight;
		var top = this.top.offsetHeight;
		var bottom = this.bottom.offsetHeight;
		var wrapper = this.wrapper;
		var wrapperTop = wrapper.scrollTop + top;
		var wrapperBottom = wrapperTop + wrapper.offsetHeight - bottom;
		if(offsetTop < wrapperTop){
			this.scrollMove(offsetTop - wrapperTop);
		}else if(offsetBottom > wrapperBottom){
			this.scrollMove(offsetBottom - wrapperBottom + top);
		}
	},
	
	setHeight: function(height){
		var wrapper = this.wrapper;
		if(height >= wrapper.scrollHeight) {
			wrapper.setStyle('height', 'auto');
		}else{
			wrapper.setStyle('height', height);
		};
		this.top.setStyle('display', wrapper.scrollTop == 0 ? 'none' : 'block');
		this.bottom.setStyle('display', wrapper.scrollTop == wrapper.scrollHeight - wrapper.clientHeight ? 'none' : 'block');
		return this;
	}
	
});
