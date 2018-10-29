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

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        getMemberships(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_delete_memberships', context);
            }
        }
    });

    return router;
}();
