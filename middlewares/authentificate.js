'use strict'
const jwtSimple = require('jwt-simple');
const moment = require('moment');
const secret = process.env.JWT_SECRET;


const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ ok: false, message: 'No token válido' });
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');
    const segment = token.split(".");

    if (segment.length != 3) {
        return res.status(403).json({ ok: false, message: 'No token válido' });
    }

    let payload;
    try {
        //Comprobamos que el token coincide
        payload = jwtSimple.decode(token, secret);

        //Comprobamos que el token no ha expirado 
        if (payload.exp <= moment.unix()) {
            return res.status(401).send({ ok: false, message: 'Tu conexión ha expirado. Vuelve a hacer login.' });
        }
    } catch (e) {
        return res.status(500).send({ ok: false, message: "Ha ocurrido un error: (ensureAuth) - " + e.message });
    }
    //asignamos el payload el usuario de la peticion
    req.user = payload;
    //Usamos next() para seguir el curso de la aplicación
    next();
}

module.exports = auth;