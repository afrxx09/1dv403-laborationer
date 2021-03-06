"use strict";

PWD.Memory = function(){
	var self, x, y, table;
	self = this;
	PWD.Win.call(this);
	
	this.type = 'Memory';
	this.resizeable = true;
	
	this.CreateWindow();
	this.AddTitleBarText('Memory');
	this.CreateTitleBarIcon('PWD/memory/memory16.png');
	this.AddStatusBarText('Loading Memory');
	this.ShowLoading();
	this.setSize(400, 500);
	
	this.memorysizes = [
		{r: 2, c:2},
		{r: 2, c:3},
		{r: 2, c:4},
		{r: 3, c:4},
		{r: 4, c:4}
	];
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
	this.CreateSettings();
};

PWD.G.InheritPrototype(PWD.Memory, PWD.Win);

PWD.Memory.prototype.RandomizeTiles = function(){
	var aRandom = PWD.Memory.RandomGenerator.getPictureArray(this.memoryrows, this.memorycols);
	for(var i = 0; i < aRandom.length; i++){
		this.tiles.push({value : aRandom[i], clickable : true, cleared : false});
	}
	this.score = this.tiles.length;
};

PWD.Memory.prototype.CreateMemory = function(){
	this.wrap	= document.createElement('div');
	PWD.G.AddClass(this.wrap, 'memory');
	this.table	= document.createElement('table');
	this.wrap.appendChild(this.table);
	this.windowcontent.appendChild(this.wrap);
	this.CreateScoreBoard();
	this.CreateGameOver();
};

PWD.Memory.prototype.CreateScoreBoard = function(){
	this.scoreboard = document.createElement('div');
	PWD.G.AddClass(this.scoreboard, 'score');
	this.wrap.appendChild(this.scoreboard);
	
	this.scoreboardguesses = document.createElement('div');
	PWD.G.AddClass(this.scoreboardguesses, 'guessescount');
	this.scoreboard.appendChild(this.scoreboardguesses);
	
	this.scoreboardpairs = document.createElement('div');
	PWD.G.AddClass(this.scoreboardpairs, 'guessescount');
	this.scoreboard.appendChild(this.scoreboardpairs);
	this.UpdateScoreBoard();
};

PWD.Memory.prototype.CreateGameOver = function(){
	var self = this;
	this.gameover = document.createElement('div');
	PWD.G.AddClass(this.gameover, 'gameover');
	PWD.G.AddClass(this.gameover, 'hidden');
	
	this.restartbutton = document.createElement('button');
	this.restartbutton.appendChild(document.createTextNode('Starta om'));
	PWD.G.AddClass(this.restartbutton, 'memoryrestart');
	PWD.G.AddClass(this.restartbutton, 'hidden');
	PWD.G.Bind(this.restartbutton, 'click', function(){
		self.RestartMemory();
	});
	
	this.wrap.appendChild(this.gameover);
	this.wrap.appendChild(this.restartbutton);
};

PWD.Memory.prototype.CreateMemoryTiles = function(){
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
		tileImg.setAttribute('src', 'PWD/memory/pics/0.png');
		tile.appendChild(tileImg);
		
		PWD.G.Bind(tile, 'click', function(e){
			PWD.G.StopProp(e);
			PWD.G.PrevDef(e);
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

PWD.Memory.prototype.CheckClick = function(target){
	var self, id, aTiles, firstTile, thisTile, clickedTile;
	self		= this;
	id			= target.getAttribute('data-id');
	aTiles		= this.tiles;
	if(this.clickCount < 2){
		clickedTile	= aTiles[id];
		if(clickedTile.clickable){
			this.clickCount += 1;
			clickedTile.clickable = false;
			clickedTile.elem.firstChild.setAttribute('src', 'PWD/memory/pics/' + clickedTile.value + '.png');
			
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
						clickedTile.elem.firstChild.setAttribute('src', 'PWD/memory/pics/0.png');
						firstTile.elem.firstChild.setAttribute('src', 'PWD/memory/pics/0.png');
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

PWD.Memory.prototype.ShowGameOver = function(){
	var self = this;
	this.gameover.innerHTML = 'Grattis! du klarade spelet på ' + this.guessCount + ' försök';
	PWD.G.RemoveClass(this.gameover, 'hidden');
	PWD.G.AddClass(this.gameover, 'visible');
	PWD.G.RemoveClass(this.restartbutton, 'hidden');
	PWD.G.AddClass(this.restartbutton, 'visible');
};

PWD.Memory.prototype.UpdateScoreBoard = function(){
	this.scoreboardguesses.innerHTML = 'Antal försök: ' + this.guessCount;
	this.scoreboardpairs.innerHTML = 'Antal par: ' + (((this.memoryrows * this.memorycols) - this.score) / 2) + '/' + ((this.memoryrows * this.memorycols) / 2);
};

PWD.Memory.prototype.RestartMemory = function(){
	this.StartGame();
};

PWD.Memory.prototype.CreateSettings = function(){
	var self, arr;
	self = this;
	arr = [
		{
			name : 'Starta om',
			cb : function(){self.RestartMemory();}
		},
		{
			name : 'Ändra storlek',
			cb : function(){self.ChangeMemorySize();}
		}
	];
	this.contextmenu.AddMenuGroup('Inställningar', arr);
};

PWD.Memory.prototype.ChangeMemorySize = function(){
	var i, self, select, options;
	self = this;
	for(i = 0; i < this.memorysizes.length; i++){
		options += '<option value="' + i + '">' + this.memorysizes[i].r + ' x ' + this.memorysizes[i].c + '</option>';
	}
	select = '<label for="selMemorySize" style="margin-right:10px;">Välj storlek</label><select id="selMemorySize">' + options +'</select>';
	PWD.dialogbody.innerHTML = select;
	PWD.ShowDialog();
	PWD.dialogcallback = function(){
		var val = document.getElementById('selMemorySize').value;
		self.SaveMemorySize(val);
	};
};

PWD.Memory.prototype.SaveMemorySize = function(v){
	this.memoryrows = this.memorysizes[v].r;
	this.memorycols = this.memorysizes[v].c;
	this.StartGame();
};

PWD.Memory.RandomGenerator = {
	
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