'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/protectiveMeasure-controller');
const authService = require('../services/auth-service')

router.post('/',authService.authorize, controller.validate)

module.exports = router;