"use strict";

describe("gameCtrl", function() {
    var scope;
    var controller;

    beforeEach(function() {

        module("app");

        inject(function(_$rootScope_, $controller) {
            scope = _$rootScope_.$new();
            controller = $controller("gameCtrl", {$scope: scope});
        });
    });

    it("Should check totalRows is 6", function() {
        expect(scope.totalRows).toBe(6);
    });
    
    
    it("Should check totalColumns is 7", function() {
        expect(scope.totalColumns).toBe(7);
    });
    
    
    it("Should check initial currentPlayer is 1", function() {
        expect(scope.currentPlayer).toBe(1);
    });
    

});
