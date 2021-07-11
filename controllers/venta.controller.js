'use strict'
const winston = require('../logs/winston');

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
        var detalleVenta = [];

        detalles.forEach(async producto => {
            producto.cliente = clienteCompra;
            const detalleVentaDb = await Dventa.create(producto);
            detalleVenta.push(JSON.stringify(detalleVentaDb));

            const productoDatabase = await Producto.findById({ _id: producto.producto });
            console.log(productoDatabase)
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

/*
const baseComun = async(req, res) => {
    winston.log('info', 'inicio de registro de compra del cliente logeado', { service: 'registrar compra cliente' })

    if (!req.user) {
        return res.status(401).json({ ok: false, msg: 'No se tiene permisos para este proceso' });
    }

    try {


    } catch (error) {
        winston.log('error', `error ${error}`, { service: 'registrar compra cliente' });
        return res.status(404).json({
            ok: false,
            msg: 'No se ha podido procesar la petición'
        });
    }
}
*/


module.exports = {
    registrarCompraCliente,
}