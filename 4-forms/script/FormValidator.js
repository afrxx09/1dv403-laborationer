function FormValidator(formid){
	var self, form, allFields, requiredFields;
	self = this;
	form = document.getElementById(formid);
	allFields = form.getElementsByTagName('input');
	
	function _initValidation(){
		Bind(form, 'submit', function(e){
			PrevDef(e);
		});
	}

	function _getRequiredFields(){
		requiredFields = [];
		for(i in allFields){
			if(HasClass(allFields[i], 'required')){
				requiredFields.push(new Field(allFields[i]));
			}
		}
	}
	
	this.getForm = function(){
		return form;
	}
	
	_initValidation();
	_getRequiredFields();
	
}

FormValidator.prototype.SubmitForm = function(){
	var form = this.getForm();
	form.submit();
}