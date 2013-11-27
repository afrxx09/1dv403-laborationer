function Labby(target){
	this.arrMessages = new Array();
	this.arrElems = this.CreateDom(target);
	this.Binds();
};

Labby.prototype.AddMessage = function(){
	var strText = this.arrElems.messageText.value;
	if(strText === ''){
		throw 'Kan inte spara tomma meddelanden.';
	}
	this.arrElems.messageText.value = '';
	this.arrMessages.push(new Message(strText, new Date()));
	this.arrElems.messageContainer.appendChild(this.RenderMessage(this.arrMessages.length-1));
	this.UpdateCount();
}

Labby.prototype.RenderMessages = function(){
	var fragment = document.createDocumentFragment();
	for(var i = 0; i < this.GetMessageCount(); i++){ 
		var elemMessage = this.RenderMessage(i);
		fragment.appendChild(elemMessage);
	}
	this.arrElems.messageContainer.innerHTML = '';
	this.arrElems.messageContainer.appendChild(fragment);
}

Labby.prototype.RenderMessage = function(i){
	var objMessage = this.arrMessages[i];
	var elemMessage = document.createElement('p');
	elemMessage.setAttribute('class', 'message');
	elemMessage.setAttribute('data-id', i);
	
	var deleteIcon = document.createElement('span');
	deleteIcon.setAttribute('class', 'delete-icon');
	
	var timeIcon = document.createElement('span');
	timeIcon.setAttribute('class', 'time-icon');
	
	var timeStamp = document.createElement('span');
	timeStamp.setAttribute('class', 'timeStamp');
	var textTimeStamp = document.createTextNode(objMessage.getTimeStamp());
	timeStamp.appendChild(textTimeStamp);
	
	elemMessage.appendChild(deleteIcon);
	elemMessage.appendChild(timeIcon);
	elemMessage.innerHTML += objMessage.getHTMLText();
	elemMessage.appendChild(timeStamp);
	return elemMessage;
}

Labby.prototype.DeleteMessage = function(target){
	var id = target.parentNode.getAttribute('data-id');
	if(confirm("Är du säker på att du vill ta bort detta meddelandet?")){
		this.arrMessages.splice(id, 1);
		this.UpdateCount(); 
		this.RenderMessages();
	}
}

Labby.prototype.ShowTimeStamp = function(target){
	var id = target.parentNode.getAttribute('data-id');
	alert(this.arrMessages[id].getDateText());
}

Labby.prototype.GetMessageCount = function(){
	return this.arrMessages.length;
}

Labby.prototype.UpdateCount = function(){
	this.arrElems.messageCount.innerHTML = this.GetMessageCount();
}

Labby.prototype.CreateDom = function(target){
	var elemWrap	= document.createElement('div');
	var elemCont	= document.createElement('div');
	
	var elemCountP	= document.createElement('div');
	var txtCountP	= document.createTextNode('Antal meddelanden: ');
	var elemCount	= document.createElement('span');
	var txtCount	= document.createTextNode('0');
	
	var elemText	= document.createElement('textarea');
	var elemTextWrap = document.createElement('div');
	var btnSend		= document.createElement('button');
	var btnText		= document.createTextNode('Send');
	
	var elemClear	= document.createElement('div');
	
	elemWrap.appendChild(elemCont);
	
	elemCount.appendChild(txtCount);
	elemCountP.appendChild(txtCountP);
	elemCountP.appendChild(elemCount);
	elemCountP.className = 'count';
	elemWrap.appendChild(elemCountP);
	
	elemText.className = 'message-box';
	elemTextWrap.className = '';
	elemTextWrap.appendChild(elemText);
	elemWrap.appendChild(elemTextWrap);
	
	
	btnSend.className = 'send-button';
	btnSend.appendChild(btnText);
	elemWrap.appendChild(btnSend);
	
	elemClear.className = 'clear';
	elemWrap.appendChild(elemClear);
	
	elemWrap.className = 'wrap';
	target.appendChild(elemWrap);
	
	return {
		sendButton : btnSend,
		messageText : elemText,
		messageContainer : elemCont,
		messageCount : elemCount
	}
}

Labby.prototype.Binds = function(){
	var self = this;
	Bind(this.arrElems.sendButton, 'click', function(){
		self.AddMessage();
	});
	Bind(this.arrElems.messageContainer, 'click', function(e){
		var target = e.target;
		if(target.className.indexOf('delete-icon') !== -1){
			self.DeleteMessage(target);
		}
		if(target.className.indexOf('time-icon') !== -1){
			self.ShowTimeStamp(target);
		}
	});
	Bind(this.arrElems.messageText, 'keypress', function(e){
		if(!e.shiftKey && e.keyCode === 13){
			e.preventDefault();
			self.AddMessage();
		}
	});
};