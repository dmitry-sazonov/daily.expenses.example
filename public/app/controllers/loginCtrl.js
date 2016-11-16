app.controller("loginCtrl", function($scope, $rootScope, $http) {

    if ($rootScope.user.id != undefined) window.location.href = '/';
    
    $scope.signInParams = {
        username: "",
        password: ""
    };

    $scope.signUpParams = {
        username: "",
        password: "",
        secondPwd: "",
        email: ""
    };

    $scope.params = {
        signInFormShow: true,
        signUpFormShow: false
    };
    

    $scope.signIn = function() {

        $http.post("/signIn", {
            username: $scope.signInParams.username,
            password: $scope.signInParams.password
        }).success(function(data) {

            window.location.href = '/main';

        }).error(function(data, statusCode) {

            console.error(data, statusCode);

        });

    };

    $scope.signUp = function() {

        $http.post("/signUp", {
            username: $scope.signUpParams.username,
            password: $scope.signUpParams.password,
            email: $scope.signUpParams.email
        }).success(function(data) {

            console.log(data);

        }).error(function(data) {

            console.log(data);

        });

    };

    $scope.showSignInForm = function() {

        $scope.params.signInFormShow = true;
        $scope.params.signUpFormShow = false;

    };

    $scope.showSignUpForm = function() {

        $scope.params.signInFormShow = false;
        $scope.params.signUpFormShow = true;

    };

});