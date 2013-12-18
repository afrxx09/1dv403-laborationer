function FormValidator(formid){
	var self, form, allFields, requiredFields, confirm, cancel;
	self = this;
	form = document.getElementById(formid);
	allFields = form.getElementsByTagName('input');
	
	this.getForm = function(){
		return form;
	}
	
	this.getRequired = function(){
		return requiredFields;
	}
	
	function _initValidation(){
		Bind(form, 'submit', function(e){
			PrevDef(e);
			self.ValidateForm();
		});
	}

	function _createRequiredFields(){
		requiredFields = [];
		for(i in allFields){
			if(HasClass(allFields[i], 'required')){
				requiredFields.push(new Field(allFields[i]));
			}
		}
	}
	
	confirm = document.getElementById('confirm');
	Bind(confirm, 'click', function(){
		self.SubmitForm();
	});
	
	cancel = document.getElementById('cancel');
	Bind(cancel, 'click', function(){
		self.HideConfirm();
	});
	
	_initValidation();
	_createRequiredFields();
}

FormValidator.prototype.ValidateForm = function(){
	var req = this.getRequired();
	this.ValidateAllFields(req);
	if(this.CheckValidation(req)){
		this.ShowConfirm();
	}
}

FormValidator.prototype.ValidateAllFields = function(req){
	for(i in req){
		req[i].Validate();
	}
}

FormValidator.prototype.CheckValidation = function(req){
	for(i in req){
		if(!req[i].valid){
			return false;
		}
	}
	return true;
}

FormValidator.prototype.ShowConfirm = function(){
	var dialogbg = document.getElementById('dialog-bg');
	var dialog = document.getElementById('dialog');
	dialogbg.style.display = 'block';
	dialog.style.display = 'block';
}

FormValidator.prototype.HideConfirm = function(){
	var dialogbg = document.getElementById('dialog-bg');
	var dialog = document.getElementById('dialog');
	dialogbg.style.display = 'none';
	dialog.style.display = 'none';
}

FormValidator.prototype.SubmitForm = function(){
	var form = this.getForm();
	form.submit();
}