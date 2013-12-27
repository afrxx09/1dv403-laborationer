"use strict";
function Gallery(id){
	var self;
	self = this;
	Win.call(this);
	
	this.type = 'gallery';
	this.resizeable = true;
	this.id = id;
	
	this.CreateWindow();
	this.AddTitleBarText('Gallery');
	this.CreateTitleBarIcon('images/gallery16.png');
	this.AddStatusBarText('Loading Gallery');
	this.setSize(400, 400);
	
	this.ajaxurl = 'http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/';
	this.gallery = null;
	this.table = null;
	this.imagemaxwidth = 0;
	this.imagemaxheight = 0;
	this.images = [];
	
	this.CreateGallery();
	this.LoadGallery();
}

Gallery.prototype = new Win();

Gallery.prototype.CreateGallery = function(){
	this.gallery = document.createElement('div');
	GEN.AddClass(this.gallery, 'gallery');
	this.table = document.createElement('table');
	this.gallery.appendChild(this.table);
	this.windowcontent.appendChild(this.gallery);
};

Gallery.prototype.LoadGallery = function(){
	var self = this;
	this.ShowLoading();
	this.o = {
		url : self.ajaxurl,
		cb : this.LoadGalleryDone,
		t : self
	};
	GEN.Ajax(this.o);
};

Gallery.prototype.LoadGalleryDone = function(json){
	this.images = json;
	this.HideLoading();
	this.AddStatusBarText(this.images.length + ' bilder lästes in');
	this.table.innerHTML = '';
	this.GetImageMaxSizes();
	this.CreateTableContent();
};

Gallery.prototype.GetImageMaxSizes = function(){
	var i;
	for(i = 0; i < this.images.length; i++){
		this.imagemaxheight = (this.images[i].thumbHeight > this.imagemaxheight) ? this.images[i].thumbHeight : this.imagemaxheight;
		this.imagemaxwidth = (this.images[i].thumbWidth > this.imagemaxwidth) ? this.images[i].thumbWidth : this.imagemaxwidth;
	}
};

Gallery.prototype.CreateTableContent = function(){
	var i, self, row, td, img;
	for(i = 0; i < this.images.length; i++){
		if(i % 3 === 0){
			row = document.createElement('tr');
			this.table.appendChild(row);
		}
		td = this.AddImageToGallery(i);
		row.appendChild(td);
	}
};

Gallery.prototype.AddImageToGallery = function(i){
	var td, wrap, thumb;
	thumb = this.CreateImageThumb(i);
	wrap = this.CreateImageWrap(i);
	wrap.appendChild(thumb);
	td = document.createElement('td');
	td.appendChild(wrap);
	return td;
};

Gallery.prototype.CreateImageWrap = function(i){
	var self, wrap;
	self = this;
	wrap = document.createElement('div');
	wrap.setAttribute('rel', i);
	GEN.Bind(wrap, 'click', function(e){
		GEN.StopProp(e);
		var index = parseInt(this.getAttribute('rel'));
		self.ShowImage(index);
	});
	wrap.style.width = this.imagemaxwidth + 'px';
	wrap.style.height = this.imagemaxheight + 'px';
	GEN.AddClass(wrap, 'thumbwrap');
	return wrap;
};

Gallery.prototype.CreateImageThumb = function(i){
	var thumb = document.createElement('img');
	thumb.setAttribute('src', this.images[i].thumbURL);
	return thumb;
};

Gallery.prototype.ShowImage = function(i){
	PWD.windows.push(new GalleryImage(PWD.windows.length, this.images[i]));
	PWD.PositionWindow(PWD.windows[PWD.windows.length-1]);
	PWD.menuicons.gallery.windows.push(PWD.windows.length-1);
	PWD.CreateIconList(PWD.menuicons.gallery);
};