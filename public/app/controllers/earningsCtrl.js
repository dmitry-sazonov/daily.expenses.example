app.controller("earningsCtrl", function($scope, $rootScope, $http, $modal, categoriesService, recordsService) {

    $scope.categories = categoriesService.earnings;
    $scope.records = recordsService.earnings;

    setTimeout(function() {
        console.log($scope.categories);
    }, 2000);

    $scope.addCategory = function(category) {

        var addCategoryModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertCategory',
            controller: 'upsertCategoryCtrl',
            size: 'md',
            resolve: {
                category: function() {
                    return category || null
                },
                edit_mode: function() {
                    return false;
                },
                category_type: function() {
                    return "earnings"
                }
            }
        });

        addCategoryModalInstance.result.then(function(category) {

            // OK button clicked
            $scope.categories.addCategory(category);

            // console.log($scope.categories);

        }, function(modalResult) {

            //Cancel button clicked

        });

    };

    $scope.updateCategory = function(category) {

        var upsertCategoryModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertCategory',
            controller: 'upsertCategoryCtrl',
            size: 'md',
            resolve: {
                category: function() {
                    return category;
                },
                edit_mode: function() {
                    return true;
                },
                category_type: function() {
                    return "earnings"
                }
            }
        });

        upsertCategoryModalInstance.result.then(function (modalResult) {

            // OK button clicked
            if (modalResult.status_code == 410) { // 410 - Gone (удален)

                var category = $scope.categories.all[modalResult.category_id];

                if (category.parent) {

                    delete $scope.categories.all[category.parent.id].childs[category.id];

                } else {

                    delete $scope.categories[modalResult.category_id];

                }

                delete $scope.categories.all[modalResult.category_id];

            } else if (modalResult.status_code == 200) { // 200 - OK (переименована)

                $scope.categories.all[modalResult.category.id].name = modalResult.category.name;

            }

        }, function (modalResult) {

            //Cancel button clicked

        });
    };

    $scope.addRecords = function() {

        var upsertRecordsModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertRecords',
            controller: 'upsertRecordsCtrl',
            size: 'md',
            windowClass: "right-modal",
            resolve: {
                countRecords: function() {
                    return 0;
                },
                edit_mode: function() {
                    return false;
                },
                records: function() {
                    return null;
                },
                categories: function() {
                    return $scope.categories
                }
            }
        });

        upsertRecordsModalInstance.result.then(function (modalResult) {

            // OK button clicked

        }, function (modalResult) {

            // Cancel button clicked

        });

    };

    $scope.getRecords = function(category) {

        // $scope.records.getRecordsByCategoryId(category.id, $scope.categories.period, function(err, records) {
        //
        //     if (err) return console.error(err);
        //
        //     console.log(records);
        //
        // });

    };

    // $scope.updateRecord = function(record) {
    //
    //     // console.log(record);
    //
    //     var records = {};
    //     records[record.id] = {
    //         id: record.id,
    //         category_id: record.category_id,
    //         timestamp: record.timestamp,
    //         description: record.description,
    //         money: record.money
    //     };
    //
    //     var upsertRecordsModalInstance = $modal.open({
    //         animation: true,
    //         templateUrl: '/modals/upsertRecords',
    //         controller: 'upsertRecordsCtrl',
    //         size: 'md',
    //         windowClass: "right-modal",
    //         resolve: {
    //             countRecords: function() {
    //                 return 1;
    //             },
    //             edit_mode: function() {
    //                 return true;
    //             },
    //             records: function() {
    //                 return records;
    //             },
    //             categories: function() {
    //                 return $scope.categories
    //             }
    //         }
    //     });
    //
    //     upsertRecordsModalInstance.result.then(upsertRecordsModalResult, function (modalResult) {
    //
    //         // Cancel button clicked
    //
    //     });
    //
    // };

    // $scope.updateRecords = function() {
    //
    //     var records = {};
    //
    //     for (var id in $scope.listRecords) {
    //         if ($scope.listRecords.hasOwnProperty(id)) {
    //             if ($scope.listRecords[id].selected) {
    //                 records[id] = JSON.parse(JSON.stringify($scope.listRecords[id]));
    //             }
    //         }
    //     }
    //
    //     var upsertRecordsModalInstance = $modal.open({
    //         animation: true,
    //         templateUrl: '/modals/upsertRecords',
    //         controller: 'upsertRecordsCtrl',
    //         size: 'md',
    //         windowClass: "right-modal",
    //         resolve: {
    //             countRecords: function() {
    //                 return Object.keys(records).length;
    //             },
    //             edit_mode: function() {
    //                 return true;
    //             },
    //             records: function() {
    //                 return records;
    //             },
    //             categories: function() {
    //                 return $scope.categories
    //             }
    //         }
    //     });
    //
    //     upsertRecordsModalInstance.result.then(upsertRecordsModalResult, function (modalResult) {
    //
    //         // Cancel button clicked
    //
    //     });
    //
    // };

    function init() {

    }

    // function upsertRecordsModalResult(records) {
    //
    //     for (var id in records) {
    //         if (records.hasOwnProperty(id)) {
    //
    //             $scope.categories.all[$scope.listRecords[id].category_id].moneyOfCategory -= $scope.listRecords[id].money;
    //             $scope.categories.all[$scope.listRecords[id].category_id].countRecords--;
    //
    //             console.log($scope.categories.period);
    //
    //             if ((!$scope.categories.period.start || $scope.categories.period.start <= records[id].timestamp) &&
    //                 (!$scope.categories.period.end || records[id].timestamp <= $scope.categories.period.end)) { // NOT moved to another time
    //
    //                 $scope.categories.all[records[id].category_id].moneyOfCategory += records[id].money;
    //                 $scope.categories.all[records[id].category_id].countRecords++;
    //
    //                 if (records[id].category_id != $scope.listRecords[id].category_id) { // moved in another category
    //                     delete $scope.listRecords[id];
    //                 } else {
    //                     $scope.listRecords[id] = records[id];
    //                     $scope.listRecords[id].selected = true;
    //                 }
    //
    //             } else {
    //                 delete $scope.listRecords[id];
    //             }
    //
    //         }
    //     }
    //
    // }

    init();

});