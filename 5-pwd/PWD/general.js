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
		e = e ? e : window.event;
		if(e.stopPropagation){
			e.stopPropagation();
		}
		else{
			e.cancelBubble = true;
		}
	},

	PrevDef : function(e){
		e = e ? e : window.event;
		if(e.preventDefault){
			e.preventDefault();
		}
		else{
			e.returnValue = false;
		}
	},

	//Saxad och moddad från jQuery
	HasClass : function(elem, name){
		var className = ' ' + name + ' ';
	    if ((' ' + elem.className + ' ').replace(/[\t\r\n\f]/g, ' ').indexOf(className) > -1) {
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
	
	disableSelection:function(elem){
		elem.onselectstart = function(){return false;};
		elem.unselectable = 'on';
		elem.style.MozUserSelect = 'none';
		elem.style.cursor = 'default';
	},
	
	Ajax : function(o){
		var xhr, opt, r;
		opt = PWD.G.GetXHROptions(o);
		
		if(!opt.url){
			return false; 
		}
		
		xhr = PWD.G.GetXHR(opt);
		if(xhr === null){
			return false;
		}
		
		if(opt.c){
			xhr.onload = function(){
				if(opt.cb !== null){
					r = PWD.G.GetXHRResponse(xhr, opt);
					if(!opt.t !== true){
						opt.cb.call(opt.t, r);
					}
					else{
						opt.cb(r);
					}
				}
			};
			xhr.onerror = function(){
				if(opt.cb !== null){
					opt.cb(false);
				}
				else{
					return false;
				}
			};
		}
		else{
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
						if(opt.cb !== null){
							r = PWD.G.GetXHRResponse(xhr, opt);
							if(!opt.t !== true){
								opt.cb.call(opt.t, r);
							}
							else{
								opt.cb(r);
							}
						}
					}
				}
				else{
					if(opt.cb !== null){
						opt.cb(false);
					}
					else{
						return false;
					}
				}
			};
		}
		
		if(opt.m == 'post'){
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		xhr.send(opt.d);
	},
	
	GetXHROptions : function(o){
		var opt;
		opt = {
			m : (!o.m) ? 'get' : o.m,
			url : (!o.url) ? false : o.url,
			async : (!o.async) ? true : o.async,
			cb : (!o.cb) ? null : o.cb,
			t : (!o.t) ? this : o.t,
			f : (!o.f) ? 'json' : o.f,
			d : (!o.d) ? null : o.d,
			c : (!o.c) ? false : o.c
		};
		return opt;
	},
	
	GetXHR : function(opt){
		var xhr;
		if(opt.c === true){
			xhr = new XMLHttpRequest();
			if('withCredentials' in xhr){
				xhr.open(opt.m, opt.url, opt.async);
			}
			else if(typeof XDomainRequest != 'undefined'){
				xhr = new XDomainRequest();
				xhr.open(opt.m, opt.url);
			}
			else{
				xhr = null;
			}
		}
		else{
			if(window.XMLHttpRequest){
				xhr = new XMLHttpRequest();
				xhr.open(opt.m, opt.url, opt.async);
			}
			else if(typeof ActiveXObject != 'undefined'){
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
				xhr.open(opt.m, opt.url, opt.async);
			}
			else{
				xhr = null;
			}
		}
		return xhr;
	},
	
	GetXHRResponse : function(xhr, opt){
		var r;
		if(opt.f == 'json'){
			r = JSON.parse(xhr.responseText);
		}
		else if(opt.f == 'xml'){
			if(xhr.responseXML){
				r = xhr.responseXML;
			}
			else{
				if(window.DOMParser){
					r = new DOMParser();
					r = r.parseFromString(xhr.responseText, 'text/xml');
				}
				else{
					r = new ActiveXObject('Microsoft.XMLDOM');
					r.async = false;
					r.loadXML(xhr.responseText); 
				}
			}
		}
		else{
			r = xhr.responseText;
		}
		return r;
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
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		expires = 'expires=' + d.toGMTString();
		document.cookie = cname + '=' + cvalue + '; ' + expires;
	},

	GetCookie : function(cname){
		var name, ca, c, i;
		name = cname + '=';
		ca = document.cookie.split(';');
		for(i = 0; i < ca.length; i++){
			c = ca[i].trim();
			if(c.indexOf(name) == 0){
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}
};