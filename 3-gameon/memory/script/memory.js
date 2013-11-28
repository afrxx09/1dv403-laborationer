function Memory(target, x, y){
	var self, _arrElems, _arrTiles, _score;
	self = this;
	_arrTiles	= [];
	_arrElems	= {};
	_score		= 0;
	this.clickCount	= 0;
	this.guessCount = 0;
	this.firstClickId;
	
	this.getScore = function(){
		return _score;
	};
	this.setScore = function(score){
		_score = score;
	};
	
	this.getTiles = function(){
		return _arrTiles;
	};
	this.setTiles = function(arrTiles){
		_arrTiles = arrTiles;
	};
	
	this.getElements = function(){
		return _arrElems;
	};
	this.setElements = function(arrElements){
		_arrElems = arrElements;
	};
	function _randomizeTiles(){
		var aRandom = RandomGenerator.getPictureArray(x, y);
		for(var i = 0; i < aRandom.length; i++){
			_arrTiles.push({value : aRandom[i], clickable : true, cleared : false});
		}
		_score = _arrTiles.length;
	};
	
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
		var fragment, row, tile, tileImg, i;
		fragment = document.createDocumentFragment();
		for(i = 0; i < _arrTiles.length; i++){
			if(i % y === 0){
				row = document.createElement('div');
				row.setAttribute('class', 'row');
			}
			tile = document.createElement('a');
			tile.setAttribute('class', 'tile');
			tile.setAttribute('href', '#');
			tile.setAttribute('data-id', i);
			tileImg = document.createElement('img');
			tileImg.setAttribute('src', 'pics/0.png');
			tile.appendChild(tileImg);
			
			Bind(tile, 'click', function(e){
				self.CheckClick(this);
			});
			
			row.appendChild(tile);
			fragment.appendChild(row);
			
			_arrTiles[i].elem = tile;
		}
		_arrElems.field.appendChild(fragment);
	}
	/*
	function _binds(){
		Bind(_arrElems.field, 'click', function(e){
			PrevDef(e);
			if(e.target.getAttribute('class') === 'tile'){
				StopProp(e);
				self.CheckClick(e.target);
			}
		});
	}
	*/
	_randomizeTiles();
	_createDom();
	_createTiles();
	//_binds();
}

Memory.prototype.CheckClick = function(target){
	var self, id, aTiles, firstTile, thisTile;
	self		= this;
	id			= target.getAttribute('data-id');
	aTiles		= this.getTiles();
	if(this.clickCount < 2){
		clickedTile	= aTiles[id];
		if(clickedTile.clickable){
			this.clickCount += 1;
			clickedTile.clickable = false;
			clickedTile.elem.firstChild.setAttribute('src', 'pics/' + clickedTile.value + '.png');
			
			if(this.clickCount === 1){
				this.firstClickId = id;
			}
			else{
				this.guessCount += 1;
				firstTile = aTiles[this.firstClickId];
				if(clickedTile.value !== firstTile.value){
					setTimeout(function(){
						clickedTile.clickable = true;
						firstTile.clickable = true;
						clickedTile.elem.firstChild.setAttribute('src', 'pics/0.png');
						firstTile.elem.firstChild.setAttribute('src', 'pics/0.png');
						self.clickCount = 0;
					}, 1000);
				}
				else{
					clickedTile.cleared = true;
					firstTile.cleared = true;
					this.clickCount = 0;
					this.setScore(this.getScore() - 2);
					if(this.getScore() === 0){
						alert('Grattis! du klarade spelet på ' + this.guessCount + ' försök');
					}
				}
			}
		}
	}
};