'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/friendContact-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.get('/:name', authService.authorize, controller.getByName);
router.get('/id/:id', authService.authorize, controller.getById);
router.get('/user/:id', authService.authorize, controller.getByUser);
router.post('/', authService.authorize, controller.post);
router.put('/:id', authService.authorize, controller.put);
router.delete('/id/:id', authService.authorize, controller.delete);


module.exports = router;