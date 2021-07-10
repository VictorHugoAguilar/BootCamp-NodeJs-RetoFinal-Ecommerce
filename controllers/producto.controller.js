'use strict'
const winston = require('../logs/winston');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const Producto = require('../models/producto.model');
const Inventario = require('../models/inventario.model');
const { JsonWebTokenError } = require('jsonwebtoken');

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
        if ((req.files || Object.keys(req.files).length !== 0) && req.files.portada.path) {
            const img_path = req.files.portada.path;
            const name = img_path.split('\/');
            const portada_name = name[2];
            data.portada = portada_name;
        }

        data.slug = data.titulo.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, '');

        const createdPoducto = await Producto.create(data);

        const inventarioDB = await Inventario.create({
            admin: req.user.sub,
            cantidad: data.stock,
            proveedor: 'Tienda propia',
            producto: createdPoducto._id
        })

        return res.status(200).json({
            ok: true,
            data: createdPoducto,
            inventarioDB
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

        if (req.files || Object.keys(req.files).length !== 0) {
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

        if (productoDB) {
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

const listarInventarioProducto = async(req, res) => {
    winston.log('info', 'inicio de listar inventario de producto', { service: 'inventario producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'eliminar producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];

    try {
        const inventarioDB = await Inventario.find({ producto: id })
            .populate('admin')
            .sort({ createdAt: -1 });

        if (!inventarioDB) {
            return res.status(200).json({
                ok: true,
                msg: `No se ha encontrado inventario para id de producto ${id}`
            });
        }

        return res.status(200).json({
            ok: true,
            data: inventarioDB
        });

    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: `No se ha encontrado inventario para id de producto ${id}`,
            data: []
        });
    }
}

const eliminarInventarioProducto = async(req, res) => {
    winston.log('info', 'inicio de eliminar inventario de producto', { service: 'inventario producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'eliminar producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    const id = req.params['id'];

    try {
        const inventarioDB = await Inventario.findById(id);

        const productoDB = await Producto.findOne({ _id: inventarioDB.producto });

        const nuevoStock = parseInt(productoDB.stock) - parseInt(inventarioDB.cantidad);

        if (nuevoStock < 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No hay stock suficiente',
                data: []
            });
        }

        const updateProduct = await Producto.findByIdAndUpdate({ _id: inventarioDB.producto }, {
            stock: nuevoStock
        }, { new: true });

        return res.status(200).json({
            ok: true,
            data: updateProduct
        });

    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: `No se ha encontrado inventario para id de producto ${id}`,
            data: []
        });
    }
}

const registrarInventarioProducto = async(req, res) => {
    winston.log('info', 'inicio de  registrar inventario de producto', { service: 'inventario producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'eliminar producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    try {
        const inventario = req.body;

        const inventarioUPD = {
            ...inventario,
            admin: req.user.sub
        }

        const inventarioDB = await Inventario.create(inventarioUPD);

        const productoDB = await Producto.findById(inventarioDB.producto);

        const nuevoStock = parseInt(productoDB.stock) + parseInt(inventarioDB.cantidad);

        const updateProduct = await Producto.findByIdAndUpdate({ _id: inventarioDB.producto }, {
            stock: nuevoStock
        }, { new: true });

        return res.status(200).json({
            ok: true,
            data: inventarioDB
        })

    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: `No se ha encontrado inventario para id de producto ${id}`,
            data: []
        });
    }
}

const registrarVariedadDeProducto = async(req, res) => {
    winston.log('info', 'inicio de registro de variedad de producto', { service: 'inventario producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'eliminar producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }
    const id = req.params['id'];
    const data = req.body;

    const productoUpd = {
        titulo_variedad: data.titulo_variedad,
        variedad: data.variedad
    };

    try {
        const updateProduct = await Producto.findByIdAndUpdate(id, productoUpd, { new: true });

        return res.status(200).json({
            ok: true,
            data: updateProduct
        })
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: `No se ha encontrado producto para id de producto ${id}`,
            data: []
        });
    }
}

const registrarGaleriaDeProducto = async(req, res) => {
    winston.log('info', 'inicio de registro de galeria de producto', { service: 'galeria de producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'galeria de producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }
    const id = req.params['id'];
    const data = req.body;

    try {
        if ((req.files || Object.keys(req.files).length !== 0) && req.files.imagen.path) {
            const img_path = req.files.imagen.path;
            const name = img_path.split('\/');
            const imagen_name = name[2];

            console.log(imagen_name)

            const updateProduct = await Producto.findByIdAndUpdate(id, {
                $push: {
                    galeria: {
                        imagen: imagen_name,
                        _id: uuidv4()
                    }
                }
            }, { new: true });

            return res.status(200).json({
                ok: true,
                data: updateProduct
            })
        }
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: `No se ha encontrado producto para id de producto ${id}`,
            data: []
        });
    }
}

const eliminarImagenDeGaleriaDeProducto = async(req, res) => {
    winston.log('info', 'inicio de eliminación de imagen de galeria de producto', { service: 'galeria de producto' })

    if (req.user && req.user.rol !== 'admin') {
        winston.log('error', 'No se tiene permisos para este proceso', { service: 'galeria de producto' })
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }
    const id = req.params['id'];
    const data = req.body;

    try {
        const updateProduct = await Producto.findByIdAndUpdate(id, {
            $pull: {
                galeria: {
                    _id: data._id
                }
            }
        }, { new: true });

        if (data.imagen) {
            // Comprobamos el fichero almacenado anteriormente si existe
            fs.stat(`./uploads/productos/${data.imagen}`, (err) => {
                if (!err) {
                    // Eliminamos el fichero anterior si existe
                    fs.unlink(`./uploads/productos/${data.imagen}`, (error) => {
                        if (error) {
                            throw error;
                        }
                    })
                }
            })
        }

        return res.status(200).json({
            ok: true,
            data: updateProduct
        })

    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: `No se ha encontrado producto para id de producto ${id}`,
            data: []
        });
    }
}

const listarProductosPorTituloPublico = async(req, res) => {
    winston.log('info', 'inicio de listar productos por titulo', { service: 'listar productos' })

    const filtro = req.params['filtro'];
    const productos = await Producto.find({ titulo: new RegExp(filtro, 'i') });

    return res.status(200).json({
        ok: true,
        data: productos
    })
}

const listarProductosCategoriaPublico = async(req, res) => {
    winston.log('info', 'inicio de listar productos por categoria', { service: 'listar productos' })

    const filtro = req.params['filtro'];
    const productos = await Producto.find({ categoria: new RegExp(filtro, 'i') });

    return res.status(200).json({
        ok: true,
        data: productos
    })
}

const listarProductosMasVendidos = async(req, res) => {
    winston.log('info', 'inicio de listar productos más vendidos', { service: 'listar productos' })

    const productos = await Producto.find()
        .sort({ nventas: -1 });

    return res.status(200).json({
        ok: true,
        data: productos
    })
}

const listarProductosPrecio = async(req, res) => {
    winston.log('info', 'inicio de listar productos por precio y orden', { service: 'listar productos' })

    const orden = req.params['orden'];
    let productos;
    if (orden.toUpperCase() == 'MAYOR') {
        productos = await Producto.find()
            .sort({ precio: -1 });
    }
    if (orden.toUpperCase() == 'MENOR') {
        productos = await Producto.find()
            .sort({ precio: 1 });
    }

    return res.status(200).json({
        ok: true,
        data: productos
    })
}

const listarProductosPorTipoYOrden = async(req, res) => {
    winston.log('info', 'inicio de listar productos por tipo y orden', { service: 'listar productos' })

    const { tipo, orden } = req.body;
    let ordenNum;
    let productos;

    if (orden && orden.toUpperCase() == "MAYOR") {
        ordenNum = -1
    } else {
        ordenNum = 1
    }

    if (!tipo) {
        return res.status(200).json({
            ok: true,
            data: []
        })
    }

    switch (tipo) {
        case 'titulo':
            productos = await Producto.find()
                .sort({ titulo: ordenNum });
            break;
        case 'precio':
            productos = await Producto.find()
                .sort({ precio: ordenNum });
            break;
        case 'stock':
            productos = await Producto.find()
                .sort({ stock: ordenNum });
            break;
        case 'categoria':
            productos = await Producto.find()
                .sort({ categoria: ordenNum });
            break;
        case 'createdAt':
            productos = await Producto.find()
                .sort({ createdAt: ordenNum });
            break;
    }


    return res.status(200).json({
        ok: true,
        data: productos
    })
}



module.exports = {
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
    listarProductosPorTipoYOrden
}