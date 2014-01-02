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
		var xhr, opt, r, json, xml;
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
				f : (!o.f) ? 'json' : o.f,
				d : (!o.d) ? null : o.d
			};
			
			xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
						
						if(!o.cb !== true){
							if(o.f == 'json'){
								json = JSON.parse(xhr.responseText);
								if(!o.t !== true){
									o.cb.call(o.t, json);
								}
								else{
									o.cb(json);
								}
							}
							else if(o.f == 'xml'){
								if(xhr.responseXML){
									xml = xhr.responseXML;
								}
								else{
									if(window.DOMParser){
										xml = new DOMParser();
										xml = xml.parseFromString(xhr.responseText,"text/xml");
									}
									else{
										xml=new ActiveXObject("Microsoft.XMLDOM");
										xml.async=false;
										xml.loadXML(xhr.responseText); 
									}
								}
								
								if(!o.t !== true){
									o.cb.call(o.t, xml);
								}
								else{
									o.cb(xml);
								}
							}
							else{
								r = xhr.responseText;
								if(!o.t !== true){
									o.cb.call(o.t, r);
								}
								else{
									o.cb(r);
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
			if(xhr.withCredentials){
				xhr.withCredentials = true;
			}
			if(o.m == 'post'){
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}
			xhr.send(opt.d);
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
	},
	
	SetCookie : function(cname,cvalue,exdays){
		var d, expires;
		d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	},

	GetCookie : function(cname){
		var name, ca, c;
		name = cname + "=";
		ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			c = ca[i].trim();
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
	}
};