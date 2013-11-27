function Message(strMsg, objDate){
	this.getText = function(){
		return strMsg;
	}
	this.setText = function(_text){
		strMsg = _text;
	}
	
	this.getDateObj = function(){
		return objDate;
	}
	this.setDateObj = function(_date){
		objDate = _date();
	}
}

Message.prototype.toString = function(){
	return this.getText() + '(' + this.getDateObj() + ')';
}

Message.prototype.getHTMLText = function(){
	var s = this.getText();
	return s.replace(/[\n\r]/g, '<br />');
}

Message.prototype.getDateText = function(){
	var d = this.getDateObj();
	return 'Inlägget skapades den ' + d.toLocaleString();
}
Message.prototype.getTimeStamp = function(){
	var d,h,m,s;
	d = this.getDateObj();
	h = (d.getHours() > 9) ? d.getHours() : '0' + d.getHours();
	m = (d.getMinutes() > 9) ? d.getMinutes() : '0' + d.getMinutes();
	s = (d.getSeconds() > 9) ? d.getSeconds() : '0' + d.getSeconds();
	return h + ':' + m + ':' + s;
}