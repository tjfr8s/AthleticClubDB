module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var updateBills = require('./public/update_bills.js');

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

    function getLocation(res, mysql, context, id, complete){
        var sql = "SELECT * FROM location WHERE location_id = ?;"
        var inserts = [id];
        sql = mysql.pool.query(sql, inserts, function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.location = results[0];
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete_location.js"];
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_delete_locations', context);
            }
        }
    });

    router.delete('/:id', function (req, res, next){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM location WHERE location_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
                console.log("400");
            }
            else{
                res.status(202);
                next();
                console.log("202");
            }
        });
    }, function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        updateBills.updateBills(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log("delete");
                res.end();
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

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["update_location.js"];
        var mysql = req.app.get('mysql');
        getLocation(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('manage_location', context);
            }
        }

    })

    return router;
}();
