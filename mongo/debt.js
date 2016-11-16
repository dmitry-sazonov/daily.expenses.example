
var Debt = require("./models/debt");

function add(params, user_id, callback) {

    var debt = new Debt({
        name: params.name,
        type: params.type,
        timestamp: params.timestamp,
        startMoney: params.startMoney,
        comment: params.comment,
        user_id: user_id
    });

    debt.save(function(err, debt) {

        if (err) return callback(err);

        callback(null, debt);

    });
    
}

function getById(id, user_id, callback) {
    
    Debt.find({_id: id, user_id: user_id}, function(err, result) {
        
        if (err) return callback(err);

        callback(null, result[0]);
        
    });
    
}

function getByType(type, user_id, callback) {

    Debt.find({type: type, user_id: user_id}, function(err, response) {
        
        if (err) return callback(err);

        callback(null, response);
       
    });
    
}

function updateById(id, params, user_id, callback) {
    
    Debt.update({_id: id, user_id: user_id}, params, function(err, result) {
        
        if (err) return callback(err);
        
        callback(null, result);
        
    });
    
}

exports.add = add;
exports.getById = getById;
exports.getByType = getByType;

exports.updateById = updateById;
