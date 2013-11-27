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

var myApp ={
	arrPrograms : new Array(),
	Init : function(){
		this.Bind();
	},
	
	Bind : function(){
		var self = this;
		var btnStart = document.getElementById('start-memory');
		Bind(btnStart, 'click', function(){
			self.StartNewMemory();
		});
		
		Bind(document.body, 'click', function(e){
			e = e || event;
			StopProp(e);
			
			var target, targetClass;
			target = e.target;
			targetClass = target.getAttribute('class');
			if(targetClass !== null){
				if(targetClass.indexOf('close') !== -1){
					var win = target.parentNode.parentNode;
					self.CloseWindow(win);
				}
			}
		});
	},
	
	StartNewMemory : function(){
		var x = +document.getElementById('val1').value;
		var y = +document.getElementById('val2').value;
		if(x * y > 16){
			alert('Går inte skapa ett spel med mer än 16 brickor.');
		}
		else if(x * y < 4){
			alert('Går inte skapa ett spel med mindre än 4 brickor.');
		}
		else if((x * y) % 2 !== 0){
			alert('Måste vara ett jämt antal brickor.');
		}
		else{
			var elem = this.CreateProgramWindow();
			this.arrPrograms.push(new Memory(elem, x, y));
		}
	},
	
	CreateProgramWindow : function(){
		var id = this.arrPrograms.length;
		var elem = document.createElement('div');
		elem.setAttribute('class', 'program');
		elem.setAttribute('id', 'memory-' + id);
		
		var header = document.createElement('div');
		header.setAttribute('class', 'header');
		var closeButton = document.createElement('span');
		closeButton.setAttribute('class', 'close');
		var headerText = document.createTextNode('Memory(' + id + ')');
		header.appendChild(closeButton);
		header.appendChild(headerText);
		
		var container = document.createElement('div');
		container.setAttribute('class', 'window');
		
		elem.appendChild(header);
		elem.appendChild(container);
		
		document.body.appendChild(elem);
		
		return container;
	},
	
	CloseWindow : function(win){
		var id = win.getAttribute('id').replace('memory-','')
		this.arrPrograms[id] = null;
		win.parentNode.removeChild(win);
	}
}

window.onload = function(){
	myApp.Init();
};