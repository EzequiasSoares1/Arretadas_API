'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/alert-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.post('/', authService.authorize, controller.post);
router.delete('/', authService.isAdmin, controller.delete);


module.exports = router;

