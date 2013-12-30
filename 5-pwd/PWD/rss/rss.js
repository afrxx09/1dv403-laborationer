"use strict";

PWD.RSS = function(){
	var self;
	self = this;
	PWD.Win.call(this);
	
	this.type = 'RSS';
	this.resizeable = true;
	
	this.wrap = null;
	this.rssurl = 'http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=';
	this.refreshtimes = [1, 3, 5, 10, 20, 30];
	this.refreshtime = (1000 * 60 * this.refreshtimes[3]);
	this.interval = null;
	this.feeds = [
		'http://www.dn.se/nyheter/m/rss/senaste-nytt',
		'http://feeds.idg.se/idg/vzzs',
		'http://www.sweclockers.com/feeds/nyheter'
	];
	this.currentfeed = this.feeds[2];
	
	this.CreateWindow();
	this.AddTitleBarText('RSS');
	this.CreateTitleBarIcon('PWD/rss/rss16.png');
	this.AddStatusBarText('Loading RSS');
	this.ShowLoading();
	this.setSize(350, 500);
	
	this.CreateRSS();
	this.CreateSettings();
	this.LoadRSS();
	this.StartRefreshTimer();
}

PWD.G.InheritPrototype(PWD.RSS, PWD.Win);

PWD.RSS.prototype.CreateRSS = function(){
	this.wrap = document.createElement('div');
	PWD.G.AddClass(this.wrap, 'rss');
	this.windowcontent.appendChild(this.wrap);
};

PWD.RSS.prototype.LoadRSS = function(){
	var self = this;
	this.ShowLoading();
	this.o = {
		m : 'get',
		url : self.rssurl + escape(this.currentfeed),
		cb : self.LoadRSSDone,
		t : self,
		f : 'text'
	};
	PWD.G.Ajax(this.o);
};

PWD.RSS.prototype.LoadRSSDone = function(r){
	var d, h, m ,s;
	d = new Date();
	h = (d.getHours() < 10 ) ? '0' + d.getHours() : d.getHours();
	m = (d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
	s = (d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
	this.wrap.innerHTML = r;
	this.HideLoading();
	this.AddStatusBarText('Senast uppdaterad: ' + h + ':' + m + ':' + s);
};

PWD.RSS.prototype.StartRefreshTimer = function(){
	var self = this;
	if(this.interval !== null){
		clearInterval(this.interval);
	}
	this.interval = setInterval(function(){
		self.LoadRSS();
	},this.refreshtime);
};

PWD.RSS.prototype.CreateSettings = function(){
	var self, arr;
	self = this;
	arr = [
		{
			name : 'Uppdatera nu',
			cb : function(){self.LoadRSS();}
		},
		{
			name : 'Ange Källa',
			cb : function(){self.ShowChangeFeed();}
		},
		{
			name : 'Uppdateringsintervall',
			cb : function(){self.ShowChangeRefreshTime();}
		}
	];
	this.contextmenu.AddMenuGroup('Inställningar', arr);
};

PWD.RSS.prototype.ShowChangeFeed = function(){
	var i, self, select, options;
	self = this;
	for(i = 0; i < this.feeds.length; i++){
		options += '<option value="' + i + '">' + this.feeds[i] + '</option>';
	}
	select = '<label for="selRSSFeed" style="margin-right:10px;">Välj källa</label><select id="selRSSFeed">' + options +'</select>';
	PWD.dialogbody.innerHTML = select;
	PWD.ShowDialog();
	PWD.dialogcallback = function(){
		var val = document.getElementById('selRSSFeed').value;
		self.SaveChangeFeed(val);
	};
};

PWD.RSS.prototype.SaveChangeFeed = function(v){
	this.currentfeed = this.feeds[v];
	this.LoadRSS();
};

PWD.RSS.prototype.ShowChangeRefreshTime = function(){
	var i, self, select, options;
	self = this;
	for(i = 0; i < this.refreshtimes.length; i++){
		options += '<option value="' + i + '">' + this.refreshtimes[i] + ' Minuter</option>';
	}
	select = '<label for="selRSSRefreshTime" style="margin-right:10px;">Välj intervall</label><select id="selRSSRefreshTime">' + options +'</select>';
	PWD.dialogbody.innerHTML = select;
	PWD.ShowDialog();
	PWD.dialogcallback = function(){
		var val = document.getElementById('selRSSRefreshTime').value;
		self.SaveChangeRefreshTime(val);
	};
};

PWD.RSS.prototype.SaveChangeRefreshTime = function(v){
	this.refreshtime = (1000 * 60 * this.refreshtimes[v]);
	this.StartRefreshTimer();
};