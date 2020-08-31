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

const actualizarHospital = async(req = request, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}

const borrarHospital = async(req = request, res = response) => {

    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}
module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital

}