app.controller('upsertRecordsCtrl', function($scope, $rootScope, $modalInstance, $http, countRecords, edit_mode, records, categories) {

    $scope.days = [];
    $scope.months = Date.calendar.months;
    $scope.years = [2015, 2016, 2017];

    $scope.loading = false;
    
    $scope.countRecords = countRecords;
    $scope.edit_mode = edit_mode;
    $scope.records = records;
    $scope.categories = categories;

    $scope.newData = {
        selectDay: 0,
        selectMonth: 0,
        selectYear: 0,
        money: 0,
        description: "",
        categoryId: ""
    };

    $scope.addRecord = function() {

        $scope.loading = true;

        var timestamp = new Date(
            $scope.newData.selectYear,
            $scope.newData.selectMonth,
            $scope.newData.selectDay
        ).getTime();
        
        var category_id = $scope.newData.categoryId;
        var money = $scope.newData.money;
        var description = $scope.newData.description || "";
        
        $http.post("/api/records/add", {
            timestamp: timestamp,
            category_id: category_id,
            money: money,
            description: description
        }).success(function(record) {

            if ((!$scope.categories.period.start || $scope.categories.period.start <= record.timestamp) &&
                (!$scope.categories.period.end || record.timestamp <= $scope.categories.period.end)) {

                $scope.categories.all[record.category_id].moneyOfCategory += record.money;
                $scope.categories.all[record.category_id].countRecords += 1;

            }

            $scope.newData.money = "";
            $scope.newData.description = "";
        
            $scope.loading = false;
        
        }).error(function(err) {
        
            console.log(err);
            $scope.loading = false;
        
        });

    };

    $scope.moveRecords = function() {

        $scope.loading = true;
        
        var records_ids = Object.keys($scope.records);

        $http.post("/api/records/moveToCategory/" + $scope.newData.categoryId, {
            records_ids: records_ids
        }).success(function(response) {
            
            for(var id in $scope.records) {
                if ($scope.records.hasOwnProperty(id)) {
                    $scope.records[id].category_id = $scope.newData.categoryId;
                }
            }

            $modalInstance.close($scope.records);
            $scope.loading = false;

        }).error(function(err) {

            console.error(err);
            $scope.loading = false;

        });
        
    };
    
    $scope.updateRecord = function() {

        $scope.loading = true;
        
        var timestamp = new Date(
            $scope.newData.selectYear,
            $scope.newData.selectMonth,
            $scope.newData.selectDay
        ).getTime();

        var params = {
            money: +$scope.newData.money,
            description: $scope.newData.description || "",
            category_id: $scope.newData.categoryId,
            timestamp: timestamp
        };

        var id = Object.keys($scope.records)[0];

        $http.post("/api/records/update/" + id, params).success(function(record) {
            
            var response = {};
            response[record.id] = record;
        
            $modalInstance.close(response);
        
            $scope.loading = false;
        
        }).error(function(err) {
        
            console.error(err);
            $scope.loading = false;
        
        });
        
    };
        
    $scope.close = function() {

        $modalInstance.dismiss("Cancel");

    };

    function init() {

        for (var i = 1; i <= 31; i++) {
            $scope.days[i-1] = i;
        }

        if ($scope.countRecords == 1) {
            
            var id = Object.keys($scope.records)[0];

            var date = new Date($scope.records[id].timestamp);
            var money = $scope.records[id].money;
            var description = $scope.records[id].description;
            var category_id = $scope.records[id].category_id;

            $scope.newData = {
                selectDay: date.getDate().toString(),
                selectMonth: date.getMonth().toString(),
                selectYear: date.getFullYear().toString(),
                money: money,
                description: description,
                categoryId: category_id
            };

        } else if ($scope.countRecords > 1) {

            var firstIdOfRecords = Object.keys($scope.records)[0];
            $scope.newData.categoryId = $scope.records[firstIdOfRecords].category_id;

        } else {

            date = new Date();

            $scope.newData = {
                selectDay: date.getDate().toString(),
                selectMonth: date.getMonth().toString(),
                selectYear: date.getFullYear().toString(),
                money: "",
                description: "",
                categoryId: Object.keys($scope.categories.all)[0]
            };

        }

    }

    init();

});