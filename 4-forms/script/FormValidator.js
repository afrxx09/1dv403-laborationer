"use strict";

function FormValidator(formid){
	var self, form, allFields, requiredFields, confirm, cancel;
	self = this;
	form = document.getElementById(formid);
	allFields = [];
	
	this.getForm = function(){
		return form;
	}
	
	this.getRequired = function(){
		return requiredFields;
	}

	this.getAllFields = function(){
		return allFields;
	}
	
	
	function _addInputs(){
		var i, inputs = form.getElementsByTagName('input');
		for(i = 0; i < inputs.length; i++){
			if(inputs[i].getAttribute('type') != 'submit'){
				allFields.push(inputs[i]);
			}
		}
	}

	function _addSelects(){
		var i, selects = form.getElementsByTagName('select');
		for(i = 0; i < selects.length; i++){
			allFields.push(selects[i]);
		}
	}

	function _addTextareas(){
		var i, textareas = form.getElementsByTagName('textarea');
		for(i = 0; i < textareas.length; i++){
			allFields.push(textareas[i]);
		}
	}

	function _addAllFields(){
		_addInputs();
		_addSelects();
		_addTextareas();
	}

	function _initValidation(){
		Bind(form, 'submit', function(e){
			PrevDef(e);
			self.ValidateForm();
		});
	}

	function _createRequiredFields(){
		var i;
		requiredFields = [];
		for(i = 0; i < allFields.length; i++){
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
	_addAllFields()
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
	var i;
	for(i in req){
		req[i].Validate();
	}
}

FormValidator.prototype.CheckValidation = function(req){
	var i;
	for(i in req){
		if(!req[i].valid){
			return false;
		}
	}
	return true;
}

FormValidator.prototype.ShowConfirm = function(){
	this.GetDialogContent(this.getAllFields());
	var dialogbg = document.getElementById('dialog-bg');
	var dialog = document.getElementById('dialog');
	RemoveClass(dialogbg, 'hidden');
	AddClass(dialogbg, 'show');
	RemoveClass(dialog, 'hidden');
	AddClass(dialog, 'show');
}

FormValidator.prototype.HideConfirm = function(){
	var dialogbg = document.getElementById('dialog-bg');
	var dialog = document.getElementById('dialog');
	RemoveClass(dialogbg, 'show');
	AddClass(dialogbg, 'hidden');
	RemoveClass(dialog, 'show');
	AddClass(dialog, 'hidden');
}

FormValidator.prototype.GetDialogContent = function(allFields){
	var i, c, t;
	for(i = 0; i < allFields.length; i++){
		c = document.getElementById('confirm-' + allFields[i].getAttribute('id'));
		t = this.GetValue(allFields[i]);
		c.innerHTML = '';
		c.appendChild(t);
	}
}

FormValidator.prototype.GetValue = function(f){
	var t;
	t = (f.nodeName == 'SELECT') ? f.getElementsByTagName('option')[f.value].innerHTML : f.value;
	return document.createTextNode(t);
}

FormValidator.prototype.SubmitForm = function(){
	var form = this.getForm();
	form.submit();
}