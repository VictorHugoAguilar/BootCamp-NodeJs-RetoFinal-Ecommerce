'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClienteSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    apellidos: {
        type: String,
        require: true
    },
    pais: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    perfil: {
        type: String,
        default: 'perfil.png',
        require: false
    },
    telefono: {
        type: String,
        require: false
    },
    genero: {
        type: String,
        require: false
    },
    f_nacimiento: {
        type: String,
        require: false
    },
    documento: {
        type: String,
        require: false
    },
});

module.exports = mongoose.model('Cliente', ClienteSchema);