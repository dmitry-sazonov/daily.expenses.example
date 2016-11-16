"use strict";

var app = angular.module("DE", ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
    $routeProvider
        .when('/', {
            templateUrl: '/templates/index',
            controller: 'indexCtrl'
        })
        .when('/main', {
            templateUrl: '/templates/main',
            controller: 'mainCtrl'
        })
        .when('/login', {
            templateUrl: '/templates/login',
            controller: "loginCtrl"
        })
        .when('/expenses', {
            templateUrl: '/templates/expenses',
            controller: "expensesCtrl"
        })
        .when('/earnings', {
            templateUrl: '/templates/earnings',
            controller: "earningsCtrl"
        })
        // .when('/graphics', {
        //     templateUrl: '/templates/graphics',
        //     controller: "graphicsCtrl"
        // })
        // .when('/plans', {
        //     templateUrl: '/templates/plans',
        //     controller: "plansCtrl"
        // })
        .when('/debts', {
            templateUrl: '/templates/debts',
            controller: "debtsCtrl"
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);


app.run(function($rootScope, $location) {

    var pageWithAuth = [
        "/expenses",
        "/earnings",
        // "/graphics",
        // "/plans",
        "/main",
        "/debts"
    ];

    var pageWithUnauth = [
        "/",
        "/login"
    ];
    
    $rootScope.$on("$routeChangeStart", function(event, next) {

        var isAuth = (($rootScope.user && $rootScope.user.id) != undefined);
        
        if (!isAuth && pageWithAuth.indexOf(next.originalPath) != -1) {

            $location.path("/");

        } else if (isAuth && pageWithUnauth.indexOf(next.originalPath) != -1) {

            $location.path("/main");

        }
        
    });

});