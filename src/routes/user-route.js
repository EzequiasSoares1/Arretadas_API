'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller');
const authService = require('../services/auth-service');

router.get('/city/:city', authService.isAdmin, controller.getByCity);
router.get('/:name', controller.getByNickname);
router.get('/id/:id', controller.getById);
//router.get('/aq/:aleatory_question', controller.getByAleatoryQuestions);
router.post('/',  controller.post);
router.put('/update-password', authService.authorize, controller.updatePassword);
router.patch('/recover-password', controller.recoverPassword);
router.post('/recover-questions', controller.recoverQuestions);
router.put('/:id', authService.authorize, controller.put);
router.delete('/', authService.authorize, controller.delete);
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', controller.refreshToken);


module.exports = router;


