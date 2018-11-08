function deleteMembership(id){
    $.ajax({
        url: '/memberships/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}
