var express = require('express'),
    _ = require('lodash'),
    moment = require('moment'),
    port = 9000,
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());

var DATE_FORMAT = 'YYYY-MM-DD HH:mm';
var allAppointments = [
        {
            id: 1,
            range: {
                start: moment().hours(10).minutes(30).format(DATE_FORMAT),
                end: moment().hours(12).minutes(0).format(DATE_FORMAT)
            },
            comment: 'comment1',
            title: 'title1'
        },
        {
            id: 2,
            range: {
                start: moment().hours(1).minutes(0).format(DATE_FORMAT),
                end: moment().hours(2).minutes(0).format(DATE_FORMAT)
            },
            comment: 'comment2',
            title: 'title2'
        }
    ];

app.get('/appointment/list', function(req, res) {
    var date = moment(req.query.date, 'YYYY-MM-DD'),
        appointments = _.filter(allAppointments, function(appointment) {
            var start = moment(appointment.range.start, DATE_FORMAT);
            return start.year() === date.year() &&
                start.month() === date.month() &&
                start.date() === date.date();
        });
    res.send({appointments: appointments});
});

app.post('/appointment/add', function(req, res) {
    var appointment = req.body.appointment,
        lastAppointment = _.last(allAppointments);
    appointment.id = lastAppointment ? lastAppointment.id + 1 : 1;
    allAppointments.push(appointment);
    res.send({appointment: appointment});
});

app.post('/appointment/delete', function(req, res) {
    allAppointments = _.filter(allAppointments, function(appointment) {
        return appointment.id !== req.body.id;
    });
    res.end();
});

app.post('/appointment/edit', function(req, res) {
    var appointment = _.find(allAppointments, {id: req.body.appointmentId});
    _.assign(appointment, req.body.newData);
    res.send({appointment: appointment});
});

app.use(express.static(__dirname + '/../front-end/'));
app.use(express.static(__dirname + '/../../'));
app.listen(port);
console.log('Server started at port ' + port);