'use strict'
const winston = require('../logs/winston');
var mongodb = require('mongodb');

const { generarSecuencia } = require('../helpers/utils');

const Venta = require('../models/venta.model');
const Dventa = require('../models/dventa.model');
const Producto = require('../models/producto.model');
const Carrito = require('../models/carrito.model');


const registrarCompraCliente = async(req, res) => {
    winston.log('info', 'inicio de registro de compra del cliente logeado', { service: 'registrar compra cliente' })

    if (!req.user) {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    try {
        const NUMERO_SERIE_INICIAL = '001';
        const NUMERO_CORRELATIVO_INICIAL = '000001';
        const NUMERO_CORRELATIVO_FINAL = '999999';

        let data = req.body;
        const clienteCompra = req.user.sub;
        data.cliente = clienteCompra;
        const detalles = data.detalles;

        const ultimaVenta = await Venta.find().sort({ createdAt: -1 });
        let numeroVenta;

        if (ultimaVenta.length === 0) {
            numeroVenta = `${NUMERO_SERIE_INICIAL}-${NUMERO_CORRELATIVO_INICIAL}`;
        } else {
            const numeroVentaUltimo = ultimaVenta[0].nventa;
            const arrayNumeroVenta = numeroVentaUltimo.split("-");

            if (arrayNumeroVenta[1] != NUMERO_CORRELATIVO_FINAL) {
                const nuevoCorrelativo = generarSecuencia(parseInt(arrayNumeroVenta[1]) + 1, 6);
                numeroVenta = `${ arrayNumeroVenta[0]}-${nuevoCorrelativo}`;
            }
            if (arrayNumeroVenta[1] == NUMERO_CORRELATIVO_FINAL) {
                const nuevoSerie = generarSecuencia(parseInt(arrayNumeroVenta[0] + 1, 3));
                numeroVenta = `${ nuevoSerie }-${NUMERO_CORRELATIVO_INICIAL}`;
            }
        }

        data.nventa = numeroVenta;
        data.estado = 'Procesando';

        const createdVenta = await Venta.create(data);
        let detalleVenta = [];

        detalles.forEach(async producto => {
            producto.cliente = clienteCompra;
            producto.venta = createdVenta._id;
            detalleVenta.push(producto);

            const detalleVentaDb = await Dventa.create(producto);

            if (!detalleVentaDb) {
                return;
            }

            const productoDatabase = await Producto.findById({ _id: producto.producto });
            const newStock = productoDatabase.stock - producto.cantidad;
            await Producto.findByIdAndUpdate(producto.producto, {
                    stock: newStock
                })
                // TODO: quitar comentarios
                //await Carrito.remove({cliente: producto.cliente});
        })

        return res.status(200).json({
            ok: true,
            venta: createdVenta,
            detalle: detalleVenta
        });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'registrar compra cliente' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }
}

const obtenerComprasCliente = async(req, res) => {
    winston.log('info', 'inicio de obtención de compras del cliente logeado', { service: 'obtener compra cliente' })

    if (!req.user) {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }
    const clienteActual = req.user.sub;
    try {

        const ventasDB = await Venta.find({ cliente: clienteActual })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            ok: true,
            data: ventasDB
        })

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'registrar compra cliente' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }
}

const obtenerDetalleComprasCliente = async(req, res) => {
    winston.log('info', 'inicio de obtención de compras del cliente logeado', { service: 'obtener compra cliente' })

    if (!req.user) {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }
    const idVenta = req.params['id'];
    try {

        const ventaDB = await Venta.findById({ _id: idVenta })
            .populate('cliente')
            .populate('direccion');

        if (!ventaDB) {
            return res.status(404).json({
                ok: false,
                msg: `No se ha encontrado venta con el id ${idVenta}`,
                data: ventasDB
            })
        }

        const detalleVentaDB = await Dventa.find({ venta: ventaDB._id })
            .populate('producto');

        return res.status(200).json({
            ok: true,
            venta: ventaDB,
            detalle: detalleVentaDB
        })

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'registrar compra cliente' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }
}

const obtenerVentasAdmin = async(req, res) => {
    winston.log('info', 'inicio de obtención de venta para administrador', { service: 'obtención de ventas' })

    if (!req.user || req.user.rol !== 'admin') {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    try {
        const ventasTotales = await Venta.find()
            .populate('cliente')
            .sort({ createdAt: -1 });

        return res.status(200).json({ ok: true, data: ventasTotales });

    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'obtención de ventas' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }
}

const obtenerVentasRangoAdmin = async(req, res) => {
    winston.log('info', 'inicio de obtención de venta por rango de fechas para administrador', { service: 'obtención de ventas' })

    if (!req.user) {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    try {
        let ventas = [];
        let desde = req.params['desde'];
        let hasta = req.params['hasta'];

        if (desde == 'undefined' || desde == undefined || hasta == 'undefined' || hasta == undefined) {
            console.log('no rango')
            ventas = await Venta.find().populate('cliente').sort({ createdAt: -1 });
            return res.status(200).json({ ok: true, data: ventas });
        } else {
            const fec_desde = new Date(desde + 'T00:00:01.000Z').toISOString();
            const fec_hasta = new Date(hasta + 'T23:59:59.000Z').toISOString();

            ventas = await Venta.find()
                .gte('createdAt', new Date(fec_desde))
                .lte('createdAt', new Date(fec_hasta))
                .populate('cliente').sort({ createdAt: -1 });

            return res.status(200).json({ ok: true, data: ventas });
        }
    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'obtención de ventas' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }
}

module.exports = {
    registrarCompraCliente,
    obtenerComprasCliente,
    obtenerDetalleComprasCliente,
    obtenerVentasAdmin,
    obtenerVentasRangoAdmin
}