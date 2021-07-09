'use strict'
const { Schema, model } = require('mongoose');

const CuponesSchema = Schema({
    codigo: {
        type: String,
        require: true
    },
    tipo: {
        type: String,
        require: true
    },
    valor: [{
        type: Number,
        require: true
    }],
    limite: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }
}, { collection: 'cupones' });

CuponesSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Cupones', CuponesSchema);