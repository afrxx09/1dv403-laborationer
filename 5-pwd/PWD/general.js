"use strict";

PWD.G = {
	Bind : function(elem, t, f){
		if(elem.addEventListener){
			elem.addEventListener(t,f,false);
		}
		else if(elem.attachEvent){
			elem.attachEvent('on'+t,f);
		}
	},
	
	Unbind : function(elem, t, f){
		if(elem.removeEventListener){
			elem.removeEventListener(t,f,false);
		}
		else if(elem.detachEvent){
			elem.detachEvent('on'+t,f);
		}
	},

	StopProp : function(e){
		if(e.stopPropagation){
			e.stopPropagation();
		}
		else{
			e.cancelBubble = true;
		}
	},

	PrevDef : function(e){
		if(e.preventDefault){
			e.preventDefault();
		}
		else{
			e.returnValue = false;
		}
	},

	//Saxad och moddad från jQuery
	HasClass : function(elem, name){
		var className = " " + name + " ";
	    if ((" " + elem.className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(className) > -1) {
	        return true;
	    }
	    return false;
	},
	//Saxad och moddad från jQuery
	AddClass : function(elem, name){
		var classes;
		classes = elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n\f]/g, ' ') : ' ' ;
		if(classes.indexOf(name) < 0){
			classes += name + ' ';
		}
		elem.className = classes.trim();
	},
	//Saxad och moddad från jQuery
	RemoveClass : function(elem, name){
		var classes;
		classes = elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n\f]/g, ' ') : ' ' ;
		if(classes.indexOf(name) > -1){
			classes = classes.replace(' ' + name + ' ', ' ');
		}
		elem.className = classes.trim();
	},
	
	disableSelection:function(element){
		element.onselectstart = function() {return false;};
		element.unselectable = "on";
		element.style.MozUserSelect = "none";
		element.style.cursor = "default";
	},
	
	Ajax : function(o){
		var xhr, opt, r, json;
		if(!o.url){
			return false; 
		}
		else{
			opt = {
				m : (!o.m) ? 'get' : o.m,
				url : o.url,
				async : (!o.async) ? true : o.async,
				cb : (!o.cb) ? null : o.cb,
				t : (!o.t) ? this : o.t,
				f : (!o.f) ? 'json' : o.f
			};
			
			xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
						r = xhr.responseText;
						if(!o.cb !== true){
							if(o.f != 'json'){
								if(!o.t !== true){
									o.cb.call(o.t, r);
								}
								else{
									o.cb(r);
								}
							}
							else{
								json = JSON.parse(r);
								if(!o.t !== true){
									o.cb.call(o.t, json);
								}
								else{
									o.cb(json);
								}
							}
						}
					}
					else{
						if(!o.cb !== true){
							o.cb(false);
						}
					}
				}
			};
			xhr.open(opt.m, opt.url, opt.async);
			xhr.send(null);
		}
	},
	
	Obj : function(o){
		function F(){};
		F.prototype = o;
		return new F();
	},
	
	InheritPrototype : function(sub, sup){
		var prototype = PWD.G.Obj(sup.prototype);
		prototype.constructor = sub;
		sub.prototype = prototype;
	}
};