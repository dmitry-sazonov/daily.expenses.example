app.factory("recordsService", function($http) {

    function Records() {

        Object.defineProperty(this, "loading", {
            enumerable: false,
            writable: true,
            value: false
        });
        
    }

    Records.prototype = new function() {

        this.constructor = Records;

        this.getRecordsByCategoryIds = function(categoryIds, period, callback) {
            
            var _self = this;

            _self.loading = true;

            $http.get("/api/records/get/categoryIds", {
                params: {
                    period: period,
                    categoryIds: categoryIds
                }
            }).success(function(data) {

                for (var id in _self) {
                    if (_self.hasOwnProperty(id)) {
                        delete _self[id];
                    }
                }
                       
                data.forEach(function(item) {

                    _self[item._id] = new Record({
                        id: item._id,
                        category_id: item.category_id,
                        timestamp: item.timestamp,
                        description: item.description,
                        money: item.money
                        //selected: false
                    });
            
                });

                _self.loading = false;
                callback(null, _self);
                       
            }).error(function(err) {

                _self.loading = false;
                callback(err);
            
            });
            
        };

    };

    function Record(data) {

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }

    }
    
    return {
        expenses: new Records(),
        earnings: new Records()
    };

});