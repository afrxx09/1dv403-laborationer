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
	
	CreateIcons : function(){
		var i;
		for(i = 0; i < this.apps.length; i++){
			this.CreateIcon(this.apps[i]);
		}
	},
	
	CreateIcon : function(type){
		var icon = document.createElement('div');
		GEN.AddClass(icon, 'menuicon');
		GEN.AddClass(icon, type);
		this.menu.appendChild(icon);
		switch(type){
			case 'gallery':
				this.CreateGalleryIcon(icon);
				break;
			case 'rss':
				this.CreateRSSIcon(icon);
				break;
			case 'memory':
				this.CreateMemoryIcon(icon);
				break;
		}
	},
	
	CreateGalleryIcon : function(icon){
		var self = this;
		GEN.Bind(icon, 'click', function(){
			self.windows.push(new Gallery(self.desktop, self.windows.length));
			self.PositionWindow(self.windows[self.windows.length-1]);
		});
	},
	
	CreateRSSIcon : function(icon){
		var self = this;
		GEN.Bind(icon, 'click', function(){
			self.windows.push(new RSS(self.desktop, self.windows.length));
			self.PositionWindow(self.windows[self.windows.length-1]);
		});
	},
	
	CreateMemoryIcon : function(icon){
		var self = this;
		GEN.Bind(icon, 'click', function(){
			self.windows.push(new Memory(self.desktop, self.windows.length));
			self.PositionWindow(self.windows[self.windows.length-1]);
		});
	},
	
	PositionWindow : function(w){
		this.winpostop = ((w.height + this.winpostop + 25) > (this.height - 40)) ? 25 : this.winpostop + 25;
		if((w.height + this.winpostop)  > (this.height - 40)){
			w.setSize(w.width, (this.height - 40 - 50));
		}
		this.winposleft = ((w.width + this.winposleft + 25) > this.width) ? 25 : this.winposleft + 25;
		w.setPos(this.winpostop, this.winposleft);
	},
	
	CloseWindow : function(id){
		this.desktop.removeChild(this.windows[id].win);
		this.windows[id] = null;
	}
};

window.onload = function(){
	PWD.Init();
}