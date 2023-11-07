'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/userAdm-controller');

router.post('/', controller.post);
router.post('/authenticate', controller.authenticate);
router.post('/valid-token', controller.validToken);

router.get('/user-adm', controller.read);
router.get('/user-adm/user/:id', controller.readOne);

router.put('/user-adm/user/:id', controller.update);

router.delete('/user-adm/user/:id', controller.delete);

module.exports = router;