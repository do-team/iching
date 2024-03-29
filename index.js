'use strict';
var Alexa = require('alexa-sdk');
var appId = process.env.APPID; // Set as environmental variable in Lambda itself.

exports.handler = function(event, context, callback) {
    console.log(event);
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.appId = appId;
    alexa.dynamoDBTableName = 'ichingusers'; // This is actual table for storing states of users. Primary key is UserId.
    alexa.execute();
};

var handlers = {
    "AMAZON.StopIntent": function() {
        var message = this.attributes['name']; // This reads from DynamoDB value in column 'name'.
        this.emit(':tell', "Stop. Goodbye! " + message);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(':tell', "Cancel. Goodbye!");
    },
    'SessionEndedRequest': function() {
        this.emit(":tell", "Session ended. Goodbye!");
    },
    'iching': function() {
        this.attributes['name'] = 'test'; // This saves to DynamoDB a value 'Dave' to column 'name'.
        this.attributes['timestamp'] = event.request.timestamp; // This save actual timestamp to DynamoDB.
        var isin = 'DE0008404005';
        this.emit(':tell', 'Iching listens to you! ' + isin);
    },
    'wait': function() {
        this.emit(':ask', 'What would you like to know? Ask me!');
    },
    'Unhandled': function() {
        this.emit(':tell', 'Unhandled!');
    }
};