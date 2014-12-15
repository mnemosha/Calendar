/* global angular */

/*
* Everywhere in application instead of $scope.variable = 'bla' I use this.variable = 'bla'. It helps to avoid
* annoying bug with prototypical inheiretance of scopes.
* */

var app = angular.module('app', []);

app.value('ViewConstants', {
    HOUR_HEIGHT: 45,
    SLOT_HEIGHT: 45 / 2,
    PIXELS_PER_MINUTE: 45 / 60,
    MINUTES_PER_PIXEL: 60 / 45
});

app.value('DATE_FORMAT', 'YYYY-MM-DD HH:mm');

app.run(function($rootScope, $document) {
    $($document[0].body).on('keydown', function(event) {
        if (event.which === 27) {
            $rootScope.$broadcast('escapePressed');
            $rootScope.$apply();
        }
    });
});