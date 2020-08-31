/* 
    Ruta: /api/medicos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos.controller');

const router = Router();

router.get('/', getMedicos);

//Uso de Middleware check
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser válido').isMongoId(),
    validarCampos
], crearMedico);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser válido').isMongoId(),
    validarCampos
], actualizarMedico);

router.delete('/:id', borrarMedico);

module.exports = router;