const { request, response } = require("express");
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario.model');

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

const validarADMIN_ROLE = async(req = request, res = response, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msq: 'Hable con el administrador'
        });

    }
}

const validarADMIN_ROLE_o_MismoUsuario = async(req = request, res = response, next) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
            next();

        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msq: 'Hable con el administrador'
        });

    }
}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}