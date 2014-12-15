/* global moment, describe, it, beforeEach, expect, inject */

describe('DatePickerController', function() {
    beforeEach(inject(function($controller) {
        this.controller = $controller('DatePickerController', {$scope: this.scope});
    }));

    it('isCurrentMonth works', function() {
        expect(this.controller.isCurrentMonth(moment())).toBe(true);
        expect(this.controller.isCurrentMonth(moment().add(1, 'month'))).toBe(false);
    });

    it('isCurrentYear works', function() {
        expect(this.controller.isCurrentYear(moment())).toBe(true);
        expect(this.controller.isCurrentYear(moment().add(1, 'year'))).toBe(false);
    });

    it('isDayAvailable works', function() {
        this.controller.activeDate = moment();
        expect(this.controller.isDayAvailable(moment())).toBe(true);
        expect(this.controller.isDayAvailable(moment().add(1, 'month'))).toBe(false);
    });

    it('isCurrentDay works', function() {
        expect(this.controller.isCurrentDay(moment())).toBe(true);
        expect(this.controller.isCurrentDay(moment().add(1, 'day'))).toBe(false);
    });

    it('isDayActive works', function() {
        this.controller.activeDate = moment();
        expect(this.controller.isDayActive(moment())).toBe(true);
        expect(this.controller.isDayActive(moment().add(1, 'day'))).toBe(false);
    });

    it('isYearActive works', function() {
        this.controller.activeDate = moment();
        expect(this.controller.isYearActive(moment())).toBe(true);
        expect(this.controller.isYearActive(moment().add(1, 'year'))).toBe(false);
    });

    it('isMonthActive works', function() {
        this.controller.activeDate = moment();
        expect(this.controller.isMonthActive(moment())).toBe(true);
        expect(this.controller.isMonthActive(moment().add(1, 'month'))).toBe(false);
    });

    it('selectYear glabally changes active year', inject(function(ActiveDate, DATE_FORMAT) {
        this.controller.activeDate = moment();
        this.controller.selectYear(moment().year(2020));
        expect(ActiveDate.value).toBe(moment().year(2020).format(DATE_FORMAT));
    }));

    it('selectMonth glabally changes active month', inject(function(ActiveDate, DATE_FORMAT) {
        this.controller.activeDate = moment();
        this.controller.selectMonth(moment().month(5));
        expect(ActiveDate.value).toBe(moment().month(5).format(DATE_FORMAT));
    }));

    it('nextYears adds 10 years to activeDate ', inject(function(ActiveDate) {
        this.controller.activeDate = moment();
        this.controller.nextYears();
        var expectedDate = moment().add(10, 'year');
        expect(moment(ActiveDate.value).year()).toBe(expectedDate.year());
    }));

    it('previousYears subtracts 10 years from activeDate ', inject(function(ActiveDate) {
        this.controller.activeDate = moment();
        this.controller.previousYears();
        var expectedDate = moment().subtract(10, 'year');
        expect(moment(ActiveDate.value).year()).toBe(expectedDate.year());
    }));

    it('selectDate changes globally date', inject(function(ActiveDate, DATE_FORMAT) {
        this.controller.selectDate(moment());
        expect(ActiveDate.value).toBe(moment().format(DATE_FORMAT));
    }));

    it('goToday changes globally date', inject(function(ActiveDate, DATE_FORMAT) {
        this.controller.goToday();
        expect(ActiveDate.value).toBe(moment().startOf('day').format(DATE_FORMAT));
    }));
});
