app.controller('settingsOfGraphicsCtrl', function($scope, $rootScope, $modalInstance, $http) {

    $scope.loading = false;

    $scope.data = {
        period: "all"
    };

    $scope.create = function() {

        console.log($rootScope.user);
        
        var result = {
            type: 'line',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)'
                    ],
                    borderWidth: 1
                }]
            }
        };
        
        $modalInstance.close(result);
        
    };
    
    $scope.close = function() {

        $modalInstance.dismiss("Cancel");

    };

});