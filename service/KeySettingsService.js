"use strict";
const AWS = require('aws-sdk');

module.exports = class KeySettingsService   {
     
       constructor(){
        this.dynamodb = new AWS.DynamoDB(
            {
                accessKeyId : "AKIAJRD3L23232GSH2IA", 
                secretAccessKey : "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",
                region : "eu-west-1"  
            });
 
    }
    
    read (userId, callback) {
        var params = {
            Key: {
                userId : {S : userId} 
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "UserKeys"
        };
        
        this.dynamodb.getItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data); // successful response
                callback(data.Item);
            }

        });


    }

    write (userId, aKey, sKey, callback) {
        var params = {
            Item: {
                userId : {S : userId},
                aKey  : {S : aKey},
                sKey   : {S : sKey} 
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "UserKeys"
        };

        this.dynamodb.putItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data);
                callback();
            }

        });
    }
}
