'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/alert-controller');
const authService = require('../services/auth-service');

router.get('/id/:id', authService.authorize, controller.getById);
router.get('/user/:id', authService.authorize, controller.getByUserId);
router.post('/', authService.authorize, controller.post);
router.put('/',authService.authorize, controller.put);
router.delete('/:id', authService.isAdmin, controller.delete);

module.exports = router;

