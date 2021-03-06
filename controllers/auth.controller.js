const { response, request } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require("../helpers/menu-frontend");

const login = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email: email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Verificar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        // Generar el Token - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token: token,
            menu: getMenuFrontend(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}

const googleSingIn = async(req = request, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            // Si no existe usuario
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }
        // Guardar en la base de datos
        await usuario.save();

        // Generar el Token - JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            msg: 'Google SingIn',
            token: token,
            menu: getMenuFrontend(usuario.role)
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
    }


}

const renewToken = async(req = request, res = response) => {
    const uid = req.uid;
    // Generar el Token - JWT
    const token = await generarJWT(uid);
    // Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token: token,
        usuario: usuario,
        menu: getMenuFrontend(usuario.role)
    });

}

module.exports = {
    login,
    googleSingIn,
    renewToken
}