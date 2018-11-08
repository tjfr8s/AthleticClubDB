function deleteFamily(id){
    $.ajax({
        url: '/families/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}
