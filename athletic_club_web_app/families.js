module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getFamilies(res, mysql, context, complete){
        mysql.pool.query("SELECT f.family_id, IFNULL(np.num_people,0) as num_people, m.membership_id, m.bill FROM family f LEFT JOIN (SELECT f.family_id, COUNT(p.person_id) AS num_people FROM family f INNER JOIN person p ON f.family_id = p.family_id GROUP BY f.family_id) AS np ON f.family_id = np.family_id INNER JOIN membership m ON f.membership_id = m.membership_id;", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.families = results;
            complete();
        });
    }

    function getMemberships(res, mysql, context, complete){
        mysql.pool.query("select membership_id FROM membership WHERE membership_id NOT IN (SELECT membership_id FROM family)", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.memberships = results;
            complete();
        })

    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        getFamilies(res, mysql, context, complete);
        getMemberships(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('add_delete_families', context);
            }
        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO family (membership_id) VALUES (?)";
        var inserts = [req.body.membership_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
            }
            else{
                res.redirect('/families');
            }
        });
    });

    return router;
}();
