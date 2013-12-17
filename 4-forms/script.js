"use strict";

function Bind(elem, t, f){
	if(elem.addEventListener){
		elem.addEventListener(t,f,false);
	}
	else if(elem.attachEvent){
		elem.attachEvent('on'+t,f);
	}
}

function StopProp(e){
	if(e.stopPropagation){
		e.stopPropagation();
	}
	else{
		e.cancelBubble = true;
	}
}

function PrevDef(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	else{
		e.returnValue = false;
	}
}

var myApp = {
	arrForms = [],
	
	Init : function(){
		this.Bind();
	},
	
	Bind : function(){
		var self = this;
	},
	
	AddValidation : function(strId){
		//var form = new FormValidator();
		this.arrForms.push(form);
	}
};

window.onload = function(){
	myApp.Init();
	myApp.AddValidation('da-form');
};