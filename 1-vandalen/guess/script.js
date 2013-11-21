"use strict";
/*
function Bind(elem, t, f){
	if(elem.addEventListener){
		elem.addEventListener(t,f,false);
	}
	else if(elem.attachEvent){
		elem.attachEvent('on'+t,f);
	}
}

var guessNumber = {
	intMaxNumber : 0,
	intGuesses	: 0,
	intSercretNumber : 0,
	
	Init : function(intMax){
		this.intMaxNumber = (typeof intMax === 'number') ? intMax : 100;
		document.getElementById('max-number').innerHTML = this.intMaxNumber;
		
		this.intSecretNumber = this.GetRandomNumber(this.intMaxNumber);
		var btnGuess = document.getElementById('send');
		
		//self används för att behålla this i funktioner som triggas av event
		var self = this;
		//Binder en anonym funktion som "callar" på MakeGuess med self(this aka "guessNumber"). Gör att this refererar till guessNumber-objektet istället för gissa-knappen.
		Bind(btnGuess, 'click', function(e){
			self.MakeGuess.call(self, e);
		});
	},
	
	GetRandomNumber : function(intMax){
		return Math.floor((Math.random() * intMax) + 1);
	},
	
	MakeGuess : function(e){
		e.preventDefault();
		var txtMessage = document.getElementById('value');
		var numGuess = +document.getElementById('number').value;
		if(isNaN(numGuess)){
			txtMessage.innerHTML = 'Ingen giltig gissning. Använd endast siffror.';
		}
		else if(numGuess > this.intMaxNumber || numGuess < 1){
			txtMessage.innerHTML = 'Ingen giltig gissning. Talet är mellan 1 och ' + this.intMaxNumber + '.';
		}
		else if(numGuess % 1 !== 0){
			txtMessage.innerHTML = numGuess + ' Är inte ett heltal';
		}
		else{
			this.intGuesses += 1;
			var arrResult = this.CheckGuess(numGuess);
			txtMessage.innerHTML = arrResult[1];
			if(arrResult[0] === true){
				var btnGuess = document.getElementById('send');
				btnGuess.disabled = true;
			}
		}
	},
	
	CheckGuess : function(numGuess){
		if(numGuess === this.intSecretNumber){
			return [true, 'Grattis du vann! Det hemliga talet var ' + this.intSecretNumber + ' och du behövde ' + this.intGuesses + ' gissningar för att hitta det.'];
		}
		else if(numGuess > this.intSecretNumber){
			return [false,  'Talet är mindre'];
		}
		else if(numGuess < this.intSecretNumber){
			return [false, 'Talet är större'];
		}
		else{
			return [false, 'Error'];
		}
	}
}

window.onload = function(){
	guessNumber.Init(100);
};

*/
window.onload = function(){
	
	//var secret = 50; // Detta tal behöver bytas ut mot ett slumpat tal.
	var max = 100;
	var min = 1;
	var secret = Math.floor((Math.random()*max) + 1);
	var count = 0;
	
	// I denna funktion ska du skriva koden för att hantera "spelet"
	var guess = function(number){
		console.log("Det hemliga talet: " + secret); // Du når den yttre variabeln secret innifrån funktionen.
		console.log("Du gissade: " + number); // Detta nummer är det som användaren gissade på.
			
		if(isNaN(number)){
			return [false, 'Ingen giltig gissning. Använd endast siffror.'];
		}
		else if(number > max || number < min){
			return [false, 'Ingen giltig gissning. Talet är mellan ' + min + ' och ' + max + '.'];
		}
		else if(number % 1 !== 0){
			return[false, number + ' Är inte ett heltal'];
		}
		else{
			count += 1;
			if(number === secret){
				return [true, 'Grattis du vann! Det hemliga talet var ' + this.intSecretNumber + ' och du behövde ' + this.intGuesses + ' gissningar för att hitta det.'];
			}
			else if(number > secret){
				return [false,  'Talet är mindre'];
			}
			else if(number < secret){
				return [false, 'Talet är större'];
			}
			else{
				return [false, 'Något har gått tokigt'];
			}
		}


		// Returnera exempelvis: 
		// [true, "Grattis du vann! Det hemliga talet var X och du behövde Y gissningar för att hitta det."]
		// [false, "Det hemliga talet är högre!"]
		// [false, "Det hemliga talet är lägre!"]
		// [false, "Talet är utanför intervallet 0 - 100"]		
	};
	
	// ------------------------------------------------------------------------------



	// Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
	var p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
	var input = document.querySelector("#number");
	var submit = document.querySelector("#send");

	// Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
	submit.addEventListener("click", function(e){
		e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

		var answer = guess(input.value) // Läser in talet från textrutan och skickar till funktionen "guess"
		p.innerHTML = answer[1];		// Skriver ut texten från arrayen som skapats i funktionen.	

		if(answer[0] === true){				// Om spelet är slut, avaktivera knappen.
			submit.disabled = true;
		}
	
	});
};
