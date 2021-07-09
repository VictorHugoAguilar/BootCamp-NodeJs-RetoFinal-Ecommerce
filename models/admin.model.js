'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    apellidos: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    telefono: {
        type: String,
        require: false
    },
    documento: {
        type: String,
        require: false
    },
    rol: {
        type: String,
        require: false,
        default: 'admin'
    }
}, { collection: 'admin' });

module.exports = mongoose.model('Admin', AdminSchema);