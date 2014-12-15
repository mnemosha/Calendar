/* global moment */

/*
* Functions inited with moment.fn.fun = function() are written to moment's prototype and should use 'this'.
* Function inited with moment.fun = function() {} are static and should not use 'this'.
* */

moment.generateTimesRange = function(interval) {
    var start = moment().startOf('day'),
        end = moment().add(1, 'day').startOf('day'),
        range = [];

    while (start.isBefore(end)) {
        range.push(moment(start));
        start.add(interval, 'minutes');
    }
    return range;
};

moment.fn.generateDays = function() {
    var startMoment = moment().year(this.year()).month(this.month()).date(1).isoWeekday(1),
        endMoment = moment().year(this.year()).month(this.month() + 1).date(0).isoWeekday(7),
        range = moment().range(startMoment, endMoment),
        arr = [];

    range.by('days', function(moment) {
        arr.push(moment.startOf('day'));
    });
    return arr;
};

moment.fn.generateNextYears = function() {
    var roundedYear = Math.floor(this.year() / 10) * 10,
        startMoment = moment(this).year(roundedYear).startOf('year'),
        endMoment = moment().year(startMoment.year() + 9).startOf('year'),
        range = moment().range(startMoment, endMoment),
        arr = [];

    range.by('years', function(moment) {
        arr.push(moment);
    });
    return arr;
};

moment.fn.isDateSame = function(moment) {
  return moment.year() === this.year() && moment.month() === this.month() && moment.date() === this.date();
};

moment.convertToRange = function(range) {
    return moment.range(moment(range.start),moment(range.end));
};