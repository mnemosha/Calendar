/* global moment, describe, it, spyOn, beforeEach, expect, inject, _ */

describe('DayController', function () { 'use strict';
    beforeEach(inject(function($rootScope, $controller, CalendarUtils, DATE_FORMAT) {
        this.controller = $controller('DayController', {$scope: this.scope});
        this.appointmentsMock = [
            {
                id: 1,
                range: {
                    start: moment().hours(10).minutes(30).format(DATE_FORMAT),
                    end: moment().hours(12).minutes(0).format(DATE_FORMAT)
                },
                comment: 'comment1',
                title: 'title1',
                isSaved: true
            },
            {
                id: 2,
                range: {
                    start: moment().hours(1).minutes(0).format(DATE_FORMAT),
                    end: moment().hours(2).minutes(0).format(DATE_FORMAT)
                },
                comment: 'comment2',
                title: 'title2',
                isSaved: true
            }
        ];
        this.displayedAppointmentsMock = _.map(this.appointmentsMock, function(appointment) {
            appointment = _.clone(appointment, true);
            appointment.range = moment.range(
                moment(appointment.range.start, DATE_FORMAT),
                moment(appointment.range.end, DATE_FORMAT)
            );
            appointment.topOffset = CalendarUtils.calculateOffset(appointment.range.start);
            appointment.height = CalendarUtils.calculateHeight(appointment.range);
            return appointment;
        });
        this.draggedAppointmentMock = _.first(this.displayedAppointmentsMock);
        this.appointmentMock = _.first(this.appointmentsMock);
        this.eventMock = {
            relativeY: 300,
            pageX: 222,
            pageY: 353,
            dragStartCoord: 200,
            currentDragCoord: 300
        };
    }));

    describe('onDragStart', function() {
        it('should init dragged appointment if click occured on an appointment', inject(function(DayAppointments) {
            this.controller.displayedAppointments = this.displayedAppointmentsMock;
            spyOn(DayAppointments, 'getAt').andReturn(this.appointmentMock);
            this.controller.onDragStart(this.eventMock);
            expect(this.controller.draggedAppointment).toBeDefined();
        }));

        it('should not init appointment if click occured not on an appointment', inject(function(DayAppointments) {
            spyOn(DayAppointments, 'getAt').andReturn(undefined);
            this.controller.onDragStart(this.eventMock);
            expect(this.controller.draggedAppointment).toBeNull();
        }));

        it('should init selection variables if user clicked not on an appointment',
            inject(function(ActiveDate, ViewConstants, CalendarUtils) {
                var selectionStartCoord = CalendarUtils.roundFloor(this.eventMock.relativeY);
                var expectedDate = moment();

                spyOn(CalendarUtils, 'getTimeByCoordinateFloor').andReturn(expectedDate);

                this.controller.onDragStart(this.eventMock);

                expect(this.controller.selection.range.start).toEqual(expectedDate);
                expect(this.controller.selection.range.end).toEqual(expectedDate);
                expect(this.controller.selection.offset).toEqual(selectionStartCoord);
                expect(this.controller.selection.height).toEqual(ViewConstants.SLOT_HEIGHT);
                expect(this.controller.infoPosition.x).toBe(this.eventMock.pageX + 10);
                expect(this.controller.infoPosition.y).toBe(this.eventMock.pageY + 10);
            })
        );
    });

    describe('onDragAppointment', function() {
        beforeEach(inject(function(DayAppointments) {
            this.controller.draggedAppointment = this.draggedAppointmentMock;
            spyOn(DayAppointments, 'getById').andReturn(this.appointmentMock);
        }));

        it('should change duration range of the dragged appointment', inject(function(CalendarUtils) {
            var expectedRange = moment.range(
                moment().hours(10).startOf('hour'),
                moment().hours(12).startOf('hour')
            );
            spyOn(CalendarUtils, 'getNewAppointmentRange').andReturn(expectedRange);

            this.controller.onDragAppointment(this.eventMock);

            expect(this.draggedAppointmentMock.range).toEqual(expectedRange);
        }));

        it('should set start time of dragged appointment to 00:00 if start time on the previous day',
            inject(function(CalendarUtils) {
                var newAppointmentRange = moment.range(
                    moment().subtract(1, 'day'),
                    moment().hours(12).startOf('hour')
                );
                spyOn(CalendarUtils, 'getNewAppointmentRange').andReturn(newAppointmentRange);
                this.controller.onDragAppointment(this.eventMock);
                expect(this.draggedAppointmentMock.range.start.format('HH:mm')).toEqual('00:00');
            })
        );

        it('should set end time of dragged appointment to 00:00 if end time on next day',
            inject(function(CalendarUtils) {
                var newAppointmentRange = moment.range(
                    moment().hours(12).startOf('hour'),
                    moment().add(1, 'day')
                );
                spyOn(CalendarUtils, 'getNewAppointmentRange').andReturn(newAppointmentRange);
                this.controller.onDragAppointment(this.eventMock);
                expect(this.draggedAppointmentMock.range.end.format('HH:mm')).toEqual('00:00');
            })
        );

        it('should set overlaps flag is dragged appointment overlaps any other appointment', function() {
            spyOn(_, 'some').andReturn(true);
            this.controller.onDragAppointment(this.eventMock);
            expect(this.controller.draggedAppointment.overlaps).toBe(true);
        });
    });

    describe('onDragSelection', function() {
        it('should set selection params', inject(function(CalendarUtils) {
            var selectionOffsetMock = 100;
            var selectionHeightMock = 200;
            var selectionRangeFromMock = moment();
            var selectionRangeToMock = moment();

            spyOn(CalendarUtils, 'roundFloor').andReturn(selectionOffsetMock);
            spyOn(CalendarUtils, 'roundCeil').andReturn(selectionHeightMock);
            spyOn(CalendarUtils, 'getTimeByCoordinateFloor').andReturn(selectionRangeFromMock);
            spyOn(CalendarUtils, 'getTimeByCoordinateCeil').andReturn(selectionRangeToMock);

            this.controller.onDragSelection(this.eventMock);

            expect(this.controller.selection.offset).toEqual(selectionOffsetMock);
            expect(this.controller.selection.height).toEqual(selectionHeightMock - selectionOffsetMock);
            expect(this.controller.selection.range.start).toEqual(selectionRangeFromMock);
            expect(this.controller.selection.range.end).toEqual(selectionRangeToMock);
            expect(this.controller.infoPosition.x).toEqual(this.eventMock.pageX + 10);
            expect(this.controller.infoPosition.y).toEqual(this.eventMock.pageY + 10);
        }));

        it('should set intersection flag to true if selection is over appointment', function() {
            spyOn(_, 'some').andReturn(true);
            this.controller.onDragSelection(this.eventMock);
            expect(this.controller.selection.overlaps).toBe(true);
        });

        it('should set intersection flag to false if no appointments intersected', inject(function() {
            spyOn(_, 'some').andReturn(false);
            this.controller.onDragSelection(this.eventMock);
            expect(this.controller.selection.overlaps).toBe(false);
        }));
    });

    describe('onDragAppointmentCancel', function() {
        beforeEach(inject(function(DayAppointments) {
            spyOn(DayAppointments, 'getById').andReturn(this.appointmentMock);
            this.controller.draggedAppointment = this.draggedAppointmentMock;
        }));

        it('should release dragged appointment', function() {
            this.controller.onDragAppointmentCancel();
            expect(this.controller.draggedAppointment).toBeNull();
        });

        it('should revert time of the appointment to initial', inject(function(CalendarUtils) {
            var expectedRange = moment.range(moment().hours(11), moment().hours(12));
            spyOn(moment, 'convertToRange').andReturn(expectedRange);
            this.controller.draggedAppointment.range = moment.range(moment(),moment());
            this.controller.onDragAppointmentCancel();
            expect(this.draggedAppointmentMock.range).toEqual(expectedRange);
        }));

        it('should revert appointment position to initial', inject(function(CalendarUtils) {
            spyOn(CalendarUtils, 'calculateHeight').andReturn(100);
            spyOn(CalendarUtils, 'calculateOffset').andReturn(200);
            this.controller.onDragAppointmentCancel();
            expect(this.draggedAppointmentMock.height).toBe(100);
            expect(this.draggedAppointmentMock.topOffset).toBe(200);
        }));
    });

    describe('onDragSelectionCancel', function() {
        it('should reset selection parameters', function() {
            this.controller.selection.offset = 100;
            this.controller.selection.height = 200;
            this.controller.selection.range = moment.range(moment(), moment());
            this.controller.selection.overlaps = true;
            this.controller.onDragSelectionCancel();
            expect(this.controller.selection.offset).toBe(0);
            expect(this.controller.selection.height).toBe(0);
            expect(this.controller.selection.range).toBeNull();
            expect(this.controller.selection.overlaps).toBe(false);
        });
    });

    describe('onDragAppointmentEnd', function() {
        beforeEach(function() {
            this.controller.draggedAppointment = this.draggedAppointmentMock;
        });

        it('should revert draggd appointment on previous position if it overlaps any other appointment', function() {
            this.controller.draggedAppointment.overlaps = true;
            spyOn(this.controller, 'onDragAppointmentCancel');
            this.controller.onDragAppointmentEnd();
            expect(this.controller.onDragAppointmentCancel).toHaveBeenCalled();
        });

        it('should edit appointment if duration changed', inject(function(ActiveDate, AppointmentsAPI, DayAppointments){
            var promiseMock = {
                success: function() {}
            };
            spyOn(AppointmentsAPI, 'editAppointment').andReturn(promiseMock);
            spyOn(DayAppointments, 'getById').andReturn(this.appointmentMock);
            this.controller.draggedAppointment.range.start = moment(ActiveDate.value);
            this.controller.onDragAppointmentEnd();
            expect(AppointmentsAPI.editAppointment).toHaveBeenCalled();
        }));

        it('should not edit appointment if duration did not changed', inject(function(AppointmentsAPI, DayAppointments){
            spyOn(AppointmentsAPI, 'editAppointment');
            spyOn(DayAppointments, 'getById').andReturn(this.appointmentMock);
            this.controller.onDragAppointmentEnd();
            expect(AppointmentsAPI.editAppointment).not.toHaveBeenCalled();
        }));
    });

    describe('onDragSelectionEnd', function() {
        beforeEach(function() {
            this.controller.selection.range = moment.range(moment(), moment());
            this.controller.selection.offset = 200;
            this.controller.selection.height = 100;
        });

        it('should open the modal if selection does not overlaps an appointment', inject(function(AppointmentModal) {
            spyOn(AppointmentModal, 'open');
            this.controller.draggedAppointment = this.draggedAppointmentMock;
            this.controller.selection.overlaps = false;
            this.controller.onDragSelectionEnd();
            expect(AppointmentModal.open).toHaveBeenCalled();
        }));

        it('should reset selection', function() {
            this.controller.onDragSelectionEnd();
            expect(this.controller.selection.offset).toBe(0);
            expect(this.controller.selection.height).toBe(0);
            expect(this.controller.selection.overlaps).toBe(false);
            expect(this.controller.selection.range).toBe(null);
        });
    });

    describe('openAppointmentModal', function() {
        it('should open modal', inject(function(AppointmentModal) {
            spyOn(AppointmentModal, 'open');
            this.controller.openAppointmentModal();
            expect(AppointmentModal.open).toHaveBeenCalled();
        }));
    });

    describe('when DayAppointments.getAll() has changed', function() {
        beforeEach(inject(function(AppointmentsAPI) {
            var promiseMock = {
                success: function() {}
            };
            spyOn(AppointmentsAPI, 'getAppointmentsByDate').andReturn(promiseMock);
        }));

        it('According appointments should be displayed', inject(function(DayAppointments) {
            var appointmentsIds = _.pluck(this.appointmentsMock, 'id');
            spyOn(DayAppointments, 'getAll').andReturn(this.appointmentsMock);
            this.scope.$digest();
            expect(_.pluck(this.controller.displayedAppointments, 'id')).toEqual(appointmentsIds);
        }));
    });

    describe('when ActiveDate.value has changed', function() {
        it('new appointments should be requested from the server', inject(function(AppointmentsAPI) {
            var promiseMock = {
                success: function() {}
            };
            spyOn(AppointmentsAPI, 'getAppointmentsByDate').andReturn(promiseMock);
            this.scope.$digest();
            expect(AppointmentsAPI.getAppointmentsByDate).toHaveBeenCalled();
        }));
    });
});