const { response } = require('express');
const { validationResult } = require('express-validator');

/**
 * validarCampos
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validarCampos = (req, res = response, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errores.mapped()
        });
    }
    next();
};

module.exports = { validarCampos }