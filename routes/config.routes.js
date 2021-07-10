'use strict'
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const path = multipart({
    uploadDir: './uploads/config'
});
const { check } = require('express-validator');
const auth = require('../middlewares/authentificate');
const { validarCampos } = require('../middlewares/validar-campos');

// Controllers
const { actualizarConfiguracion, crearConfiguracion, obtenerConfiguracion, obtenerLogoPorImg, obtenerConfiguracionPublico } = require('../controllers/config.controller');

router.get('/obtener-config-publico/', obtenerConfiguracionPublico);
router.get('/obtener-config/:id', [auth], obtenerConfiguracion);
router.post('/registrar-config/', [auth, path], crearConfiguracion);
router.put('/actualizar-config/:id', [auth, path], actualizarConfiguracion);
router.get('/obtener-logo/:img', obtenerLogoPorImg);


module.exports = router;