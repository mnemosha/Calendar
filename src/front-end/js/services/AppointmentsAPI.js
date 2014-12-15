/* global app */

app.service('AppointmentsAPI', function($http) { 'use strict';
    this.addAppointment = function(appointment) {
        return $http.post('/appointment/add', {appointment: appointment});
    };

    this.deleteAppointment = function(id) {
        return $http.post('/appointment/delete', {id: id});
    };

    this.editAppointment = function(appointmentId, newData) {
        return $http.post('/appointment/edit', {appointmentId: appointmentId, newData: newData});
    };

    this.getAppointmentsByDate = function(date) {
        return $http.get('/appointment/list', { params: {date: date.format('YYYY-MM-DD')}});
    };
});
