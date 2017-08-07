"use strict";
const AWS = require('aws-sdk');
let CronService = require('./CronService.js');
let UserSupplyService = require('./UserSupplyService.js');
let KeySettingsService = require('./KeySettingsService.js');
let TurnService = require('./TurnService.js');

module.exports = class LambdaService {

    runEvryMinute() {
        let cronService = new CronService();
        cronService.GetCronList(function(list) {
            let date = new Date();
            let h = date.getHours();
            let m = date.getMinutes();
            let day = date.getDay();

            for (let l of list) {
                if (l.cron.h == h && l.cron.m == m && l.cron.day == day) {
                    console.log(" turn  ")
                    console.log(l);
                    let keySettings = new KeySettingsService();
                    keySettings.read(l.userId, function(keys) {
                        let userSupplyService = new UserSupplyService(keys.aKey, keys.sKey);
                        let turnService = new TurnService(userSupplyService);
                        if (l.turn) {
                            turnService.turnOn(l.userId, l)
                        }
                        else {
                            turnService.turnOff(l.userId, l);
                        }
                    });
                }
            }
        });

    }


}
