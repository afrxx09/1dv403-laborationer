"use strict";

function RSS(id){
	var self;
	self = this;
	
	Win.call(this);
	this.id = id;
	this.type = 'rss';
	this.resizeable = true;
	
	this.CreateWindow();
	this.AddTitleBarText('RSS');
	this.CreateTitleBarIcon('images/rss16.png');
	this.AddStatusBarText('Loading RSS');
	this.ShowLoading();
	this.setSize(200, 500);
}

RSS.prototype = new Win();