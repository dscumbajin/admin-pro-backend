const { request, response } = require("express");
const Medico = require('../models/medico.model');


const getMedicos = async(req = request, res = response) => {

    const desde = Number(req.query.desde) || 0;
    try {

        const [medicos, total] = await Promise.all([
            Medico.find()
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img').skip(desde).limit(5),

            Medico.countDocuments()
        ]);


        res.json({
            ok: true,
            medicos: medicos,
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

const crearMedico = async(req = request, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });
    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}

const actualizarMedico = async(req = request, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado por id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}

const borrarMedico = async(req = request, res = response) => {

    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}

const getMedicoById = async(req = request, res = response) => {
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico: medico
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById

}