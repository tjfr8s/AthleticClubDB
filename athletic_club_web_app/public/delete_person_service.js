function deletePersonService(person_id, service_id){
    $.ajax({
        url: '/person_service/' + person_id + '/' + service_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}
