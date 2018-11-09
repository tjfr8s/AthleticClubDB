module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var updateBills = require("./public/update_bills.js")

    function getServices(res, mysql, context, complete){
        mysql.pool.query("SELECT p.person_id, p.fname, p.lname, s.service_id, s.name, s.cost FROM person p INNER JOIN person_service ps ON p.person_id = ps.person_id INNER JOIN service s ON s.service_id = ps.service_id;", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person_service = results;
            complete();
        });
    }

    function getServiceList(res, mysql, context, complete){
        mysql.pool.query("SELECT service_id, name FROM service;", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.service_list = results;
            complete();
        });
    }

    function getPersonList(res, mysql, context, complete){
        mysql.pool.query("SELECT person_id, fname, lname FROM person;", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person_list = results;
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete_person_service.js"];
        var mysql = req.app.get('mysql');
        getServices(res, mysql, context, complete);
        getServiceList(res, mysql, context, complete);
        getPersonList(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('person_service', context);
            }
        }
    });

    router.delete('/:person_id/:service_id', function(req, res, next){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM person_service WHERE person_id = ? AND service_id = ?";
        var inserts = [req.params.person_id, req.params.service_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
                console.log("400");
            }
            else{
                next();
                res.status(202);
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

    router.post('/subscribe', function(req, res, next){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `person_service` (`person_id`, `service_id`) VALUES (?, ?)";
        var inserts = [req.body.person_id, req.body.location_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
            }
            else{
                next();
            }
        });
    }, function(req, res){
        console.log("subscribe");
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        updateBills.updateBills(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.redirect('/person_service');
            }
        }

    });


    return router;
}();
