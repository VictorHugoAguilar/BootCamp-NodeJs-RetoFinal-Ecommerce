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

// CONTROLLERS
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
    registrarVariedadDeProducto,
    registrarGaleriaDeProducto,
    eliminarImagenDeGaleriaDeProducto,
    listarProductosPorTituloPublico,
    listarProductosCategoriaPublico,
    listarProductosMasVendidos,
    listarProductosPrecio,
    listarProductosPorTipoYOrden,
    verDetalleProductoPorSlug,
} = require('../controllers/producto.controller');

// ENDPOINTS
// PRODUCTOS
router.post('/registrar', [
    auth,
    path,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('contenido', 'El contenido es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').isNumeric().not().isEmpty(),
    validarCampos
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

// VARIEDADES
router.put('/registrar-variedad/:id', [auth], registrarVariedadDeProducto);

// GALERIA
router.put('/registrar-galeria/:id', [auth, path], registrarGaleriaDeProducto)
router.put('/eliminar-imagen-galeria/:id', [auth], eliminarImagenDeGaleriaDeProducto)

// METODOS PUBLICOS PARA CLIENTES
router.get('/listar-productos-filtrados-titulo/:filtro', listarProductosPorTituloPublico)
router.get('/listar-productos-filtrados-categoria/:filtro', listarProductosCategoriaPublico)
router.get('/listar-productos-mas-vendido/', listarProductosMasVendidos)
router.get('/listar-productos-orden-precio/:orden', listarProductosPrecio)
router.post('/listar-productos-tipo-orden/', listarProductosPorTipoYOrden)
router.get('/listar-productos-detalle/:slug', verDetalleProductoPorSlug)


module.exports = router;