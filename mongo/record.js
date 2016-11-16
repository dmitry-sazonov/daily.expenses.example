var log = require("libs/log")(module);
var mongoose = require("mongoose");
var async = require('async');
var moment = require('moment');

var Record = require("./models/record");

function add(params, callback) {

    var record = new Record({
        timestamp: params.timestamp,
        category_id: params.category_id,
        money: params.money,
        description: params.description
    });

    record.save(function(err, record) {

        if (err) return callback(err);

        callback(null, record);

    });

}

function updateById(id, params, callback) {

    Record.update({_id: id}, params, function(err, result) {
       
        if (err) return callback(err);
    
        result.n == 1 ? callback(null, "OK") : callback("Updated: " + result.n);
       
    });
    
}

function moveToCategory(category_id, ids, callback) {

    Record.update({ _id: {$in: ids} }, {category_id: category_id}, {multi: true}, function(err, result) {
        
        if (err) return callback(err);

        callback(null, "OK");
        
    });
    
    
}

function getByCategoryIds(ids, callback) {

    Record.find({ category_id: {$in: ids} }, function(err, result) {

        if (err) return callback(err);

        callback(null, result);

    });

}

function getByCategoryIdsAndTimestamps(firstTimestamp, secondTimestamp, categoriesIds, callback) {

    Record.find({ category_id: { $in: categoriesIds }, timestamp: { $gte: firstTimestamp, $lte: secondTimestamp } }, function(err, records) {

        if (err) return callback(err);
        
        callback(null, records);

    });
    
}

exports.add = add;
exports.updateById = updateById;
exports.moveToCategory = moveToCategory;
exports.getByCategoryIds = getByCategoryIds;
exports.getByCategoryIdsAndTimestamps = getByCategoryIdsAndTimestamps;