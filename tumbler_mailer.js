var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var mandrill = require('mandrill-api/mandrill');

// import contacts and e-mail template
var contactCSV = fs.readFileSync('friend_list.csv', 'utf8');
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

var mandrill_client = new mandrill.Mandrill('_99Rf7n-RD6L3jbdTdzSbQ');

var client = tumblr.createClient({
  consumer_key: 'mbFuHnO6dSTTb6B4vbBDKglevhcMwmdQa0oWXHieSANXy6jfe9',
  consumer_secret: '2ps1QFa5Flg0d5UiMa55IDzLe8LK6DvJdKYPTUpxDVPCM7zPwo',
  token: '2SPFT0Mi485YItmCobufANXOGgqNaVd3A3K9DDC0vkkyoTiLtR',
  token_secret: '681LL2Z284Ug2hFHO8sGXBftXDEUGkwbiptqtPcEgg56Cbh6Bd'
});

client.posts('emmabbishop.tumblr.com', function(err, blog){
	var contactList = csvParse(contactCSV);
	var today = stripTime(new Date());

	var latestPosts = [];
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	
	// get latest posts
	for (var i = 0; i < blog.posts.length; i++) {
		var postDate = stripTime(new Date(blog.posts[i].date));
		if ((today - postDate)/(24*60*60*1000) <= 7) {
			latestPosts.push(blog.posts[i]);
		};
	};

	// do nothing if there are no new posts to send
	if(latestPosts.length==0){
		console.log('no emails to send');
		return;
	}

	var dateString = monthNames[today.getMonth()] + ' ' + today.getDate();
	var emailSubject = 'Update for ' + dateString + ': this week at Grace Hopper Academy';

	// for each contact, add the latest posts property, render the e-mail and send the e-mail
	for (var i = 0; i<contactList.length; i++){
		contactPlus = addProperty(contactList[i], 'latestPosts', latestPosts);
		sendEmail(contactPlus.firstName, contactPlus.emailAddress, 'emma', 'emma.b.bishop@gmail.com', emailSubject, customizedEmail(contactPlus));
	}

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

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }