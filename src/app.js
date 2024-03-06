'use restrict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors')
const ddosService = require('./services/ddos-service')
const authService = require('./services/auth-service');

const app = express();
const router = express.Router();

mongoose.connect(config.connectionString);

const Usefulcontacts = require('./models/usefulcontacts-model');
const User = require('./models/user-model');
const userAdm = require('./models/userAdm-model');
const code = require('./models/code-model')
const Alert = require('./models/alert-model');
const Complaint = require('./models/complaint-model');
const FriendContact = require('./models/friendContact-model');
const Bot = require('./models/bot-model');

const indexRoute = require('./routes/index');
const usefulContactsRout = require('./routes/usefulcontacts-route');
const userRout = require('./routes/user-route');
const protectiveMeasureRout = require('./routes/protectiveMeasure-route')
const userAdmRout = require('./routes/userAdm-route');
const alertRout = require('./routes/alert-route');
const complaintRout = require('./routes/complaint-route');
const friendContactRout = require('./routes/friendContact-route');
const reportsRout = require('./routes/reports-route');


app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());

app.use(...ddosService);

// Habilita o CORS
// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
//     res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
//     next();
// });

const documentation = require('./services/documentation-service')

documentation.documentationService(app)
app.use('/', indexRoute);
app.use('/usefulcontacts', usefulContactsRout);
app.use('/user', userRout);
app.use('/userAdm', userAdmRout);
app.use('/alert', alertRout);
app.use('/complaint', complaintRout);
app.use('/friendcontact', friendContactRout);
app.use('/protective-measure',protectiveMeasureRout);
app.use('/reports', reportsRout);


module.exports = app;

