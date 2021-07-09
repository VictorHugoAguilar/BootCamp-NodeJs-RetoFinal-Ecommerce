'use strict'
const winston = require('../logs/winston');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const { generateJWT } = require('../helpers/jwt');
const Producto = require('../models/producto.model');
const Admin = require('../models/admin.model');

const registrarProductoConAdmin = async(req, res) => {
    winston.log('info', 'inicio del registro de producto con administrador', { service: 'registrar producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'registrar producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const data = req.body;
    if (!data) {
        winston.log('error', 'Faltan datos para procesar la petición', { service: 'registrar producto' })
        return res.status(404).json({ ok: false, msg: 'Faltan datos para procesar la petición' });
    }

    try {
        if (req.files && req.files.portada.path) {
            const img_path = req.files.portada.path;
            const name = img_path.split('\/');
            const portada_name = name[2];
            data.portada = portada_name;
        }

        data.slug = data.titulo.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, '');

        const createdPoducto = await Producto.create(data);

        return res.status(200).json({
            ok: true,
            data: createdPoducto
        })
    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'crear producto' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la peticion'
        });
    }
}

const listarProductos = async(req, res) => {
    winston.log('info', 'inicio de listar producto con administrador', { service: 'listar producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'listar producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const filtro = req.params['filtro'];
    if (!filtro) {
        winston.log('error', 'Faltan datos para procesar la petición', { service: 'listar producto' })
        return res.status(404).json({ ok: false, msg: 'Faltan datos para procesar la petición' });
    }

    try {
        const productosBD = await Producto.find({ titulo: new RegExp(filtro, 'i') });

        return res.status(200).json({
            ok: true,
            data: productosBD
        })
    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'listar producto' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la peticion'
        });
    }
}

const obtenerPortadaProductoPorImg = async(req, res) => {
    winston.log('info', 'obtener portada de producto por img', { service: 'portada producto' })

    const img = req.params['img'];
    fs.stat(`./uploads/productos/${img}`, (err) => {
        if (!err) {
            const path_img = `./uploads/productos/${img}`;
            return res.status(200).sendFile(path.resolve(path_img));
        } else {
            winston.log('warn', 'no se ha encontrado portada de producto por ese nombre de imagen', { service: 'portada producto' })
            const path_img = `./uploads/notImage.gif`;
            return res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const obtenerPortadaProductoTituloProducto = async(req, res) => {
    winston.log('info', 'obtener portada de producto por titulo producto', { service: 'portada producto' })
    const titulo = req.params['titulo'];

    try {
        const productoDB = await Producto.findOne({ titulo: new RegExp(titulo, 'i') });

        if (!productoDB) {
            winston.log('warn', 'no se ha encontrado producto por ese titulo', { service: 'portada producto' })
            const path_img = `./uploads/notImage.gif`;
            return res.status(200).sendFile(path.resolve(path_img));
        }

        if (!productoDB.portada || productoDB.portada == null) {
            winston.log('warn', 'no se ha encontrado portada del producto por ese titulo', { service: 'portada producto' })
            const path_img = `./uploads/notImage.gif`;
            return res.status(200).sendFile(path.resolve(path_img));
        }

        const img = productoDB.portada || notImage.gif;
        fs.stat(`./uploads/productos/${img}`, (err) => {
            if (!err) {
                const path_img = `./uploads/productos/${img}`;
                return res.status(200).sendFile(path.resolve(path_img));
            }
        })

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'listar producto' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la peticion'
        });
    }
}

const obtenerProductoPorId = async(req, res) => {
    winston.log('info', 'inicio de obtener producto por id', { service: 'obtener producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'obtener producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];

    try {
        const productoDB = await Producto.findById(id);

        if (!productoDB) {
            winston.log('warn', 'no se ha encontrado producto por ese id', { service: 'obtener producto' })

            return res.status(404).json({
                ok: false,
                msg: 'No se ha obtenido producto por id'
            });
        }

        return res.status(200).json({
            ok: true,
            data: productoDB
        })

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'listar producto' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la peticion'
        });
    }
}

const actualizarProducto = async(req, res) => {
    winston.log('info', 'inicio de actualizar producto', { service: 'actualizar producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'obtener producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    try {
        const id = req.params['id'];
        const data = req.body;

        const productoDB = await Producto.findById(id);
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        const productoUpd = {
            ...req.body
        }

        if (req.files)  {
            const img_path = req.files.portada.path;
            const name = img_path.split('\/');
            const portada_name = name[2];
            productoUpd.portada = portada_name;
            // Comprobamos el fichero almacenado anteriormente si existe
            fs.stat(`./uploads/productos/${productoDB.portada}`, (err) => {
                if (!err) {
                    // Eliminamos el fichero anterior si existe
                    fs.unlink(`./uploads/productos/${productoDB.portada}`, (error) => {
                        if (error) {
                            throw error;
                        }
                    })
                }
            })
        }
        const updateProduct = await Producto.findByIdAndUpdate(id, productoUpd, { new: true })

        return res.status(200).json({
            ok: true,
            data: updateProduct
        })

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'listar producto' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la peticion'
        });
    }
}

const eliminarProducto = async(req, res) => {
    winston.log('info', 'inicio de eliminar producto', { service: 'eliminar producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'eliminar producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    try {
        const id = req.params['id'];

        const productoDB = await Producto.findById(id);
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        if (productoDB)  {
            if (productoDB.portada) {
                // Comprobamos el fichero almacenado anteriormente si existe
                fs.stat(`./uploads/productos/${productoDB.portada}`, (err) => {
                    if (!err) {
                        // Eliminamos el fichero anterior si existe
                        fs.unlink(`./uploads/productos/${productoDB.portada}`, (error) => {
                            if (error) {
                                throw error;
                            }
                        })
                    }
                })
            }
            const deleteProduct = await Producto.findByIdAndDelete(id)

            return res.status(200).json({
                ok: true,
                data: deleteProduct
            })
        }
    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'listar producto' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la peticion'
        });
    }
}

module.exports = {
    registrarProductoConAdmin,
    listarProductos,
    obtenerPortadaProductoPorImg,
    obtenerPortadaProductoTituloProducto,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
}