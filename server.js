'use strict';

var express = require("express");
var routes = require("./app/routes/index.js");
var bodyParser = require("body-parser");
require("node-env-file")(".env");
var mongo = require("mongodb").MongoClient;
var app = express();
var server = require('http').Server(app);
var io = require("socket.io")(server);


mongo.connect(process.env.MONGO_URI, function (err, db) {
    //server.listen(80);
    app.use("/public", express.static(process.cwd() + "/public"));
    app.use("/controllers", express.static(process.cwd() + "/app/controllers"));
    app.use(bodyParser.urlencoded({extended: false}));
    routes(app, db);
    
    io.sockets.on('connection', function (socket) {
        socket.on('dataupdated', function (data) {
            socket.broadcast.emit('dataupdated', data);
        });
        socket.on('dataremoved', function (data) {
            socket.broadcast.emit('dataremoved', data);
        });
    });
    
    server.listen(process.env.PORT, function() {
        console.log("App listening on port " + process.env.PORT + "...");
    });
});
