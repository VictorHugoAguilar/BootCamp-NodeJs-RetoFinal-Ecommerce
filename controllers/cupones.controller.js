'use strict'
const winston = require('../logs/winston');

const Cupon = require('../models/cupon.model');


const registrarCupon = async(req, res) => {
    winston.log('info', 'inicio de registro de cupon por un administrador', { service: 'registrar cupon' })

    if (req.user && req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const cupon = req.body;

    try {
        const cuponDB = await Cupon.create(cupon);

        return res.status(200).json({
            ok: true,
            data: cuponDB
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'registrar cupon' });
        return res.status(500).json({ ok: false, msg: 'Error inesperado en registro del cupón' });
    }
}

const buscarCuponesPorCodigo = async(req, res) => {
    winston.log('info', 'inicio de buscar de cupon por codigo por un administrador', { service: 'buscar cupon' })

    if (req.user && req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const filtro = req.params['codigo'];

    try {
        const listaCupones = await Cupon.find({ codigo: new RegExp(filtro, 'i') });

        return res.status(200).json({
            ok: true,
            data: listaCupones
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'buscar cupon' });
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la búsqueda del cupón' });
    }
}

const buscarCuponPorId = async(req, res) => {
    winston.log('info', 'inicio de buscar de cupon por id por un administrador', { service: 'buscar cupon' })

    if (req.user && req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];

    try {
        const cupon = await Cupon.findById(id);

        return res.status(200).json({
            ok: true,
            data: cupon
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'buscar cupon' });
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la búsqueda del cupón' });
    }
}

const actualizarCupon = async(req, res) => {
    winston.log('info', 'inicio de actualización de cupon por id por un administrador', { service: 'buscar cupon' })

    if (req.user && req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];
    const data = req.body;

    try {
        const cupon = await Cupon.findById(id);

        if (!cupon) {
            return res.status(200).json({
                ok: false,
                msg: `No existe cupon con el id ${id}`,
                data: []
            });
        }

        const updatedCupon = await Cupon.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            ok: true,
            data: updatedCupon
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'buscar cupon' });
        return res.status(500).json({ ok: false, msg: 'Error inesperado en la actualización del cupón' });
    }
}

const eliminarCupon = async(req, res) => {
    winston.log('info', 'inicio de actualización de cupon por id por un administrador', { service: 'buscar cupon' })

    if (req.user && req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];

    try {
        const cupon = await Cupon.findById(id);

        if (!cupon) {
            return res.status(200).json({
                ok: false,
                msg: `No existe cupon con el id ${id}`,
                data: []
            });
        }

        const deletedCupon = await Cupon.findByIdAndDelete(id);

        return res.status(200).json({
            ok: true,
            data: deletedCupon
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'buscar cupon' });
        return res.status(500).json({ ok: false, msg: 'Error inesperado en borrado del cupón' });
    }
}


module.exports = {
    registrarCupon,
    buscarCuponesPorCodigo,
    buscarCuponPorId,
    actualizarCupon,
    eliminarCupon
}