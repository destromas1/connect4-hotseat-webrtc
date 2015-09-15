module.exports = function (config) {
    config.set({

        frameworks: ['jasmine'],

        files: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular/angular.js',
                'bower_components/angular-route/angular-route.min.js',
                'bower_components/angular-mocks/angular-mocks.js',                
                'bower_components/firebase/firebase.js',
                'bower_components/angularfire/dist/angularfire.min.js',
                'bower_components/peerjs/peer.js',
                'bower_components/underscore/underscore.js',
                'app/*.js',
                'test/**/*.spec.js'],

        port: 3001,

        browsers: ['Chrome']
    });
};

