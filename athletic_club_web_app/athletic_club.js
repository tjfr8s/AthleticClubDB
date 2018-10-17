var http = require('http');
var express = require("express");
var app = express();
var path = require("path");

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/add_delete_memberships.html', function(req,res){
    res.sendFile(path.join(__dirname+'/add_delete_memberships.html'));
});

app.get('/add_delete_locations.html', function(req,res){
    res.sendFile(path.join(__dirname+'/add_delete_locations.html'));
});

app.get('/add_delete_families.html', function(req,res){
    res.sendFile(path.join(__dirname+'/add_delete_families.html'));
});

app.get('/add_delete_people.html', function(req,res){
    res.sendFile(path.join(__dirname+'/add_delete_people.html'));
});

app.get('/add_delete_services.html', function(req,res){
    res.sendFile(path.join(__dirname+'/add_delete_services.html'));
});

app.get('/manage_person_family.html', function(req,res){
    res.sendFile(path.join(__dirname+'/manage_person_family.html'));
});

app.get('/manage_family_membership.html', function(req,res){
    res.sendFile(path.join(__dirname+'/manage_family_membership.html'));
});

app.get('/manage_person_service.html', function(req,res){
    res.sendFile(path.join(__dirname+'/manage_person_service.html'));
});

app.get('/manage_service_location.html', function(req,res){
    res.sendFile(path.join(__dirname+'/manage_service_location.html'));
});

app.listen(1718);

console.log('Server started on localhost:1718 press Ctrl-C to terminate....');
