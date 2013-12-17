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

//Saxad och moddad från jQuery
function HasClass(elem, name){
	var className = " " + name + " ";
    if ((" " + elem.className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(className) > -1) {
        return true;
    }
    return false;
}
//Saxad och moddad från jQuery
function AddClass(elem, name){
	var classes;
	classes = elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n\f]/g, ' ') : ' ' ;
	if(classes.indexOf(name) < 0){
		classes += name + ' ';
	}
	elem.className = classes.trim();
}
//Saxad och moddad från jQuery
function RemoveClass(elem, name){
	var classes;
	classes = elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n\f]/g, ' ') : ' ' ;
	if(classes.indexOf(name) > -1){
		classes = classes.replace(' ' + name + ' ', ' ');
	}
	elem.className = classes.trim();
}

var myApp = {
	arrValidators : [],
	
	Init : function(){
		this.Bind();
	},
	
	Bind : function(){
		var self = this;
	},
	
	AddValidation : function(strId){
		var validator = new FormValidator(strId);
		this.arrValidators.push(validator);
	}
};

window.onload = function(){
	myApp.Init();
	myApp.AddValidation('da-form');
	
};