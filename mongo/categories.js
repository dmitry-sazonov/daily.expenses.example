var log = require("libs/log")(module);

var Categories = require("./models/categories");

function add(params, user_id, callback) {

    var categories = new Categories({
        name: params.name,
        parent_id: params.parent_id,
        type: params.type,
        user_id: user_id
    });

    categories.save(function(err, category) {
        
        if (err) return callback(err);
        
        callback(null, category);
        
    });
    
}

function update(category_id, user_id, params, callback) {

    Categories.update( {_id: category_id, user_id: user_id}, params, function(err, result) {
        
        if (err) return callback(err);

        result.n == 1 ? callback(null, "OK") : callback("Updated: " + result.n);
                
    });
        
}

function remove(category_id, user_id, callback) {

    Categories.remove({_id: category_id, user_id: user_id}, function(err, result) {
        
        if (err) return callback(err);

        result.result.n == 1 ? callback(null, "OK") : callback("Removed: " + result.result.n);
        
    });

}

function getByUserId(user_id, type, callback) {

    Categories.find({user_id: user_id, type: type}, function(err, categories) {

        if (err) return callback(err);

        callback(null, categories);

    });

}

function getByCategoriesIds(ids, user_id, callback) {

    Categories.find({_id: { $in: ids }, user_id: user_id }, function(err, categories) {

        if (err) return callback(err);

        callback(null, categories);

    });

}


exports.add = add;
exports.update = update;
exports.remove = remove;
exports.getByUserId = getByUserId;
exports.getByCategoriesIds = getByCategoriesIds;
