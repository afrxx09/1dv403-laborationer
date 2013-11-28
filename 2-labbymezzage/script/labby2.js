function Labby2(target){
	var self, _bind, _createDom, _arrElements, _arrMessages;
	self = this;
	
	this.getMessage = function(i){
		return _arrMessages[i];
	}
	this.getMessages = function(){
		return _arrMessages;
	};
	this.setMessages = function(arrMessages){
		_arrMessages = arrMessages;
	};
	
	this.getElements = function(){
		return _arrElements;
	}
	this.setElements = function(arrElements){
		_arrElements = arrElements;
	}
	
	_createDom = function(){
		var eWrap		= document.createElement('div');
		var eMessages	= document.createElement('div');
		
		var eCountP	= document.createElement('div');
		var tCountP	= document.createTextNode('Antal meddelanden: ');
		var eCount	= document.createElement('span');
		var tCount	= document.createTextNode('0');
		
		var eTextArea	= document.createElement('textarea');
		
		var eSendDiv	= document.createElement('div');
		var eSend		= document.createElement('button');
		var tSend		= document.createTextNode('Send');
		
		eWrap.appendChild(eMessages);
		
		eCount.appendChild(tCount);
		eCountP.appendChild(tCountP);
		eCountP.appendChild(eCount);
		eCountP.setAttribute('class', 'count');
		eWrap.appendChild(eCountP);
		
		eTextArea.setAttribute('class', 'new-message');
		eWrap.appendChild(eTextArea);
		
		
		eSend.setAttribute('class', 'send-button');
		eSend.appendChild(tSend);
		eSendDiv.appendChild(eSend);
		eSendDiv.setAttribute('class', 'button-container');
		eWrap.appendChild(eSendDiv);
		
		
		eWrap.setAttribute('class', 'wrap');
		target.appendChild(eWrap);
		
		var o = {
			sendButton			: eSend,
			messageText			: eTextArea,
			messageContainer	: eMessages,
			messageCount		: eCount
		}
		self.setElements(o);
	};
	
	_binds = function(){
		Bind(_arrElements.sendButton, 'click', function(e){
			StopProp(e);
			PrevDef(e);
			self.AddMessage();
		});
		Bind(_arrElements.messageContainer, 'click', function(e){
			StopProp(e);
			var target, targetClass;
			target = e.target;
			targetClass = target.getAttribute('class');
			if(targetClass.indexOf('delete-icon') !== -1){
				self.DeleteMessage(target);
			}
			if(targetClass.indexOf('time-icon') !== -1){
				self.ShowTimeStamp(target);
			}
		});
		Bind(_arrElements.messageText, 'keypress', function(e){
			StopProp(e);
			if(!e.shiftKey && e.keyCode === 13){
				PrevDef(e);
				self.AddMessage();
			}
		});
	};
	
	_arrMessages = new Array();
	_createDom();
	_binds();
}

Labby2.prototype.AddMessage = function(){
	var aElems, aMessages, strText;
	aElems		= this.getElements();
	aMessages	= this.getMessages();
	strText		= aElems.messageText.value;
	if(strText === ''){
		throw 'Kan inte spara tomma meddelanden.';
	}
	aElems.messageText.value = '';
	aMessages.push(new Message(strText, new Date()));
	aElems.messageContainer.appendChild(this.RenderMessage(this.GetMessageCount()-1));
	this.UpdateCount();
}

Labby2.prototype.RenderMessages = function(){
	var aElems, eMessage, fragment, i;
	aElems = this.getElements();
	fragment = document.createDocumentFragment();
	for(i = 0; i < this.GetMessageCount(); i++){ 
		eMessage = this.RenderMessage(i);
		fragment.appendChild(eMessage);
	}
	aElems.messageContainer.innerHTML = '';
	aElems.messageContainer.appendChild(fragment);
}

Labby2.prototype.RenderMessage = function(i){
	var oMessage, eMessage, eDeleteIcon, eTimeIcon, eTimeStamp, tTimeStamp;
	oMessage = this.getMessage(i);
	
	eMessage = document.createElement('p');
	eMessage.setAttribute('class', 'message');
	eMessage.setAttribute('data-id', i);
	
	eDeleteIcon = document.createElement('a');
	eDeleteIcon.setAttribute('class', 'delete-icon');
	
	eTimeIcon = document.createElement('a');
	eTimeIcon.setAttribute('class', 'time-icon');
	
	eTimeStamp = document.createElement('span');
	eTimeStamp.setAttribute('class', 'timeStamp');
	tTimeStamp = document.createTextNode(oMessage.getTimeStamp());
	eTimeStamp.appendChild(tTimeStamp);
	
	eMessage.appendChild(eDeleteIcon);
	eMessage.appendChild(eTimeIcon);
	eMessage.innerHTML += oMessage.getHTMLText();
	eMessage.appendChild(eTimeStamp);
	
	return eMessage;
}

Labby2.prototype.DeleteMessage = function(target){
	var aMessages, id;
	aMessages = this.getMessages(); 
	id = target.parentNode.getAttribute('data-id');
	if(confirm("Är du säker på att du vill ta bort detta meddelandet?")){
		aMessages.splice(id, 1);
		this.UpdateCount(); 
		this.RenderMessages();
	}
}

Labby2.prototype.ShowTimeStamp = function(target){
	var oMesssage, id;
	id = target.parentNode.getAttribute('data-id');
	oMesssage = this.getMessage(id);
	alert(oMesssage.getDateText());
}

Labby2.prototype.GetMessageCount = function(){
	var aMessages = this.getMessages();
	return aMessages.length;
}

Labby2.prototype.UpdateCount = function(){
	var aElems = this.getElements();
	aElems.messageCount.innerHTML = this.GetMessageCount();
}