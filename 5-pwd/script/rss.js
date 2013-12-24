function RSS(d, id){
	var self;
	self = this;
	
	Win.call(this);
	this.id = id;
	
	this.CreateWindow(d);
	this.AddTitleBarText('RSS');
	this.AddStatusBarText('Loading RSS');
	this.ShowLoading();
	this.setSize(200, 500);
}

RSS.prototype = new Win();