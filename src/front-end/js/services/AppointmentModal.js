/* global moment, app, _, angular */
/*
 * AppointmentModal manipulates with dom. This code isn't in directive because in directive there is no way
 * to create such clear API - AppointmentModal.open(appointment) / AppointmentModal.close()
 * */
app.service('AppointmentModal', function ($compile, $rootScope, $document, $templateCache, AppointmentsAPI,
                                          DayAppointments, ActiveDate, $timeout, DATE_FORMAT) { 'use strict';

    var template = $templateCache.get('addAppointmentModalTemplate'),
        scope = $rootScope.$new(true),
        modalDomEl = $compile(template)(scope);

    scope.isVisible = false;

    scope.cancel = function () {
        scope.isVisible = false;
        delete scope.appointment;
    };

    scope.save = function () {
        if (!scope.appointment.title) {
            scope.appointment.titleInvalid = true;
        } else if (scope.appointment.id !== undefined) {
            AppointmentsAPI.editAppointment(scope.appointment.id, {
                title: scope.appointment.title,
                comment: scope.appointment.comment
            }).success(function (response) {
                DayAppointments.editAppointment(response.appointment.id, response.appointment);
                scope.isVisible = false;
            });
        } else {
            var requestAppointment = _.clone(scope.appointment);
            requestAppointment.range = {
                start: scope.appointment.range.start.format(DATE_FORMAT),
                end: scope.appointment.range.end.format(DATE_FORMAT)
            };
            AppointmentsAPI.addAppointment(requestAppointment).success(function (response) {
                DayAppointments.addAppointment(response.appointment);
                scope.isVisible = false;
            });
        }
    };

    scope.deleteAppointment = function (appointment) {
        AppointmentsAPI.deleteAppointment(appointment.id).success(function () {
            DayAppointments.deleteAppointment(appointment.id);
            scope.isVisible = false;
        });
    };
    scope.$watch(
        function () { return ActiveDate.value; },
        function () {
            scope.isVisible = false;
            scope.activeDate = moment(ActiveDate.value);
        }
    );
    scope.$on('escapePressed', function() {
        scope.cancel();
    });

    angular.element($document[0].body).prepend(modalDomEl[0]);

    this.open = function (appointment) {
        scope.appointment = _.clone(appointment);
        scope.appointment.range = moment.range(
            moment(appointment.range.start),
            moment(appointment.range.end)
        );
        scope.isVisible = true;

        $timeout(function() {
            /* element can be focused only if it is visible,
               element become visible only after $digest,
               $timeout - it is the way to execute code after digest. */
            $('#title').focus();
        });
    };

    this.close = function () {
        scope.cancel();
    };
});