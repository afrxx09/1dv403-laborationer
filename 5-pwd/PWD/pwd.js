"use strict";

var PWD = {
	opt : {},
	width : 0,
	height : 0,
	desktop : null,
	menu : null,
	windows : [],
	winpostop : 0,
	winposleft : 0,
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
	
	Init : function(o){
		this.opt = o;
		this.CreateDesktop();
		this.CreateMenu();
		this.UpdateSize();
		this.Bind();
		this.G.disableSelection(document.body);
	},
	
	Bind : function(){
		var self = this;
		this.G.Bind(window, 'resize', function(){
			self.UpdateSize();
		});
		this.G.Bind(document.body, 'mouseup', function(e){
			PWD.StopResize();
			PWD.StopMove();
		});
		this.G.Bind(document.body, 'mousemove', function(e){
			if(self.resize.active){
				var t, w, h, dx, dy;
				t = self.resize.elem; 
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
				t = self.move.elem;
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
		this.G.AddClass(this.desktop, 'desktop');
		document.body.appendChild(this.desktop);
	},
	
	CreateMenu : function(){
		this.menu = new this.Menu(this.opt.apps);
		document.body.appendChild(this.menu.elem);
	},	
	
	SetDesktopSize : function(){
		this.desktop.style.width = this.width + 'px';	
		this.desktop.style.height = (this.height - this.menu.height) + 'px';
	},
	
	StartApp : function(app){
		var id, app;
		id = this.windows.length;
		app = new this[app](id);
		this.windows.push(app);
		this.PositionWindow(app);
		this.menu.AddToIconList(app);
	},
	
	UpdateWindowPositions : function(){
		var i, win;
		for(i = 0; i < this.windows.length; i++){
			win = this.windows[i];
			if(win !== null){
				if(win.top + win.height > (this.height-42)){
					win.top = (this.height - 42) - win.height;
					if(win.top < 0){
						win.top = 0;
						win.height = this.height - 42;
					}
					win.updateSize();
					win.updatePos();
				}
			}
		}
		for(i = 0; i < this.windows.length; i++){
			win = this.windows[i];
			if(win !== null){
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
		}
	},
	
	PositionWindow : function(w){
		this.winpostop = ((w.height + this.winpostop + 50) > (this.height - 40)) ? 50 : this.winpostop + 50;
		if((w.height + this.winpostop)  > (this.height - 42)){
			w.setSize(w.width, (this.height - 42 - 50));
		}
		this.winposleft = ((w.width + this.winposleft + 50) > this.width) ? 50 : this.winposleft + 50;
		w.setPos(this.winpostop, this.winposleft);
	},
	
	CloseWindow : function(w){
		var id;
		id = this.windows.indexOf(w);
		this.desktop.removeChild(w.elem);
		this.menu.RemoveFromIconList(w);
		this.windows.splice(id, 1);
	},
	
	ToggleActiveWindow : function(w){
		var i, max;
		max = this.windows.length;
		for(i = 0; i < max; i++){
			if(this.windows[i].zindex > w.zindex){
				this.windows[i].zindex = this.windows[i].zindex - 1;
				this.windows[i].elem.style.zIndex = this.windows[i].zindex;
			}
		}
		if(this.G.HasClass(w.elem, 'hidden')){
			this.G.RemoveClass(w.elem, 'hidden');
			this.G.AddClass(w.elem, 'visible');
		}
		w.hidden = false;
		w.zindex = max;
		w.elem.style.zIndex = max;
	},
	
	MinifyAllWindows : function(){
		var i;
		for(i = 0; i < this.windows.length; i++){
			this.MinifyWindow(this.windows[i]);
		}
	},
	
	MinifyWindow : function(w){
		w.hidden = true;
		this.G.AddClass(w.elem, 'hidden');
		this.G.RemoveClass(w.elem, 'visible');
	},
	
	HighlightWindow : function(w){
		if(w.hidden == true){
			this.G.RemoveClass(w.elem, 'hidden');
			this.G.AddClass(w.elem, 'visible');
		}
		w.elem.style.zIndex = this.windows.length + 1;
	},
	
	UnHighlightWindow : function(w){
		if(w.hidden == true){
			this.G.RemoveClass(w.elem, 'visible');
			this.G.AddClass(w.elem, 'hidden');
		}
		w.elem.style.zIndex = w.zindex;
	},
	
	StartResize : function(w, x, y){
		this.resize.active = true;
		this.resize.startx = x;
		this.resize.starty = y;
		this.resize.startw = w.width,
		this.resize.starth = w.height,
		this.resize.elem = w;
		this.ToggleActiveWindow(w);
	},
	
	StopResize : function(){
		this.resize.active = false;
		this.resize.startx = 0;
		this.resize.starty = 0;
		this.resize.startw = 0,
		this.resize.starth = 0,
		this.resize.elem = null;
	},
	
	StartMove : function(w, x, y){
		this.move.active = true;
		this.move.elem = w;
		this.move.startx = x;
		this.move.starty = y;
		this.move.startt = w.top;
		this.move.startl = w.left;
		this.ToggleActiveWindow(w);
	},
	
	StopMove : function(){
		this.move.active = false;
		this.move.elem = null;
		this.move.startx = 0;
		this.move.starty = 0;
		this.move.startt = 0;
		this.move.startl = 0;
	}
};

window.onload = function(){
	var o = {
		apps : ['Gallery']
	};
	PWD.Init(o);
};