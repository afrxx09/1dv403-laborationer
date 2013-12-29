"use strict";

PWD.Win = function(){
	var self;
	self = this;
	
	this.id = 0;
	
	this.elem = null;
	this.titlebar = null;
	this.minbutton = null;
	this.closebutton = null;
	this.windowcontent = null;
	this.statusbar = null;
	this.statusbartext = '';
	
	this.width = 0;
	this.height = 0;
	this.top = 0;
	this.left = 0;
	this.zIndex = 0;
	this.hidden = false;
	this.resizeable = false;
	
	this.setSize = function(w, h){
		this.width = w;
		this.height = h;
		this.updateSize();
	};
	
	this.setPos = function(t, l){
		this.top = t;
		this.left = l;
		this.updatePos();
	};
	
	this.updatePos = function(){
		this.elem.style.top = this.top + 'px';
		this.elem.style.left = this.left + 'px';
	};
	
	this.updateSize = function(){
		this.elem.style.width = this.width + 'px';
		this.elem.style.height = this.height + 'px';
		this.windowcontent.style.height = (this.height - 46) + 'px';
	};
};

PWD.Win.prototype.CreateWindow = function(){
	var self = this;
	this.elem = document.createElement('div');
	this.elem.style.zIndex = this.zIndex;
	PWD.G.AddClass(this.elem, 'window');
	PWD.desktop.appendChild(this.elem);
	this.CreateTitleBar();
	this.CreateStatusBar();
	this.CreateWindowContent();
	PWD.G.Bind(this.elem, 'click', function(){
		PWD.ToggleActiveWindow(self);
	});
};

PWD.Win.prototype.CreateTitleBar = function(){
	var self = this;
	this.titlebar = document.createElement('div');
	PWD.G.AddClass(this.titlebar, 'titlebar');
	this.CreateTitleBarCloseButton();
	this.CreateTitleBarMinifyIcon();
	this.elem.appendChild(this.titlebar);
	PWD.G.Bind(this.titlebar, 'mousedown', function(e){
		PWD.StartMove(self, e.clientX, e.clientY);
	});
};

PWD.Win.prototype.CreateTitleBarCloseButton = function(){
	var self, cross;
	self = this;
	cross = document.createElement('div');
	PWD.G.AddClass(cross, 'cross');
	this.closebutton = document.createElement('div');
	this.closebutton.appendChild(cross);
	PWD.G.AddClass(this.closebutton, 'closebutton');
	this.titlebar.appendChild(this.closebutton);
	PWD.G.Bind(this.closebutton, 'click', function(e){
		PWD.G.PrevDef(e);
		PWD.G.StopProp(e);
		PWD.CloseWindow(self);
	});
};

PWD.Win.prototype.CreateTitleBarMinifyIcon = function(){
	var self, min;
	self = this;
	min = document.createElement('div');
	PWD.G.AddClass(min, 'minify');
	this.minbutton = document.createElement('div');
	PWD.G.AddClass(this.minbutton, 'minbutton');
	this.minbutton.appendChild(min);
	this.titlebar.appendChild(this.minbutton);
	PWD.G.Bind(this.minbutton, 'click', function(e){
		PWD.G.PrevDef(e);
		PWD.G.StopProp(e);
		PWD.MinifyWindow(self);
	});
};

PWD.Win.prototype.CreateTitleBarIcon = function(path){
	var img = document.createElement('img');
	img.setAttribute('src', path);
	PWD.G.AddClass(img, 'titlebaricon');
	this.titlebar.appendChild(img);
};

PWD.Win.prototype.AddTitleBarText = function(t){
	var title, text;
	title = document.createElement('div');
	text = document.createTextNode(t);
	title.appendChild(text);
	PWD.G.AddClass(title, 'titlebartitle');
	this.titlebar.appendChild(title);
};

PWD.Win.prototype.CreateWindowContent = function(){
	this.windowcontent = document.createElement('div');
	PWD.G.AddClass(this.windowcontent, 'windowcontent');
	this.elem.appendChild(this.windowcontent);
};

PWD.Win.prototype.CreateStatusBar = function(){
	this.statusbar = document.createElement('div');
	PWD.G.AddClass(this.statusbar, 'statusbar');
	this.elem.appendChild(this.statusbar);
	this.CreateStatusBarLoadingImage();
	this.CreateStatusBarText();
	if(this.resizeable){
		this.CreateResizeIcon();
	}
};

PWD.Win.prototype.CreateStatusBarLoadingImage = function(){
	this.statusbarloadingimage = document.createElement('div');
	PWD.G.AddClass(this.statusbarloadingimage, 'loadingimage');
	PWD.G.AddClass(this.statusbarloadingimage, 'hidden');
	this.statusbar.appendChild(this.statusbarloadingimage);
};

PWD.Win.prototype.CreateStatusBarText = function(){
	this.statusbartext = document.createElement('div');
	PWD.G.AddClass(this.statusbartext, 'statusbartext');
	this.statusbar.appendChild(this.statusbartext);
};

PWD.Win.prototype.AddStatusBarText = function(t){
	this.statusbartext.innerHTML = t;
};

PWD.Win.prototype.CreateResizeIcon = function(){
	var self = this;
	this.resizeicon = document.createElement('div');
	PWD.G.AddClass(this.resizeicon, 'resizeicon');
	this.statusbar.appendChild(this.resizeicon);
	PWD.G.Bind(this.resizeicon, 'mousedown', function(e){
		PWD.StartResize(self, e.clientX, e.clientY);
	});
};

PWD.Win.prototype.HideLoading = function(){
	PWD.G.RemoveClass(this.statusbarloadingimage, 'visible');
	PWD.G.AddClass(this.statusbarloadingimage, 'hidden');
};

PWD.Win.prototype.ShowLoading = function(){
	PWD.G.RemoveClass(this.statusbarloadingimage, 'hidden');
	PWD.G.AddClass(this.statusbarloadingimage, 'visible');
};