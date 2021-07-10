'use strict'
const winston = require('../logs/winston');
const fs = require('fs');
const path = require('path');

const Config = require('../models/config.model');


const obtenerConfiguracion = async(req, res) => {
    winston.log('info', 'inicio de obtención de configuracion', { service: 'obtener configuracion' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'crear configuracion' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }
    const id = req.params['id'];

    try {
        const config = await Config.findById(id);

        if (!config) {
            return res.status(404).json({
                ok: true,
                msg: `No se ha encontrado configuración para id ${id}`,
                data: []
            });
        }

        return res.status(200).json({
            ok: true,
            data: config
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'obtener configuración' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }

}

const crearConfiguracion = async(req, res) => {
    winston.log('info', 'inicio de registro de configuracion', { service: 'crear configuracion' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'crear configuracion' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const data = req.body;

    try {
        if (req.files || Object.keys(req.files).length !== 0) {
            const img_path = req.files.logo.path;
            const name = img_path.split('\/');
            const portada_name = name[2];

            const configToCreate = {
                ...data
            }
            configToCreate.logo = portada_name;
            configToCreate.categorias = JSON.parse(data.categorias);

            const createdConfig = await Config.create(configToCreate);
            console.log(createdConfig)

            return res.status(200).json({
                ok: true,
                data: createdConfig
            });
        }
    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'crear configuración' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }
}

const actualizarConfiguracion = async(req, res) => {
    winston.log('info', 'inicio de actualizacion de configuracion', { service: 'actualiza configuracion' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'eliminar producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];
    const data = req.body;

    const configToUpdate = await Config.findById(id);
    if (!configToUpdate) {
        return res.status(404).json({
            ok: false,
            msg: `No se ha encontrado config con el id ${id}`
        });
    }

    try {

        if (req.files || Object.keys(req.files).length !== 0) {
            const img_path = req.files.logo.path;
            const name = img_path.split('\/');
            const portada_name = name[2];

            const configUpd = {
                ...data
            }

            configUpd.logo = portada_name;
            configUpd.categorias = JSON.parse(data.categorias);

            const updatedConfig = await Config.findByIdAndUpdate(id, configUpd, { new: true });


            // Comprobamos el fichero almacenado anteriormente si existe
            fs.stat(`./uploads/config/${configToUpdate.logo}`, (err) => {
                if (!err) {
                    // Eliminamos el fichero anterior si existe
                    fs.unlink(`./uploads/config/${configToUpdate.logo}`, (error) => {
                        if (error) {
                            throw error;
                        }
                    })
                }
            });

            return res.status(200).json({
                ok: true,
                data: updatedConfig
            });
        }

        const updatedConfig = await Config.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            ok: true,
            data: updatedConfig
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'actualizar configuración' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la peticion'
        });
    }
}

const obtenerLogoPorImg = async(req, res) => {
    winston.log('info', 'obtener logo de configuración por img', { service: 'portada producto' })

    const img = req.params['img'];
    fs.stat(`./uploads/config/${img}`, (err) => {
        if (!err) {
            const path_img = `./uploads/config/${img}`;
            return res.status(200).sendFile(path.resolve(path_img));
        } else {
            winston.log('warn', 'no se ha encontrado logo de la configuración ese nombre de imagen', { service: 'logo configuración' })
            const path_img = `./uploads/notImage.gif`;
            return res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const obtenerConfiguracionPublico = async(req, res) => {
    //const id = req.params['id'];
    // ID CONFIGURACIÓN GLOBAL DE LA APP LO ALMACENAMOS EN LAS VARIABLES GLOBALES
    const id = process.env.ID_CONFIG_APP

    try {
        const config = await Config.findById(id);

        if (!config) {
            return res.status(404).json({
                ok: true,
                msg: `No se ha encontrado configuración para id ${id}`,
                data: []
            });
        }

        return res.status(200).json({
            ok: true,
            data: config
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'obtener configuración público' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }

}

module.exports = {
    obtenerConfiguracion,
    crearConfiguracion,
    actualizarConfiguracion,
    obtenerLogoPorImg,
    obtenerConfiguracionPublico
}