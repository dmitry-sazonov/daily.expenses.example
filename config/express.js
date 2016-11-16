var path = require("path");
var express = require('express');
var config = require("config");
var log = require("libs/log")(module);
var mongoose = require("mongoose");
var MongoStore = require('connect-mongo')(express);

var rootPath = path.normalize(__dirname + "/../");

module.exports = function(app) {

    app.set('views', path.join(rootPath, 'public/views'));
    app.set('view engine', 'jade');

    app.use(express.favicon());

    app.use(express.bodyParser());
    app.use(express.cookieParser());

    var session = config.session;
    session.store = new MongoStore({mongooseConnection: mongoose.connection});

    app.use(express.session(session));

    app.use(express.static(path.join(rootPath, 'public')));

};