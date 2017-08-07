"use strict";
 
module.exports = class TurnService {

    constructor(userSupplyService){
        this.userSupplyService = userSupplyService;
    }
    
    turnOn(userId) {
        this.userSupplyService.getAllTables((tableNames) => { 
            for (let tableName of tableNames) {
                this.userSupplyService.read(tableName, (p) => {  
                    this.userSupplyService.write(tableName, userId, p.read, p.write);
                });
            }
        })
    }

    turnOff(userId, read, write) { 
        this.userSupplyService.getAllTables( (tableNames) => {  
            for (let tableName of tableNames) {
                this.userSupplyService.write(tableName, userId, read, write);
            }

        })
    }

}
