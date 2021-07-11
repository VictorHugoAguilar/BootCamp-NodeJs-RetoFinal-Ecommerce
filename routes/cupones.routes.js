'use strict'
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const auth = require('../middlewares/authentificate');

// CONTROLLERS
const {
    registrarCupon,
    buscarCuponesPorCodigo,
    buscarCuponPorId,
    actualizarCupon,
    eliminarCupon
} = require('../controllers/cupones.controller');

// ENDPOINTS
// CUPONES
router.post('/registrar-cupon', [auth], registrarCupon);
router.get('/buscar-cupon-codigo/:codigo', [auth], buscarCuponesPorCodigo);
router.get('/buscar-cupon-id/:id', [auth], buscarCuponPorId);
router.put('/actualizar-cupon/:id', [auth], actualizarCupon);
router.delete('/eliminar-cupon/:id', [auth], eliminarCupon);

module.exports = router;