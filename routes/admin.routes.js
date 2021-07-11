'use strict'
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

// CONTROLLERS
const {
    obtenerTodos,
    registrar,
    login
} = require('../controllers/admin.controller');

// ENDPOINTS
// ADMINISTRADORES
router.post('/registrar', [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellidos es obligatorio').not().isEmpty(),
        validarCampos
    ],
    registrar);
router.post('/login', [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login);

module.exports = router;