"use strict";
const AWS = require('aws-sdk');

module.exports = class UserSupplyService {


    constructor(aKey, sKey) {
        this.dynamodb = new AWS.DynamoDB({
            accessKeyId: aKey,
            secretAccessKey: sKey,
            region: "eu-west-1"

        });

    }

    getAllTables(callback) {

        var params = {};
        this.dynamodb.listTables(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data); // successful response
                callback(data.TableNames);
            }
        });

    }

    read(tableName, callback) {
        let params = {
            TableName: tableName 
        }

        this.dynamodb.describeTable(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data); // successful response
                return callback({
                    read: data.Table.ProvisionedThroughput.ReadCapacityUnits,
                    write: data.Table.ProvisionedThroughput.WriteCapacityUnits
                });
            }
        });
    }


    write(table, read, write, callback) {
        let dynamoDbUpdate = function() {
            var params = {
                ProvisionedThroughput: {
                    ReadCapacityUnits: read,
                    WriteCapacityUnits: write
                },
                TableName: table
            };

            this.dynamodb.updateTable(params, (err, data) => { 
                if (err) console.log(err, err.stack); // an error occurred
                else {
                    console.log(data); // successful response
                    callback(data);
                }
            });
        }
    }
}
