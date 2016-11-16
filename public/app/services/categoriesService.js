app.factory("categoriesService", function($http) {

    function Properties(type) {

        this.all = {};
        this.type = type;

    }

    var properties = {
        expenses: new Properties("expenses"),
        earnings: new Properties("earnings")
    };

    function Categories(type) {

        this.items = {};
        this.periodOfCategory = {};

        for (var key in properties[type]) {
            this[key] = properties[type][key];
        }

    }

    Categories.prototype = new function() {

        var commonPeriod = {};

        this.constructor = Categories;

        this.loading = false;

        this.addCategory = function() {

            var _self = this;

            console.log("addCategory", _self);

        };

        Object.defineProperty(this, "allMoney", {
            get: function() {

                var money = 0;

                for (var id in this.all) {
                    if (this.all.hasOwnProperty(id)) {
                        money += this.all[id].moneyOfCategory;
                    }
                }

                return money;

            }
        });

        this.getCategories = function() {

            var _self = this;

            _self.loading = true;

            $http.get("/api/categories/" + _self.type + "/get", {
                params: _self.period
            }).success(function(data) {

                for (var id in _self.all) {
                    if (_self.all.hasOwnProperty(id)) {
                        delete _self.all[id];
                    }
                }

                _self.items = {};

                for (var id in data) {
                    if (data.hasOwnProperty(id)) {
                        _self.all[id] = new Category(data[id], _self.type);
                    }
                }

                for (var id in _self.all) {
                    if (_self.all.hasOwnProperty(id)) {

                        var parent_id = _self.all[id].parent;

                        if (parent_id) {
                            _self.all[id].parent = _self.all[parent_id];
                            _self.all[parent_id].childs.items[id] = _self.all[id];
                        } else {
                            _self.items[id] = _self.all[id];
                        }

                    }
                }

                _self.loading = false;

            }).error(function(err) {

                console.error(err);
                _self.loading = false;

            });

        };

        Object.defineProperty(this, "period", {
            get: function() {
                return commonPeriod;
            },
            set: function(value) {

                if (value.start != this.periodOfCategory.start || value.end != this.periodOfCategory.end) {
                    commonPeriod = value;
                    this.periodOfCategory = value;
                    this.getCategories();
                }

            }
        });

    };

    function Category(data, type) {

        var _self = this;

        this.id = data.id;
        this.name = data.name;
        this.countRecords = data.countRecords;
        this.moneyOfCategory = data.moneyOfCategory;

        if (data.parent) {
            this.parent = data.parent;
        }

        this.childs = new Categories(type);

        this.getChildsIds = function() {

            var ids = [];

            for (var id in this.childs.items) {
                if (this.childs.items.hasOwnProperty(id)) {
                    ids.push(id);
                    ids = ids.concat(this.childs.items[id].getChildsIds());
                }
            }

            return ids;

        };

        Object.defineProperty(this, "money", {
            get: function() {

                var money = _self.moneyOfCategory;

                for (var id in _self.childs.items) {
                    if (_self.childs.items.hasOwnProperty(id)) {
                        money += _self.childs.items[id].money;
                    }
                }

                return money;

            }
        });



    }
    
    return {
        expenses: new Categories("expenses"),
        earnings: new Categories("earnings")
    };

});