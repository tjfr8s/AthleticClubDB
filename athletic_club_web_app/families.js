module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getFamilies(res, mysql, context, complete){
        mysql.pool.query("SELECT f.family_id, COUNT(p.person_id) AS num_people, f.membership_id, m.bill FROM family f INNER JOIN person p ON f.family_id = p.family_id INNER JOIN membership m ON f.membership_id = m.membership_id GROUP BY f.family_id;", function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.families = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        getFamilies(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_delete_families', context);
            }
        }
    });

    return router;
}();
