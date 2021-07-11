'use strict'
const { Schema, model } = require('mongoose');

const VentaSchema = Schema({
    cliente: { type: Schema.ObjectId, ref: 'Cliente', require: true },
    nventa: { type: String, require: false },
    subtotal: { type: Number, require: true },
    envio_titulo: { type: String, require: true },
    envio_precio: { type: Number, require: false },
    transaccion: { type: String, require: true },
    cupon: { type: String, require: false },
    estado: { type: String, require: true },
    direccion: { type: Schema.ObjectId, ref: 'Direccion', require: true },
    nota: { type: String, require: false },
    createdAt: { type: Date, default: Date.now, require: true }
}, { collection: 'venta' });

VentaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Venta', VentaSchema);