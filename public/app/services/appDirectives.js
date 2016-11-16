app.directive("selectPeriod", function() {
    return {
        templateUrl: "/templates/directives/selectPeriod",
        scope: {
            expenses: "=",
            earnings: "="
        },
        controller: "selectPeriodDirectiveCtrl"
    };
});

app.directive("blockLoading", function() {
    return {
        templateUrl: "/templates/directives/blockLoading",
        scope: {
            loading: "="
        }
    }
});