'use strict'
const { Schema, model } = require('mongoose');

const VentaSchema = Schema({
    cliente: { type: Schema.ObjectId, ref: 'Cliente', require: true },
    nventa: { type: String, require: true },
    subtotal: { type: Number, require: true },
    envio_titulo: { type: String, require: true },
    envio_precio: { type: Number, require: true },
    transaccion: { type: String, require: true },
    cupon: { type: String, require: true },
    estado: { type: String, require: true },
    direccion: { type: Schema.ObjectId, ref: 'Direccion', require: true },
    nota: { type: String, require: true },
    createdAt: { type: Date, default: Date.now, require: true }
}, { collection: 'venta' });

VentaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Venta', VentaSchema);