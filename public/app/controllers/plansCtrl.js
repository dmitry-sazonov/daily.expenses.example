app.controller("plansCtrl", function($scope, $rootScope, $http, $modal, categoriesService) {

    $scope.categories = categoriesService;
    $scope.categories.expenses.period = {};

    $scope.calendar = Date.calendar;

    $scope.plans = {};
    
    $scope.savePlanCategory = function(category, month) {

        var value = $scope.plans[category.id] && $scope.plans[category.id][month];

        if (!value) return;

        var year = Date.calendar.current.year;

        var data = {
            plan: {}
        };


        data.plan[year] = {
            month: {}
        };

        data.plan[year].month = {};
        data.plan[year].month[month] = value;

        $http.post("/api/categories/update/" + category.id + "/plan", data).success(function(response) {
            
            console.log(response);
            
        }).error(function(err) {
            
            console.error(err);
            
        });
        
    };

    $scope.$watch("categories.expenses.all", function() {

        $scope.plans = {};

        for(var id in $scope.categories.expenses.all) {
            if ($scope.categories.expenses.all.hasOwnProperty(id)) {

                var plans = $scope.categories.expenses.all[id].plans;

                if (plans && plans["2016"] && plans["2016"]["month"]) {
                    $scope.plans[id] = JSON.parse(JSON.stringify(plans["2016"]["month"]));
                }

            }
        }

    }, true);

});