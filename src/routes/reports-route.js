'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/reports-controller');
const authService = require('../services/auth-service')

router.use(authService.isAdmin);

router.get('/usersAdm', controller.usersAdm);
router.get('/users', controller.usersAll);
router.get('/users/city', controller.usersAllByCity);
router.get('/users/period', controller.usersByPeriod);
router.get('/complaints', controller.complaints);
router.get('/complaints/city', controller.complaintsCity);
router.get('/complaints/period', controller.complaintsPeriod);
router.get('/alerts', controller.alerts);
router.get('/alerts/period', controller.alertsPeriod);
router.get('/alerts/city', controller.alertsCity);

module.exports = router;
