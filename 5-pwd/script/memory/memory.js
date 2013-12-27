"use strict";

function Memory(id){
	var self, x, y, table, memoryrows, memorycols;
	self = this;
	Win.call(this);
	
	this.id = id;
	this.type = 'memory';
	this.resizeable = true;
	this.CreateWindow();
	this.AddTitleBarText('Memory');
	this.CreateTitleBarIcon('images/memory16.png');
	this.AddStatusBarText('Loading Memory');
	this.ShowLoading();
	this.setSize(400, 500);
	
	this.memoryrows = 4;
	this.memorycols = 4;
	this.StartGame = function(){
		this.score = 0;
		this.clickCount	= 0;
		this.guessCount = 0;
		this.firstClickId;
		
		this.wrap = null;
		this.table = null;
		this.tiles = [];
		this.scoreboard = null;
		this.scoreboardguesses = null;
		this.scoreboardpairs = null;
		this.gameover = null;
		this.restartbutton = null;
		
		this.windowcontent.innerHTML = '';
		this.RandomizeTiles();
		this.CreateMemory();
		this.CreateMemoryTiles();
		this.HideLoading();
		this.AddStatusBarText(this.memoryrows + 'x' + this.memorycols + 'Memory');
	}
	this.StartGame();
}

Memory.prototype = new Win();

Memory.prototype.RandomizeTiles = function(){
	var aRandom = RandomGenerator.getPictureArray(this.memoryrows, this.memorycols);
	for(var i = 0; i < aRandom.length; i++){
		this.tiles.push({value : aRandom[i], clickable : true, cleared : false});
	}
	this.score = this.tiles.length;
};

Memory.prototype.CreateMemory = function(){
	this.wrap	= document.createElement('div');
	GEN.AddClass(this.wrap, 'memory');
	this.table	= document.createElement('table');
	this.wrap.appendChild(this.table);
	this.windowcontent.appendChild(this.wrap);
	this.CreateScoreBoard();
	this.CreateGameOver();
};

Memory.prototype.CreateScoreBoard = function(){
	this.scoreboard = document.createElement('div');
	GEN.AddClass(this.scoreboard, 'score');
	this.wrap.appendChild(this.scoreboard);
	
	this.scoreboardguesses = document.createElement('div');
	GEN.AddClass(this.scoreboardguesses, 'guessescount');
	this.scoreboard.appendChild(this.scoreboardguesses);
	
	this.scoreboardpairs = document.createElement('div');
	GEN.AddClass(this.scoreboardpairs, 'guessescount');
	this.scoreboard.appendChild(this.scoreboardpairs);
	this.UpdateScoreBoard();
};

Memory.prototype.CreateGameOver = function(){
	var self = this;
	this.gameover = document.createElement('div');
	GEN.AddClass(this.gameover, 'gameover');
	GEN.AddClass(this.gameover, 'hidden');
	
	this.restartbutton = document.createElement('button');
	this.restartbutton.appendChild(document.createTextNode('Starta om'));
	GEN.AddClass(this.restartbutton, 'memoryrestart');
	GEN.AddClass(this.restartbutton, 'hidden');
	GEN.Bind(this.restartbutton, 'click', function(){
		self.RestartMemory();
	});
	
	this.wrap.appendChild(this.gameover);
	this.wrap.appendChild(this.restartbutton);
};

Memory.prototype.CreateMemoryTiles = function(){
	var i, self, fragment, row, col, tile, tileImg;
	self = this;
	fragment = document.createDocumentFragment();
	for(i = 0; i < this.tiles.length; i++){
		if(i % this.memorycols === 0){
			row = document.createElement('tr');
		}
		col = document.createElement('td');
		tile = document.createElement('a');
		tile.setAttribute('class', 'tile');
		tile.setAttribute('href', '#');
		tile.setAttribute('data-id', i);
		tileImg = document.createElement('img');
		tileImg.setAttribute('src', 'script/memory/pics/0.png');
		tile.appendChild(tileImg);
		
		GEN.Bind(tile, 'click', function(e){
			GEN.StopProp(e);
			GEN.PrevDef(e);
			self.CheckClick(this);
		});
		
		col.appendChild(tile);
		row.appendChild(col);
		fragment.appendChild(row);
		
		this.tiles[i].elem = tile;
	}
	this.table.innerHTML = '';
	this.table.appendChild(fragment);
};

Memory.prototype.CheckClick = function(target){
	var self, id, aTiles, firstTile, thisTile;
	self		= this;
	id			= target.getAttribute('data-id');
	aTiles		= this.tiles;
	if(this.clickCount < 2){
		clickedTile	= aTiles[id];
		if(clickedTile.clickable){
			this.clickCount += 1;
			clickedTile.clickable = false;
			clickedTile.elem.firstChild.setAttribute('src', 'script/memory/pics/' + clickedTile.value + '.png');
			
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
						clickedTile.elem.firstChild.setAttribute('src', 'script/memory/pics/0.png');
						firstTile.elem.firstChild.setAttribute('src', 'script/memory/pics/0.png');
						self.clickCount = 0;
					}, 1000);
				}
				else{
					clickedTile.cleared = true;
					firstTile.cleared = true;
					this.clickCount = 0;
					this.score = this.score - 2;
					if(this.score === 0){
						this.ShowGameOver();
					}
				}
			}
			this.UpdateScoreBoard();
		}
	}
};

Memory.prototype.ShowGameOver = function(){
	var self = this;
	this.gameover.innerHTML = 'Grattis! du klarade spelet på ' + this.guessCount + ' försök';
	GEN.RemoveClass(this.gameover, 'hidden');
	GEN.AddClass(this.gameover, 'visible');
	GEN.RemoveClass(this.restartbutton, 'hidden');
	GEN.AddClass(this.restartbutton, 'visible');
};

Memory.prototype.UpdateScoreBoard = function(){
	this.scoreboardguesses.innerHTML = 'Antal försök: ' + this.guessCount;
	this.scoreboardpairs.innerHTML = 'Antal par: ' + (((this.memoryrows * this.memorycols) - this.score) / 2) + '/' + ((this.memoryrows * this.memorycols) / 2);
};

Memory.prototype.RestartMemory = function(){
	this.StartGame();
};

var RandomGenerator = {
	
	/*
		Denna metod tar antalet rader och columner som inparameter.
		
		Metoden returnerar en array innehållandes utslumpade tal mellan 1 och (rows*cols)/2. Varje tal representeras två
		gånger och motsvarar således en spelbricka. 
		
		I en 4*4 matris kan Arrayen t.ex. se ut så här:
		[1,2,6,8,6,2,5,3,1,3,7,5,8,4,4,7]
		
		I en 2*4 matris kan Arrayen t.ex. se ut så här:				
		[3,4,4,1,2,1,2,3]
	*/
	
	getPictureArray: function(rows, cols)
	{
		var numberOfImages = rows*cols;
		var maxImageNumber = numberOfImages/2;
	
	   	var imgPlace = [];
	
	   //Utplacering av bilder i Array
	   for(var i=0; i<numberOfImages; i++)
		  imgPlace[i] = 0;
	
		for(var currentImageNumber=1; currentImageNumber<=maxImageNumber; currentImageNumber++)
		{		
			var imageOneOK = false;
			var imageTwoOK = false;
			
			do
			{
				if(imageOneOK == false)
				{
					var randomOne = Math.floor( (Math.random() * (rows*cols-0) + 0) );				
					
					if( imgPlace[randomOne] == 0 )
					{
						imgPlace[randomOne] = currentImageNumber;
						imageOneOK = true;
					}
				}
				
				if(imageTwoOK == false)
				{
					var randomTwo = Math.floor( (Math.random() * (rows*cols-0) + 0) );				
								
					if( imgPlace[randomTwo] == 0 )
					{
						imgPlace[randomTwo] = currentImageNumber;
						imageTwoOK = true;
					}
				}			
			}
			while(imageOneOK == false || imageTwoOK == false);		
		}
		
		return imgPlace;
	}
}