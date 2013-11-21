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
	
}

Message.prototype.getHTMLText = function(){
	var s = this.getText();
	return s.replace(/[\n\r]/g, '<br />');
}

Message.prototype.getDateText = function(){
	var d = this.getDateObj();
	return 'Inlägget skapades den ' + d.toLocaleString();
}