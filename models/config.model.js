'use strict'
const { Schema, model } = require('mongoose');

const ConfigSchema = Schema({
    categorias: [{ type: Object, require: true }],
    titulo: { type: String, require: true },
    logo: { type: String, require: true },
    serie: { type: String, require: true },
    correlativo: { type: String, require: true },
    createdAt: { type: Date, default: Date.now, require: true }
}, { collection: 'config' });

ConfigSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Config', ConfigSchema);