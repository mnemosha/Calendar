/* global app, moment, _ */

app.controller('DayController', function($scope, AppointmentsAPI, AppointmentModal, DayAppointments, ActiveDate,
                                         ViewConstants, CalendarUtils, DATE_FORMAT) { 'use strict';

    var self = this;

    self.headers = moment.generateTimesRange(60);
    self.slots = moment.generateTimesRange(30);
    self.draggedAppointment = null;

    self.selection = {
        range: null,
        offset: 0,
        height: 0,
        overlaps: false
    };

    self.onDragStart = function(event) {
        var eventTime = CalendarUtils.getTimeByCoordinateFloor(event.relativeY),
            appointment = DayAppointments.getAt(eventTime);

        if (appointment !== undefined) {
            self.draggedAppointment = _.find(self.displayedAppointments, {id: appointment.id});
        } else { // User didn't clicked on an appointment, then he wants end create one with drag and drop
            var selectionStartCoord = CalendarUtils.roundFloor(event.relativeY),
                selectionEndCoord = selectionStartCoord + ViewConstants.SLOT_HEIGHT;

            self.selection.offset = selectionStartCoord;
            self.selection.height = selectionEndCoord - selectionStartCoord;

            self.selection.range = moment.range(
                CalendarUtils.getTimeByCoordinateFloor(selectionStartCoord),
                CalendarUtils.getTimeByCoordinateFloor(selectionEndCoord)
            );

            self.infoPosition = {
                x: event.pageX + 10,
                y: event.pageY + 10
            };
        }
    };

    self.onDragAppointment = function(event) {
        var appointment = DayAppointments.getById(self.draggedAppointment.id),
            appointmentRange = CalendarUtils.getNewAppointmentRange(appointment.range, event.dragStartCoord,
                event.relativeY),
            appointmentDuration = moment.duration(appointmentRange.end - appointmentRange.start),
            onPreviousDay = appointmentRange.start.date() < moment(ActiveDate.value).date(),
            onNextDay = appointmentRange.end.date() > moment(ActiveDate.value).date();

        if (onPreviousDay) {
            appointmentRange.start = moment(ActiveDate.value);
            appointmentRange.end = moment(appointmentRange.start + appointmentDuration);
        } else if (onNextDay) {
            appointmentRange.end =  moment(ActiveDate.value).add(1, 'day');
            appointmentRange.start = moment(appointmentRange.end - appointmentDuration);
        }

        self.draggedAppointment.range = appointmentRange;
        self.draggedAppointment.topOffset = CalendarUtils.getCoordinateByMoment(
            self.draggedAppointment.range.start);

        self.draggedAppointment.overlaps = _.some(self.displayedAppointments, function(appointment) {
            var notDraggedAppointment = appointment.id !== self.draggedAppointment.id;
            if (notDraggedAppointment) {
                return self.draggedAppointment.range.intersect(appointment.range);
            }
        });
    };

    self.onDragSelection = function(event) {
        var selectionEndCoord,
            selectionStartCoord,
            draggingDirection = event.dragStartCoord < event.relativeY ? 'down' : 'up';

        if (draggingDirection === 'down') {
            selectionStartCoord = event.dragStartCoord;
            selectionEndCoord = event.relativeY;
        } else {
            selectionStartCoord = event.relativeY;
            selectionEndCoord = event.dragStartCoord;
        }

        self.selection.offset = CalendarUtils.roundFloor(selectionStartCoord);
        self.selection.height = CalendarUtils.roundCeil(selectionEndCoord) - self.selection.offset;
        self.selection.range = moment.range(
            CalendarUtils.getTimeByCoordinateFloor(selectionStartCoord),
            CalendarUtils.getTimeByCoordinateCeil(selectionEndCoord)
        );

        self.selection.overlaps = _.some(self.displayedAppointments, function(appointment) {
            return self.selection.range.intersect(appointment.range);
        });

        self.infoPosition = {
            x: event.pageX + 10,
            y: event.pageY + 10
        };
    };

    self.onDragAppointmentEnd = function() {
        if (!self.draggedAppointment.overlaps) {
            var appointment = DayAppointments.getById(self.draggedAppointment.id),
                initialStartTime = moment(appointment.range.start, DATE_FORMAT),
                durationChanged = !self.draggedAppointment.range.start.isSame(initialStartTime);

            if (durationChanged) {
                AppointmentsAPI.editAppointment(self.draggedAppointment.id, {
                    range: {
                        start: self.draggedAppointment.range.start.format(DATE_FORMAT),
                        end: self.draggedAppointment.range.end.format(DATE_FORMAT)
                    }
                }).success(function(response) {
                    DayAppointments.editAppointment(response.appointment.id, {
                        range: response.appointment.range
                    });
                    self.draggedAppointment = null;
                });
            } else self.draggedAppointment = null;
        } else {
            self.onDragAppointmentCancel();
        }
    };

    self.onDragSelectionEnd = function() {
        if (!self.selection.overlaps) {
            AppointmentModal.open({
                range: {
                    start: self.selection.range.start.format(DATE_FORMAT),
                    end: self.selection.range.end.format(DATE_FORMAT)
                }
            });
        }
        self.selection.offset = self.selection.height = 0;
        self.selection.overlaps = false;
        self.selection.range = null;
    };

    self.onDragAppointmentCancel = function() {
        var commitedAppointment = DayAppointments.getById(self.draggedAppointment.id);
        self.draggedAppointment.range = moment.convertToRange(commitedAppointment.range);
        self.draggedAppointment.height = CalendarUtils.calculateHeight(self.draggedAppointment.range);
        self.draggedAppointment.topOffset = CalendarUtils.calculateOffset(self.draggedAppointment.range.start);
        self.draggedAppointment.overlaps = false;
        self.draggedAppointment = null;
    };

    self.onDragSelectionCancel = function() {
        self.selection.offset = self.selection.height = 0;
        self.selection.range = null;
        self.selection.overlaps = false;
    };

    self.openAppointmentModal = function(appointmentId) {
        var commitedAppointment = DayAppointments.getById(appointmentId);
        AppointmentModal.open(commitedAppointment);
    };

    $scope.$watch(
        function() { return ActiveDate.value; },
        function() {
            var activeDate = moment(ActiveDate.value, DATE_FORMAT);
            AppointmentsAPI.getAppointmentsByDate(activeDate).success(function(response) {
                DayAppointments.setAppointments(response.appointments);
            });
        }
    );

    $scope.$watchCollection(
        function() { return DayAppointments.getAll(); },
        function() {
            self.displayedAppointments = _.map(DayAppointments.getAll(), function(appointment) {
                appointment = _.clone(appointment, true);
                appointment.range = moment.convertToRange(appointment.range);
                appointment.height = CalendarUtils.calculateHeight(appointment.range);
                appointment.topOffset = CalendarUtils.calculateOffset(appointment.range.start);
                return appointment;
            }
        );
    });
});
