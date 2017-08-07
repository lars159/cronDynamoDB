"use strict";
const AWS = require('aws-sdk');

module.exports = class TableSettingsService   {
     
       constructor(){
        this.dynamodb = new AWS.DynamoDB(
            {
                accessKeyId : "AKIAJRD3L23232GSH2IA", 
                secretAccessKey : "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",
                region : "eu-west-1"    
                
            });
 
    }
    
    read (userId, tableName, callback) {
          var params = {
            Key: {
                userId : {S : userId} ,
                tableName : {S : tableName}
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "TableSettings"
        };
        
        this.dynamodb.getItem(params,  (err, data) => { 
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data); // successful response
                callback(data);
            }

        });


    }

    write (userId, tableName, readValue, writeValue, callback) {
          var params = {
            Item: {
                userId : {S : userId},
                tableName  : {S : tableName},
                readValue   : {S : readValue},
                writeValue   : {S : writeValue},
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "TableSettings"
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
