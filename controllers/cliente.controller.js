'use strict'
const winston = require('../logs/winston');
const bcrypt = require('bcrypt');

const Cliente = require('../models/cliente.model');
const { generateJWT } = require('../helpers/jwt');

const listarTodos = async(req, res) => {
    winston.log('info', 'inicio obtencion de cliente', { service: 'obtener cliente' })

    const clienteDB = Cliente.find();

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
        clientesDB = Cliente.find();
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
        res.status(200).json({ data: clientesDB; })
    }
}

const registrar = async(req, res) => {
    winston.log('info', 'inicio del registro de cliente', { service: 'registrar cliente' })
        // TODO: 
    res.status(200).send({ message: 'hola' })
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
    login
}