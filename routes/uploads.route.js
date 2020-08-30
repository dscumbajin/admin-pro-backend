/*
    ruta: api/uploads/
*/

const { Router } = require('express');
const expressfileUpload = require('express-fileupload');
const { validarJWT } = require('../middleware/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads.controller');

const router = Router();

router.use(expressfileUpload());

router.put('/:tipo/:id', [validarJWT], fileUpload);
router.get('/:tipo/:foto', retornaImagen);


module.exports = router;