function Gallery(d, id){
	var self;
	self = this;
	this.type = 'gallery';
	
	Win.call(this);
	this.id = id;
	
	this.CreateWindow(d);
	this.AddTitleBarText('Gallery');
	this.CreateTitleBarIcon('images/gallery16.png');
	this.AddStatusBarText('Loading Gallery');
	this.ShowLoading();
	this.setSize(600, 450);
}

Gallery.prototype = new Win();