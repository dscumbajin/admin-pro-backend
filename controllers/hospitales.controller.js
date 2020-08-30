const { request, response } = require("express");
const Hospital = require('../models/hospital.model');


const getHospitales = async(req = request, res = response) => {


    try {
        const hospitales = await Hospital.find()
            .populate('usuario', 'nombre img');
        res.json({
            ok: true,
            hospitales: hospitales
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}

const crearHospital = async(req = request, res = response) => {

    const uid = req.uid;
    const { nombre } = req.body;

    try {

        const existeNombre = await Hospital.findOne({ nombre: nombre });
        if (existeNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital ya existe'
            });
        }

        const hospital = new Hospital({
            usuario: uid,
            ...req.body
        });

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}

const actualizarHospital = (req = request, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarHospital'
    });
}

const borrarHospital = (req = request, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarHospital'
    });
}
module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital

}