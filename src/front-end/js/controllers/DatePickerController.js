/* global app, moment, _ */

app.controller('DatePickerController', function($scope, ActiveDate, DATE_FORMAT) { 'use strict';
    var self = this;
    self.showPeriodPicker = false;
    self.monthsList = _.map(_.range(0, 12), function(i) {
        return moment().month(i).startOf('month');
    });
    self.currentDate = moment();

    $scope.$watch(
        function() { return ActiveDate.value; },
        function() {
            self.activeDate = moment(ActiveDate.value);
            self.daysList = self.activeDate.generateDays();
            self.yearsList = self.activeDate.generateNextYears();
        }
    );

    self.isCurrentMonth = function(date) {
        return date.month() === self.currentDate.month();
    };
    self.isCurrentYear = function(date) {
        return date.year() === self.currentDate.year();
    };
    self.isDayAvailable = function(date) {
        return date.month() === self.activeDate.month();
    };
    self.isCurrentDay = function(date) {
        return date.isDateSame(self.currentDate);
    };
    self.isDayActive = function(date) {
        return date.isDateSame(self.activeDate);
    };
    self.isYearActive = function(date) {
        return date.year() === self.activeDate.year();
    };
    self.isMonthActive = function(date) {
        return date.month() === self.activeDate.month();
    };
    self.selectYear = function(date) {
        ActiveDate.value = self.activeDate.year(date.year()).format(DATE_FORMAT);
    };
    self.selectMonth = function(date) {
        ActiveDate.value = self.activeDate.month(date.month()).format(DATE_FORMAT);
    };
    self.nextYears = function() {
        ActiveDate.value = self.activeDate.add(10, 'years').format(DATE_FORMAT);
    };
    self.previousYears = function() {
        ActiveDate.value = self.activeDate.subtract(10, 'years').format(DATE_FORMAT);
    };
    self.selectDate = function(date) {
        ActiveDate.value = date.format(DATE_FORMAT);
    };
    self.goToday = function() {
        self.currentDate = moment();
        ActiveDate.value = moment().startOf('day').format(DATE_FORMAT);
    };
});