'use strict'
const winston = require('../logs/winston');

const Carrito = require('../models/carrito.model');

const anadirProductoCarrito = async(req, res) => {
    winston.log('info', 'inicio añadir en carrito', { service: 'añadir a carrito' })

    if (req.user) {
        const data = req.body;
        const clienteId = req.user.sub;

        const createCarrito = {
            ...data,
            cliente: clienteId
        }

        const carritoCliente = await Carrito.find({ cliente: clienteId, producto: data.producto });
        console.log(carritoCliente)

        if (carritoCliente.length == 0) {
            const createdCarrito = await Carrito.create(createCarrito);
            return res.status(200).json({
                ok: true,
                data: createdCarrito
            });
        } else if (carritoCliente.length >= 1) {
            return res.status(200).json({ ok: false, msg: 'producto ya en el carrito', data: [] });
        }

    } else {
        return res.status(500).json({
            ok: false,
            msg: 'No se tiene permiso para la operación',
            data: []
        });
    }

}

const obtenerProductosEnCarrito = async(req, res) => {
    winston.log('info', 'inicio obtener producto en carrito', { service: 'obtener carrito' })

    if (req.user) {
        const clienteId = req.user.sub;
        const carritoCliente = await Carrito.find({ cliente: clienteId }).populate('producto');

        if (carritoCliente.length > 0) {

            return res.status(200).json({
                ok: true,
                data: carritoCliente
            });
        } else {
            return res.status(200).json({ ok: false, msg: 'no hay producto en el carrito', data: [] });
        }

    } else {
        return res.status(500).json({
            ok: false,
            msg: 'No se tiene permiso para la operación',
            data: []
        });
    }

}

const eliminarProductoDeCarrito = async(req, res) => {
    winston.log('info', 'inicio borrar producto del carrito', { service: 'borrar carrito' })

    if (req.user) {
        const id = req.params['id'];
        const deletedCarrito = await Carrito.findByIdAndDelete(id);

        if (!deletedCarrito) {
            return res.status(200).json({
                ok: false,
                msg: `No se ha encotrado producto con id ${id} en el carrito`,
                data: []
            });
        }

        return res.status(200).json({
            ok: true,
            data: deletedCarrito
        });

    } else {
        return res.status(500).json({
            ok: false,
            msg: 'No se tiene permiso para la operación',
            data: []
        });
    }
}

module.exports = {
    anadirProductoCarrito,
    obtenerProductosEnCarrito,
    eliminarProductoDeCarrito
}