'use strict'
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const auth = require('../middlewares/authentificate');

// Controllers
const {
    registrar,
    login,
    listarTodos,
    listarConFiltro,
    registrarClienteConAdmin,
    listarClienteConAdmin,
    actualizarClienteConAdmin,
    eliminarClienteConAdmin,
    obtenerCliente,
    actualizaCliente,
    registrarDireccionCliente,
    obtenerDireccionCliente,
    actualizarDireccionCliente,
    eliminarDireccionCliente,
    obtenerDireccionClientePrincipal,
} = require('../controllers/cliente.controller');


/**
 * 
 * Routes
 * /api/clientes
 * 
 */

// TODO: quitar comentario validación de email.
router.post('/login', [
        //check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login);
// TODO: quitar comentario validación de email.
router.post('/registrar', [
    //check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellidos es obligatorio').not().isEmpty(),
    validarCampos
], registrar);

router.get('/listar', listarTodos);
router.get('/obtener-cliente', [auth], obtenerCliente);
router.put('/actualizar-cliente', [auth], actualizaCliente);

router.get('/listar-filtro/:tipo/:filtro?', [
    auth
], listarConFiltro);

router.post('/registrar-con-admin', [
    auth
], registrarClienteConAdmin);

router.get('/listar-cliente-con-admin/:id', [
    auth,
    //check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellidos es obligatorio').not().isEmpty(),
    validarCampos
], listarClienteConAdmin);

router.put('/actualizar-cliente-con-admin/:id', [
    auth
], actualizarClienteConAdmin);

router.delete('/eliminar-cliente-con-admin/:id', [
    auth
], eliminarClienteConAdmin);

// DIRECCIONES CLIENTE
router.post('/registrar-direccion-cliente', [auth], registrarDireccionCliente);
router.get('/obtener-direccion-cliente', [auth], obtenerDireccionCliente);
router.get('/obtener-direccion-cliente-principal', [auth], obtenerDireccionClientePrincipal);
router.put('/actualizar-direccion-cliente-principal/:id', [auth], actualizarDireccionCliente);
router.delete('/eliminar-direccion-cliente/:id', [auth], eliminarDireccionCliente);


module.exports = router;