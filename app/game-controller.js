"use strict";

var PEER_JS_API_KEY;

PEER_JS_API_KEY = "ft8poufp4eut0529";

app.controller("gameCtrl", [
  "$scope",
  "$firebaseArray",
  "connectFourDataContext",
  "gameLogic",
  function($scope, $firebaseArray, connectFourDataContext, gameLogic) {
    console.log("gameCtrl is running...");

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

    var loadGameCursor = function(columnIndex) {
      _.each($scope.gameCursor, function(cursor, index) {
        var cursorObj = new gameCursor(false, index, $scope.playerType.None);
        $scope.gameCursor[index] = cursorObj;
      });
      $scope.gameCursor[columnIndex] = new gameCursor(
        false,
        columnIndex,
        $scope.currentPlayer
      );
      $scope.lastCursor = _.first($scope.gameCursor);
    };

    var toggleCursorOfPlayer = function() {
      loadGameCursor(0);
      $scope.currentPlayer = getNextPlayer();
      $scope.gameCursor[0] = new gameCursor(false, 0, $scope.currentPlayer);
    };

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

    var buildGameZone = function() {
      $scope.gameZone = [];
      for (var row = 0; row < $scope.totalRows; row++) {
        $scope.gameZone[row] = new Array();
        for (var column = 0; column < $scope.totalColumns; column++) {
          $scope.gameZone[row].push(
            new gameZoneCell($scope.playerType.None, row, column)
          );
        }
      }
    };

    buildGameZone();

    $scope.moveCursor = function(cursor) {
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

    // https://console.firebase.google.com/u/1/project/connect4-bc0dd/database/connect4-bc0dd/data
    function moveAndPlaceDisk() {
      $scope.currentRow = availableFirstRow(
        $scope.currentColumn,
        $scope.currentPlayer
      );
      $scope.gameZone[$scope.currentRow][
        $scope.currentColumn
      ] = new gameZoneCell(
        $scope.currentPlayer,
        $scope.currentRow,
        $scope.currentColumn
      );
    }

    $scope.movesStorage = [];

    $scope.peerMove = false;

    $scope.dropDiscToZone = function(cursor) {
      if (availableColumns().indexOf(cursor.columnIndex) != -1) {
        $scope.currentColumn = cursor.columnIndex;
        moveAndPlaceDisk();
        $scope.lastMove = new gameZoneCell(
          $scope.currentPlayer,
          $scope.currentRow,
          $scope.currentColumn
        );
        $scope.movesStorage.push($scope.lastMove);

        checkForWin();

        sendEventToAllPeers(cursor);
      }
    };

    var checkForWin = function() {
      if (gameLogic.checkWin($scope)) {
        var winPlayer = $scope.currentPlayer;

        setTimeout(function() {
          alert("Player " + winPlayer + " Wins");
          buildGameZone();
          loadGameCursor(0);
          connectFourDataContext.postMoves($scope.movesStorage);
          $scope.$digest();
        }, 300);
      } else {
        toggleCursorOfPlayer();
      }
    };

    $scope.undoLastMove = function() {
      if ($scope.lastMove) {
        $scope.gameZone[$scope.lastMove.rowIndex][$scope.lastMove.columnIndex].player = $scope.playerType.None;
        $scope.movesStorage.pop();
        $scope.lastMove = undefined;
        toggleCursorOfPlayer();
      }
    };

    $scope.startNewGame = function() {
      $scope.movesStorage = [];
      $scope.currentPlayer = $scope.playerType.One;
      buildGameZone();
      loadGameCursor(0);
    };

    $scope.replayGame = function() {
      buildGameZone();
      loadGameCursor(0);

      var moves = connectFourDataContext.getLastGame();
      if (!moves || moves.length === 0) {
        return;
      }
      var i = 0;
      function drawMovesForReplay() {
        setTimeout(function() {
          var move = moves[i];
          $scope.gameZone[move.rowIndex][move.columnIndex].player = move.player;
          $scope.$digest();

          i++;
          if (i < moves.length) {
            drawMovesForReplay();
          }
        }, 1000);
      }
      drawMovesForReplay();
    };

    var getNextPlayer = function() {
      if ($scope.currentPlayer === $scope.playerType.One) {
        return $scope.playerType.Two;
      }
      return $scope.playerType.One;
    };

    /////////////////// Peer Gaming Implementation

    $scope.myId = +new Date();

    $scope.peerConnections = {};
    $scope.connectedUsers = {};

    $scope.channelData = {
      cursor: $scope.gameCursor,
      gameArea: $scope.gameZone
    };

    $scope.peer = new Peer($scope.myId, {
      // key: PEER_JS_API_KEY,
      debug: 0
    });

    // var ref = new Firebase("https://c4.firebaseio.com/c4peer");

    var ref = firebase
      .database()
      .ref()
      .child("peers");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.connectedUsers = $firebaseArray(ref);

    $scope.peer.on("open", function(id) {
      console.log("scope.peer.on('open'", id);

      $scope.connectedUsers.$add({ peerId: id });

      return $scope.$apply(function() {
        $scope.peerConnections[id] = id;
      });
    });

    $scope.peer.on("connection", function(conn) {
      console.log("scope.peer.on('connection'", conn);

      return $scope.$apply(function() {
        setupPeerConnection(conn);
      });
    });

    $scope.peer.on("error", function(err) {
      console.log("scope.peer.on('error", err);
    });

    var connectToAllPeers = function(gamers) {
      for (var i = 0; i < gamers.length; i++) {
        var gamer = gamers[i];
        if (gamer.peerId != $scope.myId) {
          var conns = $scope.peer.connections[gamer.peerId];
          if (!conns || conns.length < 1) {
            var c = $scope.peer.connect(
              gamer.peerId,
              { label: "c4", reliable: true }
            );
            $scope.peerConnections[gamer.peerId] = gamer.peerId;
            c.on("open", function() {
              setupPeerConnection(c);
              c.on("error", function(err) {});
            });
          }
        }
      }
    };

    $scope.connectedUsers.$loaded(function(gamers) {
      connectToAllPeers(gamers);
    });

    $scope.connectedUsers.$watch(function(newList, oldList) {
      connectToAllPeers($scope.connectedUsers);
    });

    var setupPeerConnection = function(c) {
      c.on("data", function(data) {
        $scope.$apply(function() {
          var cursor = JSON.parse(data);
          if (availableColumns().indexOf(cursor.columnIndex) != -1) {
            $scope.currentColumn = cursor.columnIndex;
            moveAndPlaceDisk();
            $scope.lastMove = new gameZoneCell(
              $scope.currentPlayer,
              $scope.currentRow,
              $scope.currentColumn
            );
            $scope.movesStorage.push($scope.lastMove);

            checkForWin();
          }
        });
      });

      c.on("close", function() {
        console.log(c.peer + " left");
        delete $scope.peerConnections[c.peer];
      });
    };

    $scope.peer.on("close", function() {
      return $scope.$apply(function() {
        return delete $scope.peerConnections[$scope.peer.id];
      });
    });

    var sendEventToAllPeers = function(cursor) {
      var data = JSON.stringify(cursor);

      for (var peerConn in $scope.peer.connections) {
        var conns = $scope.peer.connections[peerConn];
        var c = conns[0];

        c.send(data);
      }
    };

    window.onunload = window.onbeforeunload = function() {
      console.log("onunload");
      return $scope.peer.destroy();
    };
  }
]);
