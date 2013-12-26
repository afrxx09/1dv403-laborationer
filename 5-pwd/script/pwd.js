"user strict";

var GEN = {
	Bind : function(elem, t, f){
		if(elem.addEventListener){
			elem.addEventListener(t,f,false);
		}
		else if(elem.attachEvent){
			elem.attachEvent('on'+t,f);
		}
	},
	
	Unbind : function(elem, t, f){
		if(elem.removeEventListener){
			elem.removeEventListener(t,f,false);
		}
		else if(elem.detachEvent){
			elem.detachEvent('on'+t,f);
		}
	},

	StopProp : function(e){
		if(e.stopPropagation){
			e.stopPropagation();
		}
		else{
			e.cancelBubble = true;
		}
	},

	PrevDef : function(e){
		if(e.preventDefault){
			e.preventDefault();
		}
		else{
			e.returnValue = false;
		}
	},

	//Saxad och moddad från jQuery
	HasClass : function(elem, name){
		var className = " " + name + " ";
	    if ((" " + elem.className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(className) > -1) {
	        return true;
	    }
	    return false;
	},
	//Saxad och moddad från jQuery
	AddClass : function(elem, name){
		var classes;
		classes = elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n\f]/g, ' ') : ' ' ;
		if(classes.indexOf(name) < 0){
			classes += name + ' ';
		}
		elem.className = classes.trim();
	},
	//Saxad och moddad från jQuery
	RemoveClass : function(elem, name){
		var classes;
		classes = elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n\f]/g, ' ') : ' ' ;
		if(classes.indexOf(name) > -1){
			classes = classes.replace(' ' + name + ' ', ' ');
		}
		elem.className = classes.trim();
	},
	
	disableSelection:function(element){
		element.onselectstart = function() {return false;};
		element.unselectable = "on";
		element.style.MozUserSelect = "none";
		element.style.cursor = "default";
	},
	
	Ajax : function(o){
		var xhr, opt, r, json;
		if(!o.url){
			r = false
		}
		else{
			opt = {
				m : (!o.m) ? 'get' : o.m,
				url : o.url,
				async : (!o.async) ? true : o.async,
				cb : (!o.cb) ? null : o.cb,
				t : (!o.t) ? this : o.t
			};
			
			xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
						json = JSON.parse(xhr.responseText);
						if(!o.cb !== true){
							if(!o.t !== true){
								o.cb.call(o.t, json);
							}
							else{
								o.cb(json);
							}
						}
					}
					else{
						if(!o.cb !== true){
							o.cb(false);
						}
					}
				}
			};
			xhr.open(opt.m, opt.url, opt.async);
			xhr.send(null);
		}
	}
}

var PWD = {
	width : 0,
	height : 0,
	menu : null,
	menuicons : {},
	desktop : null,
	windows : [],
	winpostop : 0,
	winposleft : 0,
	apps : ['gallery', 'rss', 'memory'],
	resize : {
		active : false,
		win : null,
		startx : 0,
		starty : 0,
		startw : 0,
		starth : 0
	},
	move 		:{
		active : false,
		win : null,
		startx : 0,
		starty : 0,
		startt : 0,
		startl : 0
	},
	
	Init : function(){
		this.CreateDesktop();
		this.CreateMenu();
		this.UpdateSize();
		this.Bind();
		GEN.disableSelection(document.body);
	},
	
	Bind : function(){
		var self = this;
		GEN.Bind(window, 'resize', function(){
			self.UpdateSize();
		});
		GEN.Bind(document.body, 'mouseup', function(e){
			PWD.StopResize();
			PWD.StopMove();
		});
		GEN.Bind(document.body, 'mousemove', function(e){
			if(self.resize.active){
				var t, w, h, dx, dy;
				t = self.resize.win; 
				dx = e.clientX - self.resize.startx;
				dy = e.clientY - self.resize.starty;
				w = (self.resize.startw + dx < 200) ? 200 : self.resize.startw + dx;
				h = (self.resize.starth + dy < 200) ? 200 : self.resize.starth + dy;
				if(t.top + h > self.height-40){
					h = (self.height-40) - t.top;
				}
				t.setSize(w, h);
			}
			if(self.move.active){
				var t, x, y, dx, dy;
				t = self.move.win;
				dx = e.clientX - self.move.startx; 
				dy = e.clientY - self.move.starty;
				x = self.move.startl + dx;
				y = self.move.startt + dy;
				if(x < 0){
					x = 0;
				}
				if(x + t.width > self.width){
					x = self.width - t.width;
				}
				if(y < 0){
					y = 0;
				}
				if(y + t.height > self.height-40){
					y = (self.height-40) - t.height;
				}
				t.setPos(y, x);
			}
		});
	},
	
	UpdateSize : function(){
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.SetMenuSize();
		this.SetDesktopSize();
		if(this.width < 200 || this.height < 200){
			this.MinifyAllWindows();
		}
		else{
			this.UpdateWindowPositions();
		}
		
	},
	
	CreateDesktop : function(){
		this.desktop = document.createElement('div');
		GEN.AddClass(this.desktop, 'desktop');
		document.body.appendChild(this.desktop);
	},
	
	CreateMenu : function(){
		this.menu = document.createElement('div');
		GEN.AddClass(this.menu, 'menu');
		document.body.appendChild(this.menu);
		this.CreateIcons();
	},
	
	SetMenuSize : function(){
		this.menu.style.width = this.width  + 'px';
		this.menu.style.height = '40px';
	},
	
	SetDesktopSize : function(){
		this.desktop.style.width = this.width + 'px';	
		this.desktop.style.height = (this.height - this.menu.style.height.replace(/[^\d]/g, ''))  + 'px';
	},
	
	UpdateWindowPositions : function(){
		var i, win;
		for(i = 0; i < this.windows.length; i++){
			win = this.windows[i];
			if(win.top + win.height > (this.height-40)){
				win.top = (this.height - 40) - win.height;
				if(win.top < 0){
					win.top = 0;
					win.height = this.height - 40;
				}
				win.updateSize();
				win.updatePos();
			}
		}
		for(i = 0; i < this.windows.length; i++){
			win = this.windows[i];
			if(win.left + win.width > this.width){
				win.left = this.width - win.width;
				if(win.left < 0){
					win.left = 0;
					win.width = this.width;
				}
				win.updateSize();
				win.updatePos();
			}
		}
	},
	
	CreateIcons : function(){
		var i;
		for(i = 0; i < this.apps.length; i++){
			this.CreateIcon(this.apps[i]);
		}
	},
	
	CreateIcon : function(type){
		var iconwrap, icon;
		iconwrap = document.createElement('div');
		GEN.AddClass(iconwrap, 'iconwrap');
		this.menuicons[type] = {
			elem : document.createElement('img'),
			list : document.createElement('ul'),
			windows : []
		};
		list = this.menuicons[type].list;
		GEN.AddClass(list, 'iconlist');
		GEN.AddClass(list, 'hidden');
		icon = this.menuicons[type].elem;
		icon.setAttribute('src', 'images/' + type + '32.png');
		GEN.AddClass(icon, 'menuicon');
		iconwrap.appendChild(icon);
		iconwrap.appendChild(list);
		this.menu.appendChild(iconwrap);
		switch(type){
			case 'gallery':
				this.BindGalleryIcon(this.menuicons[type]);
				break;
			case 'rss':
				this.BindRSSIcon(this.menuicons[type]);
				break;
			case 'memory':
				this.BindMemoryIcon(this.menuicons[type]);
				break;
		}
	},
	
	BindGalleryIcon : function(icon){
		var self = this;
		GEN.Bind(icon.elem, 'click', function(){
			self.windows.push(new Gallery(self.desktop, self.windows.length));
			self.PositionWindow(self.windows[self.windows.length-1]);
			self.menuicons.gallery.windows.push(self.windows.length-1);
			self.CreateIconList(self.menuicons.gallery);
		});
		GEN.Bind(icon.elem.parentNode, 'mouseover', function(){
			self.ShowIconList(self.menuicons.gallery);
		});
		GEN.Bind(icon.elem.parentNode, 'mouseleave', function(){
			self.HideIconList(self.menuicons.gallery);
		});
	},
	
	BindRSSIcon : function(icon){
		var self = this;
		GEN.Bind(icon.elem, 'click', function(){
			self.windows.push(new RSS(self.desktop, self.windows.length));
			self.PositionWindow(self.windows[self.windows.length-1]);
			self.menuicons.rss.windows.push(self.windows.length-1);
			self.CreateIconList(self.menuicons.rss);
		});
		GEN.Bind(icon.elem.parentNode, 'mouseover', function(){
			self.ShowIconList(self.menuicons.rss);
		});
		GEN.Bind(icon.elem.parentNode, 'mouseleave', function(){
			self.HideIconList(self.menuicons.rss);
		});
	},
	
	BindMemoryIcon : function(icon){
		var self = this;
		GEN.Bind(icon.elem, 'click', function(){
			self.windows.push(new Memory(self.desktop, self.windows.length));
			self.PositionWindow(self.windows[self.windows.length-1]);
			self.menuicons.memory.windows.push(self.windows.length-1);
			self.CreateIconList(self.menuicons.memory);
		});
		GEN.Bind(icon.elem.parentNode, 'mouseover', function(e){
			self.ShowIconList(self.menuicons.memory);
			
		});
		GEN.Bind(icon.elem.parentNode, 'mouseleave', function(){
			self.HideIconList(self.menuicons.memory);
		});
	},
	
	PositionWindow : function(w){
		this.winpostop = ((w.height + this.winpostop + 50) > (this.height - 40)) ? 50 : this.winpostop + 50;
		if((w.height + this.winpostop)  > (this.height - 40)){
			w.setSize(w.width, (this.height - 40 - 50));
		}
		this.winposleft = ((w.width + this.winposleft + 50) > this.width) ? 50 : this.winposleft + 50;
		w.setPos(this.winpostop, this.winposleft);
	},
	
	CloseWindow : function(id){
		var wintype = this.windows[id].type;
		this.desktop.removeChild(this.windows[id].win);
		this.RemoveFromIconList(id);
		this.windows[id] = null;
		this.CreateIconList(this.menuicons[wintype]);
	},
	
	RemoveFromIconList : function(id){
		var win, windows;
		win = this.windows[id];
		windows = this.menuicons[win.type].windows;
		windows.splice(windows.indexOf(id), 1);
	},
	
	CreateIconList : function(icon){
		var self, i, li, text, win;
		self = this;
		icon.list.innerHTML = '';
		for(i = 0; i < icon.windows.length; i++){
			win = this.windows[icon.windows[i]];
			li = document.createElement('li');
			li.setAttribute('rel', win.id);
			text = document.createTextNode('#' + (i + 1) + win.type);
			li.appendChild(text);
			GEN.Bind(li, 'click', function(){
				var id = parseInt(this.getAttribute('rel'));
				self.ToggleActiveWindow(self.windows[id].win);
			});
			icon.list.appendChild(li);
		}
	},
	
	ShowIconList : function(icon){
		GEN.RemoveClass(icon.list, 'hidden');
		GEN.AddClass(icon.list, 'visible');
	},
	
	HideIconList : function(icon){
		GEN.RemoveClass(icon.list, 'visible');
		GEN.AddClass(icon.list, 'hidden');
	},
	
	ToggleActiveWindow : function(w){
		var i;
		for(i = 0; i < this.windows.length; i++){
			if(this.windows[i] !== null){
				GEN.RemoveClass(this.windows[i].win, 'active');
			}
		}
		if(GEN.HasClass(w, 'hidden')){
			GEN.RemoveClass(w, 'hidden');
		}
		GEN.AddClass(w, 'active');
	},
	
	MinifyAllWindows : function(){
		var i;
		for(i = 0; i < this.windows.length; i++){
			this.MinifyWindow(i);
		}
	},
	
	MinifyWindow : function(id){
		var w = this.windows[id].win;
		GEN.AddClass(w, 'hidden');
		GEN.RemoveClass(w, 'active');
	},
	
	StartResize : function(w, x, y){
		this.resize.active = true;
		this.resize.startx = x;
		this.resize.starty = y;
		this.resize.startw = w.width,
		this.resize.starth = w.height,
		this.resize.win = w;
		this.ToggleActiveWindow(w.win);
	},
	
	StopResize : function(){
		this.resize.active = false;
		this.resize.startx = 0;
		this.resize.starty = 0;
		this.resize.startw = 0,
		this.resize.starth = 0,
		this.resize.win = null;
	},
	
	StartMove : function(w, x, y){
		this.move.active = true;
		this.move.win = w;
		this.move.startx = x;
		this.move.starty = y;
		this.move.startt = w.top;
		this.move.startl = w.left;
		this.ToggleActiveWindow(w.win);
	},
	
	StopMove : function(){
		this.move.active = false;
		this.move.win = null;
		this.move.startx = 0;
		this.move.starty = 0;
		this.move.startt = 0;
		this.move.startl = 0;
	}
};

window.onload = function(){
	PWD.Init();
}