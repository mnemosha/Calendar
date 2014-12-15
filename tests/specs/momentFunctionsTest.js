/* global describe, it, expect, moment, _ */

describe('momentFunctions', function() {
    it('generateTimesRange works', function() {
        var expectedArray1 = [ moment().hours(0).startOf('hour'),
                moment().hours(12).startOf('hour') ],
            expectedArray2 = [ moment().hours(0).startOf('hour'),
                moment().hours(6).startOf('hour'),
                moment().hours(12).startOf('hour'),
                moment().hours(18).startOf('hour')
            ];
        expect(moment.generateTimesRange(720)).toEqual(expectedArray1);
        expect(moment.generateTimesRange(360)).toEqual(expectedArray2);
    });

    it('generateYearsRange works', function() {
        var expectedYears = _.map(_.range(10), function(i) {
                return moment().year(2010 + i).startOf('year');
            }),
            generatedYears = moment().year(2010).generateNextYears();
        expect(generatedYears).toEqual(expectedYears);
    });

    it('generateDays works', function() {
        var expectedDays = _.map(_.range(35), function(i) {
                return moment().year(2014).month(11).date(i + 1).startOf('day');
            }),
            generatedDays = moment().year(2014).month(11).generateDays();
        expect(expectedDays).toEqual(generatedDays);
    });

    it('isDateSame works', function() {
        var date1 = moment().year(2012).month(11).date(22).startOf('date');
        var date2 = moment().year(2012).month(11).date(22).startOf('date');
        expect(date1.isDateSame(date2)).toBe(true);
    });
});
