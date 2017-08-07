"use strict";
const AWS = require('aws-sdk')

module.exports = class CronService {

    constructor() {
        this.dynamodb = new AWS.DynamoDB({
            accessKeyId: "AKIAJRD3L23232GSH2IA",
            secretAccessKey: "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",
            region: "eu-west-1"

        });

    }

    GetCronList(callback) {
        var params = {
            TableName: "Cron"
        };
        this.dynamodb.scan(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data); // successful response
                return data;
            }

        });


    }

    AddCronList(userId, cron, onOff, readValue, writeValue, callback) {
        var params = {
            Item: {
                userId: {
                    S: userId
                },
                onOff: {
                    BOOL: onOff
                },
                h: {
                    S: cron.h
                },
                m: {
                    S: cron.m
                },
                day: {
                    S: cron.day
                },
                read: {
                    S: readValue
                },
                write: {
                    S: writeValue
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "Cron"
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
