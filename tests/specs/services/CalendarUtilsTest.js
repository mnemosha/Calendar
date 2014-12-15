/* global describe, spyOn, it, expect, inject, moment */

describe('CalendarUtils', function() {
    it('calculateOffset works', inject(function(CalendarUtils) {
        var startRange1 = (moment().hours(0).minutes(0)),
            startRange2 = (moment().hours(4).minutes(0)),
            startRange3 = (moment().hours(24).minutes(0));

        expect(CalendarUtils.calculateOffset(startRange1)).toBe(0);
        expect(CalendarUtils.calculateOffset(startRange2)).toBe(180);
        expect(CalendarUtils.calculateOffset(startRange3)).toBe(1080);
    }));

    it('calculateHeight works', inject(function(CalendarUtils) {
        var range1 = moment.range(moment().hour(0),moment().hour(4)),
            range2 = moment.range(moment().hour(5),moment().hour(6)),
            range3 = moment.range(moment().hour(23),moment().hour(24));

        expect(CalendarUtils.calculateHeight(range1)).toBe(180);
        expect(CalendarUtils.calculateHeight(range2)).toBe(45);
        expect(CalendarUtils.calculateHeight(range3)).toBe(45);
    }));

    it('getTimeByCoordinateFloor works', inject(function(CalendarUtils) {
        var coord1 = 0,
            coord2 = 400,
            coord3 = 1080;

        expect(CalendarUtils.getTimeByCoordinateFloor(coord1).format('HH:mm')).toBe('00:00');
        expect(CalendarUtils.getTimeByCoordinateFloor(coord2).format('HH:mm')).toBe('08:30');
        expect(CalendarUtils.getTimeByCoordinateFloor(coord3).format('HH:mm')).toBe('00:00');
    }));

    it('getTimeByCoordinateCeil works', inject(function(CalendarUtils) {
        var coord1 = 20,
            coord2 = 400,
            coord3 = 1079;

        expect(CalendarUtils.getTimeByCoordinateFloor(coord1).format('HH:mm')).toBe('00:00');
        expect(CalendarUtils.getTimeByCoordinateFloor(coord2).format('HH:mm')).toBe('08:30');
        expect(CalendarUtils.getTimeByCoordinateFloor(coord3).format('HH:mm')).toBe('23:30');
    }));

    it('getCoordinateByMoment works', inject(function(ActiveDate, CalendarUtils) {
        var moment1 = moment(ActiveDate.value).minutes(0),
            moment2 = moment(ActiveDate.value).minutes(100),
            moment3 = moment(ActiveDate.value).minutes(1080);

        expect(CalendarUtils.getCoordinateByMoment(moment1)).toBe(0);
        expect(CalendarUtils.getCoordinateByMoment(moment2)).toBe(75);
        expect(CalendarUtils.getCoordinateByMoment(moment3)).toBe(810);
    }));

    it('roundFloor works', inject(function(CalendarUtils) {
        var coord1 = 0,
            coord2 = 100,
            coord3 = 1000;

        expect(CalendarUtils.roundFloor(coord1)).toBe(0);
        expect(CalendarUtils.roundFloor(coord2)).toBe(90);
        expect(CalendarUtils.roundFloor(coord3)).toBe(990);
    }));

    it('roundCeil works', inject(function(CalendarUtils) {
        var coord1 = 0,
            coord2 = 100,
            coord3 = 1000;

        expect(CalendarUtils.roundCeil(coord1)).toBe(0);
        expect(CalendarUtils.roundCeil(coord2)).toBe(112.5);
        expect(CalendarUtils.roundCeil(coord3)).toBe(1012.5);
    }));

    it('getNewAppointmentRange works', inject(function(CalendarUtils) {
        var initialRange = {
            start: '2014-12-12 10:00',
            end: '2014-12-12 12:00'
        };

        spyOn(moment.fn, 'diff').andReturn(200);

        var expectedRange = moment.range(
            moment(initialRange.start).add(200, 'minutes'),
            moment(initialRange.end).add(200, 'minutes')
        );
        var actualRange = CalendarUtils.getNewAppointmentRange(initialRange);

        expect(actualRange).toEqual(expectedRange);
    }));
});
