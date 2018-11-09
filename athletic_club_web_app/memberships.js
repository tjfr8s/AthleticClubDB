module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var updateBills = require('./public/update_bills.js');

    function getMemberships(res, mysql, context, complete){
        mysql.pool.query("SELECT m.membership_id, COUNT(p.person_id) AS num_people, m.bill FROM membership m LEFT JOIN family f ON m.membership_id = f.membership_id LEFT JOIN person p ON f.family_id = p.family_id GROUP BY m.membership_id;", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.memberships = results;
            complete();
        });
    }

router.get('/',  function(req, res,next){
        // Middleware function for updating bills before rendering page.
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var context = {};
        updateBills.updateBills(res, mysql, context, complete);
        function complete(){
            // Creates closure with callbackCount keeping track of functions
            // completed in this middleware function. When they finish, the
            // next middleware function is invoked.
            callbackCount++;
            if(callbackCount >= 1){
                next();
            }
        }
    }, function(req, res){
        // Middleware function for getting membershi info and rendering page.
        var callbackCount = 0;
        context = {};
        context.jsscripts = ["delete_membership.js"];
        var mysql = req.app.get('mysql');
        getMemberships(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_delete_memberships', context);
            }
        }
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get("mysql");
        var sql = "DELETE FROM membership WHERE membership_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
                console.log("400");
            }
            else{
                res.status(202).end();
                console.log("202");
            }
        });
    });

    router.post('/', function (req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO membership () VALUES ()";
        var inserts = "";
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
            }
            else{
                res.redirect('/memberships');
            }
        });

    });

    return router;
}();
