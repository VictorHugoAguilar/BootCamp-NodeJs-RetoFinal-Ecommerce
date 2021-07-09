const jwt = require('jsonwebtoken');
const moment = require('moment');

/**
 * generateJWT
 * @param {*} uid 
 * @returns 
 */
const generateJWT = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            sub: user._id,
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            rol: user.rol ? user.rol : 'user',
            iat: moment().unix(),
            exp: moment().add(7, 'days').unix()
        }
        jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
};

module.exports = {
    generateJWT
}