/*
    ruta: api/todo/:busqueda
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas.controller');
const router = Router();

router.get('/:busqueda', [validarJWT], getTodo);
router.get('/coleccion/:tabla/:busqueda', [validarJWT], getDocumentosColeccion);

module.exports = router;