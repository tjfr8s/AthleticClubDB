module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var updateBills = require('./public/update_bills.js');

    function getPeople(res, mysql, context, complete){
        mysql.pool.query("SELECT person_id, lname, fname, family_id, date_of_birth, zip_code, state, street_name FROM person", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getFamilies(res, mysql, context, complete){
        mysql.pool.query("SELECT family_id FROM family", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.families = results;
            complete();
        });
    }

    router.delete('/:id', function(req, res, next){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM person WHERE person_id = ?";
        var inserts = [req.params.id];
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

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete_person.js"];
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        getFamilies(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('add_delete_people', context);
            }
        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `person` (`street_name`, `zip_code`, `state`, `family_id`, `fname`,`lname`, `date_of_birth`)VALUES (?, ?, ?, ?, ?, ?, ?);";
        var inserts = [req.body.street_address, req.body.zip_code, req.body.state, req.body.family_id, req.body.last_name, req.body.first_name, req.body.date_of_birth];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
            }
            else{
                res.redirect('/people');
            }
        });

    })


    return router;
}();
