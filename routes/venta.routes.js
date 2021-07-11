'use strict'
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const auth = require('../middlewares/authentificate');

// CONTROLLERS
const {
    registrarCompraCliente,
    obtenerComprasCliente,
    obtenerDetalleComprasCliente,
    obtenerVentasAdmin,
    obtenerVentasRangoAdmin
} = require('../controllers/venta.controller');

// ENDPOINTS
// VENTAS
router.post('/registrar-compra-cliente/', [
    auth,
    check('subtotal', 'El subtotal es obligatorio').isNumeric().not().isEmpty(),
    check('envio_titulo', 'La titulo del envio es obligatoria').not().isEmpty(),
    check('transaccion', 'La transaccion es obligatoria').not().isEmpty(),
    check('detalles', 'Los productos son obligatorios').not().isEmpty(),
    validarCampos
], registrarCompraCliente);
router.get('/obtener-compras-cliente/', [auth], obtenerComprasCliente);
router.get('/obtener-detalle-compra-cliente/:id', [auth], obtenerDetalleComprasCliente);

// VENTAS ROL ADMIN
router.get('/obtener-ventas-totales', [auth], obtenerVentasAdmin);
router.get('/obtener-ventas-rango-fecha/:desde?/:hasta?', [auth], obtenerVentasRangoAdmin);


module.exports = router;