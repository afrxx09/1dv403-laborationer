function Labby(){
	var self = this;
	
	var _createDom = function(){
		var elemWrap	= document.createElement('div');
		var elemCont	= document.createElement('div');
		
		var elemCountP	= document.createElement('div');
		var txtCountP	= document.createTextNode('Antal meddelanden: ');
		var elemCount	= document.createElement('span');
		var txtCount	= document.createTextNode('0');
		
		var elemText	= document.createElement('textarea');
		var btnSend		= document.createElement('button');
		var btnText		= document.createTextNode('Send');
		
		elemWrap.appendChild(elemCont);
		
		elemCount.appendChild(txtCount);
		elemCountP.appendChild(txtCountP);
		elemCountP.appendChild(elemCount);
		elemWrap.appendChild(elemCountP);
		
		elemWrap.appendChild(elemText);
		btnSend.appendChild(btnText);
		elemWrap.appendChild(btnSend);
		
		document.body.appendChild(elemWrap);
		
		self._arrElems.sendButton = btnSend;
		self._arrElems.messageText = elemText;
		self._arrElems.messageContainer = elemCont;
		self._arrElems.messageCount = elemCount;
	};
	
	var _bind = function(){
		Bind(self._arrElems.sendButton, 'click', function(){
			self.AddMessage.call(self);
		});
		Bind(self._arrElems.messageContainer, 'click', function(e){
			var target = e.target;
			if(target.className.indexOf('delete-icon') !== -1){
				self.DeleteMessage.call(self, target);
			}
			if(target.className.indexOf('time-icon') !== -1){
				self.ShowTimeStamp.call(self, target);
			}
		});
	};
	
	this._arrElems = {
		sendButton		: null,
		messageCount	: null,
		messageText		: null,
		messageContainer: null,
	};
	
	this.arrMessages = new Array();
	this.rand = Math.random();
	_createDom();
	_bind();
}

Labby.prototype.AddMessage = function(){
	var strText = this._arrElems.messageText.value;
	if(strText === ''){
		throw 'Kan inte spara tomma meddelanden.';
	}
	this.arrMessages.push(new Message(strText, new Date()));
	this.RenderMessage();
	this.UpdateCount();
}

Labby.prototype.RenderMessage = function(){
	var objMessage = this.arrMessages[this.arrMessages.length - 1];
	var strHtml = ''+
		'<div class="message" data-id="' + (this.arrMessages.length - 1) + '">'+
		'<p><span class="delete-icon"></span><span class="time-icon"></span>' + objMessage.getHTMLText() + '</p>'+
		'</div>'+
	'';
	this._arrElems.messageContainer.innerHTML += strHtml;
}

Labby.prototype.DeleteMessage = function(target){
	var id = target.parentNode.parentNode.getAttribute('data-id');
	if(confirm("Är du säker på att du vill ta bort detta meddelandet?")){
		this.arrMessages.splice(id, 1);
		target.parentNode.parentNode.remove(0);
		this.UpdateCount();
	}
}

Labby.prototype.ShowTimeStamp = function(target){
	var id = target.parentNode.parentNode.getAttribute('data-id');
	alert(this.arrMessages[id].getDateText());
}

Labby.prototype.GetMessageCount = function(){
	return this.arrMessages.length;
}

Labby.prototype.UpdateCount = function(){
	this._arrElems.messageCount.innerHTML = this.GetMessageCount();
}