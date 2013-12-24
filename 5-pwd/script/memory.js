function Memory(d, id){
	var self;
	self = this;
	
	Win.call(this);
	this.id = id;
	
	this.CreateWindow(d);
	this.AddTitleBarText('Memory');
	this.AddStatusBarText('Loading Memory');
	this.ShowLoading();
	this.setSize(400, 400);
}

Memory.prototype = new Win();