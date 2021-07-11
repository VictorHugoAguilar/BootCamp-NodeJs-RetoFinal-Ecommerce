'use strict'
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    titulo: { type: String, require: true },
    slug: { type: String, require: false },
    galeria: [{ type: Object, require: false }],
    portada: { type: String, require: false },
    precio: { type: Number, require: true },
    descripcion: { type: String, require: true },
    contenido: { type: String, require: true },
    stock: { type: Number, require: false },
    nventas: { type: Number, default: 0, require: true },
    npuntos: { type: Number, default: 0, require: true },
    categoria: { type: String, require: false },
    estado: { type: String, default: 'edicion', require: true },
    variedad: [{ type: Object, require: false }],
    titulo_variedad: { type: String, require: false },
    createdAt: { type: Date, default: Date.now, require: true }
}, { collection: 'producto' });

ProductoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Producto', ProductoSchema);