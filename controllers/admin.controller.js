'use strict'
const winston = require('../logs/winston');
const bcrypt = require('bcrypt');

const Admin = require('../models/admin.model');
const { generateJWT } = require('../helpers/jwt');

const obtenerTodos = async(req, res) => {
    winston.log('info', 'inicio obtencion de administradores', { service: 'obtener administrador' })

    const adminDB = await Admin.find();

    return res.status(200).json({
        ok: true,
        data: adminDB,
    });
}

const registrar = async(req, res) => {
    winston.log('info', 'inicio del registro de administrador', { service: 'registrar administrado' })
    const { email, password } = req.body;
    try {
        const existeEmail = await Admin.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({ ok: false, msg: 'El usuario ya existe' });
        }
        const admin = new Admin(req.body);
        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        admin.password = bcrypt.hashSync(password, salt);
        await admin.save();
        const token = await generateJWT(admin);
        return res.status(202).json({
            ok: true,
            admin,
            token
        });
    } catch (error) {
        winston.log('error', `error => ${error}`, { service: 'registrar administrador' })
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la carga del administrador' });
    }
}

const login = async(req, res) => {
    winston.log('info', 'inicio login de administrador', { service: 'login administrado' })
    const { email, password } = req.body;
    // Controlamos los fallos
    try {
        // Verificar email
        const adminDB = await Admin.findOne({ email });
        if (!adminDB) {
            winston.log('warn', `el usuario ${email} no existe login`, { service: 'login administrado' })

            return res.status(404).json({ ok: false, msg: 'El usuario no es válido' });
        }
        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, adminDB.password);
        if (!validPassword) {
            winston.log('warn', `el usuario ${email} no coincide la contrasena del login`, { service: 'login cliente' })
            return res.status(400).json({ ok: false, msg: 'El usuario no es válido' });
        }
        console.log(adminDB)
            // Generar el token
        const token = await generateJWT(adminDB);
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
    obtenerTodos,
    registrar,
    login
}