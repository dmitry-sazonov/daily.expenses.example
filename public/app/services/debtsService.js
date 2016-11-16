app.factory("debtsService", function($http) {

    function Debts(type) {

        var _self = this;

        Object.defineProperty(this, "loading", {
            enumerable: false,
            writable: true,
            value: false
        });

        Object.defineProperty(this, "type", {
            enumerable: false,
            writable: false,
            value: type
        });

        (function() {

            _self.loading = true;

            $http.get("/api/debts/" + _self.type + "/get").success(function(debts) {

                for (var id in _self) {
                    if (_self.hasOwnProperty(id)) {
                        delete _self[id];
                    }
                }

                debts.forEach(function(debt) {
                    _self[debt.id] = new Debt(debt);
                });

                _self.loading = false;

            }).error(function (err) {

                console.log(err);
                _self.loading = false;

            });

        })();

    }

    Debts.prototype = new function() {

        this.constructor = Debts;

        this.addDebt = function(debt, callback) {

            var _self = this;

            $http.post("/api/debts/" + _self.type + "/add", {
                debt: debt
            }).success(function(debt) {

                _self[debt.id] = new Debt(debt);
                callback(null, _self[debt.id]);

            }).error(function(err) {

                callback(err);

            });

        };

        this.updateDebt = function(debt, callback) {

            var _self = this;

            $http.post("/api/debts/update", {
                debt: debt
            }).success(function(debt) {

                _self[debt.id].name = debt.name;
                _self[debt.id].startMoney = debt.startMoney;
                _self[debt.id].timestamp = debt.timestamp;
                _self[debt.id].comment = debt.comment;
                _self[debt.id].done = debt.done;

                callback(null, _self[debt.id]);

            }).error(function(err) {

                callback(err);

            });

        };
        
        this.addPayment = function(debt_id, payment, callback) {

            var _self = this;

            $http.post("/api/debts/" + debt_id + "/addPayment", payment).success(function(debt) {

                _self[debt._id].payments = debt.payments;
                _self[debt._id].done = debt.done;

                callback(null, _self[debt._id]);

            }).error(function(err) {
                
                callback(err);
                
            });
            
        };

        Object.defineProperty(this, "allMoney", {
            enumerable: false,
            get: function() {

                var money = 0;

                for (var id in this) {
                    if (this.hasOwnProperty(id)) {
                        money += this[id].money;
                    }
                }

                return money;

            }
        });

    };

    function Debt(data) {

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }

        Object.defineProperty(this, "money", {
            enumerable: false,
            get: function() {

                var money = this.startMoney;

                this.payments.forEach(function(payment) {
                    money += payment.money;
                });

                return money;
            }
        });

    }


    return {
        take: new Debts("take"),
        give: new Debts("give")
    };

});