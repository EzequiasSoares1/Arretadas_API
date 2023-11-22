'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/userAdm-controller');
const authService = require('../services/auth-service')


router.post('/', controller.post);
router.post('/authenticate', controller.authenticate);
router.post('/valid-token', controller.validToken);

router.get('/', authService.isAdmin, controller.read);
router.get('/name/:name', authService.isAdmin, controller.readName);
router.get('/:id', authService.isAdmin, controller.readOne);

router.put('/:id', authService.isAdmin, controller.update);

router.delete('/:id', authService.isAdmin, controller.delete);

module.exports = router;


