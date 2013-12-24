function Win(){
	var self;
	self = this;
	this.id = 0;
	this.desktop = null;
	this.width = 0;
	this.height = 0;
	this.top = 0;
	this.left = 0;
	
	this.setSize = function(w, h){
		this.width = w;
		this.height = h;
		this.win.style.width = this.width + 'px';
		this.win.style.height = this.height + 'px';
	}
	
	this.setPos = function(t, l){
		this.top = t;
		this.left = l;
		this.win.style.top = this.top + 'px';
		this.win.style.left = this.left + 'px';
	}
};

Win.prototype.CreateWindow = function(d){
	this.desktop = d;
	this.win = document.createElement('div');
	GEN.AddClass(this.win, 'window');
	this.desktop.appendChild(this.win);
	this.CreateTitleBar();
	this.CreateStatusBar();
}

Win.prototype.CreateTitleBar = function(){
	this.titlebar = document.createElement('div');
	GEN.AddClass(this.titlebar, 'titlebar');
	this.CreateTitleBarCloseButton();
	this.win.appendChild(this.titlebar);
}

Win.prototype.CreateTitleBarCloseButton = function(){
	var cross = document.createElement('div');
	GEN.AddClass(cross, 'cross');
	this.closebutton = document.createElement('div');
	this.closebutton.appendChild(cross);
	GEN.AddClass(this.closebutton, 'closebutton');
	this.titlebar.appendChild(this.closebutton);
	this.BindCloseButton();
}

Win.prototype.AddTitleBarText = function(t){
	var title, text;
	title = document.createElement('div');
	text = document.createTextNode(t);
	title.appendChild(text);
	GEN.AddClass(title, 'titlebartitle');
	this.titlebar.appendChild(title);
}

Win.prototype.BindCloseButton = function(){
	var self = this;
	GEN.Bind(this.closebutton, 'click', function(){
		PWD.CloseWindow(self.id);
	});
}

Win.prototype.CreateStatusBar = function(){
	this.statusbar = document.createElement('div');
	GEN.AddClass(this.statusbar, 'statusbar');
	this.win.appendChild(this.statusbar);
	this.CreateStatusBarLoadingImage();
	this.CreateStatusBarText();
}

Win.prototype.CreateStatusBarLoadingImage = function(){
	this.statusbarloadingimage = document.createElement('div');
	GEN.AddClass(this.statusbarloadingimage, 'loadingimage');
	GEN.AddClass(this.statusbarloadingimage, 'hidden');
	this.statusbar.appendChild(this.statusbarloadingimage);
}

Win.prototype.CreateStatusBarText = function(){
	this.statusbartext = document.createElement('div');
	GEN.AddClass(this.statusbartext, 'statusbartext');
	this.statusbar.appendChild(this.statusbartext);
}

Win.prototype.AddStatusBarText = function(t){
	this.statusbartext.innerHTML = t;
}

Win.prototype.HideLoading = function(){
	GEN.RemoveClass(this.statusbarloadingimage, 'visible');
	GEN.AddClass(this.statusbarloadingimage, 'hidden');
}

Win.prototype.ShowLoading = function(){
	GEN.RemoveClass(this.statusbarloadingimage, 'hidden');
	GEN.AddClass(this.statusbarloadingimage, 'visible');
}