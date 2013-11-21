"use strict";

Array.prototype.max = function(){
	return Math.max.apply(null, this);
};
Array.prototype.min = function(){
	return Math.min.apply(null, this);
};

var makePerson = function(persArr){
	var arrAges, arrNames, minAge, maxAge, sumAge, averageAge, sortedNames; 
	
	arrAges = persArr.map(function(item){
		return item.age;
	});
	arrNames = persArr.map(function(item){
		return item.name;
	});
	
	minAge = arrAges.min();
	maxAge = arrAges.max();
	sumAge = arrAges.reduce(function(a, b){
		return a + b;
	});
	averageAge = Math.round(sumAge / arrAges.length);
	
	arrNames = arrNames.sort(function (a, b) {
		return a.localeCompare(b);
	});
	sortedNames = arrNames.join(', ');
	return {'minAge' : minAge, 'maxAge' : maxAge, 'averageAge' : averageAge, 'names' : sortedNames};
}

var data = [{name: "John Häggerud", age: 37}, {name: "Johan Leitet", age: 36}, {name: "Mats Loock", age: 46}, {name: "Kalle", age: 20}];

var result = makePerson(data);

console.log(result);

/*
"use strict";

var makePerson = function(persArr){
	var sumAge = 0;
	var minAge = persArr[0].age;
	var maxAge = persArr[0].age;
	var arrNames = new Array();
	for(var i = 0; i < persArr.length; i++){
		sumAge += persArr[i].age;
		maxAge = (persArr[i].age > maxAge) ? persArr[i].age : maxAge;
		minAge = (persArr[i].age < minAge) ? persArr[i].age : minAge;
		arrNames.push(persArr[i].name);
	}
	
	var averageAge = sumAge / persArr.length;
	//averageAge = (Math.round(averageAge) * 100) / 100;
	averageAge = Math.round(averageAge);
	arrNames = arrNames.sort(function (a, b) {
		return a.localeCompare(b);
	});
	var strNames = arrNames.join(', ');
	return{'minAge' : minAge, 'maxAge' : maxAge, 'averageAge' : averageAge, 'names' : strNames}
}

var data = [{name: "John Häggerud", age: 37}, {name: "Johan Leitet", age: 36}, {name: "Mats Loock", age: 46}];


var result = makePerson(data);

console.log(result);
*/