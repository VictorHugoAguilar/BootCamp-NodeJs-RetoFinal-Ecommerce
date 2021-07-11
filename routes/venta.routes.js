'use strict'
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const auth = require('../middlewares/authentificate');
const { registrarCompraCliente, obtenerComprasCliente, obtenerDetalleComprasCliente, obtenerVentasAdmin, obtenerVentasRangoAdmin } = require('../controllers/venta.controller');

router.post('/registrar-compra-cliente/', [auth], registrarCompraCliente);
router.get('/obtener-compras-cliente/', [auth], obtenerComprasCliente);
router.get('/obtener-detalle-compra-cliente/:id', [auth], obtenerDetalleComprasCliente);

// Rol Admin
router.get('/obtener-ventas-totales', [auth], obtenerVentasAdmin);
router.get('/obtener-ventas-rango-fecha/:desde?/:hasta?', [auth], obtenerVentasRangoAdmin);


module.exports = router;