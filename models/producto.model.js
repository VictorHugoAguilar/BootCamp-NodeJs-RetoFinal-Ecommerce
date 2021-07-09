'use strict'
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    titulo: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    galeria: [{
        type: String,
        require: false
    }],
    portada: {
        type: String,
        require: false
    },
    precio: {
        type: Number,
        require: false
    },
    descripcion: {
        type: String,
        require: false
    },
    contenido: {
        type: String,
        require: false
    },
    stock: {
        type: Number,
        require: false
    },
    nventas: {
        type: Number,
        default: 0,
        require: true
    },
    npuntos: {
        type: Number,
        default: 0,
        require: true
    },
    categoria: {
        type: String,
        require: false
    },
    estado: {
        type: String,
        default: 'edicion',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }
}, { collection: 'producto' });

ProductoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Producto', ClienteSchema);