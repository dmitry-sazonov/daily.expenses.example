app.controller("selectPeriodDirectiveCtrl", function($scope) {

    var seasons = {
        all: "all",
        week: "week",
        month: "month"
    };

    $scope.calendar = Date.calendar;

    if ($scope.expenses && $scope.expenses.period && $scope.expenses.period.season) {

        $scope.season = Object.keys($scope.expenses.period.season)[0];
        $scope.subseason = $scope.expenses.period.season[$scope.season].toString();
        $scope.expenses.period = $scope.expenses.period;

    } else if ($scope.earnings && $scope.earnings.period && $scope.earnings.period.season) {

        $scope.season = Object.keys($scope.earnings.period.season)[0];
        $scope.subseason = $scope.earnings.period.season[$scope.season].toString();
        $scope.earnings.period = $scope.earnings.period;

    } else {

        $scope.season = seasons.month;
        $scope.subseason = Date.calendar.current.month.toString();

    }

    $scope.$watch('season', function(season) {

        if ($scope.expenses && $scope.expenses.period && $scope.expenses.period.season) {
            if (Object.keys($scope.expenses.period.season)[0] == season) return;
        } else if ($scope.earnings && $scope.earnings.period && $scope.earnings.period.season) {
            if (Object.keys($scope.earnings.period.season)[0] == season) return;
        }

        switch(season) {

            case seasons.all:

                $scope.subseason = null;
                break;

            case seasons.week:

                $scope.subseason = Date.calendar.current.week.toString();
                break;

            case seasons.month:

                $scope.subseason = Date.calendar.current.month.toString();
                break;

        }

    });

    $scope.$watch('subseason', function(subseason) {

        if ($scope.expenses && $scope.expenses.period && $scope.expenses.period.season) {
            if ($scope.expenses.period.season[$scope.season] == subseason) return;
        } else if ($scope.earnings && $scope.earnings.period && $scope.earnings.period.season) {
            if ($scope.earnings.period.season[$scope.season] == subseason) return;
        }

        var period = {};

        switch($scope.season) {

            case seasons.week:

                var date = new Date().setWeek(subseason);

                period = {
                    start: date.getTime(),
                    end: date.toEndWeek().getTime()
                };

                period.season = {};
                period.season[seasons.week] = +subseason;

                break;

            case seasons.month:

                var month = new Date(new Date().setMonth(subseason));

                period = {
                    start: month.toStartMonth().getTime(),
                    end: month.toEndMonth().getTime()
                };

                period.season = {};
                period.season[seasons.month] = +subseason;

                break;

        }

        if ($scope.expenses && $scope.expenses.period) $scope.expenses.period = period;
        if ($scope.earnings && $scope.earnings.period) $scope.earnings.period = period;

    });
    
});
