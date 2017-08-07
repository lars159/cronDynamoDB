"use strict";
var passwordHash = require('password-hash');

const AWS = require('aws-sdk')

module.exports = class WebService {

    constructor() {
        this.dynamodb = new AWS.DynamoDB({
            accessKeyId: "AKIAJRD3L23232GSH2IA",
            secretAccessKey: "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",
            region: "eu-west-1"

        });

    }

    
    signUp(email, password, callback) {
        let rand = Math.random().toString(36).substr(2);
        var hashedPassword = passwordHash.generate(password);
        var params = {
            Item: {
                email: {
                    S: email
                },
                password: {
                    S: hashedPassword
                },
                token : {
                    S: rand
                }
            },
            ConditionExpression : "attribute_not_exists(email)",
            ReturnConsumedCapacity: "TOTAL",
            TableName: "User"
        };

        this.dynamodb.putItem(params, function(err, data) {
            if (err) {
                console.log(err, err.stack)
                callback( {});
            } // an error occurred
            else {
                console.log(data);
                callback(() => {
                        return { userId : email, session : token};
                    });
            }

        });


    }
    
    isLogin(email, session, callback){
                var params = {
            Key: {
                email: {
                    S: email
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "User"
        };

        this.dynamodb.getItem(params, (err, data) => {
            if (err) {
                console.log(err, err.stack)
                callback(false);
            } // an error occurred
            else {
                const item = data.Item; 
                callback(item.session == session);
            } 
        });
        
    }
    
    setToken(email,  session, callback) { 
        var params = {
            Key: {
                email: {
                    S: email
                }
            }, 
            "AttributeUpdates":{
               
                    token : { 
                        "Value":{
                        S: session
                    }
                }
            },  
            TableName: "User"
        };

        this.dynamodb.updateItem(params, function(err, data) {
            if (err) {
                console.log(err, err.stack)
                return {};
            } // an error occurred
            else {
                console.log(data);
                callback(() => {
                        return { userId : email, session : session};
                    });
            }

        });


    }
    
    
  

    signIn(email, password, callback) {
        var params = {
            Key: {
                email: {
                    S: email
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "User"
        };

        this.dynamodb.getItem(params, (err, data) => {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                const item = data.Item;
                console.log(item); // successful response
                
                let result = passwordHash.verify(password, item.password.S);
                if(result) {
                    let rand = Math.random().toString(36).substr(2);
                    this.setToken(email, rand, (data) => {
                        callback({ userId : email, session : rand});
                    });
                    
                } else {
                    callback(result);
                }
            } 
        });

    }


}
