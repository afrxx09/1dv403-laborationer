function Field(elem){
	var self, field, validationType, value, count, fieldTypes;
	self = this;
	field = elem;
	value = '';
	count = 0;
	fieldTypes = ['text', 'number', 'email']
	
	this.valdiationFunc = null;
	this.valid = false;
	
	this.getElem = function(){
		return elem;
	}
	
	this.getCount = function(){
		return count;
	}
	
	this.getValue = function(){
		return value;
	};
	this.setValue = function(v){
		value = v;
	};
	
	this.setInputValue = function(v){
		elem.value = v;
	}
	
	function _setValidationType(){
		validationType = field.getAttribute('data-fieldtype');
		if(fieldTypes.indexOf(validationType) === -1){
			validationType = text;
		}
	}
	
	function _setValidationCount(){
		var mincount = +field.getAttribute('data-mincount');
		count = (!isNaN(mincount)) ? mincount : 1;
	}
	
	function _setValidationFunc(){
		switch(validationType){
			case 'text':
				self.valdiationFunc = self.ValidateText;
				break;
			case 'number':
				self.valdiationFunc = self.ValidateNumber;
				break;
			case 'email':
				self.valdiationFunc = self.ValidateEmail;
				break;
			default:
				self.valdiationFunc = self.ValidateText;
				break;
		}
	}
	
	function _createErrorMessage(){
		var error, text;
		error = document.createElement('p');
		text = document.createTextNode('obj! Ej giltigt...');
		error.appendChild(text);
		AddClass(error, 'errorMessage');
		elem.parentNode.appendChild(error);
	}
	
	_setValidationCount();
	_setValidationType();
	_setValidationFunc();
	_createErrorMessage();
	
	Bind(field, 'blur', function(){
		self.Validate();
	});
}

Field.prototype.Validate = function(){
	this.setValue(this.getElem().value);
	if(this.valdiationFunc()){
		this.Valid();
	}
	else{
		this.Invalid();
	}
}

Field.prototype.Valid = function(){
	this.valid = true;
	RemoveClass(this.getElem(), 'invalid');
	AddClass(this.getElem(), 'valid');
	this.HideError(this.getElem());
}

Field.prototype.Invalid = function(){
	this.valid = false;
	RemoveClass(this.getElem(), 'valid');
	AddClass(this.getElem(), 'invalid');
	this.ShowError(this.getElem());
}

Field.prototype.HideError = function(elem){
	var error;
	error = elem.parentNode.getElementsByTagName('p')[0];
	error.style.display = 'none';
}

Field.prototype.ShowError = function(elem){
	var error;
	error = elem.parentNode.getElementsByTagName('p')[0];
	error.style.display = 'block';
}

Field.prototype.ValidateNumber = function(){
	var value, r;
	value = this.getValue().replace(/[\t\r\n\f\D\s]/g, '');
	r = (value.length == this.getCount()) ? true : false;
	if(r){
		this.setValue(value);
		this.setInputValue(value);
	}
	return r;
}

	//inte inte vanliga tecken, inga siffror som första	= minst en bokstav		x
	//en eller flera bokstäver, siffror, "_", ".", "-"	= en bokstav till		x+
	//förhindra "." innan "@"													x
	//@																			@
	//inte inte vanliga tecken, inga siffror som första	= minst en bokstav		x
	//en eller flera bokstäver, siffror, "_", ".", "-"	= en bokstav till		x+
	//en punkt																	.
	//topdomän 2-4 bokstäver													se/com/info/gov/co.uk
Field.prototype.ValidateEmail = function(){
	return (this.getValue().match(/^[^\W\d][\w\d_.-]+[^\.]@[^\d\._][\w\d_.-]+\.[a-z]{2,4}$/i) != null) ? true : false;
}

Field.prototype.ValidateText = function(){
	var value = this.getValue();
	value.replace(/[\t\r\n\f\d\s]/g, '');
	return (value.length >= this.getCount()) ? true : false;
}