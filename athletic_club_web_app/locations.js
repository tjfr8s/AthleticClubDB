module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT `location_id`, `name`, `capacity` FROM location;", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_delete_locations', context);
            }
        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `location` (`name`, `capacity`) VALUES (?, ?)";
        var inserts = [req.body.service_name, req.body.service_cost];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
            }
            else{
                res.redirect('/locations');
            }
        });

    })

    return router;
}();
