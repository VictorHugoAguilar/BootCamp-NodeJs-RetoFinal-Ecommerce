'use strict'
const { Schema, model } = require('mongoose');

const DireccionSchema = Schema({
    cliente: { type: Object, ref: 'Cliente', require: true },
    destinatario: { type: String, require: true },
    documento: { type: String, require: true },
    codigopostal: { type: String, require: true },
    direccion: { type: String, require: true },
    localidad: { type: String, require: true },
    provincia: { type: String, require: true },
    pais: { type: String, require: true },
    telefono: { type: String, require: true },
    principal: { type: Boolean, require: true },
    createdAt: { type: Date, default: Date.now, require: true }
}, { collection: 'direccion' });

DireccionSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Direccion', DireccionSchema);