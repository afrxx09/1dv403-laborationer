function Memory(target, x, y){
	var self, _arrElems, _arrTiles;
	this.clickCount	= 0;
	this.guessCount = 0;
	this.firstClickId;
	self = this;
	_arrTiles		= [];
	
	this.getTiles = function(){
		return _arrTiles;
	}
	this.setTiles = function(arrTiles){
		_arrTiles = arrTiles;
	}
	
	this.getElements = function(){
		return _arrElems;
	}
	this.setElements = function(arrElements){
		_arrElems = arrElements;
	}
	function _randomze(){
		var aRandom = RandomGenerator.getPictureArray(x, y);
		for(var i = 0; i < aRandom.length; i++){
			_arrTiles.push({value : aRandom[i], clickable : true, cleared : false});
		}
	}
	
	function _createDom(){
		var eWrap	= document.createElement('div');
		var eField	= document.createElement('div');
		var eClear	= document.createElement('div');
		var eHeader	= document.createElement('h1');
		var tHeader	= document.createTextNode('Memory');
		
		eHeader.appendChild(tHeader);
		
		eWrap.appendChild(eHeader);
		eWrap.appendChild(eField);
		eWrap.appendChild(eClear);
		target.appendChild(eWrap);
		var o = {
			field : eField
		}
		_arrElems = o;
	}
	
	function _createTiles(){
		var fragment, row, tile, i;
		fragment = document.createDocumentFragment();
		for(i = 0; i < _arrTiles.length; i++){
			if(i % y === 0){
				row = document.createElement('div');
				row.setAttribute('class', 'row');
			}
			tile = document.createElement('img');
			tile.setAttribute('src', 'pics/0.png');
			tile.setAttribute('data-id', i);
			tile.setAttribute('class', 'tile');
			row.appendChild(tile);
			fragment.appendChild(row);
			
			_arrTiles[i].elem = tile;
		}
		_arrElems.field.appendChild(fragment);
	}
	
	function _binds(){
		Bind(_arrElems.field, 'click', function(e){
			StopProp(0);
			PrevDef(0);
			if(e.target.getAttribute('class') === 'tile'){
				self.CheckClick(e.target);
			}
		});
	}
	
	_randomze();
	_createDom();
	_createTiles();
	_binds();
	
	console.log(_arrTiles);
}

Memory.prototype.CheckClick = function(target){
	var id = target.getAttribute('data-id');
	var aTiles = this.getTiles();
	if(aTiles[id].clickable && this.clickCount !== 2){
		this.clickCount += 1;
		aTiles[id].clickable = false;
		aTiles[id].elem.setAttribute('src', 'pics/' + aTiles[id].value + '.png');
		
		if(this.clickCount === 1){
			this.firstClickId = id;
		}
		else{
			this.guessCount += 1;
			
			if(aTiles[id].value !== aTiles[this.firstClickId].value){
				var self = this;
				setTimeout(function(){
					aTiles[id].clickable = true;
					aTiles[self.firstClickId].clickable = true;
					aTiles[id].elem.setAttribute('src', 'pics/0.png');
					aTiles[self.firstClickId].elem.setAttribute('src', 'pics/0.png');
				}, 1000);
			}
			else{
				aTiles[id].cleared = true;
				aTiles[this.firstClickId].cleared = true;
			}
			this.clickCount = 0;
		}
	}
	/*
	if(this.clickCount === 0){
		this.firstTile = [e.target, aTiles[id]];
		this.clickCount += 1;
		
		this.firstTile[0].setAttribute('src', 'pics/' + this.firstTile[1] + '.png');
	}
	else{
		this.secondTile = [e.target, aTiles[id]];
		this.clickCount = 0;
		
		this.secondTile[0].setAttribute('src', 'pics/' + this.secondTile[1] + '.png');
		
		if(this.firstTile[1] === this.secondTile[1]){
			console.log('par');
		}
		else{
			var self = this;
			self.clickable = false;
			setTimeout(function(){
				self.clickable = true;
				self.firstTile[0].setAttribute('src', 'pics/0.png');
				self.secondTile[0].setAttribute('src', 'pics/0.png');
			}, 1000);
		}
		
	}
	*/
};