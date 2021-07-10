'use strict'
const winston = require('../logs/winston');
const bcrypt = require('bcrypt');
const { generateJWT } = require('../helpers/jwt');

const Cliente = require('../models/cliente.model');

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
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga de usuario' });
    }
}

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

const registrarClienteConAdmin = async(req, res) => {
    winston.log('info', 'inicio del registro de cliente por un administrador', { service: 'registrar cliente' })

    if (req.user && req.user.rol === 'admin') {
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

const listarClienteConAdmin = async(req, res) => {
    winston.log('info', 'obtencion de cliente por un administrador', { service: 'obtener cliente' })

    if (req.user && req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];
    if (!id || id == undefined || id == 'undefined') {
        return res.status(404).json({ ok: false, msg: 'Tiene que tener un id cliente' });
    }

    try {
        const clienteDB = await Cliente.findById(id);

        if (!clienteDB) {
            return res.status(404).json({ ok: false, msg: 'El cliente no existe' });
        }

        return res.status(200).json({
            ok: true,
            data: clienteDB
        });
    } catch (error) {
        winston.log('error', `error => ${error}`, { service: 'registrar cliente' })
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga de usuario' });
    }
}

const actualizarClienteConAdmin = async(req, res) => {
    winston.log('info', 'inicio de actualizar de cliente por un administrador', { service: 'actualizar cliente' })

    if (req.user && req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];
    if (!id || id == undefined || id == 'undefined') {
        return res.status(404).json({ ok: false, msg: 'Tiene que tener un id cliente' });
    }

    try {
        const clienteDB = await Cliente.findById(id);

        if (!clienteDB) {
            return res.status(404).json({ ok: false, msg: 'El cliente no existe' });
        }

        const clienteUpd = {
            ...req.body
        }

        const updateClient = await Cliente.findByIdAndUpdate(id, clienteUpd, { new: true });

        return res.status(200).json({
            ok: true,
            data: updateClient
        });
    } catch (error) {
        winston.log('error', `error => ${error}`, { service: 'registrar cliente' })
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga de usuario' });
    }
}

const eliminarClienteConAdmin = async(req, res) => {
    winston.log('info', 'inicio de eliminacion de cliente por un administrador', { service: 'eliminar cliente' })

    if (req.user && req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];
    if (!id || id == undefined || id == 'undefined') {
        return res.status(404).json({ ok: false, msg: 'Tiene que tener un id cliente' });
    }

    try {
        const clienteDB = await Cliente.findById(id);

        if (!clienteDB) {
            return res.status(404).json({ ok: false, msg: 'El cliente no existe' });
        }

        const deleteClient = await Cliente.findByIdAndRemove(id);

        return res.status(200).json({
            ok: true,
            data: deleteClient
        });
    } catch (error) {
        winston.log('error', `error => ${error}`, { service: 'registrar cliente' })
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga de usuario' });
    }
}

const obtenerCliente = async(req, res) => {
    winston.log('info', 'inicio de obtención de datos del cliente logeado', { service: 'obtener cliente' })

    if (!req.user) {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }
    const idCliente = req.user.sub;

    try {
        const cliente = await Cliente.findById(idCliente)

        return res.status(200).json({
            ok: true,
            data: cliente
        });
    } catch (error) {
        winston.log('error', `error => ${error}`, { service: 'obtener cliente' })
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga de usuario' });
    }
}

const actualizaCliente = async(req, res) => {
    winston.log('info', 'inicio de obtención de datos del cliente logeado', { service: 'obtener cliente' })

    if (!req.user) {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }
    const idCliente = req.user.sub;
    const data = req.body
    const { password } = data;

    try {

        if (data.password) {
            // encriptar contraseña
            const salt = bcrypt.genSaltSync();
            data.password = bcrypt.hashSync(password, salt);

            const updatedClient = await Cliente.findByIdAndUpdate(idCliente, data, { new: true });

            return res.status(200).json({
                ok: true,
                data: updatedClient
            });
        } else {
            const updatedClient = await Cliente.findByIdAndUpdate(idCliente, data, { new: true });

            return res.status(200).json({
                ok: true,
                data: updatedClient
            });
        }
    } catch (error) {
        winston.log('error', `error => ${error}`, { service: 'obtener cliente' })
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga de usuario' });
    }
}

module.exports = {
    login,
    registrar,
    listarTodos,
    listarConFiltro,
    registrarClienteConAdmin,
    listarClienteConAdmin,
    actualizarClienteConAdmin,
    eliminarClienteConAdmin,
    obtenerCliente,
    actualizaCliente
}