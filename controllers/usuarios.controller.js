const { request, response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req = request, res = response) => {

    const desde = Number(req.query.desde) || 0;

    try {
        const [usuarios, total] = await Promise.all([
            Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),

            Usuario.countDocuments()
        ]);

        res.json({
            ok: true,
            usuarios: usuarios,
            total: total
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}

const crearUsuario = async(req = request, res = response) => {

    const { email, password, nombre } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta regsitrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar en la base de datos
        await usuario.save();

        // Generar el Token - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario: usuario,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarUsuario = async(req = request, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto 
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: true,
                msg: 'No existe el usuario por ese id'
            });
        }

        // Actualizaciones con desestructuracion de strings {password, google, ...campos}
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email: email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        req.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const borrarUsuario = async(req = request, res = response) => {
    const uid = req.params.id;
    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: true,
                msg: 'No existe el usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

// Exportacion del modulo
module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}