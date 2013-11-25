function Bind(elem, t, f){
	if(elem.addEventListener){
		elem.addEventListener(t,f,false);
	}
	else if(elem.attachEvent){
		elem.attachEvent('on'+t,f);
	}
}

var LM = {
	objLabby : {},
	
	Init : function(){
		new Labby();
		//this.objLabby = new Labby();
		//this.CreateDom();
		//this.Bind();
	},
	
	CreateDom : function(){
		var elemWrap = document.createElement('div');
		var btnSend = document.createElement('button');
		var btnText = document.createTextNode('Send');
		btnSend.appendChild(btnText);
		elemWrap.appendChild(btnSend);
		document.body.appendChild(elemWrap);
		this.arrElems.sendButton = btnSend;
	},
	
	Bind : function(){
		var self = this;
		Bind(this.arrElems.sendButton, 'click', function(){
			self._addMessage.call(self, 'hej');
			console.log(self.objLabby);
		});
	},
	
	_updateMessageCount : function(){
		this.arrElems.messageCount.innerHTML = this.objLabby.GetMessageCount();
	},
	
	_addMessage : function(strText){
		var strText = this.arrElems.messageText.value
		try{
			this.objLabby.AddMessage(strText);
			this._updateMessageCount();
			this.arrElems.messageText.value = '';
		}
		catch(e){
			alert('Kunde inte spara meddelande');
		}
	}
}

/*
	//v0.1
var LM = {
	arrMessages : [],
	btns : {
		sendButton			: 'send-button',
		messageContainer	: 'message-container',
		messageBox			: 'message-box',
		messageCounter		: 'message-counter'
	},
	
	Init : function(){
		this.Bind();
		return this;
	},
	
	Bind : function(){
		var self = this;
		var sendButton = document.getElementById(this.btns.sendButton);
		Bind(sendButton, 'click', function(){
			self.SaveNewText();
		});
		var messageContainer = document.getElementById(this.btns.messageContainer);
		Bind(messageContainer, 'click', function(e){
			var target = e.target;
			if(target.className.indexOf('delete-icon') !== -1){
				var messageId = target.parentNode.parentNode.getAttribute('id').replace('Message-','');
				self.DeleteMessage(messageId);
			}
			if(target.className.indexOf('time-icon') !== -1){
				var messageId = target.parentNode.parentNode.getAttribute('id').replace('Message-','');
				self.ShowMessageTime(messageId);
			}
		});
		var messageBox = document.getElementById(this.btns.messageBox);
		Bind(messageBox, 'keypress', function(e){
			if(!e.shiftKey && e.keyCode === 13){
				e.preventDefault();
				self.SaveNewText();
			}
		});
	},
	
	SaveNewText : function(){
		var messageBox = document.getElementById(this.btns.messageBox);
		var strNewText = messageBox.value;
		if(strNewText !== ''){
			this.arrMessages.push(new Message(strNewText, new Date()));
			this.UpdateMessageCount();
			this.RenderNewMessage();
			messageBox.value = '';
		}
	},
	
	UpdateMessageCount : function(){
		var messageCount = document.getElementById(this.btns.messageCounter);
		messageCount.innerHTML = this.arrMessages.length;
	},
	
	RenderNewMessage : function(){
		var strMessage = this.arrMessages[this.arrMessages.length - 1].getHTMLText();
		var strHtml = ''+
			'<div id="Message-' + (this.arrMessages.length - 1) + '" class="message">'+
			'<p><span class="delete-icon qwe"></span><span class="time-icon asd"></span>' + strMessage + '</p>'+
			'</div>'+
		'';
		var messageContainer = document.getElementById(this.btns.messageContainer);
		messageContainer.innerHTML += strHtml;
	},
	
	DeleteMessage : function(messageId){
		if(confirm("Är du säker på att du vill ta bort detta meddelandet?")){
			this.arrMessages.splice(messageId, 1);
			document.getElementById('Message-'+messageId).remove(0);
			this.UpdateMessageCount();
		}
	},
	
	ShowMessageTime : function(messageId){
		alert(this.arrMessages[messageId].getDateText());
	}
}
*/
window.onload = function(){
	var btnStart = document.getElementById('start');
	Bind(btnStart, 'click', function(){
		LM.Init();
	});
	//var test = LM.Init();
}