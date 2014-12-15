/* global app, moment, _ */

app.service('DayAppointments', function(DATE_FORMAT) { 'use strict';
    var appointments = [];

    this.editAppointment = function(appointmentId, data) {
        var appointment = _.find(appointments, {id: appointmentId});
        _.assign(appointment, data);
    };

    this.addAppointment = function(appointment) {
        appointments.push(appointment);
        appointments = _.clone(appointments, true);
    };

    this.deleteAppointment = function(appointmentId) {
        appointments = _.filter(appointments, function(appointment) {
            return appointment.id !== appointmentId;
        });
    };

    this.getById = function(id) {
        return _.find(appointments, {id: id});
    };

    this.getAll = function() {
        return appointments;
    };

    this.setAppointments = function(newAppointments) {
        appointments = newAppointments;
    };

    this.getAt = function(m) {
        return _.find(appointments, function(appointment) {
            var start = moment(appointment.range.start, DATE_FORMAT);
            var end = moment(appointment.range.end, DATE_FORMAT);
            return start <= m && end > m;
        });
    };
});
