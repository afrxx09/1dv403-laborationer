/*v0.3*/
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
		document.body.appendChild(elemWrap);
		
		self.arrElems.sendButton = btnSend;
		self.arrElems.messageText = elemText;
		self.arrElems.messageContainer = elemCont;
		self.arrElems.messageCount = elemCount;
	};
	
	var _bind = function(){
		Bind(self.arrElems.sendButton, 'click', function(){
			self.AddMessage.call(self);
		});
		Bind(self.arrElems.messageContainer, 'click', function(e){
			var target = e.target;
			if(target.className.indexOf('delete-icon') !== -1){
				self.DeleteMessage.call(self, target);
			}
			if(target.className.indexOf('time-icon') !== -1){
				self.ShowTimeStamp.call(self, target);
			}
		});
		Bind(self.arrElems.messageText, 'keypress', function(e){
			if(!e.shiftKey && e.keyCode === 13){
				e.preventDefault();
				self.AddMessage.call(self);
			}
		});
	};
	
	this.arrElems = {
		sendButton		: null,
		messageCount	: null,
		messageText		: null,
		messageContainer: null,
	};
	
	this.arrMessages = new Array();
	_createDom();
	_bind();
}

Labby.prototype.AddMessage = function(){
	var strText = this.arrElems.messageText.value;
	if(strText === ''){
		throw 'Kan inte spara tomma meddelanden.';
	}
	this.arrElems.messageText.value = '';
	this.arrMessages.push(new Message(strText, new Date()));
	this.RenderMessages();
	this.UpdateCount();
}

Labby.prototype.RenderMessages = function(){
	var elemMessageWrap = document.createElement('div');
	for(var i = 0; i < this.GetMessageCount(); i++){ 
		var objMessage = this.arrMessages[i];
		
		var elemMessage = document.createElement('p');
		elemMessage.setAttribute('class', 'message');
		elemMessage.setAttribute('data-id', i);
		
		var deleteIcon = document.createElement('span');
		deleteIcon.setAttribute('class', 'delete-icon');
		
		var timeIcon = document.createElement('span');
		timeIcon.setAttribute('class', 'time-icon');
		
		var text = document.createTextNode(objMessage.getHTMLText());
		
		elemMessage.appendChild(deleteIcon);
		elemMessage.appendChild(timeIcon);
		elemMessage.appendChild(text);
		
		elemMessageWrap.appendChild(elemMessage);
	}
	this.arrElems.messageContainer.innerHTML = '';
	this.arrElems.messageContainer.appendChild(elemMessageWrap);
}

Labby.prototype.DeleteMessage = function(target){
	var id = target.parentNode.getAttribute('data-id');
	if(confirm("Är du säker på att du vill ta bort detta meddelandet?")){
		this.arrMessages.splice(id, 1);
		target.parentNode.remove(0);
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