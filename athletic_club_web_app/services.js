module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        getServices(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_delete_services', context);
            }
        }
    });

    return router;
}();
