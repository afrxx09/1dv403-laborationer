"use strict";

function GalleryImage(id,img){
	var self;
	self = this;
	Win.call(this);
	
	this.id = id;
	this.type = 'galleryimage';
	this.resizeable = false;
	
	this.img = img;
	this.padding = 50;
	this.CreateWindow();
	this.AddTitleBarText('Gallery image');
	this.CreateTitleBarIcon('images/gallery16.png');
	this.AddStatusBarText(img.URL);
	this.setSize((img.width + this.padding), (img.height + 46 + this.padding));
	
	this.InsertImage();
}

GalleryImage.prototype = new Win();

GalleryImage.prototype.InsertImage = function(){
	var wrap, img;
	wrap = document.createElement('div');
	GEN.AddClass(wrap, 'galleryimagewrap');
	img = document.createElement('img');
	img.setAttribute('src', this.img.URL);
	img.style.marginLeft = ((this.img.width - (this.img.width * 2)) /2) + 'px';
	img.style.marginTop = ((this.img.height - (this.img.height * 2)) / 2) + 'px';
	wrap.appendChild(img);
	this.windowcontent.appendChild(wrap);
}