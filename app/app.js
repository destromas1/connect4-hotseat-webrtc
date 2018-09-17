"use strict";

var app = angular.module("app", ["ngRoute", "firebase"]);

app.config(function($routeProvider, $locationProvider) {
  var config = {
    apiKey: "AIzaSyBobZeUv-PofD8shmd0Qx8y9OtnAs7Ifcw",
    authDomain: "connect4-bc0dd.firebaseapp.com",
    databaseURL: "https://connect4-bc0dd.firebaseio.com",
    projectId: "connect4-bc0dd",
    storageBucket: "connect4-bc0dd.appspot.com",
    messagingSenderId: "798183539694"
  };
  firebase.initializeApp(config);

  $routeProvider
    .when("/", {
      templateUrl: "/views/c4.html",
      controller: "gameCtrl"
    })
    .otherwise({ redirectTo: "/" });

  $locationProvider.html5Mode(true);
});
