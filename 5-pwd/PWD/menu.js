"use strict";

PWD.Menu = function(apps){
	var self;
	self = this;
	this.apps = apps;
	
	this.menuicons = [];
	this.elem = null;
	this.height = 40;
	
	this.SetMenuSize = function(){
		this.elem.style.width = this.width  + 'px';
		this.elem.style.height = '40px';
	};
	
	this.CreateMenu();
	this.CreateMenuIcons();
	this.AppendIcons();
};

PWD.Menu.prototype = {
	CreateMenu : function(){
		this.elem = document.createElement('div');
		PWD.G.AddClass(this.elem, 'menu');
	},
	
	CreateMenuIcons : function(){
		var i;
		for(i = 0; i < this.apps.length; i++){
			this.menuicons.push(new PWD.Menu.MenuIcon(this.apps[i]));
		}
	},
	
	AppendIcons : function(){
		var i, fragment;
		fragment = document.createDocumentFragment();
		for(i = 0; i < this.menuicons.length; i++){
			fragment.appendChild(this.menuicons[i].elem);
		}
		this.elem.appendChild(fragment);
	},
	
	AddToIconList : function(app){
		var i;
		for(i = 0; i < this.menuicons.length; i++){
			if(app.type == this.menuicons[i].icontype){
				this.menuicons[i].list.AddToList(app);
			}
		}
	},
	
	RemoveFromIconList : function(app){
		var i;
		for(i = 0; i < this.menuicons.length; i++){
			if(app.type == this.menuicons[i].icontype){
				this.menuicons[i].list.RemoveFromList(app);
			}
		}
	}
}

/* MenuIcons */
PWD.Menu.MenuIcon = function(type){
	this.icontype = type;
	this.iconpath = 'PWD/' + type.toLowerCase() + '/' + type.toLowerCase() + '32.png';
	this.elem = null;
	this.icon = null;
	this.list = null;
	
	this.Create();
	this.BindIcon();
};

PWD.Menu.MenuIcon.prototype = {
	Create : function(){
		this.CreateWrap();
		this.CreateIcon();
		this.list = new PWD.Menu.List();
		this.elem.appendChild(this.list.elem);
	},
	
	CreateWrap : function(){
		this.elem = document.createElement('div');
		PWD.G.AddClass(this.elem, 'iconwrap');
		//this.elem.setAttribute('rel', this.icontype);
	},
	
	CreateIcon : function(){
		this.icon = document.createElement('img');
		this.icon.setAttribute('src', this.iconpath);
		PWD.G.AddClass(this.icon, 'menuicon');
		this.elem.appendChild(this.icon);
	},
	
	BindIcon : function(){
		var self = this;
		PWD.G.Bind(this.elem, 'click', function(){
			//PWD.StartApp(this.getAttribute('rel'));
			PWD.StartApp(self.icontype);
		});
		PWD.G.Bind(this.elem, 'mouseover', function(){
			self.ShowList();
		});
		PWD.G.Bind(this.elem, 'mouseleave', function(){
			self.HideList();
		});
	},
	
	ShowList : function(){
		PWD.G.RemoveClass(this.list.elem, 'hidden');
		PWD.G.AddClass(this.list.elem, 'visible');
	},
	
	HideList : function(){
		PWD.G.RemoveClass(this.list.elem, 'visible');
		PWD.G.AddClass(this.list.elem, 'hidden');
	}
	
	
};

PWD.Menu.List = function(){
	this.elem = null;
	this.listitems = [];
	this.CreateList();
};

PWD.Menu.List.prototype = {
	CreateList : function(){
		this.elem = document.createElement('ul');
		PWD.G.AddClass(this.elem, 'iconlist');
		PWD.G.AddClass(this.elem, 'hidden');
	},
	
	AddToList : function(app){
		var listitem = new PWD.Menu.ListItem(app);
		this.listitems.push(listitem);
		this.elem.appendChild(listitem.elem);
	},
	
	RemoveFromList : function(app){
		var i;
		for(i = 0; i < this.listitems.length; i++){
			if(this.listitems[i].app == app){
				this.elem.removeChild(this.listitems[i].elem);
				this.listitems.splice(i, 1);
			}
		}
	}
};

PWD.Menu.ListItem = function(app){
	this.elem = null;
	this.app = app;
	this.CreateListItem();
	this.ListItemBinds();
};

PWD.Menu.ListItem.prototype = {
	CreateListItem : function(){
		this.elem = document.createElement('li');
		this.elem.appendChild(document.createTextNode(this.app.type));
	},
	
	ListItemBinds : function(){
		var self = this;
		PWD.G.Bind(this.elem, 'click', function(e){
			PWD.G.StopProp(e);
			PWD.ToggleActiveWindow(self.app);
		});
		PWD.G.Bind(this.elem, 'mouseover', function(){
			PWD.HighlightWindow(self.app);
		});
		PWD.G.Bind(this.elem, 'mouseleave', function(){
			PWD.UnHighlightWindow(self.app);
		});
	}
};