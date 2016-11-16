var mongoose = require("mongoose");
var config = require("config");
var log = require("libs/log.js")(module);

var User = require("./user");
var Record = require("./record");
var Categories = require("./categories");
var Debt = require("./debt");

mongoose.connect(config.mongoUrl, function(err) {

    if (err) return console.log("Mongo connecting error", err);

    log.info("Mongo connected");

});

mongoose.connection.on('disconnected', function() {
    console.info("Mongo disconnected");
});

mongoose.connection.on('Error', function(err) {
    log.error("Mongo error", err);
});

exports.User = User;
exports.Record = Record;
exports.Categories = Categories;
exports.Debt = Debt;