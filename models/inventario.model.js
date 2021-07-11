'use strict'
const { Schema, model } = require('mongoose');

const InventarioSchema = Schema({
    producto: { type: Schema.ObjectId, ref: 'Producto', require: true },
    cantidad: { type: Number, require: true },
    admin: { type: Schema.ObjectId, ref: 'Admin', require: true },
    proveedor: { type: String, require: true },
    createdAt: { type: Date, default: Date.now, require: true }
}, { collection: 'inventario' });

InventarioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Inventario', InventarioSchema);