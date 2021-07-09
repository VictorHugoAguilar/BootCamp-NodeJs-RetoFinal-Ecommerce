'use strict'
const winston = require('../logs/winston');
const bcrypt = require('bcrypt');
const { generateJWT } = require('../helpers/jwt');

const Cliente = require('../models/cliente.model');

const listarTodos = async(req, res) => {
    winston.log('info', 'inicio obtencion de cliente', { service: 'obtener cliente' })

    const clientesDB = await Cliente.find();

    return res.status(200).json({
        ok: true,
        data: clientesDB
    });
}

const listarConFiltro = async(req, res) => {
    const tipo = req.params['tipo'];
    const filtro = req.params['filtro'];

    let clientesDB;

    if (tipo == null || tipo == 'null') {
        clientesDB = await Cliente.find();
    } else {
        switch (tipo) {
            case 'apellidos':
                clientesDB = await Cliente.find({ apellidos: new RegExp(filtro, 'i') });
                break;
            case 'email':
                clientesDB = await Cliente.find({ email: new RegExp(filtro, 'i') });
                break;
        }
    }

    if (clientesDB) {
        res.status(200).json({ data: clientesDB })
    }
}

const registrar = async(req, res) => {
    winston.log('info', 'inicio del registro de cliente', { service: 'registrar cliente' })

    const { email, password } = req.body;
    try {
        const existeEmail = await Cliente.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({ ok: false, msg: 'El usuario ya existe' });
        }
        const cliente = new Cliente(req.body);
        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        cliente.password = bcrypt.hashSync(password, salt);
        await cliente.save();
        const token = await generateJWT(cliente);
        return res.status(202).json({
            ok: true,
            cliente,
            token
        });
    } catch (error) {
        winston.log('error', `error => ${error}`, { service: 'registrar cliente' })
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga de usuario' });
    }
}

const registrarClienteAdmin = async(req, res) => {
    winston.log('info', 'inicio del registro de cliente por un administrador', { service: 'registrar cliente' })

    if (req.user && req.user.role === 'admin') {
        const { email, password } = req.body;
        try {
            const existeEmail = await Cliente.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({ ok: false, msg: 'El usuario ya existe' });
            }
            const cliente = new Cliente(req.body);
            // encriptar contraseña
            const salt = bcrypt.genSaltSync();
            cliente.password = bcrypt.hashSync(password, salt);
            await cliente.save();
            const token = await generateJWT(cliente);
            return res.status(202).json({
                ok: true,
                cliente,
                token
            });
        } catch (error) {
            winston.log('error', `error => ${error}`, { service: 'registrar cliente' })
            return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga de usuario' });
        }
    }
    return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
}

const login = async(req, res) => {
    winston.log('info', 'inicio login de cliente', { service: 'login cliente' })
    const { email, password } = req.body;
    // Controlamos los fallos
    try {
        // Verificar email
        const clienteDB = await Cliente.findOne({ email });
        if (!clienteDB) {
            winston.log('warn', `el usuario ${email} no existe login`, { service: 'login cliente' })

            return res.status(404).json({ ok: false, msg: 'El usuario no es válido' });
        }
        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, clienteDB.password);
        if (!validPassword) {
            winston.log('warn', `el usuario ${email} no coincide la contrasena del login`, { service: 'login cliente' })
            return res.status(400).json({ ok: false, msg: 'El usuario no es válido' });
        }
        // Generar el token
        const token = await generateJWT(clienteDB);
        // Retornamos la respuesta
        return res.status(200).json({
            ok: true,
            token: token
        })
    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'login cliente' });
    }
}

module.exports = {
    listarTodos,
    listarConFiltro,
    registrar,
    registrarClienteAdmin,
    login
}