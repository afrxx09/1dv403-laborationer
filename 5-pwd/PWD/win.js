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
	this.contextmenu = null;
	
	this.width = 0;
	this.height = 0;
	this.top = 0;
	this.left = 0;
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
		this.windowcontent.style.height = (this.height - 66) + 'px';
	};
};

PWD.Win.prototype.CreateWindow = function(){
	var self = this;
	this.elem = document.createElement('div');
	PWD.G.AddClass(this.elem, 'window');
	PWD.desktop.appendChild(this.elem);
	this.CreateTitleBar();
	this.CreateContextMenu();
	this.CreateWindowContent();
	this.CreateStatusBar();
	PWD.G.Bind(this.elem, 'click', function(){
		PWD.ToggleActiveWindow(self);
	});
};

PWD.Win.prototype.CreateContextMenu = function(){
	var self, arr;
	self = this;
	arr = [
		{
			name : 'Stäng',
			cb : function(){PWD.CloseWindow(self);}
		},
		{
			name : 'Minimera',
			cb : function(){PWD.MinifyWindow(self);}
		}
	];
	
	this.contextmenu = new PWD.Win.ContextMenu();
	this.elem.appendChild(this.contextmenu.elem);
	this.contextmenu.AddMenuGroup('Arkiv', arr);
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

/*ContextMenu*/
PWD.Win.ContextMenu = function(){
	var self = this;
	
	this.elem = null;
	this.ul = null;
	this.menugroups = [];
	
	this.Create();
};

PWD.Win.ContextMenu.prototype = {
	Create : function(){
		this.elem = document.createElement('div');
		this.ul = document.createElement('ul');
		PWD.G.AddClass(this.elem, 'contextmenu');
		this.elem.appendChild(this.ul);
	},
	
	AddMenuGroup : function(label, arr){
		var mg;
		mg = new PWD.Win.ContextMenuGroup(label, arr);
		this.menugroups.push(mg);
		this.ul.appendChild(mg.elem);
	}
};


/*Context menu group*/
PWD.Win.ContextMenuGroup = function(label, arr){
	var self = this;
	this.elem = null;
	this.label = label;
	this.list = null;
	this.listitems = [];
	
	this.Create();
	this.AddListItems(arr);
};

PWD.Win.ContextMenuGroup.prototype = {
	Create : function(){
		var self = this;
		this.elem = document.createElement('li');
		this.elem.appendChild(document.createTextNode(this.label));
		this.list = document.createElement('ul');
		PWD.G.AddClass(this.list, 'hidden');
		this.elem.appendChild(this.list);
		PWD.G.Bind(this.elem, 'click', function(e){
			PWD.G.StopProp(e);
			if(PWD.G.HasClass(self.list, 'hidden')){
				PWD.G.RemoveClass(self.list, 'hidden');
				PWD.G.AddClass(self.list, 'visible');
			}
			else{
				PWD.G.RemoveClass(self.list, 'visible');
				PWD.G.AddClass(self.list, 'hidden');
			}
		});
		PWD.G.Bind(this.elem, 'mouseleave', function(){
			PWD.G.RemoveClass(self.list, 'visible');
			PWD.G.AddClass(self.list, 'hidden');
		});
	},
	
	AddListItems : function(arr){
		var i, listitem;
		for(i = 0; i < arr.length; i++){
			listitem = new PWD.Win.ContextMenuListItem(arr[i].name, arr[i].cb);
			this.listitems.push(listitem);
			this.list.appendChild(listitem.elem);
		}
	}
};

PWD.Win.ContextMenuListItem = function(label, callback){
	var self = this;
	this.elem = null;
	this.label = label;
	this.Callback = callback;
	this.Create();
};

PWD.Win.ContextMenuListItem.prototype = {
	Create : function(){
		var self = this;
		this.elem = document.createElement('li');
		this.elem.appendChild(document.createTextNode(this.label));
		PWD.G.Bind(this.elem, 'click', function(e){
			
			self.Callback();
		});
	}
};