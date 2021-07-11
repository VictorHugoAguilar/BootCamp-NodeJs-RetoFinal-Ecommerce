'use strict'
const { Schema, model } = require('mongoose');

const DventaSchema = Schema({
    producto: { type: Schema.ObjectId, ref: 'Producto', require: true },
    venta: { type: Schema.ObjectId, ref: 'Venta', require: true },
    cliente: { type: Schema.ObjectId, ref: 'Cliente', require: true },
    subtotal: { type: Number, require: true },
    veriedad: { type: String, require: true },
    cantidad: { type: Number, require: true },
    createdAt: { type: Date, default: Date.now, require: true }
}, { collection: 'dventa' });

DventaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Dventa', DventaSchema);