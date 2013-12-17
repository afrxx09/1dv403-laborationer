function Field(elem){
	var self, field, validationType, value, count;
	self = this;
	field = elem;
	count = 0;
	
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
		field.value = value;
	};
	
	function _setValidationType(){
		validationType = field.getAttribute('data-fieldtype');
		if(validationType === null){
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
	
	_setValidationCount();
	_setValidationType();
	_setValidationFunc();
	
	Bind(field, 'blur', function(){
		value = field.value;
		self.Validate();
	});
}

Field.prototype.Validate = function(){
	if(this.valdiationFunc()){
		this.Valid();
	}
	else{
		this.Invalid();
	}
}

Field.prototype.Valid = function(){
	var elem = this.getElem();
	this.valid = true;
	RemoveClass(elem, 'invalid');
	AddClass(elem, 'valid');
	this.HideMessage(elem);
}

Field.prototype.Invalid = function(){
	var elem = this.getElem();
	this.valid = false;
	RemoveClass(elem, 'valid');
	AddClass(elem, 'invalid');
	this.ShowMessage(elem);
}

Field.prototype.HideMessage = function(elem){
	
}

Field.prototype.ShowMessage = function(elem){
	
}

Field.prototype.ValidateNumber = function(){
	var value = this.getValue();
	value.replace(/[\t\r\n\f\D\s]/g, '');
	return (value.length >= this.getCount()) ? true : false;
}

Field.prototype.ValidateEmail = function(){
	var valid = false;
	return valid;
}

Field.prototype.ValidateText = function(){
	var value = this.getValue();
	value.replace(/[\t\r\n\f\d\s]/g, '');
	return (value.length >= this.getCount()) ? true : false;
}