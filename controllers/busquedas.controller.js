const { request, response } = require("express");
const Usuario = require('../models/usuario.model');
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');

const getTodo = async(req = request, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    try {

        const [usuarios, hospitales, medicos] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Hospital.find({ nombre: regex }),
            Medico.find({ nombre: regex })
        ]);

        res.json({
            ok: true,
            usuarios: usuarios,
            hospitales: hospitales,
            medicos: medicos
        });

    } catch (error) {
        console.warn(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }

}

const getDocumentosColeccion = async(req = request, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    let data = [];

    try {

        switch (tabla) {
            case 'medicos':
                data = await Medico.find({ nombre: regex })
                    .populate('usuario', 'nombre img')
                    .populate('hospital', 'nombre img');
                break;
            case 'hospitales':
                data = await Hospital.find({ nombre: regex })
                    .populate('usuario', 'nombre img');
                break;
            case 'usuarios':
                data = await Usuario.find({ nombre: regex });
                break;

            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'La tabla tiene que ser medicos/usuarios/hospitales'
                });

        }
        res.json({
            ok: true,
            resusltado: data
        });

    } catch (error) {
        console.warn(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }

}


// Exportacion del modulo
module.exports = {
    getTodo,
    getDocumentosColeccion
}