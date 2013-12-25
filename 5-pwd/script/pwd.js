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
	}
}

var PWD = {
	width		: 0,
	height		: 0,
	menu		: null,
	menuicons	: {},
	desktop		: null,
	windows 	: [],
	winpostop	: 0,
	winposleft	: 0,
	apps		: ['gallery', 'rss', 'memory'],
	
	Init : function(){
		this.CreateDesktop();
		this.CreateMenu();
		this.UpdateSize();
		this.Bind();
	},
	
	Bind : function(){
		var self = this;
		GEN.Bind(window, 'resize', function(){
			self.UpdateSize();
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
		this.RemoveFromIconList(id);
		this.desktop.removeChild(this.windows[id].win);
		this.windows[id] = null;
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
				PWD.ToggleActiveWindow(PWD.windows[id].win);
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
			GEN.RemoveClass(this.windows[i].win, 'active');
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
	}
};

window.onload = function(){
	PWD.Init();
}