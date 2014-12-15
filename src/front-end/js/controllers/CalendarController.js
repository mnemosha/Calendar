/* global app, moment */

app.controller('CalendarController', function ($scope, ActiveDate, DATE_FORMAT) { 'use strict';
    var self = this;

    $scope.$watch(
        function() { return ActiveDate.value; },
        function() {
            self.activeDate = moment(ActiveDate.value, DATE_FORMAT);
        }
    );

    self.goNextDay = function() {
        ActiveDate.value = self.activeDate.add(1, 'day').format(DATE_FORMAT);
    };

    self.goToday = function() {
        ActiveDate.value = moment().startOf('day').format(DATE_FORMAT);
    };

    self.goPreviousDay = function() {
        ActiveDate.value = self.activeDate.subtract(1, 'day').format(DATE_FORMAT);
    };
});