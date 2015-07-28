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

    $scope.moveCursor = function (cursor) {
        if ($scope.lastCursor.columnIndex == cursor.columnIndex) {
            return;
        }
        loadGameCursor(cursor.columnIndex);
        $scope.lastCursor = cursor;
    };


    function availableColumns() {
        var movesArray = new Array();
        for (var i = 0; i < $scope.totalColumns; i++) {
            if ($scope.gameZone[0][i].player === 0) {
                movesArray.push(i);
            }
        }
        return movesArray;
    }


    function availableFirstRow(col, player) {
        for (var i = 0; i < $scope.totalRows; i++) {
            if ($scope.gameZone[i][col].player !== 0) {
                break;
            }
        }
        return i - 1;
    }

    function moveAndPlaceDisk() {
        $scope.currentRow = availableFirstRow($scope.currentColumn, $scope.currentPlayer);
        $scope.gameZone[$scope.currentRow][$scope.currentColumn] = new gameZoneCell($scope.currentPlayer, $scope.currentRow, $scope.currentColumn);
    }

    $scope.movesStorage = [];

    $scope.peerMove = false;

    $scope.dropDiscToZone = function (cursor) {

        if (availableColumns().indexOf(cursor.columnIndex) != -1) {
            $scope.currentColumn = cursor.columnIndex;
            moveAndPlaceDisk();
            $scope.lastMove = new gameZoneCell($scope.currentPlayer, $scope.currentRow, $scope.currentColumn);
            $scope.movesStorage.push($scope.lastMove);
            
            checkForWin();
        }
    };


    var checkForWin = function() {
        if (gameLogic.checkWin($scope)) {
            var winPlayer = $scope.currentPlayer;
            
            setTimeout(function () {
                alert("Player " + winPlayer + " Wins");
                buildGameZone();
                loadGameCursor(0);                
                $scope.$digest();
            }, 300);
        } else {
            toggleCursorOfPlayer();
        }
    }



    $scope.undoLastMove = function () {
        if ($scope.lastMove) {
            $scope.gameZone[$scope.lastMove.rowIndex][$scope.lastMove.columnIndex].player = $scope.playerType.None;
            $scope.movesStorage.pop();
            $scope.lastMove = undefined;
            toggleCursorOfPlayer();
        }
    };


    $scope.startNewGame = function () {
        $scope.movesStorage = [];
        $scope.currentPlayer = $scope.playerType.One;
        buildGameZone();
        loadGameCursor(0);
    };    

    var getNextPlayer = function () {
        if ($scope.currentPlayer === $scope.playerType.One) {
            return $scope.playerType.Two;
        }
        return $scope.playerType.One;
    };


}]);

