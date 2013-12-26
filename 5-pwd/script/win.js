function Win(){
	var self;
	self = this;
	this.id = 0;
	this.desktop = null;
	this.win = null;
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
		this.win.style.top = this.top + 'px';
		this.win.style.left = this.left + 'px';
	};
	
	this.updateSize = function(){
		this.win.style.width = this.width + 'px';
		this.win.style.height = this.height + 'px';
		this.windowcontent.style.height = (this.height - 46) + 'px';
	};
};

Win.prototype.CreateWindow = function(d){
	var self =this;
	this.desktop = d;
	this.win = document.createElement('div');
	GEN.AddClass(this.win, 'window');
	this.desktop.appendChild(this.win);
	this.CreateTitleBar();
	this.CreateStatusBar();
	this.CreateWindowContent();
	PWD.ToggleActiveWindow(self.win);
	GEN.Bind(this.win, 'click', function(){
		PWD.ToggleActiveWindow(self.win);
	});
};

Win.prototype.CreateTitleBar = function(){
	this.titlebar = document.createElement('div');
	GEN.AddClass(this.titlebar, 'titlebar');
	this.CreateTitleBarCloseButton();
	this.CreateTitleBarMinifyIcon();
	this.win.appendChild(this.titlebar);
	this.BindTitleBar();
};

Win.prototype.BindTitleBar = function(){
	var self = this;
	GEN.Bind(this.titlebar, 'mousedown', function(e){
		PWD.StartMove(self, e.clientX, e.clientY);
	});
}

Win.prototype.CreateTitleBarCloseButton = function(){
	var cross = document.createElement('div');
	GEN.AddClass(cross, 'cross');
	this.closebutton = document.createElement('div');
	this.closebutton.appendChild(cross);
	GEN.AddClass(this.closebutton, 'closebutton');
	this.titlebar.appendChild(this.closebutton);
	this.BindCloseButton();
};

Win.prototype.BindCloseButton = function(){
	var self = this;
	GEN.Bind(this.closebutton, 'click', function(e){
		GEN.PrevDef(e);
		GEN.StopProp(e);
		PWD.CloseWindow(self.id);
	});
};

Win.prototype.CreateTitleBarMinifyIcon = function(){
	var min = document.createElement('div');
	GEN.AddClass(min, 'minify');
	this.minbutton = document.createElement('div');
	GEN.AddClass(this.minbutton, 'minbutton');
	this.minbutton.appendChild(min);
	this.titlebar.appendChild(this.minbutton);
	this.BindMinifyButton();
};

Win.prototype.BindMinifyButton = function(){
	var self = this;
	GEN.Bind(this.minbutton, 'click', function(e){
		GEN.PrevDef(e);
		GEN.StopProp(e);
		PWD.MinifyWindow(self.id);
	});
}

Win.prototype.CreateTitleBarIcon = function(path){
	var img = document.createElement('img');
	img.setAttribute('src', path);
	GEN.AddClass(img, 'titlebaricon');
	this.titlebar.appendChild(img);
};

Win.prototype.AddTitleBarText = function(t){
	var title, text;
	title = document.createElement('div');
	text = document.createTextNode(t);
	title.appendChild(text);
	GEN.AddClass(title, 'titlebartitle');
	this.titlebar.appendChild(title);
};

Win.prototype.CreateWindowContent = function(){
	this.windowcontent = document.createElement('div');
	GEN.AddClass(this.windowcontent, 'windowcontent');
	this.win.appendChild(this.windowcontent);
};

Win.prototype.CreateStatusBar = function(){
	this.statusbar = document.createElement('div');
	GEN.AddClass(this.statusbar, 'statusbar');
	this.win.appendChild(this.statusbar);
	this.CreateStatusBarLoadingImage();
	this.CreateStatusBarText();
	if(this.resizeable){
		this.CreateResizeIcon();
	}
};

Win.prototype.CreateStatusBarLoadingImage = function(){
	this.statusbarloadingimage = document.createElement('div');
	GEN.AddClass(this.statusbarloadingimage, 'loadingimage');
	GEN.AddClass(this.statusbarloadingimage, 'hidden');
	this.statusbar.appendChild(this.statusbarloadingimage);
};

Win.prototype.CreateStatusBarText = function(){
	this.statusbartext = document.createElement('div');
	GEN.AddClass(this.statusbartext, 'statusbartext');
	this.statusbar.appendChild(this.statusbartext);
};

Win.prototype.AddStatusBarText = function(t){
	this.statusbartext.innerHTML = t;
};

Win.prototype.CreateResizeIcon = function(){
	this.resizeicon = document.createElement('div');
	GEN.AddClass(this.resizeicon, 'resizeicon');
	this.statusbar.appendChild(this.resizeicon);
	this.BindResizeIcon();
};

Win.prototype.BindResizeIcon = function(e){
	var self = this;
	GEN.Bind(this.resizeicon, 'mousedown', function(e){
		PWD.StartResize(self, e.clientX, e.clientY);
	});
};

Win.prototype.HideLoading = function(){
	GEN.RemoveClass(this.statusbarloadingimage, 'visible');
	GEN.AddClass(this.statusbarloadingimage, 'hidden');
};

Win.prototype.ShowLoading = function(){
	GEN.RemoveClass(this.statusbarloadingimage, 'hidden');
	GEN.AddClass(this.statusbarloadingimage, 'visible');
};