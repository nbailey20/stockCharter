'use strict';

var express = require("express");
var routes = require("./app/routes/index.js");
var bodyParser = require("body-parser");
require("node-env-file")(".env");
var mongo = require("mongodb").MongoClient;
var app = express();

mongo.connect(process.env.MONGO_URI, function (err, db) {
    app.use("/public", express.static(process.cwd() + "/public"));
    app.use("/controllers", express.static(process.cwd() + "/app/controllers"));
    app.use(bodyParser.urlencoded({extended: false}));
    routes(app, db);
    
    app.listen(process.env.PORT, function() {
        console.log("App listening on port " + process.env.PORT + "...");
    });
});
