'use strict';
app.factory('connectFourDataContext', ['$http', '$q', function ($http, $q) {


    var getLastGame = function () {
        var moves = JSON.parse(localStorage.getItem('lastGame'));
        return moves;
    };


    var postMoves = function (gameMoves) {
        localStorage.setItem('lastGame', JSON.stringify(gameMoves));
    };

    return {
        postMoves: postMoves,
        getLastGame: getLastGame
    };

}]);
