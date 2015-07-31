"use strict";

var app = angular.module("app", ['ngRoute', 'firebase']);

app.config(function ($routeProvider, $locationProvider) {

    $routeProvider
        .when("/", {
        templateUrl: "/views/c4.html",
        controller: 'gameCtrl'
        }).
        otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);

});
