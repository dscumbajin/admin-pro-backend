const { request, response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req = request, res = response, next) => {

    //Leer el token
    const token = req.header('x-token');

    // Validar existencia del  token
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token el la petición'
        });
    }
    // Verificar JWT
    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();

    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT,
}