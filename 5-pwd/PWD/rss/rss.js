"use strict";

function RSS(id){
	var self;
	self = this;
	Win.call(this);
	
	this.zIndex = id + 1;
	this.id = id;
	this.type = 'rss';
	this.resizeable = true;
	
	this.wrap = null;
	this.rssurl = 'http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=';
	this.refreshtime = (1000 * 60 * 10);
	this.feeds = [
		'http://www.dn.se/nyheter/m/rss/senaste-nytt',
		'http://feeds.idg.se/idg/vzzs',
		'http://www.sweclockers.com/feeds/nyheter'
	];
	
	this.CreateWindow();
	this.AddTitleBarText('RSS');
	this.CreateTitleBarIcon('images/rss16.png');
	this.AddStatusBarText('Loading RSS');
	this.ShowLoading();
	this.setSize(350, 500);
	
	this.CreateRSS();
	this.LoadRSS();
	this.StartRefreshTimer();
}

GEN.InheritPrototype(RSS, Win);

RSS.prototype.CreateRSS = function(){
	this.wrap = document.createElement('div');
	GEN.AddClass(this.wrap, 'rss');
	this.windowcontent.appendChild(this.wrap);
};

RSS.prototype.LoadRSS = function(){
	var self = this;
	this.ShowLoading();
	this.o = {
		m : 'get',
		url : self.rssurl + escape(this.feeds[2]),
		cb : self.LoadRSSDone,
		t : self,
		f : 'text'
	};
	GEN.Ajax(this.o);
};

RSS.prototype.LoadRSSDone = function(r){
	var d = new Date();
	this.wrap.innerHTML = r;
	this.HideLoading();
	this.AddStatusBarText('Senast uppdaterad:' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
};

RSS.prototype.StartRefreshTimer = function(){
	var self = this;
	setInterval(function(){
		self.LoadRSS();
	},this.refreshtime);
};