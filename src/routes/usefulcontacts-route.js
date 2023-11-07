'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usefulcontacts-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.get('/:name', authService.authorize, controller.getByName);
router.get('/city/:city', authService.authorize, controller.getByCity);
router.get('/id/:id', authService.authorize, controller.getById);
router.post('/', authService.isAdmin, controller.post);
router.put('/:id', authService.isAdmin, controller.put);
router.delete('/', authService.isAdmin, controller.delete);


module.exports = router;