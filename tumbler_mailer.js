var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync('friend_list.csv', 'utf8');
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

var client = tumblr.createClient({
  consumer_key: 'mbFuHnO6dSTTb6B4vbBDKglevhcMwmdQa0oWXHieSANXy6jfe9',
  consumer_secret: '2ps1QFa5Flg0d5UiMa55IDzLe8LK6DvJdKYPTUpxDVPCM7zPwo',
  token: '2SPFT0Mi485YItmCobufANXOGgqNaVd3A3K9DDC0vkkyoTiLtR',
  token_secret: '681LL2Z284Ug2hFHO8sGXBftXDEUGkwbiptqtPcEgg56Cbh6Bd'
});

client.posts('emmabbishop.tumblr.com', function(err, blog){
  // console.log(blog);
})


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


var customizedTemplate = function(contact){
	console.log(ejs.render(emailTemplate, contact));
	return ejs.render(emailTemplate, contact);
}

for (var i = 0; i<parsedCSV.length; i++){
	customizedTemplate(parsedCSV[i]);
}