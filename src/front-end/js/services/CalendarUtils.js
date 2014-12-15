/* global app, moment */

app.service('CalendarUtils', function (ActiveDate, ViewConstants) { 'use strict';
    this.calculateOffset = function (rangeStart) {
        return rangeStart.diff(ActiveDate.value, 'minutes') * ViewConstants.PIXELS_PER_MINUTE;
    };

    this.calculateHeight = function (range) {
        var minutesStart = range.start.diff(ActiveDate.value, 'minutes'),
            minutesEnd = range.end.diff(ActiveDate.value, 'minutes');

        return (minutesEnd - minutesStart) * ViewConstants.PIXELS_PER_MINUTE;
    };

    this.getTimeByCoordinateFloor = function (coordinate) {
        var roundedCoords = Math.floor(coordinate / ViewConstants.SLOT_HEIGHT) * ViewConstants.SLOT_HEIGHT,
            minutes = roundedCoords * ViewConstants.MINUTES_PER_PIXEL;
        return moment(ActiveDate.value).minutes(minutes);
    };

    this.getTimeByCoordinateCeil = function (coordinate) {
        var roundedCoords = Math.ceil(coordinate / ViewConstants.SLOT_HEIGHT) * ViewConstants.SLOT_HEIGHT,
            minutes = roundedCoords * ViewConstants.MINUTES_PER_PIXEL;
        return moment(ActiveDate.value).minutes(minutes);
    };

    this.getCoordinateByMoment = function (moment) {
        return moment.diff(ActiveDate.value, 'minutes') * ViewConstants.PIXELS_PER_MINUTE;
    };

    this.roundFloor = function (coord) {
        return Math.floor(coord / ViewConstants.SLOT_HEIGHT) * ViewConstants.SLOT_HEIGHT;
    };

    this.roundCeil = function (coord) {
        return Math.ceil(coord / ViewConstants.SLOT_HEIGHT) * ViewConstants.SLOT_HEIGHT;
    };

    this.getNewAppointmentRange = function(initialRange, dragStartCoordinate, currentDragCoordinate) {
        var startDragTime = this.getTimeByCoordinateFloor(dragStartCoordinate),
            currentDragTime = this.getTimeByCoordinateFloor(currentDragCoordinate),
            delta = currentDragTime.diff(startDragTime, 'minutes');

        return moment.range(
            moment(initialRange.start).add(delta, 'minutes'),
            moment(initialRange.end).add(delta, 'minutes')
        );
    };
});