'use strict'
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authentificate');
const { registrarCompraCliente } = require('../controllers/venta.controller');


router.post('/registrar-compra-cliente/', [auth], registrarCompraCliente);


module.exports = router;