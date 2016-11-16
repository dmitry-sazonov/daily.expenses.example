var log = require("libs/log")(module);
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment');
var utils = require('config/utils');

var User = require("mongo").User;
var Categories = require("mongo").Categories;
var Record = require("mongo").Record;
var Debt = require("mongo").Debt;


// POST /api/records/add
function addRecord(req, res) {
    
    function init(cbInit) {
        
        var params = {
            timestamp: req.body.timestamp,
            category_id: req.body.category_id,
            money: req.body.money,
            description: req.body.description
        };

        cbInit(null, params);
        
    }
    
    function addRecord(params, cbAddRecord) {

        Record.add(params, function(err, record) {

            if (err) return cbAddRecord(err);
            cbAddRecord(null, record);

        });
        
    }
        
    async.waterfall([
        init,
        addRecord
    ], function(err, result) {

        if (err) return res.send(500, err);
        
        var response = {
            timestamp: result.timestamp,
            category_id: result.category_id,
            money: result.money,
            description: result.description
        };
                
        res.send(response);
        
    });
        
}

// POST /api/records/update/:record_id
function updateRecord(req, res) {

    var record_id = req.params.record_id;

    var params = {
        money: req.body.money,
        category_id: req.body.category_id,
        description: req.body.description,
        timestamp: req.body.timestamp
    };

    Record.updateById(record_id, params, function(err, result) {

        if (err) return res.send(500, err);

        var record = {
            id: record_id
        };

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                record[key] = params[key];
            }
        }

        res.send(record);

    });
    
}

// POST /api/records/moveToCategory/:category_id
function moveRecords(req, res) {

    var category_id = req.params.category_id;
    var records_ids = req.body.records_ids;

    Record.moveToCategory(category_id, records_ids, function(err, result) {

        if (err) return res.send(500, err);
        
        var response = {
            statusCode: 301, // Moved Permanently (перемещено навсегда)
            message: "Перемещено",
            newCategoryId: category_id
        };
        
        res.send(response);
        
    });
        
}


// GET /api/categories/:type/get
function getCategories(req, res) {

    function init(cbInit) {

        var user_id = req.session.user_id;
        var type = req.params.type;
        var period = {};

        if (req.query.start) period.start = req.query.start;
        if (req.query.end) period.end = req.query.end;
        
        cbInit(null, user_id, type, period);

    }

    function getCategories(user_id, type, period, cbGetCategories) {

        Categories.getByUserId(user_id, type, function(err, categories) {

            if (err) return cbGetCategories(500, err);

            cbGetCategories(null, categories, period);

        });

    }

    function getRecords(categories, period, cbGetRecords) {

        var category_ids = [];
        var data = {};

        categories.forEach(function(item) {

            category_ids.push(item._id);

            if (!data[item._id.toString()]) {

                data[item._id.toString()] = {
                    id: item._id.toString(),
                    name: item.name,
                    countRecords: 0,
                    moneyOfCategory: 0,
                    plans: item.plans,
                    parent: item.parent_id
                };
                
            }

        });

        Record.getByCategoryIds(category_ids, function(err, result) {

            if (err) return cbGetRecords(err);

            result.forEach(function(item) {

                var isValidTimestampOfItem = true;

                if (period && period.start > item.timestamp) isValidTimestampOfItem = false;
                if (period && period.end < item.timestamp) isValidTimestampOfItem = false;

                if (isValidTimestampOfItem) {

                    data[item.category_id].moneyOfCategory += item.money;
                    data[item.category_id].countRecords += 1;

                }

            });

            cbGetRecords(null, data);

        });

    }

    async.waterfall([
        init,
        getCategories,
        getRecords
    ], function (err, result) {

        if (err) return res.send(500, err);

        res.send(result);

    });

}

// GET /api/records/get/categoryIds
function getRecordsByCategoryIds(req, res) {

    function init(cbInit) {

        if (!req.query.categoryIds) return cbInit("'categoryIds' is undefined");
        
        var categoryIds = req.query.categoryIds;
                
        var period = {};
        var parsedPeriod = JSON.parse(req.query.period);

        var start = parsedPeriod.start || null;
        var end = parsedPeriod.end || null;

        if (start && typeof +start == "number" && +start >= 0) {
            period.start = +start;
        }

        if (end && typeof +end == "number" && +end >= 0) {
            period.end = +end;
        }

        cbInit(null, categoryIds, period);

    }

    function getRecords(categoryIds, period, cbGetRecords) {

        Record.getByCategoryIds(categoryIds, function(err, result) {

            if (err) return cbGetRecords(err);

            var records = [];

            result.forEach(function(item) {

                var isValidTimestampOfItem = true;

                if (period.start && period.start > item.timestamp) isValidTimestampOfItem = false;
                if (period.end && period.end < item.timestamp) isValidTimestampOfItem = false;

                if (isValidTimestampOfItem) records.push(item);

            });

            cbGetRecords(null, records);

        });

    }

    async.waterfall([
        init,
        getRecords
    ], function(err, records) {

        if (err) return res.send(500, err);

        res.send(records);

    });
    
}

// GET /api/records/get/betweenTimestamps/:firstTimestamp/:secondTimestamp?categoryIds
function getRecordsBetweenTimestamps(req, res) {
        
    function init(cbInit) {

        var firstTimestamp = req.params.firstTimestamp;
        var secondTimestamp = req.params.secondTimestamp;
        var categoryIds = req.query.categoryIds;
                
        cbInit(null, firstTimestamp, secondTimestamp, categoryIds);
        
    }
    
    function getRecords(firstTimestamp, secondTimestamp, categoriesIds, cbGetRecords) {

        Record.getByCategoryIdsAndTimestamps(firstTimestamp, secondTimestamp, categoriesIds, function(err, records) {

            if (err) return cbGetRecords(err);

            cbGetRecords(null, records);

        });
        
    }
    
    async.waterfall([
        init,
        getRecords
    ], function(err, records) {
        
        if (err) return res.send(500, err);

        res.send(records);
        
    });

    
}

// POST /api/categories/:type/add
function addCategory(req, res) {

    function init(cbInit) {
        
        var user_id = req.session.user_id;
        
        var params = {
            name: req.body.category.name,
            type: req.params.type
        };

        if (req.body.category.parent_id) {
            params.parent_id = mongoose.Types.ObjectId(req.body.category.parent_id);
        }

        cbInit(null, params, user_id);
        
    }

    function addToCategories(params, user_id, cbAddToCategory) {

        Categories.add(params, user_id, function (err, category) {
        
            if (err) return cbAddToCategory(err);
            cbAddToCategory(null, category, params.user_id);
        
        });
    }
    
    async.waterfall([
        init,
        addToCategories
    ], function (err, result) {

        if (err) return res.send(500, err);
        res.send(result);

    });
    
}

// POST /api/categories/update/:category_id/plan
function updateCategoryPlan(req, res) {

    function init(cbInit) {

        var user_id = req.session.user_id;
        var category_id = req.params.category_id;
        var plan = req.body.plan;

        cbInit(null, user_id, category_id, plan);

    }

    function updateCategory(user_id, category_id, plan, cbUpdateCategory) {

        Categories.getByCategoriesIds([category_id], user_id, function(err, categories) {
                        
            if (err) return cbUpdateCategory(err);

            var category = categories[0];
            var category_plans = category.plans || {};

            utils.addObjToObj(plan, category_plans);

            Categories.update(category._id, user_id, {plans: category_plans}, function(err, category) {

                if (err) return cbUpdateCategory(err);
                cbUpdateCategory(null, category);

            });
            
        });

    }

    async.waterfall([
        init,
        updateCategory
    ], function(err, result) {

        if (err) return res.send(500, err);

        res.send(result);

    });

}

// POST /api/categories/update/:category_id
function updateCategory(req, res) {

    function init(cbInit) {

        var categoryId = req.params.category_id;
        var user_id = req.session.user_id;

        var params = {};

        if (req.body.category.name) params["name"] = req.body.category.name;

        cbInit(null, categoryId, user_id, params);

    }

    function updateCategory(categoryId, user_id, params, cbUpdateCategory) {

        Categories.update(categoryId, user_id, params, function(err) {

            if (err) return cbUpdateCategory(err);

            cbUpdateCategory(null, {
                id: categoryId,
                name: params.name
            });

        });

    }

    async.waterfall([
        init,
        updateCategory
    ], function(err, result) {

        if (err) return res.send(500, err);

        res.send({
            category: result
        });

    });

}

// DELETE /api/categories/delete/:category_id
function deleteCategory(req, res) {
    
    function init(cbInit) {

        var category_id = req.params.category_id;
        var user_id = req.session.user_id;

        cbInit(null, category_id, user_id);

    }
    
    function removeFromCategories(category_id, user_id, cbRemoveFromCategories) {

        Categories.remove(category_id, user_id, function(err, result) {

            if (err) return res.send(500, err);

            cbRemoveFromCategories(null, category_id);
            
        });
        
    }
        
    async.waterfall([
        init,
        removeFromCategories
    ], function(err, category_id) {
        
        if (err) res.send(500, err);
        
        res.send({
            message: "Remove successful",
            category_id: category_id
        });
        
    });

}

// POST /api/debts/:type/add
function addDebt(req, res) {
    
    function init(cbInit) {

        var debt = req.body.debt;
        var type = req.params.type;
        var user_id = req.session.user_id;
        
        var params = {
            name: debt.name,
            startMoney: debt.startMoney,
            comment: debt.comment,
            timestamp: debt.timestamp,
            type: type
        };
        
        cbInit(null, params, user_id);
        
    }

    function addDebt(params, user_id, cbAddDebt) {

        Debt.add(params, user_id, function(err, response) {

            if (err) return cbAddDebt(err);

            var debt = {
                id: response._id,
                name: response.name,
                startMoney: response.startMoney,
                comment: response.comment,
                timestamp: response.timestamp,
                type: response.type,
                payments: response.payments || [],
                done: response.done || false
            };

            cbAddDebt(null, debt);
            
        });
        
    }
    
    async.waterfall([
        init,
        addDebt
    ], function(err, result) {

        if (err) return res.send(500, err);

        res.send(result);
        
    });
    
    
}

//GET /api/debts/:type/get
function getDebts(req, res) {

    function init(cbInit) {

        var type = req.params.type;
        var user_id = req.session.user_id;
        
        cbInit(null, type, user_id);

    }
    
    function getDebts(type, user_id, cbGetDebts) {

        Debt.getByType(type, user_id, function(err, response) {

            if (err) return cbGetDebts(err);
            
            var debts = response.map(function(item) {
                return {
                    id: item._id,
                    name: item.name,
                    comment: item.comment,
                    timestamp: item.timestamp,
                    startMoney: item.startMoney,
                    type: item.type,
                    payments: item.payments || [],
                    done: item.done
                };
            });

            cbGetDebts(null, debts);
            
        });
        
    }
    
    async.waterfall([
        init,
        getDebts
    ], function(err, result) {

        if (err) return res.send(500, err);

        res.send(result);
        
    });
    
}

// POST /api/debts/update
function updateDebt(req, res) {
    
    function init(cbInit) {

        var debt = req.body.debt;
        var debtId = debt.id;
        
        var params = {
            name: debt.name,
            startMoney: debt.startMoney,
            comment: debt.comment,
            timestamp: debt.timestamp
        };
        
        var user_id = req.session.user_id;
        
        cbInit(null, debtId, params, user_id);

    }

    function isDoneDebt(debtId, params, user_id, cbGetDebt) {

        Debt.getById(debtId, user_id, function(err, debt) {
            
            if (err) return cbGetDebt(err);

            params.done = debt.done;

            if (!debt.payments) return cbGetDebt(null, debtId, params, user_id);

            var sumPaymentsDebt = 0;

            debt.payments.forEach(function(payment) {
                sumPaymentsDebt += -payment.money;
            });

            params.done = sumPaymentsDebt >= params.startMoney;

            cbGetDebt(null, debtId, params, user_id);
            
        });

    }
    
    function updateDebt(debtId, params, user_id, cbUpdateDebt) {

        Debt.updateById(debtId, params, user_id, function(err, response) {

            if (err) return cbUpdateDebt(err);

            var debt = params;
            debt.id = debtId;

            cbUpdateDebt(null, debt);

        });
        
        
    }

    async.waterfall([
        init,
        isDoneDebt,
        updateDebt
    ], function(err, result) {
        
        if (err) return res.send(500, err);
        
        res.send(result);
        
    });
    
}

//POST /api/debts/:id/addPayment
function addPaymentDebt(req, res) {
    
    function init(cbInit) {

        var debt_id = req.params.id;

        var params = {
            money: req.body.money,
            timestamp: req.body.timestamp,
            comment: req.body.comment
        };

        var user_id = req.session.user_id;
        
        cbInit(null, debt_id, params, user_id);
        
    }

    function getPaymentsDebt(debt_id, params, user_id, cbPayDebt) {

        Debt.getById(debt_id, user_id, function(err, debt) {

            if (err) return cbPayDebt(err);

            var payments = debt.payments || [];
            payments.push(params);

            var paymentsMoney = 0;
            var isDone = false;

            payments.forEach(function(payment) {
                paymentsMoney += payment.money;
            });

            if (paymentsMoney + debt.startMoney <= 0) {
                isDone = true;
            }
                
            cbPayDebt(null, debt, payments, isDone, user_id);

        });

    }
    
    function updateDebt(debt, payments, isDone, user_id, cbUpdateDebt) {

        Debt.updateById(debt._id, {payments: payments, done: isDone}, user_id, function(err, result) {

            if (err) return cbUpdateDebt(err);

            debt.done = isDone;
            debt.payments = payments;
            
            cbUpdateDebt(null, debt);

        });

    }
    
    async.waterfall([
        init,
        getPaymentsDebt,
        updateDebt
    ], function(err, result) {
        
        if (err) return res.send(500, err);
        
        res.send(result);
        
    });
    
}

exports.login = require("./login");

exports.addRecord = addRecord;
exports.updateRecord = updateRecord;
exports.moveRecords = moveRecords;

exports.getCategories = getCategories;
exports.getRecordsByCategoryIds = getRecordsByCategoryIds;
exports.getRecordsBetweenTimestamps = getRecordsBetweenTimestamps;

exports.addCategory = addCategory;
exports.updateCategoryPlan = updateCategoryPlan;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;

exports.addDebt = addDebt;
exports.getDebts = getDebts;
exports.updateDebt = updateDebt;
exports.addPaymentDebt = addPaymentDebt;
