var express = require('express');
var http = require('http');
var config = require("config");
var log = require("libs/log")(module);

var mongoose = require("mongo");

var app = express();

require("./config/express")(app);
require("./config/routes")(app);

http.createServer(app).listen(config.port, function() {
    log.info('Express server listening on port ' + config.port);
});
