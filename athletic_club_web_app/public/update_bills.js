    module.exports = {
    updateBills: function (res, mysql, context, complete){
        mysql.pool.query("UPDATE membership, (SELECT family.family_id, membership.membership_id, person.fname, person.person_id, IFNULL(sum(service.cost),0) AS sumCost FROM membership JOIN family ON family.membership_id = membership.membership_id JOIN person ON person.family_id = family.family_id LEFT JOIN person_service ON person.person_id = person_service.person_id LEFT JOIN service ON person_service.service_id = service.service_id GROUP BY family.family_id) t SET membership.bill = t.sumCost WHERE membership.membership_id = t.membership_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

};
