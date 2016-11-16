app.controller('upsertDebtCtrl', function($scope, $rootScope, $modalInstance, $http, debts, edit_mode, edit_debt_id) {

    $scope.loading = false;

    $scope.days = [];
    $scope.months = Date.calendar.months;
    $scope.years = [2015, 2016, 2017];

    $scope.debts = debts;
    $scope.editMode = edit_mode;
    $scope.editDebt = debts[edit_debt_id];
    $scope.tab = $scope.editMode ? "tabPaymentsDebt" : "tabUpsertDebt";
    
    $scope.newData = {
        selectDay: new Date().getDate().toString(),
        selectMonth: new Date().getMonth().toString(),
        selectYear: new Date().getFullYear().toString(),
        name: "",
        startMoney: null,
        comment: ""
    };

    $scope.upsertPaymentsData = {
        selectDay: new Date().getDate().toString(),
        selectMonth: new Date().getMonth().toString(),
        selectYear: new Date().getFullYear().toString(),
        money: null,
        comment: ""
    };

    $scope.addDebt = function() {

        $scope.loading = true;

        var date = new Date();

        date.setDate($scope.newData.selectDay);
        date.setMonth($scope.newData.selectMonth);
        date.setFullYear($scope.newData.selectYear);

        var debt = {
            name: $scope.newData.name,
            startMoney: $scope.newData.startMoney,
            comment: $scope.newData.comment,
            timestamp: date.getTime()
        };

        $scope.debts.addDebt(debt, function(err, debt) {
            
            $scope.loading = false;

            if (err) return console.error(err);
            
            $modalInstance.close(debt);
            
        });

    };

    $scope.updateDebt = function() {

        $scope.loading = true;

        var date = new Date();

        date.setDate($scope.newData.selectDay);
        date.setMonth($scope.newData.selectMonth);
        date.setFullYear($scope.newData.selectYear);

        var debt = {
            id: $scope.editDebt.id,
            name: $scope.newData.name,
            startMoney: $scope.newData.startMoney,
            comment: $scope.newData.comment,
            timestamp: date.getTime()
        };

        $scope.debts.updateDebt(debt, function(err, debt) {
            
            $scope.loading = false;

            if (err) return console.error(err);

            $modalInstance.close(debt);

        });
        
    };

    $scope.addPaymentDebt = function() {

        $scope.loading = true;

        var startTimestamp = $scope.editDebt.timestamp;

        var paymentDate = new Date();
        paymentDate.setFullYear($scope.upsertPaymentsData.selectYear);
        paymentDate.setMonth($scope.upsertPaymentsData.selectMonth);
        paymentDate.setDate($scope.upsertPaymentsData.selectDay);
        
        var paymentTimestamp = paymentDate.getTime();
        
        if (paymentTimestamp - startTimestamp < 0) {
            console.error("Date is incorrect");
            $scope.loading = false;
            return;
        }
        
        var comment = $scope.upsertPaymentsData.comment;
        var money = $scope.upsertPaymentsData.money;

        if ($scope.tab == 'tabMinusPaymentDebt') {
            money *= -1;
        }

        var payment = {
            timestamp: paymentTimestamp,
            money: money,
            comment: comment
        };
        
        $scope.debts.addPayment($scope.editDebt.id, payment, function(err, debt) {
            
            $scope.loading = false;

            if (err) return console.error(err);

            $modalInstance.close(debt);

        });

    };
    
    $scope.showTab = function(tabName) {
        
        $scope.tab = tabName;
        
    };
    
    $scope.close = function() {

        $modalInstance.dismiss("Cancel");

    };

    function init() {

        for (var i = 1; i <= 31; i++) {
            $scope.days[i-1] = i;
        }

        if ($scope.editMode) {

            var date = new Date($scope.editDebt.timestamp);

            $scope.newData.selectDay = date.getDate().toString();
            $scope.newData.selectMonth = date.getMonth().toString();
            $scope.newData.selectYear = date.getFullYear().toString();

            $scope.newData.name = $scope.editDebt.name;
            $scope.newData.startMoney = $scope.editDebt.startMoney;
            $scope.newData.comment = $scope.editDebt.comment;

        }

    }

    init();
    
});