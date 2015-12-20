var fs = require('fs');

var csvFile = fs.readFileSync('friend_list.csv', 'utf8');
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

function csvParse (csvFile){
	// removes a newline at the end of the file
	if(csvFile.charCodeAt(csvFile.length-1)==10){
		csvFile = csvFile.slice(0,csvFile.length-1);
	}

	// each line of the csv file
	var lines = csvFile.split('\n');

	// first line is headers
	var headers = lines[0].split(',');
	
	// array of all items, each item still comma delimited
	var items = lines.slice(1);

	// constructor function
	var	createItem = function(keys, arr){
		for (var i = 0; i < keys.length; i++) {
			this[keys[i]]= arr[i];
		};
	}

	var itemArr = [];

	for (var i = 0; i < items.length; i++) {
		var item = items[i].split(',');
		itemArr.push(new createItem(headers, item));
	};
	
	return itemArr;
}


var parsedCSV = csvParse(csvFile);
// console.log(parsedCSV);

function personalizeEmail(parsedCSV, emailTemplate){
	emailArr = [];
	replaceThis = {'FIRST_NAME': 'firstName', 'NUM_MONTHS_SINCE_CONTACT': 'numMonthsSinceContact'};
	for (var i = 0; i < parsedCSV.length; i++) {
		var email = emailTemplate;
		for (var key in replaceThis) {
			// console.log(key);
			// console.log(parsedCSV[i][replaceThis[key]]);
			email = email.replace(key, parsedCSV[i][replaceThis[key]])
		};
		emailArr.push(email);
	};
	return emailArr;
}

allEmails = personalizeEmail(parsedCSV,emailTemplate);
// console.log(allEmails);