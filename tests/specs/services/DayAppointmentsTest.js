/* global describe, it, beforeEach, expect, inject, moment */

describe('DayAppointments', function() { 'use strict';
    beforeEach(inject(function(DayAppointments, DATE_FORMAT) {
        this.allAppointments = [
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
        DayAppointments.setAppointments(this.allAppointments);
    }));

    it('editAppointment edits appointment', inject(function(DayAppointments) {
        var appointment = DayAppointments.getById(1);
        DayAppointments.editAppointment(appointment.id, {comment: 'someComment', title: 'someTitle'});
        expect(appointment.comment).toBe('someComment');
        expect(appointment.title).toBe('someTitle');
    }));

    it('setAppointments sets appointments', inject(function(DayAppointments) {
        DayAppointments.setAppointments([]);
        expect(DayAppointments.getAll()).toEqual([]);
    }));

    it('addAppointment adds an appointment', inject(function(DayAppointments) {
        var newAppointment = {
            id: 3,
            comment: 'comment2',
            title: 'title2'
        };
        DayAppointments.addAppointment(newAppointment);
        expect(DayAppointments.getById(newAppointment.id)).toEqual(newAppointment);
    }));

    it('deleteAppointment deletes an appointment', inject(function(DayAppointments) {
        var appointment = DayAppointments.getAll()[0];
        DayAppointments.deleteAppointment(appointment.id);
        expect(DayAppointments.getById(appointment.id)).toBeUndefined();
    }));

    it('getById returns correct appointment', inject(function(DayAppointments) {
        var appointment = this.allAppointments[0];
        expect(DayAppointments.getById(appointment.id)).toBe(appointment);
    }));

    it('getAt returns undefined if there is not appointments at this time', inject(function(DayAppointments) {
        var m = moment().year(2222);
        expect(DayAppointments.getAt(m)).toBeUndefined();
    }));

    it('getAt returns appointment at given time', inject(function(DATE_FORMAT, DayAppointments) {
        var appointment = this.allAppointments[0];
        var m = moment(appointment.range.start, DATE_FORMAT);
        expect(DayAppointments.getAt(m)).toEqual(appointment);
    }));
});