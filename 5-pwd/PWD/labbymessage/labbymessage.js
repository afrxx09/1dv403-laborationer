"use strict";

PWD.LabbyMessage = function(){
	var self;
	self = this;
	PWD.Win.call(this);
	
	this.type = 'Labby';
	this.resizeable = true;
	
	this.CreateWindow();
	this.AddTitleBarText('Labby Message');
	this.CreateTitleBarIcon('PWD/labbymessage/labbymessage16.png');
	this.AddStatusBarText('Loading Labby Message');
	this.ShowLoading();
	this.setSize(350, 500);
	
	this.posturl = 'http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php';
	this.geturl = 'http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php?history=';
	this.messagecounts = [0, 10, 25, 50]
	this.messagecount = this.messagecounts[1];
	this.refreshtimes = [10, 20, 30, 45, 60];
	this.refreshtime = 1000 * this.refreshtimes[4];
	this.interval = null;
	this.username = 'Anonymus';
	
	this.wrap = null;
	this.messagecontainer = null;
	this.messageform = null;
	this.textarea = null;
	this.sendbutton = null;
	this.messages = [];
	
	this.ReadCookie();
	this.CreateLabby();
	this.CreateSettings();
	this.GetMessages();
	this.StartRefreshTimer();
}

PWD.G.InheritPrototype(PWD.LabbyMessage, PWD.Win);

PWD.LabbyMessage.prototype.ReadCookie = function(){
	if(PWD.G.GetCookie('username') != ''){
		this.username = PWD.G.GetCookie('username');
	}
	if(PWD.G.GetCookie('refreshtime') != ''){
		this.refreshtime = PWD.G.GetCookie('refreshtime') * 1000;
	}
	if(PWD.G.GetCookie('messagecount') != ''){
		this.messagecount = +PWD.G.GetCookie('messagecount');
	}
}

PWD.LabbyMessage.prototype.CreateLabby = function(){
	this.wrap = document.createElement('div');
	PWD.G.AddClass(this.wrap, 'labby');
	this.windowcontent.appendChild(this.wrap);
	this.messagecontainer = document.createElement('div');
	PWD.G.AddClass(this.messagecontainer, 'messagecontainer');
	this.wrap.appendChild(this.messagecontainer);
	
	this.CreateForm();
};

PWD.LabbyMessage.prototype.CreateForm = function(){
	this.messageform = document.createElement('div');
	PWD.G.AddClass(this.messageform, 'messageform');
	this.wrap.appendChild(this.messageform);
	this.CreateTextArea();
	this.CreateSendButton();
};

PWD.LabbyMessage.prototype.CreateTextArea = function(){
	this.textarea = document.createElement('textarea');
	PWD.G.AddClass(this.textarea, 'textarea');
	this.messageform.appendChild(this.textarea);
	PWD.G.Bind(this.textarea, 'keypress', function(e){
		PWD.G.StopProp(e);
		if(!e.shiftKey && e.keyCode === 13){
			PWD.G.PrevDef(e);
			self.PostMessage();
		}
	});
};

PWD.LabbyMessage.prototype.CreateSendButton = function(){
	var self = this;
	this.sendbutton = document.createElement('button');
	this.sendbutton.appendChild(document.createTextNode('Skicka'));
	PWD.G.AddClass(this.sendbutton, 'sendbutton');
	this.messageform.appendChild(this.sendbutton);
	PWD.G.Bind(this.sendbutton, 'click', function(e){
		PWD.G.StopProp(e);
		self.PostMessage();
	});
};

PWD.LabbyMessage.prototype.StartRefreshTimer = function(){
	var self = this;
	if(this.interval !== null){
		clearInterval(this.interval);
	}
	this.interval = setInterval(function(){
		self.GetMessages();
	},this.refreshtime);
};


PWD.LabbyMessage.prototype.GetMessages = function(){
	var self = this;
	this.ShowLoading();
	this.o = {
		m : 'get',
		url : self.geturl + escape(this.messagecount),
		cb : self.GetMessagesDone,
		t : self,
		f : 'xml'
	};
	PWD.G.Ajax(this.o);
};

PWD.LabbyMessage.prototype.GetMessagesDone = function(xml){
	var i, messages, id, text, author, time, d, h, m, s;
	
	this.messagecontainer.innerHTML = '';
	this.messages = [];
	
	messages = xml.getElementsByTagName('message');
	for(i = 0; i < messages.length; i++){
		id = messages[i].getElementsByTagName('id')[0];
		text = messages[i].getElementsByTagName('text')[0];
		author = messages[i].getElementsByTagName('author')[0];
		time = messages[i].getElementsByTagName('time')[0];
		
		id = (id.firstChild) ? id.firstChild.nodeValue : 0;
		text = (text.firstChild) ? text.firstChild.nodeValue : '';
		author = (author.firstChild) ? author.firstChild.nodeValue : '.';
		time = (time.firstChild) ? time.firstChild.nodeValue : 0;
		this.messages.push(new PWD.LabbyMessage.Message(id, text, author, time));
	}
	d = new Date();
	h = (d.getHours() < 10 ) ? '0' + d.getHours() : d.getHours();
	m = (d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
	s = (d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
	this.HideLoading();
	this.AddStatusBarText('Senast uppdaterad: ' + h + ':' + m + ':' + s);
	this.RenderMessages();
};

PWD.LabbyMessage.prototype.RenderMessages = function(){
	var i, frag;
	frag = document.createDocumentFragment();
	for(i = 0; i < this.messages.length; i++){
		frag.appendChild(this.messages[i].elem);
	}
	this.messagecontainer.appendChild(frag);
};

PWD.LabbyMessage.prototype.PostMessage = function(){
	var self;
	self = this;
	this.sendbutton.innerHTML = 'skickar...';
	this.ShowLoading();
	this.o = {
		m : 'post',
		url : self.posturl,
		cb : self.PostMessageDone,
		t : self,
		f : 'text',
		d : 'text=' + encodeURIComponent(this.textarea.value) + '&username=' + encodeURIComponent(this.username)
	};
	PWD.G.Ajax(this.o);
};

PWD.LabbyMessage.prototype.PostMessageDone = function(r){
	this.sendbutton.innerHTML = 'Skicka';
	this.HideLoading();
	this.GetMessages();
};

PWD.LabbyMessage.prototype.CreateSettings = function(){
	var self, arr;
	self = this;
	arr = [
		{
			name : 'Uppdatera',
			cb : function(){self.GetMessages();}
		},
		{
			name : 'Ange användare',
			cb : function(){self.ShowChangeName();}
		},
		{
			name : 'Intervall',
			cb : function(){self.ShowChangeRefreshTime();}
		},
		{
			name : 'Antal meddelanden',
			cb : function(){self.ShowChangeMessageCount();}
		}
	];
	this.contextmenu.AddMenuGroup('Inställningar', arr);
};


PWD.LabbyMessage.prototype.ShowChangeRefreshTime = function(){
	var i, self, select, options;
	self = this;
	for(i = 0; i < this.refreshtimes.length; i++){
		options += '<option value="' + i + '">' + this.refreshtimes[i] + ' Sekunder</option>';
	}
	select = '<label for="selLabbyRefreshTime" style="margin-right:10px;">Välj intervall</label><select id="selLabbyRefreshTime">' + options +'</select>';
	PWD.dialogbody.innerHTML = select;
	PWD.ShowDialog();
	PWD.dialogcallback = function(){
		var val = document.getElementById('selLabbyRefreshTime').value;
		self.SaveChangeRefreshTime(val);
	};
};

PWD.LabbyMessage.prototype.SaveChangeRefreshTime = function(v){
	PWD.G.SetCookie('refreshtime', this.refreshtimes[v], 365);
	this.refreshtime = (1000 * this.refreshtimes[v]);
	this.StartRefreshTimer();
};


PWD.LabbyMessage.prototype.ShowChangeName = function(){
	var self, input;
	self = this;
	input = '<label for="txtLabbyUserName" style="margin-right:10px;">Välj Användarnamn</label><input type="text" id="txtLabbyUserName" value="'+ this.username +'"/>';
	PWD.dialogbody.innerHTML = input;
	PWD.ShowDialog();
	PWD.dialogcallback = function(){
		var val = document.getElementById('txtLabbyUserName').value;
		val = (val == '') ? 'Anonymus' : val;
		self.SaveChangeName(val);
	};
};

PWD.LabbyMessage.prototype.SaveChangeName = function(v){
	PWD.G.SetCookie('username', v, 365);
	this.username = v;
};

PWD.LabbyMessage.prototype.ShowChangeMessageCount = function(){
	var i, self, select, options, optiontext;
	self = this;
	for(i = 0; i < this.messagecounts.length; i++){
		optiontext = (this.messagecounts[i] == 0) ? 'Alla' : this.messagecounts[i] + ' st';
		options += '<option value="' + i + '">' + optiontext + '</option>';
	}
	select = '<label for="selLabbyMessageCount" style="margin-right:10px;">Antal meddelanden</label><select id="selLabbyMessageCount">' + options +'</select>';
	PWD.dialogbody.innerHTML = select;
	PWD.ShowDialog();
	PWD.dialogcallback = function(){
		var val = document.getElementById('selLabbyMessageCount').value;
		self.SaveChangeMessagCount(val);
	};
};

PWD.LabbyMessage.prototype.SaveChangeMessagCount = function(v){
	PWD.G.SetCookie('messagecount', this.messagecounts[v], 365);
	this.messagecount = this.messagecounts[v];
	this.GetMessages();
};

/* Message class */
PWD.LabbyMessage.Message = function(id, text, author, time){
	this.elem;
	this.head;
	this.body;
	this.id = id;
	this.text = text;
	this.author = author;
	this.time = time;
	this.date = new Date();
	this.date.setTime(this.time);
	
	this.CreateMessage();
	this.AddContent();
};

PWD.LabbyMessage.Message.prototype.CreateMessage = function(){
	this.elem = document.createElement('div');
	PWD.G.AddClass(this.elem, 'message');
	this.head = document.createElement('div');
	PWD.G.AddClass(this.head, 'head');
	this.head.setAttribute('rel', this.id);
	this.body = document.createElement('div');
	PWD.G.AddClass(this.body, 'body');
	this.elem.appendChild(this.head);
	this.elem.appendChild(this.body);
};

PWD.LabbyMessage.Message.prototype.AddContent = function(){
	var etext, eauthor, etime;
	eauthor = document.createElement('span');
	PWD.G.AddClass(eauthor, 'author');
	eauthor.appendChild(document.createTextNode(this.author));
	this.head.appendChild(eauthor);
	
	etime = document.createElement('span');
	PWD.G.AddClass(etime, 'date');
	etime.appendChild(document.createTextNode(this.date.toLocaleString()));
	this.head.appendChild(etime);
	
	etext = document.createElement('span');
	PWD.G.AddClass(etext, 'text');
	etext.appendChild(document.createTextNode(this.text));
	this.body.appendChild(etext);
};

PWD.LabbyMessage.Message.prototype.getHTMLText = function(){
	var s = this.getText();
	return s.replace(/[\n\r]/g, '<br />');
};


PWD.LabbyMessage.Message.prototype.getTimeStamp = function(){
	var d,h,m,s;
	d = this.date;
	h = (d.getHours() > 9) ? d.getHours() : '0' + d.getHours();
	m = (d.getMinutes() > 9) ? d.getMinutes() : '0' + d.getMinutes();
	s = (d.getSeconds() > 9) ? d.getSeconds() : '0' + d.getSeconds();
	return h + ':' + m + ':' + s;
};