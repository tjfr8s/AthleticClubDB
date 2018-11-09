module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var updateBills = require('./public/update_bills.js');

    function getServices(res, mysql, context, complete){
        mysql.pool.query("SELECT s.service_id, s.name AS service_name, s.cost, l.location_id, l.name AS location_name FROM service s LEFT JOIN location l ON s.location_id = l.location_id;", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.services = results;
            complete();
        });
    }

    function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT name, location_id FROM location", function(error, results, fields){
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
        context.jsscripts = ["delete_service.js"];
        var mysql = req.app.get('mysql');
        getServices(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('add_delete_services', context);
            }
        }
    });

    router.delete('/:id', function (req, res, next){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM service WHERE service_id = ?";
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
        var sql = "INSERT INTO `service` (`name`, `cost`, `location_id`) VALUES (?, ?, ?)";
        var inserts = [req.body.service_name, req.body.service_cost, req.body.location_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
            }
            else{
                res.redirect('/services');
            }
        });
    });

    return router;
}();
