'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/complaint-controller');
const authService = require('../services/auth-service');

router.get('/', authService.isAdmin, controller.get);
router.get('/city/:city', authService.isAdmin, controller.getByCity);
router.get('/type/:type', authService.isAdmin, controller.getByType);
router.get('/:type/city/:city', authService.isAdmin, controller.getByTypeAndCity);
router.get('/localization', authService.isAdmin, controller.getByLocalization);
router.get('/period', authService.isAdmin, controller.getByPeriod);
router.get('/user/:id', authService.authorize, controller.getByUser);
router.post('/', authService.authorize, controller.post);
router.get('/:id', authService.authorize, controller.getById);
router.put('/', authService.authorize, controller.put);
router.delete('/:id', authService.isAdmin, controller.delete);


module.exports = router;