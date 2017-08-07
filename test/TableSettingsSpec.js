describe("Test table settings", function() {
    var a;
    
 
    it("write read", function() {
        var rand = Math.floor(Math.random() * 6) + 1;
        var TableSettingsService = require("../service/TableSettingsService.js")
        var tableSettings = new TableSettingsService();
        console.log("done 1" );
        tableSettings.write("1", "tableName", rand + "", "1", function() {
            console.log("done 1" );
            tableSettings.read("1", "tableName", function(data) {
                console.log("done " + data)
                expect(data.read).toBe(rand);
                expect(true).toBe(false);
                done();

            });
        });

    });
});
