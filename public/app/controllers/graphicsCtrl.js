app.controller("graphicsCtrl", function($scope, $rootScope, $http, $modal, categoriesService) {

    $scope.categoriesOfExpenses = categoriesService.expenses;
    $scope.categoriesOfExpenses.period = {};
    
    $scope.calendar = Date.calendar;

    $scope.graphicsSettings = {
        category: "all",
        oneMonth: "",
        severalWeeks: "5",
        period: "oneMonth"
    };

    $scope.getGraphics = function() {

        function getAllChildsOfCategory(category) {

            var categories = [];

            for (var id in category.childs) {
                if (category.childs.hasOwnProperty(id)) {
                    categories.push(id);
                    categories = categories.concat(getAllChildsOfCategory(category.childs[id]));
                }
            }

            return categories;

        }

        var categoryId = $scope.graphicsSettings.category;
        var oneMonth = $scope.graphicsSettings.oneMonth;
        var severalWeeks = $scope.graphicsSettings.severalWeeks;

        var firstTimestamp = 0;
        var lastTimestamp = 0;

        switch ($scope.graphicsSettings.period) {
            case "oneMonth":

                var date = new Date();
                date.setMonth(oneMonth);
                date.setHours(0,0,0,0);

                firstTimestamp = date.setDate(1);

                date.setMonth( date.getMonth() + 1 );
                lastTimestamp = date.setMilliseconds(-1);
                
                break;

            case "severalWeeks":

                date = new Date();
                date = new Date(date.setDate(date.getDate() + 8 - date.getDay()));

                firstTimestamp = new Date(date.setHours(0,0,0,0)).setDate(date.getDate()-7*severalWeeks);
                lastTimestamp = date.setHours(0,0,0,-1);

                break;
        }

        var categoriesOfExpenses_Ids = [];

        if (categoryId == "all") {

            for (var id in $scope.categoriesOfExpenses.all) {
                categoriesOfExpenses_Ids.push(id);
            }

        } else {

            categoriesOfExpenses_Ids.push(categoryId);

            var childs = getAllChildsOfCategory($scope.categoriesOfExpenses.all[categoryId]);
            categoriesOfExpenses_Ids = categoriesOfExpenses_Ids.concat(childs);

        }

        //console.log(new Date(firstTimestamp));
        //console.log(new Date(lastTimestamp));

        $http.get("/api/records/get/betweenTimestamps/" + firstTimestamp + "/" + lastTimestamp, {
            params: {
                categoryIds: categoriesOfExpenses_Ids
            }
        }).success(function(records) {

            //console.log("records", records);

            var labelForGraphics;

            var labelsForGraphics = [];
            var dataForGraphics = [];

            switch ($scope.graphicsSettings.period) {
                case "oneMonth":

                    labelForGraphics = Date.calendar.months[oneMonth];

                    for (var i=1; i<=Date.getCountDaysOfMonths(oneMonth); i++) {
                        labelsForGraphics.push(i);
                        dataForGraphics.push(0);
                    }


                    records.forEach(function(item) {

                        dataForGraphics[new Date(item.timestamp).getDate()-1] += item.money;

                    });

                    break;

                case "severalWeeks":

                    labelForGraphics = severalWeeks + (severalWeeks < 5 ? " недели" : " недель");

                    var date = new Date(firstTimestamp);

                    // labels
                    for (var i=0; i<severalWeeks; i++) {

                        var label = date.toDDMM() + " - ";
                        date.addDays(7).addMilliseconds(-1);
                        label += date.toDDMM();
                        labelsForGraphics.push(label);
                        date.addMilliseconds(1);

                        dataForGraphics.push(0);

                    }

                    records.forEach(function(item) {

                        for (var i=1; i<=severalWeeks; i++) {

                            var _date = new Date(date);
                            _date.addDays(-7*i);

                            if (_date.getTime() <= item.timestamp) {
                                dataForGraphics[severalWeeks-i] += item.money;
                                break;
                            }

                        }

                    });

                    break;
            }



            var chart = $("#chart");
            chart.html("<canvas></canvas>");
            var ctx = $("#chart canvas")[0];

            var data = {
                type: 'bar',
                data: {
                    labels: labelsForGraphics,
                    datasets: [{
                        label: labelForGraphics,
                        data: dataForGraphics,
                        backgroundColor: 'rgba(255,0,0,0.2)',
                        borderColor: 'rgba(255,0,0,1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    animation: {
                        duration: 1500
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                // max: 7000,
                                min: 0
                                ,stepSize: 500
                            }
                        }]
                    }
                }
            };

           new Chart(ctx, data);

        }).error(function(err) {

        });

    };

    function init() {

        var now = new Date();

        $scope.graphicsSettings.oneMonth = now.getMonth().toString();

    }
    
    function addDaysToDate(date, countDays) {

        return new Date(date.getFullYear(), date.getMonth(), date.getDate()+countDays);

    }

    init();
    
});