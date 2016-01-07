var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var contactCSV = fs.readFileSync('friend_list.csv', 'utf8');
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

var client = tumblr.createClient({
  consumer_key: 'mbFuHnO6dSTTb6B4vbBDKglevhcMwmdQa0oWXHieSANXy6jfe9',
  consumer_secret: '2ps1QFa5Flg0d5UiMa55IDzLe8LK6DvJdKYPTUpxDVPCM7zPwo',
  token: '2SPFT0Mi485YItmCobufANXOGgqNaVd3A3K9DDC0vkkyoTiLtR',
  token_secret: '681LL2Z284Ug2hFHO8sGXBftXDEUGkwbiptqtPcEgg56Cbh6Bd'
});

client.posts('emmabbishop.tumblr.com', function(err, blog){
	// console.log(blog.posts);
	var contactList = csvParse(contactCSV);
	var today = stripTime(new Date());
	var latestPosts = [];
	var emailArray = [];
	// get latest posts
	for (var i = 0; i < blog.posts.length; i++) {
		var postDate = stripTime(new Date(blog.posts[i].date));
		
		if ((today - postDate)/(24*60*60*1000) <= 30) {
			latestPosts.push(blog.posts[i]);
		};
	};


	for (var i = 0; i<contactList.length; i++){
		contactPlus = addProperty(contactList[i], 'latestPosts', latestPosts);
		emailArray.push(customizedEmail(contactPlus));
	}

	console.log(emailArray);
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


function customizedEmail(contact){
	// console.log(ejs.render(emailTemplate, contact));
	return ejs.render(emailTemplate, contact);
}


function stripTime(myDate){
	myDate.setHours(0);
	myDate.setMinutes(0);
	myDate.setSeconds(0);
	myDate.setMilliseconds(0);
	return myDate;
}

function addProperty(obj, propertyName, property){
	obj[propertyName] = property;
	return obj;
}