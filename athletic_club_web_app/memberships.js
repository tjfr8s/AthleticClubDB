module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    function updateBills(res, mysql, context, complete){
        mysql.pool.query("UPDATE membership, (SELECT family.family_id, membership.membership_id, person.fname, person.person_id, person_service.service_id, sum(service.cost) AS sumCost FROM membership JOIN family ON family.membership_id = membership.membership_id JOIN person ON person.family_id = family.family_id JOIN person_service ON person.person_id = person_service.person_id JOIN service ON person_service.service_id = service.service_id GROUP BY family.family_id) t SET membership.bill = t.sumCost WHERE membership.membership_id = t.membership_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        updateBills(res, mysql, context, complete);
        getMemberships(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('add_delete_memberships', context);
            }
        }
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
