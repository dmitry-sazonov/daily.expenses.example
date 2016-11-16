app.controller("debtsCtrl", function($scope, $rootScope, $http, $modal, debtsService) {

    $scope.debts = {
        take: debtsService.take,
        give: debtsService.give
    };
    
    setTimeout(function() {
        console.log($scope.debts);
    }, 2000);
    
    $scope.addDebts = function(debt_type) {

        var upsertDebtModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertDebt',
            controller: 'upsertDebtCtrl',
            size: 'md',
            resolve: {
                debts: function() {
                    return $scope.debts[debt_type];
                },
                edit_mode: function() {
                    return false;
                },
                edit_debt_id: function() {
                    return null;
                }
            }
        });

        upsertDebtModalInstance.result.then(function(debt) {

            // OK button clicked
            console.log(debt);

        }, function (modalResult) {

            //Cancel button clicked

        });
        
    };
    
    $scope.editDebt = function(debt) {
        
        var upsertDebtModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertDebt',
            controller: 'upsertDebtCtrl',
            size: 'md',
            resolve: {
                debts: function() {
                    return $scope.debts[debt.type];
                },
                edit_mode: function() {
                    return true;
                },
                edit_debt_id: function() {
                    return debt.id;
                }
            }
        });

        upsertDebtModalInstance.result.then(function(debt) {

            // OK button clicked
            
        }, function(modalResult) {

            // Cancel button clicked

        });
        
    };

});