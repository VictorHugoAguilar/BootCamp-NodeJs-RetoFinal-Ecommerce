'use strict'
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const auth = require('../middlewares/authentificate');

const path = multipart({
    uploadDir: './uploads/productos'
});

// Controllers
const {
    registrarProductoConAdmin,
    listarProductos,
    obtenerPortadaProductoPorImg,
    obtenerPortadaProductoTituloProducto,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    listarInventarioProducto,
    eliminarInventarioProducto,
    registrarInventarioProducto,
} = require('../controllers/producto.controller');

// PRODUCTOS
// TODO: quitar comentario validación de email.
router.post('/registrar', [
    auth,
    path,
    //check('email', 'El email es obligatorio').isEmail(),
    //check('password', 'El password es obligatorio').not().isEmpty(),
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('apellidos', 'El apellidos es obligatorio').not().isEmpty(),
    //validarCampos
], registrarProductoConAdmin);

router.get('/listar/:filtro', [
    auth
], listarProductos);

router.get('/obtener-portada/:img', [], obtenerPortadaProductoPorImg);
router.get('/obtener-portada-titulo/:titulo', [], obtenerPortadaProductoTituloProducto);
router.get('/obtener-producto-id/:id', [], obtenerProductoPorId);
router.put('/actualizar-producto/:id', [auth, path], actualizarProducto);
router.delete('/eliminar-producto/:id', [auth, path], eliminarProducto);

// INVENTARIOS
router.get('/listar-inventario-producto/:id', [auth], listarInventarioProducto);
router.delete('/eliminar-inventario-producto/:id', [auth], eliminarInventarioProducto);
router.post('/registrar-inventario-producto/', [auth], registrarInventarioProducto);

module.exports = router;