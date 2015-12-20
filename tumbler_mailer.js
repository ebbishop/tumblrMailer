var fs = require('fs');

var csvFile = fs.readFileSync('friend_list.csv', 'utf8');

function csvParse (csvFile){
	if(csvFile[csvFile.length]=='\n'){
		csvFile = csvFile.slice(0,csvFile.length-1);
	}
	var lines = csvFile.split('\n');

	var headers = lines[0].split(',');
	var items = lines.slice(1);

	var	createItem = function(keys, arr){
		for (var i = 0; i < keys.length; i++) {
			this[keys[i]]= arr[i];
		};
	}

	var itemArr = [];

	for (var i = 0; i < items.length; i++) {
		var item = items[i].split(',');
		if(item.length>0){
			console.log(typeof item);
			itemArr.push(new createItem(headers, item));
		}
	};
	
	return itemArr
}


console.log(csvParse(csvFile));
