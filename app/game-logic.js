'use strict';
app.factory('gameLogic', [function () {


    var consicutiveHorizontally = 0;
    var consicutiveVertically = 0;

    var checkHorizontally = function ($scope) {
        for (var row = 0; row < $scope.totalRows; row++) {
            consicutiveHorizontally = 0;
            for (var col = 0; col < $scope.totalColumns; col++) {

                var cell = $scope.gameZone[row][col];
                if (cell.player === $scope.currentPlayer) {
                    consicutiveHorizontally++;
                } else {
                    consicutiveHorizontally = 0;
                }
                if (consicutiveHorizontally > 3) {
                    return true;
                }
            }
        }
        return false;
    };


    var checkVertically = function ($scope) {
        for (var col = 0; col < $scope.totalColumns; col++) {
            consicutiveVertically = 0;
            for (var row = 0; row < $scope.totalRows; row++) {
                var cell = $scope.gameZone[row][col];
                if (cell.player === $scope.currentPlayer) {
                    consicutiveVertically++;
                } else {
                    consicutiveVertically = 0;
                }
                if (consicutiveVertically > 3) {
                    return true;
                }
            }
        }
        return false;
    };


    var checkDiagonally = function ($scope) {
        for (var row = 0; row < $scope.totalRows; row++) {
            consicutiveHorizontally = 0;
            for (var col = 0; col < $scope.totalColumns; col++) {

                for (var x = row, y = col, length = 0; x < $scope.totalRows && y < $scope.totalColumns ; x++, y++) {
                    var cell = $scope.gameZone[x][y];
                    if (cell.player === $scope.currentPlayer) {
                        length++;
                        //consicutiveDiagonallyRight++;
                    } else {
                        //consicutiveHorizontally = 0;
                        length = 0;
                    }
                    if (length > 3) {
                        return true;
                    }
                }

                for (var x = row, y = $scope.totalColumns - col - 1, length = 0; x < $scope.totalRows && y >= 0 ; x++, y--) {
                    var cell = $scope.gameZone[x][y];

                    if (cell.player === $scope.currentPlayer) {
                        length++;
                        //consicutiveDiagonallyRight++;
                    } else {
                        //consicutiveHorizontally = 0;
                        length = 0;
                    }
                    if (length > 3) {
                        return true;
                    }
                }

            }
        }
        return false;
    };

    var checkWin = function ($scope) {

        if (checkHorizontally($scope) || checkVertically($scope) || checkDiagonally($scope)) {
            return true;
        }
        return false;
    };


    return {
        checkWin: checkWin
    };

}]);
