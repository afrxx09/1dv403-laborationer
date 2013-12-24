function Gallery(d, id){
	var self;
	self = this;
	
	Win.call(this);
	this.id = id;
	
	this.CreateWindow(d);
	this.AddTitleBarText('Gallery');
	this.AddStatusBarText('Loading Gallery');
	this.ShowLoading();
	this.setSize(600, 450);
}

Gallery.prototype = new Win();