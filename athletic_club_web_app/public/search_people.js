function searchPeopleByFirstName() {
    var first_name_search =
    document.getElementById('first_name_search').value;
    window.location = '/people/search/' + encodeURI(first_name_search);
}
