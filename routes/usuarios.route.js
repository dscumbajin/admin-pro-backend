/* 
    Ruta: /api/usuarios 
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, getUsuarioById } = require('../controllers/usuarios.controller');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

//Uso de Middleware check
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    crearUsuario);

router.put('/:id', [
        validarJWT,
        validarADMIN_ROLE_o_MismoUsuario,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarUsuario);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], borrarUsuario);

router.get('/:id', validarJWT, getUsuarioById);

module.exports = router;