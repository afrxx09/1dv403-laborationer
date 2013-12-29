"use strict";

PWD.GalleryImage = function(img){
	var self;
	self = this;
	PWD.Win.call(this);
	
	this.type = 'Gallery';
	this.resizeable = false;
	
	this.img = img;
	this.padding = 50;
	this.CreateWindow();
	this.AddTitleBarText('Gallery image');
	this.CreateTitleBarIcon('PWD/gallery/gallery16.png');
	this.AddStatusBarText(img.URL);
	this.setSize((img.width + this.padding), (img.height + 66));
	
	this.InsertImage();
	this.CreateSettings();
}

PWD.G.InheritPrototype(PWD.GalleryImage, PWD.Win);

PWD.GalleryImage.prototype.InsertImage = function(){
	var wrap, img;
	wrap = document.createElement('div');
	PWD.G.AddClass(wrap, 'galleryimagewrap');
	img = document.createElement('img');
	img.setAttribute('src', this.img.URL);
	//img.style.marginLeft = ((this.img.width - (this.img.width * 2)) /2) + 'px';
	//img.style.marginTop = ((this.img.height - (this.img.height * 2)) / 2) + 'px';
	wrap.appendChild(img);
	this.windowcontent.appendChild(wrap);
};

PWD.GalleryImage.prototype.CreateSettings = function(){
	var self, arr;
	self = this;
	arr = [
		{
			name : 'Bakgrund',
			cb : function(){self.SetBackground(self.img.URL);}
		}
	];
	this.contextmenu.AddMenuGroup('Inställningar', arr);
};

PWD.GalleryImage.prototype.SetBackground = function(url){
	PWD.SetBackgroundImage(url);
};