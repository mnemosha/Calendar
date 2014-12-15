/* global app, moment */

app.service('ActiveDate', function(DATE_FORMAT) { 'use strict';
    /* Everywhere i should depend on the primitive data, not moment object, that's why the active date should be
       string. Also it is impossible to change a string in JS so there is no need to do deep $watch. */
    this.value = moment().startOf('day').format(DATE_FORMAT);
});
