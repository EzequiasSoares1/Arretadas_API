'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/userAdm-controller');
const authService = require('../services/auth-service')


router.post('/', authService.authorize, controller.post);
router.post('/authenticate', controller.authenticate);
router.post('/valid-token', controller.validToken);

router.get('/', authService.authorize, controller.read);
router.get('/name/:name', authService.authorize, controller.readName);
router.get('/:id', authService.authorize, controller.readOne);

router.put('/:id', authService.authorize, controller.update);

router.delete('/:id', authService.authorize, controller.delete);

module.exports = router;