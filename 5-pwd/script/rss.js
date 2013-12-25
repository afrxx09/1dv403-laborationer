function RSS(d, id){
	var self;
	self = this;
	this.type = 'rss';
	Win.call(this);
	this.id = id;
	
	this.CreateWindow(d);
	this.AddTitleBarText('RSS');
	this.CreateTitleBarIcon('images/rss16.png');
	this.AddStatusBarText('Loading RSS');
	this.ShowLoading();
	this.setSize(200, 500);
}

RSS.prototype = new Win();