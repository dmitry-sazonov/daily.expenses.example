app.factory("categoriesService", function($http) {

    function Categories(type) {

        Object.defineProperty(this, "type", {
            enumerable: false,
            value: type
        });

    }

    Categories.prototype = new function() {

        var period = {};

        this.constructor = Categories;

        function Properties() {
            this.all = {};
            this.loading = false;
        }

        var expenses = new Properties();
        var earnings = new Properties();

        Object.defineProperty(this, "expenses", {
            enumerable: false,
            get: function() {
                return expenses;
            }
        });

        Object.defineProperty(this, "earnings", {
            enumerable: false,
            get: function() {
                return earnings;
            }
        });

        Object.defineProperty(this, "length", {
            enumerable: false,
            get: function() {
                return Object.keys(this).length;
            }
        });
        
        Object.defineProperty(this, "all", {
            enumerable: false,
            get: function() {
                return this[this.type].all;
            },
            set: function(value) {
                this[this.type].all = value;
            }
        });

        Object.defineProperty(this, "loading", {
            enumerable: false,
            get: function() {
                return this[this.type].loading;
            },
            set: function(value) {
                this[this.type].loading = value;
            }
        });

        Object.defineProperty(this, "period", {
            enumerable: false,
            get: function() {
                return period;
            },
            set: function(value) {

                var _self = this;

                _self.loading = true;
                period = value;

                //console.log(new Date(period.start), "<>", new Date(period.end), this.type);

                $http.get("/api/categories/" + _self.type + "/get", {
                    params: value
                }).success(function(data) {

                    _self.all = data;

                    for (var id in _self) {
                        if (_self.hasOwnProperty(id)) {
                            delete _self[id];
                        }
                    }
                    
                    for (var id in data) {
                        if (data.hasOwnProperty(id)) {
                            data[id] = new Category(data[id], _self.type);
                        }
                    }
                    
                    for (var id in data) {
                        if (data.hasOwnProperty(id)) {

                            var parent_id = data[id].parent;

                            if (parent_id) {
                                data[id].parent = data[parent_id];
                                data[parent_id].childs[id] = data[id];
                            } else {
                                _self[id] = data[id];
                            }

                        }
                    }

                    _self.loading = false;

                }).error(function(err) {

                    console.error(err);
                    _self.loading = false;

                });

            }
            
        });

        Object.defineProperty(this, "allMoney", {
            enumerable: false,
            get: function() {

                var money = 0;

                for (var key in this.all) {
                    if (this.all.hasOwnProperty(key)) {
                        money += this.all[key].moneyOfCategory;
                    }
                }

                return money;

            }
        });

        Object.defineProperty(this, "addCategory", {
            enumerable: false,
            writable: false,
            value: function(category) {

                this.all[category.id] = new Category(category, this.type);

                if (category.parent) {

                    this.all[category.parent].childs[category.id] = this.all[category.id];
                    this.all[category.id].parent = this.all[category.parent];

                } else {

                    this[category.id] = this.all[category.id];

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

        if (data.plans) {
            this.plans = data.plans;
        }

        var childs = new Categories(type);

        Object.defineProperty(this, "childs", {
            get: function() {
                return childs;
            }
        });

        Object.defineProperty(this, "getChildsIds", {
            enumerable: false,
            writable: false,
            value: function() {
                
                var ids = [];
                
                for (var id in childs) {
                    if (childs.hasOwnProperty(id)) {
                        ids.push(id);
                        ids = ids.concat(childs[id].getChildsIds());
                    }
                }

                return ids;
                
            }
        });

        Object.defineProperty(this, "money", {
            get: function() {

                var money = _self.moneyOfCategory;

                for (var id in _self.childs) {
                    if (_self.childs.hasOwnProperty(id)) {
                        money += _self.childs[id].money;
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