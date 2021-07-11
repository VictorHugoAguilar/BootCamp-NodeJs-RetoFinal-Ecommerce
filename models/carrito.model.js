'use strict'
const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({
    cliente: { type: Schema.ObjectId, ref: 'Cliente', require: true },
    producto: { type: Schema.ObjectId, ref: 'Producto', require: true },
    cantidad: { type: Number, require: true },
    variedad: { type: String, require: true },
    createdAt: { type: Date, default: Date.now, require: true }
}, { collection: 'carrito' });

CarritoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Carrito', CarritoSchema);