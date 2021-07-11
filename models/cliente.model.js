'use strict'
const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({
    nombre: { type: String, require: true },
    apellidos: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    pais: { type: String, require: false },
    perfil: { type: String, default: 'perfil.png', require: false },
    telefono: { type: String, require: false },
    genero: { type: String, require: false },
    f_nacimiento: { type: String, require: false },
    documento: { type: String, require: false },
    createdAt: { type: Date, default: Date.now, require: true }
});

ClienteSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Cliente', ClienteSchema);