"use strict";

app.controller('gameCtrl', ['$scope', function ($scope) {
    console.log('gameCtrl is running...');


$scope.totalRows = 6;
    $scope.totalColumns = 7;
    $scope.gameZone = [];
    $scope.currentRow = undefined;
    $scope.currentColumn = undefined;
    $scope.playerType = {
        One: 1,
        Two: 2,
        None: 0
    };
    $scope.currentPlayer = $scope.playerType.One;

    $scope.gameCursor = new Array($scope.totalColumns);

    var loadGameCursor = function (columnIndex) {
        _.each($scope.gameCursor, function (cursor, index) {
            var cursorObj = new gameCursor(false, index, $scope.playerType.None);
            $scope.gameCursor[index] = cursorObj;
        });
        $scope.gameCursor[columnIndex] = new gameCursor(false, columnIndex, $scope.currentPlayer);
        $scope.lastCursor = _.first($scope.gameCursor);
    };

    var toggleCursorOfPlayer = function () {
        loadGameCursor(0);
        $scope.currentPlayer = getNextPlayer();// $scope.currentPlayer === 1 ? $scope.playerType.Two : $scope.playerType.One;
        $scope.gameCursor[0] = new gameCursor(false, 0, $scope.currentPlayer);
    }

    loadGameCursor(0);

    function gameCursor(isAvailable, columnIndex, player) {
        this.isAvailable = isAvailable;
        this.columnIndex = columnIndex;
        this.player = player;
    }

    function gameZoneCell(player, rowIndex, columnIndex) {
        this.player = player;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    var buildGameZone = function () {
        $scope.gameZone = [];
        for (var row = 0; row < $scope.totalRows; row++) {
            $scope.gameZone[row] = new Array();
            for (var column = 0; column < $scope.totalColumns; column++) {
                $scope.gameZone[row].push(new gameZoneCell($scope.playerType.None, row, column));
            }
        }
    };

    buildGameZone();


}]);

