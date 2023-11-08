'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/userAdm-controller');
const authService = require('../services/auth-service')


router.post('/', authService.authorize, controller.post);
router.post('/authenticate', controller.authenticate);
router.post('/valid-token', controller.validToken);

router.get('/user-adm', authService.authorize,  controller.read);
router.get('/user-adm/user/:id', authService.authorize,  controller.readOne);

router.put('/user-adm/user/:id', authService.authorize, controller.update);

router.delete('/user-adm/user/:id', authService.authorize, controller.delete);

module.exports = router;