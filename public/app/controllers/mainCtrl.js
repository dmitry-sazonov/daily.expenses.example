app.controller("mainCtrl", function($scope, $rootScope, $http, categoriesService, debtsService) {

    $scope.loading = false;

    $scope.categories = {
        expenses: categoriesService.expenses,
        earnings: categoriesService.earnings
    };

    $scope.debts = {
        take: debtsService.take,
        give: debtsService.give
    };

    $scope.sums = {
        categories: {
            expenses: 0,
            earnings: 0
        },
        debts: {
            take: {
                money: 0,
                payment: 0
            },
            give: {
                money: 0,
                payment: 0
            }
        },
        total: {
            earnings: 0,
            expenses: 0
        }
    };

    $scope.$watchGroup(["categories.earnings.loading", "categories.expenses.loading"], function(loadings) {

        var earnings_loading = loadings[0];
        var expenses_loading = loadings[1];

        $scope.loading = earnings_loading || expenses_loading;

        function getSumDebt(type, period) {

            var debtMoney = 0;

            for (var id in $scope.debts[type]) {
                if ($scope.debts[type].hasOwnProperty(id)) {

                    $scope.debts[type][id].payments.forEach(function(payment) {

                        if (period && period.start && period.start > payment.timestamp) return;
                        if (period && period.end && period.end < payment.timestamp) return;
                        if (payment.money <= 0) return;

                        debtMoney += payment.money;

                    });

                    if (period && period.start && period.start > $scope.debts[type][id].timestamp) continue;
                    if (period && period.end && period.end < $scope.debts[type][id].timestamp) continue;

                    debtMoney += $scope.debts[type][id].startMoney;

                }
            }

            return debtMoney;

        }

        function getSumReturnedDebt(type, period) {

            var getSumReturnedDebt = 0;

            for (var id in $scope.debts[type]) {
                if ($scope.debts[type].hasOwnProperty(id)) {
                    $scope.debts[type][id].payments.forEach(function(payment) {

                        if (period && period.start && period.start > payment.timestamp) return;
                        if (period && period.end && period.end < payment.timestamp) return;
                        if (payment.money > 0) return;

                        getSumReturnedDebt += -payment.money;

                    });
                }
            }

            return getSumReturnedDebt;

        }

        if (!earnings_loading) {

            var period = $scope.categories.earnings.period;
            $scope.sums.categories.earnings = $scope.categories.earnings.allMoney;
            $scope.sums.debts.take.money = getSumDebt("take", period);
            $scope.sums.debts.give.payment = getSumReturnedDebt("give", period);
            $scope.sums.total.earnings = $scope.sums.categories.earnings + $scope.sums.debts.take.money + $scope.sums.debts.give.payment;

        }

        if (!expenses_loading) {

            var period = $scope.categories.expenses.period;
            $scope.sums.categories.expenses = $scope.categories.expenses.allMoney;
            $scope.sums.debts.give.money = getSumDebt("give", period);
            $scope.sums.debts.take.payment = getSumReturnedDebt("take", period);
            $scope.sums.total.expenses = $scope.sums.categories.expenses + $scope.sums.debts.give.money + $scope.sums.debts.take.payment;

        }

    });

});