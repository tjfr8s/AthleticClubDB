function updateLocation(id){
    $.ajax({
        url: "/locations/" + id,
        type: "PUT",
        data: $('#update_location_form').serialize(),
        success: function (result){
            window.location.replace("./");
        }
    })
}
